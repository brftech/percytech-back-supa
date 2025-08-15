import type { SupabaseClient } from "@supabase/supabase-js";
import { LeadSchema } from "../schemas";
import type { Lead } from "../schemas";
import { normalizeEmail, normalizePhone } from "@percytech/utils-contact";

export function createLeadQueries(client: SupabaseClient) {
  return {
    /**
     * Create a new lead with validation and normalization
     */
    async create(leadData: Partial<Lead>) {
      // Normalize contact data
      const normalizedData = {
        ...leadData,
        email_normalized: normalizeEmail(leadData.email),
        phone_normalized: normalizePhone(leadData.phone || undefined, {
          defaultCountry: "US",
        }),
      };

      const { data, error } = await client
        .from("leads")
        .insert(normalizedData)
        .select()
        .single();

      if (error) throw error;
      return LeadSchema.parse(data);
    },

    /**
     * Find lead by email or phone (using normalized fields for better matching)
     */
    async findByContact(email?: string, phone?: string) {
      let query = client.from("leads").select("*");

      // Normalize the search inputs
      const email_normalized = normalizeEmail(email);
      const phone_normalized = normalizePhone(phone || undefined, {
        defaultCountry: "US",
      });

      if (email_normalized && phone_normalized) {
        query = query.or(
          `email_normalized.eq.${email_normalized},phone_normalized.eq.${phone_normalized}`,
        );
      } else if (email_normalized) {
        query = query.eq("email_normalized", email_normalized);
      } else if (phone_normalized) {
        query = query.eq("phone_normalized", phone_normalized);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
      return data ? LeadSchema.parse(data) : null;
    },

    /**
     * Update lead and log activity
     */
    async updateWithActivity(
      leadId: string,
      updates: Partial<Lead>,
      activity: {
        activity_type: string;
        activity_data?: Record<string, unknown>;
        [key: string]: string | Record<string, unknown> | undefined;
      },
    ) {
      // Add timestamps to updates
      const updatesWithTimestamps = {
        ...updates,
        updated_at: new Date().toISOString(),
        last_interaction_at: new Date().toISOString(),
      };

      // Update lead
      const { data: lead, error: leadError } = await client
        .from("leads")
        .update(updatesWithTimestamps)
        .eq("id", leadId)
        .select()
        .single();

      if (leadError) throw leadError;

      // Create activity (don't throw on error, just log it)
      const { error: activityError } = await client
        .from("lead_activities")
        .insert({
          lead_id: leadId,
          ...activity,
        });

      if (activityError) {
        console.error("Failed to create lead activity:", activityError);
      }

      return LeadSchema.parse(lead);
    },

    /**
     * Get leads by platform interest
     */
    async getByPlatformInterest(
      platform: string,
      options: { limit?: number; offset?: number } = {},
    ) {
      const { limit = 50, offset = 0 } = options;

      const query = client
        .from("leads")
        .select("*")
        .eq("platform_interest", platform)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;
      return data.map((lead) => LeadSchema.parse(lead));
    },

    /**
     * Get recently engaged leads
     */
    async getRecentlyEngaged(daysAgo = 7, limit = 100) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      const { data, error } = await client
        .from("leads")
        .select("*")
        .gte("last_interaction_at", cutoffDate.toISOString())
        .order("last_interaction_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data.map((lead) => LeadSchema.parse(lead));
    },

    /**
     * Get recent leads with activity
     */
    async getRecentWithActivity(days = 7, limit = 100) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await client
        .from("leads")
        .select(
          `
          *,
          lead_activities!inner(*)
        `,
        )
        .gte("lead_activities.created_at", cutoffDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data.map((lead) => LeadSchema.parse(lead));
    },
  };
}
