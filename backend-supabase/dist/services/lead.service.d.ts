import { SupabaseService } from "./supabase.service";
import { HubSpotService } from "./hubspot.service";
import { Lead, LeadSource, LeadStatus, LeadPriority } from "../entities/lead.entity";
import { LeadActivity, LeadActivityType } from "../entities/lead-activity.entity";
export interface CreateLeadDto {
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
    brand_id?: string;
    priority?: LeadPriority;
}
export interface CreateLeadActivityDto {
    lead_id: string;
    type: LeadActivityType;
    title: string;
    description?: string;
    notes?: string;
    assigned_to?: string;
    scheduled_date?: string;
    metadata?: Record<string, any>;
}
export declare class LeadService {
    private readonly supabaseService;
    private readonly hubspotService;
    private readonly logger;
    constructor(supabaseService: SupabaseService, hubspotService: HubSpotService);
    createLead(leadData: CreateLeadDto): Promise<Lead>;
    createLeadActivity(activityData: CreateLeadActivityDto): Promise<LeadActivity>;
    getLeadById(id: string): Promise<Lead | null>;
    getLeadByEmail(email: string): Promise<Lead | null>;
    getLeadActivities(leadId: string): Promise<LeadActivity[]>;
    updateLeadStatus(id: string, status: LeadStatus): Promise<Lead>;
    updateLeadPriority(id: string, priority: LeadPriority): Promise<Lead>;
    assignLead(id: string, assignedTo: string): Promise<Lead>;
    getLeads(filters?: {
        status?: LeadStatus;
        priority?: LeadPriority;
        assignedTo?: string;
        brandId?: string;
    }): Promise<Lead[]>;
    searchLeads(query: string): Promise<Lead[]>;
}
