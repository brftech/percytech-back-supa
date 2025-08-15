import { Injectable, Logger } from "@nestjs/common";
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

@Injectable()
export class HubSpotService {
  private readonly logger = new Logger(HubSpotService.name);
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.hubapi.com";

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>("HUBSPOT_API_KEY");

    if (!this.apiKey) {
      this.logger.warn("HubSpot API key not configured");
    }
  }

  /**
   * Create or update a contact in HubSpot
   */
  async createOrUpdateContact(
    contact: HubSpotContact
  ): Promise<{ id: string; isNew: boolean }> {
    try {
      if (!this.apiKey) {
        throw new Error("HubSpot API key not configured");
      }

      // First, try to find existing contact by email
      const existingContact = await this.findContactByEmail(contact.email);

      if (existingContact) {
        // Update existing contact
        await this.updateContact(existingContact.id, contact);
        return { id: existingContact.id, isNew: false };
      } else {
        // Create new contact
        const newContact = await this.createContact(contact);
        return { id: newContact.id, isNew: true };
      }
    } catch (error) {
      this.logger.error("Failed to create/update HubSpot contact", error);
      throw error;
    }
  }

  /**
   * Create a new company in HubSpot
   */
  async createCompany(company: HubSpotCompany): Promise<{ id: string }> {
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
    } catch (error) {
      this.logger.error("Failed to create HubSpot company", error);
      throw error;
    }
  }

  /**
   * Create an activity/engagement in HubSpot
   */
  async createActivity(
    contactId: string,
    activity: HubSpotActivity
  ): Promise<{ id: string }> {
    try {
      if (!this.apiKey) {
        throw new Error("HubSpot API key not configured");
      }

      const response = await fetch(
        `${this.baseUrl}/crm/v3/objects/engagements`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: {
              ...activity,
              hs_timestamp: new Date().toISOString(),
            },
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
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return { id: data.id };
    } catch (error) {
      this.logger.error("Failed to create HubSpot activity", error);
      throw error;
    }
  }

  /**
   * Find contact by email
   */
  private async findContactByEmail(
    email: string
  ): Promise<{ id: string } | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/crm/v3/objects/contacts/search`,
        {
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
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return { id: data.results[0].id };
      }

      return null;
    } catch (error) {
      this.logger.error("Failed to find HubSpot contact by email", error);
      return null;
    }
  }

  /**
   * Update existing contact
   */
  private async updateContact(
    contactId: string,
    contact: HubSpotContact
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/crm/v3/objects/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: contact,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
    }
  }

  /**
   * Create new contact
   */
  private async createContact(
    contact: HubSpotContact
  ): Promise<{ id: string }> {
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
}
