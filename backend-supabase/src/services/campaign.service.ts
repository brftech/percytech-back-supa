import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";
import { TCRApiService } from "./tcr-api.service";
import { Campaign, CampaignStatus } from "../entities";

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly tcrApiService: TCRApiService
  ) {}

  async createCampaign(campaignData: Partial<Campaign>): Promise<Campaign> {
    this.logger.log(`Creating campaign: ${campaignData.campaignName}`);

    const campaign = await this.supabaseService.create<Campaign>("campaigns", {
      ...campaignData,
      status: CampaignStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.logger.log(`Campaign created: ${campaign.id}`);
    return campaign;
  }

  async findCampaignById(id: string): Promise<Campaign> {
    const campaign = await this.supabaseService.findById<Campaign>(
      "campaigns",
      id
    );

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async findCampaignsByUserId(userId: string): Promise<Campaign[]> {
    return this.supabaseService.findByUserId<Campaign>("campaigns", userId);
  }

  async findCampaignsByBrandId(brandId: string): Promise<Campaign[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("campaigns")
      .select("*")
      .eq("brandId", brandId);

    if (error) throw error;
    return data || [];
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return this.supabaseService.findAll<Campaign>("campaigns");
  }

  async updateCampaign(
    id: string,
    updateData: Partial<Campaign>
  ): Promise<Campaign> {
    this.logger.log(`Updating campaign: ${id}`);

    const campaign = await this.supabaseService.update<Campaign>(
      "campaigns",
      id,
      {
        ...updateData,
        updatedAt: new Date().toISOString(),
      }
    );

    this.logger.log(`Campaign updated: ${id}`);
    return campaign;
  }

  async updateCampaignStatus(
    id: string,
    status: CampaignStatus
  ): Promise<Campaign> {
    return this.updateCampaign(id, { status });
  }

  async deleteCampaign(id: string): Promise<void> {
    this.logger.log(`Deleting campaign: ${id}`);
    await this.supabaseService.delete("campaigns", id);
    this.logger.log(`Campaign deleted: ${id}`);
  }

  async submitCampaignToTCR(
    campaignId: string,
    useStaging = true
  ): Promise<any> {
    this.logger.log(`Submitting campaign ${campaignId} to TCR`);

    const campaign = await this.findCampaignById(campaignId);
    const tcrResponse = await this.tcrApiService.submitCampaign(
      campaign,
      useStaging
    );

    if (tcrResponse.success) {
      await this.updateCampaign(campaignId, {
        status: CampaignStatus.ACTIVE,
        updatedAt: new Date().toISOString(),
      });
      this.logger.log(`Campaign ${campaignId} submitted to TCR successfully`);
    } else {
      await this.updateCampaign(campaignId, {
        status: CampaignStatus.SUSPENDED,
        updatedAt: new Date().toISOString(),
      });
      this.logger.error(
        `Campaign ${campaignId} TCR submission failed: ${tcrResponse.error}`
      );
    }

    return tcrResponse;
  }

  async getTCRCampaignStatus(
    campaignId: string,
    useStaging = true
  ): Promise<any> {
    return this.tcrApiService.getCampaignStatus(campaignId, useStaging);
  }
}
