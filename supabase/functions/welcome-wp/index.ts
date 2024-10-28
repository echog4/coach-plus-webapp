import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const json = await req.json();

    const message_response = await fetch(
      "https://graph.facebook.com/v20.0/444884515375910/messages",
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
            "name": "welcome_athlete_prod",
            "language": { "code": "en" },
            "components": [{
              "type": "body",
              "parameters": [{ "type": "text", "text": json.coach_name }, {
                "type": "text",
                "text": json.onboarding_url,
              }],
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
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.toString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
