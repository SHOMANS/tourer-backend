import { IsString, IsEmail, IsOptional } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  idToken: string;

  @IsString()
  @IsOptional()
  googleId?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;
}
