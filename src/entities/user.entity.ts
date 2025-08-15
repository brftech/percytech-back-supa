import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from "class-validator";

export enum UserStatus {
  PENDING_VERIFICATION = "pending_verification",
  ACTIVE = "active",
  ONBOARDING = "onboarding",
  COMPLETED = "completed",
  SUSPENDED = "suspended",
}

export class User {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  sessionToken?: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}
