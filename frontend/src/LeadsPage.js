import React, { useState, useEffect } from "react";
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
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Add, Edit, Delete, Search, Feedback, Message } from "@mui/icons-material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { motion } from "framer-motion";
import { leadsAPI, agentsAPI } from './services/api';
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const statuses = ["New", "In Progress", "Converted", "Lost"];
const agents = ["Charlie Agent", "Diana Agent", "Eve Agent"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"];

const mockLeads = [
  {
    id: 1,
    name: "Acme Corp",
    email: "contact@acme.com",
    phone: "+91 98765 43210",
    city: "Mumbai",
    status: "New",
    agent: "Abhishek",
    feedback: [
      { id: 1, agent: "Abhishek", message: "Initial contact made. Customer showed interest in our services.", timestamp: "2024-07-11 10:30", type: "Call" },
      { id: 2, agent: "Abhishek", message: "Follow-up call scheduled for next week.", timestamp: "2024-07-11 14:15", type: "Note" }
    ]
  },
  {
    id: 2,
    name: "Beta Ltd",
    email: "info@beta.com",
    phone: "+91 87654 32109",
    city: "Delhi",
    status: "In Progress",
    agent: "Narayan",
    feedback: [
      { id: 3, agent: "Narayan", message: "Demo presentation completed. Customer has questions about pricing.", timestamp: "2024-07-10 16:45", type: "Meeting" },
      { id: 4, agent: "Narayan", message: "Sent pricing proposal via email.", timestamp: "2024-07-11 09:20", type: "Email" },
      { id: 5, agent: "Narayan", message: "Customer requested additional features comparison.", timestamp: "2024-07-11 11:30", type: "Note" }
    ]
  },
  {
    id: 3,
    name: "Gamma Inc",
    email: "hello@gamma.com",
    phone: "+91 76543 21098",
    city: "Bangalore",
    status: "Converted",
    agent: "Prince",
    feedback: [
      { id: 6, agent: "Prince", message: "Contract signed! Deal closed successfully.", timestamp: "2024-07-09 15:30", type: "Success" }
    ]
  },
];

export default function LeadsPage({ currentUser }) {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({ open: false, mode: "add", lead: null });
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, lead: null, newFeedback: "" });
  const [filter, setFilter] = useState({ city: "", status: "", agent: "" });
  const [statusDialog, setStatusDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  // Date range state
  const [dateRange, setDateRange] = useState({
    from: '',
    to: dayjs().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    if (currentUser?.role === 'agent') {
      leadsAPI.getByAgent(currentUser.id).then(res => {
        if (res.success) setLeads(res.data);
      });
    } else {
      leadsAPI.getAll().then(res => {
        if (res.success) setLeads(res.data);
      });
      // Fetch agents for admin
      agentsAPI.getAll().then(res => {
        if (res.success) setAgents(res.data);
      });
    }
  }, [currentUser]);

  // Filtered leads with date range
  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.contact?.includes(search) ||
      l.city?.toLowerCase().includes(search.toLowerCase()) ||
      (typeof l.agent === 'object' ? l.agent.name : l.agent)?.toLowerCase().includes(search.toLowerCase());
    const matchesCity = !filter.city || l.city === filter.city;
    const matchesStatus = !filter.status || l.status === filter.status;
    const matchesAgent = !filter.agent || l.agent === filter.agent || l.agent?.id === filter.agent;
    // Date filter
    const createdAt = l.created_at ? l.created_at.slice(0, 10) : '';
    const afterFrom = !dateRange.from || createdAt >= dateRange.from;
    const beforeTo = !dateRange.to || createdAt <= dateRange.to;
    return matchesSearch && matchesCity && matchesStatus && matchesAgent && afterFrom && beforeTo;
  });

  const handleOpen = (mode, lead = null) => setDialog({ open: true, mode, lead });
  const handleClose = () => setDialog({ open: false, mode: "add", lead: null });

  const handleSave = () => {
    const { lead, mode } = dialog;
    if (!lead.name || !lead.contact || !lead.city || !lead.status || !lead.agent) return;
    if (mode === "add") {
      setLeads([...leads, { ...lead, id: Date.now(), feedback: [] }]);
    } else {
      setLeads(leads.map((l) => (l.id === lead.id ? lead : l)));
    }
    handleClose();
  };

  const handleDelete = (id) => setLeads(leads.filter((l) => l.id !== id));

  const handleFeedbackOpen = (lead) => setFeedbackDialog({ open: true, lead, newFeedback: "" });
  const handleFeedbackClose = () => setFeedbackDialog({ open: false, lead: null, newFeedback: "" });

  const handleAddFeedback = () => {
    const { lead, newFeedback } = feedbackDialog;
    if (!newFeedback.trim()) return;

    const newFeedbackEntry = {
      id: Date.now(),
      agent: lead.agent,
      message: newFeedback,
      timestamp: new Date().toLocaleString(),
      type: "Note"
    };

    setLeads(leads.map((l) =>
      l.id === lead.id
        ? { ...l, feedback: [...l.feedback, newFeedbackEntry] }
        : l
    ));

    handleFeedbackClose();
  };

  const handleStatusClick = (lead) => {
    setSelectedLead(lead);
    setStatusUpdate(lead.status || '');
    setStatusDialog(true);
  };
  const handleStatusSave = async () => {
    if (selectedLead && statusUpdate) {
      await leadsAPI.updateStatus(selectedLead.id, statusUpdate);
      if (currentUser?.role === 'agent') {
        leadsAPI.getByAgent(currentUser.id).then(res => {
          if (res.success) setLeads(res.data);
        });
      } else {
        leadsAPI.getAll().then(res => {
          if (res.success) setLeads(res.data);
        });
      }
      setStatusDialog(false);
      setSelectedLead(null);
    }
  };

  // Bulk upload handler
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedAgentId) {
      setUploadResult({ success: false, message: 'Please select an agent before uploading.' });
      return;
    }
    setUploading(true);
    setUploadResult(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('agentId', selectedAgentId);
    try {
      const res = await fetch('/api/leads/bulk', {
        method: 'POST',
        body: formData,
      });
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        setUploadResult({ success: false, message: `Server error: ${text.slice(0, 200)}` });
        return;
      }
      if (data.success) {
        setUploadResult({ success: true, message: `Uploaded ${data.count} leads successfully!` });
        // Optionally refresh leads
        leadsAPI.getAll().then(res => {
          if (res.success) setLeads(res.data);
        });
      } else {
        setUploadResult({ success: false, message: data.error || 'Upload failed.' });
      }
    } catch (err) {
      setUploadResult({ success: false, message: err.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  // Export filtered leads to XLSX
  const handleExport = () => {
    // Prepare data for export
    const exportData = filtered.map(lead => ({
      Name: lead.name,
      Contact: lead.contact,
      City: lead.city,
      Status: lead.status,
      Agent: lead.agent,
      'Feedback Count': lead.feedback ? lead.feedback.length : 0
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    XLSX.writeFile(workbook, 'leads_export.xlsx');
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
          Leads
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight={800} color="primary.main">
            Lead Management
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            {currentUser?.role !== 'agent' && (
              <FormControl size="small" sx={{ minWidth: 200, mr: 2 }}>
                <InputLabel>Select Agent</InputLabel>
                <Select
                  value={selectedAgentId}
                  label="Select Agent"
                  onChange={e => setSelectedAgentId(e.target.value)}
                >
                  <MenuItem value="">Select Agent</MenuItem>
                  {agents.map(agent => (
                    <MenuItem key={agent.id} value={agent.id}>{agent.name} ({agent.email})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              component="label"
              disabled={uploading}
              sx={{ background: '#00e6ff', color: '#000', fontWeight: 700 }}
            >
              {uploading ? <CircularProgress size={20} color="inherit" /> : 'Bulk Upload (.xlsx)'}
              <input
                type="file"
                accept=".xlsx"
                hidden
                onChange={handleBulkUpload}
              />
            </Button>
            {uploadResult && (
              <Typography color={uploadResult.success ? 'success.main' : 'error.main'} fontWeight={700} ml={2}>
                {uploadResult.message}
              </Typography>
            )}
            {currentUser?.role === 'admin' && (
              <Button
                variant="outlined"
                onClick={handleExport}
                sx={{ fontWeight: 700, borderColor: '#00e6ff', color: '#00e6ff' }}
              >
                Export (.xlsx)
              </Button>
            )}
            {/* Remove Add Lead button for all roles */}
            {/* (Button removed) */}
          </Box>
        </Box>
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <TextField
            placeholder="Search leads..."
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
            sx={{ width: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>City</InputLabel>
            <Select
              value={filter.city}
              label="City"
              onChange={(e) => setFilter((f) => ({ ...f, city: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              {cities.map((city) => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter.status}
              label="Status"
              onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Agent</InputLabel>
            <Select
              value={filter.agent}
              label="Agent"
              onChange={(e) => setFilter((f) => ({ ...f, agent: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              {agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>{agent.name} ({agent.email})</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Date range filter */}
          <TextField
            label="From Date"
            type="date"
            size="small"
            value={dateRange.from}
            onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
          />
          <TextField
            label="To Date"
            type="date"
            size="small"
            value={dateRange.to}
            onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
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
                <TableCell>Contact</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((lead) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.contact}</TableCell>
                  <TableCell>{lead.city}</TableCell>
                  <TableCell>
                    <Chip label={lead.status} color={lead.status === "Converted" ? "success" : lead.status === "Lost" ? "error" : "primary"} />
                  </TableCell>
                  <TableCell>
                    {/* Show agent name if agent is object, else show as string */}
                    {typeof lead.agent === 'object' ? lead.agent.name : agents.find(a => a.id === lead.agent)?.name || lead.agent}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={`${lead.feedback.length} updates`}
                        size="small"
                        color="info"
                        icon={<Message />}
                      />
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleFeedbackOpen(lead)}
                      >
                        <Feedback />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen("edit", { ...lead })}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(lead.id)}>
                      <Delete />
                    </IconButton>
                    {currentUser?.role === 'agent' && (
                      <IconButton color="info" onClick={() => handleStatusClick(lead)}>
                        <Edit />
                      </IconButton>
                    )}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </motion.div>

      {/* Add/Edit Lead Dialog */}
      <Dialog open={dialog.open} onClose={handleClose} maxWidth="xs" fullWidth>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
          <DialogTitle>{dialog.mode === "add" ? "Add Lead" : "Edit Lead"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="dense"
              value={dialog.lead?.name || ""}
              onChange={(e) => setDialog((d) => ({ ...d, lead: { ...d.lead, name: e.target.value } }))}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Contact"
              fullWidth
              margin="dense"
              value={dialog.lead?.contact || ""}
              onChange={(e) => setDialog((d) => ({ ...d, lead: { ...d.lead, contact: e.target.value } }))}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="City"
              fullWidth
              margin="dense"
              value={dialog.lead?.city || cities[0]}
              onChange={(e) => setDialog((d) => ({ ...d, lead: { ...d.lead, city: e.target.value } }))}
              sx={{ mb: 2 }}
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              fullWidth
              margin="dense"
              value={dialog.lead?.status || statuses[0]}
              onChange={(e) => setDialog((d) => ({ ...d, lead: { ...d.lead, status: e.target.value } }))}
              sx={{ mb: 2 }}
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Agent"
              fullWidth
              margin="dense"
              value={dialog.lead?.agent || (agents[0] && agents[0].id) || ''}
              onChange={(e) => setDialog((d) => ({ ...d, lead: { ...d.lead, agent: e.target.value } }))}
              sx={{ mb: 2 }}
            >
              {agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>{agent.name} ({agent.email})</MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              {dialog.mode === "add" ? "Add" : "Save"}
            </Button>
          </DialogActions>
        </motion.div>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog.open} onClose={handleFeedbackClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Feedback & Updates - {feedbackDialog.lead?.name}
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle2" color="primary" mb={1}>
              Add New Feedback
            </Typography>
            <TextField
              label="New feedback message"
              fullWidth
              multiline
              rows={3}
              value={feedbackDialog.newFeedback}
              onChange={(e) => setFeedbackDialog((f) => ({ ...f, newFeedback: e.target.value }))}
              placeholder="Enter your feedback or update about this lead..."
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" color="primary" mb={1}>
            Previous Feedback ({feedbackDialog.lead?.feedback?.length || 0} entries)
          </Typography>
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {feedbackDialog.lead?.feedback?.map((feedback, index) => (
              <ListItem key={feedback.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Chip label={feedback.type} size="small" color="primary" />
                  <Typography variant="caption" color="textSecondary">
                    {feedback.timestamp}
                  </Typography>
                </Box>
                <ListItemText
                  primary={feedback.message}
                  secondary={`By: ${feedback.agent}`}
                />
                {index < feedbackDialog.lead.feedback.length - 1 && <Divider sx={{ width: '100%', mt: 1 }} />}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFeedbackClose}>Close</Button>
          <Button variant="contained" onClick={handleAddFeedback}>
            Add Feedback
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Status for {selectedLead?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="New Status"
            fullWidth
            margin="dense"
            select
            value={statusUpdate}
            onChange={(e) => setStatusUpdate(e.target.value)}
            sx={{ mb: 2 }}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusSave}>
            Save Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 