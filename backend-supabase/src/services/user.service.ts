import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";
import { User, UserStatus } from "../entities";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async createUser(userData: Partial<User>): Promise<User> {
    this.logger.log(`Creating user: ${userData.email}`);

    const user = await this.supabaseService.create<User>("users", {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.logger.log(`User created: ${user.id}`);
    return user;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.supabaseService.findById<User>("users", id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async findUserBySessionToken(sessionToken: string): Promise<User | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("users")
      .select("*")
      .eq("sessionToken", sessionToken)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    this.logger.log(`Updating user: ${id}`);

    const user = await this.supabaseService.update<User>("users", id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    this.logger.log(`User updated: ${id}`);
    return user;
  }

  async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    return this.updateUser(id, { status });
  }

  async deleteUser(id: string): Promise<void> {
    this.logger.log(`Deleting user: ${id}`);
    await this.supabaseService.delete("users", id);
    this.logger.log(`User deleted: ${id}`);
  }

  async getAllUsers(): Promise<User[]> {
    return this.supabaseService.findAll<User>("users");
  }

  async searchUsers(query: string): Promise<User[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("users")
      .select("*")
      .or(`email.ilike.%${query}%,id.ilike.%${query}%`);

    if (error) throw error;
    return data || [];
  }
}
