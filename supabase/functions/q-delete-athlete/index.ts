import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const supabase = getServiceClient();

    // Check-ins
    await supabase.from("check_ins").delete().eq("athlete_id", body.athlete_id);

    // Events
    await supabase.from("events").delete().eq("athlete_id", body.athlete_id);

    // Calendars
    await supabase.from("calendars").delete().eq("athlete_id", body.athlete_id);

    // Onboarding Form Response
    await supabase.from("onboarding_form_response").delete().eq("athlete_id", body.athlete_id);

    // Coach Athletes
    await supabase.from("coach_athletes").delete().eq("athlete_id", body.athlete_id);

    // Athletes
    await supabase.from("athletes").delete().eq("id", body.athlete_id);

    

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
