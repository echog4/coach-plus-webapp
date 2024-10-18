import { Box, Button, Typography } from "@mui/material";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { SPORT_TYPES } from "../../utils/constant";

import { styled } from "@mui/material/styles";
import { CloudUpload } from "@mui/icons-material";
import { getYouTubeVideoId } from "../../utils/validate";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import { upsertExercise } from "../../services/query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Progress } from "../../components/Progress/Progress";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const parseCSV = (csvString, coach_id) => {
  const lines = csvString.split(/\r\n|\n/);
  const headers = parseCSVLine(lines[0]);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() !== "") {
      const values = parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const entry = {};
        headers.forEach((header, index) => {
          entry[header.trim()] = values[index].trim();
        });
        const videos = entry.Videos.split(",");
        const images = entry.Images.split(",");

        const payload = {
          title: entry.Title,
          description: entry.Description,
          sport_types: entry["Sport Types"].split(","),
          units: {
            sets: entry.Sets,
            reps: entry.Reps,
            rest: entry["Rest in seconds"],
            distance: entry["Distance in meters"],
            time: entry["Time in minutes"],
          },
          videos:
            videos[0] !== "" &&
            videos.map((video) => ({
              url: video,
              id: getYouTubeVideoId(video),
            })),
          images: images[0] !== "" && images,
        };
        payload.coach_id = coach_id;
        data.push(payload);
      }
    }
  }

  return data;
};

const parseCSVLine = (line) => {
  const result = [];
  let startIndex = 0;
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    } else if (line[i] === "," && !inQuotes) {
      result.push(
        line
          .slice(startIndex, i)
          .replace(/(^"|"$)/g, "")
          .replace(/""/g, '"')
      );
      startIndex = i + 1;
    }
  }

  result.push(
    line
      .slice(startIndex)
      .replace(/(^"|"$)/g, "")
      .replace(/""/g, '"')
  );
  return result;
};

export const ImportExercisesRoute = () => {
  const supabase = useSupabase();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const contents = e.target.result;
          const data = parseCSV(contents, user.id);
          upsertExercise(supabase, data)
            .then(() => {
              setLoading(false);
              navigate("/training-plan");
            })
            .catch((error) => {
              setLoading(false);
              alert(
                "Error importing the file. Make sure it's a valid csv file."
              );
            });
        } catch (error) {
          setLoading(false);
          alert("Error reading the file. Make sure it's a valid csv file.");
        }
      };
      reader.onerror = (e) => {
        setLoading(false);
        alert("Error reading the file. Make sure it's a valid csv file.");
      };
      reader.readAsText(file);
    } else {
      setLoading(false);
    }
  };

  if (loading) {
    return <Progress />;
  }

  return (
    <PageContainer>
      <Box
        margin="0 auto"
        maxWidth="600px"
        width="calc(100vw - 2rem)"
        boxSizing="border-box"
      >
        <Box marginBottom={2}>
          <Typography variant="h5">Import Exercises</Typography>
        </Box>
        <Box>
          <Typography variant="h6">Getting Started</Typography>
        </Box>
        <Box marginBottom={2}>
          <Typography variant="body1" marginBottom={1}>
            You can import multiple exercises using a csv file. Please start
            with clicking the download template button and then fill in the
            template with your exercises.
          </Typography>
          <Typography variant="body1">
            Inspect the example data inside the template to understand the
            format. Delete the example data and add your own. Do not change the
            column headers.
          </Typography>
        </Box>
        <Box marginBottom={3}>
          <Button
            variant="contained"
            color="primary"
            href="/templates/exercises.csv"
            download
          >
            Download Template
          </Button>
        </Box>
        <Box marginBottom={2}>
          <Typography variant="h6">Populating the Template</Typography>
        </Box>
        <Box marginBottom={2}>
          <Typography variant="body1" marginBottom={1}>
            The template is a csv file with the following columns: Title,
            Description, Sport Types, Sets, Reps, Rest in seconds, Distance in
            meters, Time in minutes, Videos, Images.{" "}
          </Typography>
          <Typography variant="body1" marginBottom={1}>
            For "Sport Types", "Videos" and "Images" fields, you can add
            multiple values as comma separated values.
          </Typography>
          <Typography variant="body1" marginBottom={1}>
            For "Sport Types" field, you can only choose from the following
            values:{" "}
          </Typography>
          <Typography variant="body1" marginBottom={1}>
            <strong>
              {Object.keys(SPORT_TYPES)
                .map((sportType) => sportType)
                .join(", ")}
            </strong>
          </Typography>
        </Box>
        <Box marginBottom={2}>
          <Typography variant="h6">Importing the CSV File</Typography>
        </Box>
        <Box marginBottom={2}>
          <Typography variant="body1">
            After you have filled in the template,{" "}
            <strong>export the file as a csv file</strong>, click the import
            button below and import your exercises.
          </Typography>
        </Box>
        <Box marginBottom={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUpload />}
            component="label"
            role={undefined}
          >
            Import Exercises
            <VisuallyHiddenInput
              type="file"
              onChange={handleFileChange}
              multiple
            />
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
};
