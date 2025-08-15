import { z } from "zod";

// Enum schemas
export const BrandSchema = z.enum([
  "gnymble",
  "percymd",
  "percytext",
  "percytech",
]);
export const ContactMethodSchema = z.enum(["sms", "email", "both"]);
export const RoleSchema = z.enum(["customer", "admin", "support"]);

// Lead schemas
export const LeadSchema = z
  .object({
    id: z.string().uuid(),
    phone: z.string().nullable().optional(),
    phone_normalized: z.string().nullable().optional(),

    email: z.string().email().nullable().optional(),
    email_normalized: z.string().nullable().optional(),
    email_verified: z.boolean().nullable().optional(),
    email_verified_at: z.string().datetime().nullable().optional(),
    preferred_contact_method: ContactMethodSchema.optional(),
    sms_consent: z.boolean().nullable().optional(),
    sms_consent_text: z.string().nullable().optional(),
    sms_consent_at: z.string().datetime().nullable().optional(),
    sms_consent_ip: z.string().nullable().optional(),
    sms_opt_out: z.boolean().nullable().optional(),
    sms_opt_out_at: z.string().datetime().nullable().optional(),
    name: z.string().nullable().optional(),
    company_name: z.string().nullable().optional(),
    preferred_time_zone: z.string().nullable().optional(),
    platform_interest: z
      .union([BrandSchema, z.literal("multiple")])
      .nullable()
      .optional(),
    source: z.string().nullable().optional(),
    utm_source: z.string().nullable().optional(),
    utm_medium: z.string().nullable().optional(),
    utm_campaign: z.string().nullable().optional(),
    how_did_you_hear: z.string().nullable().optional(),
    trust_score: z.number().min(0).max(1).nullable().optional(),
    verification_level: z
      .enum(["unverified", "email_verified", "phone_verified", "both_verified"])
      .nullable()
      .optional(),
    interaction_count: z.number().int().min(0).optional(),
    last_interaction_at: z.string().datetime().nullable().optional(),
    created_at: z.string().datetime().nullable().optional(),
    updated_at: z.string().datetime().nullable().optional(),
  })
  .refine((data) => data.phone || data.email, {
    message: "At least one contact method (phone or email) is required",
  });

// Profile schema
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  phone: z.string().optional(),
  full_name: z.string().optional(),
  company_name: z.string().optional(),
  role: RoleSchema,
  brand_access: z.array(BrandSchema),
  lead_id: z.string().uuid().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Customer schema
export const CustomerSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  customer_number: z.number().int(),
  stripe_customer_id: z.string().optional(),
  status: z.enum(["active", "inactive", "cancelled"]),
  primary_brand: BrandSchema,
  created_at: z.string().datetime(),
});

// Subscription schema
export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  stripe_subscription_id: z.string(),
  stripe_price_id: z.string(),
  brand: BrandSchema,
  plan_name: z.string(),
  amount: z.number().int().min(0),
  interval: z.enum(["month", "year"]),
  status: z.enum(["active", "past_due", "cancelled"]),
  current_period_start: z.string().datetime().optional(),
  current_period_end: z.string().datetime().optional(),
  created_at: z.string().datetime(),
});

// Campaign schema
export const CampaignSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  campaign_name: z.string().min(1),
  brand: BrandSchema,
  status: z.enum([
    "draft",
    "pending_approval",
    "approved",
    "rejected",
    "active",
    "paused",
  ]),
  tcr_campaign_id: z.string().optional(),
  tcr_brand_id: z.string().optional(),
  use_case: z.string(),
  description: z.string(),
  sample_messages: z.array(z.string()).min(1),
  help_message: z.string(),
  stop_message: z.string(),
  terms_url: z.string().url().optional(),
  privacy_url: z.string().url().optional(),
  daily_message_limit: z.number().int().min(0),
  messages_sent_today: z.number().int().min(0),
  submitted_at: z.string().datetime().optional(),
  approved_at: z.string().datetime().optional(),
  rejected_at: z.string().datetime().optional(),
  rejection_reason: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Phone Number schema
export const PhoneNumberSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  phone_number: z.string().regex(/^\+[1-9]\d{1,14}$/), // E.164 format
  friendly_name: z.string().optional(),
  campaign_id: z.string().uuid().optional(),
  provider: z.enum(["twilio", "bandwidth"]),
  provider_sid: z.string().optional(),
  capabilities: z.array(z.string()),
  status: z.enum(["active", "suspended", "released"]),
  messages_sent_today: z.number().int().min(0),
  messages_sent_total: z.number().int().min(0),
  last_message_at: z.string().datetime().optional(),
  monthly_cost: z.number().int().min(0),
  usage_cost_today: z.number().int().min(0),
  purchased_at: z.string().datetime(),
  released_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
});

// Contact schema
export const ContactSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  phone: z.string(),
  email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  source: z.string().optional(),
  lead_id: z.string().uuid().optional(),
  sms_consent: z.boolean(),
  sms_consent_at: z.string().datetime().optional(),
  sms_opt_out: z.boolean(),
  sms_opt_out_at: z.string().datetime().optional(),
  last_message_sent_at: z.string().datetime().optional(),
  last_message_received_at: z.string().datetime().optional(),
  total_messages_sent: z.number().int().min(0),
  total_messages_received: z.number().int().min(0),
  custom_fields: z.record(z.any()),
  tags: z.array(z.string()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Message schema
export const MessageSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  contact_id: z.string().uuid(),
  campaign_id: z.string().uuid().optional(),
  phone_number_id: z.string().uuid().optional(),
  direction: z.enum(["inbound", "outbound"]),
  from_number: z.string(),
  to_number: z.string(),
  body: z.string(),
  media_urls: z.array(z.string().url()).optional(),
  status: z.enum([
    "queued",
    "sending",
    "sent",
    "delivered",
    "failed",
    "received",
  ]),
  error_code: z.string().optional(),
  error_message: z.string().optional(),
  provider: z.enum(["twilio", "bandwidth"]),
  provider_sid: z.string().optional(),
  segments: z.number().int().min(1),
  price: z.number().optional(),
  sent_at: z.string().datetime().optional(),
  delivered_at: z.string().datetime().optional(),
  failed_at: z.string().datetime().optional(),
  conversation_id: z.string().uuid().optional(),
  created_at: z.string().datetime(),
});

// Audit Log schema
export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  actor_id: z.string().uuid().optional(),
  actor_email: z.string().email().optional(),
  actor_type: z.enum(["user", "system", "webhook"]),
  customer_id: z.string().uuid().optional(),
  action: z.string(),
  resource_type: z.string(),
  resource_id: z.string().optional(),
  changes: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  ip_address: z.string().ip().optional(),
  user_agent: z.string().optional(),
  success: z.boolean(),
  error_message: z.string().optional(),
  created_at: z.string().datetime(),
});

// Type exports from schemas
export type Lead = z.infer<typeof LeadSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;
export type PhoneNumber = z.infer<typeof PhoneNumberSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
