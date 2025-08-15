import { SupabaseService } from "./supabase.service";
import { UserService } from "./user.service";
import { BrandService } from "./brand.service";
import { UserStatus } from "../entities/user.entity";
export declare class AuthService {
    private readonly supabaseService;
    private readonly userService;
    private readonly brandService;
    private readonly logger;
    constructor(supabaseService: SupabaseService, userService: UserService, brandService: BrandService);
    signIn(email: string, password: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            status: UserStatus.ACTIVE;
            createdAt: string;
            updatedAt: string;
        };
    }>;
    signUp(email: string, password: string, companyName: string): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            status: UserStatus;
        };
    }>;
    signOut(): Promise<{
        message: string;
    }>;
    resetPassword(email: string): Promise<{
        message: string;
    }>;
    signInWithGoogle(): Promise<void>;
    private generateJWTToken;
    verifyToken(token: string): Promise<{
        id: string;
        email: string;
        status: UserStatus.ACTIVE;
    }>;
}
