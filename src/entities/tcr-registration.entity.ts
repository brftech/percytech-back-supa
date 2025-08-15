import { IsString, IsOptional, IsEnum } from "class-validator";

export enum TCRStatus {
  PENDING = "PENDING",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export class TCRRegistration {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  brandId: string;

  @IsString()
  campaignId: string;

  @IsOptional()
  @IsString()
  tcrBrandId?: string;

  @IsOptional()
  @IsString()
  tcrCampaignId?: string;

  @IsEnum(TCRStatus)
  status: TCRStatus;

  @IsOptional()
  @IsString()
  tcrResponse?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}
