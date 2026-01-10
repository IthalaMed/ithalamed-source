import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType, UserStatus } from '@ithalamed/common';

export class CreateUserDto {
  @ApiProperty({ example: 'Thandi' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Mbatha' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: '+27821234567' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'thandi@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  passwordHash: string;

  @ApiProperty({ enum: UserType })
  @IsEnum(UserType)
  userType: UserType;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ default: 'en' })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;
}
