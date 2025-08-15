export declare enum PaymentEntityStatus {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum Currency {
    USD = "usd",
    EUR = "eur",
    GBP = "gbp"
}
export declare class Payment {
    id: string;
    userId: string;
    paymentIntentId: string;
    amount: number;
    currency: Currency;
    status: PaymentEntityStatus;
    description?: string;
    createdAt: string;
    updatedAt: string;
}
