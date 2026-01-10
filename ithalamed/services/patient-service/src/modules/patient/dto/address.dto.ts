import {
  IsString,
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Address DTO
 * Used for patient residential address
 */
export class AddressDto {
  @ApiProperty({ example: '123 Main Road', maxLength: 255 })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  street: string;

  @ApiPropertyOptional({ example: 'Unit 4B', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  unit?: string;

  @ApiProperty({ example: 'Sandton', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  suburb: string;

  @ApiProperty({ example: 'Johannesburg', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'Gauteng', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  province: string;

  @ApiProperty({ example: '2196', maxLength: 10 })
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  postalCode: string;

  @ApiProperty({ example: 'ZA', default: 'ZA', maxLength: 3 })
  @IsString()
  @MinLength(2)
  @MaxLength(3)
  country: string;

  @ApiPropertyOptional({ example: -26.1076, description: 'GPS latitude' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 28.0567, description: 'GPS longitude' })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
