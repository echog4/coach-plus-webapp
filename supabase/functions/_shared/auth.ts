import { createClient } from "jsr:@supabase/supabase-js@2";

export const getTokenUser = async (authHeader: string) => {
  const supabaseClient = getServiceClient();

  // Get the session or user object
  const token = authHeader.replace("Bearer ", "");
  const { data } = await supabaseClient.auth.getUser(token);
  return data.user;
};

export const getServiceClient = () =>
  createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
