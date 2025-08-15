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
exports.Onboarding = exports.PaymentStatus = exports.OnboardingStep = void 0;
const class_validator_1 = require("class-validator");
var OnboardingStep;
(function (OnboardingStep) {
    OnboardingStep["EMAIL_VERIFICATION"] = "email_verification";
    OnboardingStep["PAYMENT"] = "payment";
    OnboardingStep["TCR_REGISTRATION"] = "tcr_registration";
    OnboardingStep["BANDWIDTH_SETUP"] = "bandwidth_setup";
    OnboardingStep["GNYMBLE_SETUP"] = "gnymble_setup";
    OnboardingStep["COMPLETED"] = "completed";
})(OnboardingStep = exports.OnboardingStep || (exports.OnboardingStep = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["SUCCEEDED"] = "succeeded";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["CANCELLED"] = "cancelled";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
class Onboarding {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Onboarding.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Onboarding.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Onboarding.prototype, "paymentIntentId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentStatus),
    __metadata("design:type", String)
], Onboarding.prototype, "paymentStatus", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Onboarding.prototype, "emailVerified", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Onboarding.prototype, "tcrCompleted", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Onboarding.prototype, "bandwidthCompleted", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Onboarding.prototype, "gnymbleCompleted", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(OnboardingStep),
    __metadata("design:type", String)
], Onboarding.prototype, "currentStep", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Onboarding.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Onboarding.prototype, "updatedAt", void 0);
exports.Onboarding = Onboarding;
//# sourceMappingURL=onboarding.entity.js.map