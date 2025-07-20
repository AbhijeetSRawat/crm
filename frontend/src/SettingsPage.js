import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";

const mockProfile = {
  name: "Alice Admin",
  email: "alice@crm.com",
  role: "Admin",
};

export default function SettingsPage() {
  const [profile] = useState(mockProfile);
  const [theme, setTheme] = useState(true); // true = dark
  const [password, setPassword] = useState({ old: "", new: "", confirm: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setPassword({ ...password, [e.target.name]: e.target.value });
  const handleTheme = () => setTheme((t) => !t);
  const handleSave = () => {
    if (password.new && password.new !== password.confirm) {
      setMsg("New passwords do not match.");
      return;
    }
    setMsg("Settings saved (UI only).");
  };

  return (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Paper elevation={6} sx={{
        mb: 4,
        p: 3,
        borderRadius: 6,
        background: 'rgba(24, 24, 32, 0.7)',
        boxShadow: '0 8px 32px 0 #00e6ff33',
        backdropFilter: 'blur(12px)',
      }}>
        <Typography variant="h4" fontWeight={800} color="primary.main" mb={2}>
          Settings
        </Typography>
        <Typography variant="subtitle1" color="#fff" mb={1}>Profile Info</Typography>
        <TextField label="Name" value={profile.name} fullWidth margin="dense" disabled sx={{ mb: 1 }} />
        <TextField label="Email" value={profile.email} fullWidth margin="dense" disabled sx={{ mb: 1 }} />
        <TextField label="Role" value={profile.role} fullWidth margin="dense" disabled sx={{ mb: 2 }} />
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" color="#fff" mb={1}>Change Password</Typography>
        <TextField
          label="Old Password"
          name="old"
          type="password"
          value={password.old}
          onChange={handleChange}
          fullWidth
          margin="dense"
          sx={{ mb: 1 }}
        />
        <TextField
          label="New Password"
          name="new"
          type="password"
          value={password.new}
          onChange={handleChange}
          fullWidth
          margin="dense"
          sx={{ mb: 1 }}
        />
        <TextField
          label="Confirm New Password"
          name="confirm"
          type="password"
          value={password.confirm}
          onChange={handleChange}
          fullWidth
          margin="dense"
          sx={{ mb: 2 }}
        />
        <Divider sx={{ my: 2 }} />
        <FormControlLabel
          control={<Switch checked={theme} onChange={handleTheme} color="primary" />}
          label="Dark Theme (UI only)"
          sx={{ mb: 2 }}
        />
        {msg && (
          <Typography color="success.main" sx={{ mb: 1 }}>{msg}</Typography>
        )}
        <Box display="flex" gap={2} mt={2}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="inherit" onClick={() => setPassword({ old: "", new: "", confirm: "" })}>
            Cancel
          </Button>
        </Box>
      </Paper>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Paper elevation={4} sx={{
          borderRadius: 4,
          background: 'rgba(24, 24, 32, 0.7)',
          boxShadow: '0 4px 24px 0 #00e6ff22',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #00e6ff33',
          p: 2,
        }}>
          {/* ...existing settings form code... */}
        </Paper>
      </motion.div>
      {/* ...existing dialogs, apply Paper and motion where appropriate... */}
    </Box>
  );
} 