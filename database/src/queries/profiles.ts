import type { SupabaseClient } from "@supabase/supabase-js";
import { ProfileSchema, type Profile } from "../schemas";
import type { Customer, Subscription } from "../schemas";

export function createProfileQueries(client: SupabaseClient) {
  return {
    /**
     * Get profile by ID with validation
     */
    async getById(id: string) {
      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return ProfileSchema.parse(data);
    },

    /**
     * Get profile by email
     */
    async getByEmail(email: string) {
      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (error) throw error;
      return ProfileSchema.parse(data);
    },

    /**
     * Get profile with customer and subscription data
     */
    async getWithCustomerData(profileId: string): Promise<{
      profile: Profile;
      customer?: Customer & {
        subscriptions: Subscription[];
      };
    }> {
      const { data, error } = await client
        .from("profiles")
        .select(
          `
          *,
          customers!profiles_id_fkey (
            *,
            subscriptions (*)
          )
        `,
        )
        .eq("id", profileId)
        .single();

      if (error) throw error;

      const profileData: Record<string, unknown> = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        company_name: data.company_name,
        role: data.role,
        brand_access: data.brand_access,
        lead_id: data.lead_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      if (data.phone !== null && data.phone !== undefined) {
        profileData.phone = data.phone;
      }

      const profile = ProfileSchema.parse(profileData);

      const customer = data.customers?.[0];

      return {
        profile,
        customer: customer
          ? {
              ...customer,
              subscriptions: customer.subscriptions || [],
            }
          : undefined,
      };
    },

    /**
     * Update profile
     */
    async update(id: string, updates: Partial<Profile>) {
      const { data, error } = await client
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return ProfileSchema.parse(data);
    },
  };
}
