import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import { Navigate } from "react-router-dom";
import { updateCoach } from "../../services/query";
import { trimAndValidatePhone } from "../../utils/validations";
const steps = [
  "Personal Information",
  "Location and Contact",
  "Coaching Experience",
];

export const CoachOnboardingComponent = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const { control, register, handleSubmit } = useForm();
  const { sessionUser, syncUser, session, user } = useAuth();
  const supabase = useSupabase();

  const onSubmit = handleSubmit(async (data) => {
    const trimedPhoneNumber = trimAndValidatePhone(
      `${data.area_code}${data.phone_number}`
    );
    if (!trimedPhoneNumber) {
      return alert(
        "Please enter a valid phone number consisting of digits only"
      );
    }
    const st_payload = {
      email: sessionUser.email,
      name: `${data.first_name} ${data.last_name}`,
      metadata: {
        cp_id: sessionUser.id,
      },
    };

    const { data: st_user } = await supabase.functions.invoke(
      "st-create-user",
      {
        body: st_payload,
      }
    );

    const st_customer_id = st_user?.customer.id;

    const payload = {
      ...data,
      phone_number: trimedPhoneNumber,
      email: sessionUser.email,
      status: "VERIFIED",
      onboarded_at: new Date().toISOString(),
      full_name: `${data.first_name} ${data.last_name}`,
      st_customer_id,
    };

    delete payload.area_code;

    await updateCoach(supabase, payload, sessionUser.id);

    await syncUser(session);
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  if (user && user.onboarded_at) {
    return <Navigate to="/" />;
  }

  return (
    <PageContainer>
      <Paper variant="outlined">
        <Box sx={{ width: "100%", p: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel>
                    <Typography
                      variant="subtitle"
                      sx={{
                        fontSize: { xs: 12, sm: 14 },
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <>
              <form onSubmit={onSubmit}>
                <Typography sx={{ mb: 3 }} variant="h6">
                  {steps[activeStep]}
                </Typography>
                {activeStep === 0 && (
                  <PersonalInfo control={control} register={register} />
                )}
                {activeStep === 1 && (
                  <LocationAndContact
                    email={sessionUser.email}
                    register={register}
                  />
                )}
                {activeStep === 2 && <Experience register={register} />}
              </form>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />

                <Button
                  onClick={
                    activeStep === steps.length - 1 ? onSubmit : handleNext
                  }
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </PageContainer>
  );
};

const PersonalInfo = ({ register, control }) => (
  <>
    <Box sx={{ maxWidth: 400, mb: 3 }}>
      <TextField {...register("first_name")} label="First Name" fullWidth />
    </Box>
    <Box sx={{ maxWidth: 400, mb: 3 }}>
      <TextField {...register("last_name")} label="Last Name" fullWidth />
    </Box>
    <Box sx={{ maxWidth: 400, mb: 3 }}>
      <Controller
        control={control}
        name="dob"
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <MobileDatePicker
              label="Date of Birth"
              value={field.value}
              inputRef={field.ref}
              onChange={(date) => {
                field.onChange(date);
              }}
              fullWidth
            />
          );
        }}
      />
    </Box>
  </>
);

const LocationAndContact = ({ register, email }) => (
  <>
    <Box sx={{ maxWidth: 400, mb: 3 }}>
      <TextField {...register("city")} label="City" fullWidth />
    </Box>
    <Box sx={{ maxWidth: 400, mb: 3 }}>
      <TextField {...register("country")} label="Country" fullWidth />
    </Box>

    <Box sx={{ maxWidth: 400, mb: 3 }} display="flex" alignItems="center">
      <Typography sx={{ mr: 1 }}>+</Typography>
      <TextField
        {...register("area_code")}
        label="Country Code"
        type="number"
        fullWidth
        sx={{ mr: 1, width: 120 }}
      />
      <TextField
        {...register("phone_number")}
        label="Phone Number"
        type="number"
        fullWidth
      />
    </Box>
    <Box sx={{ maxWidth: 400, mb: 3 }}>
      <TextField
        value={email}
        label="Email"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
      />
    </Box>
  </>
);

const Experience = ({ register }) => (
  <>
    <Box sx={{ mb: 3 }}>
      <TextField
        {...register("sports_activities")}
        label="What sport or activity do you coach?"
        fullWidth
      />
    </Box>
    <Box sx={{ mb: 3 }}>
      <TextField
        {...register("athlete_types")}
        label="What types of athletes do you coach?"
        helperText="e.g., amateur, professional, older adults"
        fullWidth
      />
    </Box>
    <Box sx={{ maxWidth: 400, mb: 3 }}>
      <TextField
        {...register("athlete_count")}
        label="How many athletes do you currently coach?"
        type="number"
        fullWidth
      />
    </Box>
  </>
);
