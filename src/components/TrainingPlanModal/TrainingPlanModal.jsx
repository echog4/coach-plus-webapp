import { Fragment } from "react";
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
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { ArrowDownward, ArrowUpward, Delete } from "@mui/icons-material";

const mockExercises = {
  warmUp: {
    name: "Warm Up",
    id: 1,
    exercises: [
      {
        name: "Jogging",
        duration: "10 minutes",
      },
      {
        name: "Stretching E",
        duration: "5 minutes",
      },
    ],
  },
  workout: {
    name: "Workout",
    id: 2,
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
  coolDown: {
    name: "Cool Down",
    id: 3,
    exercises: [
      {
        name: "Stretching",
        duration: "5 minutes",
      },
    ],
  },
};

export const TrainingPlanModal = ({ open, handleClose }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit((data) => alert(JSON.stringify(data)));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Typography>Create New Training Plan</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>
          Training plans are a way to organize your training schedule. You can
          create Training Plans, add workouts to them, and assign them to your
          athletes calendar.
        </DialogContentText>
        <form onSubmit={onSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField {...register("planName")} label="Plan Name" fullWidth />
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
        </form>
        <Box sx={{ mb: 2 }}>
          <List
            sx={{
              width: "100%",
              "& ul": { padding: 0 },
            }}
            subheader={<li />}
          >
            {[
              mockExercises.warmUp,
              mockExercises.workout,
              mockExercises.coolDown,
            ].map((section) => (
              <li key={`section-${section.id}`}>
                <ul>
                  <ListSubheader sx={{ borderBottom: 1, fontSize: 20 }}>
                    {section.name}
                  </ListSubheader>
                  {section.exercises.map((exercise) => (
                    <Fragment key={`exercise-${exercise.name}`}>
                      <ListItem style={{ paddingLeft: 0, flexWrap: "wrap" }}>
                        <ListItemIcon sx={{ mr: 1 }}>
                          <IconButton size="small">
                            <ArrowUpward />
                          </IconButton>
                          <IconButton size="small">
                            <ArrowDownward />
                          </IconButton>
                        </ListItemIcon>
                        <ListItemText
                          primary={exercise.name}
                          secondary={exercise.duration}
                        />
                        <ListItemIcon
                          style={{ marginLeft: "auto", minWidth: "auto" }}
                        >
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </ListItemIcon>
                      </ListItem>
                      <Divider />
                    </Fragment>
                  ))}
                </ul>
              </li>
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
              options={[
                ...Object.values(mockExercises.warmUp.exercises),
                ...Object.values(mockExercises.workout.exercises),
                ...Object.values(mockExercises.coolDown.exercises),
              ]}
              sx={{
                mr: {
                  xs: 0,
                  sm: 1,
                },
                mb: {
                  xs: 2,
                  sm: 0,
                },
                width: "100%",
              }}
              renderInput={(params) => (
                <TextField {...params} label="Exercise" />
              )}
              getOptionLabel={(option) => option.name}
              getOptionKey={(option) => option.name}
            />
            <FormControl
              fullWidth
              sx={{
                mr: {
                  xs: 0,
                  sm: 1,
                },
                mb: {
                  xs: 2,
                  sm: 0,
                },
                width: {
                  xs: "100%",
                  sm: 180,
                },
              }}
            >
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                value={1}
                label="Type"
                onChange={(e) => console.log(e.target.value)}
              >
                <MenuItem value={1}>Warm up</MenuItem>
                <MenuItem value={2}>Workout</MenuItem>
                <MenuItem value={3}>Cool Down</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained">Add</Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="error"
          sx={{ marginRight: "auto" }}
        >
          Delete
        </Button>
        <Button onClick={handleClose} color="success">
          Save
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
