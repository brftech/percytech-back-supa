import { IsString, IsOptional } from "class-validator";

export class Profile {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  company: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
