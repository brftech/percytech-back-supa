import type { SupabaseClient } from "@supabase/supabase-js";
import { CampaignSchema, PhoneNumberSchema } from "../schemas";
import type { Campaign } from "../schemas";

export function createCampaignQueries(client: SupabaseClient) {
  return {
    /**
     * Get campaign with assigned phone numbers
     */
    async getWithPhoneNumbers(campaignId: string) {
      const { data: campaign, error: campaignError } = await client
        .from("campaigns")
        .select("*")
        .eq("id", campaignId)
        .single();

      if (campaignError) throw campaignError;

      const { data: phoneNumbers, error: phoneError } = await client
        .from("phone_numbers")
        .select("*")
        .eq("campaign_id", campaignId)
        .eq("status", "active");

      if (phoneError) throw phoneError;

      return {
        campaign: CampaignSchema.parse(campaign),
        phoneNumbers: phoneNumbers.map((pn) => PhoneNumberSchema.parse(pn)),
      };
    },

    /**
     * Get active campaigns for a customer
     */
    async getActiveByCustomer(customerId: string) {
      const { data, error } = await client
        .from("campaigns")
        .select("*")
        .eq("customer_id", customerId)
        .in("status", ["active", "approved"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map((campaign) => CampaignSchema.parse(campaign));
    },

    /**
     * Create campaign and log audit
     */
    async createWithAudit(
      campaignData: Omit<
        Campaign,
        "id" | "created_at" | "updated_at" | "messages_sent_today"
      >,
      actorId: string,
    ) {
      const { data, error } = await client
        .from("campaigns")
        .insert(campaignData)
        .select()
        .single();

      if (error) throw error;

      // Audit log is created by trigger, but we can add additional metadata
      await client.from("audit_logs").insert({
        actor_id: actorId,
        actor_type: "user",
        customer_id: campaignData.customer_id,
        action: "campaign.created",
        resource_type: "campaign",
        resource_id: data.id,
        metadata: {
          campaign_name: campaignData.campaign_name,
          use_case: campaignData.use_case,
        },
      });

      return CampaignSchema.parse(data);
    },

    /**
     * Update campaign status
     */
    async updateStatus(
      campaignId: string,
      status: Campaign["status"],
      metadata?: {
        rejection_reason?: string;
        tcr_campaign_id?: string;
      },
    ) {
      const updates: Record<string, string | Date> = {
        status,
        [`${status}_at`]: new Date().toISOString(),
      };

      if (metadata?.rejection_reason) {
        updates.rejection_reason = metadata.rejection_reason;
      }
      if (metadata?.tcr_campaign_id) {
        updates.tcr_campaign_id = metadata.tcr_campaign_id;
      }

      const { data, error } = await client
        .from("campaigns")
        .update(updates)
        .eq("id", campaignId)
        .select()
        .single();

      if (error) throw error;
      return CampaignSchema.parse(data);
    },

    /**
     * Check if customer can create more campaigns
     */
    async canCreateCampaign(customerId: string, limit = 10): Promise<boolean> {
      const { count, error } = await client
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .eq("customer_id", customerId)
        .not("status", "in", ["rejected", "paused"]);

      if (error) throw error;
      return (count || 0) < limit;
    },
  };
}
