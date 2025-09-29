import {
  IsInt,
  IsString,
  IsOptional,
  IsArray,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  packageId: string;

  @IsString()
  @IsOptional()
  bookingId?: string;
}
