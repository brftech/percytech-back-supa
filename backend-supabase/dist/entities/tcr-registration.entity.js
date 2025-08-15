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
exports.TCRRegistration = exports.TCRStatus = void 0;
const class_validator_1 = require("class-validator");
var TCRStatus;
(function (TCRStatus) {
    TCRStatus["PENDING"] = "PENDING";
    TCRStatus["SUBMITTED"] = "SUBMITTED";
    TCRStatus["APPROVED"] = "APPROVED";
    TCRStatus["REJECTED"] = "REJECTED";
    TCRStatus["SUSPENDED"] = "SUSPENDED";
})(TCRStatus = exports.TCRStatus || (exports.TCRStatus = {}));
class TCRRegistration {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TCRRegistration.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TCRRegistration.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TCRRegistration.prototype, "brandId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TCRRegistration.prototype, "campaignId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TCRRegistration.prototype, "tcrBrandId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TCRRegistration.prototype, "tcrCampaignId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(TCRStatus),
    __metadata("design:type", String)
], TCRRegistration.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TCRRegistration.prototype, "tcrResponse", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TCRRegistration.prototype, "errorMessage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TCRRegistration.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TCRRegistration.prototype, "updatedAt", void 0);
exports.TCRRegistration = TCRRegistration;
//# sourceMappingURL=tcr-registration.entity.js.map