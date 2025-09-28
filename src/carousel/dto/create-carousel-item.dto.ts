import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';

export enum ActionType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export class CreateCarouselItemDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  imageUrl: string;

  @IsEnum(ActionType)
  @IsOptional()
  actionType?: ActionType;

  @IsString()
  actionValue: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
