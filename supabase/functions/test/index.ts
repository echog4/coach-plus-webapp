import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { addDays, format } from "npm:date-fns@2.25.0";
import { getServiceClient } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const message_response = await fetch(
    "https://graph.facebook.com/v20.0/422106364317179/messages",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("WP_TOKEN")!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "messaging_product": "whatsapp",
        "to": "14168384339",
        "type": "template",
        "template": {
          "name": "otp_custom",
          "language": { "code": "en" },
          "components": [{
            "type": "body",
            "parameters": [{ "type": "text", "text": "123456" }],
          }],
        },
      }),
    },
  );
});
