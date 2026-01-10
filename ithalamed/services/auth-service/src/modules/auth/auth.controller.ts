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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

// Import from centralized common package
import {
  JwtAuthGuard,
  RolesGuard,
  CurrentUser,
  Public,
  Roles,
  AuthenticatedUser,
  UserType,
} from '@ithalamed/common';

// Import from database package
import { User } from '@ithalamed/database';


// DTOs
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

// Response DTOs
import { AuthResponseDto } from './dto/responses/auth-response.dto';
import { MessageResponseDto } from './dto/responses/message-response.dto';

@ApiTags('auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // From @ithalamed/common
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
  ) {
    return this.authService.register(dto, req. ip, req.headers['user-agent'] as string);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req.ip, req.headers['user-agent'] as string);
  }

  @UseGuards(JwtAuthGuard) // From @ithalamed/common
  @Get('me')
  @ApiBearerAuth()
  async getCurrentUser(
    @CurrentUser() user: AuthenticatedUser, // From @ithalamed/common
  ) {
    return this.authService.getUser(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // From @ithalamed/common
  @Roles(UserType. ADMIN) // From @ithalamed/common
  @Get('admin-only')
  @ApiBearerAuth()
  async adminOnly(@CurrentUser() user: AuthenticatedUser) {
    return { message: 'Admin access granted', userId: user.id };
  }
}
