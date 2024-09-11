import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Avatar, Box, List, ListItemButton, Typography } from "@mui/material";

export default function ResponsesModal({ open, handleClose, formData }) {
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
            {formData.icon}
          </Avatar>
          <Typography variant="subtitle2">{formData.title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {formData.onboarding_form_response?.length > 0 ? (
          <DialogContentText>
            This form has been sent to{" "}
            <strong>formData.onboarding_form_response?.length</strong> people
            and{" "}
            <strong>
              {
                formData.onboarding_form_response.filter(
                  (r) => r.status === "completed"
                ).length
              }
            </strong>{" "}
            have responded.
          </DialogContentText>
        ) : (
          <DialogContentText>No responses yet</DialogContentText>
        )}
        <List sx={{ width: "100%" }}>
          {formData.onboarding_form_response?.map((r) => (
            <ListItemButton>
              <pre>
                <code>{JSON.stringify(r, null, 2)}</code>
              </pre>
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
