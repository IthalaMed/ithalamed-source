import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Forgot password request DTO
 */
export class ForgotPasswordDto {
  @ApiProperty({
    description:  'Email address or phone number',
    example: '+27821234567',
  })
  @IsString()
  @IsNotEmpty({ message: 'Email or phone number is required' })
  identifier: string;
}
