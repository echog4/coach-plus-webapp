import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const body = await req.json();

    if (!body.entry[0].changes[0].value.messages[0].text.body) {
      return new Response(
        JSON.stringify({}),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const message = body.entry[0].changes[0].value.messages[0].text.body;
    const wa_id = body.entry[0].changes[0].value.contacts[0].wa_id;
    // Find athlete by phone number
    const { data: athlete } = await getServiceClient().from("athletes")
      .select("*, check_ins(*)").eq(
        "wa_id",
        wa_id,
      ).order("created_at", { ascending: false, referencedTable: "check_ins" })
      .limit(1, { referencedTable: "check_ins" });

    const ci_id = athlete[0]!.check_ins[0].id;

    const { data: check_in } = await getServiceClient().from("check_ins").select("*").eq("id", ci_id);

    await getServiceClient().from("check_ins").update({
      body,
      feedback: check_in[0]!.feedback ? `${check_in[0]!.feedback}\n${message}` : message,
      status: "completed",
    }).eq("id", ci_id);

    return new Response(
      body,
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.log({ error });
    return new Response(
      JSON.stringify({ error: error.toString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
