import Popover from "@mui/material/Popover";
import {
  Badge,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { Notifications } from "@mui/icons-material";

export const NotificationArea = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-area" : undefined;

  return (
    <>
      <IconButton
        size="large"
        aria-describedby={id}
        onClick={handleClick}
        sx={{ mr: 1 }}
      >
        <Badge badgeContent={4} color="error">
          <Notifications style={{ color: "#fff" }} />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItemButton alignItems="flex-start">
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
        </List>
      </Popover>
    </>
  );
};
