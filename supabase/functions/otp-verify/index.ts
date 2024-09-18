import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient, getTokenUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const user = await getTokenUser(req.headers.get("Authorization")!);
  const json = await req.json();

  const { data: token } = await getServiceClient().from("otp").select().eq(
    "code",
    json.code,
  ).eq("user_id", user!.id).gt(
    "created_at",
    new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  );

  if (token?.length === 0) {
    return new Response(
      JSON.stringify({ error: "Code is invalid or expired." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  await getServiceClient().from("otp").delete().eq("id", token![0].id);
  await getServiceClient().from("users").update({ status: "VERIFIED" }).eq(
    "id",
    user!.id,
  );

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
