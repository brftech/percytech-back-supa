# Database Package Testing Guide

## Test Structure

The database package includes several types of tests:

### 1. Unit Tests
- **Schema validation tests** (`schemas.test.ts`) - Verify Zod schemas validate/reject data correctly
- **Client tests** (`client.test.ts`) - Test client initialization and configuration
- **Query helper tests** (`queries/*.test.ts`) - Test query building logic with mocked Supabase

### 2. Integration Tests
- **Edge Function tests** (`__tests__/integration/edge-function.test.ts`) - Test real database operations
- Require a test Supabase instance to run

### 3. Test Utilities
- **Mock helpers** (`__tests__/utils/test-helpers.ts`) - Create mock Supabase clients and test data

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run only unit tests (no database needed)
pnpm test -- --testPathIgnorePatterns=integration
```

## Setting Up Integration Tests

Integration tests require a test Supabase instance:

1. Create a test project in Supabase
2. Run migrations against test database:
   ```bash
   supabase db push --db-url postgresql://[test-db-url]
   ```
3. Set environment variables:
   ```bash
   export TEST_SUPABASE_URL=https://[project].supabase.co
   export TEST_SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
   ```

## Writing Tests

### Testing Schemas

```typescript
import { LeadSchema } from '../schemas';

it('should validate correct data', () => {
  const lead = { /* valid lead data */ };
  const result = LeadSchema.parse(lead);
  expect(result.email).toBe('test@example.com');
});

it('should reject invalid data', () => {
  const lead = { /* invalid lead data */ };
  expect(() => LeadSchema.parse(lead)).toThrow();
});
```

### Testing Query Helpers

```typescript
import { createMockSupabaseClient } from '../__tests__/utils/test-helpers';
import { LeadQueries } from '../queries/leads';

it('should create lead', async () => {
  const mockClient = createMockSupabaseClient();
  const queries = new LeadQueries(mockClient);
  
  // Set up mock response
  mockClient.from().single.mockResolvedValue({
    data: { /* lead data */ },
    error: null
  });
  
  const result = await queries.create({ email: 'test@example.com' });
  expect(result.email).toBe('test@example.com');
});
```

### Testing Edge Functions

```typescript
// Simulate Edge Function environment
async function testEdgeFunction() {
  const client = createSupabaseServiceEdgeClient();
  const queries = createQueries(client);
  
  // Test your Edge Function logic
  const lead = await queries.leads.create({
    email: 'test@example.com',
    platform_interest: 'gnymble'
  });
  
  return new Response(JSON.stringify(lead));
}
```

## Test Data Management

Use test factories for consistent test data:

```typescript
import { testFactories } from '../__tests__/utils/test-helpers';

const lead = testFactories.lead({
  email: 'custom@example.com',
  platform_interest: 'percymd'
});

const campaign = testFactories.campaign({
  campaign_name: 'Test Campaign'
});
```

## Debugging Tests

1. Use `console.log` to inspect data
2. Run single test file: `pnpm test -- schemas.test.ts`
3. Use VSCode debugger with breakpoints
4. Check test coverage: `pnpm test:coverage`

## CI/CD Considerations

- Unit tests run on every commit (no database needed)
- Integration tests can be skipped in CI if no test database
- Use GitHub Secrets for test database credentials
- Consider using Supabase CLI for local testing