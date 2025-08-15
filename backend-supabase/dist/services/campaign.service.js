"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CampaignService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./supabase.service");
const tcr_api_service_1 = require("./tcr-api.service");
const entities_1 = require("../entities");
let CampaignService = CampaignService_1 = class CampaignService {
    constructor(supabaseService, tcrApiService) {
        this.supabaseService = supabaseService;
        this.tcrApiService = tcrApiService;
        this.logger = new common_1.Logger(CampaignService_1.name);
    }
    async createCampaign(campaignData) {
        this.logger.log(`Creating campaign: ${campaignData.campaignName}`);
        const campaign = await this.supabaseService.create("campaigns", Object.assign(Object.assign({}, campaignData), { status: entities_1.CampaignStatus.DRAFT, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
        this.logger.log(`Campaign created: ${campaign.id}`);
        return campaign;
    }
    async findCampaignById(id) {
        const campaign = await this.supabaseService.findById("campaigns", id);
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign with ID ${id} not found`);
        }
        return campaign;
    }
    async findCampaignsByUserId(userId) {
        return this.supabaseService.findByUserId("campaigns", userId);
    }
    async findCampaignsByBrandId(brandId) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from("campaigns")
            .select("*")
            .eq("brandId", brandId);
        if (error)
            throw error;
        return data || [];
    }
    async getAllCampaigns() {
        return this.supabaseService.findAll("campaigns");
    }
    async updateCampaign(id, updateData) {
        this.logger.log(`Updating campaign: ${id}`);
        const campaign = await this.supabaseService.update("campaigns", id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date().toISOString() }));
        this.logger.log(`Campaign updated: ${id}`);
        return campaign;
    }
    async updateCampaignStatus(id, status) {
        return this.updateCampaign(id, { status });
    }
    async deleteCampaign(id) {
        this.logger.log(`Deleting campaign: ${id}`);
        await this.supabaseService.delete("campaigns", id);
        this.logger.log(`Campaign deleted: ${id}`);
    }
    async submitCampaignToTCR(campaignId, useStaging = true) {
        this.logger.log(`Submitting campaign ${campaignId} to TCR`);
        const campaign = await this.findCampaignById(campaignId);
        const tcrResponse = await this.tcrApiService.submitCampaign(campaign, useStaging);
        if (tcrResponse.success) {
            await this.updateCampaign(campaignId, {
                status: entities_1.CampaignStatus.ACTIVE,
                updatedAt: new Date().toISOString(),
            });
            this.logger.log(`Campaign ${campaignId} submitted to TCR successfully`);
        }
        else {
            await this.updateCampaign(campaignId, {
                status: entities_1.CampaignStatus.SUSPENDED,
                updatedAt: new Date().toISOString(),
            });
            this.logger.error(`Campaign ${campaignId} TCR submission failed: ${tcrResponse.error}`);
        }
        return tcrResponse;
    }
    async getTCRCampaignStatus(campaignId, useStaging = true) {
        return this.tcrApiService.getCampaignStatus(campaignId, useStaging);
    }
};
CampaignService = CampaignService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        tcr_api_service_1.TCRApiService])
], CampaignService);
exports.CampaignService = CampaignService;
//# sourceMappingURL=campaign.service.js.map