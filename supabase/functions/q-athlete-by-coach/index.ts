import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient, getTokenUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await getTokenUser(req.headers.get("Authorization")!);
    const supabase = getServiceClient();

    const res = supabase
      .from("coach_athletes")
      .select(
        "*, athletes(*, onboarding_form_response(*), calendars(*), events(*))",
      )
      .eq("coach_id", user!.id)
      .is("deleted_at", null)
      .order("date", { ascending: false, referencedTable: "athletes.events" })
      .limit(1, { referencedTable: "athletes.events" });

    return new Response(
      JSON.stringify(res),
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