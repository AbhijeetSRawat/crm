import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import {
  PlayArrow,
  Assignment,
  Phone,
  Person,
  Visibility,
  Edit,
  Delete,
  Add,
  Flag,
  Business,
  Email,
  PhoneAndroid,
  LocationOn,
  Work,
  AttachMoney,
  TrendingUp as TrendingUpIcon,
  Lock,
} from "@mui/icons-material";
import { motion } from 'framer-motion';
import { agentsAPI } from './services/api';


const mockCallRecordings = [
  { id: 1, agent: "Abhishek", lead: "Acme Corp", duration: "4m 32s", date: "2024-07-11", outcome: "Interested" },
  { id: 2, agent: "Narayan", lead: "Beta Ltd", duration: "5m 18s", date: "2024-07-11", outcome: "Converted" },
  { id: 3, agent: "Prince", lead: "Gamma Inc", duration: "3m 45s", date: "2024-07-11", outcome: "Not Interested" },
];

export default function AgentManagementPage() {
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [bulkDialog, setBulkDialog] = useState({ open: false, type: "", agentId: "", file: null });
  const [recordingsDialog, setRecordingsDialog] = useState(false);
  const [targetDialog, setTargetDialog] = useState({ open: false, agent: null, isBulk: false });
  const [addAgentDialog, setAddAgentDialog] = useState(false);
  const [selectedAgentFilter, setSelectedAgentFilter] = useState("all");
  const [agents, setAgents] = useState([]);
  const [viewAgentDialog, setViewAgentDialog] = useState({ open: false, agent: null });
  const [editAgentDialog, setEditAgentDialog] = useState({ open: false, agent: null });
  const [deleteAgentDialog, setDeleteAgentDialog] = useState({ open: false, agent: null });
  const [editAgentData, setEditAgentData] = useState(null);

  useEffect(() => {
    agentsAPI.getAll().then(res => {
      if (res.success) setAgents(res.data);
    });
  }, []);

  const filtered = selectedAgentFilter === "all" ? agents : agents.filter(agent => agent.id === parseInt(selectedAgentFilter));

  // Calculate filtered metrics based on selected agent
  const getFilteredMetrics = () => {
    if (selectedAgentFilter === "all") {
      if (agents.length === 0) {
        return {
          totalSales: 0,
          totalConversions: 0,
          avgDealSize: 0,
          targetAchievement: 0
        };
      }
      return {
        totalSales: agents.reduce((sum, agent) => sum + (agent.totalSales || 0), 0),
        totalConversions: agents.reduce((sum, agent) => sum + (agent.conversions || 0), 0),
        avgDealSize: Math.round(
          agents.reduce((sum, agent) => sum + (agent.totalSales || 0), 0) /
          Math.max(1, agents.reduce((sum, agent) => sum + (agent.salesCount || 0), 0))
        ),
        targetAchievement: Math.round(
          agents.reduce((sum, agent) => sum + (agent.targetAchievement || 0), 0) / agents.length
        )
      };
    } else {
      const agent = agents.find(a => a.id === parseInt(selectedAgentFilter));
      if (!agent) {
        return {
          totalSales: 0,
          totalConversions: 0,
          avgDealSize: 0,
          targetAchievement: 0
        };
      }
      return {
        totalSales: agent.totalSales || 0,
        totalConversions: agent.conversions || 0,
        avgDealSize: agent.avgDealSize || 0,
        targetAchievement: agent.targetAchievement || 0
      };
    }
  };

  const metrics = getFilteredMetrics();

  const handleBulkOperation = (type) => {
    if (selectedAgents.length === 0) {
      alert("Please select agents first");
      return;
    }
    setBulkDialog({ open: true, type });
  };

  const handleTargetAssignment = (agent = null) => {
    if (agent) {
      // Individual target assignment
      setTargetDialog({ open: true, agent, isBulk: false });
    } else {
      // Bulk target assignment
      if (selectedAgents.length === 0) {
        alert("Please select agents first");
        return;
      }
      setTargetDialog({ open: true, agent: null, isBulk: true });
    }
  };

  const handleTargetSave = (targetData) => {
    if (targetDialog.isBulk) {
      // Update multiple agents
      alert(`Target assigned to ${selectedAgents.length} agents: &#8377;${targetData.target.toLocaleString()}`);
    } else {
      // Update single agent
      alert(`Target assigned to ${targetDialog.agent.name}: &#8377;${targetData.target.toLocaleString()}`);
    }
    setTargetDialog({ open: false, agent: null, isBulk: false });
  };

  const handleAddAgent = async (agentData) => {
    try {
      const res = await agentsAPI.create(agentData);
      if (res.success) {
        agentsAPI.getAll().then(res2 => {
          if (res2.success) setAgents(res2.data);
        });
        setAddAgentDialog(false);
      } else {
        alert(res.error || 'Failed to add agent');
      }
    } catch (err) {
      alert(err.message || 'Failed to add agent');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Online": return "success";
      case "On Call": return "warning";
      case "Offline": return "error";
      default: return "default";
    }
  };

  // View handler
  const handleViewAgent = (agent) => setViewAgentDialog({ open: true, agent });
  // Edit handler
  const handleEditAgent = (agent) => {
    setEditAgentData({ ...agent });
    setEditAgentDialog({ open: true, agent });
  };
  // Save edit
  const handleSaveEditAgent = async () => {
    try {
      await agentsAPI.update(editAgentData.id, editAgentData);
      agentsAPI.getAll().then(res => {
        if (res.success) setAgents(res.data);
      });
      setEditAgentDialog({ open: false, agent: null });
    } catch (err) {
      alert('Failed to update agent');
    }
  };
  // Delete handler
  const handleDeleteAgent = async () => {
    try {
      await agentsAPI.delete(deleteAgentDialog.agent.id);
      agentsAPI.getAll().then(res => {
        if (res.success) setAgents(res.data);
      });
      setDeleteAgentDialog({ open: false, agent: null });
    } catch (err) {
      alert('Failed to delete agent');
    }
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
          Agent Management
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Agent</InputLabel>
            <Select
              value={selectedAgentFilter}
              label="Filter by Agent"
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
            >
              <MenuItem value="all">View All Agents</MenuItem>
              {agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id?.toString()}>
                  {agent.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddAgentDialog(true)}
            sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
          >
            Add New Agent
          </Button>
          <Button
            variant="contained"
            startIcon={<Assignment />}
            onClick={() => handleBulkOperation("leads")}
            disabled={selectedAgents.length === 0}
          >
            Bulk Lead Assign
          </Button>
          <Button
            variant="contained"
            startIcon={<Phone />}
            onClick={() => handleBulkOperation("numbers")}
            disabled={selectedAgents.length === 0}
          >
            Bulk Number Assign
          </Button>
          <Button
            variant="contained"
            startIcon={<Flag />}
            onClick={() => handleTargetAssignment()}
            disabled={selectedAgents.length === 0}
            sx={{ backgroundColor: "#ff9800", "&:hover": { backgroundColor: "#f57c00" } }}
          >
            Assign Targets
          </Button>
          <Button
            variant="outlined"
            startIcon={<PlayArrow />}
            onClick={() => setRecordingsDialog(true)}
          >
            Call Recordings
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
          {/* Agent Performance Overview */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: "#181818", color: "#fff" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {selectedAgentFilter === "all" ? "Total Sales" : "Agent Sales"}
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="success.main">
                    &#8377;{(metrics.totalSales || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {selectedAgentFilter === "all" ? "+15% vs last month" : "This month"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: "#181818", color: "#fff" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {selectedAgentFilter === "all" ? "Total Conversions" : "Agent Conversions"}
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="primary.main">
                    {metrics.totalConversions}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {selectedAgentFilter === "all" ? "This month" : "This month"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: "#181818", color: "#fff" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {selectedAgentFilter === "all" ? "Avg Deal Size" : "Agent Deal Size"}
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="warning.main">
                    &#8377;{(metrics.avgDealSize || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {selectedAgentFilter === "all" ? "+8% vs last month" : "Average per deal"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: "#181818", color: "#fff" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {selectedAgentFilter === "all" ? "Target Achievement" : "Agent Target"}
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="info.main">
                    {(metrics.targetAchievement || 0)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.targetAchievement || 0}
                    sx={{ mt: 1, backgroundColor: "#333", "& .MuiLinearProgress-bar": { backgroundColor: "#00e6ff" } }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Agent List */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectedAgents.length === agents.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAgents(agents.map(a => a.id));
                        } else {
                          setSelectedAgents([]);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>Calls Today</TableCell>
                  <TableCell>Leads Assigned</TableCell>
                  <TableCell>Conversions</TableCell>
                  <TableCell>Total Sales</TableCell>
                  <TableCell>Target Achievement</TableCell>
                  <TableCell>Avg Call Duration</TableCell>
                  <TableCell>Last Activity</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((agent) => (
                  <TableRow
                    key={agent.id}
                    sx={{
                      backgroundColor: selectedAgentFilter === agent.id?.toString() ? "#00e6ff22" : "transparent",
                      border: selectedAgentFilter === agent.id?.toString() ? "2px solid #00e6ff" : "none"
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedAgents.includes(agent.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAgents([...selectedAgents, agent.id]);
                          } else {
                            setSelectedAgents(selectedAgents.filter(id => id !== agent.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, bgcolor: "#00e6ff" }}>{agent.avatar}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{agent.name}</Typography>
                          <Typography variant="caption" color="textSecondary">{agent.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={agent.status} color={getStatusColor(agent.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" mr={1}>{agent.performance}%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={agent.performance}
                          sx={{ width: 60, backgroundColor: "#333", "& .MuiLinearProgress-bar": { backgroundColor: "#00e6ff" } }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{agent.callsToday}</TableCell>
                    <TableCell>{agent.leadsAssigned}</TableCell>
                    <TableCell>{agent.conversions}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        &#8377;{(agent.totalSales || 0).toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {(agent.salesCount || 0)} deals
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" mr={1}>{(agent.targetAchievement || 0)}%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={agent.targetAchievement || 0}
                          sx={{ width: 60, backgroundColor: "#333", "& .MuiLinearProgress-bar": { backgroundColor: agent.targetAchievement >= 100 ? "#4caf50" : "#ff9800" } }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{agent.avgCallDuration}</TableCell>
                    <TableCell>{agent.lastActivity}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="warning"
                        size="small"
                        onClick={() => handleTargetAssignment(agent)}
                        title="Assign Target"
                      >
                        <Flag />
                      </IconButton>
                      <IconButton color="primary" size="small" onClick={() => handleViewAgent(agent)}>
                        <Visibility />
                      </IconButton>
                      <IconButton color="primary" size="small" onClick={() => handleEditAgent(agent)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => setDeleteAgentDialog({ open: true, agent })}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>

      {/* Bulk Operations Dialog */}
      <Dialog open={bulkDialog.open} onClose={() => setBulkDialog({ open: false, type: "", agentId: "", file: null })} maxWidth="sm" fullWidth>
        <DialogTitle>
          Bulk {bulkDialog.type === "leads" ? "Lead" : "Number"} Assignment
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Upload an Excel (.xlsx) file with columns: <b>Mobile Number, Business Name, Location</b>.<br />
            All entries will be assigned to the selected agent.
          </Typography>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Select Agent</InputLabel>
            <Select
              value={bulkDialog.agentId || ''}
              label="Select Agent"
              onChange={e => setBulkDialog({ ...bulkDialog, agentId: e.target.value })}
            >
              <MenuItem value="">Select Agent</MenuItem>
              {agents.map(agent => (
                <MenuItem key={agent.id} value={agent.id}>{agent.name} ({agent.email})</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            component="label"
            sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, mb: 2 }}
            fullWidth
          >
            Upload Excel (.xlsx)
            <input
              type="file"
              accept=".xlsx"
              hidden
              onChange={e => setBulkDialog({ ...bulkDialog, file: e.target.files[0] })}
            />
          </Button>
          {bulkDialog.file && (
            <Typography variant="body2" color="success.main" mb={1}>
              Selected file: {bulkDialog.file.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDialog({ open: false, type: "", agentId: "", file: null })}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!bulkDialog.agentId || !bulkDialog.file}
            onClick={async () => {
              if (!bulkDialog.agentId || !bulkDialog.file) return;
              const formData = new FormData();
              formData.append('file', bulkDialog.file);
              formData.append('agentId', bulkDialog.agentId);
              try {
                const res = await fetch(`/api/${bulkDialog.type === 'leads' ? 'leads' : 'numbers'}/bulk`, {
                  method: 'POST',
                  body: formData,
                });
                const data = await res.json();
                if (data.success) {
                  alert(`Bulk ${bulkDialog.type} assignment completed!`);
                  setBulkDialog({ open: false, type: "", agentId: "", file: null });
                } else {
                  alert(data.error || 'Bulk assignment failed.');
                }
              } catch (err) {
                alert(err.message || 'Bulk assignment failed.');
              }
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Call Recordings Dialog */}
      <Dialog open={recordingsDialog} onClose={() => setRecordingsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Call Recordings</DialogTitle>
        <DialogContent>
          <List>
            {mockCallRecordings.map((recording) => (
              <ListItem key={recording.id}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#00e6ff" }}>
                    <PlayArrow />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${recording.agent} - ${recording.lead}`}
                  secondary={`${recording.duration} • ${recording.date} • ${recording.outcome}`}
                />
                <IconButton color="primary">
                  <PlayArrow />
                </IconButton>
                <IconButton color="primary">
                  <PlayArrow />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecordingsDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<PlayArrow />}>
            Download All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Target Assignment Dialog */}
      <Dialog open={targetDialog.open} onClose={() => setTargetDialog({ open: false, agent: null, isBulk: false })} maxWidth="sm" fullWidth>
        <DialogTitle>
          {targetDialog.isBulk ? "Bulk Target Assignment" : `Assign Target - ${targetDialog.agent?.name}`}
        </DialogTitle>
        <DialogContent>
          <TargetAssignmentForm
            agent={targetDialog.agent}
            isBulk={targetDialog.isBulk}
            selectedAgents={selectedAgents}
            onSave={handleTargetSave}
            onCancel={() => setTargetDialog({ open: false, agent: null, isBulk: false })}
          />
        </DialogContent>
      </Dialog>

      {/* Add New Agent Dialog */}
      <Dialog open={addAgentDialog} onClose={() => setAddAgentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Add sx={{ color: '#4caf50' }} />
          Add New Agent
        </DialogTitle>
        <DialogContent>
          <AddAgentForm onSave={handleAddAgent} onCancel={() => setAddAgentDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* View Agent Dialog */}
      <Dialog open={viewAgentDialog.open} onClose={() => setViewAgentDialog({ open: false, agent: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Agent Details</DialogTitle>
        <DialogContent>
          {viewAgentDialog.agent && (
            <Box>
              <Typography variant="h6">{viewAgentDialog.agent.name}</Typography>
              <Typography>Email: {viewAgentDialog.agent.email}</Typography>
              <Typography>Phone: {viewAgentDialog.agent.phone}</Typography>
              <Typography>Role: {viewAgentDialog.agent.role}</Typography>
              <Typography>Status: {viewAgentDialog.agent.status}</Typography>
              <Typography>Created: {viewAgentDialog.agent.created_at}</Typography>
              <Typography>Updated: {viewAgentDialog.agent.updated_at}</Typography>
              {/* Add more fields as needed */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewAgentDialog({ open: false, agent: null })}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Edit Agent Dialog */}
      <Dialog open={editAgentDialog.open} onClose={() => setEditAgentDialog({ open: false, agent: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Agent</DialogTitle>
        <DialogContent>
          {editAgentData && (
            <Box component="form">
              <TextField
                label="Name"
                fullWidth
                margin="dense"
                value={editAgentData.name}
                onChange={e => setEditAgentData(d => ({ ...d, name: e.target.value }))}
              />
              <TextField
                label="Email"
                fullWidth
                margin="dense"
                value={editAgentData.email}
                onChange={e => setEditAgentData(d => ({ ...d, email: e.target.value }))}
              />
              <TextField
                label="Phone"
                fullWidth
                margin="dense"
                value={editAgentData.phone}
                onChange={e => setEditAgentData(d => ({ ...d, phone: e.target.value }))}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Role</InputLabel>
                <Select
                  value={editAgentData.role}
                  label="Role"
                  onChange={e => setEditAgentData(d => ({ ...d, role: e.target.value }))}
                >
                  <MenuItem value="agent">Agent</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editAgentData.status}
                  label="Status"
                  onChange={e => setEditAgentData(d => ({ ...d, status: e.target.value }))}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditAgentDialog({ open: false, agent: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEditAgent}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Delete Agent Confirmation Dialog */}
      <Dialog open={deleteAgentDialog.open} onClose={() => setDeleteAgentDialog({ open: false, agent: null })}>
        <DialogTitle>Delete Agent</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete agent <b>{deleteAgentDialog.agent?.name}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAgentDialog({ open: false, agent: null })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteAgent}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Target Assignment Form Component
function TargetAssignmentForm({ agent, isBulk, selectedAgents, onSave, onCancel }) {
  const [targetData, setTargetData] = useState({
    target: agent?.monthlyTarget || 150000,
    period: "monthly",
    startDate: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(targetData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="body2" color="textSecondary" mb={2}>
        {isBulk
          ? `Selected Agents: ${selectedAgents.length}`
          : `Current Target: &#8377;${(agent?.monthlyTarget || 0).toLocaleString()}`
        }
      </Typography>

      <TextField
        label="Sales Target (&#8377;)"
        type="number"
        fullWidth
        margin="dense"
        value={targetData.target}
        onChange={(e) => setTargetData({ ...targetData, target: parseInt(e.target.value) || 0 })}
        required
        InputProps={{
          startAdornment: <Typography variant="body2" color="textSecondary">&#8377;</Typography>,
        }}
      />

      <FormControl fullWidth margin="dense">
        <InputLabel>Target Period</InputLabel>
        <Select
          value={targetData.period}
          label="Target Period"
          onChange={(e) => setTargetData({ ...targetData, period: e.target.value })}
        >
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="quarterly">Quarterly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Start Date"
        type="date"
        fullWidth
        margin="dense"
        value={targetData.startDate}
        onChange={(e) => setTargetData({ ...targetData, startDate: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="Notes (Optional)"
        multiline
        rows={3}
        fullWidth
        margin="dense"
        value={targetData.notes}
        onChange={(e) => setTargetData({ ...targetData, notes: e.target.value })}
        placeholder="Add any specific instructions or notes for this target..."
      />

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {isBulk ? "Assign to All Selected" : "Assign Target"}
        </Button>
      </Box>
    </Box>
  );
}

// Add Agent Form Component
function AddAgentForm({ onSave, onCancel }) {
  const [agentData, setAgentData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",

    // Professional Information
    department: "",
    position: "",
    joiningDate: new Date().toISOString().split('T')[0],
    experience: "",
    skills: "",

    // Financial Information
    baseSalary: 0,
    incentivePercentage: 5,
    monthlyTarget: 150000,

    // Additional Information
    notes: "",
    username: '',
    password: '',
    role: 'agent', // Default to agent
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agentData.name || !agentData.email || !agentData.phone) {
      alert("Please fill in all required fields (Name, Email, Phone)");
      return;
    }
    onSave(agentData);
  };

  const handleInputChange = (field, value) => {
    setAgentData({ ...agentData, [field]: value });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 1, sm: 2 }, maxWidth: 900, mx: 'auto' }}>
      <Grid container spacing={3}>
        {/* Credentials Section */}
        <Grid item xs={12}>
          <Paper elevation={4} sx={{
            p: 3,
            borderRadius: 4,
            mb: 2,
            background: 'rgba(24, 24, 32, 0.7)',
            boxShadow: '0 8px 32px 0 #00e6ff33',
            backdropFilter: 'blur(12px)',
          }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#00e6ff', fontWeight: 700 }}>
              <Person /> Credentials
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Agent ID (Username) *"
                  fullWidth
                  required
                  value={agentData.username}
                  onChange={e => handleInputChange('username', e.target.value)}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  helperText="Unique login ID for the agent"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Password *"
                  type="password"
                  fullWidth
                  required
                  value={agentData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  InputProps={{
                    startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  helperText="Set a strong password"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Personal Information Section */}
        <Grid item xs={12}>
          <Paper elevation={4} sx={{
            p: 3,
            borderRadius: 4,
            mb: 2,
            background: 'rgba(24, 24, 32, 0.7)',
            boxShadow: '0 8px 32px 0 #00e6ff33',
            backdropFilter: 'blur(12px)',
          }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#00e6ff', fontWeight: 700 }}>
              <Person /> Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name *"
                  fullWidth
                  required
                  value={agentData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email Address *"
                  type="email"
                  fullWidth
                  required
                  value={agentData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone Number *"
                  fullWidth
                  required
                  value={agentData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  InputProps={{
                    startAdornment: <PhoneAndroid sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Emergency Contact"
                  fullWidth
                  value={agentData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  multiline
                  rows={2}
                  fullWidth
                  value={agentData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Professional Information Section */}
        <Grid item xs={12}>
          <Paper elevation={4} sx={{
            p: 3,
            borderRadius: 4,
            mb: 2,
            background: 'rgba(24, 24, 32, 0.7)',
            boxShadow: '0 8px 32px 0 #00e6ff33',
            backdropFilter: 'blur(12px)',
          }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#00e6ff', fontWeight: 700 }}>
              <Work /> Professional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Department *</InputLabel>
                  <Select
                    value={agentData.department}
                    label="Department *"
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    required
                  >
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="Customer Service">Customer Service</MenuItem>
                    <MenuItem value="Technical Support">Technical Support</MenuItem>
                    <MenuItem value="Lead Generation">Lead Generation</MenuItem>
                    <MenuItem value="Account Management">Account Management</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Position/Designation"
                  fullWidth
                  value={agentData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  InputProps={{
                    startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Joining Date"
                  type="date"
                  fullWidth
                  value={agentData.joiningDate}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Years of Experience"
                  fullWidth
                  value={agentData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="e.g., 2 years"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Skills & Expertise"
                  multiline
                  rows={2}
                  fullWidth
                  value={agentData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  placeholder="e.g., Cold calling, CRM software, Negotiation, Product knowledge"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Financial Information Section */}
        <Grid item xs={12}>
          <Paper elevation={4} sx={{
            p: 3,
            borderRadius: 4,
            mb: 2,
            background: 'rgba(24, 24, 32, 0.7)',
            boxShadow: '0 8px 32px 0 #00e6ff33',
            backdropFilter: 'blur(12px)',
          }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#00e6ff', fontWeight: 700 }}>
              <AttachMoney /> Financial Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Base Salary (₹)"
                  type="number"
                  fullWidth
                  value={agentData.baseSalary}
                  onChange={(e) => handleInputChange('baseSalary', parseInt(e.target.value) || 0)}
                  InputProps={{
                    startAdornment: <Typography variant="body2" color="textSecondary">₹</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Incentive Percentage (%)"
                  type="number"
                  fullWidth
                  value={agentData.incentivePercentage}
                  onChange={(e) => handleInputChange('incentivePercentage', parseFloat(e.target.value) || 0)}
                  InputProps={{
                    endAdornment: <Typography variant="body2" color="textSecondary">%</Typography>,
                  }}
                  helperText="Percentage on extra sales above target"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Monthly Target (₹)"
                  type="number"
                  fullWidth
                  value={agentData.monthlyTarget}
                  onChange={(e) => handleInputChange('monthlyTarget', parseInt(e.target.value) || 0)}
                  InputProps={{
                    startAdornment: <Typography variant="body2" color="textSecondary">₹</Typography>,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Additional Information Section */}
        <Grid item xs={12}>
          <Paper elevation={4} sx={{
            p: 3,
            borderRadius: 4,
            mb: 2,
            background: 'rgba(24, 24, 32, 0.7)',
            boxShadow: '0 8px 32px 0 #00e6ff33',
            backdropFilter: 'blur(12px)',
          }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#00e6ff', fontWeight: 700 }}>
              <TrendingUpIcon /> Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Notes & Comments"
                  multiline
                  rows={3}
                  fullWidth
                  value={agentData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional notes, special requirements, or comments about this agent..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Role *</InputLabel>
                  <Select
                    value={agentData.role}
                    label="Role *"
                    onChange={e => handleInputChange('role', e.target.value)}
                  >
                    <MenuItem value="agent">Agent</MenuItem>
                    <MenuItem value="supervisor">Supervisor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button onClick={onCancel} variant="outlined" size="large">
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="large" sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#388e3c' }
            }}>
              <Add sx={{ mr: 1 }} />
              Add Agent
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
} 