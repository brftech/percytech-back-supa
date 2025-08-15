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
exports.Brand = exports.BrandStatus = exports.Vertical = exports.EntityType = void 0;
const class_validator_1 = require("class-validator");
var EntityType;
(function (EntityType) {
    EntityType["PRIVATE_PROFIT"] = "PRIVATE_PROFIT";
    EntityType["PUBLIC_PROFIT"] = "PUBLIC_PROFIT";
    EntityType["NON_PROFIT"] = "NON_PROFIT";
    EntityType["GOVERNMENT"] = "GOVERNMENT";
    EntityType["SOLE_PROPRIETOR"] = "SOLE_PROPRIETOR";
})(EntityType = exports.EntityType || (exports.EntityType = {}));
var Vertical;
(function (Vertical) {
    Vertical["AGRICULTURE"] = "AGRICULTURE";
    Vertical["AUTOMOTIVE"] = "AUTOMOTIVE";
    Vertical["BANKING_FINANCE"] = "BANKING_FINANCE";
    Vertical["CONSUMER_GOODS"] = "CONSUMER_GOODS";
    Vertical["EDUCATION"] = "EDUCATION";
    Vertical["EMERGENCY"] = "EMERGENCY";
    Vertical["ENERGY_UTILITIES"] = "ENERGY_UTILITIES";
    Vertical["ENTERTAINMENT"] = "ENTERTAINMENT";
    Vertical["FOOD_BEVERAGE"] = "FOOD_BEVERAGE";
    Vertical["GOVERNMENT"] = "GOVERNMENT";
    Vertical["HEALTHCARE"] = "HEALTHCARE";
    Vertical["HOSPITALITY_TRAVEL"] = "HOSPITALITY_TRAVEL";
    Vertical["INSURANCE"] = "INSURANCE";
    Vertical["INTERNET"] = "INTERNET";
    Vertical["LEGAL"] = "LEGAL";
    Vertical["MANUFACTURING"] = "MANUFACTURING";
    Vertical["MEDIA"] = "MEDIA";
    Vertical["NON_PROFIT"] = "NON_PROFIT";
    Vertical["PHARMACEUTICALS"] = "PHARMACEUTICALS";
    Vertical["POLITICAL"] = "POLITICAL";
    Vertical["PROFESSIONAL_SERVICES"] = "PROFESSIONAL_SERVICES";
    Vertical["PUBLIC_SAFETY"] = "PUBLIC_SAFETY";
    Vertical["REAL_ESTATE"] = "REAL_ESTATE";
    Vertical["RELIGION"] = "RELIGION";
    Vertical["RETAIL"] = "RETAIL";
    Vertical["TECHNOLOGY"] = "TECHNOLOGY";
    Vertical["TELECOMMUNICATIONS"] = "TELECOMMUNICATIONS";
    Vertical["TRANSPORTATION"] = "TRANSPORTATION";
})(Vertical = exports.Vertical || (exports.Vertical = {}));
var BrandStatus;
(function (BrandStatus) {
    BrandStatus["PENDING"] = "PENDING";
    BrandStatus["APPROVED"] = "APPROVED";
    BrandStatus["REJECTED"] = "REJECTED";
    BrandStatus["SUSPENDED"] = "SUSPENDED";
})(BrandStatus = exports.BrandStatus || (exports.BrandStatus = {}));
class Brand {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "ein", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EntityType),
    __metadata("design:type", String)
], Brand.prototype, "entityType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(Vertical),
    __metadata("design:type", String)
], Brand.prototype, "vertical", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], Brand.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "postalCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "stockSymbol", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "stockExchange", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "ipAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "altBusinessId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "altBusinessIdType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(BrandStatus),
    __metadata("design:type", String)
], Brand.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Brand.prototype, "updatedAt", void 0);
exports.Brand = Brand;
//# sourceMappingURL=brand.entity.js.map