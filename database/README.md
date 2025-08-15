# @percytech/database

Shared database types, schemas, and query helpers for the PercyTech platform.

## Features

- **TypeScript types** for all database tables
- **Zod schemas** for runtime validation
- **Query helpers** for common database operations
- **Multiple client strategies** for different environments
- **RPC function wrappers** for complex queries

## Usage

### Basic Client Usage

```typescript
import { getSupabaseClient, createQueries } from '@percytech/database';

// Get client (browser/frontend)
const supabase = getSupabaseClient();
const queries = createQueries(supabase);

// Get profile with customer data
const { profile, customer } = await queries.profiles.getWithCustomerData(userId);
```

### Service Client Usage (Backend Only)

```typescript
import { getSupabaseServiceClient, createQueries } from '@percytech/database';

// Get service client (bypasses RLS)
const supabase = getSupabaseServiceClient();
const queries = createQueries(supabase);

// Create a lead
const lead = await queries.leads.create({
  email: 'user@example.com',
  platform_interest: 'gnymble',
});
```

### Edge Function Usage

```typescript
import { createSupabaseServiceEdgeClient, createQueries } from '@percytech/database';

// In your Edge Function
export default async (req: Request) => {
  const supabase = createSupabaseServiceEdgeClient();
  const queries = createQueries(supabase);
  
  // Use queries...
};
```

### Type Validation

```typescript
import { LeadSchema, type Lead } from '@percytech/database';

// Validate data from API
const rawData = await fetch('/api/lead');
const validatedLead = LeadSchema.parse(await rawData.json());

// Type-safe operations
function processLead(lead: Lead) {
  if (lead.sms_consent && !lead.sms_opt_out) {
    // Safe to send SMS
  }
}
```

## Query Helpers

### Profiles
- `getById(id)` - Get profile by ID
- `getByEmail(email)` - Get profile by email
- `getWithCustomerData(id)` - Get profile with customer and subscriptions
- `update(id, updates)` - Update profile

### Leads
- `create(data)` - Create new lead
- `findByContact(email?, phone?)` - Find lead by email or phone
- `updateWithActivity(id, updates, activity)` - Update lead and log activity
- `getByPlatformInterest(platform)` - Get leads interested in a platform
- `getRecentWithActivity(days)` - Get recent leads with activity count

### Campaigns
- `getWithPhoneNumbers(id)` - Get campaign with assigned phone numbers
- `getActiveByCustomer(customerId)` - Get active campaigns for customer
- `createWithAudit(data, actorId)` - Create campaign with audit log
- `updateStatus(id, status, metadata?)` - Update campaign status
- `canCreateCampaign(customerId)` - Check campaign creation limit

### Messages
- `createOutbound(data)` - Send a message (with consent check)
- `getConversation(conversationId)` - Get conversation thread
- `getRecentByCustomer(customerId)` - Get recent messages
- `updateStatus(providerSid, status)` - Update message delivery status
- `getCampaignStats(campaignId)` - Get campaign message statistics

## Environment Variables

Required environment variables:

```bash
# For browser/frontend
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# For server/Edge Functions
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

## Type Generation

To regenerate types from your database schema:

```bash
# Make sure you have Supabase CLI installed and linked to your project
pnpm --filter @percytech/database generate-types
```