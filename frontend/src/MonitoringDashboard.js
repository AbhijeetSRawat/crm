import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Badge,
  Tooltip,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  ScreenShare,
  Videocam,
  PhotoCamera,
  Security,
  AdminPanelSettings,
  SupervisorAccount,
  Person,
  Business,
  Visibility,
  VisibilityOff,
  Download,
  Delete,
  Edit,
  Save,
  Cancel,
  Warning,
  CheckCircle,
  Error,
  Schedule,
  AccessTime,
  FilterList,
  Search,
  Refresh,
  Fullscreen,
  FullscreenExit,
  Settings,
  Notifications,
  NotificationsOff,
  Block,
  Check,
  Close,
} from '@mui/icons-material';

// Mock monitoring data
const mockMonitoringData = {
  agents: [
    {
      id: 'agent1',
      name: 'Abhishek',
      email: 'abhishek@crm.com',
      role: 'agent',
      status: 'online',
      lastActivity: '2024-07-11T19:30:00Z',
      monitoringEnabled: true,
      screenshotsCount: 45,
      recordingsCount: 12,
      complianceScore: 95,
    },
    {
      id: 'agent2',
      name: 'Priya',
      email: 'priya@crm.com',
      role: 'agent',
      status: 'online',
      lastActivity: '2024-07-11T19:28:00Z',
      monitoringEnabled: true,
      screenshotsCount: 38,
      recordingsCount: 8,
      complianceScore: 88,
    },
    {
      id: 'agent3',
      name: 'Rahul',
      email: 'rahul@crm.com',
      role: 'agent',
      status: 'offline',
      lastActivity: '2024-07-11T18:45:00Z',
      monitoringEnabled: false,
      screenshotsCount: 22,
      recordingsCount: 5,
      complianceScore: 72,
    },
  ],
  screenshots: [
    {
      id: 1,
      agentId: 'agent1',
      agentName: 'Abhishek',
      timestamp: '2024-07-11T19:30:00Z',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      status: 'reviewed',
      reviewedBy: 'Supervisor 1',
      reviewedAt: '2024-07-11T19:31:00Z',
      flagged: false,
    },
    {
      id: 2,
      agentId: 'agent2',
      agentName: 'Priya',
      timestamp: '2024-07-11T19:27:00Z',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      status: 'pending',
      reviewedBy: null,
      reviewedAt: null,
      flagged: false,
    },
    {
      id: 3,
      agentId: 'agent1',
      agentName: 'Abhishek',
      timestamp: '2024-07-11T19:24:00Z',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      status: 'flagged',
      reviewedBy: 'Supervisor 1',
      reviewedAt: '2024-07-11T19:25:00Z',
      flagged: true,
    },
  ],
  recordings: [
    {
      id: 1,
      agentId: 'agent1',
      agentName: 'Abhishek',
      startTime: '2024-07-11T19:00:00Z',
      endTime: '2024-07-11T19:30:00Z',
      duration: '30:00',
      status: 'completed',
      fileSize: '45.2 MB',
      reviewed: true,
    },
    {
      id: 2,
      agentId: 'agent2',
      agentName: 'Priya',
      startTime: '2024-07-11T18:30:00Z',
      endTime: '2024-07-11T19:00:00Z',
      duration: '30:00',
      status: 'completed',
      fileSize: '42.8 MB',
      reviewed: false,
    },
  ],
  settings: {
    globalMonitoring: true,
    screenshotInterval: 3,
    enableLiveRecording: true,
    enableScreenshots: true,
    autoReview: false,
    notifications: true,
  },
};

export default function MonitoringDashboard({ userRole = 'supervisor' }) {
  const [monitoringData, setMonitoringData] = useState(mockMonitoringData);
  const [activeTab, setActiveTab] = useState(0);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showScreenshotDialog, setShowScreenshotDialog] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const isAdmin = userRole === 'admin';
  const isSupervisor = userRole === 'supervisor';

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleAgentMonitoring = (agentId) => {
    setMonitoringData(prev => ({
      ...prev,
      agents: prev.agents.map(agent =>
        agent.id === agentId
          ? { ...agent, monitoringEnabled: !agent.monitoringEnabled }
          : agent
      ),
    }));

    setAlertMessage('Agent monitoring updated');
    setAlertType('success');
    setShowAlert(true);
  };

  const reviewScreenshot = (screenshotId, status) => {
    setMonitoringData(prev => ({
      ...prev,
      screenshots: prev.screenshots.map(screenshot =>
        screenshot.id === screenshotId
          ? {
              ...screenshot,
              status: status,
              reviewedBy: 'Current User',
              reviewedAt: new Date().toISOString(),
              flagged: status === 'flagged',
            }
          : screenshot
      ),
    }));

    setAlertMessage(`Screenshot ${status}`);
    setAlertType('success');
    setShowAlert(true);
  };

  const updateSettings = (newSettings) => {
    setMonitoringData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));

    setShowSettingsDialog(false);
    setAlertMessage('Settings updated successfully');
    setAlertType('success');
    setShowAlert(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reviewed': return 'success';
      case 'pending': return 'warning';
      case 'flagged': return 'error';
      case 'online': return 'success';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const getComplianceColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const filteredScreenshots = monitoringData.screenshots.filter(screenshot => {
    const matchesSearch = screenshot.agentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || screenshot.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredAgents = monitoringData.agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Security sx={{ fontSize: 40, color: '#00e6ff' }} />
        <Box>
          <Typography variant="h4" fontWeight={900} color="#00e6ff">
            Monitoring Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {isAdmin ? 'Admin Monitoring Control' : 'Supervisor Monitoring View'}
          </Typography>
        </Box>
        <Box flex={1} />
        <Button
          variant="outlined"
          startIcon={<Settings />}
          onClick={() => setShowSettingsDialog(true)}
          sx={{ color: '#00e6ff', borderColor: '#00e6ff', fontWeight: 700, borderRadius: 2, '&:hover': { borderColor: '#00b3cc' } }}
        >
          Settings
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Agents
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="#00e6ff">
                    {monitoringData.agents.filter(a => a.status === 'online').length}
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: '#00e6ff' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Reviews
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="#ff9800">
                    {monitoringData.screenshots.filter(s => s.status === 'pending').length}
                  </Typography>
                </Box>
                <PhotoCamera sx={{ fontSize: 40, color: '#ff9800' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Live Recordings
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="#f44336">
                    {monitoringData.recordings.filter(r => r.status === 'active').length}
                  </Typography>
                </Box>
                <Videocam sx={{ fontSize: 40, color: '#f44336' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Compliance
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="#4caf50">
                    {Math.round(monitoringData.agents.reduce((acc, agent) => acc + agent.complianceScore, 0) / monitoringData.agents.length)}%
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': { color: '#666' },
            '& .Mui-selected': { color: '#00e6ff' },
            '& .MuiTabs-indicator': { backgroundColor: '#00e6ff' },
          }}
        >
          <Tab label="Agents" icon={<Person />} iconPosition="start" />
          <Tab label="Screenshots" icon={<PhotoCamera />} iconPosition="start" />
          <Tab label="Recordings" icon={<Videocam />} iconPosition="start" />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={700} color="#00e6ff">
                Agent Monitoring Status
              </Typography>
              <TextField
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    borderRadius: 2,
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#00e6ff' },
                    '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: '#666' },
                }}
              />
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Agent</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Monitoring</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Screenshots</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Recordings</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Compliance</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: '#00e6ff', color: '#000' }}>
                            {agent.name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {agent.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {agent.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={agent.status}
                          color={getStatusColor(agent.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={agent.monitoringEnabled}
                          onChange={() => toggleAgentMonitoring(agent.id)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#00e6ff',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#00e6ff',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#00e6ff">
                          {agent.screenshotsCount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#00e6ff">
                          {agent.recordingsCount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${agent.complianceScore}%`}
                          color={getComplianceColor(agent.complianceScore)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton size="small" sx={{ color: '#00e6ff' }}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {isAdmin && (
                            <Tooltip title="Edit Role">
                              <IconButton size="small" sx={{ color: '#ff9800' }}>
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={700} color="#00e6ff">
                Screenshots
              </Typography>
              <Box display="flex" gap={2}>
                <FormControl size="small">
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{
                      color: '#fff',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' },
                    }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="reviewed">Reviewed</MenuItem>
                    <MenuItem value="flagged">Flagged</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  placeholder="Search screenshots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#333' },
                      '&:hover fieldset': { borderColor: '#00e6ff' },
                      '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                    },
                    '& .MuiInputBase-input::placeholder': { color: '#666' },
                  }}
                />
              </Box>
            </Box>

            <Grid container spacing={2}>
              {filteredScreenshots.map((screenshot) => (
                <Grid item xs={12} md={4} key={screenshot.id}>
                  <Paper sx={{ background: '#222', border: '1px solid #333', borderRadius: 2, p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Avatar sx={{ bgcolor: '#00e6ff', width: 32, height: 32, fontSize: '0.8rem' }}>
                        {screenshot.agentName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="#fff">
                          {screenshot.agentName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(screenshot.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box
                      sx={{
                        width: '100%',
                        height: 150,
                        background: `url(${screenshot.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 1,
                        border: '1px solid #333',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setSelectedScreenshot(screenshot);
                        setShowScreenshotDialog(true);
                      }}
                    />
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Chip
                        label={screenshot.status}
                        color={getStatusColor(screenshot.status)}
                        size="small"
                      />
                      <Box display="flex" gap={1}>
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedScreenshot(screenshot);
                              setShowScreenshotDialog(true);
                            }}
                            sx={{ color: '#00e6ff' }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        {screenshot.status === 'pending' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                onClick={() => reviewScreenshot(screenshot.id, 'reviewed')}
                                sx={{ color: '#4caf50' }}
                              >
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Flag">
                              <IconButton
                                size="small"
                                onClick={() => reviewScreenshot(screenshot.id, 'flagged')}
                                sx={{ color: '#f44336' }}
                              >
                                <Warning />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={3}>
              Recordings
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Agent</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Start Time</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Duration</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>File Size</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Reviewed</TableCell>
                    <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monitoringData.recordings.map((recording) => (
                    <TableRow key={recording.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: '#00e6ff', color: '#000' }}>
                            {recording.agentName[0]}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>
                            {recording.agentName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(recording.startTime).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#00e6ff">
                          {recording.duration}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={recording.status}
                          color={recording.status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {recording.fileSize}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={recording.reviewed ? 'Yes' : 'No'}
                          color={recording.reviewed ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View">
                            <IconButton size="small" sx={{ color: '#00e6ff' }}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton size="small" sx={{ color: '#4caf50' }}>
                              <Download />
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
      )}

      {/* Settings Dialog */}
      <Dialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
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
        <DialogTitle sx={{ color: '#00e6ff', borderBottom: '1px solid #333', fontWeight: 700 }}>
          Monitoring Settings
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="#00e6ff" mb={2}>
                General Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={monitoringData.settings.globalMonitoring}
                    onChange={(e) => updateSettings({ globalMonitoring: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#00e6ff' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00e6ff' },
                    }}
                  />
                }
                label="Enable Global Monitoring"
                sx={{ color: '#fff' }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={monitoringData.settings.enableScreenshots}
                    onChange={(e) => updateSettings({ enableScreenshots: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#00e6ff' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00e6ff' },
                    }}
                  />
                }
                label="Enable Screenshots"
                sx={{ color: '#fff' }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={monitoringData.settings.enableLiveRecording}
                    onChange={(e) => updateSettings({ enableLiveRecording: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#00e6ff' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00e6ff' },
                    }}
                  />
                }
                label="Enable Live Recording"
                sx={{ color: '#fff' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="#00e6ff" mb={2}>
                Advanced Settings
              </Typography>
              <TextField
                label="Screenshot Interval (minutes)"
                type="number"
                value={monitoringData.settings.screenshotInterval}
                onChange={(e) => updateSettings({ screenshotInterval: parseInt(e.target.value) })}
                fullWidth
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#333' } } }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={monitoringData.settings.autoReview}
                    onChange={(e) => updateSettings({ autoReview: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#00e6ff' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00e6ff' },
                    }}
                  />
                }
                label="Auto Review Screenshots"
                sx={{ color: '#fff' }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={monitoringData.settings.notifications}
                    onChange={(e) => updateSettings({ notifications: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#00e6ff' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00e6ff' },
                    }}
                  />
                }
                label="Enable Notifications"
                sx={{ color: '#fff' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #333' }}>
          <Button onClick={() => setShowSettingsDialog(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowSettingsDialog(false)}
            sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, '&:hover': { background: '#00b3cc' } }}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Screenshot View Dialog */}
      <Dialog
        open={showScreenshotDialog}
        onClose={() => setShowScreenshotDialog(false)}
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
        <DialogTitle sx={{ color: '#00e6ff', borderBottom: '1px solid #333', fontWeight: 700 }}>
          Screenshot Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedScreenshot && (
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: '#00e6ff', color: '#000' }}>
                  {selectedScreenshot.agentName[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" color="#00e6ff" fontWeight={700}>
                    {selectedScreenshot.agentName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(selectedScreenshot.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  background: `url(${selectedScreenshot.imageUrl})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: 2,
                  border: '1px solid #333',
                  mb: 2,
                }}
              />
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Chip
                  label={selectedScreenshot.status}
                  color={getStatusColor(selectedScreenshot.status)}
                  sx={{ fontWeight: 600 }}
                />
                {selectedScreenshot.reviewedBy && (
                  <Typography variant="body2" color="textSecondary">
                    Reviewed by: {selectedScreenshot.reviewedBy}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #333' }}>
          <Button onClick={() => setShowScreenshotDialog(false)} sx={{ color: '#666' }}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, '&:hover': { background: '#00b3cc' } }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertType}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 