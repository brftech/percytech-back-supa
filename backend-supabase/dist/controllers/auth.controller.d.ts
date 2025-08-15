import { AuthService } from "../services/auth.service";
interface SignInDto {
    email: string;
    password: string;
}
interface SignUpDto {
    email: string;
    password: string;
    companyName: string;
}
interface ResetPasswordDto {
    email: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(signInDto: SignInDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            status: import("../entities").UserStatus.ACTIVE;
            createdAt: string;
            updatedAt: string;
        };
    }>;
    signUp(signUpDto: SignUpDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            status: import("../entities").UserStatus;
        };
    }>;
    signOut(): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    signInWithGoogle(): Promise<void>;
}
export {};
