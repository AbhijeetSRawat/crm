import React, { useState, useEffect, useRef } from 'react';
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
  Alert,
  Snackbar,
  CircularProgress,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  ScreenShare,
  Videocam,
  VideocamOff,
  PhotoCamera,
  Stop,
  PlayArrow,
  Pause,
  Download,
  Visibility,
  VisibilityOff,
  Security,
  Warning,
  CheckCircle,
  Error,
  Schedule,
  AccessTime,
  Person,
  Business,
  AdminPanelSettings,
  SupervisorAccount,
  RecordVoiceOver,
  ScreenRotation,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';

// Mock monitoring data
const mockMonitoringData = {
  isActive: true,
  lastScreenshot: '2024-07-11T19:30:00Z',
  nextScreenshot: '2024-07-11T19:33:00Z',
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
    },
  ],
  liveRecordings: [
    {
      id: 1,
      agentId: 'agent1',
      agentName: 'Abhishek',
      startTime: '2024-07-11T19:00:00Z',
      endTime: null,
      isActive: true,
      duration: '30:00',
    },
  ],
  settings: {
    screenshotInterval: 3, // minutes
    enableLiveRecording: true,
    enableScreenshots: true,
    autoReview: false,
  },
};

export default function ScreenMonitoring({ userRole = 'agent' }) {
  const [monitoringData, setMonitoringData] = useState(mockMonitoringData);
  const [isRecording, setIsRecording] = useState(false);
  const [showScreenshotDialog, setShowScreenshotDialog] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const [timeUntilNextScreenshot, setTimeUntilNextScreenshot] = useState(180); // 3 minutes in seconds
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Check if user has monitoring permissions
  const hasMonitoringAccess = ['admin', 'supervisor', 'senior'].includes(userRole);
  const canViewRecordings = ['admin', 'supervisor'].includes(userRole);
  const canAssignRoles = userRole === 'admin';

  useEffect(() => {
    if (monitoringData.isActive && monitoringData.settings.enableScreenshots) {
      const timer = setInterval(() => {
        setTimeUntilNextScreenshot(prev => {
          if (prev <= 1) {
            takeScreenshot();
            return 180; // Reset to 3 minutes
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [monitoringData.isActive, monitoringData.settings.enableScreenshots]);

  const takeScreenshot = async () => {
    try {
      // In a real implementation, this would capture the actual screen
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      
      // Simulate screenshot capture
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#333';
      ctx.font = '16px Arial';
      ctx.fillText('Screenshot captured at ' + new Date().toLocaleTimeString(), 20, 40);
      
      const imageUrl = canvas.toDataURL('image/png');
      
      const newScreenshot = {
        id: Date.now(),
        agentId: 'currentAgent',
        agentName: 'Current Agent',
        timestamp: new Date().toISOString(),
        imageUrl: imageUrl,
        status: 'pending',
        reviewedBy: null,
        reviewedAt: null,
      };

      setMonitoringData(prev => ({
        ...prev,
        screenshots: [newScreenshot, ...prev.screenshots],
        lastScreenshot: new Date().toISOString(),
        nextScreenshot: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
      }));

      setAlertMessage('Screenshot captured successfully');
      setAlertType('success');
      setShowAlert(true);
    } catch (error) {
      console.error('Error taking screenshot:', error);
      setAlertMessage('Failed to capture screenshot');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: false,
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsRecording(true);
      setMonitoringData(prev => ({
        ...prev,
        liveRecordings: [
          {
            id: Date.now(),
            agentId: 'currentAgent',
            agentName: 'Current Agent',
            startTime: new Date().toISOString(),
            endTime: null,
            isActive: true,
            duration: '00:00',
          },
          ...prev.liveRecordings,
        ],
      }));

      setAlertMessage('Screen recording started');
      setAlertType('success');
      setShowAlert(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setAlertMessage('Failed to start recording');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
    setMonitoringData(prev => ({
      ...prev,
      liveRecordings: prev.liveRecordings.map(recording =>
        recording.isActive
          ? { ...recording, isActive: false, endTime: new Date().toISOString() }
          : recording
      ),
    }));

    setAlertMessage('Screen recording stopped');
    setAlertType('info');
    setShowAlert(true);
  };

  const toggleMonitoring = () => {
    setMonitoringData(prev => ({
      ...prev,
      isActive: !prev.isActive,
    }));

    setAlertMessage(
      monitoringData.isActive ? 'Monitoring disabled' : 'Monitoring enabled'
    );
    setAlertType('info');
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
              reviewedBy: 'Current Supervisor',
              reviewedAt: new Date().toISOString(),
            }
          : screenshot
      ),
    }));

    setAlertMessage(`Screenshot ${status}`);
    setAlertType('success');
    setShowAlert(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reviewed': return 'success';
      case 'pending': return 'warning';
      case 'flagged': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <ScreenShare sx={{ fontSize: 40, color: '#00e6ff' }} />
        <Box>
          <Typography variant="h4" fontWeight={900} color="#00e6ff">
            Screen Monitoring
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {hasMonitoringAccess ? 'Monitor agent activities' : 'Your screen is being monitored'}
          </Typography>
        </Box>
        <Box flex={1} />
        {hasMonitoringAccess && (
          <Button
            variant="contained"
            startIcon={monitoringData.isActive ? <Visibility /> : <VisibilityOff />}
            onClick={toggleMonitoring}
            sx={{
              background: monitoringData.isActive ? '#4caf50' : '#f44336',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              '&:hover': {
                background: monitoringData.isActive ? '#45a049' : '#d32f2f',
              },
            }}
          >
            {monitoringData.isActive ? 'Monitoring Active' : 'Monitoring Disabled'}
          </Button>
        )}
      </Box>

      {/* Monitoring Status */}
      {!hasMonitoringAccess && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Your screen is being monitored for quality assurance. Screenshots are taken every 3 minutes.
          </Typography>
        </Alert>
      )}

      {/* Countdown Timer */}
      {monitoringData.isActive && monitoringData.settings.enableScreenshots && (
        <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <PhotoCamera sx={{ color: '#00e6ff' }} />
                <Typography variant="h6" color="#00e6ff" fontWeight={700}>
                  Next Screenshot
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={900} color="#00e6ff">
                {formatTime(timeUntilNextScreenshot)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Control Panel for Supervisors */}
      {hasMonitoringAccess && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={2}>
                  Screenshot Controls
                </Typography>
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<PhotoCamera />}
                    onClick={takeScreenshot}
                    sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, '&:hover': { background: '#00b3cc' } }}
                  >
                    Take Screenshot
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Schedule />}
                    sx={{ color: '#00e6ff', borderColor: '#00e6ff', '&:hover': { borderColor: '#00b3cc' } }}
                  >
                    {monitoringData.settings.screenshotInterval} min interval
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {canViewRecordings && (
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={2}>
                    Live Recording
                  </Typography>
                  <Box display="flex" gap={2}>
                    {!isRecording ? (
                      <Button
                        variant="contained"
                        startIcon={<Videocam />}
                        onClick={startRecording}
                        sx={{ background: '#f44336', color: '#fff', fontWeight: 700, '&:hover': { background: '#d32f2f' } }}
                      >
                        Start Recording
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<Stop />}
                        onClick={stopRecording}
                        sx={{ background: '#ff9800', color: '#fff', fontWeight: 700, '&:hover': { background: '#f57c00' } }}
                      >
                        Stop Recording
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Live Recording Video */}
      {isRecording && (
        <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={2}>
              Live Screen Recording
            </Typography>
            <Box sx={{ position: 'relative', background: '#000', borderRadius: 2, overflow: 'hidden' }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                style={{ width: '100%', height: '300px', objectFit: 'contain' }}
              />
              <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                <Chip
                  label="LIVE"
                  color="error"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Screenshots List */}
      {hasMonitoringAccess && (
        <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={3}>
              Recent Screenshots
            </Typography>
            <Grid container spacing={2}>
              {monitoringData.screenshots.slice(0, 6).map((screenshot) => (
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

      {/* Live Recordings List */}
      {canViewRecordings && (
        <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={3}>
              Live Recordings
            </Typography>
            <List>
              {monitoringData.liveRecordings.map((recording) => (
                <ListItem key={recording.id} sx={{ borderBottom: '1px solid #333' }}>
                  <ListItemIcon sx={{ color: recording.isActive ? '#f44336' : '#666' }}>
                    {recording.isActive ? <Videocam /> : <VideocamOff />}
                  </ListItemIcon>
                  <ListItemText
                    primary={recording.agentName}
                    secondary={`Started: ${new Date(recording.startTime).toLocaleString()}`}
                    primaryTypographyProps={{ color: '#fff', fontWeight: 600 }}
                    secondaryTypographyProps={{ color: 'textSecondary' }}
                  />
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" color="textSecondary">
                      {recording.duration}
                    </Typography>
                    <Chip
                      label={recording.isActive ? 'LIVE' : 'ENDED'}
                      color={recording.isActive ? 'error' : 'default'}
                      size="small"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

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