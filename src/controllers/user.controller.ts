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
  Headers,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { User, UserStatus } from "../entities";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Get("me")
  async getCurrentUser(@Headers("authorization") authHeader: string) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("No valid authorization header");
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    try {
      const user = await this.authService.verifyToken(token);
      return user;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get("search")
  async searchUsers(@Query("q") query: string): Promise<User[]> {
    return this.userService.searchUsers(query);
  }

  @Get(":id")
  async getUserById(@Param("id") id: string): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Get("email/:email")
  async getUserByEmail(@Param("email") email: string): Promise<User | null> {
    return this.userService.findUserByEmail(email);
  }

  @Get("session/:token")
  async getUserBySessionToken(
    @Param("token") token: string
  ): Promise<User | null> {
    return this.userService.findUserBySessionToken(token);
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() updateData: Partial<User>
  ): Promise<User> {
    return this.userService.updateUser(id, updateData);
  }

  @Put(":id/status")
  async updateUserStatus(
    @Param("id") id: string,
    @Body("status") status: UserStatus
  ): Promise<User> {
    return this.userService.updateUserStatus(id, status);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param("id") id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
