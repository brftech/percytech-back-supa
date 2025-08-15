import { ConfigService } from "@nestjs/config";
import { Brand, Campaign } from "../entities";
export interface TCRBrandSubmission {
    displayName: string;
    companyName: string;
    ein: string;
    entityType: string;
    vertical: string;
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
}
export interface TCRCampaignSubmission {
    campaignName: string;
    description: string;
    callToAction: string;
    sampleMessage: string;
    optInMessage: string;
    optOutMessage: string;
    helpMessage: string;
}
export interface TCRResponse {
    success: boolean;
    id?: string;
    message: string;
    error?: string;
    data?: any;
}
export declare class TCRApiService {
    private configService;
    private readonly logger;
    private readonly tcrConfig;
    constructor(configService: ConfigService);
    private createBasicAuth;
    private callTCRAPI;
    submitBrand(brand: Brand, useStaging?: boolean): Promise<TCRResponse>;
    submitCampaign(campaign: Campaign, useStaging?: boolean): Promise<TCRResponse>;
    getBrandStatus(brandId: string, useStaging?: boolean): Promise<TCRResponse>;
    getCampaignStatus(campaignId: string, useStaging?: boolean): Promise<TCRResponse>;
}
