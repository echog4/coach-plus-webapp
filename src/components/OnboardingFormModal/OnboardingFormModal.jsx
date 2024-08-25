import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";

export default function OnboardingFormModal({
  open,
  handleClose,
  formData = {},
}) {
  const [newFields, setNewFields] = useState(formData.fields || []);
  const [formName, setFormName] = useState(formData.name || "");
  const [emoji, setEmoji] = useState(formData.emoji || "");

  const addField = () => {
    setNewFields([...newFields, { name: "", type: "text" }]);
  };

  const removeField = (index) => {
    setNewFields(newFields.filter((_, i) => i !== index));
  };

  const setFieldName = (index, name) => {
    setNewFields(
      newFields.map((field, i) => (i === index ? { ...field, name } : field))
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      keepMounted={false}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
    >
      <DialogTitle>
        {!formData.fields
          ? "Create a new onboarding form"
          : `Edit "${formData.name}"`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Every form includes Age, Height, Weight, Telephone number, Email, City
          and Country fields. You can add more questions below.
        </DialogContentText>
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Give Your Form a Name"
            fullWidth
            variant="standard"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </Box>
        <Box display="flex" flexWrap="wrap" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, mr: 2 }}>
            Pick an emoji: <span style={{ fontSize: 28 }}>{emoji.emoji}</span>
          </Typography>
          <EmojiPicker
            onEmojiClick={setEmoji}
            height={350}
            previewConfig={{ showPreview: false }}
          />
        </Box>
        {newFields.length > 0 && (
          <Typography variant="subtitle2" sx={{ mb: 0 }}>
            Custom Fields
          </Typography>
        )}
        {newFields.map((field, index) => (
          <Box display="flex" sx={{ mb: 3 }} key={index}>
            <TextField
              placeholder="Type your question here"
              fullWidth
              variant="standard"
              value={field.name}
              onChange={(e) => setFieldName(index, e.target.value)}
            />
            <IconButton onClick={() => removeField(index)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={addField} sx={{ mr: "auto" }}>
          Add new Question
        </Button>
        <Button onClick={() => console.log(newFields)}>
          {!formData.fields ? "Create" : "Update"}
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
