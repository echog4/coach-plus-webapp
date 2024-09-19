import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const json = await req.json();

    await getServiceClient().from("test").insert({
      body: json,
      headers: Object.fromEntries(req.headers.entries()),
    });

    const subId = json.data.object.subscription;
    const customerId = json.data.object.customer;

    await getServiceClient().from("users").update({ st_subscription_id: subId })
      .eq("st_customer_id", customerId);

    return new Response(
      JSON.stringify({ json }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.toString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
