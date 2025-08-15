// Types
export * from "./types";

// Schemas - export individually to avoid type conflicts
export {
  // Enum schemas
  BrandSchema,
  ContactMethodSchema,
  RoleSchema,
  // Entity schemas
  LeadSchema,
  ProfileSchema,
  CustomerSchema,
  SubscriptionSchema,
  CampaignSchema,
  PhoneNumberSchema,
  ContactSchema,
  MessageSchema,
  AuditLogSchema,
  // Type exports
  type Lead,
  type Profile,
  type Customer,
  type Subscription,
  type Campaign,
  type PhoneNumber,
  type Contact,
  type Message,
  type AuditLog,
} from "./schemas";

// Client functions
export * from "./client";

// Query helpers
export * from "./queries";

// Re-export commonly used Supabase types
export type { User, Session, SupabaseClient } from "@supabase/supabase-js";
