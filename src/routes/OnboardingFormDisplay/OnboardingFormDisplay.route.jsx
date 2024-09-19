import { MobileDatePicker } from "@mui/x-date-pickers";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import {
  Box,
  Button,
  CardActions,
  CardContent,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import {
  getOnboardingFormResponseById,
  upsertAthlete,
  upsertOnboardingFormResponse,
} from "../../services/query";

export const OnboardingFormDisplayRoute = () => {
  const [obf, setObf] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const params = useParams();

  const onSubmit = handleSubmit(
    async ({
      first_name,
      last_name,
      city,
      country,
      dob,
      height,
      weight,
      custom,
    }) => {
      const athleteData = {
        id: obf.athlete_id,
        first_name,
        last_name,
        full_name: `${first_name} ${last_name}`,
        city,
        country,
        dob,
        status: "VERIFIED",
      };
      console.log({ athleteData });

      const formResponseData = {
        id: obf.id,
        height,
        weight,
        custom_responses: custom,
        status: "completed",
      };

      await upsertAthlete(supabase, athleteData);

      await upsertOnboardingFormResponse(supabase, formResponseData);

      alert(
        "Thank you for completeing the form. You will be notified via Google Calendar when your training starts."
      );

      window.location.reload();
    }
  );

  useEffect(() => {
    getOnboardingFormResponseById(supabase, params.id).then(
      ({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }

        setObf(data[0]);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!obf) {
    return <PageContainer>Loading...</PageContainer>;
  }

  if (obf?.status === "completed") {
    return <PageContainer>Form already completed</PageContainer>;
  }

  return (
    <PageContainer>
      <Paper variant="outlined" sx={{ maxWidth: 600, margin: "auto" }}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ mb: 4 }}
            >
              {obf?.onboarding_forms?.icon} {obf?.onboarding_forms?.title}
            </Typography>
            <Typography gutterBottom sx={{ mb: 4 }}>
              {obf?.onboarding_forms?.welcome_message}
            </Typography>
            <Box sx={{ mb: 3, mt: 3 }}>
              <TextField
                {...register("first_name", { required: true })}
                label="First Name"
                error={errors.first_name}
                fullWidth
                helperText={errors.first_name ? "This field is required" : ""}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("last_name", { required: true })}
                label="Last Name"
                fullWidth
                error={errors.last_name}
                helperText={errors.last_name ? "This field is required" : ""}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("city", { required: true })}
                label="City"
                fullWidth
                error={errors.city}
                helperText={errors.city ? "This field is required" : ""}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("country", { required: true })}
                label="Country"
                fullWidth
                error={errors.country}
                helperText={errors.country ? "This field is required" : ""}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Controller
                control={control}
                name="dob"
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <MobileDatePicker
                      label="Date of Birth"
                      sx={{
                        width: "100%",
                      }}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      error={errors.dob}
                      helperText={errors.dob ? "This field is required" : ""}
                      fullWidth
                    />
                  );
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("height", { required: true })}
                label="Height in cm"
                fullWidth
                error={errors.height}
                helperText={errors.height ? "This field is required" : ""}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("weight", { required: true })}
                label="Weight in kg"
                fullWidth
                error={errors.weight}
                helperText={errors.weight ? "This field is required" : ""}
              />
            </Box>
            {obf?.onboarding_forms?.custom_questions?.map((field) => (
              <Box sx={{ mb: 3 }} key={field.name}>
                <Typography>{field.name}</Typography>
                <TextField
                  {...register(`custom.${field.name}`, { required: true })}
                  fullWidth
                  error={errors[field.name]}
                  helperText={
                    errors[field.name] ? "This field is required" : ""
                  }
                />
              </Box>
            ))}
          </CardContent>
          <CardActions>
            <Button
              sx={{ ml: "auto" }}
              size="small"
              type="submit"
              onClick={() => onSubmit()}
            >
              Submit
            </Button>
          </CardActions>
        </form>
      </Paper>
    </PageContainer>
  );
};
