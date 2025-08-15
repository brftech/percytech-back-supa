import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SupabaseClient } from "@supabase/supabase-js";
export declare class SupabaseService implements OnModuleInit {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    getClient(): SupabaseClient;
    create<T>(table: string, data: Partial<T>): Promise<T>;
    findById<T>(table: string, id: string): Promise<T | null>;
    findByUserId<T>(table: string, userId: string): Promise<T[]>;
    update<T>(table: string, id: string, data: Partial<T>): Promise<T>;
    delete(table: string, id: string): Promise<void>;
    findAll<T>(table: string): Promise<T[]>;
}
