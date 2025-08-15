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
exports.Payment = exports.Currency = exports.PaymentEntityStatus = void 0;
const class_validator_1 = require("class-validator");
var PaymentEntityStatus;
(function (PaymentEntityStatus) {
    PaymentEntityStatus["PENDING"] = "pending";
    PaymentEntityStatus["SUCCEEDED"] = "succeeded";
    PaymentEntityStatus["FAILED"] = "failed";
    PaymentEntityStatus["CANCELLED"] = "cancelled";
    PaymentEntityStatus["REFUNDED"] = "refunded";
})(PaymentEntityStatus = exports.PaymentEntityStatus || (exports.PaymentEntityStatus = {}));
var Currency;
(function (Currency) {
    Currency["USD"] = "usd";
    Currency["EUR"] = "eur";
    Currency["GBP"] = "gbp";
})(Currency = exports.Currency || (exports.Currency = {}));
class Payment {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Payment.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Payment.prototype, "paymentIntentId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentEntityStatus),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Payment.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Payment.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Payment.prototype, "updatedAt", void 0);
exports.Payment = Payment;
//# sourceMappingURL=payment.entity.js.map