import { LeadService, CreateLeadDto, CreateLeadActivityDto } from "../services/lead.service";
import { LeadStatus, LeadPriority } from "../entities/lead.entity";
export declare class LeadController {
    private readonly leadService;
    constructor(leadService: LeadService);
    createLead(createLeadDto: CreateLeadDto): Promise<import("../entities/lead.entity").Lead>;
    createLeadActivity(leadId: string, createActivityDto: CreateLeadActivityDto): Promise<import("../entities").LeadActivity>;
    getLead(id: string): Promise<import("../entities/lead.entity").Lead>;
    getLeadByEmail(email: string): Promise<import("../entities/lead.entity").Lead>;
    getLeadActivities(leadId: string): Promise<import("../entities").LeadActivity[]>;
    getLeads(status?: LeadStatus, priority?: LeadPriority, assignedTo?: string, brandId?: string): Promise<import("../entities/lead.entity").Lead[]>;
    searchLeads(query: string): Promise<import("../entities/lead.entity").Lead[]>;
    updateLeadStatus(id: string, status: LeadStatus): Promise<import("../entities/lead.entity").Lead>;
    updateLeadPriority(id: string, priority: LeadPriority): Promise<import("../entities/lead.entity").Lead>;
    assignLead(id: string, assignedTo: string): Promise<import("../entities/lead.entity").Lead>;
    getLeadStats(): Promise<{
        total: number;
        new: number;
        contacted: number;
        qualified: number;
        converted: number;
        lost: number;
    }>;
}
