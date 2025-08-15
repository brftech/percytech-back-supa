import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { CampaignService } from "../services/campaign.service";
import { Campaign, CampaignStatus } from "../entities";

@Controller("campaigns")
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCampaign(
    @Body() campaignData: Partial<Campaign>
  ): Promise<Campaign> {
    return this.campaignService.createCampaign(campaignData);
  }

  @Get()
  async getAllCampaigns(): Promise<Campaign[]> {
    return this.campaignService.getAllCampaigns();
  }

  @Get("user/:userId")
  async getCampaignsByUserId(
    @Param("userId") userId: string
  ): Promise<Campaign[]> {
    return this.campaignService.findCampaignsByUserId(userId);
  }

  @Get("brand/:brandId")
  async getCampaignsByBrandId(
    @Param("brandId") brandId: string
  ): Promise<Campaign[]> {
    return this.campaignService.findCampaignsByBrandId(brandId);
  }

  @Get(":id")
  async getCampaignById(@Param("id") id: string): Promise<Campaign> {
    return this.campaignService.findCampaignById(id);
  }

  @Put(":id")
  async updateCampaign(
    @Param("id") id: string,
    @Body() updateData: Partial<Campaign>
  ): Promise<Campaign> {
    return this.campaignService.updateCampaign(id, updateData);
  }

  @Put(":id/status")
  async updateCampaignStatus(
    @Param("id") id: string,
    @Body("status") status: CampaignStatus
  ): Promise<Campaign> {
    return this.campaignService.updateCampaignStatus(id, status);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCampaign(@Param("id") id: string): Promise<void> {
    return this.campaignService.deleteCampaign(id);
  }

  @Post(":id/submit-tcr")
  async submitCampaignToTCR(
    @Param("id") id: string,
    @Query("staging") staging: string = "true"
  ): Promise<any> {
    const useStaging = staging === "true";
    return this.campaignService.submitCampaignToTCR(id, useStaging);
  }

  @Get(":id/tcr-status")
  async getTCRCampaignStatus(
    @Param("id") id: string,
    @Query("staging") staging: string = "true"
  ): Promise<any> {
    const useStaging = staging === "true";
    return this.campaignService.getTCRCampaignStatus(id, useStaging);
  }
}
