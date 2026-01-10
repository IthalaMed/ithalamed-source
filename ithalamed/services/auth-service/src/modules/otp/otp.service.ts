import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Otp } from '@ithalamed/database';
import { OtpPurpose, generateOTP } from '@ithalamed/common';

export interface SendOtpParams {
  identifier: string;
  purpose: OtpPurpose;
  userId?:  string;
  ipAddress?: string;
  userAgent?: string;
  deliveryMethod?: 'sms' | 'email' | 'whatsapp';
}

export interface VerifyOtpParams {
  identifier:  string;
  code: string;
  purpose: OtpPurpose;
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly otpExpiryMinutes:  number;
  private readonly otpMaxAttempts: number;
  private readonly otpLength: number;
  private readonly bcryptRounds: number;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {
    this.otpExpiryMinutes = this.configService. get<number>('auth.otp.expiryMinutes') || 10;
    this. otpMaxAttempts = this.configService.get<number>('auth.otp.maxAttempts') || 5;
    this.otpLength = this.configService.get<number>('auth.otp.length') || 6;
    this. bcryptRounds = this.configService.get<number>('auth.bcryptRounds') || 12;
  }

  /**
   * Send OTP
   */
  async sendOtp(params: SendOtpParams): Promise<void> {
    const {
      identifier,
      purpose,
      userId,
      ipAddress,
      userAgent,
      deliveryMethod = identifier.includes('@') ? 'email' : 'sms',
    } = params;

    // Invalidate any existing OTPs for this identifier and purpose
    await this. otpRepository.update(
      { identifier, purpose, isUsed: false },
      { isUsed: true, usedAt:  new Date() },
    );

    // Generate OTP
    const code = generateOTP(this. otpLength);
    const codeHash = await bcrypt.hash(code, this.bcryptRounds);

    // Calculate expiry
    const expiresAt = new Date(Date.now() + this.otpExpiryMinutes * 60 * 1000);

    // Create OTP record
    const otp = this.otpRepository. create({
      userId,
      identifier,
      code: codeHash,
      purpose,
      expiresAt,
      maxAttempts: this.otpMaxAttempts,
      ipAddress,
      userAgent,
      deliveryMethod,
      deliveryStatus: 'pending',
    });

    await this.otpRepository.save(otp);

    // Send OTP via appropriate channel
    await this.deliverOtp(identifier, code, deliveryMethod, purpose);

    // Update delivery status
    await this. otpRepository.update(otp.id, {
      deliveryStatus: 'sent',
      deliveredAt: new Date(),
    });

    this.logger.log(`OTP sent to ${this.maskIdentifier(identifier)} for ${purpose}`);
  }

  /**
   * Verify OTP
   */
  async verifyOtp(params: VerifyOtpParams): Promise<void> {
    const { identifier, code, purpose } = params;

    // Find the most recent unused OTP
    const otp = await this.otpRepository.findOne({
      where: { identifier, purpose, isUsed: false },
      order: { createdAt: 'DESC' },
    });

    if (!otp) {
      throw new BadRequestException('No OTP found.  Please request a new one.');
    }

    // Check if OTP is expired
    if (otp.isExpired()) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Check attempts
    if (! otp.hasAttemptsRemaining()) {
      throw new BadRequestException('Maximum attempts exceeded. Please request a new OTP.');
    }

    // Increment attempts
    await this.otpRepository. update(otp.id, {
      attempts: otp.attempts + 1,
    });

    // Verify code
    const isValid = await bcrypt.compare(code, otp.code);

    if (!isValid) {
      const remainingAttempts = otp.maxAttempts - otp.attempts - 1;
      throw new BadRequestException(
        `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
      );
    }

    // Mark as used
    await this.otpRepository.update(otp. id, {
      isUsed: true,
      usedAt: new Date(),
    });
  }

  /**
   * Deliver OTP via appropriate channel
   */
  private async deliverOtp(
    identifier: string,
    code: string,
    deliveryMethod: 'sms' | 'email' | 'whatsapp',
    purpose: OtpPurpose,
  ): Promise<void> {
    const message = this.getOtpMessage(code, purpose);

    switch (deliveryMethod) {
      case 'sms': 
        await this.sendSms(identifier, message);
        break;
      case 'email': 
        await this.sendEmail(identifier, this.getOtpSubject(purpose), message);
        break;
      case 'whatsapp':
        await this. sendWhatsApp(identifier, message);
        break;
      default:
        throw new BadRequestException('Invalid delivery method');
    }
  }

  /**
   * Send SMS (placeholder - integrate with SMS provider)
   */
  private async sendSms(phoneNumber: string, message: string): Promise<void> {
    // TODO: Integrate with SMS provider (e.g., Twilio, Africa's Talking, BulkSMS)
    this.logger.log(`[SMS] To:  ${this.maskIdentifier(phoneNumber)}`);
    this.logger.debug(`[SMS] Message: ${message}`);
    
    // Placeholder for actual SMS implementation
    // await this.smsService.send(phoneNumber, message);
  }

  /**
   * Send Email (placeholder - integrate with email provider)
   */
  private async sendEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    // TODO: Integrate with email provider (e.g., SendGrid, AWS SES)
    this.logger.log(`[EMAIL] To: ${this.maskIdentifier(email)}`);
    this.logger.debug(`[EMAIL] Subject: ${subject}`);
    this.logger.debug(`[EMAIL] Message: ${message}`);
    
    // Placeholder for actual email implementation
    // await this.emailService.send({ to: email, subject, body:  message });
  }

  /**
   * Send WhatsApp message (placeholder - integrate with WhatsApp Business API)
   */
  private async sendWhatsApp(phoneNumber: string, message: string): Promise<void> {
    // TODO: Integrate with WhatsApp Business API
    this.logger. log(`[WHATSAPP] To: ${this.maskIdentifier(phoneNumber)}`);
    this.logger.debug(`[WHATSAPP] Message: ${message}`);
    
    // Placeholder for actual WhatsApp implementation
    // await this.whatsappService.send(phoneNumber, message);
  }

  /**
   * Get OTP message based on purpose
   */
  private getOtpMessage(code:  string, purpose: OtpPurpose): string {
    const appName = 'IthalaMed';
    const expiryMinutes = this.otpExpiryMinutes;

    switch (purpose) {
      case OtpPurpose. PHONE_VERIFICATION:
        return `Your ${appName} phone verification code is:  ${code}.  Valid for ${expiryMinutes} minutes.  Do not share this code with anyone.`;
      case OtpPurpose.EMAIL_VERIFICATION:
        return `Your ${appName} email verification code is: ${code}. Valid for ${expiryMinutes} minutes. Do not share this code with anyone.`;
      case OtpPurpose.PASSWORD_RESET:
        return `Your ${appName} password reset code is: ${code}. Valid for ${expiryMinutes} minutes. If you did not request this, please ignore. `;
      case OtpPurpose.LOGIN:
        return `Your ${appName} login code is: ${code}. Valid for ${expiryMinutes} minutes. Do not share this code with anyone.`;
      case OtpPurpose. TRANSACTION: 
        return `Your ${appName} transaction verification code is: ${code}. Valid for ${expiryMinutes} minutes. Do not share this code. `;
      default:
        return `Your ${appName} verification code is: ${code}. Valid for ${expiryMinutes} minutes. `;
    }
  }

  /**
   * Get email subject based on purpose
   */
  private getOtpSubject(purpose: OtpPurpose): string {
    switch (purpose) {
      case OtpPurpose.PHONE_VERIFICATION:
        return 'IthalaMed - Phone Verification Code';
      case OtpPurpose.EMAIL_VERIFICATION: 
        return 'IthalaMed - Email Verification Code';
      case OtpPurpose.PASSWORD_RESET: 
        return 'IthalaMed - Password Reset Code';
      case OtpPurpose. LOGIN:
        return 'IthalaMed - Login Verification Code';
      case OtpPurpose.TRANSACTION: 
        return 'IthalaMed - Transaction Verification Code';
      default:
        return 'IthalaMed - Verification Code';
    }
  }

  /**
   * Mask identifier for logging
   */
  private maskIdentifier(identifier:  string): string {
    if (identifier.includes('@')) {
      // Email
      const [local, domain] = identifier.split('@');
      const maskedLocal = local.slice(0, 2) + '***' + local.slice(-1);
      return `${maskedLocal}@${domain}`;
    } else {
      // Phone number
      return identifier. slice(0, 4) + '****' + identifier.slice(-3);
    }
  }

  /**
   * Clean up expired OTPs (called by cron job)
   */
  async cleanupExpiredOtps(): Promise<number> {
    const result = await this.otpRepository. delete({
      expiresAt:  new Date(),
      isUsed: false,
    });

    const deletedCount = result.affected || 0;
    if (deletedCount > 0) {
      this.logger.log(`Cleaned up ${deletedCount} expired OTPs`);
    }

    return deletedCount;
  }
}
