import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { ArrowDownward, ArrowUpward, Delete } from "@mui/icons-material";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import {
  deleteExercisePlans,
  insertExercisePlans,
  upsertPlan,
} from "../../services/query";

const previewStyle = (e, isVideo) => ({
  backgroundImage: `url('${
    isVideo
      ? `https://i3.ytimg.com/vi/${e.videos[0].id}/maxresdefault.jpg`
      : e.images[0]
  }')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: 50,
  height: 50,
  ml: "auto",
  display: {
    xs: "none",
    sm: "block",
  },
});

export const ExerciseUnits = ({ units }) => {
  return (
    <>
      {units.sets && `Sets: ${units.sets}`}
      {units.reps && ` - Reps: ${units.reps}`}
      {units.rest && ` - Rest: ${units.rest}sec`}
      {units.distance && ` - Distance: ${units.distance}m`}
      {units.duration && ` - Duration: ${units.duration} minutes`}
    </>
  );
};

export const TrainingPlanModal = ({
  open,
  handleClose,
  exercises,
  plan,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const { register, handleSubmit } = useForm({
    defaultValues: plan
      ? { name: plan.name, overview: plan.overview }
      : {
          name: "",
          overview: "",
        },
  });
  const { user } = useAuth();
  const supabase = useSupabase();

  useEffect(() => {
    if (!plan) {
      return;
    }
    const selected = plan.exercise_plans.map((ep) => ({
      ...ep.exercises,
      order: ep.order,
    }));
    setSelectedExercises(selected);
  }, [plan]);

  const isUpdate = plan && plan.id;

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);

    const id = isUpdate ? { id: plan.id } : {};
    const planPayload = {
      ...id,
      ...data,
      coach_id: user.id,
    };

    const { data: newPlan, error: newPlanError } = await upsertPlan(
      supabase,
      planPayload
    );

    if (newPlanError) {
      console.error(newPlanError);
      setLoading(false);
      return;
    }

    if (isUpdate) {
      // first, delete all exercise_plans if it's an update
      await deleteExercisePlans(supabase, plan.id);
    }

    // create the exercise_plans
    const exercisePlans = selectedExercises.map((e) => ({
      exercise_id: e.id,
      plan_id: newPlan[0].id,
      order: e.order,
    }));

    await insertExercisePlans(supabase, exercisePlans);

    setLoading(false);
    onSuccess();
    handleClose();
  });

  const move = (currentIndex, direction) => {
    setSelectedExercises((prevItems) => {
      const updatedItems = [...prevItems];

      const newIndex = currentIndex - direction;

      if (newIndex >= 0 && newIndex < updatedItems.length) {
        const tempOrder = updatedItems[currentIndex].order;
        updatedItems[currentIndex].order = updatedItems[newIndex].order;
        updatedItems[newIndex].order = tempOrder;

        [updatedItems[currentIndex], updatedItems[newIndex]] = [
          updatedItems[newIndex],
          updatedItems[currentIndex],
        ];
      }

      return updatedItems;
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          <Typography>
            {isUpdate ? "Update Training Plan" : "Create New Training Plan"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {!isUpdate && (
            <DialogContentText>
              Training plans are a way to organize your training schedule. You
              can create Training Plans, add workouts to them, and assign them
              to your athletes calendar.
            </DialogContentText>
          )}

          <Box sx={{ mb: 2, mt: 3 }}>
            <TextField {...register("name")} label="Plan Name" fullWidth />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              {...register("overview")}
              label="Overview"
              fullWidth
              multiline
              minRows={3}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <List
              sx={{
                width: "100%",
                "& ul": { padding: 0 },
              }}
              subheader={<li />}
            >
              {selectedExercises.length > 0 &&
                selectedExercises.map((e, currentIndex) => (
                  <React.Fragment key={e.order}>
                    <ListItem style={{ paddingLeft: 0 }}>
                      <ListItemIcon sx={{ mr: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            move(currentIndex, 1);
                          }}
                        >
                          <ArrowUpward sx={{ height: 18, width: "auto" }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            move(currentIndex, -1);
                          }}
                        >
                          <ArrowDownward sx={{ height: 18, width: "auto" }} />
                        </IconButton>
                        {e.images.length > 0 ? (
                          <Box sx={previewStyle(e)}></Box>
                        ) : e.videos.length > 0 ? (
                          <Box sx={previewStyle(e, true)}></Box>
                        ) : null}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${e.title}`}
                        secondary={<ExerciseUnits units={e.units} />}
                      />
                      <ListItemIcon
                        style={{ marginLeft: "auto", minWidth: "auto" }}
                      >
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedExercises(
                              selectedExercises.filter(
                                (se) => se.order !== e.order
                              )
                            );
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemIcon>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
            </List>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Add Exercise</Typography>
            <Box
              sx={{
                display: {
                  xs: "block",
                  sm: "flex",
                },
              }}
            >
              <Autocomplete
                disablePortal
                options={exercises}
                sx={{
                  mb: {
                    xs: 2,
                    sm: 0,
                  },
                  width: "100%",
                }}
                onChange={(e, v) =>
                  v &&
                  setSelectedExercises([
                    ...selectedExercises,
                    { ...v, order: selectedExercises.length + 1 },
                  ])
                }
                renderInput={(params) => (
                  <TextField {...params} label="Search Exercise" />
                )}
                getOptionLabel={(option) => option.title || ""}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Box
                      display="flex"
                      alignItems={"center"}
                      sx={{ borderBottom: " 1px solid #ddd", width: "100%" }}
                    >
                      <Box display="flex" flexDirection="column" mr={1}>
                        <Typography>{option.title}</Typography>
                        <Typography variant="caption" mb={1}>
                          {option.description}
                        </Typography>
                        <Typography variant="caption" mb={1}>
                          <ExerciseUnits units={option.units} />
                        </Typography>
                      </Box>
                      {option.images.length > 0 ? (
                        <Box sx={previewStyle(option)}></Box>
                      ) : option.videos.length > 0 ? (
                        <Box sx={previewStyle(option, true)}></Box>
                      ) : null}
                    </Box>
                  </li>
                )}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="success" type="submit" disabled={loading}>
            {isUpdate ? "Update" : "Create"}
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
