import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import stripe from "npm:stripe@16.12.0";

import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/auth.ts";
import { getTokenUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let isSubscribed = false;
    const stripeClient = stripe(Deno.env.get("STRIPE_SECRET")!);

    const user = await getTokenUser(req.headers.get("Authorization")!);

    const { data, error } = await getServiceClient().from("users").select().eq(
      "id",
      user!.id,
    );

    const { st_subscription_id } = data![0];

    if (!st_subscription_id) {
      isSubscribed = false;
    } else {
      const subscription = await stripeClient.subscriptions.retrieve(
        st_subscription_id,
      );

      if (!subscription || subscription.status !== "active") {
        isSubscribed = false;
      } else {
        isSubscribed = true;
      }
    }

    return new Response(
      JSON.stringify({ isSubscribed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.toString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
