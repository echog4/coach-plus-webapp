import { useState } from "react";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { TrainingPlanModal } from "../../components/TrainingPlanModal/TrainingPlanModal";
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

const trainingPlansMock = [
  {
    id: 1,
    name: "Beginner Training Plan",
    description: "A training plan for beginners",
    exercises: [
      {
        name: "Pushups",
        duration: "3 sets of 10",
      },
      {
        name: "Pullups",
        duration: "3 sets of 10",
      },
    ],
  },
  {
    id: 2,
    name: "Intermediate Training Plan",
    description: "A training plan for intermediate",
    exercises: [
      {
        name: "Pushups",
        duration: "3 sets of 10",
      },
      {
        name: "Pullups",
        duration: "3 sets of 10",
      },
    ],
  },
  {
    id: 3,
    name: "Advanced Training Plan",
    description: "A training plan for advanced",
    exercises: [
      {
        name: "Pushups",
        duration: "3 sets of 10",
      },
      {
        name: "Pullups",
        duration: "3 sets of 10",
      },
    ],
  },
  {
    id: 4,
    name: "Expert Training Plan",
    description: "A training plan for experts",
    exercises: [
      {
        name: "Pushups",
        duration: "3 sets of 10",
      },
      {
        name: "Pullups",
        duration: "3 sets of 10",
      },
    ],
  },
];

const exercisesMock = [
  ...trainingPlansMock[0].exercises,
  ...trainingPlansMock[1].exercises,
  ...trainingPlansMock[2].exercises,
  ...trainingPlansMock[3].exercises,
];

export const TrainingPlanRoute = () => {
  // const [trainingPlans, setTrainingPlans] = useState([]);
  const [trainingPlanOpen, setTrainingPlanOpen] = useState(false);
  const [tpSearch, setTpSearch] = useState("");
  const [tpLoadMore, setTpLoadMore] = useState(false);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [eSearch, setESearch] = useState("");
  const [eLoadMore, setELoadMore] = useState(false);

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
            {trainingPlansMock
              .slice(0, tpLoadMore ? trainingPlansMock.length : 3)
              .filter((tp) =>
                tp.name.toLowerCase().includes(tpSearch.toLowerCase())
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
                    <Typography variant="body2">{plan.description}</Typography>
                    <Box flexGrow={1}>
                      {plan.exercises.map((exercise) => (
                        <Box key={exercise.name} sx={{ mb: 1 }}>
                          <Typography variant="body1">
                            {exercise.name}
                          </Typography>
                          <Typography variant="body2">
                            {exercise.duration}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    <Box display="flex">
                      <Button
                        color="primary"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => setTrainingPlanOpen(true)}
                      >
                        Edit
                      </Button>

                      <IconButton sx={{ ml: "auto" }} color="pink">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid2>
              ))}
          </Grid2>
          {!tpLoadMore && (
            <Button fullWidth onClick={() => setTpLoadMore(true)}>
              Load All
            </Button>
          )}
        </Box>
        {/* EXCERSISE */}
        {/* EXCERSISE */}
        {/* EXCERSISE */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5">Exercises</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="small"
            sx={{ marginLeft: "auto" }}
            onClick={() => setExerciseModalOpen(true)}
          >
            Add New Plan
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
            {exercisesMock
              .slice(0, eLoadMore ? exercisesMock.length : 3)
              .filter((e) =>
                e.name.toLowerCase().includes(eSearch.toLowerCase())
              )
              .map((e, i) => (
                <Grid2 key={i} sm={4} xs={12} size="grow">
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6">{e.name}</Typography>
                    <Typography variant="body2" flexGrow={1}>
                      {e.duration}
                    </Typography>
                    <Box display="flex">
                      <Button
                        color="primary"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => setExerciseModalOpen(true)}
                      >
                        Edit
                      </Button>

                      <IconButton sx={{ ml: "auto" }} color="pink">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid2>
              ))}
          </Grid2>
          {!eLoadMore && (
            <Button fullWidth onClick={() => setELoadMore(true)}>
              Load All
            </Button>
          )}
        </Box>
      </PageContainer>
      {trainingPlanOpen && (
        <TrainingPlanModal
          open={trainingPlanOpen}
          handleClose={() => setTrainingPlanOpen(false)}
          handleSubmit={console.log}
        />
      )}
      {exerciseModalOpen && (
        <ExerciseModal
          open={exerciseModalOpen}
          handleClose={() => setExerciseModalOpen(false)}
          handleSubmit={console.log}
        />
      )}
    </>
  );
};
