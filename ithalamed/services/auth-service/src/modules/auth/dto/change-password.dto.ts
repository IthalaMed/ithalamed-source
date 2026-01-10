import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Change password DTO
 */
export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description:  'New password',
    example: 'NewSecureP@ss123',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  newPassword: string;
}

/**
 * Set PIN DTO
 */
export class SetPinDto {
  @ApiProperty({
    description: 'Current password (required to set PIN)',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: '4-6 digit PIN',
    example: '1234',
  })
  @IsString()
  @Matches(/^\d{4,6}$/, { message: 'PIN must be 4-6 digits' })
  pin: string;
}
