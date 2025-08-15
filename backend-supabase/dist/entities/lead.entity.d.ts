export declare enum LeadSource {
    CONTACT_FORM = "CONTACT_FORM",
    DEMO_REQUEST = "DEMO_REQUEST",
    WEBSITE_VISIT = "WEBSITE_VISIT",
    REFERRAL = "REFERRAL",
    SOCIAL_MEDIA = "SOCIAL_MEDIA",
    EMAIL_CAMPAIGN = "EMAIL_CAMPAIGN",
    OTHER = "OTHER"
}
export declare enum LeadStatus {
    NEW = "NEW",
    CONTACTED = "CONTACTED",
    QUALIFIED = "QUALIFIED",
    CONVERTED = "CONVERTED",
    LOST = "LOST"
}
export declare enum LeadPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare class Lead {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    company?: string;
    job_title?: string;
    website?: string;
    industry?: string;
    company_size?: string;
    message?: string;
    how_did_you_hear?: string;
    source: LeadSource;
    status: LeadStatus;
    priority: LeadPriority;
    brand_id?: string;
    hubspot_contact_id?: string;
    hubspot_company_id?: string;
    notes?: string;
    assigned_to?: string;
    last_contact_date?: string;
    next_follow_up_date?: string;
    created_at: string;
    updated_at: string;
}
