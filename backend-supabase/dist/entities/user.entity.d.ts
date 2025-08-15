export declare enum UserStatus {
    PENDING_VERIFICATION = "pending_verification",
    ACTIVE = "active",
    ONBOARDING = "onboarding",
    COMPLETED = "completed",
    SUSPENDED = "suspended"
}
export declare class User {
    id: string;
    email: string;
    password?: string;
    sessionToken?: string;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}
