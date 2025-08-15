import { SupabaseService } from "./supabase.service";
import { User, UserStatus } from "../entities";
export declare class UserService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    createUser(userData: Partial<User>): Promise<User>;
    findUserById(id: string): Promise<User>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserBySessionToken(sessionToken: string): Promise<User | null>;
    updateUser(id: string, updateData: Partial<User>): Promise<User>;
    updateUserStatus(id: string, status: UserStatus): Promise<User>;
    deleteUser(id: string): Promise<void>;
    getAllUsers(): Promise<User[]>;
    searchUsers(query: string): Promise<User[]>;
}
