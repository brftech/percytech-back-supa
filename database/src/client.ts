import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Conditional import for server-side only
let config: typeof import("@percytech/config") | null = null;
let env: typeof import("@percytech/config").env | null = null;

// Only import config in server environments
if (typeof process !== "undefined") {
  try {
    const configModule = await import("@percytech/config");
    config = configModule;
    env = configModule.env;
  } catch {
    // Ignore import errors in browser
  }
}

// Client instances
let anonClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

// Client options for different environments
const CLIENT_OPTIONS = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "x-client-info": "@percytech/database",
    },
  },
};

const SERVICE_CLIENT_OPTIONS = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      "x-client-info": "@percytech/database-service",
    },
  },
};

/**
 * Get Supabase client for browser/frontend use
 * Uses anon key with RLS policies
 */
export function getSupabaseClient(): SupabaseClient {
  if (!anonClient) {
    let url: string | undefined;
    let anonKey: string | undefined;

    // Check for Vite environment variables first (browser context)
    if (
      typeof import.meta !== "undefined" &&
      (import.meta as { env?: Record<string, string> }).env
    ) {
      const viteEnv = (import.meta as { env?: Record<string, string> }).env;
      if (viteEnv) {
        url = viteEnv.VITE_SUPABASE_URL;
        anonKey = viteEnv.VITE_SUPABASE_ANON_KEY;

        // Debug logging in development
        if (typeof window !== "undefined" && viteEnv?.DEV) {
          console.log("Vite env check:", {
            hasImportMeta: typeof import.meta !== "undefined",
            hasEnv: !!viteEnv,
            url: url ? "found" : "missing",
            anonKey: anonKey ? "found" : "missing",
            allEnvKeys: Object.keys(viteEnv || {}).filter((key) =>
              key.startsWith("VITE_"),
            ),
          });
        }
      }
    }

    // Fallback to config package only in server environments
    if ((!url || !anonKey) && config && typeof process !== "undefined") {
      const supabaseConfig = config.getSupabaseConfig();
      url = url || supabaseConfig.url;
      anonKey = anonKey || supabaseConfig.anonKey;
    }

    if (!url || !anonKey) {
      throw new Error(
        "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.",
      );
    }

    anonClient = createClient(url, anonKey, CLIENT_OPTIONS);
  }

  return anonClient;
}

/**
 * Get Supabase service client for server-side use
 * Uses service role key - bypasses RLS
 * NEVER expose this client to the browser
 */
export function getSupabaseServiceClient(): SupabaseClient {
  if (!serviceClient) {
    if (!config) {
      throw new Error(
        "Config package not available. This function is for server-side use only.",
      );
    }

    const supabaseConfig = config.getSupabaseConfig();

    if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
      // More helpful error message in development
      if (env && env.isDevelopment) {
        throw new Error(
          "Missing Supabase service role key. Set SUPABASE_SERVICE_ROLE_KEY in your environment.",
        );
      }
      throw new Error("Missing Supabase service role configuration");
    }

    serviceClient = createClient(
      supabaseConfig.url,
      supabaseConfig.serviceRoleKey,
      SERVICE_CLIENT_OPTIONS,
    );
  }

  return serviceClient;
}

/**
 * Create a new Supabase client for Edge Functions
 * Each function invocation gets a fresh client
 */
export function createSupabaseEdgeClient(authHeader?: string): SupabaseClient {
  if (!config) {
    throw new Error(
      "Config package not available. This function is for server-side use only.",
    );
  }

  const supabaseConfig = config.getSupabaseConfig();

  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    throw new Error("Missing Supabase configuration");
  }

  const options = {
    ...CLIENT_OPTIONS,
    global: {
      ...CLIENT_OPTIONS.global,
      headers: {
        ...CLIENT_OPTIONS.global.headers,
        ...(authHeader && { Authorization: authHeader }),
      },
    },
  };

  return createClient(supabaseConfig.url, supabaseConfig.anonKey, options);
}

/**
 * Create a new Supabase service client for Edge Functions
 * Each function invocation gets a fresh client
 */
export function createSupabaseServiceEdgeClient(): SupabaseClient {
  if (!config) {
    throw new Error(
      "Config package not available. This function is for server-side use only.",
    );
  }

  const supabaseConfig = config.getSupabaseConfig();

  if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
    throw new Error("Missing Supabase service role configuration");
  }

  return createClient(
    supabaseConfig.url,
    supabaseConfig.serviceRoleKey,
    SERVICE_CLIENT_OPTIONS,
  );
}
