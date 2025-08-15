export declare enum EntityType {
    PRIVATE_PROFIT = "PRIVATE_PROFIT",
    PUBLIC_PROFIT = "PUBLIC_PROFIT",
    NON_PROFIT = "NON_PROFIT",
    GOVERNMENT = "GOVERNMENT",
    SOLE_PROPRIETOR = "SOLE_PROPRIETOR"
}
export declare enum Vertical {
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
    TRANSPORTATION = "TRANSPORTATION"
}
export declare enum BrandStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SUSPENDED = "SUSPENDED"
}
export declare class Brand {
    id: string;
    userId: string;
    displayName: string;
    companyName: string;
    ein: string;
    entityType: EntityType;
    vertical: Vertical;
    phone: string;
    email: string;
    country: string;
    website?: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    stockSymbol?: string;
    stockExchange?: string;
    ipAddress?: string;
    altBusinessId?: string;
    altBusinessIdType?: string;
    status: BrandStatus;
    createdAt: string;
    updatedAt: string;
}
