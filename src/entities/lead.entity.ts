import { IsEmail, IsOptional, IsString, IsEnum } from "class-validator";

export enum LeadSource {
  CONTACT_FORM = "CONTACT_FORM",
  DEMO_REQUEST = "DEMO_REQUEST",
  WEBSITE_VISIT = "WEBSITE_VISIT",
  REFERRAL = "REFERRAL",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  EMAIL_CAMPAIGN = "EMAIL_CAMPAIGN",
  OTHER = "OTHER",
}

export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  CONVERTED = "CONVERTED",
  LOST = "LOST",
}

export enum LeadPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export class Lead {
  id: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  job_title?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  company_size?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  how_did_you_hear?: string;

  @IsEnum(LeadSource)
  source: LeadSource;

  @IsEnum(LeadStatus)
  status: LeadStatus;

  @IsEnum(LeadPriority)
  priority: LeadPriority;

  @IsOptional()
  @IsString()
  brand_id?: string; // Which PercyTech brand they're interested in

  @IsOptional()
  @IsString()
  hubspot_contact_id?: string; // HubSpot contact ID after sync

  @IsOptional()
  @IsString()
  hubspot_company_id?: string; // HubSpot company ID after sync

  @IsOptional()
  @IsString()
  notes?: string; // Internal notes about the lead

  @IsOptional()
  @IsString()
  assigned_to?: string; // User ID of who's handling this lead

  @IsOptional()
  @IsString()
  last_contact_date?: string; // When they were last contacted

  @IsOptional()
  @IsString()
  next_follow_up_date?: string; // When to follow up next

  created_at: string;
  updated_at: string;
}
