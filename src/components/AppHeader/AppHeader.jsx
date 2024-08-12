import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Menu as MenuIcon, SportsGymnastics } from "@mui/icons-material";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useAuth } from "../../providers/AuthContextProvider";

const UserMenu = ({ user, signOut, anchorEl, handleOpen, handleClose }) => (
  <div>
    <IconButton
      size="large"
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={handleOpen}
      color="inherit"
    >
      <Avatar
        alt={user.user_metadata.full_name}
        src={user.user_metadata.picture}
        sx={{ width: 32, height: 32 }}
      />
    </IconButton>
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={signOut}>Sign out</MenuItem>
    </Menu>
  </div>
);

export const AppHeader = ({ handleDrawerToggle }) => {
  const { session, user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <SportsGymnastics />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Hey Coach
        </Typography>
        {session && (
          <UserMenu
            user={user}
            signOut={signOut}
            anchorEl={anchorEl}
            handleOpen={handleOpen}
            handleClose={handleClose}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};
