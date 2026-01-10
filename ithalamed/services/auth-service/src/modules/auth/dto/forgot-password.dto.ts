import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Forgot password DTO
 */
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email or phone number',
    example: '+27821234567',
  })
  @IsString()
  identifier: string;
}
