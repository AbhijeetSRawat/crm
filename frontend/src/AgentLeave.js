import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  Avatar,
  InputAdornment,
} from '@mui/material';
import {
  Event,
  Add,
  CheckCircle,
  Pending,
  Cancel,
  Info,
  Edit,
  Person,
  Work,
  Home,
  LocalHospital,
  BeachAccess,
  AttachFile,
} from '@mui/icons-material';

// Mock leave data
const mockLeaveData = {
  agent: {
    id: 1,
    name: "Abhishek",
    employeeId: "EMP001",
    department: "Sales",
  },
  
  leaveBalance: {
    casual: { total: 12, used: 3, remaining: 9 },
    sick: { total: 15, used: 2, remaining: 13 },
    annual: { total: 21, used: 8, remaining: 13 },
    maternity: { total: 180, used: 0, remaining: 180 },
    paternity: { total: 15, used: 0, remaining: 15 },
    unpaid: { total: 30, used: 0, remaining: 30 },
  },

  leaveTypes: [
    { id: 'casual', name: 'Casual Leave', icon: <Home />, color: '#4caf50', maxDays: 12 },
    { id: 'sick', name: 'Sick Leave', icon: <LocalHospital />, color: '#f44336', maxDays: 15 },
    { id: 'annual', name: 'Annual Leave', icon: <BeachAccess />, color: '#2196f3', maxDays: 21 },
    { id: 'maternity', name: 'Maternity Leave', icon: <Person />, color: '#9c27b0', maxDays: 180 },
    { id: 'paternity', name: 'Paternity Leave', icon: <Person />, color: '#ff9800', maxDays: 15 },
    { id: 'unpaid', name: 'Unpaid Leave', icon: <Work />, color: '#666', maxDays: 30 },
  ],

  leaveHistory: [
    {
      id: 1,
      type: 'annual',
      startDate: '2024-06-15',
      endDate: '2024-06-20',
      days: 6,
      reason: 'Family vacation',
      status: 'approved',
      appliedDate: '2024-05-20',
      approvedBy: 'John Manager',
      approvedDate: '2024-05-22',
      comments: 'Approved. Enjoy your vacation!',
    },
    {
      id: 2,
      type: 'sick',
      startDate: '2024-05-10',
      endDate: '2024-05-12',
      days: 3,
      reason: 'Fever and cold',
      status: 'approved',
      appliedDate: '2024-05-09',
      approvedBy: 'John Manager',
      approvedDate: '2024-05-09',
      comments: 'Get well soon!',
    },
    {
      id: 3,
      type: 'casual',
      startDate: '2024-07-25',
      endDate: '2024-07-25',
      days: 1,
      reason: 'Personal work',
      status: 'pending',
      appliedDate: '2024-07-15',
      approvedBy: null,
      approvedDate: null,
      comments: null,
    },
    {
      id: 4,
      type: 'annual',
      startDate: '2024-08-05',
      endDate: '2024-08-09',
      days: 5,
      reason: 'Wedding ceremony',
      status: 'rejected',
      appliedDate: '2024-07-10',
      approvedBy: 'John Manager',
      approvedDate: '2024-07-12',
      comments: 'Rejected due to high workload during this period.',
    },
  ],

  upcomingLeaves: [
    {
      id: 3,
      type: 'casual',
      startDate: '2024-07-25',
      endDate: '2024-07-25',
      days: 1,
      reason: 'Personal work',
      status: 'pending',
    },
  ],

  teamLeaves: [
    {
      id: 1,
      name: 'Priya Singh',
      type: 'annual',
      startDate: '2024-07-20',
      endDate: '2024-07-25',
      days: 6,
      status: 'approved',
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      type: 'sick',
      startDate: '2024-07-18',
      endDate: '2024-07-19',
      days: 2,
      status: 'approved',
    },
  ],
};

export default function AgentLeave() {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showLeaveDetails, setShowLeaveDetails] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaveForm, setLeaveForm] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    comments: '',
    attachment: null,
  });
  const [activeTab, setActiveTab] = useState(0);

  const handleLeaveSubmit = () => {
    // In real app, this would submit to backend
    alert('Leave application submitted successfully!');
    setShowLeaveDialog(false);
    setLeaveForm({
      type: '',
      startDate: '',
      endDate: '',
      reason: '',
      comments: '',
      attachment: null,
    });
  };

  const handleLeaveDetails = (leave) => {
    setSelectedLeave(leave);
    setShowLeaveDetails(true);
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'rejected': return <Cancel />;
      default: return <Info />;
    }
  };

  const getLeaveTypeColor = (type) => {
    const leaveType = mockLeaveData.leaveTypes.find(lt => lt.id === type);
    return leaveType ? leaveType.color : '#666';
  };

  const getLeaveTypeIcon = (type) => {
    const leaveType = mockLeaveData.leaveTypes.find(lt => lt.id === type);
    return leaveType ? leaveType.icon : <Event />;
  };

  const getLeaveTypeName = (type) => {
    const leaveType = mockLeaveData.leaveTypes.find(lt => lt.id === type);
    return leaveType ? leaveType.name : 'Unknown';
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Event sx={{ fontSize: 40, color: '#00e6ff' }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Leave Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Apply for leave and track your leave balance
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowLeaveDialog(true)}
          sx={{ backgroundColor: '#00e6ff', color: '#000' }}
        >
          Apply for Leave
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Leave Balance */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
            color: '#fff', 
            border: '1px solid #333',
            boxShadow: '0 8px 32px rgba(0, 230, 255, 0.1)',
            borderRadius: 3,
          }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={3} color="#00e6ff">
                Leave Balance
              </Typography>
              
              {Object.entries(mockLeaveData.leaveBalance).map(([type, balance]) => {
                const leaveType = mockLeaveData.leaveTypes.find(lt => lt.id === type);
                const percentage = (balance.used / balance.total) * 100;
                
                return (
                  <Box key={type} mb={3}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Box sx={{ color: leaveType?.color }}>
                        {leaveType?.icon}
                      </Box>
                      <Typography variant="body1" fontWeight={600}>
                        {leaveType?.name}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        {balance.remaining} days remaining
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {balance.used}/{balance.total} used
                      </Typography>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        backgroundColor: '#333',
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: leaveType?.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
            color: '#fff', 
            border: '1px solid #333',
            mt: 2,
            borderRadius: 3,
          }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2} color="#00e6ff">
                Quick Stats
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Total Leave Days</Typography>
                  <Typography variant="body2" fontWeight={600} color="#00e6ff">
                    {Object.values(mockLeaveData.leaveBalance).reduce((sum, balance) => sum + balance.total, 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Days Used</Typography>
                  <Typography variant="body2" fontWeight={600} color="#00e6ff">
                    {Object.values(mockLeaveData.leaveBalance).reduce((sum, balance) => sum + balance.used, 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Pending Requests</Typography>
                  <Typography variant="body2" fontWeight={600} color="#00e6ff">
                    {mockLeaveData.leaveHistory.filter(leave => leave.status === 'pending').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
            color: '#fff', 
            border: '1px solid #333',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ borderBottom: 1, borderColor: '#333' }}>
                <Box sx={{ display: 'flex' }}>
                  <Button
                    variant={activeTab === 0 ? 'contained' : 'text'}
                    onClick={() => setActiveTab(0)}
                    sx={{
                      color: activeTab === 0 ? '#000' : '#666',
                      backgroundColor: activeTab === 0 ? '#00e6ff' : 'transparent',
                      '&:hover': { backgroundColor: activeTab === 0 ? '#00b3cc' : '#00e6ff11' },
                    }}
                  >
                    Leave History
                  </Button>
                  <Button
                    variant={activeTab === 1 ? 'contained' : 'text'}
                    onClick={() => setActiveTab(1)}
                    sx={{
                      color: activeTab === 1 ? '#000' : '#666',
                      backgroundColor: activeTab === 1 ? '#00e6ff' : 'transparent',
                      '&:hover': { backgroundColor: activeTab === 1 ? '#00b3cc' : '#00e6ff11' },
                    }}
                  >
                    Team Leaves
                  </Button>
                </Box>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* Leave History Tab */}
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} mb={3} color="#00e6ff">
                      Your Leave History
                    </Typography>
                    
                    <List>
                      {mockLeaveData.leaveHistory.map((leave) => (
                        <ListItem
                          key={leave.id}
                          sx={{
                            border: '1px solid #333',
                            borderRadius: 2,
                            mb: 2,
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: '#00e6ff',
                              backgroundColor: '#00e6ff11',
                            },
                          }}
                          onClick={() => handleLeaveDetails(leave)}
                        >
                          <ListItemIcon>
                            <Box sx={{ color: getLeaveTypeColor(leave.type) }}>
                              {getLeaveTypeIcon(leave.type)}
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={2}>
                                <Typography variant="body1" fontWeight={600}>
                                  {getLeaveTypeName(leave.type)}
                                </Typography>
                                <Chip
                                  label={leave.status}
                                  size="small"
                                  color={getStatusColor(leave.status)}
                                  icon={getStatusIcon(leave.status)}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="textSecondary">
                                  {leave.startDate} to {leave.endDate} ({leave.days} days)
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Reason: {leave.reason}
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Typography variant="caption" color="textSecondary">
                              Applied: {leave.appliedDate}
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Team Leaves Tab */}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} mb={3} color="#00e6ff">
                      Team Leave Calendar
                    </Typography>
                    
                    <List>
                      {mockLeaveData.teamLeaves.map((leave) => (
                        <ListItem
                          key={leave.id}
                          sx={{
                            border: '1px solid #333',
                            borderRadius: 2,
                            mb: 2,
                          }}
                        >
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: getLeaveTypeColor(leave.type), width: 32, height: 32 }}>
                              {leave.name.charAt(0)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={2}>
                                <Typography variant="body1" fontWeight={600}>
                                  {leave.name}
                                </Typography>
                                <Chip
                                  label={leave.status}
                                  size="small"
                                  color={getStatusColor(leave.status)}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="textSecondary">
                                  {getLeaveTypeName(leave.type)} • {leave.startDate} to {leave.endDate} ({leave.days} days)
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Apply Leave Dialog */}
      <Dialog
        open={showLeaveDialog}
        onClose={() => setShowLeaveDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#00e6ff' }}>
          Apply for Leave
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={leaveForm.type}
                  label="Leave Type"
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                >
                  {mockLeaveData.leaveTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box sx={{ color: type.color }}>{type.icon}</Box>
                        <Typography>{type.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Days"
                value={leaveForm.type ? calculateDays(leaveForm.startDate, leaveForm.endDate) : ''}
                disabled
                InputProps={{
                  endAdornment: <InputAdornment position="end">days</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={leaveForm.endDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Leave"
                multiline
                rows={3}
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                placeholder="Please provide a detailed reason for your leave request..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Comments"
                multiline
                rows={2}
                value={leaveForm.comments}
                onChange={(e) => setLeaveForm({ ...leaveForm, comments: e.target.value })}
                placeholder="Any additional information..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<AttachFile />}
                component="label"
              >
                Attach Document
                <input type="file" hidden />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLeaveDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleLeaveSubmit}
            disabled={!leaveForm.type || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason}
            sx={{ backgroundColor: '#00e6ff', color: '#000' }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave Details Dialog */}
      <Dialog
        open={showLeaveDetails}
        onClose={() => setShowLeaveDetails(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            color: '#fff',
            borderRadius: 3,
            border: '1px solid #333',
          }
        }}
      >
        {selectedLeave && (
          <>
            <DialogTitle sx={{ 
              color: '#00e6ff',
              borderBottom: '1px solid #333',
              background: 'linear-gradient(90deg, #00e6ff11 0%, transparent 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}>
              <Box sx={{ color: getLeaveTypeColor(selectedLeave.type) }}>
                {getLeaveTypeIcon(selectedLeave.type)}
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Leave Details
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {getLeaveTypeName(selectedLeave.type)} • {selectedLeave.days} days
                </Typography>
              </Box>
              <Chip
                label={selectedLeave.status}
                size="small"
                color={getStatusColor(selectedLeave.status)}
                icon={getStatusIcon(selectedLeave.status)}
                sx={{ ml: 'auto', fontWeight: 600 }}
              />
            </DialogTitle>
            
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Leave Information Card */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    background: '#222', 
                    border: '1px solid #333',
                    borderRadius: 2,
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={3} color="#00e6ff">
                        Leave Information
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="textSecondary">Type:</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={{ color: getLeaveTypeColor(selectedLeave.type) }}>
                              {getLeaveTypeIcon(selectedLeave.type)}
                            </Box>
                            <Typography variant="body2" fontWeight={600} color="#fff">
                              {getLeaveTypeName(selectedLeave.type)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="textSecondary">Duration:</Typography>
                          <Typography variant="body2" fontWeight={600} color="#00e6ff">
                            {selectedLeave.days} days
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="textSecondary">From:</Typography>
                          <Typography variant="body2" fontWeight={600} color="#fff">
                            {new Date(selectedLeave.startDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="textSecondary">To:</Typography>
                          <Typography variant="body2" fontWeight={600} color="#fff">
                            {new Date(selectedLeave.endDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="textSecondary">Status:</Typography>
                          <Chip
                            label={selectedLeave.status}
                            size="small"
                            color={getStatusColor(selectedLeave.status)}
                            icon={getStatusIcon(selectedLeave.status)}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Approval Details Card */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    background: '#222', 
                    border: '1px solid #333',
                    borderRadius: 2,
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={3} color="#00e6ff">
                        Approval Details
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="textSecondary">Applied:</Typography>
                          <Typography variant="body2" fontWeight={600} color="#fff">
                            {new Date(selectedLeave.appliedDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                        {selectedLeave.approvedBy && (
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="textSecondary">Approved By:</Typography>
                            <Typography variant="body2" fontWeight={600} color="#fff">
                              {selectedLeave.approvedBy}
                            </Typography>
                          </Box>
                        )}
                        {selectedLeave.approvedDate && (
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="textSecondary">Approved On:</Typography>
                            <Typography variant="body2" fontWeight={600} color="#fff">
                              {new Date(selectedLeave.approvedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        )}
                        {selectedLeave.status === 'pending' && (
                          <Box sx={{ 
                            mt: 2, 
                            p: 2, 
                            backgroundColor: '#ff980022', 
                            borderRadius: 2,
                            border: '1px solid #ff9800',
                          }}>
                            <Typography variant="body2" color="#ff9800" fontWeight={600}>
                              ⏳ Pending Approval
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Your leave request is under review by your manager
                            </Typography>
                          </Box>
                        )}
                        {selectedLeave.status === 'approved' && (
                          <Box sx={{ 
                            mt: 2, 
                            p: 2, 
                            backgroundColor: '#4caf5022', 
                            borderRadius: 2,
                            border: '1px solid #4caf50',
                          }}>
                            <Typography variant="body2" color="#4caf50" fontWeight={600}>
                              ✅ Approved
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Your leave request has been approved
                            </Typography>
                          </Box>
                        )}
                        {selectedLeave.status === 'rejected' && (
                          <Box sx={{ 
                            mt: 2, 
                            p: 2, 
                            backgroundColor: '#f4433622', 
                            borderRadius: 2,
                            border: '1px solid #f44336',
                          }}>
                            <Typography variant="body2" color="#f44336" fontWeight={600}>
                              ❌ Rejected
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Your leave request has been rejected
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Reason Card */}
                <Grid item xs={12}>
                  <Card sx={{ 
                    background: '#222', 
                    border: '1px solid #333',
                    borderRadius: 2,
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={2} color="#00e6ff">
                        Reason for Leave
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.6,
                        backgroundColor: '#333',
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid #444',
                      }}>
                        {selectedLeave.reason}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Comments Card */}
                {selectedLeave.comments && (
                  <Grid item xs={12}>
                    <Card sx={{ 
                      background: '#222', 
                      border: '1px solid #333',
                      borderRadius: 2,
                    }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} mb={2} color="#00e6ff">
                          Manager Comments
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          lineHeight: 1.6,
                          backgroundColor: '#333',
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid #444',
                          fontStyle: 'italic',
                        }}>
                          "{selectedLeave.comments}"
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ 
              p: 3, 
              borderTop: '1px solid #333',
              background: 'linear-gradient(90deg, #00e6ff11 0%, transparent 100%)',
            }}>
              <Button 
                onClick={() => setShowLeaveDetails(false)}
                sx={{ 
                  color: '#666',
                  '&:hover': { backgroundColor: '#333' },
                }}
              >
                Close
              </Button>
              {selectedLeave.status === 'pending' && (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  sx={{ 
                    borderColor: '#00e6ff', 
                    color: '#00e6ff',
                    '&:hover': { 
                      backgroundColor: '#00e6ff22',
                      borderColor: '#00b3cc',
                    },
                  }}
                >
                  Edit Request
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<Event />}
                sx={{ 
                  backgroundColor: '#00e6ff', 
                  color: '#000',
                  '&:hover': { backgroundColor: '#00b3cc' },
                }}
              >
                Download PDF
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 