import { IsString, IsEnum, IsOptional, IsDateString } from "class-validator";

export enum LeadActivityType {
  CONTACT_FORM_SUBMISSION = "CONTACT_FORM_SUBMISSION",
  DEMO_REQUEST = "DEMO_REQUEST",
  EMAIL_OPEN = "EMAIL_OPEN",
  EMAIL_CLICK = "EMAIL_CLICK",
  WEBSITE_VISIT = "WEBSITE_VISIT",
  PHONE_CALL = "PHONE_CALL",
  MEETING_SCHEDULED = "MEETING_SCHEDULED",
  MEETING_COMPLETED = "MEETING_COMPLETED",
  PROPOSAL_SENT = "PROPOSAL_SENT",
  PROPOSAL_VIEWED = "PROPOSAL_VIEWED",
  CONVERSION = "CONVERSION",
  OTHER = "OTHER",
}

export enum LeadActivityStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export class LeadActivity {
  id: string;

  @IsString()
  lead_id: string; // Reference to the Lead

  @IsEnum(LeadActivityType)
  type: LeadActivityType;

  @IsEnum(LeadActivityStatus)
  status: LeadActivityStatus;

  @IsString()
  title: string; // Human-readable title for the activity

  @IsOptional()
  @IsString()
  description?: string; // Detailed description

  @IsOptional()
  @IsString()
  outcome?: string; // What happened as a result

  @IsOptional()
  @IsString()
  notes?: string; // Internal notes

  @IsOptional()
  @IsString()
  assigned_to?: string; // User ID handling this activity

  @IsOptional()
  @IsDateString()
  scheduled_date?: string; // When this activity is scheduled

  @IsOptional()
  @IsDateString()
  completed_date?: string; // When this activity was completed

  @IsOptional()
  @IsString()
  duration?: string; // How long the activity took

  @IsOptional()
  @IsString()
  hubspot_activity_id?: string; // HubSpot activity ID after sync

  @IsOptional()
  metadata?: Record<string, any>; // JSON object for additional data

  created_at: string;
  updated_at: string;
}
