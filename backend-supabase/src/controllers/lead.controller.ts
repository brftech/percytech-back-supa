import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import {
  LeadService,
  CreateLeadDto,
  CreateLeadActivityDto,
} from "../services/lead.service";
import { LeadStatus, LeadPriority } from "../entities/lead.entity";

@Controller("leads")
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  /**
   * Create a new lead from contact form
   */
  @Post()
  async createLead(@Body(ValidationPipe) createLeadDto: CreateLeadDto) {
    return this.leadService.createLead(createLeadDto);
  }

  /**
   * Create a lead activity
   */
  @Post(":id/activities")
  async createLeadActivity(
    @Param("id") leadId: string,
    @Body(ValidationPipe) createActivityDto: CreateLeadActivityDto
  ) {
    return this.leadService.createLeadActivity({
      ...createActivityDto,
      lead_id: leadId,
    });
  }

  /**
   * Get lead by ID
   */
  @Get(":id")
  async getLead(@Param("id") id: string) {
    return this.leadService.getLeadById(id);
  }

  /**
   * Get lead by email
   */
  @Get("email/:email")
  async getLeadByEmail(@Param("email") email: string) {
    return this.leadService.getLeadByEmail(email);
  }

  /**
   * Get all activities for a lead
   */
  @Get(":id/activities")
  async getLeadActivities(@Param("id") leadId: string) {
    return this.leadService.getLeadActivities(leadId);
  }

  /**
   * Get all leads with optional filtering
   */
  @Get()
  async getLeads(
    @Query("status") status?: LeadStatus,
    @Query("priority") priority?: LeadPriority,
    @Query("assignedTo") assignedTo?: string,
    @Query("brandId") brandId?: string
  ) {
    return this.leadService.getLeads({
      status,
      priority,
      assignedTo,
      brandId,
    });
  }

  /**
   * Search leads
   */
  @Get("search/:query")
  async searchLeads(@Param("query") query: string) {
    return this.leadService.searchLeads(query);
  }

  /**
   * Update lead status
   */
  @Put(":id/status")
  async updateLeadStatus(
    @Param("id") id: string,
    @Body("status") status: LeadStatus
  ) {
    return this.leadService.updateLeadStatus(id, status);
  }

  /**
   * Update lead priority
   */
  @Put(":id/priority")
  async updateLeadPriority(
    @Param("id") id: string,
    @Body("priority") priority: LeadPriority
  ) {
    return this.leadService.updateLeadPriority(id, priority);
  }

  /**
   * Assign lead to a user
   */
  @Put(":id/assign")
  async assignLead(
    @Param("id") id: string,
    @Body("assignedTo") assignedTo: string
  ) {
    return this.leadService.assignLead(id, assignedTo);
  }

  /**
   * Get lead statistics
   */
  @Get("stats/overview")
  async getLeadStats() {
    // This would be implemented in the service
    // For now, return placeholder
    return {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      lost: 0,
    };
  }
}
