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
var BrandService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./supabase.service");
const tcr_api_service_1 = require("./tcr-api.service");
const entities_1 = require("../entities");
let BrandService = BrandService_1 = class BrandService {
    constructor(supabaseService, tcrApiService) {
        this.supabaseService = supabaseService;
        this.tcrApiService = tcrApiService;
        this.logger = new common_1.Logger(BrandService_1.name);
    }
    async createBrand(brandData) {
        this.logger.log(`Creating brand: ${brandData.displayName}`);
        const brand = await this.supabaseService.create("brands", Object.assign(Object.assign({}, brandData), { status: entities_1.BrandStatus.PENDING, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
        this.logger.log(`Brand created: ${brand.id}`);
        return brand;
    }
    async findBrandById(id) {
        const brand = await this.supabaseService.findById("brands", id);
        if (!brand) {
            throw new common_1.NotFoundException(`Brand with ID ${id} not found`);
        }
        return brand;
    }
    async findBrandsByUserId(userId) {
        return this.supabaseService.findByUserId("brands", userId);
    }
    async getAllBrands() {
        return this.supabaseService.findAll("brands");
    }
    async updateBrand(id, updateData) {
        this.logger.log(`Updating brand: ${id}`);
        const brand = await this.supabaseService.update("brands", id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date().toISOString() }));
        this.logger.log(`Brand updated: ${id}`);
        return brand;
    }
    async updateBrandStatus(id, status) {
        return this.updateBrand(id, { status });
    }
    async deleteBrand(id) {
        this.logger.log(`Deleting brand: ${id}`);
        await this.supabaseService.delete("brands", id);
        this.logger.log(`Brand deleted: ${id}`);
    }
    async submitBrandToTCR(brandId, useStaging = true) {
        this.logger.log(`Submitting brand ${brandId} to TCR`);
        const brand = await this.findBrandById(brandId);
        const tcrResponse = await this.tcrApiService.submitBrand(brand, useStaging);
        if (tcrResponse.success) {
            await this.updateBrand(brandId, {
                status: entities_1.BrandStatus.APPROVED,
                updatedAt: new Date().toISOString(),
            });
            this.logger.log(`Brand ${brandId} submitted to TCR successfully`);
        }
        else {
            await this.updateBrand(brandId, {
                status: entities_1.BrandStatus.REJECTED,
                updatedAt: new Date().toISOString(),
            });
            this.logger.error(`Brand ${brandId} TCR submission failed: ${tcrResponse.error}`);
        }
        return tcrResponse;
    }
    async getTCRBrandStatus(brandId, useStaging = true) {
        return this.tcrApiService.getBrandStatus(brandId, useStaging);
    }
};
BrandService = BrandService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        tcr_api_service_1.TCRApiService])
], BrandService);
exports.BrandService = BrandService;
//# sourceMappingURL=brand.service.js.map