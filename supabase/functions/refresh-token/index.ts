import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient, getTokenUser } from "../_shared/auth.ts";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const user = await getTokenUser(req.headers.get("Authorization")!);
    const { data } = await getServiceClient().from("users").select(
      "google_refresh_token",
    ).eq(
      "id",
      user.id,
    ).single();

    const refresh_token = data.google_refresh_token;

    const response = await fetch("https://www.googleapis.com/oauth2/v4/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: Deno.env.get("GOOGLE_CLIENT_ID")!,
        client_secret: Deno.env.get("GOOGLE_API_SECRET")!,
        refresh_token,
        grant_type: "refresh_token",
      }),
    });

    const token_response = await response.json();

    return new Response(
      JSON.stringify(token_response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/refreshGoogleToken' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
