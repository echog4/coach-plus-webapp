// COACH
// COACH
// COACH
export const getCoachById = async (supabase, id) =>
  await supabase.from("users").select().eq("id", id);

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
    .select(
      "*, athletes(*, onboarding_form_response(*), calendars(*), events(*))"
    )
    .eq("coach_id", coach_id)
    .is("deleted_at", null)
    .order("date", { ascending: true, referencedTable: "athletes.events" })
    .limit(1, { referencedTable: "athletes.events" });

export const getAthleteProfile = async (supabase, athlete_id) =>
  await supabase
    .from("athletes")
    .select(
      "*, onboarding_form_response(*), check_ins(*), notifications(*), events(*), calendars(*)"
    )
    .eq("id", athlete_id)
    .limit(10, { referencedTable: "check_ins" });

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

export const deleteOnboardingForm = async (supabase, id) =>
  await supabase
    .from("onboarding_forms")
    .update({ deleted_at: new Date() })
    .eq("id", id);

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

// TRAINING PLANS
// TRAINING PLANS
// TRAINING PLANS
export const getExercisesByCoachId = async (supabase, coach_id) =>
  await supabase
    .from("exercises")
    .select()
    .eq("coach_id", coach_id)
    .is("deleted_at", null);

export const getPlansByCoachId = async (supabase, coach_id) =>
  await supabase
    .from("plans")
    .select("*, exercise_plans(*, exercises(*))")
    .eq("coach_id", coach_id)
    .is("deleted_at", null);

export const upsertExercise = async (supabase, exercise) =>
  await supabase.from("exercises").upsert(exercise).select();

export const deleteExercise = async (supabase, id) =>
  await supabase
    .from("exercises")
    .update({ deleted_at: new Date() })
    .eq("id", id);

export const upsertPlan = async (supabase, plan) =>
  await supabase.from("plans").upsert(plan).select();

export const deletePlan = async (supabase, id) =>
  await supabase.from("plans").update({ deleted_at: new Date() }).eq("id", id);

export const insertExercisePlans = async (supabase, exercise_plan) =>
  await supabase.from("exercise_plans").insert(exercise_plan).select();

export const deleteExercisePlans = async (supabase, id) =>
  await supabase.from("exercise_plans").delete().eq("plan_id", id);

// CALENDARS
// CALENDARS
// CALENDARS
export const getCalendarsByCoachId = async (supabase, coach_id) =>
  await supabase
    .from("calendars")
    .select("*, events(*), athletes(*)")
    .eq("coach_id", coach_id)
    .is("deleted_at", null)
    .order("id", { ascending: true });

export const getCalendarsByCoachIdAthleteId = async (
  supabase,
  coach_id,
  athlete_id
) =>
  await supabase
    .from("calendars")
    .select("*, events(*), athletes(*)")
    .eq("coach_id", coach_id)
    .eq("athlete_id", athlete_id)
    .is("deleted_at", null);

export const toggleCalendar = async (supabase, id, enabled) =>
  await supabase.from("calendars").update({ enabled }).eq("id", id);

// EVENTS
// EVENTS
// EVENTS
export const getEventsByCoachId = async (supabase, coach_id) =>
  await supabase
    .from("events")
    .select()
    .eq("coach_id", coach_id)
    .gte("date", new Date())
    .is("deleted_at", null);

export const getEventsByCoachIdAthleteId = async (
  supabase,
  coach_id,
  athlete_id
) =>
  await supabase
    .from("events")
    .select()
    .eq("athlete_id", athlete_id)
    .eq("coach_id", coach_id)
    .gte("date", new Date())
    .is("deleted_at", null);

export const insertEvent = async (supabase, event) =>
  await supabase.from("events").insert(event).select();

export const deleteSBEvent = async (supabase, id) =>
  await supabase.from("events").delete().eq("id", id);
