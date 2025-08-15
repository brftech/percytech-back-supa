import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";
import { TCRApiService } from "./tcr-api.service";
import { Brand, BrandStatus } from "../entities";

@Injectable()
export class BrandService {
  private readonly logger = new Logger(BrandService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly tcrApiService: TCRApiService
  ) {}

  async createBrand(brandData: Partial<Brand>): Promise<Brand> {
    this.logger.log(`Creating brand: ${brandData.displayName}`);

    const brand = await this.supabaseService.create<Brand>("brands", {
      ...brandData,
      status: BrandStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.logger.log(`Brand created: ${brand.id}`);
    return brand;
  }

  async findBrandById(id: string): Promise<Brand> {
    const brand = await this.supabaseService.findById<Brand>("brands", id);

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async findBrandsByUserId(userId: string): Promise<Brand[]> {
    return this.supabaseService.findByUserId<Brand>("brands", userId);
  }

  async getAllBrands(): Promise<Brand[]> {
    return this.supabaseService.findAll<Brand>("brands");
  }

  async updateBrand(id: string, updateData: Partial<Brand>): Promise<Brand> {
    this.logger.log(`Updating brand: ${id}`);

    const brand = await this.supabaseService.update<Brand>("brands", id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    this.logger.log(`Brand updated: ${id}`);
    return brand;
  }

  async updateBrandStatus(id: string, status: BrandStatus): Promise<Brand> {
    return this.updateBrand(id, { status });
  }

  async deleteBrand(id: string): Promise<void> {
    this.logger.log(`Deleting brand: ${id}`);
    await this.supabaseService.delete("brands", id);
    this.logger.log(`Brand deleted: ${id}`);
  }

  async submitBrandToTCR(brandId: string, useStaging = true): Promise<any> {
    this.logger.log(`Submitting brand ${brandId} to TCR`);

    const brand = await this.findBrandById(brandId);
    const tcrResponse = await this.tcrApiService.submitBrand(brand, useStaging);

    if (tcrResponse.success) {
      await this.updateBrand(brandId, {
        status: BrandStatus.APPROVED,
        updatedAt: new Date().toISOString(),
      });
      this.logger.log(`Brand ${brandId} submitted to TCR successfully`);
    } else {
      await this.updateBrand(brandId, {
        status: BrandStatus.REJECTED,
        updatedAt: new Date().toISOString(),
      });
      this.logger.error(
        `Brand ${brandId} TCR submission failed: ${tcrResponse.error}`
      );
    }

    return tcrResponse;
  }

  async getTCRBrandStatus(brandId: string, useStaging = true): Promise<any> {
    return this.tcrApiService.getBrandStatus(brandId, useStaging);
  }
}
