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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = exports.LeadPriority = exports.LeadStatus = exports.LeadSource = void 0;
const class_validator_1 = require("class-validator");
var LeadSource;
(function (LeadSource) {
    LeadSource["CONTACT_FORM"] = "CONTACT_FORM";
    LeadSource["DEMO_REQUEST"] = "DEMO_REQUEST";
    LeadSource["WEBSITE_VISIT"] = "WEBSITE_VISIT";
    LeadSource["REFERRAL"] = "REFERRAL";
    LeadSource["SOCIAL_MEDIA"] = "SOCIAL_MEDIA";
    LeadSource["EMAIL_CAMPAIGN"] = "EMAIL_CAMPAIGN";
    LeadSource["OTHER"] = "OTHER";
})(LeadSource = exports.LeadSource || (exports.LeadSource = {}));
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NEW"] = "NEW";
    LeadStatus["CONTACTED"] = "CONTACTED";
    LeadStatus["QUALIFIED"] = "QUALIFIED";
    LeadStatus["CONVERTED"] = "CONVERTED";
    LeadStatus["LOST"] = "LOST";
})(LeadStatus = exports.LeadStatus || (exports.LeadStatus = {}));
var LeadPriority;
(function (LeadPriority) {
    LeadPriority["LOW"] = "LOW";
    LeadPriority["MEDIUM"] = "MEDIUM";
    LeadPriority["HIGH"] = "HIGH";
    LeadPriority["URGENT"] = "URGENT";
})(LeadPriority = exports.LeadPriority || (exports.LeadPriority = {}));
class Lead {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], Lead.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "job_title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "industry", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "company_size", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "how_did_you_hear", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(LeadSource),
    __metadata("design:type", String)
], Lead.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(LeadStatus),
    __metadata("design:type", String)
], Lead.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(LeadPriority),
    __metadata("design:type", String)
], Lead.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "brand_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "hubspot_contact_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "hubspot_company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "assigned_to", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "last_contact_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Lead.prototype, "next_follow_up_date", void 0);
exports.Lead = Lead;
//# sourceMappingURL=lead.entity.js.map