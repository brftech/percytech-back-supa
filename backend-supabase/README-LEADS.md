# 🎯 Lead Management System

## Overview

The Lead Management System is a comprehensive solution for managing marketing leads across all PercyTech brands (PercyTech, Gnymble, PercyMD, PercyText). It separates lead management from authenticated user management and provides seamless HubSpot integration.

## 🏗️ Architecture

### **Database Separation**

- **Main Platform**: Uses the existing Supabase instance for authenticated users and core platform data
- **Lead Management**: Uses `percytech.dev` Supabase instance specifically for leads and lead activities
- **HubSpot Sync**: Automatically syncs leads and activities to HubSpot CRM

### **Key Components**

#### **Backend (NestJS)**

- `LeadService` - Business logic for lead management
- `HubSpotService` - HubSpot API integration
- `LeadController` - REST API endpoints
- `Lead` & `LeadActivity` entities - Data models

#### **Frontend**

- `ContactForm` - Updated to use lead management API
- `leadApi` service - Frontend API client
- Integrated across all marketing pages

## 🚀 Quick Start

### 1. Environment Setup

Add these environment variables to your `.env` file:

```bash
# percytech.dev Database (Lead Management)
PERCYTECH_DEV_SUPABASE_URL=https://percytech-dev.supabase.co
PERCYTECH_DEV_SUPABASE_ANON_KEY=your-anon-key
PERCYTECH_DEV_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# HubSpot Integration
HUBSPOT_API_KEY=your-hubspot-api-key
HUBSPOT_PORTAL_ID=your-hubspot-portal-id
```

### 2. Apply Database Schema

```bash
cd backend
./scripts/apply-leads-schema.sh
```

This will:

- Create the leads and lead_activities tables
- Set up proper indexes and RLS policies
- Create helper functions for lead management

### 3. Start the Backend

```bash
cd backend
pnpm run start:dev
```

The lead management API will be available at `http://localhost:3001/api/leads`

## 📊 Data Models

### **Lead Entity**

```typescript
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  message?: string;
  howDidYouHear?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  brandId?: string;
  hubspotContactId?: string;
  hubspotCompanyId?: string;
  notes?: string;
  assignedTo?: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

### **Lead Activity Entity**

```typescript
interface LeadActivity {
  id: string;
  leadId: string;
  type: LeadActivityType;
  status: LeadActivityStatus;
  title: string;
  description?: string;
  notes?: string;
  assignedTo?: string;
  scheduledDate?: string;
  completedDate?: string;
  duration?: string;
  hubspotActivityId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

## 🔌 API Endpoints

### **Lead Management**

- `POST /api/leads` - Create a new lead
- `GET /api/leads` - Get all leads with filtering
- `GET /api/leads/:id` - Get lead by ID
- `GET /api/leads/email/:email` - Get lead by email
- `PUT /api/leads/:id/status` - Update lead status
- `PUT /api/leads/:id/priority` - Update lead priority
- `PUT /api/leads/:id/assign` - Assign lead to user

### **Lead Activities**

- `POST /api/leads/:id/activities` - Create lead activity
- `GET /api/leads/:id/activities` - Get all activities for a lead

### **Analytics**

- `GET /api/leads/stats/overview` - Get lead statistics
- `GET /api/leads/search/:query` - Search leads

## 🔄 HubSpot Integration

### **Automatic Sync**

- **Lead Creation**: New leads are automatically created in HubSpot
- **Contact Updates**: Existing contacts are updated when new activities occur
- **Activity Tracking**: All lead activities are synced as HubSpot engagements

### **HubSpot Properties Mapped**

- `firstname` ← `firstName`
- `lastname` ← `lastName`
- `email` ← `email`
- `phone` ← `phone`
- `company` ← `company`
- `jobtitle` ← `jobTitle`
- `website` ← `website`
- `industry` ← `industry`
- `company_size` ← `companySize`
- `source` ← `source`
- `notes` ← `message`
- `lifecyclestage` ← `lead`
- `lead_status` ← `new`

## 🎨 Frontend Integration

### **Contact Form Updates**

The `ContactForm` component has been updated to:

- Split name into `firstName` and `lastName`
- Submit directly to the lead management API
- Automatically create leads in the percytech.dev database
- Sync to HubSpot via the backend

### **Usage in Marketing Pages**

```tsx
import { ContactForm } from "@percytech/ui";

<ContactForm brand={brand} brandButtonColor={getBrandButtonColor(brand.id)} />;
```

### **Lead API Service**

```tsx
import { leadApi } from "@percytech/ui";

// Submit contact form
const result = await leadApi.submitContactForm(formData);

// Check existing lead
const existingLead = await leadApi.checkExistingLead(email);

// Get lead stats
const stats = await leadApi.getLeadStats();
```

## 🛠️ Development

### **Adding New Lead Sources**

1. Add new enum value to `LeadSource` in `lead.entity.ts`
2. Update the frontend to pass the correct source
3. The backend will automatically handle the new source

### **Customizing HubSpot Sync**

1. Modify the `HubSpotService` methods
2. Update property mappings in `LeadService.createLead()`
3. Add new HubSpot properties as needed

### **Extending Lead Activities**

1. Add new activity types to `LeadActivityType` enum
2. Create corresponding HubSpot engagement types
3. Update the activity sync logic in `LeadService`

## 🔒 Security

### **Row Level Security (RLS)**

- Leads and activities are protected by RLS policies
- Only authenticated users can access lead data
- Service role has full access for API operations

### **API Security**

- All endpoints require proper authentication
- Input validation using class-validator
- Rate limiting can be added as needed

## 📈 Monitoring & Analytics

### **Lead Statistics**

- Total leads count
- Leads by status (new, contacted, qualified, converted, lost)
- Lead conversion rates
- Activity tracking and engagement metrics

### **HubSpot Sync Status**

- Track successful/failed syncs
- Monitor API rate limits
- Log sync errors for debugging

## 🚨 Troubleshooting

### **Common Issues**

#### **HubSpot Sync Fails**

- Check `HUBSPOT_API_KEY` environment variable
- Verify HubSpot API rate limits
- Check network connectivity to HubSpot API

#### **Database Connection Issues**

- Verify `PERCYTECH_DEV_SUPABASE_URL` and keys
- Check if the leads schema has been applied
- Ensure RLS policies are properly configured

#### **Contact Form Not Working**

- Check if backend is running on port 3001
- Verify CORS configuration
- Check browser console for API errors

### **Debug Mode**

Enable debug logging by setting `LOG_LEVEL=debug` in your environment.

## 🔮 Future Enhancements

### **Planned Features**

- Lead scoring and qualification automation
- Email marketing integration
- Advanced analytics and reporting
- Lead nurturing workflows
- Multi-brand lead routing
- Advanced HubSpot property mapping

### **Integration Opportunities**

- Salesforce integration
- Pipedrive integration
- Email service providers (Mailchimp, SendGrid)
- Marketing automation platforms
- CRM systems

## 📚 Resources

- [HubSpot API Documentation](https://developers.hubspot.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [PercyTech Brand Configuration](../packages/config/src/brands.ts)

---

**Need Help?** Check the backend logs or create an issue in the repository.
