import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  IsDateString,
  Min,
  Max,
  IsDecimal,
} from 'class-validator';

export enum Category {
  ADVENTURE = 'ADVENTURE',
  CULTURAL = 'CULTURAL',
  NATURE = 'NATURE',
  HISTORICAL = 'HISTORICAL',
  BEACH = 'BEACH',
  MOUNTAIN = 'MOUNTAIN',
  CITY = 'CITY',
  WILDLIFE = 'WILDLIFE',
  LUXURY = 'LUXURY',
  BUDGET = 'BUDGET',
  FAMILY = 'FAMILY',
  ROMANTIC = 'ROMANTIC',
}

export enum Difficulty {
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  CHALLENGING = 'CHALLENGING',
  EXTREME = 'EXTREME',
}

export class CreatePackageDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsDecimal()
  price: number;

  @IsDecimal()
  @IsOptional()
  originalPrice?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxGuests?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minAge?: number;

  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;

  @IsEnum(Category)
  @IsOptional()
  category?: Category;

  @IsString()
  locationName: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  coordinates?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  highlights?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  includes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  excludes?: string[];

  @IsOptional()
  itinerary?: any;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsDateString()
  @IsOptional()
  availableFrom?: string;

  @IsDateString()
  @IsOptional()
  availableTo?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  reviewCount?: number;
}