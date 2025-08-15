import { IsString, IsOptional, IsEnum, IsUrl } from "class-validator";

export enum EntityType {
  PRIVATE_PROFIT = "PRIVATE_PROFIT",
  PUBLIC_PROFIT = "PUBLIC_PROFIT",
  NON_PROFIT = "NON_PROFIT",
  GOVERNMENT = "GOVERNMENT",
  SOLE_PROPRIETOR = "SOLE_PROPRIETOR",
}

export enum Vertical {
  AGRICULTURE = "AGRICULTURE",
  AUTOMOTIVE = "AUTOMOTIVE",
  BANKING_FINANCE = "BANKING_FINANCE",
  CONSUMER_GOODS = "CONSUMER_GOODS",
  EDUCATION = "EDUCATION",
  EMERGENCY = "EMERGENCY",
  ENERGY_UTILITIES = "ENERGY_UTILITIES",
  ENTERTAINMENT = "ENTERTAINMENT",
  FOOD_BEVERAGE = "FOOD_BEVERAGE",
  GOVERNMENT = "GOVERNMENT",
  HEALTHCARE = "HEALTHCARE",
  HOSPITALITY_TRAVEL = "HOSPITALITY_TRAVEL",
  INSURANCE = "INSURANCE",
  INTERNET = "INTERNET",
  LEGAL = "LEGAL",
  MANUFACTURING = "MANUFACTURING",
  MEDIA = "MEDIA",
  NON_PROFIT = "NON_PROFIT",
  PHARMACEUTICALS = "PHARMACEUTICALS",
  POLITICAL = "POLITICAL",
  PROFESSIONAL_SERVICES = "PROFESSIONAL_SERVICES",
  PUBLIC_SAFETY = "PUBLIC_SAFETY",
  REAL_ESTATE = "REAL_ESTATE",
  RELIGION = "RELIGION",
  RETAIL = "RETAIL",
  TECHNOLOGY = "TECHNOLOGY",
  TELECOMMUNICATIONS = "TELECOMMUNICATIONS",
  TRANSPORTATION = "TRANSPORTATION",
}

export enum BrandStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export class Brand {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  displayName: string;

  @IsString()
  companyName: string;

  @IsString()
  ein: string;

  @IsEnum(EntityType)
  entityType: EntityType;

  @IsEnum(Vertical)
  vertical: Vertical;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsOptional()
  @IsString()
  stockSymbol?: string;

  @IsOptional()
  @IsString()
  stockExchange?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  altBusinessId?: string;

  @IsOptional()
  @IsString()
  altBusinessIdType?: string;

  @IsEnum(BrandStatus)
  status: BrandStatus;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
