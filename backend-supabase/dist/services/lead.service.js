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
var LeadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./supabase.service");
const hubspot_service_1 = require("./hubspot.service");
const lead_entity_1 = require("../entities/lead.entity");
const lead_activity_entity_1 = require("../entities/lead-activity.entity");
let LeadService = LeadService_1 = class LeadService {
    constructor(supabaseService, hubspotService) {
        this.supabaseService = supabaseService;
        this.hubspotService = hubspotService;
        this.logger = new common_1.Logger(LeadService_1.name);
    }
    async createLead(leadData) {
        try {
            const lead = await this.supabaseService.create("leads", Object.assign(Object.assign({}, leadData), { status: lead_entity_1.LeadStatus.NEW, priority: leadData.priority || lead_entity_1.LeadPriority.MEDIUM, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
            await this.createLeadActivity({
                lead_id: lead.id,
                type: lead_activity_entity_1.LeadActivityType.CONTACT_FORM_SUBMISSION,
                title: `New lead from ${leadData.source}`,
                description: `Lead submitted via ${leadData.source}`,
                metadata: { formData: leadData },
            });
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
                await this.supabaseService.update("leads", lead.id, {
                    hubspot_contact_id: hubspotContact.id,
                    updated_at: new Date().toISOString(),
                });
                this.logger.log(`Lead synced to HubSpot with ID: ${hubspotContact.id}`);
            }
            catch (hubspotError) {
                this.logger.error("Failed to sync lead to HubSpot", hubspotError);
            }
            return lead;
        }
        catch (error) {
            this.logger.error("Failed to create lead", error);
            throw error;
        }
    }
    async createLeadActivity(activityData) {
        try {
            const activity = await this.supabaseService.create("lead_activities", Object.assign(Object.assign({}, activityData), { status: lead_activity_entity_1.LeadActivityStatus.PENDING, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
            const lead = await this.supabaseService.findById("leads", activityData.lead_id);
            if (lead && lead.hubspot_contact_id) {
                try {
                    const hubspotActivity = await this.hubspotService.createActivity(lead.hubspot_contact_id, {
                        subject: activityData.title,
                        description: activityData.description,
                        activityType: activityData.type,
                        status: "pending",
                        scheduledDate: activityData.scheduled_date,
                    });
                    await this.supabaseService.update("lead_activities", activity.id, {
                        hubspotActivityId: hubspotActivity.id,
                        updatedAt: new Date().toISOString(),
                    });
                    this.logger.log(`Activity synced to HubSpot with ID: ${hubspotActivity.id}`);
                }
                catch (hubspotError) {
                    this.logger.error("Failed to sync activity to HubSpot", hubspotError);
                }
            }
            return activity;
        }
        catch (error) {
            this.logger.error("Failed to create lead activity", error);
            throw error;
        }
    }
    async getLeadById(id) {
        return this.supabaseService.findById("leads", id);
    }
    async getLeadByEmail(email) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from("leads")
            .select("*")
            .eq("email", email)
            .single();
        if (error && error.code !== "PGRST116")
            throw error;
        return data;
    }
    async getLeadActivities(leadId) {
        return this.supabaseService.findByUserId("lead_activities", leadId);
    }
    async updateLeadStatus(id, status) {
        return this.supabaseService.update("leads", id, {
            status,
            updated_at: new Date().toISOString(),
        });
    }
    async updateLeadPriority(id, priority) {
        return this.supabaseService.update("leads", id, {
            priority,
            updated_at: new Date().toISOString(),
        });
    }
    async assignLead(id, assignedTo) {
        return this.supabaseService.update("leads", id, {
            assigned_to: assignedTo,
            updated_at: new Date().toISOString(),
        });
    }
    async getLeads(filters) {
        let query = this.supabaseService
            .getClient()
            .from("leads")
            .select("*")
            .order("createdAt", { ascending: false });
        if (filters === null || filters === void 0 ? void 0 : filters.status) {
            query = query.eq("status", filters.status);
        }
        if (filters === null || filters === void 0 ? void 0 : filters.priority) {
            query = query.eq("priority", filters.priority);
        }
        if (filters === null || filters === void 0 ? void 0 : filters.assignedTo) {
            query = query.eq("assignedTo", filters.assignedTo);
        }
        if (filters === null || filters === void 0 ? void 0 : filters.brandId) {
            query = query.eq("brandId", filters.brandId);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data || [];
    }
    async searchLeads(query) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from("leads")
            .select("*")
            .or(`firstName.ilike.%${query}%,lastName.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
            .order("createdAt", { ascending: false });
        if (error)
            throw error;
        return data || [];
    }
};
LeadService = LeadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        hubspot_service_1.HubSpotService])
], LeadService);
exports.LeadService = LeadService;
//# sourceMappingURL=lead.service.js.map