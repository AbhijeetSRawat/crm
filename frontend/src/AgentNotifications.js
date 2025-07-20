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
  Badge,
  Tabs,
  Tab,
  Divider,
  Avatar,
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
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment,
  Message,
  Flag,
  Warning,
  Info,
  CheckCircle,
  Delete,
  MarkEmailRead,
  MarkEmailUnread,
  Schedule,
  Person,
  Business,
  AttachMoney,
} from '@mui/icons-material';

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'lead',
    title: 'New Lead Assigned',
    message: 'You have been assigned a new lead: Acme Corporation',
    timestamp: '2 minutes ago',
    read: false,
    priority: 'high',
    icon: <Assignment />,
    color: '#4caf50',
  },
  {
    id: 2,
    type: 'target',
    title: 'Target Updated',
    message: 'Your monthly target has been updated to ₹200,000',
    timestamp: '1 hour ago',
    read: false,
    priority: 'medium',
    icon: <Flag />,
    color: '#ff9800',
  },
  {
    id: 3,
    type: 'message',
    title: 'Message from Manager',
    message: 'Great job on the Gamma Solutions deal! Keep it up.',
    timestamp: '3 hours ago',
    read: true,
    priority: 'low',
    icon: <Message />,
    color: '#2196f3',
  },
  {
    id: 4,
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance tonight from 2-4 AM. System may be unavailable.',
    timestamp: '1 day ago',
    read: true,
    priority: 'medium',
    icon: <Info />,
    color: '#9c27b0',
  },
  {
    id: 5,
    type: 'achievement',
    title: 'Target Achieved!',
    message: 'Congratulations! You have achieved 100% of your monthly target.',
    timestamp: '2 days ago',
    read: true,
    priority: 'high',
    icon: <CheckCircle />,
    color: '#4caf50',
  },
  {
    id: 6,
    type: 'reminder',
    title: 'Follow-up Reminder',
    message: 'Don\'t forget to follow up with Beta Industries today.',
    timestamp: '3 days ago',
    read: true,
    priority: 'medium',
    icon: <Schedule />,
    color: '#ff9800',
  },
];

const notificationTypes = [
  { value: 'all', label: 'All', icon: <NotificationsIcon /> },
  { value: 'lead', label: 'Leads', icon: <Assignment /> },
  { value: 'target', label: 'Targets', icon: <Flag /> },
  { value: 'message', label: 'Messages', icon: <Message /> },
  { value: 'system', label: 'System', icon: <Info /> },
  { value: 'achievement', label: 'Achievements', icon: <CheckCircle /> },
  { value: 'reminder', label: 'Reminders', icon: <Schedule /> },
];

export default function AgentNotifications() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [composeDialog, setComposeDialog] = useState(false);
  const [composeData, setComposeData] = useState({
    subject: '',
    message: '',
    priority: 'medium',
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = selectedTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === selectedTab);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAsUnread = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: false } : n)
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setDetailDialog(true);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTimeAgo = (timestamp) => {
    return timestamp; // In real app, calculate actual time difference
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon sx={{ fontSize: 40, color: '#00e6ff' }} />
          </Badge>
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Notifications
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {unreadCount} unread notifications
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            sx={{ borderColor: '#00e6ff', color: '#00e6ff' }}
          >
            Mark All Read
          </Button>
          <Button
            variant="contained"
            onClick={() => setComposeDialog(true)}
            sx={{ backgroundColor: '#00e6ff', color: '#000' }}
          >
            Compose Message
          </Button>
        </Box>
      </Box>

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
            {notificationTypes.map((type) => (
              <Tab
                key={type.value}
                value={type.value}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {type.icon}
                    {type.label}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
        <CardContent sx={{ p: 0 }}>
          {filteredNotifications.length === 0 ? (
            <Box textAlign="center" py={4}>
              <NotificationsIcon sx={{ fontSize: 60, color: '#666', mb: 2 }} />
              <Typography variant="h6" color="#666">
                No notifications found
              </Typography>
              <Typography variant="body2" color="#666">
                You're all caught up!
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    button
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : '#00e6ff11',
                      '&:hover': { backgroundColor: '#00e6ff22' },
                      borderLeft: notification.read ? 'none' : '4px solid #00e6ff',
                    }}
                  >
                    <ListItemIcon sx={{ color: notification.color }}>
                      {notification.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="body1"
                            fontWeight={notification.read ? 400 : 600}
                            color={notification.read ? '#fff' : '#00e6ff'}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.priority}
                            size="small"
                            color={getPriorityColor(notification.priority)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {getTimeAgo(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.read ? markAsUnread(notification.id) : markAsRead(notification.id);
                          }}
                          sx={{ color: notification.read ? '#666' : '#00e6ff' }}
                        >
                          {notification.read ? <MarkEmailUnread /> : <MarkEmailRead />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          sx={{ color: '#666' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredNotifications.length - 1 && (
                    <Divider sx={{ borderColor: '#333' }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Notification Detail Dialog */}
      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#00e6ff' }}>
          {selectedNotification?.title}
        </DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: selectedNotification.color }}>
                  {selectedNotification.icon}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedNotification.title}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {getTimeAgo(selectedNotification.timestamp)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" paragraph>
                {selectedNotification.message}
              </Typography>
              <Chip
                label={selectedNotification.priority}
                color={getPriorityColor(selectedNotification.priority)}
                sx={{ mr: 1 }}
              />
              <Chip
                label={selectedNotification.type}
                variant="outlined"
                sx={{ borderColor: '#00e6ff', color: '#00e6ff' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setDetailDialog(false);
              // Add action based on notification type
            }}
          >
            Take Action
          </Button>
        </DialogActions>
      </Dialog>

      {/* Compose Message Dialog */}
      <Dialog
        open={composeDialog}
        onClose={() => setComposeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#00e6ff' }}>
          Compose Message
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Subject"
            fullWidth
            margin="dense"
            value={composeData.subject}
            onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={composeData.priority}
              label="Priority"
              onChange={(e) => setComposeData({ ...composeData, priority: e.target.value })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Message"
            multiline
            rows={4}
            fullWidth
            margin="dense"
            value={composeData.message}
            onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              // In real app, send message to manager/support
              alert('Message sent successfully!');
              setComposeDialog(false);
              setComposeData({ subject: '', message: '', priority: 'medium' });
            }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 