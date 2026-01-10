import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

import { User, Session, RefreshToken } from '@ithalamed/database';
import {
  UserStatus,
  AuditAction,
  OtpPurpose,
  MfaMethod,
  validatePassword,
  validatePhoneNumber,
  generateSecureToken,
  hash,
  encrypt,
  decrypt,
} from '@ithalamed/common';

import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  SetPinDto,
  EnableMfaDto,
  VerifyMfaSetupDto,
  VerifyMfaDto,
  DisableMfaDto,
  LoginResponseDto,
  RegisterResponseDto,
  TokensResponseDto,
  UserResponseDto,
  MfaRequiredResponseDto,
  MfaSetupResponseDto,
  DeviceInfoDto,
} from './dto';
import { JwtPayload, JwtRefreshPayload, MfaTokenPayload } from './interfaces';
import { AuditService } from '../audit/audit. service';
import { OtpService } from '../otp/otp.service';
import { SessionService } from '../session/session. service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService. name);
  private readonly bcryptRounds:  number;
  private readonly maxLoginAttempts: number;
  private readonly lockoutDurationMinutes: number;
  private readonly encryptionKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository:  Repository<RefreshToken>,
    private readonly auditService: AuditService,
    private readonly otpService: OtpService,
    private readonly sessionService: SessionService,
  ) {
    this.bcryptRounds = this.configService.get<number>('auth.bcryptRounds') || 12;
    this.maxLoginAttempts = this.configService. get<number>('auth.maxLoginAttempts') || 5;
    this.lockoutDurationMinutes = this.configService.get<number>('auth. lockoutDurationMinutes') || 30;
    this.encryptionKey = this.configService.get<string>('auth.encryption.key')!;
  }

  // ==================== REGISTRATION ====================

  /**
   * Register new user
   * Implements FR-PAT-001 (Registration Flow)
   */
  async register(
    dto: RegisterDto,
    ipAddress?:  string,
    userAgent?: string,
  ): Promise<RegisterResponseDto> {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      userType,
      preferredLanguage,
      termsAccepted,
      privacyAccepted,
    } = dto;

    // Validate terms acceptance
    if (!termsAccepted || !privacyAccepted) {
      throw new BadRequestException(
        'You must accept the terms of service and privacy policy',
      );
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      throw new BadRequestException(phoneValidation.errorMessage);
    }
    const normalizedPhone = phoneValidation.normalized! ;

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException(passwordValidation.errors);
    }

    // Check for existing user
    const existingUser = await this.userRepository.findOne({
      where: [
        { phoneNumber: normalizedPhone },
        .. .(email ? [{ email: email.toLowerCase() }] : []),
      ],
    });

    if (existingUser) {
      if (existingUser.phoneNumber === normalizedPhone) {
        throw new ConflictException('Phone number already registered');
      }
      if (email && existingUser.email === email.toLowerCase()) {
        throw new ConflictException('Email already registered');
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, this. bcryptRounds);

    // Create user
    const user = this.userRepository.create({
      firstName,
      lastName,
      phoneNumber:  normalizedPhone,
      email:  email?.toLowerCase() || null,
      passwordHash,
      userType,
      preferredLanguage:  preferredLanguage || 'en',
      status: UserStatus. PENDING_VERIFICATION,
      termsAccepted:  true,
      termsAcceptedAt: new Date(),
      privacyAccepted: true,
      privacyAcceptedAt: new Date(),
    });

    const savedUser = await this.userRepository. save(user);

    // Audit log
    await this.auditService.log({
      action: AuditAction.USER_REGISTERED,
      userId: savedUser.id,
      userType: savedUser.userType,
      resourceType: 'user',
      resourceId: savedUser.id,
      ipAddress,
      userAgent,
      success: true,
      newState: {
        phoneNumber: normalizedPhone,
        email: email?.toLowerCase(),
        userType,
      },
    });

    // Send phone verification OTP
    await this.otpService.sendOtp({
      identifier: normalizedPhone,
      purpose: OtpPurpose.PHONE_VERIFICATION,
      userId: savedUser.id,
      ipAddress,
      userAgent,
    });

    // Send email verification if email provided
    if (email) {
      await this.otpService. sendOtp({
        identifier:  email. toLowerCase(),
        purpose: OtpPurpose.EMAIL_VERIFICATION,
        userId: savedUser.id,
        ipAddress,
        userAgent,
        deliveryMethod: 'email',
      });
    }

    return {
      user: this.mapUserToResponse(savedUser),
      message: 'Registration successful. Please verify your phone number.',
      requiresPhoneVerification: true,
      requiresEmailVerification: !!email,
    };
  }

  // ==================== LOGIN ====================

  /**
   * Validate user credentials
   */
  async validateUser(identifier: string, password: string): Promise<User | null> {
    // Find user by email or phone
    const user = await this.findUserByIdentifier(identifier);

    if (!user) {
      return null;
    }

    // Check if account is locked
    if (user. isLocked()) {
      throw new UnauthorizedException(
        `Account is locked. Please try again after ${user.lockedUntil?. toISOString()}`,
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user. passwordHash);

    if (!isPasswordValid) {
      await this.handleFailedLogin(user);
      return null;
    }

    // Reset failed attempts on successful validation
    if (user.failedLoginAttempts > 0) {
      await this.userRepository.update(user.id, {
        failedLoginAttempts: 0,
        lastFailedLoginAt: null,
      });
    }

    return user;
  }

  /**
   * Login user
   * Implements FR-PAT-001 (Multi-method authentication)
   */
  async login(
    user: User,
    dto: LoginDto,
    ipAddress?: string,
    userAgent?:  string,
  ): Promise<LoginResponseDto | MfaRequiredResponseDto> {
    // Check if user requires verification
    if (user.status === UserStatus.PENDING_VERIFICATION) {
      throw new UnauthorizedException(
        'Account not verified. Please verify your phone number first.',
      );
    }

    // Check if user is active
    if (!user.isActive()) {
      throw new UnauthorizedException('Account is not active');
    }

    // Check if MFA is enabled
    if (user.mfaEnabled) {
      // Return MFA required response
      const mfaToken = await this.generateMfaToken(user);

      await this.auditService.log({
        action: AuditAction.USER_LOGIN,
        userId: user.id,
        userType: user.userType,
        resourceType: 'user',
        resourceId: user.id,
        ipAddress,
        userAgent,
        success: true,
        metadata: { mfaRequired: true },
      });

      return {
        success: false,
        mfaRequired: true,
        mfaToken,
        mfaMethod: user.mfaMethod || 'totp',
        userId: user.id,
      };
    }

    // Create session and generate tokens
    return this.completeLogin(user, dto. deviceInfo, ipAddress, userAgent);
  }

  /**
   * Complete login (after MFA verification if required)
   */
  async completeLogin(
    user:  User,
    deviceInfo?:  DeviceInfoDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginResponseDto> {
    // Create session
    const session = await this.sessionService.createSession(
      user,
      deviceInfo,
      ipAddress,
      userAgent,
    );

    // Generate tokens
    const tokens = await this.generateTokens(user, session);

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
      lastLoginIp:  ipAddress,
    });

    // Audit log
    await this.auditService. log({
      action: AuditAction.USER_LOGIN,
      userId: user.id,
      userType: user.userType,
      resourceType: 'user',
      resourceId: user.id,
      ipAddress,
      userAgent,
      sessionId: session.id,
      success: true,
    });

    return {
      user: this.mapUserToResponse(user),
      tokens,
      sessionId: session.id,
    };
  }

  /**
   * Login with PIN
   */
  async loginWithPin(
    userId: string,
    pin: string,
    deviceInfo?: DeviceInfoDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginResponseDto> {
    const user = await this.userRepository. findOne({
      where: { id: userId },
    });

    if (!user || !user.pinHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (! user.isActive()) {
      throw new UnauthorizedException('Account is not active');
    }

    const isPinValid = await bcrypt.compare(pin, user.pinHash);

    if (!isPinValid) {
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('Invalid PIN');
    }

    // Reset failed attempts
    if (user.failedLoginAttempts > 0) {
      await this.userRepository.update(user.id, {
        failedLoginAttempts: 0,
      });
    }

    return this.completeLogin(user, deviceInfo, ipAddress, userAgent);
  }

  // ==================== TOKEN MANAGEMENT ====================

  /**
   * Generate access and refresh tokens
   */
  async generateTokens(user: User, session: Session): Promise<TokensResponseDto> {
    // Access token payload
    const accessPayload:  JwtPayload = {
      sub: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      sessionId: session.id,
    };

    // Generate access token
    const accessToken = this.jwtService.sign(accessPayload, {
      secret:  this.configService.get<string>('jwt.access.secret'),
      expiresIn: this.configService.get<string>('jwt.access. expiresIn'),
    });

    // Create refresh token record
    const tokenFamilyId = uuidv4();
    const refreshTokenRecord = this.refreshTokenRepository.create({
      userId: user.id,
      token: hash(generateSecureToken(64)),
      familyId: tokenFamilyId,
      sessionId: session.id,
      expiresAt: this.calculateRefreshTokenExpiry(),
    });

    await this.refreshTokenRepository.save(refreshTokenRecord);

    // Refresh token payload
    const refreshPayload: JwtRefreshPayload = {
      sub: user.id,
      tokenId: refreshTokenRecord.id,
      familyId: tokenFamilyId,
    };

    // Generate refresh token
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this. configService.get<string>('jwt.refresh.secret'),
      expiresIn: this.configService.get<string>('jwt.refresh.expiresIn'),
    });

    // Calculate expiry in seconds
    const expiresIn = this.getExpiresInSeconds(
      this.configService.get<string>('jwt.access.expiresIn') || '15m',
    );

    return {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer',
    };
  }

  /**
   * Refresh tokens
   */
  async refreshTokens(
    user: User,
    oldRefreshToken: RefreshToken,
    ipAddress?:  string,
    userAgent?: string,
  ): Promise<TokensResponseDto> {
    // Revoke old refresh token
    await this.refreshTokenRepository.update(oldRefreshToken.id, {
      isRevoked: true,
      revokedAt: new Date(),
      revocationReason: 'token_rotated',
    });

    // Get or create session
    let session = oldRefreshToken.sessionId
      ? await this.sessionService.findById(oldRefreshToken.sessionId)
      : null;

    if (!session || !session.isValid()) {
      session = await this. sessionService.createSession(
        user,
        undefined,
        ipAddress,
        userAgent,
      );
    }

    // Create new refresh token (rotation)
    const newRefreshTokenRecord = this.refreshTokenRepository. create({
      userId: user. id,
      token: hash(generateSecureToken(64)),
      familyId: oldRefreshToken.familyId,
      sessionId: session.id,
      expiresAt:  this.calculateRefreshTokenExpiry(),
      ipAddress,
      userAgent,
    });

    await this.refreshTokenRepository.save(newRefreshTokenRecord);

    // Update old token with reference to new one
    await this.refreshTokenRepository.update(oldRefreshToken. id, {
      replacedBy: newRefreshTokenRecord.id,
    });

    // Generate new access token
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      phoneNumber: user. phoneNumber,
      userType:  user.userType,
      sessionId: session.id,
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      secret:  this.configService.get<string>('jwt.access.secret'),
      expiresIn: this.configService.get<string>('jwt.access.expiresIn'),
    });

    // Generate new refresh token
    const refreshPayload: JwtRefreshPayload = {
      sub: user.id,
      tokenId: newRefreshTokenRecord.id,
      familyId: oldRefreshToken.familyId,
    };

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get<string>('jwt.refresh.secret'),
      expiresIn: this.configService.get<string>('jwt.refresh.expiresIn'),
    });

    // Audit log
    await this.auditService.log({
      action: AuditAction.TOKEN_REFRESHED,
      userId: user. id,
      userType: user.userType,
      resourceType: 'refresh_token',
      resourceId:  newRefreshTokenRecord.id,
      ipAddress,
      userAgent,
      sessionId: session.id,
      success: true,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn:  this.getExpiresInSeconds(
        this.configService. get<string>('jwt.access.expiresIn') || '15m',
      ),
      tokenType: 'Bearer',
    };
  }

  // ==================== LOGOUT ====================

  /**
   * Logout user (revoke current session)
   */
  async logout(
    user: User,
    sessionId: string,
    ipAddress?: string,
    userAgent?:  string,
  ): Promise<void> {
    // Terminate session
    await this.sessionService.terminateSession(sessionId, 'user_logout');

    // Revoke all refresh tokens for this session
    await this.refreshTokenRepository.update(
      { sessionId, isRevoked: false },
      { isRevoked:  true, revokedAt: new Date(), revocationReason: 'user_logout' },
    );

    // Audit log
    await this.auditService.log({
      action: AuditAction.USER_LOGOUT,
      userId: user.id,
      userType: user. userType,
      resourceType:  'session',
      resourceId: sessionId,
      ipAddress,
      userAgent,
      sessionId,
      success: true,
    });
  }

  /**
   * Logout from all devices
   */
  async logoutAll(
    user: User,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    // Terminate all sessions
    await this.sessionService.terminateAllUserSessions(user.id, 'logout_all');

    // Revoke all refresh tokens
    await this. refreshTokenRepository.update(
      { userId: user.id, isRevoked: false },
      { isRevoked: true, revokedAt: new Date(), revocationReason: 'logout_all' },
    );

    // Audit log
    await this. auditService.log({
      action: AuditAction.USER_LOGOUT,
      userId: user.id,
      userType: user.userType,
      resourceType: 'user',
      resourceId:  user.id,
      ipAddress,
      userAgent,
      success: true,
      metadata: { logoutAll: true },
    });
  }

  // ==================== PASSWORD MANAGEMENT ====================

  /**
   * Change password
   */
  async changePassword(
    user: User,
    dto: ChangePasswordDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const { currentPassword, newPassword } = dto;

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new BadRequestException(passwordValidation.errors);
    }

    // Check password is different from current
    const isSamePassword = await bcrypt. compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    // Hash and save new password
    const newPasswordHash = await bcrypt.hash(newPassword, this.bcryptRounds);

    await this.userRepository.update(user.id, {
      passwordHash: newPasswordHash,
      passwordChangedAt: new Date(),
    });

    // Invalidate all other sessions (optional security measure)
    // await this.logoutAll(user, ipAddress, userAgent);

    // Audit log
    await this.auditService.log({
      action: AuditAction.PASSWORD_CHANGED,
      userId:  user.id,
      userType: user.userType,
      resourceType: 'user',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });
  }

  /**
   * Request password reset
   */
  async forgotPassword(
    identifier: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const user = await this.findUserByIdentifier(identifier);

    if (!user) {
      // Don't reveal if user exists
      this.logger.log(`Password reset requested for non-existent user: ${identifier}`);
      return;
    }

    // Generate reset token
    const resetToken = generateSecureToken(32);
    const resetTokenHash = hash(resetToken);

    // Save reset token (expires in 1 hour)
    await this.userRepository.update(user.id, {
      passwordResetToken: resetTokenHash,
      passwordResetExpires:  new Date(Date.now() + 60 * 60 * 1000),
    });

    // Send OTP for password reset
    const deliveryMethod = user.email ? 'email' : 'sms';
    const deliveryIdentifier = user.email || user.phoneNumber;

    await this.otpService. sendOtp({
      identifier:  deliveryIdentifier,
      purpose: OtpPurpose. PASSWORD_RESET,
      userId: user.id,
      ipAddress,
      userAgent,
      deliveryMethod,
    });

    // Audit log
    await this.auditService. log({
      action: AuditAction.PASSWORD_RESET_REQUESTED,
      userId: user. id,
      userType: user.userType,
      resourceType: 'user',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    newPassword:  string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const tokenHash = hash(token);

    const user = await this.userRepository. findOne({
      where: { passwordResetToken: tokenHash },
    });

    if (!user || !user.isPasswordResetValid()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new BadRequestException(passwordValidation.errors);
    }

    // Hash and save new password
    const newPasswordHash = await bcrypt.hash(newPassword, this.bcryptRounds);

    await this.userRepository.update(user.id, {
      passwordHash: newPasswordHash,
      passwordChangedAt: new Date(),
      passwordResetToken: null,
      passwordResetExpires: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
    });

    // Invalidate all sessions
    await this.sessionService.terminateAllUserSessions(user. id, 'password_reset');
    await this.refreshTokenRepository.update(
      { userId: user.id, isRevoked: false },
      { isRevoked: true, revokedAt: new Date(), revocationReason: 'password_reset' },
    );

    // Audit log
    await this.auditService.log({
      action: AuditAction.PASSWORD_RESET_COMPLETED,
      userId: user.id,
      userType: user. userType,
      resourceType:  'user',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });
  }

  // ==================== PIN MANAGEMENT ====================

  /**
   * Set PIN for quick access
   */
  async setPin(
    user: User,
    dto: SetPinDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const { password, pin } = dto;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Hash and save PIN
    const pinHash = await bcrypt.hash(pin, this.bcryptRounds);

    await this.userRepository. update(user.id, {
      pinHash,
      pinSetAt: new Date(),
    });

    // Audit log
    await this.auditService. log({
      action: AuditAction.PASSWORD_CHANGED, // Reusing for PIN
      userId: user.id,
      userType: user.userType,
      resourceType: 'user',
      resourceId:  user.id,
      ipAddress,
      userAgent,
      success: true,
      metadata: { type: 'pin_set' },
    });
  }

  // ==================== MFA MANAGEMENT ====================

  /**
   * Enable MFA
   * Implements FR-PAT-002 (Two-factor authentication)
   */
  async enableMfa(
    user:  User,
    dto: EnableMfaDto,
    ipAddress?: string,
    userAgent?:  string,
  ): Promise<MfaSetupResponseDto> {
    const { method, password } = dto;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (user.mfaEnabled) {
      throw new BadRequestException('MFA is already enabled');
    }

    if (method !== MfaMethod.TOTP) {
      throw new BadRequestException('Only TOTP method is currently supported');
    }

    // Generate TOTP secret
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email || user.phoneNumber,
      'IthalaMed',
      secret,
    );

    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpAuthUrl);

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () =>
      generateSecureToken(4).toUpperCase(),
    );

    // Encrypt and store secret (temporary until verified)
    const encryptedSecret = encrypt(secret, this.encryptionKey);
    const encryptedBackupCodes = encrypt(
      JSON.stringify(backupCodes),
      this.encryptionKey,
    );

    await this.userRepository.update(user.id, {
      totpSecret: encryptedSecret,
      mfaBackupCodes: encryptedBackupCodes,
      mfaMethod: MfaMethod.TOTP,
    });

    return {
      secret,
      qrCode,
      backupCodes,
    };
  }

  /**
   * Verify MFA setup
   */
  async verifyMfaSetup(
    user: User,
    dto: VerifyMfaSetupDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const { code } = dto;

    if (!user.totpSecret) {
      throw new BadRequestException('MFA setup not initiated');
    }

    // Decrypt secret
    const secret = decrypt(user.totpSecret, this.encryptionKey);

    // Verify TOTP code
    const isValid = authenticator.verify({ token: code, secret });

    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    // Enable MFA
    await this.userRepository.update(user.id, {
      mfaEnabled:  true,
    });

    // Audit log
    await this.auditService. log({
      action: AuditAction.MFA_ENABLED,
      userId: user.id,
      userType: user. userType,
      resourceType:  'user',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });
  }

  /**
   * Verify MFA during login
   */
  async verifyMfa(
    dto: VerifyMfaDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginResponseDto> {
    const { mfaToken, code, isBackupCode } = dto;

    // Verify MFA token
    let payload:  MfaTokenPayload;
    try {
      payload = this.jwtService.verify(mfaToken, {
        secret: this.configService.get<string>('jwt.access.secret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired MFA token');
    }

    if (payload.purpose !== 'mfa_verification') {
      throw new UnauthorizedException('Invalid MFA token');
    }

    const user = await this.userRepository. findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.mfaEnabled || !user.totpSecret) {
      throw new UnauthorizedException('MFA not configured');
    }

    let isValid = false;

    if (isBackupCode) {
      // Verify backup code
      isValid = await this.verifyBackupCode(user, code);
    } else {
      // Verify TOTP code
      const secret = decrypt(user.totpSecret, this.encryptionKey);
      isValid = authenticator. verify({ token: code, secret });
    }

    if (!isValid) {
      await this.auditService.log({
        action: AuditAction.MFA_FAILED,
        userId: user.id,
        userType: user. userType,
        resourceType:  'user',
        resourceId: user.id,
        ipAddress,
        userAgent,
        success: false,
        errorMessage: 'Invalid MFA code',
      });

      throw new UnauthorizedException('Invalid MFA code');
    }

    // Audit log
    await this.auditService.log({
      action: AuditAction.MFA_VERIFIED,
      userId: user.id,
      userType: user.userType,
      resourceType: 'user',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });

    // Complete login
    return this.completeLogin(user, undefined, ipAddress, userAgent);
  }

  /**
   * Disable MFA
   */
  async disableMfa(
    user: User,
    dto: DisableMfaDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const { password, code } = dto;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.mfaEnabled || !user.totpSecret) {
      throw new BadRequestException('MFA is not enabled');
    }

    // Verify TOTP code
    const secret = decrypt(user.totpSecret, this.encryptionKey);
    const isValid = authenticator. verify({ token: code, secret });

    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    // Disable MFA
    await this.userRepository.update(user.id, {
      mfaEnabled: false,
      mfaMethod: null,
      totpSecret: null,
      mfaBackupCodes:  null,
    });

    // Audit log
    await this. auditService.log({
      action: AuditAction.MFA_DISABLED,
      userId: user.id,
      userType: user.userType,
      resourceType: 'user',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });
  }

  // ==================== VERIFICATION ====================

  /**
   * Verify phone number
   */
  async verifyPhone(
    userId: string,
    code: string,
    ipAddress?:  string,
    userAgent?: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify OTP
    await this.otpService.verifyOtp({
      identifier: user.phoneNumber,
      code,
      purpose: OtpPurpose. PHONE_VERIFICATION,
    });

    // Mark phone as verified
    await this.userRepository.update(user.id, {
      phoneVerified: true,
      phoneVerifiedAt:  new Date(),
      status: 
        user.status === UserStatus.PENDING_VERIFICATION
          ? UserStatus.ACTIVE
          : user.status,
    });

    // Audit log
    await this.auditService.log({
      action: AuditAction. OTP_VERIFIED,
      userId: user.id,
      userType: user.userType,
      resourceType: 'user',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
      metadata: { type: 'phone_verification' },
    });
  }

  /**
   * Verify email
   */
  async verifyEmail(
    userId: string,
    code: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const user = await this. userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.email) {
      throw new BadRequestException('User not found or no email registered');
    }

    // Verify OTP
    await this. otpService.verifyOtp({
      identifier: user.email,
      code,
      purpose: OtpPurpose. EMAIL_VERIFICATION,
    });

    // Mark email as verified
    await this.userRepository.update(user.id, {
      emailVerified: true,
      emailVerifiedAt: new Date(),
    });

    // Audit log
    await this.auditService. log({
      action: AuditAction.OTP_VERIFIED,
      userId: user.id,
      userType: user. userType,
      resourceType:  'user',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
      metadata: { type: 'email_verification' },
    });
  }

  // ==================== HELPER METHODS ====================

  /**
   * Find user by email or phone number
   */
  private async findUserByIdentifier(identifier: string): Promise<User | null> {
    // Check if identifier looks like email
    const isEmail = identifier.includes('@');

    if (isEmail) {
      return this.userRepository.findOne({
        where: { email: identifier. toLowerCase() },
      });
    }

    // Try to normalize phone number
    const phoneValidation = validatePhoneNumber(identifier);
    const normalizedPhone = phoneValidation.isValid
      ? phoneValidation.normalized
      : identifier;

    return this.userRepository.findOne({
      where: { phoneNumber: normalizedPhone },
    });
  }

  /**
   * Handle failed login attempt
   */
  private async handleFailedLogin(user: User): Promise<void> {
    const failedAttempts = user. failedLoginAttempts + 1;
    const updateData:  Partial<User> = {
      failedLoginAttempts:  failedAttempts,
      lastFailedLoginAt: new Date(),
    };

    // Lock account if max attempts exceeded
    if (failedAttempts >= this.maxLoginAttempts) {
      updateData.lockedUntil = new Date(
        Date.now() + this.lockoutDurationMinutes * 60 * 1000,
      );

      await this.auditService.log({
        action: AuditAction.USER_LOCKED,
        userId:  user.id,
        userType: user.userType,
        resourceType: 'user',
        resourceId: user.id,
        success: true,
        metadata: { failedAttempts, lockoutMinutes: this.lockoutDurationMinutes },
      });
    }

    await this.userRepository.update(user.id, updateData);

    await this.auditService.log({
      action: AuditAction.USER_LOGIN_FAILED,
      userId:  user.id,
      userType: user.userType,
      resourceType: 'user',
      resourceId: user.id,
      success: false,
      metadata: { failedAttempts },
    });
  }

  /**
   * Generate MFA token for verification
   */
  private async generateMfaToken(user:  User): Promise<string> {
    const payload:  MfaTokenPayload = {
      sub: user.id,
      purpose: 'mfa_verification',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.access.secret'),
      expiresIn: '5m', // MFA token valid for 5 minutes
    });
  }

  /**
   * Verify backup code
   */
  private async verifyBackupCode(user: User, code: string): Promise<boolean> {
    if (!user.mfaBackupCodes) {
      return false;
    }

    const backupCodes:  string[] = JSON.parse(
      decrypt(user.mfaBackupCodes, this.encryptionKey),
    );

    const codeIndex = backupCodes. indexOf(code. toUpperCase());

    if (codeIndex === -1) {
      return false;
    }

    // Remove used backup code
    backupCodes.splice(codeIndex, 1);

    await this.userRepository.update(user.id, {
      mfaBackupCodes: encrypt(JSON.stringify(backupCodes), this.encryptionKey),
    });

    return true;
  }

  /**
   * Calculate refresh token expiry
   */
  private calculateRefreshTokenExpiry(): Date {
    const expiresIn = this.configService.get<string>('jwt.refresh. expiresIn') || '7d';
    const seconds = this.getExpiresInSeconds(expiresIn);
    return new Date(Date. now() + seconds * 1000);
  }

  /**
   * Convert expiration string to seconds
   */
  private getExpiresInSeconds(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 900; // Default 15 minutes
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 900;
    }
  }

  /**
   * Map User entity to response DTO
   */
  private mapUserToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName || undefined,
      profilePhotoUrl: user.profilePhotoUrl || undefined,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      mfaEnabled: user.mfaEnabled,
      preferredLanguage: user.preferredLanguage,
      createdAt: user.createdAt,
    };
  }
}
