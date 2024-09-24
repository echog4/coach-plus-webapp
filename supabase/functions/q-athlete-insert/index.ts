import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const athlete = await req.json();
    const supabase = getServiceClient();

    const res = await supabase.from("athletes").insert([athlete]).select();

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
