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
import { BrandService } from "../services/brand.service";
import { Brand, BrandStatus } from "../entities";

@Controller("brands")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBrand(@Body() brandData: Partial<Brand>): Promise<Brand> {
    return this.brandService.createBrand(brandData);
  }

  @Get()
  async getAllBrands(): Promise<Brand[]> {
    return this.brandService.getAllBrands();
  }

  @Get("user/:userId")
  async getBrandsByUserId(@Param("userId") userId: string): Promise<Brand[]> {
    return this.brandService.findBrandsByUserId(userId);
  }

  @Get(":id")
  async getBrandById(@Param("id") id: string): Promise<Brand> {
    return this.brandService.findBrandById(id);
  }

  @Put(":id")
  async updateBrand(
    @Param("id") id: string,
    @Body() updateData: Partial<Brand>
  ): Promise<Brand> {
    return this.brandService.updateBrand(id, updateData);
  }

  @Put(":id/status")
  async updateBrandStatus(
    @Param("id") id: string,
    @Body("status") status: BrandStatus
  ): Promise<Brand> {
    return this.brandService.updateBrandStatus(id, status);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBrand(@Param("id") id: string): Promise<void> {
    return this.brandService.deleteBrand(id);
  }

  @Post(":id/submit-tcr")
  async submitBrandToTCR(
    @Param("id") id: string,
    @Query("staging") staging: string = "true"
  ): Promise<any> {
    const useStaging = staging === "true";
    return this.brandService.submitBrandToTCR(id, useStaging);
  }

  @Get(":id/tcr-status")
  async getTCRBrandStatus(
    @Param("id") id: string,
    @Query("staging") staging: string = "true"
  ): Promise<any> {
    const useStaging = staging === "true";
    return this.brandService.getTCRBrandStatus(id, useStaging);
  }
}
