# PercyTech Backend Supabase - Admin & Onboarding Platform

## Overview

Admin platform and onboarding system built with NestJS and Supabase. Handles user authentication, payments, onboarding, lead management, and admin dashboard.

## Architecture

- **Framework**: NestJS
- **Database**: PostgreSQL (via Supabase)
- **Infrastructure**: Supabase
- **Authentication**: Supabase Auth
- **Services**: Auth, onboarding, payments, leads, admin, TCR

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase CLI
- PostgreSQL (via Supabase)

### Installation

```bash
cd backend-supabase
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Update Supabase environment variables
```

### Supabase Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db push
```

### Development

```bash
npm run dev
```

## API Endpoints

- `/api/v1/auth` - Authentication (signin, signup, etc.)
- `/api/v1/users` - User management
- `/api/v1/onboarding` - Onboarding flow
- `/api/v1/payments` - Payment processing
- `/api/v1/leads` - Lead management
- `/api/v1/admin` - Admin dashboard
- `/api/v1/tcr` - TCR registration

## Features

- **User Authentication**: Supabase Auth with JWT
- **Payment Processing**: Stripe integration
- **Onboarding Flow**: Complete user onboarding
- **Lead Management**: HubSpot integration
- **Admin Dashboard**: User and system management
- **TCR Registration**: Campaign registration

## Integration

This service integrates with `percytech-back-aws` for:

- User authentication (provides JWT tokens)
- User data synchronization
- Cross-service communication

## Development

- **Port**: 3000 (configurable)
- **Supabase API**: Port 54321
- **Supabase Studio**: Port 54323
- **Database**: Port 54322

## Deployment

- **Production**: Supabase (managed)
- **Database**: Supabase PostgreSQL
- **Functions**: Supabase Edge Functions
- **Storage**: Supabase Storage

## Database Schema

See `supabase/migrations/` for complete database schema including:

- Users and profiles
- Onboarding progress
- Payments and subscriptions
- Lead management
- TCR registrations
