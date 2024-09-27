import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/auth.ts";

const generateRandom6DigitNumber = () =>
  Math.floor(100000 + Math.random() * 900000);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const code = generateRandom6DigitNumber();
  const json = await req.json();

  await getServiceClient().from("otp").insert({
    user_id: json.user_id,
    code: code,
  });

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
        "to": json.phone,
        "type": "template",
        "template": {
          "name": "otp_custom",
          "language": { "code": "en" },
          "components": [{
            "type": "body",
            "parameters": [{ "type": "text", "text": code }],
          }],
        },
      }),
    },
  );

  const res = await message_response.json();

  console.log(res);

  return new Response(
    JSON.stringify({ res }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
