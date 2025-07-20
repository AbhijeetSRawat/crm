import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  LocationOn,
  Work,
  TrendingUp,
  TrendingDown,
  Call,
  Assignment,
  Schedule,
  AttachMoney,
  Flag,
  PlayArrow,
  Download,
  Edit,
  Visibility,
  Business,
  CalendarToday,
  AccessTime,
  CheckCircle,
  Cancel,
  Warning,
  WhatsAppIcon,
} from '@mui/icons-material';
import { leadsAPI } from './services/api';

// Mock data for agent dashboard
const mockAgentData = {
  id: 1,
  name: "Abhishek",
  email: "abhishek@crm.com",
  phone: "9876543210",
  avatar: "A",
  department: "Sales",
  status: "Online",
  joiningDate: "2024-01-15",
  baseSalary: 25000,
  incentivePercentage: 5,
  monthlyTarget: 150000,
  address: "Mumbai, Maharashtra",
  emergencyContact: "9876543211",
  skills: "Cold calling, CRM software, Negotiation",
  experience: "2 years"
};

const mockAgentStats = {
  totalSales: 125000,
  salesCount: 8,
  avgDealSize: 15625,
  targetAchievement: 83,
  callsToday: 12,
  callsThisWeek: 45,
  callsThisMonth: 180,
  leadsAssigned: 25,
  leadsConverted: 8,
  conversionRate: 32,
  avgCallDuration: "4m 32s",
  totalCallTime: "6h 24m",
  lastActivity: "2 min ago",
  performance: 85,
  incentiveEarned: 6250,
  totalEarnings: 31250,
  // Enhanced call statistics
  totalCalls: 245,
  totalMissedCalls: 18,
  totalIncomingCalls: 89,
  totalOutboundCalls: 156,
  highestCallDuration: "12m 45s",
  callSuccessRate: 78,
  avgIncomingCallDuration: "3m 12s",
  avgOutboundCallDuration: "5m 28s",
  totalCallDuration: "18h 32m",
  todayIncomingCalls: 4,
  todayOutboundCalls: 8,
  todayMissedCalls: 2,
  weekIncomingCalls: 15,
  weekOutboundCalls: 30,
  weekMissedCalls: 5,
  monthIncomingCalls: 89,
  monthOutboundCalls: 156,
  monthMissedCalls: 18,
};

const mockAssignedLeads = [
  {
    id: 1,
    name: "Acme Corporation",
    contact: "John Smith",
    phone: "9876543210",
    email: "john@acme.com",
    status: "New",
    priority: "High",
    assignedDate: "2024-07-11",
    lastContact: "2024-07-11",
    value: 25000,
    notes: "Interested in enterprise solution"
  },
  {
    id: 2,
    name: "Beta Industries",
    contact: "Sarah Johnson",
    phone: "9123456780",
    email: "sarah@beta.com",
    status: "In Progress",
    priority: "Medium",
    assignedDate: "2024-07-10",
    lastContact: "2024-07-11",
    value: 15000,
    notes: "Follow up required"
  },
  {
    id: 3,
    name: "Gamma Solutions",
    contact: "Mike Wilson",
    phone: "9988776655",
    email: "mike@gamma.com",
    status: "Qualified",
    priority: "High",
    assignedDate: "2024-07-09",
    lastContact: "2024-07-10",
    value: 35000,
    notes: "Ready for proposal"
  }
];

const mockCallHistory = [
  {
    id: 1,
    lead: "Acme Corporation",
    contact: "John Smith",
    phone: "9876543210",
    duration: "4m 32s",
    date: "2024-07-11",
    time: "14:30",
    outcome: "Interested",
    notes: "Discussed pricing and features. Follow up scheduled."
  },
  {
    id: 2,
    lead: "Beta Industries",
    contact: "Sarah Johnson",
    phone: "9123456780",
    duration: "3m 15s",
    date: "2024-07-11",
    time: "11:45",
    outcome: "Not Interested",
    notes: "Budget constraints mentioned."
  },
  {
    id: 3,
    lead: "Gamma Solutions",
    contact: "Mike Wilson",
    phone: "9988776655",
    duration: "6m 20s",
    date: "2024-07-10",
    time: "16:20",
    outcome: "Converted",
    notes: "Deal closed successfully!"
  }
];

const mockRecentActivities = [
  {
    id: 1,
    type: "call",
    description: "Called Acme Corporation",
    time: "2 min ago",
    status: "completed"
  },
  {
    id: 2,
    type: "lead",
    description: "New lead assigned: Delta Tech",
    time: "1 hour ago",
    status: "assigned"
  },
  {
    id: 3,
    type: "sale",
    description: "Closed deal with Gamma Solutions",
    time: "3 hours ago",
    status: "completed"
  },
  {
    id: 4,
    type: "target",
    description: "Monthly target updated",
    time: "1 day ago",
    status: "updated"
  }
];

export default function AgentDashboard({ agent, onLogout }) {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadDialog, setLeadDialog] = useState(false);
  const [callDialog, setCallDialog] = useState(false);
  const [callData, setCallData] = useState({
    outcome: '',
    duration: '',
    notes: ''
  });

  // Add state for editing call
  const [editCall, setEditCall] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editCallData, setEditCallData] = useState({ outcome: '', notes: '' });
  // SIM registration state
  const [simNumber, setSimNumber] = useState(() => localStorage.getItem('simNumber') || '');
  const [simInput, setSimInput] = useState(simNumber);
  // Call history state (offline/online sync demo)
  const [callHistory, setCallHistory] = useState(() => {
    const local = localStorage.getItem('callHistory');
    return local ? JSON.parse(local) : mockCallHistory;
  });
  const [statusDialog, setStatusDialog] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'default';
      case 'In Progress': return 'warning';
      case 'Qualified': return 'info';
      case 'Converted': return 'success';
      case 'Lost': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return <Call />;
      case 'lead': return <Assignment />;
      case 'sale': return <AttachMoney />;
      case 'target': return <Flag />;
      default: return <Schedule />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'assigned': return 'info';
      case 'updated': return 'warning';
      default: return 'default';
    }
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setLeadDialog(true);
  };

  const handleCallClick = (lead) => {
    setSelectedLead(lead);
    setCallDialog(true);
  };

  const handleCallSubmit = () => {
    // In real app, this would save call data
    alert(`Call logged for ${selectedLead.name}`);
    setCallDialog(false);
    setCallData({ outcome: '', duration: '', notes: '' });
  };

  const handleEditCall = (call) => {
    setEditCall(call);
    setEditCallData({ outcome: call.outcome, notes: call.notes });
    setEditDialog(true);
  };

  const handleEditCallSave = () => {
    setCallHistory(prev => prev.map(c =>
      c.id === editCall.id ? { ...c, outcome: editCallData.outcome, notes: editCallData.notes } : c
    ));
    setEditDialog(false);
    setEditCall(null);
  };

  const handleStatusClick = (lead) => {
    setSelectedLead(lead);
    setStatusUpdate(lead.status || '');
    setStatusDialog(true);
  };
  const handleStatusSave = async () => {
    if (selectedLead && statusUpdate) {
      await leadsAPI.updateStatus(selectedLead.id, statusUpdate);
      // Refresh leads
      leadsAPI.getByAgent(agent.id).then(res => {
        if (res.success) setAssignedLeads(res.data);
      });
      setStatusDialog(false);
      setSelectedLead(null);
    }
  };

  // Save SIM number to localStorage
  const handleSimRegister = () => {
    setSimNumber(simInput);
    localStorage.setItem('simNumber', simInput);
  };

  // Save call history to localStorage (simulate offline sync)
  useEffect(() => {
    localStorage.setItem('callHistory', JSON.stringify(callHistory));
    // Placeholder: here you would sync with server if online
  }, [callHistory]);

  useEffect(() => {
    if (agent && agent.id) {
      leadsAPI.getByAgent(agent.id).then(res => {
        if (res.success) setAssignedLeads(res.data);
      });
    }
  }, [agent]);

  // Filter call history by SIM number
  const filteredCallHistory = simNumber
    ? callHistory.filter(call => call.phone.endsWith(simNumber))
    : callHistory;

  return (
    <Box sx={{ p: 3, background: '#0a0a0a', minHeight: '100vh' }}>
      {/* TechBro24 Brand Header */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar sx={{ width: 48, height: 48, bgcolor: '#00e6ff', fontWeight: 900, fontSize: 24 }}>T</Avatar>
        <Typography variant="h4" fontWeight={900} color="#00e6ff">TechBro24 Agent Panel</Typography>
      </Box>

      {/* SIM Registration Section */}
      <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" color="#00e6ff" mb={1}>SIM Registration</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              label="Enter SIM Number"
              value={simInput}
              onChange={e => setSimInput(e.target.value)}
              size="small"
              sx={{ input: { color: '#fff' }, label: { color: '#00e6ff' } }}
            />
            <Button
              variant="contained"
              sx={{ background: '#00e6ff', color: '#000', fontWeight: 700 }}
              onClick={handleSimRegister}
            >
              Register
            </Button>
            {simNumber && (
              <Chip label={`Registered: ${simNumber}`} color="success" />
            )}
          </Box>
          <Typography variant="caption" color="textSecondary">
            Only calls from this SIM will be shown in your call history.
          </Typography>
        </CardContent>
      </Card>

      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: '#00e6ff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            {mockAgentData.avatar}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Welcome back, {mockAgentData.name}!
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {mockAgentData.department} • {mockAgentData.status}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          onClick={onLogout}
          sx={{
            borderColor: '#00e6ff',
            color: '#00e6ff',
            '&:hover': {
              borderColor: '#0099cc',
              backgroundColor: 'rgba(0, 230, 255, 0.1)',
            },
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Performance Overview */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="success.main">
                    &#8377;{mockAgentStats.totalSales.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {mockAgentStats.salesCount} deals
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: '#4caf50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Target Achievement
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="primary.main">
                    {mockAgentStats.targetAchievement}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={mockAgentStats.targetAchievement}
                    sx={{ mt: 1, backgroundColor: '#333', "& .MuiLinearProgress-bar": { backgroundColor: '#00e6ff' } }}
                  />
                </Box>
                <Flag sx={{ fontSize: 40, color: '#00e6ff' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Calls Today
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="warning.main">
                    {mockAgentStats.callsToday}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {mockAgentStats.avgCallDuration} avg
                  </Typography>
                </Box>
                <Call sx={{ fontSize: 40, color: '#ff9800' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    This Month's Earnings
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="info.main">
                    &#8377;{mockAgentStats.totalEarnings.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +&#8377;{mockAgentStats.incentiveEarned.toLocaleString()} incentive
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: '#2196f3' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Call Statistics */}
      <Typography variant="h5" fontWeight={700} color="#00e6ff" mb={3}>
        📞 Call Statistics Overview
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={2}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Call sx={{ fontSize: 40, color: '#00e6ff', mb: 1 }} />
                <Typography variant="h4" fontWeight={900} color="#00e6ff">
                  {mockAgentStats.totalCalls}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Calls
                </Typography>
                <Typography variant="caption" color="success.main" mt={1}>
                  {mockAgentStats.callSuccessRate}% success rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Phone sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                <Typography variant="h4" fontWeight={900} color="#4caf50">
                  {mockAgentStats.totalIncomingCalls}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Incoming Calls
                </Typography>
                <Typography variant="caption" color="textSecondary" mt={1}>
                  {mockAgentStats.avgIncomingCallDuration} avg
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Call sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                <Typography variant="h4" fontWeight={900} color="#ff9800">
                  {mockAgentStats.totalOutboundCalls}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Outbound Calls
                </Typography>
                <Typography variant="caption" color="textSecondary" mt={1}>
                  {mockAgentStats.avgOutboundCallDuration} avg
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Cancel sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                <Typography variant="h4" fontWeight={900} color="#f44336">
                  {mockAgentStats.totalMissedCalls}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Missed Calls
                </Typography>
                <Typography variant="caption" color="textSecondary" mt={1}>
                  {((mockAgentStats.totalMissedCalls / mockAgentStats.totalCalls) * 100).toFixed(1)}% rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <AccessTime sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                <Typography variant="h4" fontWeight={900} color="#9c27b0">
                  {mockAgentStats.highestCallDuration}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Longest Call
                </Typography>
                <Typography variant="caption" color="textSecondary" mt={1}>
                  Record duration
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Schedule sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                <Typography variant="h4" fontWeight={900} color="#2196f3">
                  {mockAgentStats.totalCallDuration}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Call Time
                </Typography>
                <Typography variant="caption" color="textSecondary" mt={1}>
                  This month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Today's Call Breakdown */}
      <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={2}>
        📅 Today's Call Activity
      </Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Incoming Calls
                  </Typography>
                  <Typography variant="h5" fontWeight={900} color="#4caf50">
                    {mockAgentStats.todayIncomingCalls}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +2 from yesterday
                  </Typography>
                </Box>
                <Phone sx={{ fontSize: 32, color: '#4caf50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Outbound Calls
                  </Typography>
                  <Typography variant="h5" fontWeight={900} color="#ff9800">
                    {mockAgentStats.todayOutboundCalls}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +3 from yesterday
                  </Typography>
                </Box>
                <Call sx={{ fontSize: 32, color: '#ff9800' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Missed Calls
                  </Typography>
                  <Typography variant="h5" fontWeight={900} color="#f44336">
                    {mockAgentStats.todayMissedCalls}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    -1 from yesterday
                  </Typography>
                </Box>
                <Cancel sx={{ fontSize: 32, color: '#f44336' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Call Success Rate
                  </Typography>
                  <Typography variant="h5" fontWeight={900} color="#00e6ff">
                    {mockAgentStats.callSuccessRate}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={mockAgentStats.callSuccessRate}
                    sx={{ mt: 1, backgroundColor: '#333', "& .MuiLinearProgress-bar": { backgroundColor: '#00e6ff' } }}
                  />
                </Box>
                <TrendingUp sx={{ fontSize: 32, color: '#00e6ff' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Weekly & Monthly Call Breakdown */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={3}>
                📊 This Week's Call Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={900} color="#4caf50">
                      {mockAgentStats.weekIncomingCalls}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Incoming
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={900} color="#ff9800">
                      {mockAgentStats.weekOutboundCalls}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Outbound
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={900} color="#f44336">
                      {mockAgentStats.weekMissedCalls}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Missed
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Typography variant="body2" color="success.main" textAlign="center">
                  Total: {mockAgentStats.weekIncomingCalls + mockAgentStats.weekOutboundCalls} calls this week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={3}>
                📈 This Month's Call Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={900} color="#4caf50">
                      {mockAgentStats.monthIncomingCalls}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Incoming
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={900} color="#ff9800">
                      {mockAgentStats.monthOutboundCalls}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Outbound
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={900} color="#f44336">
                      {mockAgentStats.monthMissedCalls}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Missed
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Typography variant="body2" color="success.main" textAlign="center">
                  Total: {mockAgentStats.monthIncomingCalls + mockAgentStats.monthOutboundCalls} calls this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Assigned Leads */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography variant="h6" color="primary" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment />
                Assigned Leads ({assignedLeads.length})
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#00e6ff' }}>Company</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Contact</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Status</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Priority</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Value</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedLeads.map((lead) => (
                      <TableRow key={lead.id} hover>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>
                          <Chip label={lead.status} color={getStatusColor(lead.status)} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={lead.priority} color={getPriorityColor(lead.priority)} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            ₹{lead.value?.toLocaleString?.() || ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton color="primary" size="small" onClick={() => handleLeadClick(lead)}>
                            <Visibility />
                          </IconButton>
                          <IconButton color="success" size="small" onClick={() => handleCallClick(lead)}>
                            <Call />
                          </IconButton>
                          <IconButton color="warning" size="small" onClick={() => handleStatusClick(lead)}>
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography variant="h6" color="primary" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule />
                Recent Activities
              </Typography>
              <List>
                {mockRecentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#00e6ff', width: 32, height: 32 }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.description}
                        secondary={activity.time}
                        primaryTypographyProps={{ variant: 'body2', color: '#fff' }}
                        secondaryTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
                      />
                      <Chip
                        label={activity.status}
                        color={getActivityColor(activity.status)}
                        size="small"
                      />
                    </ListItem>
                    {index < mockRecentActivities.length - 1 && <Divider sx={{ borderColor: '#333' }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Call History Panel */}
        <Box mt={4}>
          <Typography variant="h5" fontWeight={700} color="#00e6ff" mb={2}>
            📞 Call History
          </Typography>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#00e6ff' }}>Lead</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Contact</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Phone</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Duration</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Date</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Time</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Outcome</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Notes</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCallHistory.map((call) => (
                      <TableRow key={call.id} hover>
                        <TableCell>{call.lead}</TableCell>
                        <TableCell>{call.contact}</TableCell>
                        <TableCell>{call.phone}</TableCell>
                        <TableCell>{call.duration}</TableCell>
                        <TableCell>{call.date}</TableCell>
                        <TableCell>{call.time}</TableCell>
                        <TableCell>{call.outcome}</TableCell>
                        <TableCell>{call.notes}</TableCell>
                        <TableCell>
                          <IconButton color="primary" size="small" onClick={() => handleEditCall(call)}>
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="success"
                            size="small"
                            component="a"
                            href={`https://wa.me/91${call.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Send WhatsApp Message"
                          >
                            <WhatsAppIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Call History */}
        <Grid item xs={12}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography variant="h6" color="primary" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Call />
                Recent Call History
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#00e6ff' }}>Lead</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Contact</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Duration</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Date & Time</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Outcome</TableCell>
                      <TableCell sx={{ color: '#00e6ff' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockCallHistory.map((call) => (
                      <TableRow key={call.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {call.lead}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{call.contact}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {call.phone}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main">
                            {call.duration}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{call.date}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {call.time}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={call.outcome}
                            color={call.outcome === 'Converted' ? 'success' : call.outcome === 'Interested' ? 'info' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton color="primary" size="small">
                            <PlayArrow />
                          </IconButton>
                          <IconButton color="primary" size="small">
                            <Download />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lead Details Dialog */}
      <Dialog open={leadDialog} onClose={() => setLeadDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#00e6ff' }}>
          Lead Details - {selectedLead?.name}
        </DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Company Information</Typography>
                <Typography><strong>Company:</strong> {selectedLead.name}</Typography>
                <Typography><strong>Contact:</strong> {selectedLead.contact}</Typography>
                <Typography><strong>Phone:</strong> {selectedLead.phone}</Typography>
                <Typography><strong>Email:</strong> {selectedLead.email}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Lead Information</Typography>
                <Typography><strong>Status:</strong> {selectedLead.status}</Typography>
                <Typography><strong>Priority:</strong> {selectedLead.priority}</Typography>
                <Typography><strong>Value:</strong> &#8377;{selectedLead.value.toLocaleString()}</Typography>
                <Typography><strong>Assigned:</strong> {selectedLead.assignedDate}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Notes</Typography>
                <Typography>{selectedLead.notes}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeadDialog(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Call />}
            onClick={() => {
              setLeadDialog(false);
              handleCallClick(selectedLead);
            }}
          >
            Log Call
          </Button>
        </DialogActions>
      </Dialog>

      {/* Log Call Dialog */}
      <Dialog open={callDialog} onClose={() => setCallDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00e6ff' }}>
          Log Call - {selectedLead?.name}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Call Outcome</InputLabel>
            <Select
              value={callData.outcome}
              label="Call Outcome"
              onChange={(e) => setCallData({ ...callData, outcome: e.target.value })}
            >
              <MenuItem value="Interested">Interested</MenuItem>
              <MenuItem value="Not Interested">Not Interested</MenuItem>
              <MenuItem value="Converted">Converted</MenuItem>
              <MenuItem value="Follow Up">Follow Up</MenuItem>
              <MenuItem value="No Answer">No Answer</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Call Duration (mm:ss)"
            fullWidth
            margin="dense"
            value={callData.duration}
            onChange={(e) => setCallData({ ...callData, duration: e.target.value })}
            placeholder="e.g., 4:32"
          />

          <TextField
            label="Call Notes"
            multiline
            rows={4}
            fullWidth
            margin="dense"
            value={callData.notes}
            onChange={(e) => setCallData({ ...callData, notes: e.target.value })}
            placeholder="Enter call details, next steps, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCallSubmit}>
            Log Call
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Call Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00e6ff', fontWeight: 700 }}>Edit Call Details</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" mb={2}>
            {editCall && `${editCall.lead} (${editCall.phone})`}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Outcome</InputLabel>
            <Select
              value={editCallData.outcome}
              label="Outcome"
              onChange={e => setEditCallData(data => ({ ...data, outcome: e.target.value }))}
            >
              <MenuItem value="Interested">Interested</MenuItem>
              <MenuItem value="Not Interested">Not Interested</MenuItem>
              <MenuItem value="Converted">Converted</MenuItem>
              <MenuItem value="Follow Up">Follow Up</MenuItem>
              <MenuItem value="No Answer">No Answer</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Notes"
            multiline
            minRows={2}
            fullWidth
            value={editCallData.notes}
            onChange={e => setEditCallData(data => ({ ...data, notes: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} sx={{ color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={handleEditCallSave} sx={{ background: '#00e6ff', color: '#000', fontWeight: 700 }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)}>
        <DialogTitle>Update Lead Status</DialogTitle>
        <DialogContent>
          <Select
            value={statusUpdate}
            onChange={e => setStatusUpdate(e.target.value)}
            fullWidth
          >
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Converted">Converted</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 