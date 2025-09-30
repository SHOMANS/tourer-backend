import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryBookingsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

  @IsOptional()
  @IsEnum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsEnum(['createdAt', 'startDate', 'totalPrice'])
  sortBy?: 'createdAt' | 'startDate' | 'totalPrice' = 'createdAt';
}
