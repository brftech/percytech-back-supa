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
var HubSpotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubSpotService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let HubSpotService = HubSpotService_1 = class HubSpotService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(HubSpotService_1.name);
        this.baseUrl = "https://api.hubapi.com";
        this.apiKey = this.configService.get("HUBSPOT_API_KEY");
        if (!this.apiKey) {
            this.logger.warn("HubSpot API key not configured");
        }
    }
    async createOrUpdateContact(contact) {
        try {
            if (!this.apiKey) {
                throw new Error("HubSpot API key not configured");
            }
            const existingContact = await this.findContactByEmail(contact.email);
            if (existingContact) {
                await this.updateContact(existingContact.id, contact);
                return { id: existingContact.id, isNew: false };
            }
            else {
                const newContact = await this.createContact(contact);
                return { id: newContact.id, isNew: true };
            }
        }
        catch (error) {
            this.logger.error("Failed to create/update HubSpot contact", error);
            throw error;
        }
    }
    async createCompany(company) {
        try {
            if (!this.apiKey) {
                throw new Error("HubSpot API key not configured");
            }
            const response = await fetch(`${this.baseUrl}/crm/v3/objects/companies`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    properties: company,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            return { id: data.id };
        }
        catch (error) {
            this.logger.error("Failed to create HubSpot company", error);
            throw error;
        }
    }
    async createActivity(contactId, activity) {
        try {
            if (!this.apiKey) {
                throw new Error("HubSpot API key not configured");
            }
            const response = await fetch(`${this.baseUrl}/crm/v3/objects/engagements`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    properties: Object.assign(Object.assign({}, activity), { hs_timestamp: new Date().toISOString() }),
                    associations: [
                        {
                            to: { id: contactId },
                            types: [
                                {
                                    associationCategory: "HUBSPOT_DEFINED",
                                    associationTypeId: 1,
                                },
                            ],
                        },
                    ],
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            return { id: data.id };
        }
        catch (error) {
            this.logger.error("Failed to create HubSpot activity", error);
            throw error;
        }
    }
    async findContactByEmail(email) {
        try {
            const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts/search`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filterGroups: [
                        {
                            filters: [
                                {
                                    propertyName: "email",
                                    operator: "EQ",
                                    value: email,
                                },
                            ],
                        },
                    ],
                    properties: ["email"],
                    limit: 1,
                }),
            });
            if (!response.ok) {
                return null;
            }
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return { id: data.results[0].id };
            }
            return null;
        }
        catch (error) {
            this.logger.error("Failed to find HubSpot contact by email", error);
            return null;
        }
    }
    async updateContact(contactId, contact) {
        const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts/${contactId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                properties: contact,
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
        }
    }
    async createContact(contact) {
        const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                properties: contact,
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        return { id: data.id };
    }
};
HubSpotService = HubSpotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HubSpotService);
exports.HubSpotService = HubSpotService;
//# sourceMappingURL=hubspot.service.js.map