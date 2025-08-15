export declare enum LeadActivityType {
    CONTACT_FORM_SUBMISSION = "CONTACT_FORM_SUBMISSION",
    DEMO_REQUEST = "DEMO_REQUEST",
    EMAIL_OPEN = "EMAIL_OPEN",
    EMAIL_CLICK = "EMAIL_CLICK",
    WEBSITE_VISIT = "WEBSITE_VISIT",
    PHONE_CALL = "PHONE_CALL",
    MEETING_SCHEDULED = "MEETING_SCHEDULED",
    MEETING_COMPLETED = "MEETING_COMPLETED",
    PROPOSAL_SENT = "PROPOSAL_SENT",
    PROPOSAL_VIEWED = "PROPOSAL_VIEWED",
    CONVERSION = "CONVERSION",
    OTHER = "OTHER"
}
export declare enum LeadActivityStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare class LeadActivity {
    id: string;
    lead_id: string;
    type: LeadActivityType;
    status: LeadActivityStatus;
    title: string;
    description?: string;
    outcome?: string;
    notes?: string;
    assigned_to?: string;
    scheduled_date?: string;
    completed_date?: string;
    duration?: string;
    hubspot_activity_id?: string;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
}
