import { SupabaseService } from "./supabase.service";
import { TCRApiService } from "./tcr-api.service";
import { Campaign, CampaignStatus } from "../entities";
export declare class CampaignService {
    private readonly supabaseService;
    private readonly tcrApiService;
    private readonly logger;
    constructor(supabaseService: SupabaseService, tcrApiService: TCRApiService);
    createCampaign(campaignData: Partial<Campaign>): Promise<Campaign>;
    findCampaignById(id: string): Promise<Campaign>;
    findCampaignsByUserId(userId: string): Promise<Campaign[]>;
    findCampaignsByBrandId(brandId: string): Promise<Campaign[]>;
    getAllCampaigns(): Promise<Campaign[]>;
    updateCampaign(id: string, updateData: Partial<Campaign>): Promise<Campaign>;
    updateCampaignStatus(id: string, status: CampaignStatus): Promise<Campaign>;
    deleteCampaign(id: string): Promise<void>;
    submitCampaignToTCR(campaignId: string, useStaging?: boolean): Promise<any>;
    getTCRCampaignStatus(campaignId: string, useStaging?: boolean): Promise<any>;
}
