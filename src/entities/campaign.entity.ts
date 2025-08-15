import { IsString, IsOptional, IsEnum } from "class-validator";

export enum CampaignStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  SUSPENDED = "SUSPENDED",
  ARCHIVED = "ARCHIVED",
}

export class Campaign {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  brandId: string;

  @IsString()
  campaignName: string;

  @IsString()
  description: string;

  @IsString()
  callToAction: string;

  @IsString()
  sampleMessage: string;

  @IsString()
  optInMessage: string;

  @IsString()
  optOutMessage: string;

  @IsString()
  helpMessage: string;

  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
