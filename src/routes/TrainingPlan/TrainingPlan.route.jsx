import { useEffect, useState } from "react";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import {
  ExerciseUnits,
  TrainingPlanModal,
} from "../../components/TrainingPlanModal/TrainingPlanModal";
import { ExerciseModal } from "../../components/ExerciseModal/ExerciseModal";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import {
  deleteExercise,
  deletePlan,
  getExercisesByCoachId,
  getPlansByCoachId,
} from "../../services/query";

export const TrainingPlanRoute = () => {
  // const [trainingPlans, setTrainingPlans] = useState([]);

  const [plans, setPlans] = useState([]);
  const [trainingPlanOpen, setTrainingPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [tpSearch, setTpSearch] = useState("");
  const [tpLoadMore, setTpLoadMore] = useState(false);

  const [exercises, setExercises] = useState([]);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [eSearch, setESearch] = useState("");
  const [eLoadMore, setELoadMore] = useState(false);
  const { user } = useAuth();
  const supabase = useSupabase();

  const loadExercises = () => {
    getExercisesByCoachId(supabase, user.id).then(({ data }) => {
      setExercises(data || []);
    });
  };

  const loadPlans = () => {
    getPlansByCoachId(supabase, user.id).then(({ data }) => {
      setPlans(data || []);
    });
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    loadExercises();
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <PageContainer>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5">Training Plans</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="small"
            sx={{ marginLeft: "auto" }}
            onClick={() => setTrainingPlanOpen(true)}
          >
            Add New Plan
          </Button>
        </Box>
        <TextField
          label="Search plans by name..."
          variant="standard"
          fullWidth
          sx={{
            maxWidth: {
              xs: "100%",
              sm: 300,
            },
            mb: 3,
          }}
          value={tpSearch}
          onChange={(e) => setTpSearch(e.target.value)}
        />
        <Box sx={{ mb: 2 }}>
          <Grid2 container spacing={2} sx={{ mb: 2 }}>
            {plans
              .slice(0, tpLoadMore ? plans.length : 3)
              .filter((plan) =>
                plan.name.toLowerCase().includes(tpSearch.toLowerCase())
              )
              .map((plan) => (
                <Grid2 key={plan.id} sm={4} xs={12} size="grow">
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6">{plan.name}</Typography>
                    <Typography variant="body2">
                      {plan.overview.length > 50
                        ? plan.overview.slice(0, 50) + "..."
                        : plan.overview}
                    </Typography>
                    <Box flexGrow={1} mt={2}>
                      {plan.exercise_plans.map((ep) => (
                        <Box key={ep.exercises.id} sx={{ mb: 1 }}>
                          <Typography variant="body1" mb={0}>
                            {ep.exercises.title}:{" "}
                            <Typography variant="caption">
                              <ExerciseUnits units={ep.exercises.units} />
                            </Typography>
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    <Box display="flex">
                      <Button
                        color="primary"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => {
                          setTrainingPlanOpen(true);
                          setSelectedPlan(plan);
                        }}
                      >
                        Edit
                      </Button>

                      <IconButton
                        sx={{ ml: "auto" }}
                        color="pink"
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Deleting training plan: "${plan.name}". Please confirm.`
                            )
                          ) {
                            await deletePlan(supabase, plan.id);
                            loadPlans();
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid2>
              ))}
          </Grid2>
          {!tpLoadMore && plans.length > 3 && (
            <Button fullWidth onClick={() => setTpLoadMore(true)}>
              Load All
            </Button>
          )}
        </Box>
        {/* EXCERSISE */}
        {/* EXCERSISE */}
        {/* EXCERSISE */}
        <Box sx={{ display: "flex", alignItems: "center", pt: 2 }}>
          <Typography variant="h5" style={{ marginRight: 5 }}>
            Exercises
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="small"
            sx={{ marginLeft: "auto" }}
            href="/import-exercises"
          >
            Import
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="small"
            sx={{ marginLeft: 1 }}
            onClick={() => setExerciseModalOpen(true)}
          >
            Add New Exercise
          </Button>
        </Box>
        <TextField
          label="Search exercises by name..."
          variant="standard"
          fullWidth
          sx={{
            maxWidth: {
              xs: "100%",
              sm: 300,
            },
            mb: 3,
          }}
          value={eSearch}
          onChange={(e) => setESearch(e.target.value)}
        />
        <Box>
          <Grid2 container spacing={2} sx={{ mb: 1 }}>
            {exercises
              .slice(0, eLoadMore ? exercises.length : 3)
              .filter((e) =>
                e.title.toLowerCase().includes(eSearch.toLowerCase())
              )
              .map((e, i) => (
                <Grid2 key={i} sm={4} xs={12} size="grow">
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      pb: 1,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6">{e.title}</Typography>
                    <Typography variant="body2" flexGrow={1} mb={1}>
                      {e.description}
                    </Typography>
                    {e.units.sets && e.units.reps && (
                      <Typography variant="caption">
                        {e.units.sets} sets of {e.units.reps} reps
                      </Typography>
                    )}
                    {e.units.rest && (
                      <Typography variant="caption">
                        {e.units.rest} seconds rest
                      </Typography>
                    )}
                    {e.units.distance && (
                      <Typography variant="caption">
                        {e.units.distance} meters
                      </Typography>
                    )}
                    <Box display="flex" mt={1}>
                      <Button
                        color="primary"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => {
                          setSelectedExercise(e);
                          setExerciseModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <IconButton
                        sx={{ ml: "auto" }}
                        color="pink"
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Deleting excercise: "${e.title}". Please confirm.`
                            )
                          ) {
                            await deleteExercise(supabase, e.id);
                            loadExercises();
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid2>
              ))}
          </Grid2>
          {!eLoadMore && exercises.length > 3 && (
            <Button fullWidth onClick={() => setELoadMore(true)}>
              Load All
            </Button>
          )}
        </Box>
      </PageContainer>
      {trainingPlanOpen && (
        <TrainingPlanModal
          exercises={exercises}
          open={trainingPlanOpen}
          plan={selectedPlan}
          handleClose={() => {
            setTrainingPlanOpen(false);
            setSelectedPlan(null);
          }}
          onSuccess={() => loadPlans()}
        />
      )}
      {exerciseModalOpen && (
        <ExerciseModal
          open={exerciseModalOpen}
          exercise={selectedExercise}
          handleClose={() => {
            setExerciseModalOpen(false);
            setSelectedExercise(null);
          }}
          onSuccess={() => loadExercises()}
        />
      )}
    </>
  );
};
