export declare enum TCRStatus {
    PENDING = "PENDING",
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SUSPENDED = "SUSPENDED"
}
export declare class TCRRegistration {
    id: string;
    userId: string;
    brandId: string;
    campaignId: string;
    tcrBrandId?: string;
    tcrCampaignId?: string;
    status: TCRStatus;
    tcrResponse?: string;
    errorMessage?: string;
    createdAt: string;
    updatedAt?: string;
}
