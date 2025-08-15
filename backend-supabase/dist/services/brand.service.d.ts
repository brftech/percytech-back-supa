import { SupabaseService } from "./supabase.service";
import { TCRApiService } from "./tcr-api.service";
import { Brand, BrandStatus } from "../entities";
export declare class BrandService {
    private readonly supabaseService;
    private readonly tcrApiService;
    private readonly logger;
    constructor(supabaseService: SupabaseService, tcrApiService: TCRApiService);
    createBrand(brandData: Partial<Brand>): Promise<Brand>;
    findBrandById(id: string): Promise<Brand>;
    findBrandsByUserId(userId: string): Promise<Brand[]>;
    getAllBrands(): Promise<Brand[]>;
    updateBrand(id: string, updateData: Partial<Brand>): Promise<Brand>;
    updateBrandStatus(id: string, status: BrandStatus): Promise<Brand>;
    deleteBrand(id: string): Promise<void>;
    submitBrandToTCR(brandId: string, useStaging?: boolean): Promise<any>;
    getTCRBrandStatus(brandId: string, useStaging?: boolean): Promise<any>;
}
