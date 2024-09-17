import { Box, Button, TextField, Typography } from "@mui/material";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import { getCoachById, updateCoach } from "../../services/query";
import { MobileDatePicker } from "@mui/x-date-pickers";

export const AccountSettings = () => {
  const { register, handleSubmit, reset, control } = useForm({
    resetOptions: {
      keepDirtyValues: true,
    },
  });
  const { user } = useAuth();
  const supabase = useSupabase();

  const getCoach = async () => {
    const { data } = await getCoachById(supabase, user.id);
    if (data) {
      reset(data[0]);
      console.log(data);
    }
  };

  const onSubmit = handleSubmit((data) => {
    updateCoach(supabase, data, user.id);
    console.log(data);
  });

  useEffect(() => {
    if (user) {
      getCoach();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <>
      <PageContainer>
        <Typography variant="h5">Account Settings</Typography>
        <form action="">
          <Box sx={{ mt: 3 }}>
            <TextField
              {...register("first_name")}
              label="First Name"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <TextField
              {...register("last_name")}
              label="Last Name"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <TextField
              {...register("city")}
              label="City"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <TextField
              {...register("country")}
              label="Country"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <TextField
              {...register("phone_number")}
              label="Phone Number"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <TextField
              {...register("sports_activities")}
              label="Sport & Activities"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <TextField
              {...register("athlete_types")}
              label="Athlete Types"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <TextField
              {...register("athlete_count")}
              label="Number of athletes"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ maxWidth: 400, mt: 3 }}>
            <Controller
              control={control}
              name="dob"
              rules={{ required: true }}
              render={({ field }) => {
                console.log({ field });
                return (
                  <MobileDatePicker
                    label="Date of Birth"
                    format="yyyy-MM-dd"
                    value={new Date(field.value)}
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
          <br />
          <br />
          <Button type="submit" variant="contained" onClick={onSubmit}>
            Submit
          </Button>
          <br />
          <br />
        </form>
      </PageContainer>
    </>
  );
};
