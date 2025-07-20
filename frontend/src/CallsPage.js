import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import { Add, Edit, Search } from "@mui/icons-material";
import { motion } from "framer-motion";

const outcomes = ["Interested", "Callback", "Not Interested"];
const mockCalls = [
  {
    id: 1, lead: "Acme Corp", agent: "Abhishek", mobile: "+91 98765 43210", datetime: "2024-07-10 10:30", outcome: "Interested", notes: "Wants demo next week.", feedback: [
      { id: 1, agent: "Abhishek", message: "Initial call, interested.", timestamp: "2024-07-10 10:30" },
      { id: 2, agent: "Abhishek", message: "Requested demo.", timestamp: "2024-07-10 11:00" }
    ]
  },
  {
    id: 2, lead: "Beta Ltd", agent: "Narayan", mobile: "+91 87654 32109", datetime: "2024-07-09 15:00", outcome: "Callback", notes: "Asked to call after 2 days.", feedback: [
      { id: 3, agent: "Narayan", message: "Callback scheduled.", timestamp: "2024-07-09 15:00" }
    ]
  },
  { id: 3, lead: "Gamma Inc", agent: "Prince", mobile: "+91 76543 21098", datetime: "2024-07-08 11:45", outcome: "Not Interested", notes: "Not looking for CRM now.", feedback: [] },
];

export default function CallsPage() {
  const [calls, setCalls] = useState(mockCalls);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({ open: false, mode: "add", call: null });
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, call: null });

  const filtered = calls.filter(
    (c) =>
      c.lead.toLowerCase().includes(search.toLowerCase()) ||
      c.agent.toLowerCase().includes(search.toLowerCase()) ||
      c.outcome.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = (mode, call = null) => setDialog({ open: true, mode, call });
  const handleClose = () => setDialog({ open: false, mode: "add", call: null });

  const handleSave = () => {
    const { call, mode } = dialog;
    if (!call.lead || !call.agent || !call.datetime || !call.outcome) return;
    if (mode === "add") {
      setCalls([...calls, { ...call, id: Date.now() }]);
    } else {
      setCalls(calls.map((c) => (c.id === call.id ? call : c)));
    }
    handleClose();
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
          Calls
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <TextField
            placeholder="Search calls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen("add", { lead: "", agent: "", datetime: "", outcome: outcomes[0], notes: "" })}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
          >
            Add Call
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lead</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Date/Time</TableCell>
                <TableCell>Outcome</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((call) => (
                <motion.tr
                  key={call.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>{call.lead}</TableCell>
                  <TableCell>{call.mobile}</TableCell>
                  <TableCell>{call.agent}</TableCell>
                  <TableCell>{call.datetime}</TableCell>
                  <TableCell>
                    <Chip label={call.outcome} color={
                      call.outcome === "Interested" ? "success" :
                        call.outcome === "Callback" ? "primary" : "error"
                    } />
                  </TableCell>
                  <TableCell>{call.notes}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={`${call.feedback?.length || 0} updates`}
                        size="small"
                        color="info"
                      />
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => setFeedbackDialog({ open: true, call })}
                      >
                        <span role="img" aria-label="feedback">💬</span>
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen("edit", { ...call })}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </motion.div>
      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog.open} onClose={() => setFeedbackDialog({ open: false, call: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          Feedback & Updates - {feedbackDialog.call?.lead}
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle2" color="primary" mb={1}>
              Feedback History
            </Typography>
          </Box>
          <Box>
            {feedbackDialog.call?.feedback?.length ? (
              <ul style={{ paddingLeft: 0 }}>
                {feedbackDialog.call.feedback.map((fb) => (
                  <li key={fb.id} style={{ marginBottom: 12, listStyle: 'none' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip label={fb.agent} size="small" color="primary" />
                      <Typography variant="caption" color="textSecondary">
                        {fb.timestamp}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {fb.message}
                    </Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body2" color="textSecondary">No feedback yet.</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog({ open: false, call: null })}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Add/Edit Call Dialog */}
      <Dialog open={dialog.open} onClose={handleClose} maxWidth="xs" fullWidth>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
          <DialogTitle>{dialog.mode === "add" ? "Add Call" : "Edit Call"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Lead"
              fullWidth
              margin="dense"
              value={dialog.call?.lead || ""}
              onChange={(e) => setDialog((d) => ({ ...d, call: { ...d.call, lead: e.target.value } }))}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mobile"
              fullWidth
              margin="dense"
              value={dialog.call?.mobile || ""}
              onChange={(e) => setDialog((d) => ({ ...d, call: { ...d.call, mobile: e.target.value } }))}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Agent"
              fullWidth
              margin="dense"
              value={dialog.call?.agent || ""}
              onChange={(e) => setDialog((d) => ({ ...d, call: { ...d.call, agent: e.target.value } }))}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Date/Time"
              type="datetime-local"
              fullWidth
              margin="dense"
              value={dialog.call?.datetime || ""}
              onChange={(e) => setDialog((d) => ({ ...d, call: { ...d.call, datetime: e.target.value } }))}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Outcome"
              fullWidth
              margin="dense"
              value={dialog.call?.outcome || outcomes[0]}
              onChange={(e) => setDialog((d) => ({ ...d, call: { ...d.call, outcome: e.target.value } }))}
              sx={{ mb: 2 }}
            >
              {outcomes.map((outcome) => (
                <MenuItem key={outcome} value={outcome}>{outcome}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Notes"
              fullWidth
              margin="dense"
              multiline
              minRows={2}
              value={dialog.call?.notes || ""}
              onChange={(e) => setDialog((d) => ({ ...d, call: { ...d.call, notes: e.target.value } }))}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              {dialog.mode === "add" ? "Add" : "Save"}
            </Button>
          </DialogActions>
        </motion.div>
      </Dialog>
    </Box>
  );
} 