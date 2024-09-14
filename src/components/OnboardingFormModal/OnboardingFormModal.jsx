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
import { useEffect, useState } from "react";
import { sportsEmojis } from "../../routes/OnboardingForms/constants";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import { upsertOnboardingForm } from "../../services/query";

export default function OnboardingFormModal({
  open,
  handleClose,
  onSuccess,
  formData,
}) {
  const [loading, setLoading] = useState(false);
  const [newFields, setNewFields] = useState([]);
  const [formName, setFormName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [emoji, setEmoji] = useState(sportsEmojis[0]);

  useEffect(() => {
    setNewFields(formData.custom_questions || []);
    setFormName(formData.title || "");
    setWelcomeMessage(formData.welcome_message || "");
    setEmoji(formData.icon || sportsEmojis[0]);
  }, [formData]);

  const { user } = useAuth();
  const supabase = useSupabase();

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
    <Dialog open={open} onClose={handleClose} fullWidth keepMounted={false}>
      <DialogTitle>
        {!formData.title
          ? "Create a new onboarding form"
          : `Edit "${formData.title}"`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Every form includes Age, Height, Weight, Telephone number, Email, City
          and Country fields. You can add more questions below.
        </DialogContentText>
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Form Name"
            placeholder="Give Your Form a Name"
            fullWidth
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Welcome Message"
            placeholder="Type in a welcome message for your athletes"
            fullWidth
            value={welcomeMessage}
            multiline
            minRows={3}
            onChange={(e) => setWelcomeMessage(e.target.value)}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, mr: 2, flexGrow: 1 }}>
            Pick an emoji: <span style={{ fontSize: 20 }}>{emoji}</span>
          </Typography>
          <Box flexGrow={0}>
            {sportsEmojis.map((sport, index) => (
              <Button
                key={index}
                sx={{
                  width: 40,
                  minWidth: 40,
                  height: 40,
                  fontSize: 20,
                  p: 0,
                }}
                variant={emoji === sport ? "outlined" : "text"}
                onClick={() => setEmoji(sport)}
              >
                {sport}
              </Button>
            ))}
          </Box>
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
        <Button
          disabled={loading}
          onClick={async () => {
            setLoading(true);

            const id = formData.id ? { id: formData.id } : {};
            const payload = {
              ...id,
              user_id: user.id,
              custom_questions: newFields,
              title: formName,
              welcome_message: welcomeMessage,
              icon: emoji,
            };

            const { data } = await upsertOnboardingForm(supabase, payload);
            setLoading(false);
            onSuccess(data[0]);
          }}
        >
          {!formData.title ? "Create" : "Update"}
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
