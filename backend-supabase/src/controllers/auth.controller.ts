import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
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

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signin")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const result = await this.authService.signIn(
        signInDto.email,
        signInDto.password
      );
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || "Authentication failed",
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const result = await this.authService.signUp(
        signUpDto.email,
        signUpDto.password,
        signUpDto.companyName
      );
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || "Registration failed",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post("signout")
  @HttpCode(HttpStatus.OK)
  async signOut() {
    try {
      await this.authService.signOut();
      return { message: "Successfully signed out" };
    } catch (error) {
      throw new HttpException(
        error.message || "Sign out failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      await this.authService.resetPassword(resetPasswordDto.email);
      return { message: "Password reset email sent" };
    } catch (error) {
      throw new HttpException(
        error.message || "Password reset failed",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post("google")
  @HttpCode(HttpStatus.OK)
  async signInWithGoogle() {
    try {
      const result = await this.authService.signInWithGoogle();
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || "Google authentication failed",
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
