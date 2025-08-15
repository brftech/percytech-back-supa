import type { SupabaseClient } from '@supabase/supabase-js';
import { createProfileQueries } from './profiles';
import { createLeadQueries } from './leads';
import { createCampaignQueries } from './campaigns';
import { createMessageQueries } from './messages';

/**
 * Database query helper object
 * Provides typed, validated queries for common operations
 */
export function createQueries(client: SupabaseClient) {
  return {
    profiles: createProfileQueries(client),
    leads: createLeadQueries(client),
    campaigns: createCampaignQueries(client),
    messages: createMessageQueries(client),
  };
}

// Export individual query functions for direct use
export { createProfileQueries } from './profiles';
export { createLeadQueries } from './leads';
export { createCampaignQueries } from './campaigns';
export { createMessageQueries } from './messages';