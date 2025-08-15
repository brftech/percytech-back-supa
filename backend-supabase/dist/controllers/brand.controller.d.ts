import { BrandService } from "../services/brand.service";
import { Brand, BrandStatus } from "../entities";
export declare class BrandController {
    private readonly brandService;
    constructor(brandService: BrandService);
    createBrand(brandData: Partial<Brand>): Promise<Brand>;
    getAllBrands(): Promise<Brand[]>;
    getBrandsByUserId(userId: string): Promise<Brand[]>;
    getBrandById(id: string): Promise<Brand>;
    updateBrand(id: string, updateData: Partial<Brand>): Promise<Brand>;
    updateBrandStatus(id: string, status: BrandStatus): Promise<Brand>;
    deleteBrand(id: string): Promise<void>;
    submitBrandToTCR(id: string, staging?: string): Promise<any>;
    getTCRBrandStatus(id: string, staging?: string): Promise<any>;
}
