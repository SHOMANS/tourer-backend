import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
  IsArray,
  IsDecimal,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  packageId: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsInt()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  guests: number;

  @IsArray()
  @IsString({ each: true })
  guestNames: string[];

  @IsOptional()
  contactInfo?: any; // JSON object with contact details, special requirements

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  totalPrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
