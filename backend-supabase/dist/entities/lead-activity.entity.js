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
exports.LeadActivity = exports.LeadActivityStatus = exports.LeadActivityType = void 0;
const class_validator_1 = require("class-validator");
var LeadActivityType;
(function (LeadActivityType) {
    LeadActivityType["CONTACT_FORM_SUBMISSION"] = "CONTACT_FORM_SUBMISSION";
    LeadActivityType["DEMO_REQUEST"] = "DEMO_REQUEST";
    LeadActivityType["EMAIL_OPEN"] = "EMAIL_OPEN";
    LeadActivityType["EMAIL_CLICK"] = "EMAIL_CLICK";
    LeadActivityType["WEBSITE_VISIT"] = "WEBSITE_VISIT";
    LeadActivityType["PHONE_CALL"] = "PHONE_CALL";
    LeadActivityType["MEETING_SCHEDULED"] = "MEETING_SCHEDULED";
    LeadActivityType["MEETING_COMPLETED"] = "MEETING_COMPLETED";
    LeadActivityType["PROPOSAL_SENT"] = "PROPOSAL_SENT";
    LeadActivityType["PROPOSAL_VIEWED"] = "PROPOSAL_VIEWED";
    LeadActivityType["CONVERSION"] = "CONVERSION";
    LeadActivityType["OTHER"] = "OTHER";
})(LeadActivityType = exports.LeadActivityType || (exports.LeadActivityType = {}));
var LeadActivityStatus;
(function (LeadActivityStatus) {
    LeadActivityStatus["PENDING"] = "PENDING";
    LeadActivityStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LeadActivityStatus["COMPLETED"] = "COMPLETED";
    LeadActivityStatus["FAILED"] = "FAILED";
    LeadActivityStatus["CANCELLED"] = "CANCELLED";
})(LeadActivityStatus = exports.LeadActivityStatus || (exports.LeadActivityStatus = {}));
class LeadActivity {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "lead_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(LeadActivityType),
    __metadata("design:type", String)
], LeadActivity.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(LeadActivityStatus),
    __metadata("design:type", String)
], LeadActivity.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "outcome", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "assigned_to", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "scheduled_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "completed_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadActivity.prototype, "hubspot_activity_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], LeadActivity.prototype, "metadata", void 0);
exports.LeadActivity = LeadActivity;
//# sourceMappingURL=lead-activity.entity.js.map