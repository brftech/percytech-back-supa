export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string | null
          customer_id: string
          expires_at: string | null
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          permissions: string[] | null
          rate_limit: number | null
          revoked_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          expires_at?: string | null
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          permissions?: string[] | null
          rate_limit?: number | null
          revoked_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          expires_at?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          permissions?: string[] | null
          rate_limit?: number | null
          revoked_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          actor_type: string
          changes: Json | null
          created_at: string | null
          customer_id: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          success: boolean | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          actor_type: string
          changes?: Json | null
          created_at?: string | null
          customer_id?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          success?: boolean | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          actor_type?: string
          changes?: Json | null
          created_at?: string | null
          customer_id?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          success?: boolean | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          approved_at: string | null
          brand: string
          campaign_name: string
          created_at: string | null
          customer_id: string
          daily_message_limit: number | null
          description: string
          help_message: string
          id: string
          messages_sent_today: number | null
          privacy_url: string | null
          rejected_at: string | null
          rejection_reason: string | null
          sample_messages: string[]
          status: string | null
          stop_message: string
          submitted_at: string | null
          tcr_brand_id: string | null
          tcr_campaign_id: string | null
          terms_url: string | null
          updated_at: string | null
          use_case: string
        }
        Insert: {
          approved_at?: string | null
          brand: string
          campaign_name: string
          created_at?: string | null
          customer_id: string
          daily_message_limit?: number | null
          description: string
          help_message: string
          id?: string
          messages_sent_today?: number | null
          privacy_url?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          sample_messages: string[]
          status?: string | null
          stop_message: string
          submitted_at?: string | null
          tcr_brand_id?: string | null
          tcr_campaign_id?: string | null
          terms_url?: string | null
          updated_at?: string | null
          use_case: string
        }
        Update: {
          approved_at?: string | null
          brand?: string
          campaign_name?: string
          created_at?: string | null
          customer_id?: string
          daily_message_limit?: number | null
          description?: string
          help_message?: string
          id?: string
          messages_sent_today?: number | null
          privacy_url?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          sample_messages?: string[]
          status?: string | null
          stop_message?: string
          submitted_at?: string | null
          tcr_brand_id?: string | null
          tcr_campaign_id?: string | null
          terms_url?: string | null
          updated_at?: string | null
          use_case?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_preferences: {
        Row: {
          change_reason: string | null
          change_source: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          lead_id: string
          new_value: string | null
          old_value: string | null
          preference_type: string
          user_agent: string | null
        }
        Insert: {
          change_reason?: string | null
          change_source: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          lead_id: string
          new_value?: string | null
          old_value?: string | null
          preference_type: string
          user_agent?: string | null
        }
        Update: {
          change_reason?: string | null
          change_source?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          lead_id?: string
          new_value?: string | null
          old_value?: string | null
          preference_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_preferences_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string | null
          custom_fields: Json | null
          customer_id: string
          email: string | null
          first_name: string | null
          id: string
          last_message_received_at: string | null
          last_message_sent_at: string | null
          last_name: string | null
          lead_id: string | null
          phone: string
          sms_consent: boolean | null
          sms_consent_at: string | null
          sms_opt_out: boolean | null
          sms_opt_out_at: string | null
          source: string | null
          tags: string[] | null
          total_messages_received: number | null
          total_messages_sent: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_fields?: Json | null
          customer_id: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_message_received_at?: string | null
          last_message_sent_at?: string | null
          last_name?: string | null
          lead_id?: string | null
          phone: string
          sms_consent?: boolean | null
          sms_consent_at?: string | null
          sms_opt_out?: boolean | null
          sms_opt_out_at?: string | null
          source?: string | null
          tags?: string[] | null
          total_messages_received?: number | null
          total_messages_sent?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_fields?: Json | null
          customer_id?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_message_received_at?: string | null
          last_message_sent_at?: string | null
          last_name?: string | null
          lead_id?: string | null
          phone?: string
          sms_consent?: boolean | null
          sms_consent_at?: string | null
          sms_opt_out?: boolean | null
          sms_opt_out_at?: string | null
          source?: string | null
          tags?: string[] | null
          total_messages_received?: number | null
          total_messages_sent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          closed_at: string | null
          contact_id: string
          created_at: string | null
          customer_id: string
          id: string
          last_message_at: string | null
          status: string | null
          subject: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          closed_at?: string | null
          contact_id: string
          created_at?: string | null
          customer_id: string
          id?: string
          last_message_at?: string | null
          status?: string | null
          subject?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          closed_at?: string | null
          contact_id?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          last_message_at?: string | null
          status?: string | null
          subject?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string | null
          customer_number: number
          id: string
          primary_brand: string
          profile_id: string
          status: string | null
          stripe_customer_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_number?: number
          id?: string
          primary_brand: string
          profile_id: string
          status?: string | null
          stripe_customer_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_number?: number
          id?: string
          primary_brand?: string
          profile_id?: string
          status?: string | null
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          activity_type: string
          biggest_challenge: string | null
          business_type: string | null
          channel: string
          created_at: string | null
          current_provider: string | null
          email_action: string | null
          email_campaign_id: string | null
          email_subject: string | null
          id: string
          ip_address: unknown | null
          lead_id: string
          message: string | null
          metadata: Json | null
          monthly_volume: string | null
          page_url: string | null
          platform_interest: string | null
          practice_type: string | null
          referrer: string | null
          sms_body: string | null
          sms_consent_given: boolean | null
          sms_from: string | null
          sms_status: string | null
          sms_to: string | null
          source: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          activity_type: string
          biggest_challenge?: string | null
          business_type?: string | null
          channel: string
          created_at?: string | null
          current_provider?: string | null
          email_action?: string | null
          email_campaign_id?: string | null
          email_subject?: string | null
          id?: string
          ip_address?: unknown | null
          lead_id: string
          message?: string | null
          metadata?: Json | null
          monthly_volume?: string | null
          page_url?: string | null
          platform_interest?: string | null
          practice_type?: string | null
          referrer?: string | null
          sms_body?: string | null
          sms_consent_given?: boolean | null
          sms_from?: string | null
          sms_status?: string | null
          sms_to?: string | null
          source?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          activity_type?: string
          biggest_challenge?: string | null
          business_type?: string | null
          channel?: string
          created_at?: string | null
          current_provider?: string | null
          email_action?: string | null
          email_campaign_id?: string | null
          email_subject?: string | null
          id?: string
          ip_address?: unknown | null
          lead_id?: string
          message?: string | null
          metadata?: Json | null
          monthly_volume?: string | null
          page_url?: string | null
          platform_interest?: string | null
          practice_type?: string | null
          referrer?: string | null
          sms_body?: string | null
          sms_consent_given?: boolean | null
          sms_from?: string | null
          sms_status?: string | null
          sms_to?: string | null
          source?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string | null
          email_normalized: string | null
          email_verified: boolean | null
          email_verified_at: string | null
          how_did_you_hear: string | null
          id: string
          interaction_count: number
          last_interaction_at: string | null
          name: string | null
          phone: string | null
          phone_normalized: string | null
          phone_verified: boolean | null
          phone_verified_at: string | null
          platform_interest: string | null
          preferred_contact_method: string | null
          preferred_time_zone: string | null
          sms_consent: boolean | null
          sms_consent_at: string | null
          sms_consent_ip: unknown | null
          sms_consent_text: string | null
          sms_opt_out: boolean | null
          sms_opt_out_at: string | null
          source: string | null
          trust_score: number | null
          updated_at: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          verification_level: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          email_normalized?: string | null
          email_verified?: boolean | null
          email_verified_at?: string | null
          how_did_you_hear?: string | null
          id?: string
          interaction_count?: number
          last_interaction_at?: string | null
          name?: string | null
          phone?: string | null
          phone_normalized?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          platform_interest?: string | null
          preferred_contact_method?: string | null
          preferred_time_zone?: string | null
          sms_consent?: boolean | null
          sms_consent_at?: string | null
          sms_consent_ip?: unknown | null
          sms_consent_text?: string | null
          sms_opt_out?: boolean | null
          sms_opt_out_at?: string | null
          source?: string | null
          trust_score?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          verification_level?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          email_normalized?: string | null
          email_verified?: boolean | null
          email_verified_at?: string | null
          how_did_you_hear?: string | null
          id?: string
          interaction_count?: number
          last_interaction_at?: string | null
          name?: string | null
          phone?: string | null
          phone_normalized?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          platform_interest?: string | null
          preferred_contact_method?: string | null
          preferred_time_zone?: string | null
          sms_consent?: boolean | null
          sms_consent_at?: string | null
          sms_consent_ip?: unknown | null
          sms_consent_text?: string | null
          sms_opt_out?: boolean | null
          sms_opt_out_at?: string | null
          source?: string | null
          trust_score?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          verification_level?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          campaign_id: string | null
          contact_id: string
          conversation_id: string | null
          created_at: string | null
          customer_id: string
          delivered_at: string | null
          direction: string
          error_code: string | null
          error_message: string | null
          failed_at: string | null
          from_number: string
          id: string
          media_urls: string[] | null
          phone_number_id: string | null
          price: number | null
          provider: string
          provider_sid: string | null
          segments: number | null
          sent_at: string | null
          status: string
          to_number: string
        }
        Insert: {
          body: string
          campaign_id?: string | null
          contact_id: string
          conversation_id?: string | null
          created_at?: string | null
          customer_id: string
          delivered_at?: string | null
          direction: string
          error_code?: string | null
          error_message?: string | null
          failed_at?: string | null
          from_number: string
          id?: string
          media_urls?: string[] | null
          phone_number_id?: string | null
          price?: number | null
          provider: string
          provider_sid?: string | null
          segments?: number | null
          sent_at?: string | null
          status: string
          to_number: string
        }
        Update: {
          body?: string
          campaign_id?: string | null
          contact_id?: string
          conversation_id?: string | null
          created_at?: string | null
          customer_id?: string
          delivered_at?: string | null
          direction?: string
          error_code?: string | null
          error_message?: string | null
          failed_at?: string | null
          from_number?: string
          id?: string
          media_urls?: string[] | null
          phone_number_id?: string | null
          price?: number | null
          provider?: string
          provider_sid?: string | null
          segments?: number | null
          sent_at?: string | null
          status?: string
          to_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_phone_number_id_fkey"
            columns: ["phone_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          company_info_completed: boolean | null
          company_info_completed_at: string | null
          created_at: string | null
          current_step: string | null
          email_verified: boolean | null
          email_verified_at: string | null
          first_campaign_created: boolean | null
          first_campaign_created_at: string | null
          first_message_sent: boolean | null
          first_message_sent_at: string | null
          id: string
          last_activity_at: string | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          payment_completed: boolean | null
          payment_completed_at: string | null
          phone_verified: boolean | null
          phone_verified_at: string | null
          profile_id: string
        }
        Insert: {
          company_info_completed?: boolean | null
          company_info_completed_at?: string | null
          created_at?: string | null
          current_step?: string | null
          email_verified?: boolean | null
          email_verified_at?: string | null
          first_campaign_created?: boolean | null
          first_campaign_created_at?: string | null
          first_message_sent?: boolean | null
          first_message_sent_at?: string | null
          id?: string
          last_activity_at?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          payment_completed?: boolean | null
          payment_completed_at?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          profile_id: string
        }
        Update: {
          company_info_completed?: boolean | null
          company_info_completed_at?: string | null
          created_at?: string | null
          current_step?: string | null
          email_verified?: boolean | null
          email_verified_at?: string | null
          first_campaign_created?: boolean | null
          first_campaign_created_at?: string | null
          first_message_sent?: boolean | null
          first_message_sent_at?: string | null
          id?: string
          last_activity_at?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          payment_completed?: boolean | null
          payment_completed_at?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_history: {
        Row: {
          amount: number
          attempted_at: string | null
          created_at: string | null
          currency: string | null
          customer_id: string
          description: string | null
          failed_at: string | null
          failure_reason: string | null
          id: string
          metadata: Json | null
          payment_type: string
          status: string
          stripe_charge_id: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          subscription_id: string | null
          succeeded_at: string | null
        }
        Insert: {
          amount: number
          attempted_at?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id: string
          description?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          payment_type: string
          status: string
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          succeeded_at?: string | null
        }
        Update: {
          amount?: number
          attempted_at?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string
          description?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          payment_type?: string
          status?: string
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          succeeded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_numbers: {
        Row: {
          campaign_id: string | null
          capabilities: string[] | null
          created_at: string | null
          customer_id: string
          friendly_name: string | null
          id: string
          last_message_at: string | null
          messages_sent_today: number | null
          messages_sent_total: number | null
          monthly_cost: number
          phone_number: string
          provider: string
          provider_sid: string | null
          purchased_at: string | null
          released_at: string | null
          status: string | null
          usage_cost_today: number | null
        }
        Insert: {
          campaign_id?: string | null
          capabilities?: string[] | null
          created_at?: string | null
          customer_id: string
          friendly_name?: string | null
          id?: string
          last_message_at?: string | null
          messages_sent_today?: number | null
          messages_sent_total?: number | null
          monthly_cost: number
          phone_number: string
          provider: string
          provider_sid?: string | null
          purchased_at?: string | null
          released_at?: string | null
          status?: string | null
          usage_cost_today?: number | null
        }
        Update: {
          campaign_id?: string | null
          capabilities?: string[] | null
          created_at?: string | null
          customer_id?: string
          friendly_name?: string | null
          id?: string
          last_message_at?: string | null
          messages_sent_today?: number | null
          messages_sent_total?: number | null
          monthly_cost?: number
          phone_number?: string
          provider?: string
          provider_sid?: string | null
          purchased_at?: string | null
          released_at?: string | null
          status?: string | null
          usage_cost_today?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "phone_numbers_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_numbers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          brand_access: string[] | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          lead_id: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          brand_access?: string[] | null
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          lead_id?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_access?: string[] | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          lead_id?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          brand: string
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          customer_id: string
          id: string
          interval: string
          plan_name: string
          status: string
          stripe_price_id: string
          stripe_subscription_id: string
        }
        Insert: {
          amount: number
          brand: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id: string
          id?: string
          interval: string
          plan_name: string
          status: string
          stripe_price_id: string
          stripe_subscription_id: string
        }
        Update: {
          amount?: number
          brand?: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string
          id?: string
          interval?: string
          plan_name?: string
          status?: string
          stripe_price_id?: string
          stripe_subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_records: {
        Row: {
          contacts_active: number | null
          created_at: string | null
          customer_id: string
          id: string
          messages_received: number | null
          messages_sent: number | null
          overage_charges: number | null
          overage_messages: number | null
          period_end: string
          period_start: string
          period_type: string
          phone_numbers_active: number | null
          plan_messages_limit: number | null
          plan_phone_numbers_limit: number | null
        }
        Insert: {
          contacts_active?: number | null
          created_at?: string | null
          customer_id: string
          id?: string
          messages_received?: number | null
          messages_sent?: number | null
          overage_charges?: number | null
          overage_messages?: number | null
          period_end: string
          period_start: string
          period_type: string
          phone_numbers_active?: number | null
          plan_messages_limit?: number | null
          plan_phone_numbers_limit?: number | null
        }
        Update: {
          contacts_active?: number | null
          created_at?: string | null
          customer_id?: string
          id?: string
          messages_received?: number | null
          messages_sent?: number | null
          overage_charges?: number | null
          overage_messages?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          phone_numbers_active?: number | null
          plan_messages_limit?: number | null
          plan_phone_numbers_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_records_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aggregate_daily_usage: {
        Args: { p_date: string }
        Returns: undefined
      }
      get_campaign_message_stats: {
        Args: { p_campaign_id: string }
        Returns: {
          total: number
          sent: number
          delivered: number
          failed: number
          total_cost: number
        }[]
      }
      get_customer_usage_summary: {
        Args: {
          p_customer_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          messages_sent: number
          messages_received: number
          unique_contacts: number
          total_cost: number
          phone_numbers_used: number
        }[]
      }
      get_onboarding_funnel: {
        Args: { p_start_date?: string; p_end_date?: string }
        Returns: {
          total_signups: number
          email_verified: number
          phone_verified: number
          payment_completed: number
          company_info_completed: number
          first_campaign_created: number
          first_message_sent: number
          fully_onboarded: number
          avg_time_to_onboard: unknown
        }[]
      }
      get_user_customer_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      reset_daily_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      search_contacts: {
        Args: {
          p_customer_id: string
          p_search_term?: string
          p_tags?: string[]
          p_has_consent?: boolean
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          phone: string
          email: string
          first_name: string
          last_name: string
          tags: string[]
          sms_consent: boolean
          last_message_at: string
          total_messages: number
        }[]
      }
    }
    Enums: {
      how_hear_enum: "Google" | "Social" | "Referral" | "Ad" | "Event" | "Other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      how_hear_enum: ["Google", "Social", "Referral", "Ad", "Event", "Other"],
    },
  },
} as const
