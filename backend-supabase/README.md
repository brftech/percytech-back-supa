# TCR Campaign Registry NestJS Backend

A modern, production-ready NestJS backend for The Campaign Registry (TCR) integration, built with TypeScript, Supabase, and comprehensive TCR API support.

## ✨ Features

- **Modern Tech Stack**: NestJS v7 + TypeScript + Supabase
- **TCR Integration**: Full Campaign Registry API support (staging & production)
- **Entity Management**: Complete CRUD operations for Users, Brands, Campaigns
- **Validation**: Class-validator with comprehensive data validation
- **Environment Config**: Flexible configuration for different environments
- **CORS Support**: Configurable CORS with environment-based origins
- **Logging**: Structured logging with NestJS Logger
- **Type Safety**: Full TypeScript coverage with proper interfaces

## 🏗️ Architecture

### Core Entities
- **Users**: User management with status tracking
- **Profiles**: Extended user profile information
- **Brands**: TCR brand registration with validation
- **Campaigns**: SMS campaign management
- **Onboarding**: Multi-step user onboarding flow
- **Payments**: Payment tracking and status management
- **TCR Registrations**: Campaign Registry submission tracking

### Services
- **SupabaseService**: Database operations with Supabase
- **TCRApiService**: Campaign Registry API integration
- **UserService**: User management operations
- **BrandService**: Brand CRUD and TCR submission
- **CampaignService**: Campaign CRUD and TCR submission

### Controllers
- **UserController**: User management endpoints
- **BrandController**: Brand management and TCR integration
- **CampaignController**: Campaign management and TCR integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase project with proper tables
- TCR API credentials (staging & production)

### Installation
```bash
npm install
```

### Environment Setup
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Required environment variables:
```env
# Server Configuration
PORT=3002
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# TCR API Configuration
TCR_STAGING_URL=https://csp-api-staging.campaignregistry.com/v2
TCR_STAGING_API_KEY=your_staging_api_key
TCR_STAGING_API_SECRET=your_staging_api_secret

TCR_PRODUCTION_URL=https://csp-api.campaignregistry.com/v2
TCR_PRODUCTION_API_KEY=your_production_api_key
TCR_PRODUCTION_API_SECRET=your_production_api_secret

TCR_USE_STAGING=true
```

### Running the App
```bash
# Development
npm run start:dev

# Production
npm run start:prod

# Debug mode
npm run start:debug
```

## 📚 API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users/session/:token` - Get user by session token
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/status` - Update user status
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/search?q=query` - Search users

### Brands
- `POST /api/brands` - Create brand
- `GET /api/brands` - Get all brands
- `GET /api/brands/user/:userId` - Get brands by user ID
- `GET /api/brands/:id` - Get brand by ID
- `PUT /api/brands/:id` - Update brand
- `PUT /api/brands/:id/status` - Update brand status
- `DELETE /api/brands/:id` - Delete brand
- `POST /api/brands/:id/submit-tcr?staging=true` - Submit brand to TCR
- `GET /api/brands/:id/tcr-status?staging=true` - Get TCR brand status

### Campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/user/:userId` - Get campaigns by user ID
- `GET /api/campaigns/brand/:brandId` - Get campaigns by brand ID
- `GET /api/campaigns/:id` - Get campaign by ID
- `PUT /api/campaigns/:id` - Update campaign
- `PUT /api/campaigns/:id/status` - Update campaign status
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/submit-tcr?staging=true` - Submit campaign to TCR
- `GET /api/campaigns/:id/tcr-status?staging=true` - Get TCR campaign status

## 🔧 TCR Integration

The server integrates with The Campaign Registry API for:
- Brand registration and validation
- Campaign submission and approval
- Status tracking and monitoring
- Staging and production environment support

### TCR API Features
- Automatic Basic Auth header generation
- Environment-based API endpoint selection
- Comprehensive error handling and logging
- Response validation and status tracking

## 🗄️ Database Schema

The server expects the following Supabase tables:
- `users` - User accounts and authentication
- `profiles` - Extended user profile information
- `brands` - Brand registration data
- `campaigns` - SMS campaign information
- `onboarding` - User onboarding progress
- `payments` - Payment tracking
- `tcr_registrations` - TCR submission tracking

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Development

### Code Style
- ESLint configuration for code quality
- Prettier for consistent formatting
- TypeScript strict mode enabled

### Project Structure
```
src/
├── controllers/     # API endpoint handlers
├── entities/        # Data models and validation
├── services/        # Business logic and external integrations
├── app.module.ts    # Main application module
└── main.ts         # Application bootstrap
```

## 🔒 Security Features

- Input validation with class-validator
- CORS configuration with environment-based origins
- Secure TCR API integration with Basic Auth
- Environment-based configuration management

## 🚀 Deployment

### Production Considerations
- Set `NODE_ENV=production`
- Configure production TCR API credentials
- Set appropriate CORS origins
- Use environment-specific Supabase keys
- Enable proper logging and monitoring

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3002
CMD ["node", "dist/main"]
```

## 📞 Support

For questions or issues:
- Check the existing TCR Express server for reference
- Review TCR API documentation
- Check Supabase documentation for database setup

## 📄 License

This project is part of the TCR Campaign Registry integration platform.
