import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useForm } from "react-hook-form";
import { SPORT_TYPES } from "../../utils/constant";
import { useEffect, useState } from "react";
import {
  getYouTubeVideoId,
  isValidURL,
  isValidYouTubeUrl,
} from "../../utils/validate";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import { upsertExercise } from "../../services/query";

export const ExerciseModal = ({ open, handleClose, exercise, onSuccess }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: exercise || {},
  });
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [videoText, setVideoText] = useState("");
  const [imageText, setImageText] = useState("");
  const [sportTypes, setSportTypes] = useState([]);
  const { user } = useAuth();
  const supabase = useSupabase();

  useEffect(() => {
    if (!exercise) {
      return;
    }

    setVideos(exercise.videos || []);
    setImages(exercise.images || []);
    setSportTypes(exercise.sport_types || []);
  }, [exercise]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const id = exercise && exercise.id ? { id: exercise.id } : {};

    const payload = {
      ...id,
      ...data,
      videos,
      images,
      coach_id: user.id,
    };

    await upsertExercise(supabase, payload);
    setLoading(false);
    onSuccess();
    handleClose();
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          <Typography variant="subtitle">
            {exercise ? "Update" : "Create New"} Exercise
          </Typography>
        </DialogTitle>
        <DialogContent>
          {!exercise && (
            <DialogContentText sx={{ mb: 3 }}>
              Exercises are the building blocks of your training plan. Create a
              new exercise to add to one of your training plans.
            </DialogContentText>
          )}
          <Box
            sx={{
              mb: 2,
            }}
          >
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
            <Box sx={{ mb: 2 }}>
              <FormGroup sx={{ flexDirection: "row" }}>
                {Object.keys(SPORT_TYPES).map((key) => (
                  <FormControlLabel
                    key={key}
                    {...register("sport_types[]")}
                    control={<Checkbox />}
                    label={SPORT_TYPES[key].label}
                    value={key}
                    checked={sportTypes.includes(key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSportTypes([...sportTypes, key]);
                      } else {
                        setSportTypes(sportTypes.filter((st) => st !== key));
                      }
                    }}
                  />
                ))}
              </FormGroup>
            </Box>
            <Grid2 container spacing={2}>
              <Grid2 item xs={12} sm={4}>
                <TextField
                  {...register("units.sets")}
                  label="Sets"
                  type="number"
                  fullWidth
                />
              </Grid2>
              <Grid2 item xs={12} sm={4}>
                <TextField
                  {...register("units.reps")}
                  label="Reps"
                  type="number"
                  fullWidth
                />
              </Grid2>
              <Grid2 item xs={12} sm={4}>
                <TextField
                  {...register("units.rest")}
                  label="Rest in seconds"
                  type="number"
                  fullWidth
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  {...register("units.distance")}
                  label="Distance in meters"
                  type="number"
                  fullWidth
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  {...register("units.time")}
                  label="Time in minutes"
                  type="number"
                  fullWidth
                />
              </Grid2>
            </Grid2>
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
              value={videoText}
              onChange={(e) => setVideoText(e.target.value)}
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
            <Button
              variant="contained"
              onClick={() => {
                if (!isValidYouTubeUrl(videoText)) {
                  setVideoText("");
                  return alert("Invalid youtube url");
                }

                setVideos([
                  ...videos,
                  {
                    url: videoText,
                    id: getYouTubeVideoId(videoText),
                  },
                ]);
                setVideoText("");
              }}
            >
              Add
            </Button>
          </Box>
          <Grid2 container spacing={2} sx={{ mb: 2 }}>
            {videos.map((v, i) => (
              <Grid2 key={i} item xs={4}>
                <Card
                  sx={{
                    aspectRatio: 16 / 9,
                    background: `url(https://i3.ytimg.com/vi/${v.id}/maxresdefault.jpg) no-repeat center center`,
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
                      sx={{
                        background: "rgba(255, 255, 255, .7) !important",
                        marginLeft: "auto",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 1) !important",
                        },
                      }}
                      onClick={() =>
                        setVideos(videos.filter((vid) => v.id !== vid.id))
                      }
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>

          {/* IMAGES */}
          {/* IMAGES */}
          {/* IMAGES */}
          {/* IMAGES */}
          <Typography sx={{ mb: 1 }}>Add Images</Typography>
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
              label="Paste Image URL"
              type="url"
              fullWidth
              value={imageText}
              onChange={(e) => setImageText(e.target.value)}
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
            <Button
              variant="contained"
              onClick={() => {
                if (!isValidURL(imageText)) {
                  setImageText("");
                  return alert("Invalid url");
                }

                setImages([...images, imageText]);
                setImageText("");
              }}
            >
              Add
            </Button>
          </Box>
          <Grid2 container spacing={2}>
            {images.map((image, i) => (
              <Grid2 key={i} item xs={4}>
                <Card
                  sx={{
                    aspectRatio: 16 / 9,
                    background: `url(${image}) no-repeat center center`,
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
                      sx={{
                        background: "rgba(255, 255, 255, .7) !important",
                        marginLeft: "auto",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 1) !important",
                        },
                      }}
                      onClick={() =>
                        setImages(images.filter((img) => image !== img))
                      }
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>
          <Grid2 item xs={4} sx={{ height: 20 }}></Grid2>
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="success" disabled={loading}>
            {exercise ? "Update" : "Create"}
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
