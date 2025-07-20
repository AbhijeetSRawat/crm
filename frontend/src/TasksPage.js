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
  Checkbox,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import { motion } from "framer-motion";

const types = ["Call", "Meeting", "WhatsApp", "Email", "SMS"];
const statuses = ["Pending", "Done"];
const agents = ["Abhishek", "Narayan", "Prince"];
const mockTasks = [
  { id: 1, lead: "Acme Corp", agent: "Abhishek", type: "Call", due: "2024-07-12T10:00", status: "Pending" },
  { id: 2, lead: "Beta Ltd", agent: "Narayan", type: "Meeting", due: "2024-07-13T14:30", status: "Pending" },
  { id: 3, lead: "Gamma Inc", agent: "Prince", type: "WhatsApp", due: "2024-07-11T16:00", status: "Done" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({ open: false, mode: "add", task: null });

  const filtered = tasks.filter(
    (t) =>
      t.lead.toLowerCase().includes(search.toLowerCase()) ||
      t.agent.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = (mode, task = null) => setDialog({ open: true, mode, task });
  const handleClose = () => setDialog({ open: false, mode: "add", task: null });

  const handleSave = () => {
    const { task, mode } = dialog;
    if (!task.lead || !task.agent || !task.type || !task.due) return;
    if (mode === "add") {
      setTasks([...tasks, { ...task, id: Date.now(), status: "Pending" }]);
    } else {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    }
    handleClose();
  };

  const handleDelete = (id) => setTasks(tasks.filter((t) => t.id !== id));
  const handleDone = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, status: t.status === "Done" ? "Pending" : "Done" } : t)));

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
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" fontWeight={800} color="primary.main" mb={2}>
            Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen("add", { lead: "", agent: agents[0], type: types[0], due: "", status: "Pending" })}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
          >
            Add Task
          </Button>
        </Box>
        <Box mb={2}>
          <TextField
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ width: 300 }}
          />
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
                <TableCell>Agent</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((task) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>{task.lead}</TableCell>
                  <TableCell>{task.agent}</TableCell>
                  <TableCell>{task.type}</TableCell>
                  <TableCell>{task.due.replace("T", " ")}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={task.status === "Done" ? "success" : "primary"}
                      sx={{ mr: 1 }}
                    />
                    <Checkbox
                      checked={task.status === "Done"}
                      onChange={() => handleDone(task.id)}
                      color="success"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen("edit", { ...task })}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(task.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </motion.div>
      {/* Add/Edit Task Dialog */}
      <Dialog open={dialog.open} onClose={handleClose} maxWidth="xs" fullWidth>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
          <DialogTitle>{dialog.mode === "add" ? "Add Task" : "Edit Task"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Lead"
              fullWidth
              margin="dense"
              value={dialog.task?.lead || ""}
              onChange={(e) => setDialog((d) => ({ ...d, task: { ...d.task, lead: e.target.value } }))}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Agent"
              fullWidth
              margin="dense"
              value={dialog.task?.agent || agents[0]}
              onChange={(e) => setDialog((d) => ({ ...d, task: { ...d.task, agent: e.target.value } }))}
              sx={{ mb: 2 }}
            >
              {agents.map((agent) => (
                <MenuItem key={agent} value={agent}>{agent}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Type"
              fullWidth
              margin="dense"
              value={dialog.task?.type || types[0]}
              onChange={(e) => setDialog((d) => ({ ...d, task: { ...d.task, type: e.target.value } }))}
              sx={{ mb: 2 }}
            >
              {types.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Due Date/Time"
              type="datetime-local"
              fullWidth
              margin="dense"
              value={dialog.task?.due || ""}
              onChange={(e) => setDialog((d) => ({ ...d, task: { ...d.task, due: e.target.value } }))}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
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