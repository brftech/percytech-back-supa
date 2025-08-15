import { Injectable, Logger } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";
import { HubSpotService } from "./hubspot.service";
import {
  Lead,
  LeadSource,
  LeadStatus,
  LeadPriority,
} from "../entities/lead.entity";
import {
  LeadActivity,
  LeadActivityType,
  LeadActivityStatus,
} from "../entities/lead-activity.entity";

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

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly hubspotService: HubSpotService
  ) {}

  /**
   * Create a new lead and sync to HubSpot
   */
  async createLead(leadData: CreateLeadDto): Promise<Lead> {
    try {
      // Create lead in our database
      const lead = await this.supabaseService.create<Lead>("leads", {
        ...leadData,
        status: LeadStatus.NEW,
        priority: leadData.priority || LeadPriority.MEDIUM,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Create initial activity for the lead
      await this.createLeadActivity({
        lead_id: lead.id,
        type: LeadActivityType.CONTACT_FORM_SUBMISSION,
        title: `New lead from ${leadData.source}`,
        description: `Lead submitted via ${leadData.source}`,
        metadata: { formData: leadData },
      });

      // Sync to HubSpot
      try {
        const hubspotContact = await this.hubspotService.createOrUpdateContact({
          email: leadData.email,
          firstname: leadData.first_name,
          lastname: leadData.last_name,
          phone: leadData.phone,
          company: leadData.company,
          jobtitle: leadData.job_title,
          website: leadData.website,
          industry: leadData.industry,
          company_size: leadData.company_size,
          source: leadData.source,
          notes: leadData.message,
          lifecyclestage: "lead",
          lead_status: "new",
        });

        // Update lead with HubSpot IDs
        await this.supabaseService.update<Lead>("leads", lead.id, {
          hubspot_contact_id: hubspotContact.id,
          updated_at: new Date().toISOString(),
        });

        this.logger.log(`Lead synced to HubSpot with ID: ${hubspotContact.id}`);
      } catch (hubspotError) {
        this.logger.error("Failed to sync lead to HubSpot", hubspotError);
        // Don't fail the entire operation if HubSpot sync fails
      }

      return lead;
    } catch (error) {
      this.logger.error("Failed to create lead", error);
      throw error;
    }
  }

  /**
   * Create a lead activity
   */
  async createLeadActivity(
    activityData: CreateLeadActivityDto
  ): Promise<LeadActivity> {
    try {
      const activity = await this.supabaseService.create<LeadActivity>(
        "lead_activities",
        {
          ...activityData,
          status: LeadActivityStatus.PENDING,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      );

      // Get the lead to sync activity to HubSpot
      const lead = await this.supabaseService.findById<Lead>(
        "leads",
        activityData.lead_id
      );

      if (lead && lead.hubspot_contact_id) {
        try {
          const hubspotActivity = await this.hubspotService.createActivity(
            lead.hubspot_contact_id,
            {
              subject: activityData.title,
              description: activityData.description,
              activityType: activityData.type,
              status: "pending",
              scheduledDate: activityData.scheduled_date,
            }
          );

          // Update activity with HubSpot ID
          await this.supabaseService.update("lead_activities", activity.id, {
            hubspotActivityId: hubspotActivity.id,
            updatedAt: new Date().toISOString(),
          });

          this.logger.log(
            `Activity synced to HubSpot with ID: ${hubspotActivity.id}`
          );
        } catch (hubspotError) {
          this.logger.error("Failed to sync activity to HubSpot", hubspotError);
        }
      }

      return activity;
    } catch (error) {
      this.logger.error("Failed to create lead activity", error);
      throw error;
    }
  }

  /**
   * Get lead by ID
   */
  async getLeadById(id: string): Promise<Lead | null> {
    return this.supabaseService.findById("leads", id);
  }

  /**
   * Get lead by email
   */
  async getLeadByEmail(email: string): Promise<Lead | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("leads")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  /**
   * Get all activities for a lead
   */
  async getLeadActivities(leadId: string): Promise<LeadActivity[]> {
    return this.supabaseService.findByUserId("lead_activities", leadId);
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    return this.supabaseService.update<Lead>("leads", id, {
      status,
      updated_at: new Date().toISOString(),
    });
  }

  /**
   * Update lead priority
   */
  async updateLeadPriority(id: string, priority: LeadPriority): Promise<Lead> {
    return this.supabaseService.update<Lead>("leads", id, {
      priority,
      updated_at: new Date().toISOString(),
    });
  }

  /**
   * Assign lead to a user
   */
  async assignLead(id: string, assignedTo: string): Promise<Lead> {
    return this.supabaseService.update<Lead>("leads", id, {
      assigned_to: assignedTo,
      updated_at: new Date().toISOString(),
    });
  }

  /**
   * Get all leads with optional filtering
   */
  async getLeads(filters?: {
    status?: LeadStatus;
    priority?: LeadPriority;
    assignedTo?: string;
    brandId?: string;
  }): Promise<Lead[]> {
    let query = this.supabaseService
      .getClient()
      .from("leads")
      .select("*")
      .order("createdAt", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.priority) {
      query = query.eq("priority", filters.priority);
    }
    if (filters?.assignedTo) {
      query = query.eq("assignedTo", filters.assignedTo);
    }
    if (filters?.brandId) {
      query = query.eq("brandId", filters.brandId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Search leads
   */
  async searchLeads(query: string): Promise<Lead[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("leads")
      .select("*")
      .or(
        `firstName.ilike.%${query}%,lastName.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`
      )
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
