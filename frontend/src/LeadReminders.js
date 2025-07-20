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
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  WhatsApp,
  Sms,
  Add,
  Edit,
  Delete,
  Schedule,
  Send,
  Person,
  Business,
  Phone,
  Email,
  Note,
  Warning,
  Done,
  Pending,
  PlayArrow,
  CheckCircle,
  Error,
  AccessTime,
  Message,
  ContactPhone,
} from '@mui/icons-material';

// Mock lead reminders data
const mockLeadReminders = [
  {
    id: 1,
    leadName: 'John Smith',
    leadPhone: '+1234567890',
    leadEmail: 'john.smith@email.com',
    company: 'Acme Corporation',
    messageType: 'whatsapp',
    message: 'Hi John, just following up on our discussion about the enterprise package. When would be a good time to connect?',
    scheduledDate: '2024-07-12T10:00:00',
    status: 'scheduled',
    priority: 'high',
    category: 'follow_up',
    notes: 'Client showed interest in enterprise package',
    createdAt: '2024-07-10',
    sentAt: null,
    deliveryStatus: null,
  },
  {
    id: 2,
    leadName: 'Sarah Johnson',
    leadPhone: '+1987654321',
    leadEmail: 'sarah.j@techcorp.com',
    company: 'TechCorp Inc',
    messageType: 'sms',
    message: 'Hi Sarah, your demo is scheduled for tomorrow at 2 PM. Please confirm if this time works for you.',
    scheduledDate: '2024-07-11T14:00:00',
    status: 'sent',
    priority: 'medium',
    category: 'demo_reminder',
    notes: 'Demo preparation needed',
    createdAt: '2024-07-09',
    sentAt: '2024-07-11T14:00:00',
    deliveryStatus: 'delivered',
  },
  {
    id: 3,
    leadName: 'Mike Wilson',
    leadPhone: '+1555123456',
    leadEmail: 'mike.w@startup.com',
    company: 'StartupXYZ',
    messageType: 'whatsapp',
    message: 'Hi Mike, hope you had a chance to review our proposal. Any questions or concerns?',
    scheduledDate: '2024-07-13T16:00:00',
    status: 'pending',
    priority: 'low',
    category: 'proposal_followup',
    notes: 'Proposal sent last week',
    createdAt: '2024-07-08',
    sentAt: null,
    deliveryStatus: null,
  },
  {
    id: 4,
    leadName: 'Lisa Brown',
    leadPhone: '+1444567890',
    leadEmail: 'lisa.b@enterprise.com',
    company: 'Enterprise Solutions',
    messageType: 'sms',
    message: 'Hi Lisa, your contract renewal is due next week. Would you like to discuss our new features?',
    scheduledDate: '2024-07-15T11:00:00',
    status: 'scheduled',
    priority: 'high',
    category: 'renewal',
    notes: 'Contract expires in 2 weeks',
    createdAt: '2024-07-10',
    sentAt: null,
    deliveryStatus: null,
  },
  {
    id: 5,
    leadName: 'David Lee',
    leadPhone: '+1333567890',
    leadEmail: 'david.lee@consulting.com',
    company: 'Consulting Partners',
    messageType: 'whatsapp',
    message: 'Hi David, thanks for the meeting today. I\'ll send over the detailed proposal by end of day.',
    scheduledDate: '2024-07-12T18:00:00',
    status: 'sent',
    priority: 'medium',
    category: 'meeting_followup',
    notes: 'Meeting completed successfully',
    createdAt: '2024-07-12',
    sentAt: '2024-07-12T18:00:00',
    deliveryStatus: 'read',
  },
];

const reminderCategories = [
  { value: 'follow_up', label: 'Follow Up', icon: <Phone />, color: '#4caf50' },
  { value: 'demo_reminder', label: 'Demo Reminder', icon: <PlayArrow />, color: '#2196f3' },
  { value: 'proposal_followup', label: 'Proposal Follow-up', icon: <Note />, color: '#ff9800' },
  { value: 'renewal', label: 'Renewal', icon: <Schedule />, color: '#9c27b0' },
  { value: 'meeting_followup', label: 'Meeting Follow-up', icon: <Person />, color: '#f44336' },
  { value: 'welcome', label: 'Welcome', icon: <CheckCircle />, color: '#00bcd4' },
];

const messageTemplates = [
  {
    id: 1,
    name: 'Follow-up Template',
    message: 'Hi {leadName}, just following up on our discussion about {topic}. When would be a good time to connect?',
    category: 'follow_up',
  },
  {
    id: 2,
    name: 'Demo Reminder',
    message: 'Hi {leadName}, your demo is scheduled for {date} at {time}. Please confirm if this time works for you.',
    category: 'demo_reminder',
  },
  {
    id: 3,
    name: 'Proposal Follow-up',
    message: 'Hi {leadName}, hope you had a chance to review our proposal. Any questions or concerns?',
    category: 'proposal_followup',
  },
  {
    id: 4,
    name: 'Contract Renewal',
    message: 'Hi {leadName}, your contract renewal is due {date}. Would you like to discuss our new features?',
    category: 'renewal',
  },
];

export default function LeadReminders() {
  const [reminders, setReminders] = useState(mockLeadReminders);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [reminderDialog, setReminderDialog] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [reminderData, setReminderData] = useState({
    leadName: '',
    leadPhone: '',
    leadEmail: '',
    company: '',
    messageType: 'whatsapp',
    message: '',
    scheduledDate: '',
    priority: 'medium',
    category: '',
    notes: '',
  });

  const filteredReminders = selectedTab === 'all' 
    ? reminders 
    : reminders.filter(reminder => reminder.status === selectedTab);

  const reminderStats = {
    total: reminders.length,
    scheduled: reminders.filter(r => r.status === 'scheduled').length,
    sent: reminders.filter(r => r.status === 'sent').length,
    pending: reminders.filter(r => r.status === 'pending').length,
    deliveryRate: Math.round((reminders.filter(r => r.deliveryStatus === 'delivered' || r.deliveryStatus === 'read').length / reminders.filter(r => r.status === 'sent').length) * 100) || 0,
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddReminder = () => {
    setIsEdit(false);
    setReminderData({
      leadName: '',
      leadPhone: '',
      leadEmail: '',
      company: '',
      messageType: 'whatsapp',
      message: '',
      scheduledDate: '',
      priority: 'medium',
      category: '',
      notes: '',
    });
    setReminderDialog(true);
  };

  const handleEditReminder = (reminder) => {
    setIsEdit(true);
    setSelectedReminder(reminder);
    setReminderData({
      leadName: reminder.leadName,
      leadPhone: reminder.leadPhone,
      leadEmail: reminder.leadEmail,
      company: reminder.company,
      messageType: reminder.messageType,
      message: reminder.message,
      scheduledDate: reminder.scheduledDate,
      priority: reminder.priority,
      category: reminder.category,
      notes: reminder.notes,
    });
    setReminderDialog(true);
  };

  const handleSaveReminder = () => {
    if (isEdit) {
      setReminders(prev => prev.map(r => 
        r.id === selectedReminder.id ? { ...r, ...reminderData } : r
      ));
      setSnackbarMessage('Reminder updated successfully!');
    } else {
      const newReminder = {
        id: Date.now(),
        ...reminderData,
        status: 'scheduled',
        createdAt: new Date().toISOString().split('T')[0],
        sentAt: null,
        deliveryStatus: null,
      };
      setReminders(prev => [...prev, newReminder]);
      setSnackbarMessage('Reminder scheduled successfully!');
    }
    setSnackbarType('success');
    setShowSnackbar(true);
    setReminderDialog(false);
  };

  const handleDeleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    setSnackbarMessage('Reminder deleted successfully!');
    setSnackbarType('success');
    setShowSnackbar(true);
  };

  const handleSendNow = (reminder) => {
    setReminders(prev => prev.map(r => 
      r.id === reminder.id ? { 
        ...r, 
        status: 'sent', 
        sentAt: new Date().toISOString(),
        deliveryStatus: 'sent'
      } : r
    ));
    setSnackbarMessage('Reminder sent successfully!');
    setSnackbarType('success');
    setShowSnackbar(true);
  };

  const handleUseTemplate = (template) => {
    setReminderData(prev => ({
      ...prev,
      message: template.message,
      category: template.category,
    }));
    setTemplateDialog(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'scheduled': return 'info';
      case 'sent': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    const cat = reminderCategories.find(c => c.value === category);
    return cat ? cat.icon : <Message />;
  };

  const getCategoryColor = (category) => {
    const cat = reminderCategories.find(c => c.value === category);
    return cat ? cat.color : '#666';
  };

  const getMessageTypeIcon = (type) => {
    return type === 'whatsapp' ? <WhatsApp /> : <Sms />;
  };

  const getMessageTypeColor = (type) => {
    return type === 'whatsapp' ? '#25D366' : '#2196f3';
  };

  const isOverdue = (scheduledDate) => {
    return new Date(scheduledDate) < new Date() && scheduledDate !== '';
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Message sx={{ fontSize: 40, color: '#00e6ff' }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Lead Reminders
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Schedule and manage WhatsApp/SMS reminders for leads
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Note />}
            onClick={() => setTemplateDialog(true)}
            sx={{ borderColor: '#00e6ff', color: '#00e6ff' }}
          >
            Templates
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddReminder}
            sx={{ backgroundColor: '#00e6ff', color: '#000' }}
          >
            Add Reminder
          </Button>
        </Box>
      </Box>

      {/* Reminder Statistics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Reminders
              </Typography>
              <Typography variant="h4" fontWeight={900} color="primary.main">
                {reminderStats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Scheduled
              </Typography>
              <Typography variant="h4" fontWeight={900} color="info.main">
                {reminderStats.scheduled}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sent
              </Typography>
              <Typography variant="h4" fontWeight={900} color="success.main">
                {reminderStats.sent}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Delivery Rate
              </Typography>
              <Typography variant="h4" fontWeight={900} color="success.main">
                {reminderStats.deliveryRate}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={reminderStats.deliveryRate} 
                sx={{ mt: 1, backgroundColor: '#333', "& .MuiLinearProgress-bar": { backgroundColor: '#4caf50' } }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                  <Message />
                  All Reminders
                  <Badge badgeContent={reminderStats.total} color="primary" />
                </Box>
              }
            />
            <Tab
              value="scheduled"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Schedule />
                  Scheduled
                  <Badge badgeContent={reminderStats.scheduled} color="info" />
                </Box>
              }
            />
            <Tab
              value="sent"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Send />
                  Sent
                  <Badge badgeContent={reminderStats.sent} color="success" />
                </Box>
              }
            />
            <Tab
              value="pending"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Pending />
                  Pending
                  <Badge badgeContent={reminderStats.pending} color="warning" />
                </Box>
              }
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* Reminders List */}
      <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
        <CardContent sx={{ p: 0 }}>
          {filteredReminders.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Message sx={{ fontSize: 60, color: '#666', mb: 2 }} />
              <Typography variant="h6" color="#666">
                No reminders found
              </Typography>
              <Typography variant="body2" color="#666">
                {selectedTab === 'all' ? 'Add your first reminder to get started!' : `No ${selectedTab} reminders.`}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredReminders.map((reminder, index) => (
                <React.Fragment key={reminder.id}>
                  <ListItem
                    sx={{
                      backgroundColor: isOverdue(reminder.scheduledDate) ? '#ff000011' : 'transparent',
                      borderLeft: isOverdue(reminder.scheduledDate) ? '4px solid #f44336' : 'none',
                    }}
                  >
                    <ListItemIcon sx={{ color: getCategoryColor(reminder.category) }}>
                      {getCategoryIcon(reminder.category)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color="#fff"
                          >
                            {reminder.leadName} - {reminder.company}
                          </Typography>
                          <Chip
                            icon={getMessageTypeIcon(reminder.messageType)}
                            label={reminder.messageType.toUpperCase()}
                            size="small"
                            sx={{ 
                              backgroundColor: getMessageTypeColor(reminder.messageType),
                              color: '#fff'
                            }}
                          />
                          <Chip
                            label={reminder.priority}
                            size="small"
                            color={getPriorityColor(reminder.priority)}
                          />
                          <Chip
                            label={reminder.status}
                            size="small"
                            color={getStatusColor(reminder.status)}
                          />
                          {isOverdue(reminder.scheduledDate) && (
                            <Chip
                              label="Overdue"
                              size="small"
                              color="error"
                              icon={<Warning />}
                            />
                          )}
                          {reminder.deliveryStatus && (
                            <Chip
                              label={reminder.deliveryStatus}
                              size="small"
                              color={reminder.deliveryStatus === 'read' ? 'success' : 'info'}
                              icon={reminder.deliveryStatus === 'read' ? <CheckCircle /> : <AccessTime />}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                            {reminder.message}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="caption" color="textSecondary">
                              Phone: {reminder.leadPhone}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Scheduled: {new Date(reminder.scheduledDate).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Category: {reminderCategories.find(c => c.value === reminder.category)?.label}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" gap={1}>
                        {reminder.status === 'scheduled' && (
                          <IconButton
                            size="small"
                            onClick={() => handleSendNow(reminder)}
                            sx={{ color: '#4caf50' }}
                            title="Send Now"
                          >
                            <Send />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleEditReminder(reminder)}
                          sx={{ color: '#00e6ff' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteReminder(reminder.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredReminders.length - 1 && (
                    <Divider sx={{ borderColor: '#333' }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Reminder Dialog */}
      <Dialog
        open={reminderDialog}
        onClose={() => setReminderDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#00e6ff' }}>
          {isEdit ? 'Edit Reminder' : 'Add New Reminder'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Lead Name"
                fullWidth
                value={reminderData.leadName}
                onChange={(e) => setReminderData({ ...reminderData, leadName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Company"
                fullWidth
                value={reminderData.company}
                onChange={(e) => setReminderData({ ...reminderData, company: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={reminderData.leadPhone}
                onChange={(e) => setReminderData({ ...reminderData, leadPhone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={reminderData.leadEmail}
                onChange={(e) => setReminderData({ ...reminderData, leadEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Message Type</InputLabel>
                <Select
                  value={reminderData.messageType}
                  label="Message Type"
                  onChange={(e) => setReminderData({ ...reminderData, messageType: e.target.value })}
                >
                  <MenuItem value="whatsapp">
                    <Box display="flex" alignItems="center" gap={1}>
                      <WhatsApp />
                      WhatsApp
                    </Box>
                  </MenuItem>
                  <MenuItem value="sms">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Sms />
                      SMS
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={reminderData.category}
                  label="Category"
                  onChange={(e) => setReminderData({ ...reminderData, category: e.target.value })}
                >
                  {reminderCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {category.icon}
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Scheduled Date & Time"
                type="datetime-local"
                fullWidth
                value={reminderData.scheduledDate}
                onChange={(e) => setReminderData({ ...reminderData, scheduledDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={reminderData.priority}
                  label="Priority"
                  onChange={(e) => setReminderData({ ...reminderData, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Message"
                multiline
                rows={4}
                fullWidth
                value={reminderData.message}
                onChange={(e) => setReminderData({ ...reminderData, message: e.target.value })}
                required
                placeholder="Enter your message here..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                multiline
                rows={2}
                fullWidth
                value={reminderData.notes}
                onChange={(e) => setReminderData({ ...reminderData, notes: e.target.value })}
                placeholder="Add any additional notes or context..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReminderDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveReminder}
            disabled={!reminderData.leadName || !reminderData.leadPhone || !reminderData.message || !reminderData.scheduledDate}
          >
            {isEdit ? 'Update Reminder' : 'Schedule Reminder'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Dialog */}
      <Dialog
        open={templateDialog}
        onClose={() => setTemplateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#00e6ff' }}>
          Message Templates
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {messageTemplates.map((template) => (
              <Grid item xs={12} key={template.id}>
                <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="h6" color="#00e6ff" gutterBottom>
                          {template.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          {template.message}
                        </Typography>
                        <Chip
                          label={reminderCategories.find(c => c.value === template.category)?.label}
                          size="small"
                          sx={{ backgroundColor: getCategoryColor(template.category), color: '#fff' }}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleUseTemplate(template)}
                        sx={{ borderColor: '#00e6ff', color: '#00e6ff' }}
                      >
                        Use Template
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialog(false)}>Close</Button>
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