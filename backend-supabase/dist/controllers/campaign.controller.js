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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignController = void 0;
const common_1 = require("@nestjs/common");
const campaign_service_1 = require("../services/campaign.service");
const entities_1 = require("../entities");
let CampaignController = class CampaignController {
    constructor(campaignService) {
        this.campaignService = campaignService;
    }
    async createCampaign(campaignData) {
        return this.campaignService.createCampaign(campaignData);
    }
    async getAllCampaigns() {
        return this.campaignService.getAllCampaigns();
    }
    async getCampaignsByUserId(userId) {
        return this.campaignService.findCampaignsByUserId(userId);
    }
    async getCampaignsByBrandId(brandId) {
        return this.campaignService.findCampaignsByBrandId(brandId);
    }
    async getCampaignById(id) {
        return this.campaignService.findCampaignById(id);
    }
    async updateCampaign(id, updateData) {
        return this.campaignService.updateCampaign(id, updateData);
    }
    async updateCampaignStatus(id, status) {
        return this.campaignService.updateCampaignStatus(id, status);
    }
    async deleteCampaign(id) {
        return this.campaignService.deleteCampaign(id);
    }
    async submitCampaignToTCR(id, staging = "true") {
        const useStaging = staging === "true";
        return this.campaignService.submitCampaignToTCR(id, useStaging);
    }
    async getTCRCampaignStatus(id, staging = "true") {
        const useStaging = staging === "true";
        return this.campaignService.getTCRCampaignStatus(id, useStaging);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "getAllCampaigns", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "getCampaignsByUserId", null);
__decorate([
    (0, common_1.Get)("brand/:brandId"),
    __param(0, (0, common_1.Param)("brandId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "getCampaignsByBrandId", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "getCampaignById", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "updateCampaign", null);
__decorate([
    (0, common_1.Put)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "updateCampaignStatus", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "deleteCampaign", null);
__decorate([
    (0, common_1.Post)(":id/submit-tcr"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("staging")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "submitCampaignToTCR", null);
__decorate([
    (0, common_1.Get)(":id/tcr-status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("staging")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "getTCRCampaignStatus", null);
CampaignController = __decorate([
    (0, common_1.Controller)("campaigns"),
    __metadata("design:paramtypes", [campaign_service_1.CampaignService])
], CampaignController);
exports.CampaignController = CampaignController;
//# sourceMappingURL=campaign.controller.js.map