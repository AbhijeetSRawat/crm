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
  Switch,
  InputAdornment,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import { motion } from "framer-motion";

const roles = ["Admin", "Manager", "Sales Agent"];
const mockUsers = [
  { id: 1, name: "Alice Admin", email: "alice@crm.com", role: "Admin", active: true, lastLogin: "2024-07-10" },
  { id: 2, name: "Bob Manager", email: "bob@crm.com", role: "Manager", active: true, lastLogin: "2024-07-09" },
  { id: 3, name: "Charlie Agent", email: "charlie@crm.com", role: "Sales Agent", active: false, lastLogin: "2024-07-08" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({ open: false, mode: "add", user: null });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = (mode, user = null) => setDialog({ open: true, mode, user });
  const handleClose = () => setDialog({ open: false, mode: "add", user: null });

  const handleSave = () => {
    const { user, mode } = dialog;
    if (!user.name || !user.email || !user.role) return;
    if (mode === "add") {
      setUsers([...users, { ...user, id: Date.now(), lastLogin: "-", active: true }]);
    } else {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    }
    handleClose();
  };

  const handleDelete = (id) => setUsers(users.filter((u) => u.id !== id));
  const handleStatus = (id) => setUsers(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));

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
          Users
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen("add", { name: "", email: "", role: "Sales Agent", active: true })}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
          >
            Add User
          </Button>
        </Box>
        <Box mb={2}>
          <TextField
            placeholder="Search users..."
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
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.active}
                      onChange={() => handleStatus(user.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen("edit", { ...user })}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </motion.div>
      {/* Add/Edit User Dialog */}
      <Dialog open={dialog.open} onClose={handleClose} maxWidth="xs" fullWidth>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
          <DialogTitle>{dialog.mode === "add" ? "Add User" : "Edit User"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="dense"
              value={dialog.user?.name || ""}
              onChange={(e) => setDialog((d) => ({ ...d, user: { ...d.user, name: e.target.value } }))}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              value={dialog.user?.email || ""}
              onChange={(e) => setDialog((d) => ({ ...d, user: { ...d.user, email: e.target.value } }))}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Role"
              fullWidth
              margin="dense"
              value={dialog.user?.role || roles[2]}
              onChange={(e) => setDialog((d) => ({ ...d, user: { ...d.user, role: e.target.value } }))}
              sx={{ mb: 2 }}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <Box display="flex" alignItems="center" mt={1}>
              <Typography>Status:</Typography>
              <Switch
                checked={dialog.user?.active ?? true}
                onChange={() => setDialog((d) => ({ ...d, user: { ...d.user, active: !d.user.active } }))}
                color="primary"
                sx={{ ml: 1 }}
              />
            </Box>
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