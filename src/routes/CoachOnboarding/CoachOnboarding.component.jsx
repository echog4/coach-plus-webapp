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
import { useForm } from "react-hook-form";
import { DateField } from "@mui/x-date-pickers";
import { useAuth } from "../../providers/AuthContextProvider";
const steps = [
  "Personal Information",
  "Location and Contact",
  "Coaching Experience",
];

export const CoachOnboardingComponent = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const { register, handleSubmit } = useForm();
  const { user } = useAuth();

  const onSubmit = handleSubmit((data) => alert(JSON.stringify(data)));

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <PageContainer>
      <Paper>
        <Box sx={{ width: "100%", p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
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
                <Typography sx={{ mb: 1 }} variant="h6">
                  {steps[activeStep]}
                </Typography>
                {activeStep === 0 && <PersonalInfo register={register} />}
                {activeStep === 1 && (
                  <LocationAndContact email={user.email} register={register} />
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

const PersonalInfo = ({ register }) => (
  <>
    <Box sx={{ maxWidth: 300, mb: 1 }}>
      <TextField
        {...register("firstName")}
        label="First Name"
        variant="standard"
        fullWidth
      />
    </Box>
    <Box sx={{ maxWidth: 300, mb: 1 }}>
      <TextField
        {...register("lastName")}
        label="Last Name"
        variant="standard"
        fullWidth
      />
    </Box>
    <Box sx={{ maxWidth: 300, mb: 1 }}>
      <DateField
        {...register("dob")}
        label="Date of Birth"
        variant="standard"
        fullWidth
      />
    </Box>
  </>
);

const LocationAndContact = ({ register, email }) => (
  <>
    <Box sx={{ maxWidth: 300, mb: 1 }}>
      <TextField
        {...register("city")}
        label="City"
        variant="standard"
        fullWidth
      />
    </Box>
    <Box sx={{ maxWidth: 300, mb: 1 }}>
      <TextField
        {...register("Country")}
        label="Country"
        variant="standard"
        fullWidth
      />
    </Box>

    <Box sx={{ maxWidth: 300, mb: 1 }}>
      <TextField
        {...register("phone")}
        label="Phone Number"
        variant="standard"
        type="number"
        fullWidth
      />
    </Box>
    <Box sx={{ maxWidth: 300, mb: 1 }}>
      <TextField
        value={email}
        label="Email"
        variant="standard"
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
        {...register("sportActivity")}
        label="What sport or activity do you coach?"
        variant="standard"
        fullWidth
      />
    </Box>
    <Box sx={{ mb: 3 }}>
      <TextField
        {...register("typesOfAthletes")}
        label="What types of athletes do you coach?"
        variant="standard"
        helperText="e.g., amateur, professional, older adults"
        fullWidth
      />
    </Box>
    <Box sx={{ maxWidth: 400, mb: 3 }}>
      <TextField
        {...register("typesOfAthletes")}
        label="How many athletes do you currently coach?"
        variant="standard"
        type="number"
        fullWidth
      />
    </Box>
  </>
);
