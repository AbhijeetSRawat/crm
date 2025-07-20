import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  LinearProgress,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Badge,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Phone,
  PhoneDisabled,
  PhoneCallback,
  Add,
  Edit,
  Delete,
  Schedule,
  Person,
  Business,
  AccessTime,
  Note,
  Warning,
  Done,
  Pending,
  PlayArrow,
  Error,
  CheckCircle,
  CallMade,
  CallReceived,
  CallMissed,
  CallEnd,
  Timer,
  LocationOn,
  Email,
  WhatsApp,
  Sms,
  Star,
  StarBorder,
  FilterList,
  Search,
  Refresh,
  Download,
  Print,
} from '@mui/icons-material';

// Mock call history data
const mockCallHistory = [
  {
    id: 1,
    leadName: 'John Smith',
    leadPhone: '+1234567890',
    leadEmail: 'john.smith@email.com',
    company: 'Acme Corporation',
    callType: 'outbound',
    callStatus: 'answered',
    callDuration: '00:05:32',
    callDurationSeconds: 332,
    callDate: '2024-07-12T14:30:00',
    callNotes: 'Discussed enterprise package pricing. Client showed interest in premium features.',
    followUpRequired: true,
    followUpDate: '2024-07-15T10:00:00',
    callOutcome: 'interested',
    callRating: 4,
    agentNotes: 'Client asked about integration options. Need to send technical specs.',
    recordingUrl: '/recordings/call_001.mp3',
    tags: ['enterprise', 'pricing', 'follow-up'],
    createdAt: '2024-07-12T14:30:00',
  },
  {
    id: 2,
    leadName: 'Sarah Johnson',
    leadPhone: '+1987654321',
    leadEmail: 'sarah.j@techcorp.com',
    company: 'TechCorp Inc',
    callType: 'inbound',
    callStatus: 'answered',
    callDuration: '00:08:15',
    callDurationSeconds: 495,
    callDate: '2024-07-12T11:15:00',
    callNotes: 'Client called about technical support. Resolved login issue.',
    followUpRequired: false,
    followUpDate: null,
    callOutcome: 'resolved',
    callRating: 5,
    agentNotes: 'Client was satisfied with the solution provided.',
    recordingUrl: '/recordings/call_002.mp3',
    tags: ['support', 'technical', 'resolved'],
    createdAt: '2024-07-12T11:15:00',
  },
  {
    id: 3,
    leadName: 'Mike Wilson',
    leadPhone: '+1555123456',
    leadEmail: 'mike.w@startup.com',
    company: 'StartupXYZ',
    callType: 'outbound',
    callStatus: 'not_answered',
    callDuration: '00:00:00',
    callDurationSeconds: 0,
    callDate: '2024-07-12T09:45:00',
    callNotes: 'Called but no answer. Left voicemail.',
    followUpRequired: true,
    followUpDate: '2024-07-13T14:00:00',
    callOutcome: 'no_answer',
    callRating: null,
    agentNotes: 'Try calling again tomorrow afternoon.',
    recordingUrl: null,
    tags: ['voicemail', 'follow-up'],
    createdAt: '2024-07-12T09:45:00',
  },
  {
    id: 4,
    leadName: 'Lisa Brown',
    leadPhone: '+1444567890',
    leadEmail: 'lisa.b@enterprise.com',
    company: 'Enterprise Solutions',
    callType: 'outbound',
    callStatus: 'answered',
    callDuration: '00:12:45',
    callDurationSeconds: 765,
    callDate: '2024-07-11T16:20:00',
    callNotes: 'Contract renewal discussion. Client wants to upgrade to premium plan.',
    followUpRequired: true,
    followUpDate: '2024-07-14T15:00:00',
    callOutcome: 'upgrade',
    callRating: 5,
    agentNotes: 'Send upgrade proposal by end of week.',
    recordingUrl: '/recordings/call_004.mp3',
    tags: ['renewal', 'upgrade', 'contract'],
    createdAt: '2024-07-11T16:20:00',
  },
  {
    id: 5,
    leadName: 'David Lee',
    leadPhone: '+1333567890',
    leadEmail: 'david.lee@consulting.com',
    company: 'Consulting Partners',
    callType: 'inbound',
    callStatus: 'answered',
    callDuration: '00:06:30',
    callDurationSeconds: 390,
    callDate: '2024-07-11T13:10:00',
    callNotes: 'Client inquired about consulting services. Scheduled demo for next week.',
    followUpRequired: true,
    followUpDate: '2024-07-18T10:00:00',
    callOutcome: 'demo_scheduled',
    callRating: 4,
    agentNotes: 'Prepare demo presentation for consulting services.',
    recordingUrl: '/recordings/call_005.mp3',
    tags: ['consulting', 'demo', 'scheduled'],
    createdAt: '2024-07-11T13:10:00',
  },
  {
    id: 6,
    leadName: 'Emma Davis',
    leadPhone: '+1222567890',
    leadEmail: 'emma.d@retail.com',
    company: 'Retail Solutions',
    callType: 'outbound',
    callStatus: 'busy',
    callDuration: '00:00:15',
    callDurationSeconds: 15,
    callDate: '2024-07-11T10:30:00',
    callNotes: 'Line was busy. Will try again later.',
    followUpRequired: true,
    followUpDate: '2024-07-12T11:00:00',
    callOutcome: 'busy',
    callRating: null,
    agentNotes: 'Client was on another call. Schedule retry.',
    recordingUrl: null,
    tags: ['busy', 'retry'],
    createdAt: '2024-07-11T10:30:00',
  },
];

const callOutcomes = [
  { value: 'interested', label: 'Interested', color: '#4caf50' },
  { value: 'not_interested', label: 'Not Interested', color: '#f44336' },
  { value: 'resolved', label: 'Resolved', color: '#2196f3' },
  { value: 'upgrade', label: 'Upgrade', color: '#ff9800' },
  { value: 'demo_scheduled', label: 'Demo Scheduled', color: '#9c27b0' },
  { value: 'no_answer', label: 'No Answer', color: '#666' },
  { value: 'busy', label: 'Busy', color: '#ff5722' },
  { value: 'wrong_number', label: 'Wrong Number', color: '#795548' },
];

const callTypes = [
  { value: 'inbound', label: 'Inbound', icon: <CallReceived />, color: '#4caf50' },
  { value: 'outbound', label: 'Outbound', icon: <CallMade />, color: '#2196f3' },
  { value: 'missed', label: 'Missed', icon: <CallMissed />, color: '#f44336' },
];

export default function AgentCallHistory() {
  const [callHistory, setCallHistory] = useState(mockCallHistory);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedCall, setSelectedCall] = useState(null);
  const [callDialog, setCallDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [callData, setCallData] = useState({
    leadName: '',
    leadPhone: '',
    leadEmail: '',
    company: '',
    callType: 'outbound',
    callStatus: 'answered',
    callDuration: '00:00:00',
    callNotes: '',
    followUpRequired: false,
    followUpDate: '',
    callOutcome: '',
    callRating: null,
    agentNotes: '',
    tags: [],
  });

  const filteredCallHistory = callHistory.filter(call => {
    const matchesTab = selectedTab === 'all' || call.callStatus === selectedTab;
    const matchesSearch = searchTerm === '' || 
      call.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.leadPhone.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  const callStats = {
    total: callHistory.length,
    answered: callHistory.filter(c => c.callStatus === 'answered').length,
    notAnswered: callHistory.filter(c => c.callStatus === 'not_answered').length,
    missed: callHistory.filter(c => c.callStatus === 'missed').length,
    averageDuration: Math.round(callHistory.reduce((acc, call) => acc + call.callDurationSeconds, 0) / callHistory.length / 60),
    totalDuration: Math.round(callHistory.reduce((acc, call) => acc + call.callDurationSeconds, 0) / 60),
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddCall = () => {
    setIsEdit(false);
    setCallData({
      leadName: '',
      leadPhone: '',
      leadEmail: '',
      company: '',
      callType: 'outbound',
      callStatus: 'answered',
      callDuration: '00:00:00',
      callNotes: '',
      followUpRequired: false,
      followUpDate: '',
      callOutcome: '',
      callRating: null,
      agentNotes: '',
      tags: [],
    });
    setCallDialog(true);
  };

  const handleEditCall = (call) => {
    setIsEdit(true);
    setSelectedCall(call);
    setCallData({
      leadName: call.leadName,
      leadPhone: call.leadPhone,
      leadEmail: call.leadEmail,
      company: call.company,
      callType: call.callType,
      callStatus: call.callStatus,
      callDuration: call.callDuration,
      callNotes: call.callNotes,
      followUpRequired: call.followUpRequired,
      followUpDate: call.followUpDate,
      callOutcome: call.callOutcome,
      callRating: call.callRating,
      agentNotes: call.agentNotes,
      tags: call.tags,
    });
    setCallDialog(true);
  };

  const handleSaveCall = () => {
    if (isEdit) {
      setCallHistory(prev => prev.map(c => 
        c.id === selectedCall.id ? { ...c, ...callData } : c
      ));
      setSnackbarMessage('Call updated successfully!');
    } else {
      const newCall = {
        id: Date.now(),
        ...callData,
        callDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        recordingUrl: null,
      };
      setCallHistory(prev => [...prev, newCall]);
      setSnackbarMessage('Call logged successfully!');
    }
    setSnackbarType('success');
    setShowSnackbar(true);
    setCallDialog(false);
  };

  const handleDeleteCall = (id) => {
    setCallHistory(prev => prev.filter(c => c.id !== id));
    setSnackbarMessage('Call deleted successfully!');
    setSnackbarType('success');
    setShowSnackbar(true);
  };

  const handleUpdateCallStatus = (callId, newStatus) => {
    setCallHistory(prev => prev.map(c => 
      c.id === callId ? { ...c, callStatus: newStatus } : c
    ));
    setSnackbarMessage('Call status updated!');
    setSnackbarType('success');
    setShowSnackbar(true);
  };

  const getCallStatusIcon = (status) => {
    switch (status) {
      case 'answered': return <CheckCircle />;
      case 'not_answered': return <PhoneDisabled />;
      case 'missed': return <CallMissed />;
      case 'busy': return <PhoneCallback />;
      default: return <Phone />;
    }
  };

  const getCallStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'success';
      case 'not_answered': return 'error';
      case 'missed': return 'warning';
      case 'busy': return 'info';
      default: return 'default';
    }
  };

  const getCallTypeIcon = (type) => {
    const callType = callTypes.find(t => t.value === type);
    return callType ? callType.icon : <Phone />;
  };

  const getCallTypeColor = (type) => {
    const callType = callTypes.find(t => t.value === type);
    return callType ? callType.color : '#666';
  };

  const getCallOutcomeColor = (outcome) => {
    const outcomeData = callOutcomes.find(o => o.value === outcome);
    return outcomeData ? outcomeData.color : '#666';
  };

  const formatDuration = (duration) => {
    if (!duration) return '00:00:00';
    const seconds = parseInt(duration);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Phone sx={{ fontSize: 40, color: '#00e6ff' }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Call History
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Track and manage all your call interactions
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            sx={{ borderColor: '#00e6ff', color: '#00e6ff' }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddCall}
            sx={{ backgroundColor: '#00e6ff', color: '#000' }}
          >
            Log Call
          </Button>
        </Box>
      </Box>

      {/* Call Statistics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Calls
              </Typography>
              <Typography variant="h4" fontWeight={900} color="primary.main">
                {callStats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Answered
              </Typography>
              <Typography variant="h4" fontWeight={900} color="success.main">
                {callStats.answered}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Duration
              </Typography>
              <Typography variant="h4" fontWeight={900} color="info.main">
                {callStats.averageDuration}m
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Time
              </Typography>
              <Typography variant="h4" fontWeight={900} color="warning.main">
                {callStats.totalDuration}m
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by name, company, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: '#666', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#00e6ff' },
                    '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  sx={{ borderColor: '#00e6ff', color: '#00e6ff' }}
                >
                  Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  sx={{ borderColor: '#00e6ff', color: '#00e6ff' }}
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: '#fff',
                '&.Mui-selected': { color: '#00e6ff' },
              },
              '& .MuiTabs-indicator': { backgroundColor: '#00e6ff' },
            }}
          >
            <Tab
              value="all"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone />
                  All Calls
                  <Badge badgeContent={callStats.total} color="primary" />
                </Box>
              }
            />
            <Tab
              value="answered"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle />
                  Answered
                  <Badge badgeContent={callStats.answered} color="success" />
                </Box>
              }
            />
            <Tab
              value="not_answered"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <PhoneDisabled />
                  Not Answered
                  <Badge badgeContent={callStats.notAnswered} color="error" />
                </Box>
              }
            />
            <Tab
              value="missed"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <CallMissed />
                  Missed
                  <Badge badgeContent={callStats.missed} color="warning" />
                </Box>
              }
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* Call History Table */}
      <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ background: '#181818', color: '#fff' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#222' }}>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Lead</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Duration</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Outcome</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Rating</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCallHistory.map((call) => (
                  <TableRow key={call.id} sx={{ '&:hover': { background: '#222' } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="#fff">
                          {call.leadName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {call.company}
                        </Typography>
                        <Typography variant="caption" display="block" color="textSecondary">
                          {call.leadPhone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getCallTypeIcon(call.callType)}
                        label={call.callType}
                        size="small"
                        sx={{ 
                          backgroundColor: getCallTypeColor(call.callType),
                          color: '#fff'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getCallStatusIcon(call.callStatus)}
                        label={call.callStatus.replace('_', ' ')}
                        size="small"
                        color={getCallStatusColor(call.callStatus)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Timer sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2">
                          {call.callDuration}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(call.callDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {call.callOutcome && (
                        <Chip
                          label={callOutcomes.find(o => o.value === call.callOutcome)?.label}
                          size="small"
                          sx={{ 
                            backgroundColor: getCallOutcomeColor(call.callOutcome),
                            color: '#fff'
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {call.callRating ? (
                          Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              sx={{ 
                                fontSize: 16, 
                                color: i < call.callRating ? '#ffd700' : '#666' 
                              }}
                            />
                          ))
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            No rating
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Update Status">
                          <IconButton
                            size="small"
                            onClick={() => handleEditCall(call)}
                            sx={{ color: '#00e6ff' }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleEditCall(call)}
                            sx={{ color: '#4caf50' }}
                          >
                            <Note />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCall(call.id)}
                            sx={{ color: '#f44336' }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Call Dialog */}
      <Dialog
        open={callDialog}
        onClose={() => setCallDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#00e6ff' }}>
          {isEdit ? 'Update Call Details' : 'Log New Call'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Lead Name"
                fullWidth
                value={callData.leadName}
                onChange={(e) => setCallData({ ...callData, leadName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Company"
                fullWidth
                value={callData.company}
                onChange={(e) => setCallData({ ...callData, company: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={callData.leadPhone}
                onChange={(e) => setCallData({ ...callData, leadPhone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={callData.leadEmail}
                onChange={(e) => setCallData({ ...callData, leadEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Call Type</InputLabel>
                <Select
                  value={callData.callType}
                  label="Call Type"
                  onChange={(e) => setCallData({ ...callData, callType: e.target.value })}
                >
                  {callTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {type.icon}
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Call Status</InputLabel>
                <Select
                  value={callData.callStatus}
                  label="Call Status"
                  onChange={(e) => setCallData({ ...callData, callStatus: e.target.value })}
                >
                  <MenuItem value="answered">Answered</MenuItem>
                  <MenuItem value="not_answered">Not Answered</MenuItem>
                  <MenuItem value="missed">Missed</MenuItem>
                  <MenuItem value="busy">Busy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Call Duration (HH:MM:SS)"
                fullWidth
                value={callData.callDuration}
                onChange={(e) => setCallData({ ...callData, callDuration: e.target.value })}
                placeholder="00:05:30"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Call Outcome</InputLabel>
                <Select
                  value={callData.callOutcome}
                  label="Call Outcome"
                  onChange={(e) => setCallData({ ...callData, callOutcome: e.target.value })}
                >
                  {callOutcomes.map((outcome) => (
                    <MenuItem key={outcome.value} value={outcome.value}>
                      {outcome.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Call Notes"
                multiline
                rows={3}
                fullWidth
                value={callData.callNotes}
                onChange={(e) => setCallData({ ...callData, callNotes: e.target.value })}
                placeholder="Brief summary of the call..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Agent Notes"
                multiline
                rows={2}
                fullWidth
                value={callData.agentNotes}
                onChange={(e) => setCallData({ ...callData, agentNotes: e.target.value })}
                placeholder="Internal notes and follow-up actions..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={callData.followUpRequired}
                    onChange={(e) => setCallData({ ...callData, followUpRequired: e.target.checked })}
                    color="primary"
                  />
                }
                label="Follow-up Required"
              />
            </Grid>
            {callData.followUpRequired && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Follow-up Date"
                  type="datetime-local"
                  fullWidth
                  value={callData.followUpDate}
                  onChange={(e) => setCallData({ ...callData, followUpDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveCall}
            disabled={!callData.leadName || !callData.leadPhone}
          >
            {isEdit ? 'Update Call' : 'Log Call'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarType}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 