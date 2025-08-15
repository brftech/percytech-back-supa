import { IsString, IsNumber, IsEnum, IsOptional } from "class-validator";

export enum PaymentEntityStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum Currency {
  USD = "usd",
  EUR = "eur",
  GBP = "gbp",
}

export class Payment {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  paymentIntentId: string;

  @IsNumber()
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsEnum(PaymentEntityStatus)
  status: PaymentEntityStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
