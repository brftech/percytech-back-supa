// Shared edge function observability utilities
// Can be imported by other edge functions for consistent logging and tracing

export interface EdgeContext {
  requestId: string;
  startTime: number;
  log: (level: string, message: string, data?: any) => void;
  time: (operation: string) => () => void;
  error: (error: Error, context?: any) => void;
}

// Generate a unique request ID for tracing
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create edge context with logging and timing utilities
export function createEdgeContext(): EdgeContext {
  const requestId = generateRequestId();
  const startTime = Date.now();
  const timings: Record<string, number> = {};

  const log = (level: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logData = {
      requestId,
      timestamp,
      level,
      message,
      ...(data && { data }),
    };
    console.log(JSON.stringify(logData));
  };

  const time = (operation: string) => {
    const operationStart = Date.now();
    return () => {
      const duration = Date.now() - operationStart;
      timings[operation] = duration;
      log("debug", `Operation completed: ${operation}`, { duration });
    };
  };

  const error = (error: Error, context?: any) => {
    const totalDuration = Date.now() - startTime;
    log("error", "Request failed", {
      totalDuration,
      error: error.message,
      stack: error.stack,
      context,
      timings,
    });
  };

  return {
    requestId,
    startTime,
    log,
    time,
    error,
  };
}

// Helper to wrap edge function handlers with observability
export function withObservability<T extends any[], R>(
  handler: (ctx: EdgeContext, ...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const ctx = createEdgeContext();
    
    ctx.log("info", "Request started", {
      args: args.length,
    });

    try {
      const result = await handler(ctx, ...args);
      
      const totalDuration = Date.now() - ctx.startTime;
      ctx.log("info", "Request completed", {
        totalDuration,
        success: true,
      });
      
      return result;
    } catch (error) {
      ctx.error(error as Error);
      throw error;
    }
  };
}

// Common log levels
export const LogLevel = {
  DEBUG: "debug",
  INFO: "info", 
  WARN: "warn",
  ERROR: "error",
} as const;

// Common timing operations
export const Operations = {
  CLIENT_INIT: "client_initialization",
  PAYLOAD_PARSE: "payload_parsing",
  DATA_NORMALIZATION: "data_normalization",
  DATABASE_INSERT: "database_insert",
  DATABASE_UPDATE: "database_update",
  DATABASE_QUERY: "database_query",
  EXTERNAL_API_CALL: "external_api_call",
  EMAIL_SEND: "email_send",
  SMS_SEND: "sms_send",
} as const;
