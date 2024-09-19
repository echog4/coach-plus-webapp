import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import stripe from "npm:stripe@16.12.0";

import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient, getTokenUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const json = await req.json();
    const priceId = json.priceId;
    const baseUrl = json.baseUrl;
    const stripeClient = stripe(Deno.env.get("STRIPE_SECRET")!);

    const user = await getTokenUser(req.headers.get("Authorization")!);

    const { data, error } = await getServiceClient().from("users").select().eq(
      "id",
      user!.id,
    );

    const { st_customer_id } = data![0];

    const session = await stripeClient.checkout.sessions.create({
      mode: "subscription",
      customer: st_customer_id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: `${baseUrl}/settings`,
      cancel_url: `${baseUrl}/settings`,
    });

    if (session && session.id) {
      return new Response(
        JSON.stringify(session),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Checkout failed", session }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.toString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
