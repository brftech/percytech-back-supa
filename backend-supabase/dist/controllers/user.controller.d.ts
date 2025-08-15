import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { User, UserStatus } from "../entities";
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    getCurrentUser(authHeader: string): Promise<{
        id: string;
        email: string;
        status: UserStatus.ACTIVE;
    }>;
    createUser(userData: Partial<User>): Promise<User>;
    getAllUsers(): Promise<User[]>;
    searchUsers(query: string): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserBySessionToken(token: string): Promise<User | null>;
    updateUser(id: string, updateData: Partial<User>): Promise<User>;
    updateUserStatus(id: string, status: UserStatus): Promise<User>;
    deleteUser(id: string): Promise<void>;
}
