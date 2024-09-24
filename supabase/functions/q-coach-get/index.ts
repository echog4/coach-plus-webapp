import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient, getTokenUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await getTokenUser(req.headers.get("Authorization")!);
    const res = await getServiceClient().from("users").select().eq(
      "id",
      user!.id,
    );

    return new Response(
      JSON.stringify(res),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ error: "Coach not found." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
