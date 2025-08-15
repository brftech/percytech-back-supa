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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadController = void 0;
const common_1 = require("@nestjs/common");
const lead_service_1 = require("../services/lead.service");
const lead_entity_1 = require("../entities/lead.entity");
let LeadController = class LeadController {
    constructor(leadService) {
        this.leadService = leadService;
    }
    async createLead(createLeadDto) {
        return this.leadService.createLead(createLeadDto);
    }
    async createLeadActivity(leadId, createActivityDto) {
        return this.leadService.createLeadActivity(Object.assign(Object.assign({}, createActivityDto), { lead_id: leadId }));
    }
    async getLead(id) {
        return this.leadService.getLeadById(id);
    }
    async getLeadByEmail(email) {
        return this.leadService.getLeadByEmail(email);
    }
    async getLeadActivities(leadId) {
        return this.leadService.getLeadActivities(leadId);
    }
    async getLeads(status, priority, assignedTo, brandId) {
        return this.leadService.getLeads({
            status,
            priority,
            assignedTo,
            brandId,
        });
    }
    async searchLeads(query) {
        return this.leadService.searchLeads(query);
    }
    async updateLeadStatus(id, status) {
        return this.leadService.updateLeadStatus(id, status);
    }
    async updateLeadPriority(id, priority) {
        return this.leadService.updateLeadPriority(id, priority);
    }
    async assignLead(id, assignedTo) {
        return this.leadService.assignLead(id, assignedTo);
    }
    async getLeadStats() {
        return {
            total: 0,
            new: 0,
            contacted: 0,
            qualified: 0,
            converted: 0,
            lost: 0,
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "createLead", null);
__decorate([
    (0, common_1.Post)(":id/activities"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "createLeadActivity", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "getLead", null);
__decorate([
    (0, common_1.Get)("email/:email"),
    __param(0, (0, common_1.Param)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "getLeadByEmail", null);
__decorate([
    (0, common_1.Get)(":id/activities"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "getLeadActivities", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("status")),
    __param(1, (0, common_1.Query)("priority")),
    __param(2, (0, common_1.Query)("assignedTo")),
    __param(3, (0, common_1.Query)("brandId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "getLeads", null);
__decorate([
    (0, common_1.Get)("search/:query"),
    __param(0, (0, common_1.Param)("query")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "searchLeads", null);
__decorate([
    (0, common_1.Put)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "updateLeadStatus", null);
__decorate([
    (0, common_1.Put)(":id/priority"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("priority")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "updateLeadPriority", null);
__decorate([
    (0, common_1.Put)(":id/assign"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("assignedTo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "assignLead", null);
__decorate([
    (0, common_1.Get)("stats/overview"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "getLeadStats", null);
LeadController = __decorate([
    (0, common_1.Controller)("leads"),
    __metadata("design:paramtypes", [lead_service_1.LeadService])
], LeadController);
exports.LeadController = LeadController;
//# sourceMappingURL=lead.controller.js.map