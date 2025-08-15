import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";
import { parsePhoneNumberFromString } from "https://esm.sh/libphonenumber-js@1.11.8?bundle";

// Generate a unique request ID for tracing
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Log with request context
function log(requestId: string, level: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logData = {
    requestId,
    timestamp,
    level,
    message,
    ...(data && { data }),
  };
  console.log(JSON.stringify(logData));
}

function normalizePhone(
  raw: string | null | undefined,
  defaultCountry = "US"
): string | null {
  if (!raw) return null;
  const cleaned = String(raw).replace(/[^\d+]/g, "");
  const p = parsePhoneNumberFromString(cleaned, defaultCountry);
  return p && p.isValid() ? p.number : null; // E.164 or null
}

Deno.serve(async (req) => {
  const startTime = Date.now();
  const requestId = generateRequestId();

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  log(requestId, "info", "Contact form request started", {
    method: req.method,
    url: req.url,
    userAgent: req.headers.get("user-agent"),
  });

  if (req.method !== "POST") {
    log(requestId, "warn", "Method not allowed", { method: req.method });
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    // Initialize Supabase client
    const clientStartTime = Date.now();
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    log(requestId, "debug", "Supabase client initialized", {
      duration: Date.now() - clientStartTime,
    });

    // Parse request payload
    const parseStartTime = Date.now();
    const payload = await req.json().catch(() => ({}) as any);
    log(requestId, "debug", "Request payload parsed", {
      duration: Date.now() - parseStartTime,
      hasFormData: !!payload.formData,
      hasMetadata: !!payload.metadata,
    });

    // Extract formData from the payload structure
    const formData = payload.formData || payload;

    // compat: accept either formData.phone or formData.cell_phone
    const phoneRaw = formData.phone ?? formData.cell_phone ?? null;
    const emailRaw = formData.email ?? null;

    log(requestId, "debug", "Form data extracted", {
      hasPhone: !!phoneRaw,
      hasEmail: !!emailRaw,
      hasName: !!formData.name,
    });

    // Normalize contact data
    const normalizeStartTime = Date.now();
    const phone_normalized = normalizePhone(phoneRaw, "US");
    const email_normalized =
      emailRaw?.toLowerCase()?.trim()?.replace(/\s+/g, "") || null;
    log(requestId, "debug", "Contact data normalized", {
      duration: Date.now() - normalizeStartTime,
      phoneNormalized: !!phone_normalized,
      emailNormalized: !!email_normalized,
    });

    const pcm = phoneRaw && emailRaw ? "both" : phoneRaw ? "sms" : "email";

    // Insert into database
    const dbStartTime = Date.now();
    const { data, error } = await sb
      .from("leads")
      .insert({
        phone: phoneRaw,
        phone_normalized,
        email: emailRaw,
        email_normalized,
        preferred_contact_method: pcm,
        name: formData.name ?? null,
        company_name: formData.company ?? null,
        how_did_you_hear: formData.howDidYouHear ?? null,
        platform_interest: formData.platform_interest ?? "percytech",
        source: formData.source ?? "contact_form",
      })
      .select("*")
      .single();

    if (error) {
      log(requestId, "error", "Database insert failed", {
        duration: Date.now() - dbStartTime,
        error: error.message,
        code: error.code,
      });
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    log(requestId, "info", "Lead created successfully", {
      duration: Date.now() - dbStartTime,
      leadId: data.id,
      phoneNormalized: !!phone_normalized,
      preferredContactMethod: pcm,
    });

    // Insert into lead_activities table
    const activityStartTime = Date.now();
    const { error: activityError } = await sb.from("lead_activities").insert({
      lead_id: data.id,
      activity_type: "contact_form_submission",
      channel: "web",
      message: formData.message || null,
      source: formData.source ?? "contact_form",
      platform_interest: formData.platform_interest ?? "percytech",
      metadata: {
        form_data: formData,
        metadata: payload.metadata,
        phone_normalized,
        email_normalized,
        preferred_contact_method: pcm,
        user_agent: payload.metadata?.userAgent,
        referrer: payload.metadata?.referrer,
        page_url: payload.metadata?.pageUrl,
      },
    });

    if (activityError) {
      log(requestId, "error", "Lead activity insert failed", {
        duration: Date.now() - activityStartTime,
        error: activityError.message,
        code: activityError.code,
      });
      // Don't fail the whole request, just log the error
    } else {
      log(requestId, "info", "Lead activity created successfully", {
        duration: Date.now() - activityStartTime,
        activityType: "contact_form_submission",
      });
    }

    // Send email notification via Resend
    const emailStartTime = Date.now();
    try {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "PercyTech <contact@percytech.com>",
            to: ["bryan@percytech.com"],
            subject: `New Contact Form Submission - ${formData.name || "Unknown"}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${formData.name || "Not provided"}</p>
              <p><strong>Email:</strong> ${formData.email || "Not provided"}</p>
              <p><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
              <p><strong>Company:</strong> ${formData.company || "Not provided"}</p>
              <p><strong>Message:</strong> ${formData.message || "Not provided"}</p>
              <p><strong>How did you hear:</strong> ${formData.howDidYouHear || "Not provided"}</p>
              <p><strong>Platform Interest:</strong> ${formData.platform_interest || "percytech"}</p>
              <p><strong>Source:</strong> ${formData.source || "contact_form"}</p>
              <p><strong>Lead ID:</strong> ${data.id}</p>
              <p><strong>Phone Normalized:</strong> ${phone_normalized || "Not normalized"}</p>
              <p><strong>Preferred Contact Method:</strong> ${pcm}</p>
              <p><strong>Request ID:</strong> ${requestId}</p>
            `,
          }),
        });

        if (emailResponse.ok) {
          const emailData = await emailResponse.json();
          log(requestId, "info", "Email notification sent successfully", {
            duration: Date.now() - emailStartTime,
            emailId: emailData.id,
          });
        } else {
          const emailError = await emailResponse.text();
          log(requestId, "error", "Email notification failed", {
            duration: Date.now() - emailStartTime,
            error: emailError,
            status: emailResponse.status,
          });
        }
      } else {
        log(requestId, "warn", "Resend API key not configured", {
          duration: Date.now() - emailStartTime,
        });
      }
    } catch (emailError) {
      log(requestId, "error", "Email notification error", {
        duration: Date.now() - emailStartTime,
        error: emailError.message,
      });
    }

    // Create HubSpot contact and deal
    const hubspotStartTime = Date.now();
    try {
      const hubspotApiKey = Deno.env.get("HUBSPOT_API_KEY");
      if (hubspotApiKey) {
        // Create contact with proper HubSpot API format
        const contactResponse = await fetch(
          "https://api.hubapi.com/crm/v3/objects/contacts",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${hubspotApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              properties: {
                firstname: formData.name?.split(" ")[0] || "",
                lastname: formData.name?.split(" ").slice(1).join(" ") || "",
                email: formData.email || "",
                phone: formData.phone || "",
                company: formData.company || "",
                lifecyclestage: "lead",
                hs_lead_status: "NEW",
                hs_analytics_source: "DIRECT_TRAFFIC",
              },
            }),
          }
        );

        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          log(requestId, "info", "HubSpot contact created successfully", {
            duration: Date.now() - hubspotStartTime,
            contactId: contactData.id,
          });

          // Create deal with proper HubSpot API format
          const dealResponse = await fetch(
            "https://api.hubapi.com/crm/v3/objects/deals",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${hubspotApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                properties: {
                  dealname: `Contact Form - ${formData.name || "Unknown"}`,
                  amount: "0",
                  dealstage: "1121805496", // "qualifiedtobuy" stage from default pipeline
                  pipeline: "default",
                },
                associations: [
                  {
                    to: { id: contactData.id },
                    types: [
                      {
                        associationCategory: "HUBSPOT_DEFINED",
                        associationTypeId: 3,
                      },
                    ],
                  },
                ],
              }),
            }
          );

          if (dealResponse.ok) {
            const dealData = await dealResponse.json();
            log(requestId, "info", "HubSpot deal created successfully", {
              duration: Date.now() - hubspotStartTime,
              dealId: dealData.id,
            });
          } else {
            const dealError = await dealResponse.text();
            log(requestId, "error", "HubSpot deal creation failed", {
              duration: Date.now() - hubspotStartTime,
              error: dealError,
              status: dealResponse.status,
            });
          }
        } else {
          const contactError = await contactResponse.text();
          log(requestId, "error", "HubSpot contact creation failed", {
            duration: Date.now() - hubspotStartTime,
            error: contactError,
            status: contactResponse.status,
          });
        }
      } else {
        log(requestId, "warn", "HubSpot API key not configured", {
          duration: Date.now() - hubspotStartTime,
        });
      }
    } catch (hubspotError) {
      log(requestId, "error", "HubSpot integration error", {
        duration: Date.now() - hubspotStartTime,
        error: hubspotError.message,
      });
    }

    const totalDuration = Date.now() - startTime;
    log(requestId, "info", "Contact form request completed", {
      totalDuration,
      success: true,
    });

    return new Response(
      JSON.stringify({ ok: true, leadId: data.id, phone_normalized, pcm }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    log(requestId, "error", "Contact form request failed", {
      totalDuration,
      error: error.message,
      stack: error.stack,
    });

    return new Response(
      JSON.stringify({
        ok: false,
        error: "Internal server error",
        requestId, // Include request ID for debugging
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
