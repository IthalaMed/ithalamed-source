import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

// Import from centralized common package
import {
  JwtAuthGuard,
  CurrentUser,
  Public,
  AuthenticatedUser,
} from '@ithalamed/common';

// Import service
import { AuthService } from './auth.service';

// Import ALL DTOs from index
import {
  // Registration
  RegisterDto,
  // Login
  LoginDto,
  LoginWithPinDto,
  LoginWithBiometricDto,
  // OTP
  SendOtpDto,
  VerifyOtpDto,
  ResendOtpDto,
  // Token
  RefreshTokenDto,
  // Password
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  SetPinDto,
  // MFA
  EnableMfaDto,
  VerifyMfaSetupDto,
  VerifyMfaDto,
  DisableMfaDto,
  // Response DTOs
  LoginResponseDto,
  RegisterResponseDto,
  MfaRequiredResponseDto,
  MfaSetupResponseDto,
  TokensResponseDto,
  UserResponseDto,
  MessageResponseDto,
} from './dto';

@ApiTags('auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ==================== REGISTRATION ====================

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type:  RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 409, description: 'Conflict - user already exists' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
  ): Promise<RegisterResponseDto> {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.register(dto, ipAddress, userAgent);
  }

  // ==================== LOGIN ====================

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email/phone and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'MFA required',
    type: MfaRequiredResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto | MfaRequiredResponseDto> {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(dto, ipAddress, userAgent);
  }

  @Public()
  @Post('login/pin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with PIN' })
  @ApiBody({ type: LoginWithPinDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid PIN' })
  async loginWithPin(
    @Body() dto: LoginWithPinDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this. authService.loginWithPin(
      dto. userId,
      dto.pin,
      dto.deviceInfo,
      ipAddress,
      userAgent,
    );
  }

  @Public()
  @Post('login/biometric')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with biometric authentication' })
  @ApiBody({ type: LoginWithBiometricDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid biometric token' })
  async loginWithBiometric(
    @Body() dto: LoginWithBiometricDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.loginWithBiometric(
      dto.userId,
      dto.biometricToken,
      dto.deviceInfo,
      ipAddress,
      userAgent,
    );
  }

  // ==================== TOKEN MANAGEMENT ====================

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed',
    type: TokensResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshTokens(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
  ): Promise<TokensResponseDto> {
    const ipAddress = req.ip || req. socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.refreshTokens(dto. refreshToken, ipAddress, userAgent);
  }

  // ==================== LOGOUT ====================

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout current session' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await this.authService.logout(user.id, user.sessionId, ipAddress, userAgent);
    return { message:  'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout/all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiResponse({ status: 200, description: 'Logged out from all devices' })
  async logoutAll(
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const ipAddress = req.ip || req. socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await this.authService.logoutAll(user.id, ipAddress, userAgent);
    return { message: 'Logged out from all devices' };
  }

  // ==================== OTP VERIFICATION ====================

  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to phone or email' })
  @ApiBody({ type: SendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async sendOtp(
    @Body() dto: SendOtpDto,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const ipAddress = req.ip || req. socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await this.authService.sendOtp(dto, ipAddress, userAgent);
    return { message: 'OTP sent successfully' };
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await this.authService.verifyOtp(dto, ipAddress, userAgent);
    return { message:  'OTP verified successfully' };
  }

  @Public()
  @Post('otp/resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary:  'Resend OTP code' })
  @ApiBody({ type: ResendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  async resendOtp(
    @Body() dto: ResendOtpDto,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const ipAddress = req. ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await this.authService. resendOtp(dto, ipAddress, userAgent);
    return { message: 'OTP resent successfully' };
  }

  // ==================== PASSWORD MANAGEMENT ====================

  @Public()
  @Post('password/forgot')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset instructions sent' })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const ipAddress = req.ip || req. socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await this.authService.forgotPassword(dto. identifier, ipAddress, userAgent);
    return {
      message: 
        'If an account exists with this email/phone, password reset instructions have been sent',
    };
  }

  @Public()
  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status:  200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const ipAddress = req.ip || req.socket. remoteAddress;
    const userAgent = req.headers['user-agent'];
    await this.authService.resetPassword(dto. token, dto.newPassword, ipAddress, userAgent);
    return { message: 'Password reset successfully.  Please login with your new password.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('password/change')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change password (authenticated)' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status:  200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid current password' })
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await this. authService.changePassword(user. id, dto, ipAddress, userAgent);
    return { message: 'Password changed successfully' };
  }

  // ==================== PIN MANAGEMENT ====================

  @UseGuards(JwtAuthGuard)
  @Post('pin/set')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Set PIN for quick access' })
  @ApiBody({ type: SetPinDto })
  @ApiResponse({ status: 200, description: 'PIN set successfully' })
  @ApiResponse({ status: 401, description:  'Invalid password' })
  async setPin(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SetPinDto,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req. headers['user-agent'];
    await this.authService.setPin(user.id, dto, ipAddress, userAgent);
    return { message: 'PIN set successfully' };
  }

  // ==================== MFA MANAGEMENT ====================

  @UseGuards(JwtAuthGuard)
  @Post('mfa/enable')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Enable MFA (initiate setup)' })
  @ApiBody({ type: EnableMfaDto })
  @ApiResponse({
    status: 200,
    description: 'MFA setup initiated',
    type: MfaSetupResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid password' })
  async enableMfa(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: EnableMfaDto,
    @Req() req: Request,
  ): Promise<MfaSetupResponseDto> {
    const ipAddress = req.ip || req. socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.enableMfa(user.id, dto, ipAddress, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/verify-setup')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verify MFA setup with TOTP code' })
  @ApiBody({ type: VerifyMfaSetupDto })
  @ApiResponse({ status: 200, description: 'MFA enabled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  async verifyMfaSetup(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: VerifyMfaSetupDto,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const ipAddress = req.ip || req. socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await this.authService.verifyMfaSetup(user.id, dto, ipAddress, userAgent);
    return { message: 'MFA enabled successfully' };
  }

  @Public()
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify MFA code during login' })
  @ApiBody({ type: VerifyMfaDto })
  @ApiResponse({
    status: 200,
    description: 'MFA verified, login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid MFA code' })
  async verifyMfa(
    @Body() dto: VerifyMfaDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    const ipAddress = req. ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService. verifyMfa(dto, ipAddress, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/disable')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Disable MFA' })
  @ApiBody({ type: DisableMfaDto })
  @ApiResponse({ status: 200, description: 'MFA disabled successfully' })
  @ApiResponse({ status: 401, description: 'Invalid password or code' })
  async disableMfa(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: DisableMfaDto,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const ipAddress = req.ip || req.socket. remoteAddress;
    const userAgent = req.headers['user-agent'];
    await this.authService.disableMfa(user.id, dto, ipAddress, userAgent);
    return { message: 'MFA disabled successfully' };
  }

  // ==================== CURRENT USER ====================

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserResponseDto,
  })
  async getCurrentUser(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    return this.authService.getUser(user.id);
  }
}
