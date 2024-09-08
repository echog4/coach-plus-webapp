import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useForm } from "react-hook-form";

export const ExerciseModal = ({ open, handleClose }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit((data) => alert(JSON.stringify(data)));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Typography>Create New Exercise</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>
          Exercises are the building blocks of your training plan. Create a new
          exercise to add to one of your training plans.
        </DialogContentText>
        <Box
          sx={{
            mb: 2,
          }}
        >
          <form onSubmit={onSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField {...register("title")} label="Title" fullWidth />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                {...register("description")}
                label="Description"
                fullWidth
                multiline
                minRows={3}
              />
            </Box>
            <Grid2 container spacing={2}>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  {...register("sets")}
                  label="Sets"
                  type="number"
                  fullWidth
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  {...register("reps")}
                  label="Reps"
                  type="number"
                  fullWidth
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  {...register("distance")}
                  label="Distance in meters"
                  type="number"
                  fullWidth
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  {...register("time")}
                  label="Time in minutes"
                  type="number"
                  fullWidth
                />
              </Grid2>
            </Grid2>
          </form>
        </Box>
        <Typography sx={{ mb: 1 }}>Add Youtube Videos</Typography>
        <Box
          sx={{
            mb: 2,
            display: {
              xs: "block",
              sm: "flex",
            },
          }}
        >
          <TextField
            label="Youtube Video URL"
            type="url"
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
              width: "100%",
            }}
          />
          <Button variant="contained">Add</Button>
        </Box>
        <Grid2 container spacing={2}>
          <Grid2 item xs={4}>
            <Card
              sx={{
                aspectRatio: 16 / 9,
                background:
                  "url(https://i3.ytimg.com/vi/0XRKDJdG_rA/maxresdefault.jpg) no-repeat center center",
                width: "100%",
                minHeight: 1,
                backgroundSize: "cover",
              }}
            >
              <CardActions
                disableSpacing
                sx={{
                  height: "100%",
                  alignItems: "end",
                }}
              >
                <IconButton
                  color="error"
                  sx={{ background: "#fff !important", marginLeft: "auto" }}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid2>
          <Grid2 item xs={4}>
            <Card
              sx={{
                aspectRatio: 16 / 9,
                background:
                  "url(https://i3.ytimg.com/vi/vE-95N4XCOo/maxresdefault.jpg) no-repeat center center",
                width: "100%",
                minHeight: 1,
                backgroundSize: "cover",
              }}
            >
              <CardActions
                disableSpacing
                sx={{
                  height: "100%",
                  alignItems: "end",
                }}
              >
                <IconButton
                  color="error"
                  sx={{ background: "#fff !important", marginLeft: "auto" }}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid2>
        </Grid2>
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
