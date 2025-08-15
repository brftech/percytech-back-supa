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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./supabase.service");
const user_service_1 = require("./user.service");
const brand_service_1 = require("./brand.service");
const user_entity_1 = require("../entities/user.entity");
const brand_entity_1 = require("../entities/brand.entity");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let AuthService = AuthService_1 = class AuthService {
    constructor(supabaseService, userService, brandService) {
        this.supabaseService = supabaseService;
        this.userService = userService;
        this.brandService = brandService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async signIn(email, password) {
        try {
            this.logger.log(`Attempting sign in for email: ${email}`);
            const user = await this.userService.findUserByEmail(email);
            if (!user) {
                throw new common_1.UnauthorizedException("Invalid credentials");
            }
            const isPasswordValid = await bcrypt.compare(password, user.password || "");
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException("Invalid credentials");
            }
            if (user.status !== user_entity_1.UserStatus.ACTIVE) {
                throw new common_1.UnauthorizedException("Account is not active");
            }
            const token = this.generateJWTToken(user);
            this.logger.log(`Successful sign in for user: ${user.id}`);
            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    status: user.status,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            };
        }
        catch (error) {
            this.logger.error(`Sign in failed for email: ${email}`, error.stack);
            throw error;
        }
    }
    async signUp(email, password, companyName) {
        try {
            this.logger.log(`Attempting sign up for email: ${email}, company: ${companyName}`);
            const existingUser = await this.userService.findUserByEmail(email);
            if (existingUser) {
                throw new common_1.BadRequestException("User with this email already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const userData = {
                email,
                password: hashedPassword,
                status: user_entity_1.UserStatus.PENDING_VERIFICATION,
            };
            const user = await this.userService.createUser(userData);
            const brandData = {
                displayName: companyName,
                companyName: companyName,
                userId: user.id,
                status: brand_entity_1.BrandStatus.PENDING,
                ein: "TBD",
                entityType: "SOLE_PROPRIETOR",
                vertical: "TECHNOLOGY",
                phone: "TBD",
                email: user.email,
                country: "US",
                street: "TBD",
                city: "TBD",
                state: "TBD",
                postalCode: "TBD",
            };
            await this.brandService.createBrand(brandData);
            this.logger.log(`User created successfully: ${user.id}`);
            return {
                message: "User created successfully. Please check your email for verification.",
                user: {
                    id: user.id,
                    email: user.email,
                    status: user.status,
                },
            };
        }
        catch (error) {
            this.logger.error(`Sign up failed for email: ${email}`, error.stack);
            throw error;
        }
    }
    async signOut() {
        this.logger.log("User signed out");
        return { message: "Successfully signed out" };
    }
    async resetPassword(email) {
        try {
            this.logger.log(`Password reset requested for email: ${email}`);
            const user = await this.userService.findUserByEmail(email);
            if (!user) {
                this.logger.log(`Password reset requested for non-existent email: ${email}`);
                return {
                    message: "If an account with this email exists, a reset link has been sent.",
                };
            }
            this.logger.log(`Password reset email would be sent to: ${email}`);
            return {
                message: "If an account with this email exists, a reset link has been sent.",
            };
        }
        catch (error) {
            this.logger.error(`Password reset failed for email: ${email}`, error.stack);
            throw error;
        }
    }
    async signInWithGoogle() {
        throw new common_1.BadRequestException("Google OAuth not implemented yet");
    }
    generateJWTToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
        };
        const secret = process.env.JWT_SECRET || "your-secret-key";
        const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
        return jwt.sign(payload, secret, { expiresIn: expiresIn });
    }
    async verifyToken(token) {
        try {
            const secret = process.env.JWT_SECRET || "your-secret-key";
            const decoded = jwt.verify(token, secret);
            const user = await this.userService.findUserById(decoded.sub);
            if (!user || user.status !== user_entity_1.UserStatus.ACTIVE) {
                throw new common_1.UnauthorizedException("Invalid or expired token");
            }
            return {
                id: user.id,
                email: user.email,
                status: user.status,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Invalid or expired token");
        }
    }
};
AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        user_service_1.UserService,
        brand_service_1.BrandService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map