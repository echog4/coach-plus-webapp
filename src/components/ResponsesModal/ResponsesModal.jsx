import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Avatar,
  Box,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

export default function ResponsesModal({ open, handleClose }) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              backgroundColor: "green.light",
              fontSize: 24,
              mr: 2,
            }}
          >
            👵🏻
          </Avatar>
          <Typography variant="subtitle2">Old people training</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This form has been sent to <strong>5</strong> people and{" "}
          <strong>2</strong> have responded.
        </DialogContentText>
        <List sx={{ width: "100%" }}>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src="https://mui.com/static/images/avatar/1.jpg"
              />
            </ListItemAvatar>
            <ListItemText primary="Remy Sharp" secondary="Completed" />
          </ListItemButton>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src="https://mui.com/static/images/avatar/1.jpg"
              />
            </ListItemAvatar>
            <ListItemText primary="Remy Sharp" secondary="Completed" />
          </ListItemButton>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src="https://mui.com/static/images/avatar/1.jpg"
              />
            </ListItemAvatar>
            <ListItemText primary="Remy Sharp" secondary="In Progress" />
          </ListItemButton>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src="https://mui.com/static/images/avatar/1.jpg"
              />
            </ListItemAvatar>
            <ListItemText primary="Remy Sharp" secondary="In Progress" />
          </ListItemButton>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src="https://mui.com/static/images/avatar/1.jpg"
              />
            </ListItemAvatar>
            <ListItemText primary="Remy Sharp" secondary="In Progress" />
          </ListItemButton>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
