import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient, getTokenUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const user = await getTokenUser(req.headers.get("Authorization")!);
    const supabase = getServiceClient();

    supabase
      .from("onboarding_forms")
      .update({ deleted_at: new Date() })
      .eq("id", body.id).eq("user_id", user!.id);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ error: "Error occured." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
