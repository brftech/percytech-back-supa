// Jest setup file for PercyTech Backend
import "reflect-metadata";

// Global test configuration
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = "test";

  // Mock console methods in tests to reduce noise
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  // Restore console methods
  jest.restoreAllMocks();
});

// Global test utilities
global.testUtils = {
  // Helper to create mock Supabase responses
  createMockSupabaseResponse: (data: any, error: any = null) => ({
    data,
    error,
    count: null,
    status: error ? 400 : 200,
    statusText: error ? "Bad Request" : "OK",
  }),

  // Helper to create mock TCR API responses
  createMockTCRResponse: (success: boolean, data?: any, error?: string) => ({
    success,
    data,
    error,
    message: success ? "Success" : "Failed",
  }),

  // Helper to create test entities
  createTestUser: (overrides = {}) => ({
    id: "test-user-001",
    email: "test@example.com",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  createTestBrand: (overrides = {}) => ({
    id: "test-brand-001",
    userId: "test-user-001",
    displayName: "Test Brand",
    companyName: "Test Brand Inc.",
    ein: "12-3456789",
    entityType: "PRIVATE_PROFIT",
    vertical: "TECHNOLOGY",
    phone: "+1-555-0101",
    email: "test@example.com",
    country: "US",
    street: "123 Test St",
    city: "Test City",
    state: "CA",
    postalCode: "12345",
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  createTestCampaign: (overrides = {}) => ({
    id: "test-campaign-001",
    userId: "test-user-001",
    brandId: "test-brand-001",
    campaignName: "Test Campaign",
    description: "Test campaign description",
    callToAction: "Test CTA",
    sampleMessage: "Test message",
    optInMessage: "Test opt-in",
    optOutMessage: "Test opt-out",
    helpMessage: "Test help",
    status: "DRAFT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),
};

// Type declarations for global test utilities
declare global {
  namespace NodeJS {
    interface Global {
      testUtils: {
        createMockSupabaseResponse: (data: any, error?: any) => any;
        createMockTCRResponse: (
          success: boolean,
          data?: any,
          error?: string
        ) => any;
        createTestUser: (overrides?: any) => any;
        createTestBrand: (overrides?: any) => any;
        createTestCampaign: (overrides?: any) => any;
      };
    }
  }
}
