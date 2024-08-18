import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Insights } from "@mui/icons-material";

export const Activity = ({ pic, name, info }) => {
  return (
    <Paper sx={{ overflow: "hidden", maxHeight: 520 }} variant="outlined">
      <Box p={2} display="flex" alignItems="center" height="80px">
        <Insights style={{ marginRight: 12 }} />
        <Typography variant="h6" fontWeight="900">
          Activity
        </Typography>
      </Box>
      <Box sx={{ maxHeight: 440, overflow: "auto" }}>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItemButton alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <span style={{ fontWeight: "bold" }}>Ali Connors</span>{" "}
                  <span>checked in for her training</span>
                </>
              }
              secondary="2 days ago"
            />
          </ListItemButton>
          <Divider variant="inset" component="li" />
          <ListItemButton alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <span style={{ fontWeight: "bold" }}>Travis Howard</span>{" "}
                  <span>
                    sent you a feedback. Click here to see the feedback
                  </span>
                </>
              }
              secondary="2 days ago"
            />
          </ListItemButton>
        </List>
      </Box>
    </Paper>
  );
};
