import { CampaignService } from "../services/campaign.service";
import { Campaign, CampaignStatus } from "../entities";
export declare class CampaignController {
    private readonly campaignService;
    constructor(campaignService: CampaignService);
    createCampaign(campaignData: Partial<Campaign>): Promise<Campaign>;
    getAllCampaigns(): Promise<Campaign[]>;
    getCampaignsByUserId(userId: string): Promise<Campaign[]>;
    getCampaignsByBrandId(brandId: string): Promise<Campaign[]>;
    getCampaignById(id: string): Promise<Campaign>;
    updateCampaign(id: string, updateData: Partial<Campaign>): Promise<Campaign>;
    updateCampaignStatus(id: string, status: CampaignStatus): Promise<Campaign>;
    deleteCampaign(id: string): Promise<void>;
    submitCampaignToTCR(id: string, staging?: string): Promise<any>;
    getTCRCampaignStatus(id: string, staging?: string): Promise<any>;
}
