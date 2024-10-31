// COACH
// COACH
// COACH

// id from session
// q-coach-get
export const getCoachById = async (supabase, id) =>
  await supabase.from("users").select().eq("id", id);

// id from session
// q-coach-update
export const updateCoach = async (supabase, user, user_id) =>
  await supabase.from("users").update(user).eq("id", user_id);

// id from session
// q-coach-reset
export const resetCoach = async (supabase, user_id) =>
  await supabase
    .from("users")
    .update({ onboarded_at: null, status: "PENDING" })
    .eq("id", user_id);

// ATHLETE
// ATHLETE
// ATHLETE
// only athletes accessible by coach id from session
// q-athlete-get
export const getAthleteByEmail = async (supabase, email) =>
  await supabase.from("athletes").select().eq("email", email);

// coach id from session
// q-athlete-by-coach
export const getAthletesByCoachId = async (supabase, coach_id) =>
  supabase
    .from("coach_athletes")
    .select(
      "*, athletes(*, onboarding_form_response(*), calendars(*), events(*))"
    )
    .eq("coach_id", coach_id)
    .is("deleted_at", null)
    .order("date", { ascending: false, referencedTable: "athletes.events" })
    .limit(1, { referencedTable: "athletes.events" });

// filter coach id from session
// q-athlete-profile
export const getAthleteProfile = async (supabase, athlete_id) =>
  await supabase
    .from("athletes")
    .select(
      "*, onboarding_form_response(*), check_ins(*), notifications(*), events(*), calendars(*)"
    )
    .eq("id", athlete_id)
    .order(
      "created_at",
      { ascending: false, referencedTable: "check_ins" },
      "date",
      { ascending: false, referencedTable: "athletes.events" }
    )
    .limit(10, { referencedTable: "check_ins" }, 1, {
      referencedTable: "athletes.events",
    });

// with coach_id from session
// q-athlete-insert
export const insertAthlete = async (supabase, athlete) =>
  await supabase.from("athletes").insert([athlete]).select();

// with coach_id from session
// q-athlete-upsert
export const upsertAthlete = async (supabase, athlete) =>
  supabase.from("athletes").upsert(athlete);

// COACH ATHLETE
// COACH ATHLETE
// COACH ATHLETE
// filter coach_id from session
// q-ca-get
export const getCoachAthlete = async (supabase, coach_id, athlete_id) =>
  await supabase
    .from("coach_athletes")
    .select()
    .eq("coach_id", coach_id)
    .eq("athlete_id", athlete_id);

//  coach_id from session
// q-ca-insert
export const insertCoachAthlete = async (supabase, coach_athlete) =>
  await supabase.from("coach_athletes").insert(coach_athlete).select();

// OBFORM
// OBFORM
// OBFORM
//  filter coach_id (user_id) from session
// q-obf-get
export const getOnboardingFormsByUserId = async (supabase, user_id) =>
  await supabase
    .from("onboarding_forms")
    .select("*, onboarding_form_response(*, athletes(*))")
    .eq("user_id", user_id)
    .is("deleted_at", null);

// filter coach_id from session
// q-obf-upsert
export const upsertOnboardingForm = async (supabase, onboarding_form) =>
  await supabase.from("onboarding_forms").upsert(onboarding_form).select();

// filter coach_id from session
// q-obf-delete
export const deleteOnboardingForm = async (supabase, id) =>
  await supabase
    .from("onboarding_forms")
    .update({ deleted_at: new Date() })
    .eq("id", id);

//  OBFORM RESPONSE
//  OBFORM RESPONSE
//  OBFORM RESPONSE
// q-obfres-p-get
export const getOnboardingFormResponseById = async (supabase, id) =>
  await supabase
    .from("onboarding_form_response")
    .select("* , onboarding_forms(*)")
    .eq("id", id);

// filter coach_id from session
// q-obfres-insert
export const insertOnboardingFormResponse = async (
  supabase,
  onboarding_form_response
) =>
  await supabase
    .from("onboarding_form_response")
    .insert([onboarding_form_response])
    .select();

// public method no session
// q-obfres-p-upsert
export const upsertOnboardingFormResponse = async (
  supabase,
  onboarding_form_response
) => supabase.from("onboarding_form_response").upsert(onboarding_form_response);

// TRAINING PLANS
// TRAINING PLANS
// TRAINING PLANS
// public display
// q-plan-p-get
export const getPlanByIdPublic = async (supabase, id, email) =>
  await supabase
    .from("plans")
    .select("*, exercise_plans(*, exercises(*))")
    .eq("id", id)
    .is("deleted_at", null);

// filter coach_id from session
// q-plan-get-by-coach
export const getPlansByCoachId = async (supabase, coach_id) =>
  await supabase
    .from("plans")
    .select("*, exercise_plans(*, exercises(*))")
    .eq("coach_id", coach_id)
    .is("deleted_at", null);

// filter coach_id from session
// q-plan-upsert
export const upsertPlan = async (supabase, plan) =>
  await supabase.from("plans").upsert(plan).select();

// filter coach_id from session
// q-plan-delete
export const deletePlan = async (supabase, id) =>
  await supabase.from("plans").update({ deleted_at: new Date() }).eq("id", id);

// filter coach_id from session
// q-exercise-by-coach
export const getExercisesByCoachId = async (supabase, coach_id) =>
  await supabase
    .from("exercises")
    .select()
    .eq("coach_id", coach_id)
    .is("deleted_at", null);

// filter coach_id from session
// q-exercise-upsert
export const upsertExercise = async (supabase, exercise) =>
  await supabase.from("exercises").upsert(exercise).select();

// filter coach_id from session
// q-exercise-delete
export const deleteExercise = async (supabase, id) =>
  await supabase
    .from("exercises")
    .update({ deleted_at: new Date() })
    .eq("id", id);

// public
// q-ep-insert
export const insertExercisePlans = async (supabase, exercise_plan) =>
  await supabase.from("exercise_plans").insert(exercise_plan).select();

// public
// q-ep-delete
export const deleteExercisePlans = async (supabase, id) =>
  await supabase.from("exercise_plans").delete().eq("plan_id", id);

// CALENDARS
// CALENDARS
// CALENDARS
// filter coach_id from session
// q-cal-get-by-coach
export const getCalendarsByCoachId = async (supabase, coach_id) =>
  await supabase
    .from("calendars")
    .select("*, events(*), athletes(*)")
    .eq("coach_id", coach_id)
    .is("deleted_at", null)
    .order("id", { ascending: true });
// filter coach_id from session
// q-cal-get-by-coach-athlete
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
// filter coach_id from session
// q-cal-toggle
export const toggleCalendar = async (supabase, id, enabled) =>
  await supabase.from("calendars").update({ enabled }).eq("id", id);

// q-cal-insert
export const insertCalendar = async (supabase, calendar) =>
  await supabase.from("calendars").insert(calendar).select();

// EVENTS
// EVENTS
// EVENTS
// filter coach_id from session
// q-events-get-by-coach
export const getEventsByCoachId = async (supabase, coach_id) =>
  await supabase
    .from("events")
    .select()
    .eq("coach_id", coach_id)
    .gte("date", new Date())
    .is("deleted_at", null);

// filter coach_id from session
// q-events-get-by-coach-athlete
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

// filter coach_id from session
// q-events-insert
export const insertEvent = async (supabase, event) =>
  await supabase.from("events").insert(event).select();

// filter coach_id from session
// q-events-delete
export const deleteSBEvent = async (supabase, id) => {
  await supabase.from("check_ins").delete().eq("event_id", id);
  await supabase.from("events").delete().eq("id", id);
};

// Delete athlete
// q-delete-athlete
export const deleteAthlete = async (supabase, athlete_id) =>
  await supabase.functions.invoke("q-delete-athlete", {
    body: {
      athlete_id,
    },
  });
