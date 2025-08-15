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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = class SupabaseService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const supabaseUrl = this.configService.get("PERCYTECH_DEV_SUPABASE_URL");
        const supabaseKey = this.configService.get("PERCYTECH_DEV_SUPABASE_SERVICE_ROLE_KEY");
        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Missing PercyTech.dev Supabase configuration. Please set PERCYTECH_DEV_SUPABASE_URL and PERCYTECH_DEV_SUPABASE_SERVICE_ROLE_KEY environment variables.");
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    getClient() {
        return this.supabase;
    }
    async create(table, data) {
        const { data: result, error } = await this.supabase
            .from(table)
            .insert(data)
            .select()
            .single();
        if (error)
            throw error;
        return result;
    }
    async findById(table, id) {
        const { data, error } = await this.supabase
            .from(table)
            .select("*")
            .eq("id", id)
            .single();
        if (error && error.code !== "PGRST116")
            throw error;
        return data;
    }
    async findByUserId(table, userId) {
        const { data, error } = await this.supabase
            .from(table)
            .select("*")
            .eq("userId", userId);
        if (error)
            throw error;
        return data || [];
    }
    async update(table, id, data) {
        const { data: result, error } = await this.supabase
            .from(table)
            .update(data)
            .eq("id", id)
            .select()
            .single();
        if (error)
            throw error;
        return result;
    }
    async delete(table, id) {
        const { error } = await this.supabase.from(table).delete().eq("id", id);
        if (error)
            throw error;
    }
    async findAll(table) {
        const { data, error } = await this.supabase.from(table).select("*");
        if (error)
            throw error;
        return data || [];
    }
};
SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
exports.SupabaseService = SupabaseService;
//# sourceMappingURL=supabase.service.js.map