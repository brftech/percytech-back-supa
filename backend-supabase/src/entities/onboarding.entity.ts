import { IsString, IsBoolean, IsEnum, IsOptional } from "class-validator";

export enum OnboardingStep {
  EMAIL_VERIFICATION = "email_verification",
  PAYMENT = "payment",
  TCR_REGISTRATION = "tcr_registration",
  BANDWIDTH_SETUP = "bandwidth_setup",
  GNYMBLE_SETUP = "gnymble_setup",
  COMPLETED = "completed",
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export class Onboarding {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  paymentIntentId: string;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsBoolean()
  emailVerified: boolean;

  @IsBoolean()
  tcrCompleted: boolean;

  @IsBoolean()
  bandwidthCompleted: boolean;

  @IsBoolean()
  gnymbleCompleted: boolean;

  @IsEnum(OnboardingStep)
  currentStep: OnboardingStep;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
