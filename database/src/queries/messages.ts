import type { SupabaseClient } from "@supabase/supabase-js";
import { MessageSchema } from "../schemas";
import type { Message } from "../schemas";

export function createMessageQueries(client: SupabaseClient) {
  return {
    /**
     * Send a message (create outbound message record)
     */
    async createOutbound(
      messageData: Omit<Message, "id" | "created_at" | "status">,
    ) {
      // Verify contact has SMS consent
      const { data: contact, error: contactError } = await client
        .from("contacts")
        .select("sms_consent, sms_opt_out")
        .eq("id", messageData.contact_id)
        .single();

      if (contactError) throw contactError;
      if (!contact.sms_consent || contact.sms_opt_out) {
        throw new Error("Contact has not consented to SMS or has opted out");
      }

      // Create message
      const { data, error } = await client
        .from("messages")
        .insert({
          ...messageData,
          status: "queued",
        })
        .select()
        .single();

      if (error) throw error;
      return MessageSchema.parse(data);
    },

    /**
     * Get conversation thread
     */
    async getConversation(conversationId: string, limit = 50) {
      const { data, error } = await client
        .from("messages")
        .select(
          `
          *,
          contacts!messages_contact_id_fkey (
            id,
            phone,
            first_name,
            last_name
          )
        `,
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(limit);

      if (error) throw error;

      return data.map((item) => ({
        message: MessageSchema.parse(item),
        contact: item.contacts,
      }));
    },

    /**
     * Get recent messages for a customer
     */
    async getRecentByCustomer(customerId: string, days = 7, limit = 100) {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data, error } = await client
        .from("messages")
        .select("*")
        .eq("customer_id", customerId)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data.map((msg) => MessageSchema.parse(msg));
    },

    /**
     * Update message status (for webhooks)
     */
    async updateStatus(
      providerSid: string,
      status: Message["status"],
      metadata?: {
        error_code?: string;
        error_message?: string;
        price?: number;
        delivered_at?: string;
        failed_at?: string;
      },
    ) {
      const updates: Record<string, string | number | undefined> = { status };

      if (status === "delivered" && metadata?.delivered_at) {
        updates.delivered_at = metadata.delivered_at;
      }
      if (status === "failed" && metadata?.failed_at) {
        updates.failed_at = metadata.failed_at;
      }
      if (metadata?.error_code) {
        updates.error_code = metadata.error_code;
      }
      if (metadata?.error_message) {
        updates.error_message = metadata.error_message;
      }
      if (metadata?.price) {
        updates.price = metadata.price;
      }

      const { data, error } = await client
        .from("messages")
        .update(updates)
        .eq("provider_sid", providerSid)
        .select()
        .single();

      if (error) throw error;
      return MessageSchema.parse(data);
    },

    /**
     * Get campaign message statistics
     */
    async getCampaignStats(campaignId: string) {
      const { data, error } = await client
        .from("messages")
        .select("status")
        .eq("campaign_id", campaignId);

      if (error) throw error;

      const stats = {
        total: data.length,
        sent: data.filter((m) => m.status === "sent").length,
        delivered: data.filter((m) => m.status === "delivered").length,
        failed: data.filter((m) => m.status === "failed").length,
        queued: data.filter((m) => m.status === "queued").length,
      };

      return {
        ...stats,
        delivery_rate:
          stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0,
      };
    },
  };
}
