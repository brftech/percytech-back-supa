import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Use the percytech.dev lead database for lead management
    const supabaseUrl = this.configService.get<string>(
      "PERCYTECH_DEV_SUPABASE_URL"
    );
    // Use service role key for server-side operations (bypasses RLS)
    const supabaseKey = this.configService.get<string>(
      "PERCYTECH_DEV_SUPABASE_SERVICE_ROLE_KEY"
    );

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Missing PercyTech.dev Supabase configuration. Please set PERCYTECH_DEV_SUPABASE_URL and PERCYTECH_DEV_SUPABASE_SERVICE_ROLE_KEY environment variables."
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Generic CRUD operations
  async create<T>(table: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async findById<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async findByUserId<T>(table: string, userId: string): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(table)
      .select("*")
      .eq("userId", userId);

    if (error) throw error;
    return data || [];
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async delete(table: string, id: string): Promise<void> {
    const { error } = await this.supabase.from(table).delete().eq("id", id);

    if (error) throw error;
  }

  async findAll<T>(table: string): Promise<T[]> {
    const { data, error } = await this.supabase.from(table).select("*");

    if (error) throw error;
    return data || [];
  }
}
