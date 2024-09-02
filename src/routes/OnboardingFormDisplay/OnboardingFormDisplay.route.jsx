import { DateField } from "@mui/x-date-pickers";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";

export const forms = [
  {
    id: 1,
    icon: "🏊",
    title: "Swimming Training",
    sentTo: 4,
    responded: 2,
  },
];

export const OnboardingFormDisplayRoute = () => {
  const { register } = useForm();

  return (
    <PageContainer>
      <Card variant="outlined">
        <form>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Welocome to Coach+
            </Typography>
            <Typography gutterBottom>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Exercitationem praesentium facilis nihil explicabo aut porro
              quisquam odio odit sit. Tempora placeat voluptatibus ratione,
              reiciendis consectetur corporis iusto asperiores! At, tempora?
            </Typography>

            <Box sx={{ maxWidth: 400, mb: 3, mt: 3 }}>
              <TextField
                {...register("firstName")}
                label="First Name"
                fullWidth
              />
            </Box>
            <Box sx={{ maxWidth: 400, mb: 3 }}>
              <TextField
                {...register("lastName")}
                label="Last Name"
                fullWidth
              />
            </Box>
            <Box sx={{ maxWidth: 400, mb: 3 }}>
              <TextField
                {...register("phone")}
                label="Phone Number"
                fullWidth
              />
            </Box>
            <Box sx={{ maxWidth: 400, mb: 3 }}>
              <TextField {...register("city")} label="City" fullWidth />
            </Box>
            <Box sx={{ maxWidth: 400, mb: 3 }}>
              <TextField {...register("Country")} label="Country" fullWidth />
            </Box>
            <Box sx={{ maxWidth: 400, mb: 3 }}>
              <DateField {...register("dob")} label="Date of Birth" fullWidth />
            </Box>
            <Box sx={{ maxWidth: 400, mb: 3 }}>
              <TextField
                {...register("height")}
                label="Height in cm"
                fullWidth
              />
            </Box>
            <Box sx={{ maxWidth: 400, mb: 3 }}>
              <TextField
                {...register("weight")}
                label="Weight in kg"
                fullWidth
              />
            </Box>
            <Box sx={{ maxWidth: 400, mb: 3 }}>
              <Typography>
                Custom question lorem ipsum dolot sitt amet?
              </Typography>
              <TextField {...register("weight")} fullWidth />
            </Box>
          </CardContent>
          <CardActions>
            <Button sx={{ ml: "auto" }} size="small">
              Submit
            </Button>
          </CardActions>
        </form>
      </Card>
    </PageContainer>
  );
};
