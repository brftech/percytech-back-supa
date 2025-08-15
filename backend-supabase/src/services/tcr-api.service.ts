import { Injectable, Logger } from "@nestjs/common";
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

@Injectable()
export class TCRApiService {
  private readonly logger = new Logger(TCRApiService.name);
  private readonly tcrConfig: {
    staging: { baseUrl: string; apiKey: string; apiSecret: string };
    production: { baseUrl: string; apiKey: string; apiSecret: string };
  };

  constructor(private configService: ConfigService) {
    this.tcrConfig = {
      staging: {
        baseUrl: this.configService.get<string>("TCR_STAGING_URL"),
        apiKey: this.configService.get<string>("TCR_STAGING_API_KEY"),
        apiSecret: this.configService.get<string>("TCR_STAGING_API_SECRET"),
      },
      production: {
        baseUrl: this.configService.get<string>("TCR_PRODUCTION_URL"),
        apiKey: this.configService.get<string>("TCR_PRODUCTION_API_KEY"),
        apiSecret: this.configService.get<string>("TCR_PRODUCTION_API_SECRET"),
      },
    };
  }

  private createBasicAuth(apiKey: string, apiSecret: string): string {
    return Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  }

  private async callTCRAPI(
    endpoint: string,
    data: any,
    useStaging = true,
    method = "POST"
  ): Promise<TCRResponse> {
    const config = useStaging
      ? this.tcrConfig.staging
      : this.tcrConfig.production;
    const environment = useStaging ? "STAGING" : "PRODUCTION";

    this.logger.log(
      `🌐 Making ${environment} API call to: ${endpoint} (${method})`
    );
    this.logger.debug(`📤 Request data: ${JSON.stringify(data, null, 2)}`);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          Authorization: `Basic ${this.createBasicAuth(
            config.apiKey,
            config.apiSecret
          )}`,
          "Content-Type": "application/json",
        },
      };

      if (method !== "GET") {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(
        `${config.baseUrl}${endpoint}`,
        fetchOptions
      );
      const responseData = await response.json();

      if (!response.ok) {
        this.logger.error(
          `❌ TCR API Error: ${response.status} - ${JSON.stringify(
            responseData
          )}`
        );
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
    } catch (error) {
      this.logger.error(`❌ TCR API Exception: ${error.message}`);
      return {
        success: false,
        message: "TCR API call failed",
        error: error.message,
      };
    }
  }

  async submitBrand(brand: Brand, useStaging = true): Promise<TCRResponse> {
    const brandData: TCRBrandSubmission = {
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

  async submitCampaign(
    campaign: Campaign,
    useStaging = true
  ): Promise<TCRResponse> {
    const campaignData: TCRCampaignSubmission = {
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

  async getBrandStatus(
    brandId: string,
    useStaging = true
  ): Promise<TCRResponse> {
    return this.callTCRAPI(`/brands/${brandId}`, {}, useStaging, "GET");
  }

  async getCampaignStatus(
    campaignId: string,
    useStaging = true
  ): Promise<TCRResponse> {
    return this.callTCRAPI(`/campaigns/${campaignId}`, {}, useStaging, "GET");
  }
}
