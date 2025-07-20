import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Tooltip,
  Menu,
  MenuItem as MenuItemComponent,
  LinearProgress,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  CameraAlt,
  Security,
  Notifications,
  Settings,
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  LocationOn,
  Work,
  School,
  CalendarToday,
  Language,
  DarkMode,
  LightMode,
  VolumeUp,
  VolumeOff,
  Lock,
  Key,
  CheckCircle,
  Warning,
  Info,
  Delete,
  Upload,
  Download,
  Refresh,
  History,
  Star,
  StarBorder,
  Business,
  Home,
  Public,
  Private,
  VerifiedUser,
  AccountCircle,
  Password,
  VpnKey,
  NotificationsActive,
  NotificationsOff,
  Sms,
  EmailOutlined,
  PushPin,
  Schedule,
  AccessTime,
  TrendingUp,
  Assessment,
  Analytics,
  Dashboard,
} from '@mui/icons-material';

// Mock agent data
const mockAgentData = {
  id: 1,
  name: "Abhishek",
  email: "abhishek@techbuddy31.com",
  phone: "+91 98765 43210",
  avatar: "A",
  department: "Sales",
  position: "Senior Sales Executive",
  employeeId: "EMP001",
  joinDate: "2023-03-15",
  status: "Active",
  location: "Mumbai, India",
  timezone: "Asia/Kolkata",
  language: "English",
  bio: "Experienced sales professional with 5+ years in B2B sales. Specialized in enterprise solutions and customer relationship management.",
  
  // Personal Details
  personal: {
    firstName: "Abhishek",
    lastName: "Sharma",
    dateOfBirth: "1990-08-15",
    gender: "Male",
    address: "123 Business Park, Andheri West, Mumbai - 400058",
    emergencyContact: {
      name: "Priya Sharma",
      relationship: "Spouse",
      phone: "+91 98765 43211",
      email: "priya.sharma@email.com"
    }
  },

  // Work Details
  work: {
    department: "Sales",
    position: "Senior Sales Executive",
    manager: "John Manager",
    team: "Enterprise Sales",
    workLocation: "Mumbai Office",
    workPhone: "+91 22 1234 5678",
    workEmail: "abhishek.sales@techbuddy31.com",
    employeeId: "EMP001",
    joinDate: "2023-03-15",
    contractType: "Full-time",
    salary: "₹45,000/month"
  },

  // Preferences
  preferences: {
    theme: "dark",
    language: "English",
    timezone: "Asia/Kolkata",
    notifications: {
      email: true,
      sms: false,
      push: true,
      desktop: true,
      salesAlerts: true,
      taskReminders: true,
      performanceUpdates: true,
      teamMessages: true,
      systemUpdates: false
    },
    privacy: {
      profileVisibility: "team",
      showOnlineStatus: true,
      showLastSeen: false,
      allowMessages: true,
      allowCalls: true
    }
  },

  // Security
  security: {
    lastPasswordChange: "2024-06-15",
    twoFactorEnabled: true,
    loginHistory: [
      { date: "2024-07-15 09:30", device: "Chrome - Windows", location: "Mumbai, India", status: "Success" },
      { date: "2024-07-14 18:45", device: "Mobile - Android", location: "Mumbai, India", status: "Success" },
      { date: "2024-07-13 10:15", device: "Chrome - Windows", location: "Mumbai, India", status: "Success" },
    ],
    activeSessions: 2
  },

  // Performance Stats
  performance: {
    totalCalls: 1247,
    successfulDeals: 89,
    averageRating: 4.7,
    monthlyTarget: 85,
    currentMonth: 67,
    achievements: [
      "Top Performer - Q1 2024",
      "Best Customer Service - March 2024",
      "Sales Excellence Award - 2023"
    ]
  }
};

export default function AgentProfile() {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [agentData, setAgentData] = useState(mockAgentData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In real app, this would save to backend
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setAgentData(mockAgentData);
    setIsEditing(false);
  };

  const handleFieldChange = (section, field, value) => {
    setAgentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePreferenceChange = (category, setting, value) => {
    setAgentData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category],
          [setting]: value
        }
      }
    }));
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    // In real app, this would update password
    setShowPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password updated successfully!');
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In real app, this would upload to server
      alert('Avatar uploaded successfully!');
      setShowAvatarDialog(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'error';
      case 'On Leave': return 'warning';
      default: return 'default';
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ paddingTop: 20 }}>
      {value === index && children}
    </div>
  );

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Person sx={{ fontSize: 40, color: '#00e6ff' }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Profile Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your personal details and account settings
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{ backgroundColor: '#00e6ff', color: '#000' }}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                sx={{ borderColor: '#666', color: '#fff' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ backgroundColor: '#00e6ff', color: '#000' }}
              >
                Save Changes
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
            color: '#fff', 
            border: '1px solid #333',
            boxShadow: '0 8px 32px rgba(0, 230, 255, 0.1)',
            borderRadius: 3,
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box position="relative" display="inline-block" mb={2}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      onClick={() => setShowAvatarDialog(true)}
                      sx={{ 
                        backgroundColor: '#00e6ff',
                        color: '#000',
                        '&:hover': { backgroundColor: '#00b3cc' },
                      }}
                    >
                      <CameraAlt fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      fontSize: 48,
                      backgroundColor: '#00e6ff',
                      color: '#000',
                      border: '4px solid #333',
                    }}
                  >
                    {agentData.avatar}
                  </Avatar>
                </Badge>
              </Box>

              <Typography variant="h5" fontWeight={700} mb={1}>
                {agentData.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" mb={2}>
                {agentData.position}
              </Typography>

              <Chip
                label={agentData.status}
                color={getStatusColor(agentData.status)}
                sx={{ mb: 2 }}
              />

              <Box display="flex" flexDirection="column" gap={1} mb={3}>
                <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                  <Email sx={{ fontSize: 16, color: '#00e6ff' }} />
                  <Typography variant="body2">{agentData.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                  <Phone sx={{ fontSize: 16, color: '#00e6ff' }} />
                  <Typography variant="body2">{agentData.phone}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                  <LocationOn sx={{ fontSize: 16, color: '#00e6ff' }} />
                  <Typography variant="body2">{agentData.location}</Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: '#333', mb: 2 }} />

              <Typography variant="h6" fontWeight={600} mb={2} color="#00e6ff">
                Performance Overview
              </Typography>
              
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" fontWeight={700} color="#00e6ff">
                    {agentData.performance.totalCalls}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Total Calls
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" fontWeight={700} color="#00e6ff">
                    {agentData.performance.successfulDeals}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Deals Closed
                  </Typography>
                </Grid>
              </Grid>

              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Monthly Target</Typography>
                  <Typography variant="body2" color="#00e6ff">
                    {agentData.performance.currentMonth}/{agentData.performance.monthlyTarget}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(agentData.performance.currentMonth / agentData.performance.monthlyTarget) * 100}
                  sx={{
                    backgroundColor: '#333',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#00e6ff',
                    },
                  }}
                />
              </Box>

              <Box display="flex" alignItems="center" gap={1} justifyContent="center" mb={2}>
                <Star sx={{ color: '#ffd700' }} />
                <Typography variant="body2">
                  {agentData.performance.averageRating} Rating
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
            color: '#fff', 
            border: '1px solid #333',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ borderBottom: 1, borderColor: '#333' }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTab-root': {
                      color: '#666',
                      '&.Mui-selected': { color: '#00e6ff' },
                    },
                    '& .MuiTabs-indicator': { backgroundColor: '#00e6ff' },
                  }}
                >
                  <Tab label="Personal Details" />
                  <Tab label="Work Details" />
                  <Tab label="Preferences" />
                  <Tab label="Security" />
                </Tabs>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* Personal Details Tab */}
                <TabPanel value={activeTab} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={agentData.personal.firstName}
                        onChange={(e) => handleFieldChange('personal', 'firstName', e.target.value)}
                        disabled={!isEditing}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: '#333' },
                            '&:hover fieldset': { borderColor: '#00e6ff' },
                            '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={agentData.personal.lastName}
                        onChange={(e) => handleFieldChange('personal', 'lastName', e.target.value)}
                        disabled={!isEditing}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: '#333' },
                            '&:hover fieldset': { borderColor: '#00e6ff' },
                            '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={agentData.personal.dateOfBirth}
                        onChange={(e) => handleFieldChange('personal', 'dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: '#333' },
                            '&:hover fieldset': { borderColor: '#00e6ff' },
                            '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#666' }}>Gender</InputLabel>
                        <Select
                          value={agentData.personal.gender}
                          onChange={(e) => handleFieldChange('personal', 'gender', e.target.value)}
                          disabled={!isEditing}
                          sx={{
                            color: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' },
                          }}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        multiline
                        rows={3}
                        value={agentData.personal.address}
                        onChange={(e) => handleFieldChange('personal', 'address', e.target.value)}
                        disabled={!isEditing}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: '#333' },
                            '&:hover fieldset': { borderColor: '#00e6ff' },
                            '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" fontWeight={600} mb={2} color="#00e6ff">
                        Emergency Contact
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Contact Name"
                            value={agentData.personal.emergencyContact.name}
                            onChange={(e) => handleFieldChange('personal', 'emergencyContact', {
                              ...agentData.personal.emergencyContact,
                              name: e.target.value
                            })}
                            disabled={!isEditing}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': { borderColor: '#333' },
                                '&:hover fieldset': { borderColor: '#00e6ff' },
                                '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                              },
                              '& .MuiInputLabel-root': { color: '#666' },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Relationship"
                            value={agentData.personal.emergencyContact.relationship}
                            onChange={(e) => handleFieldChange('personal', 'emergencyContact', {
                              ...agentData.personal.emergencyContact,
                              relationship: e.target.value
                            })}
                            disabled={!isEditing}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': { borderColor: '#333' },
                                '&:hover fieldset': { borderColor: '#00e6ff' },
                                '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                              },
                              '& .MuiInputLabel-root': { color: '#666' },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Phone"
                            value={agentData.personal.emergencyContact.phone}
                            onChange={(e) => handleFieldChange('personal', 'emergencyContact', {
                              ...agentData.personal.emergencyContact,
                              phone: e.target.value
                            })}
                            disabled={!isEditing}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': { borderColor: '#333' },
                                '&:hover fieldset': { borderColor: '#00e6ff' },
                                '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                              },
                              '& .MuiInputLabel-root': { color: '#666' },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            value={agentData.personal.emergencyContact.email}
                            onChange={(e) => handleFieldChange('personal', 'emergencyContact', {
                              ...agentData.personal.emergencyContact,
                              email: e.target.value
                            })}
                            disabled={!isEditing}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': { borderColor: '#333' },
                                '&:hover fieldset': { borderColor: '#00e6ff' },
                                '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                              },
                              '& .MuiInputLabel-root': { color: '#666' },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Work Details Tab */}
                <TabPanel value={activeTab} index={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Employee ID"
                        value={agentData.work.employeeId}
                        disabled
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#666',
                            '& fieldset': { borderColor: '#333' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        value={agentData.work.department}
                        disabled
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#666',
                            '& fieldset': { borderColor: '#333' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Position"
                        value={agentData.work.position}
                        disabled
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#666',
                            '& fieldset': { borderColor: '#333' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Manager"
                        value={agentData.work.manager}
                        disabled
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#666',
                            '& fieldset': { borderColor: '#333' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Team"
                        value={agentData.work.team}
                        disabled
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#666',
                            '& fieldset': { borderColor: '#333' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Join Date"
                        value={agentData.work.joinDate}
                        disabled
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#666',
                            '& fieldset': { borderColor: '#333' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Work Phone"
                        value={agentData.work.workPhone}
                        disabled
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#666',
                            '& fieldset': { borderColor: '#333' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Work Email"
                        value={agentData.work.workEmail}
                        disabled
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#666',
                            '& fieldset': { borderColor: '#333' },
                          },
                          '& .MuiInputLabel-root': { color: '#666' },
                        }}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Preferences Tab */}
                <TabPanel value={activeTab} index={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#666' }}>Theme</InputLabel>
                        <Select
                          value={agentData.preferences.theme}
                          onChange={(e) => handlePreferenceChange('', 'theme', e.target.value)}
                          disabled={!isEditing}
                          sx={{
                            color: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' },
                          }}
                        >
                          <MenuItem value="light">Light</MenuItem>
                          <MenuItem value="dark">Dark</MenuItem>
                          <MenuItem value="auto">Auto</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#666' }}>Language</InputLabel>
                        <Select
                          value={agentData.preferences.language}
                          onChange={(e) => handlePreferenceChange('', 'language', e.target.value)}
                          disabled={!isEditing}
                          sx={{
                            color: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' },
                          }}
                        >
                          <MenuItem value="English">English</MenuItem>
                          <MenuItem value="Hindi">Hindi</MenuItem>
                          <MenuItem value="Spanish">Spanish</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="h6" fontWeight={600} mb={2} color="#00e6ff">
                        Notification Preferences
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={agentData.preferences.notifications.email}
                                onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                                disabled={!isEditing}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#00e6ff',
                                    '&:hover': { backgroundColor: '#00e6ff22' },
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#00e6ff',
                                  },
                                }}
                              />
                            }
                            label="Email Notifications"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={agentData.preferences.notifications.sms}
                                onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                                disabled={!isEditing}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#00e6ff',
                                    '&:hover': { backgroundColor: '#00e6ff22' },
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#00e6ff',
                                  },
                                }}
                              />
                            }
                            label="SMS Notifications"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={agentData.preferences.notifications.push}
                                onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                                disabled={!isEditing}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#00e6ff',
                                    '&:hover': { backgroundColor: '#00e6ff22' },
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#00e6ff',
                                  },
                                }}
                              />
                            }
                            label="Push Notifications"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={agentData.preferences.notifications.salesAlerts}
                                onChange={(e) => handlePreferenceChange('notifications', 'salesAlerts', e.target.checked)}
                                disabled={!isEditing}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#00e6ff',
                                    '&:hover': { backgroundColor: '#00e6ff22' },
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#00e6ff',
                                  },
                                }}
                              />
                            }
                            label="Sales Alerts"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Security Tab */}
                <TabPanel value={activeTab} index={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" fontWeight={600} mb={2} color="#00e6ff">
                        Account Security
                      </Typography>
                      <Box display="flex" gap={2} mb={3}>
                        <Button
                          variant="outlined"
                          startIcon={<Lock />}
                          onClick={() => setShowPasswordDialog(true)}
                          sx={{ borderColor: '#00e6ff', color: '#00e6ff' }}
                        >
                          Change Password
                        </Button>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={agentData.security.twoFactorEnabled}
                              disabled={!isEditing}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#00e6ff',
                                  '&:hover': { backgroundColor: '#00e6ff22' },
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#00e6ff',
                                },
                              }}
                            />
                          }
                          label="Two-Factor Authentication"
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" fontWeight={600} mb={2} color="#00e6ff">
                        Login History
                      </Typography>
                      <List>
                        {agentData.security.loginHistory.map((login, index) => (
                          <ListItem key={index} sx={{ border: '1px solid #333', borderRadius: 2, mb: 1 }}>
                            <ListItemIcon>
                              <CheckCircle sx={{ color: '#4caf50' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={login.device}
                              secondary={`${login.date} • ${login.location}`}
                            />
                            <Chip label={login.status} color="success" size="small" />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>

                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ backgroundColor: '#00e6ff22', color: '#00e6ff' }}>
                        <Typography variant="body2">
                          Last password change: {agentData.security.lastPasswordChange}
                        </Typography>
                      </Alert>
                    </Grid>
                  </Grid>
                </TabPanel>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#00e6ff' }}>
          Change Password
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                      >
                        {showPassword.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      >
                        {showPassword.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                      >
                        {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            sx={{ backgroundColor: '#00e6ff', color: '#000' }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Avatar Upload Dialog */}
      <Dialog
        open={showAvatarDialog}
        onClose={() => setShowAvatarDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#00e6ff' }}>
          Update Profile Picture
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarUpload}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<Upload />}
                sx={{ backgroundColor: '#00e6ff', color: '#000' }}
              >
                Choose Image
              </Button>
            </label>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Supported formats: JPG, PNG, GIF (Max 5MB)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAvatarDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 