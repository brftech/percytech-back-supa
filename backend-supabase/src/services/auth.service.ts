import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { SupabaseService } from "./supabase.service";
import { UserService } from "./user.service";
import { BrandService } from "./brand.service";
import { UserStatus } from "../entities/user.entity";
import { BrandStatus } from "../entities/brand.entity";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly userService: UserService,
    private readonly brandService: BrandService
  ) {}

  async signIn(email: string, password: string) {
    try {
      this.logger.log(`Attempting sign in for email: ${email}`);

      // Find user by email
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException("Invalid credentials");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password || ""
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }

      // Check if user is active
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException("Account is not active");
      }

      // Generate JWT token
      const token = this.generateJWTToken(user);

      // Update last login - we'll need to add this field to the User entity
      // await this.userService.updateUser(user.id, { lastLoginAt: new Date() });

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
    } catch (error) {
      this.logger.error(`Sign in failed for email: ${email}`, error.stack);
      throw error;
    }
  }

  async signUp(email: string, password: string, companyName: string) {
    try {
      this.logger.log(
        `Attempting sign up for email: ${email}, company: ${companyName}`
      );

      // Check if user already exists
      const existingUser = await this.userService.findUserByEmail(email);
      if (existingUser) {
        throw new BadRequestException("User with this email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const userData = {
        email,
        password: hashedPassword,
        status: UserStatus.PENDING_VERIFICATION, // User needs to verify email
      };

      const user = await this.userService.createUser(userData);

      // Create default brand for the user
      const brandData = {
        displayName: companyName,
        companyName: companyName,
        userId: user.id,
        status: BrandStatus.PENDING,
        // Add required fields with default values
        ein: "TBD",
        entityType: "SOLE_PROPRIETOR" as any,
        vertical: "TECHNOLOGY" as any,
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

      // TODO: Send verification email
      // For now, just return success message
      return {
        message:
          "User created successfully. Please check your email for verification.",
        user: {
          id: user.id,
          email: user.email,
          status: user.status,
        },
      };
    } catch (error) {
      this.logger.error(`Sign up failed for email: ${email}`, error.stack);
      throw error;
    }
  }

  async signOut() {
    // In a JWT-based system, sign out is typically handled client-side
    // by removing the token. The server doesn't need to do anything.
    this.logger.log("User signed out");
    return { message: "Successfully signed out" };
  }

  async resetPassword(email: string) {
    try {
      this.logger.log(`Password reset requested for email: ${email}`);

      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        this.logger.log(
          `Password reset requested for non-existent email: ${email}`
        );
        return {
          message:
            "If an account with this email exists, a reset link has been sent.",
        };
      }

      // TODO: Generate reset token and send email
      // For now, just log the request
      this.logger.log(`Password reset email would be sent to: ${email}`);

      return {
        message:
          "If an account with this email exists, a reset link has been sent.",
      };
    } catch (error) {
      this.logger.error(
        `Password reset failed for email: ${email}`,
        error.stack
      );
      throw error;
    }
  }

  async signInWithGoogle() {
    // TODO: Implement Google OAuth
    // This would involve:
    // 1. Redirecting to Google OAuth
    // 2. Handling the callback
    // 3. Creating/updating user
    // 4. Returning JWT token
    throw new BadRequestException("Google OAuth not implemented yet");
  }

  private generateJWTToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // Use a secret key from environment variables
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";

    return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
  }

  async verifyToken(token: string) {
    try {
      const secret = process.env.JWT_SECRET || "your-secret-key";
      const decoded = jwt.verify(token, secret) as any;

      // Get fresh user data
      const user = await this.userService.findUserById(decoded.sub);
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException("Invalid or expired token");
      }

      return {
        id: user.id,
        email: user.email,
        status: user.status,
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
