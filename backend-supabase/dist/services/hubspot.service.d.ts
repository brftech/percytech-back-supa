import { ConfigService } from "@nestjs/config";
export interface HubSpotContact {
    email: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
    jobtitle?: string;
    website?: string;
    industry?: string;
    company_size?: string;
    lifecyclestage?: string;
    lead_status?: string;
    source?: string;
    notes?: string;
}
export interface HubSpotCompany {
    name: string;
    domain?: string;
    industry?: string;
    company_size?: string;
    description?: string;
}
export interface HubSpotActivity {
    subject: string;
    description?: string;
    activityType: string;
    status: string;
    scheduledDate?: string;
    completedDate?: string;
}
export declare class HubSpotService {
    private configService;
    private readonly logger;
    private readonly apiKey;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    createOrUpdateContact(contact: HubSpotContact): Promise<{
        id: string;
        isNew: boolean;
    }>;
    createCompany(company: HubSpotCompany): Promise<{
        id: string;
    }>;
    createActivity(contactId: string, activity: HubSpotActivity): Promise<{
        id: string;
    }>;
    private findContactByEmail;
    private updateContact;
    private createContact;
}
