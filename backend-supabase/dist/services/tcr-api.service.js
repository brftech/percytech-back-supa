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
var TCRApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCRApiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TCRApiService = TCRApiService_1 = class TCRApiService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(TCRApiService_1.name);
        this.tcrConfig = {
            staging: {
                baseUrl: this.configService.get("TCR_STAGING_URL"),
                apiKey: this.configService.get("TCR_STAGING_API_KEY"),
                apiSecret: this.configService.get("TCR_STAGING_API_SECRET"),
            },
            production: {
                baseUrl: this.configService.get("TCR_PRODUCTION_URL"),
                apiKey: this.configService.get("TCR_PRODUCTION_API_KEY"),
                apiSecret: this.configService.get("TCR_PRODUCTION_API_SECRET"),
            },
        };
    }
    createBasicAuth(apiKey, apiSecret) {
        return Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    }
    async callTCRAPI(endpoint, data, useStaging = true, method = "POST") {
        const config = useStaging
            ? this.tcrConfig.staging
            : this.tcrConfig.production;
        const environment = useStaging ? "STAGING" : "PRODUCTION";
        this.logger.log(`🌐 Making ${environment} API call to: ${endpoint} (${method})`);
        this.logger.debug(`📤 Request data: ${JSON.stringify(data, null, 2)}`);
        try {
            const fetchOptions = {
                method,
                headers: {
                    Authorization: `Basic ${this.createBasicAuth(config.apiKey, config.apiSecret)}`,
                    "Content-Type": "application/json",
                },
            };
            if (method !== "GET") {
                fetchOptions.body = JSON.stringify(data);
            }
            const response = await fetch(`${config.baseUrl}${endpoint}`, fetchOptions);
            const responseData = await response.json();
            if (!response.ok) {
                this.logger.error(`❌ TCR API Error: ${response.status} - ${JSON.stringify(responseData)}`);
                return {
                    success: false,
                    message: `TCR API Error: ${response.status}`,
                    error: responseData.error || responseData.message || "Unknown error",
                    data: responseData,
                };
            }
            this.logger.log(`✅ TCR API Success: ${endpoint}`);
            return {
                success: true,
                message: "TCR API call successful",
                data: responseData,
            };
        }
        catch (error) {
            this.logger.error(`❌ TCR API Exception: ${error.message}`);
            return {
                success: false,
                message: "TCR API call failed",
                error: error.message,
            };
        }
    }
    async submitBrand(brand, useStaging = true) {
        const brandData = {
            displayName: brand.displayName,
            companyName: brand.companyName,
            ein: brand.ein,
            entityType: brand.entityType,
            vertical: brand.vertical,
            phone: brand.phone,
            email: brand.email,
            country: brand.country,
            website: brand.website,
            street: brand.street,
            city: brand.city,
            state: brand.state,
            postalCode: brand.postalCode,
            stockSymbol: brand.stockSymbol,
            stockExchange: brand.stockExchange,
            ipAddress: brand.ipAddress,
            altBusinessId: brand.altBusinessId,
            altBusinessIdType: brand.altBusinessIdType,
        };
        return this.callTCRAPI("/brands", brandData, useStaging);
    }
    async submitCampaign(campaign, useStaging = true) {
        const campaignData = {
            campaignName: campaign.campaignName,
            description: campaign.description,
            callToAction: campaign.callToAction,
            sampleMessage: campaign.sampleMessage,
            optInMessage: campaign.optInMessage,
            optOutMessage: campaign.optOutMessage,
            helpMessage: campaign.helpMessage,
        };
        return this.callTCRAPI("/campaigns", campaignData, useStaging);
    }
    async getBrandStatus(brandId, useStaging = true) {
        return this.callTCRAPI(`/brands/${brandId}`, {}, useStaging, "GET");
    }
    async getCampaignStatus(campaignId, useStaging = true) {
        return this.callTCRAPI(`/campaigns/${campaignId}`, {}, useStaging, "GET");
    }
};
TCRApiService = TCRApiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TCRApiService);
exports.TCRApiService = TCRApiService;
//# sourceMappingURL=tcr-api.service.js.map