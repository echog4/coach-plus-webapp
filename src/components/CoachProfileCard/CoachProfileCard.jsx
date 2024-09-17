import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import {
  Edit,
  Face,
  LocationOn,
  NotificationImportant,
  Numbers,
  SportsBaseball,
} from "@mui/icons-material";

export const CoachProfileCard = ({ user, athletes }) => (
  <Paper variant="outlined">
    <Box p={3} pb={1}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="subtitle1">Welcome, Coach!</Typography>
        <Button
          color="primary"
          startIcon={<Edit />}
          size="small"
          href="/settings"
        >
          Edit Info
        </Button>
      </Box>
      <Box display={"flex"} alignItems={"center"} mb={3}>
        <Avatar src={user?.sessionUser?.user_metadata?.avatar_url} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          {user.full_name}
        </Typography>
      </Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        mb={3}
        flexWrap="wrap"
        sx={{
          "& > *": {
            m: 0.5,
          },
        }}
      >
        <Chip icon={<LocationOn />} label={`${user?.city}, ${user?.country}`} />
        <Chip icon={<SportsBaseball />} label={user?.sports_activities} />
        <Chip icon={<Face />} label={user?.athlete_types} />
        <Chip icon={<Numbers />} label={athletes && athletes.length} />
      </Box>
    </Box>
  </Paper>
);
