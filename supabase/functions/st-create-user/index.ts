import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import stripe from "npm:stripe@16.12.0";

import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const json = await req.json();
    const name = json.name;
    const email = json.email;
    const metadata = {
      cp_id: json.user_id,
    };
    const stripeClient = stripe(Deno.env.get("STRIPE_SECRET")!);

    const customer = await stripeClient.customers.create({
      name,
      email,
      metadata,
    });

    if (customer && customer.id) {
      return new Response(
        JSON.stringify({ customer }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Error: Can't create stripe user." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.toString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
