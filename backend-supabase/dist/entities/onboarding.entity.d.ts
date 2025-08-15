export declare enum OnboardingStep {
    EMAIL_VERIFICATION = "email_verification",
    PAYMENT = "payment",
    TCR_REGISTRATION = "tcr_registration",
    BANDWIDTH_SETUP = "bandwidth_setup",
    GNYMBLE_SETUP = "gnymble_setup",
    COMPLETED = "completed"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare class Onboarding {
    id: string;
    userId: string;
    paymentIntentId: string;
    paymentStatus: PaymentStatus;
    emailVerified: boolean;
    tcrCompleted: boolean;
    bandwidthCompleted: boolean;
    gnymbleCompleted: boolean;
    currentStep: OnboardingStep;
    createdAt: string;
    updatedAt: string;
}
