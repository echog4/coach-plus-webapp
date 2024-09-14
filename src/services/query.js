// COACH
// COACH

import { supabase } from "./supabase";

// COACH
export const updateCoach = async (supabase, user, user_id) =>
  await supabase.from("users").update(user).eq("id", user_id);

// ATHLETE
// ATHLETE
// ATHLETE
export const getAthleteByEmail = async (supabase, email) =>
  await supabase.from("athletes").select().eq("email", email);

export const getAthletesByCoachId = async (supabase, coach_id) =>
  supabase
    .from("coach_athletes")
    .select("*, athletes(*, onboarding_form_response(*), calendars(*))")
    .eq("coach_id", coach_id)
    .is("deleted_at", null);

export const getAthleteProfile = async (supabase, athlete_id) =>
  await supabase
    .from("athletes")
    .select(
      "*, onboarding_form_response(*), check_ins(*), notifications(*), events(*), calendars(*)"
    )
    .eq("id", athlete_id)
    .limit(10, { refrencedTable: "check_ins" });

export const insertAthlete = async (supabase, athlete) =>
  await supabase.from("athletes").insert([athlete]).select();

export const upsertAthlete = async (supabase, athlete) =>
  supabase.from("athletes").upsert(athlete);

// COACH ATHLETE
// COACH ATHLETE
// COACH ATHLETE
export const getCoachAthlete = async (supabase, coach_id, athlete_id) =>
  await supabase
    .from("coach_athletes")
    .select()
    .eq("coach_id", coach_id)
    .eq("athlete_id", athlete_id);

export const insertCoachAthlete = async (supabase, coach_athlete) =>
  await supabase.from("coach_athletes").insert(coach_athlete).select();

// CALENDAR
// CALENDAR
// CALENDAR
export const insertCalendar = async (supabase, calendar) =>
  await supabase.from("calendars").insert(calendar).select();

// OBFORM
// OBFORM
// OBFORM
export const getOnboardingFormsByUserId = async (supabase, user_id) =>
  await supabase
    .from("onboarding_forms")
    .select("*, onboarding_form_response(*, athletes(*))")
    .eq("user_id", user_id)
    .is("deleted_at", null);

export const upsertOnboardingForm = async (supabase, onboarding_form) =>
  await supabase.from("onboarding_forms").upsert(onboarding_form).select();

//  OBFORM RESPONSE
//  OBFORM RESPONSE
//  OBFORM RESPONSE
export const getOnboardingFormResponseById = async (supabase, id) =>
  await supabase
    .from("onboarding_form_response")
    .select("* , onboarding_forms(*)")
    .eq("id", id);
export const insertOnboardingFormResponse = async (
  supabase,
  onboarding_form_response
) =>
  await supabase
    .from("onboarding_form_response")
    .insert([onboarding_form_response])
    .select();

export const upsertOnboardingFormResponse = async (
  supabase,
  onboarding_form_response
) => supabase.from("onboarding_form_response").upsert(onboarding_form_response);
