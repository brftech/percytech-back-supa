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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./supabase.service");
let UserService = UserService_1 = class UserService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async createUser(userData) {
        this.logger.log(`Creating user: ${userData.email}`);
        const user = await this.supabaseService.create("users", Object.assign(Object.assign({}, userData), { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
        this.logger.log(`User created: ${user.id}`);
        return user;
    }
    async findUserById(id) {
        const user = await this.supabaseService.findById("users", id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findUserByEmail(email) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
        if (error && error.code !== "PGRST116")
            throw error;
        return data;
    }
    async findUserBySessionToken(sessionToken) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from("users")
            .select("*")
            .eq("sessionToken", sessionToken)
            .single();
        if (error && error.code !== "PGRST116")
            throw error;
        return data;
    }
    async updateUser(id, updateData) {
        this.logger.log(`Updating user: ${id}`);
        const user = await this.supabaseService.update("users", id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date().toISOString() }));
        this.logger.log(`User updated: ${id}`);
        return user;
    }
    async updateUserStatus(id, status) {
        return this.updateUser(id, { status });
    }
    async deleteUser(id) {
        this.logger.log(`Deleting user: ${id}`);
        await this.supabaseService.delete("users", id);
        this.logger.log(`User deleted: ${id}`);
    }
    async getAllUsers() {
        return this.supabaseService.findAll("users");
    }
    async searchUsers(query) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from("users")
            .select("*")
            .or(`email.ilike.%${query}%,id.ilike.%${query}%`);
        if (error)
            throw error;
        return data || [];
    }
};
UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map