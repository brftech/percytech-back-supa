# Contact Form Edge Function

This Edge Function handles contact form submissions with multiple integrations:

## Features

- ✅ **Supabase Database** - Stores leads and activities
- ✅ **HubSpot CRM** - Creates contacts in HubSpot
- ✅ **Resend Email** - Sends confirmation emails
- ✅ **Twilio SMS** - Sends SMS notifications (if phone provided)

## Environment Variables

Add these to your Supabase project's Edge Function environment variables:

### Required (for basic functionality)
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### HubSpot Integration (Optional)
```bash
HUBSPOT_API_KEY=your_hubspot_api_key
HUBSPOT_PORTAL_ID=your_hubspot_portal_id
```

### Resend Email Integration (Optional)
```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Twilio SMS Integration (Optional)
```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## API Usage

### Request Format
```json
{
  "formData": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "message": "Interested in your platform",
    "platform_interest": "percytech",
    "source": "contact_form"
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://google.com",
    "pageUrl": "https://percytech.com/contact"
  }
}
```

### Response Format
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "leadId": "uuid",
  "isExistingLead": false
}
```

## Integration Details

### HubSpot
- Creates a new contact with all form data
- Links to Supabase lead via `supabase_lead_id` property
- Includes platform interest and source tracking

### Resend Email
- Sends branded confirmation email
- Includes the user's original message
- Uses responsive HTML template

### Twilio SMS
- Sends SMS confirmation (if phone provided)
- Includes brand name and response time
- Requires phone number validation

## Error Handling

- All integrations are non-blocking
- Form submission succeeds even if integrations fail
- Detailed error logging for debugging
- Graceful degradation when services are unavailable

## Deployment

```bash
# Deploy to Supabase
supabase functions deploy contact-form

# Set environment variables
supabase secrets set HUBSPOT_API_KEY=your_key
supabase secrets set RESEND_API_KEY=your_key
# ... etc
```
