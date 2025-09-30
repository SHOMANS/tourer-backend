import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

  @IsOptional()
  @IsEnum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

  @IsOptional()
  paymentId?: string;
}
