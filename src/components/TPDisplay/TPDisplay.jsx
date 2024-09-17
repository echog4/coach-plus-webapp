import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSupabase } from "../../providers/AuthContextProvider";
import { getPlanByIdPublic } from "../../services/query";
import { PageContainer } from "../PageContainer/PageContainer";
import { Box, Divider, Typography } from "@mui/material";
import { decodeTPURLId } from "../../utils/bas64";
import { ExerciseUnits } from "../TrainingPlanModal/TrainingPlanModal";

export const TPDisplay = () => {
  const [plan, setPlan] = useState(null);
  const { bid } = useParams();
  const supabase = useSupabase();

  const fetchPlan = async () => {
    const { email, id } = decodeTPURLId(bid);
    const { data: plan } = await getPlanByIdPublic(supabase, id, email);
    console.log({ plan });
    setPlan(plan[0]);
  };

  useState(() => {
    fetchPlan();
  }, [bid]);

  if (!plan) {
    return null;
  }

  return (
    <PageContainer>
      <Typography variant="h3">{plan.name}</Typography>
      <Typography variant="body">{plan.overview}</Typography>
      <br />
      <br />
      <Typography variant="h4">Exercises</Typography>
      <br />
      {plan.exercise_plans
        .sort((a, b) => a - b)
        .map(({ exercises: e }) => (
          <div key={e.id}>
            <Typography variant="h5">{e.title}</Typography>
            <Typography variant="body">{e.description}</Typography>
            <br />
            <br />
            <ExerciseUnits units={e.units} />
            <br />
            <br />
            {e.images.map((img) => (
              <Box>
                <img
                  key={img}
                  src={img}
                  alt={e.title}
                  style={{
                    maxWidth: 500,
                    maxHeight: 500,
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
            ))}
            {e.videos.map((vid) => (
              <Box>
                <iframe
                  width="360"
                  height="180"
                  src={`https://www.youtube.com/embed/${vid.id}`}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </Box>
            ))}
            <Divider sx={{ mb: 2, mt: 2 }} />
          </div>
        ))}
    </PageContainer>
  );
};
