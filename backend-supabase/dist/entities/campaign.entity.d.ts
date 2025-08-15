export declare enum CampaignStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    SUSPENDED = "SUSPENDED",
    ARCHIVED = "ARCHIVED"
}
export declare class Campaign {
    id: string;
    userId: string;
    brandId: string;
    campaignName: string;
    description: string;
    callToAction: string;
    sampleMessage: string;
    optInMessage: string;
    optOutMessage: string;
    helpMessage: string;
    status: CampaignStatus;
    createdAt: string;
    updatedAt: string;
}
