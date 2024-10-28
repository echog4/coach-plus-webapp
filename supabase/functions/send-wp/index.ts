import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/auth.ts";
import { addDays, format } from "npm:date-fns@2.25.0";

const sendMessage = async (phone) => {
  const message_response = await fetch(
    "https://graph.facebook.com/v20.0/444884515375910/messages",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("WP_TOKEN")!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "checkin",
          language: {
            code: "en_US",
          },
        },
      }),
    },
  );

  const res_body = await message_response.json();

  console.log(res_body);

  if (res_body.error) {
    return { error: res_body.error };
  }

  const wa_id = res_body.contacts[0].wa_id;
  const wa_input = res_body.contacts[0].wa_input;
  const wa_message_id = res_body.messages[0].id;

  return { wa_id, wa_input, wa_message_id, wa_body: res_body };
};

const supabase = getServiceClient();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.headers.get("Authorization") !== Deno.env.get("SB_EDGE_AUTH_CODE")) {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    // Find events of yesterday
    const yesterday = format(addDays(new Date(), -1), "yyyy-MM-dd");
    const { data: events } = await supabase.from("events").select(
      "*, athletes(*)",
    ).eq("date", yesterday);

    console.log({ yesterday, events });

    if (!events) {
      return new Response(
        JSON.stringify({ message: "No events found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const existingEvents = [];

    const filteredEvents = events!.filter((event: any) => {
      if (existingEvents.includes(event.athlete_id)) {
        return false;
      }
      existingEvents.push(event.athlete_id);
      return true;
    });

    filteredEvents!.forEach(async (event: any) => {
      // Send message for each check in
      try {
        const data = await sendMessage(
          event.athletes.wa_id || event.athletes.phone_number,
        );

        if (data.error) {
          console.log("1", data.error);
          return;
        }

        // Create Check in for each event
        await supabase.from("check_ins").insert({
          event_id: event.id,
          athlete_id: event.athlete_id,
          coach_id: event.coach_id,
          wa_message_id: data.wa_message_id,
          body: data.wa_body,
          status: "inprogress",
        });

        // update athlete with wa_id
        await supabase.from("athletes").update({ wa_id: data.wa_id }).eq(
          "id",
          event.athlete_id,
        );
      } catch (error) {
        console.log({ error });
      }
    });

    return new Response(
      JSON.stringify({ filteredEvents, yesterday, events }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.toString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
