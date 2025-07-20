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
  Notifications,
  Add,
  Edit,
  Delete,
  Schedule,
  CheckCircle,
  Person,
  Assignment,
  Group,
  School,
  Assessment,
  Warning,
  Done,
  Pending,
  PlayArrow,
  Error,
  AccessTime,
  Note,
  PriorityHigh,
  Today,
  Alarm,
} from '@mui/icons-material';

// Mock internal reminders data
const mockInternalReminders = [
  {
    id: 1,
    title: 'Complete daily call report',
    description: 'Submit today\'s call summary and performance metrics',
    category: 'reporting',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-07-12T17:00:00',
    reminderTime: '2024-07-12T16:30:00',
    isRecurring: false,
    recurringType: null,
    notes: 'Include all calls made today',
    createdAt: '2024-07-12',
    completedAt: null,
  },
  {
    id: 2,
    title: 'Team meeting preparation',
    description: 'Prepare updates for tomorrow\'s team meeting',
    category: 'meeting',
    priority: 'medium',
    status: 'completed',
    dueDate: '2024-07-11T15:00:00',
    reminderTime: '2024-07-11T14:30:00',
    isRecurring: false,
    recurringType: null,
    notes: 'Focus on current deals and challenges',
    createdAt: '2024-07-10',
    completedAt: '2024-07-11T14:45:00',
  },
  {
    id: 3,
    title: 'Product training session',
    description: 'Attend new product feature training',
    category: 'training',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-07-13T10:00:00',
    reminderTime: '2024-07-13T09:30:00',
    isRecurring: false,
    recurringType: null,
    notes: 'Mandatory training for all agents',
    createdAt: '2024-07-09',
    completedAt: null,
  },
  {
    id: 4,
    title: 'Weekly performance review',
    description: 'Review weekly KPIs and set goals for next week',
    category: 'admin',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-07-14T16:00:00',
    reminderTime: '2024-07-14T15:30:00',
    isRecurring: true,
    recurringType: 'weekly',
    notes: 'Every Friday at 4 PM',
    createdAt: '2024-07-08',
    completedAt: null,
  },
  {
    id: 5,
    title: 'Update CRM contacts',
    description: 'Sync new contact information in CRM system',
    category: 'admin',
    priority: 'low',
    status: 'pending',
    dueDate: '2024-07-15T12:00:00',
    reminderTime: '2024-07-15T11:30:00',
    isRecurring: false,
    recurringType: null,
    notes: 'Add new leads from today\'s calls',
    createdAt: '2024-07-12',
    completedAt: null,
  },
  {
    id: 6,
    title: 'Monthly target check',
    description: 'Review progress towards monthly sales targets',
    category: 'reporting',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-07-31T17:00:00',
    reminderTime: '2024-07-31T16:30:00',
    isRecurring: true,
    recurringType: 'monthly',
    notes: 'Last day of month review',
    createdAt: '2024-07-01',
    completedAt: null,
  },
];

const reminderCategories = [
  { value: 'reporting', label: 'Reporting', iconName: 'Report', color: '#4caf50' },
  { value: 'meeting', label: 'Meeting', iconName: 'Meeting', color: '#2196f3' },
  { value: 'training', label: 'Training', iconName: 'Training', color: '#ff9800' },
  { value: 'admin', label: 'Admin', iconName: 'Assignment', color: '#9c27b0' },
  { value: 'personal', label: 'Personal', iconName: 'Person', color: '#f44336' },
  { value: 'followup', label: 'Follow-up', iconName: 'Note', color: '#00bcd4' },
];

const recurringTypes = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export default function InternalReminders() {
  const [reminders, setReminders] = useState(mockInternalReminders);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [reminderDialog, setReminderDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [reminderData, setReminderData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    reminderTime: '',
    isRecurring: false,
    recurringType: 'weekly',
    notes: '',
  });

  const filteredReminders = selectedTab === 'all' 
    ? reminders 
    : reminders.filter(reminder => reminder.status === selectedTab);

  const reminderStats = {
    total: reminders.length,
    pending: reminders.filter(r => r.status === 'pending').length,
    completed: reminders.filter(r => r.status === 'completed').length,
    overdue: reminders.filter(r => new Date(r.dueDate) < new Date() && r.status === 'pending').length,
    completionRate: Math.round((reminders.filter(r => r.status === 'completed').length / reminders.length) * 100),
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddReminder = () => {
    setIsEdit(false);
    setReminderData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      reminderTime: '',
      isRecurring: false,
      recurringType: 'weekly',
      notes: '',
    });
    setReminderDialog(true);
  };

  const handleEditReminder = (reminder) => {
    setIsEdit(true);
    setSelectedReminder(reminder);
    setReminderData({
      title: reminder.title,
      description: reminder.description,
      category: reminder.category,
      priority: reminder.priority,
      status: reminder.status,
      dueDate: reminder.dueDate,
      reminderTime: reminder.reminderTime,
      isRecurring: reminder.isRecurring,
      recurringType: reminder.recurringType,
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
        createdAt: new Date().toISOString().split('T')[0],
        completedAt: null,
      };
      setReminders(prev => [...prev, newReminder]);
      setSnackbarMessage('Reminder created successfully!');
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

  const handleCompleteReminder = (reminder) => {
    setReminders(prev => prev.map(r => 
      r.id === reminder.id ? { 
        ...r, 
        status: 'completed', 
        completedAt: new Date().toISOString()
      } : r
    ));
    setSnackbarMessage('Reminder marked as completed!');
    setSnackbarType('success');
    setShowSnackbar(true);
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
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    const cat = reminderCategories.find(c => c.value === category);
    if (!cat) return <Assignment />;
    
    switch (cat.iconName) {
      case 'Report': return <Assessment />;
      case 'Meeting': return <Group />;
      case 'Training': return <School />;
      case 'Assignment': return <Assignment />;
      case 'Person': return <Person />;
      case 'Note': return <Note />;
      default: return <Assignment />;
    }
  };

  const getCategoryColor = (category) => {
    const cat = reminderCategories.find(c => c.value === category);
    return cat ? cat.color : '#666';
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && dueDate !== '';
  };

  const isDueSoon = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffHours = (due - now) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Notifications sx={{ fontSize: 40, color: '#00e6ff' }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Internal Reminders
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your personal reminders and internal tasks
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddReminder}
          sx={{ backgroundColor: '#00e6ff', color: '#000' }}
        >
          Add Reminder
        </Button>
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
                Pending
              </Typography>
              <Typography variant="h4" fontWeight={900} color="warning.main">
                {reminderStats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Overdue
              </Typography>
              <Typography variant="h4" fontWeight={900} color="error.main">
                {reminderStats.overdue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completion Rate
              </Typography>
              <Typography variant="h4" fontWeight={900} color="success.main">
                {reminderStats.completionRate}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={reminderStats.completionRate} 
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
                  <Notifications />
                  All Reminders
                  <Badge badgeContent={reminderStats.total} color="primary" />
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
            <Tab
              value="completed"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Done />
                  Completed
                  <Badge badgeContent={reminderStats.completed} color="success" />
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
              <Notifications sx={{ fontSize: 60, color: '#666', mb: 2 }} />
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
                      backgroundColor: isOverdue(reminder.dueDate) ? '#ff000011' : 
                                   isDueSoon(reminder.dueDate) ? '#ff980011' : 'transparent',
                      borderLeft: isOverdue(reminder.dueDate) ? '4px solid #f44336' : 
                                 isDueSoon(reminder.dueDate) ? '4px solid #ff9800' : 'none',
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
                            color={reminder.status === 'completed' ? '#666' : '#fff'}
                            sx={{ textDecoration: reminder.status === 'completed' ? 'line-through' : 'none' }}
                          >
                            {reminder.title}
                          </Typography>
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
                          {reminder.isRecurring && (
                            <Chip
                              label={reminder.recurringType}
                              size="small"
                              sx={{ backgroundColor: '#9c27b0', color: '#fff' }}
                            />
                          )}
                          {isOverdue(reminder.dueDate) && (
                            <Chip
                              label="Overdue"
                              size="small"
                              color="error"
                              icon={<Warning />}
                            />
                          )}
                          {isDueSoon(reminder.dueDate) && !isOverdue(reminder.dueDate) && (
                            <Chip
                              label="Due Soon"
                              size="small"
                              color="warning"
                              icon={<Alarm />}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                            {reminder.description}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="caption" color="textSecondary">
                              Due: {new Date(reminder.dueDate).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Reminder: {new Date(reminder.reminderTime).toLocaleString()}
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
                        {reminder.status !== 'completed' && (
                          <IconButton
                            size="small"
                            onClick={() => handleCompleteReminder(reminder)}
                            sx={{ color: '#4caf50' }}
                            title="Mark as Completed"
                          >
                            <CheckCircle />
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
            <Grid item xs={12}>
              <TextField
                label="Reminder Title"
                fullWidth
                value={reminderData.title}
                onChange={(e) => setReminderData({ ...reminderData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                value={reminderData.description}
                onChange={(e) => setReminderData({ ...reminderData, description: e.target.value })}
              />
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
                        {category.iconName === 'Report' && <Notifications />}
                        {category.iconName === 'Meeting' && <Schedule />}
                        {category.iconName === 'Training' && <PlayArrow />}
                        {category.iconName === 'Assignment' && <Assignment />}
                        {category.iconName === 'Person' && <Person />}
                        {category.iconName === 'Note' && <Note />}
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            <Grid item xs={12} md={6}>
              <TextField
                label="Due Date & Time"
                type="datetime-local"
                fullWidth
                value={reminderData.dueDate}
                onChange={(e) => setReminderData({ ...reminderData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Reminder Time"
                type="datetime-local"
                fullWidth
                value={reminderData.reminderTime}
                onChange={(e) => setReminderData({ ...reminderData, reminderTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={reminderData.isRecurring}
                    onChange={(e) => setReminderData({ ...reminderData, isRecurring: e.target.checked })}
                    color="primary"
                  />
                }
                label="Recurring Reminder"
              />
            </Grid>
            {reminderData.isRecurring && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Recurring Type</InputLabel>
                  <Select
                    value={reminderData.recurringType}
                    label="Recurring Type"
                    onChange={(e) => setReminderData({ ...reminderData, recurringType: e.target.value })}
                  >
                    {recurringTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
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
            disabled={!reminderData.title || !reminderData.dueDate || !reminderData.reminderTime}
          >
            {isEdit ? 'Update Reminder' : 'Create Reminder'}
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