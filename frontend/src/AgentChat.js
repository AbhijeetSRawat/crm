import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
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
  Badge,
  Tooltip,
  Menu,
  MenuItem as MenuItemComponent,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Send,
  AttachFile,
  MoreVert,
  Search,
  FilterList,
  Support,
  Business,
  Person,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Info,
  EmojiEmotions,
  Image,
  Description,
  VideoCall,
  Phone,
  Block,
  Archive,
  Delete,
  Reply,
  Forward,
  Download,
  Star,
  StarBorder,
} from '@mui/icons-material';

// Mock chat data
const mockChatData = {
  currentAgent: {
    id: 1,
    name: "Abhishek",
    avatar: "A",
    status: "online",
    department: "Sales",
  },
  contacts: [
    {
      id: 1,
      name: "Manager John",
      avatar: "J",
      status: "online",
      role: "Manager",
      department: "Sales",
      lastMessage: "Great job on the Acme deal!",
      lastMessageTime: "2 min ago",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: 2,
      name: "Support Team",
      avatar: "S",
      status: "online",
      role: "Support",
      department: "IT",
      lastMessage: "Your ticket #1234 has been resolved",
      lastMessageTime: "1 hour ago",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: 3,
      name: "HR Sarah",
      avatar: "S",
      status: "away",
      role: "HR",
      department: "Human Resources",
      lastMessage: "Please submit your leave application",
      lastMessageTime: "3 hours ago",
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: 4,
      name: "Training Team",
      avatar: "T",
      status: "offline",
      role: "Training",
      department: "Learning",
      lastMessage: "New training module available",
      lastMessageTime: "1 day ago",
      unreadCount: 0,
      isOnline: false,
    },
  ],
  conversations: {
    1: [
      {
        id: 1,
        sender: "Manager John",
        senderId: 1,
        message: "Hi Abhishek! How's the Acme Corporation deal going?",
        timestamp: "10:30 AM",
        type: "text",
        isRead: true,
      },
      {
        id: 2,
        sender: "Abhishek",
        senderId: 0,
        message: "Hi John! It's going well. I had a great call with them yesterday and they're very interested in our enterprise package.",
        timestamp: "10:32 AM",
        type: "text",
        isRead: true,
      },
      {
        id: 3,
        sender: "Manager John",
        senderId: 1,
        message: "Excellent! What's the next step?",
        timestamp: "10:33 AM",
        type: "text",
        isRead: true,
      },
      {
        id: 4,
        sender: "Abhishek",
        senderId: 0,
        message: "I'm preparing a detailed proposal and will schedule a follow-up meeting next week.",
        timestamp: "10:35 AM",
        type: "text",
        isRead: true,
      },
      {
        id: 5,
        sender: "Manager John",
        senderId: 1,
        message: "Perfect! Keep me updated on the progress. Great job on this one!",
        timestamp: "2 min ago",
        type: "text",
        isRead: false,
      },
    ],
    2: [
      {
        id: 1,
        sender: "Support Team",
        senderId: 2,
        message: "Hello! We received your support ticket #1234 regarding the CRM login issue.",
        timestamp: "9:00 AM",
        type: "text",
        isRead: true,
      },
      {
        id: 2,
        sender: "Abhishek",
        senderId: 0,
        message: "Yes, I'm having trouble accessing the lead management module.",
        timestamp: "9:05 AM",
        type: "text",
        isRead: true,
      },
      {
        id: 3,
        sender: "Support Team",
        senderId: 2,
        message: "We've identified the issue. Please try clearing your browser cache and logging in again.",
        timestamp: "9:10 AM",
        type: "text",
        isRead: true,
      },
      {
        id: 4,
        sender: "Abhishek",
        senderId: 0,
        message: "That worked! Thank you for the quick resolution.",
        timestamp: "9:15 AM",
        type: "text",
        isRead: true,
      },
      {
        id: 5,
        sender: "Support Team",
        senderId: 2,
        message: "Great! Your ticket #1234 has been resolved. Is there anything else we can help you with?",
        timestamp: "1 hour ago",
        type: "text",
        isRead: false,
      },
    ],
  },
  quickResponses: [
    "Thank you for your help!",
    "I'll get back to you soon.",
    "Can you please provide more details?",
    "I'm working on it.",
    "Great, thank you!",
    "I need assistance with this.",
    "Please review this for me.",
    "I'm available for a call.",
  ],

};

export default function AgentChat() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedContact]);

  const filteredContacts = mockChatData.contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'online' && contact.isOnline) ||
      (filterStatus === 'unread' && contact.unreadCount > 0);
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (message.trim() && selectedContact) {
      // In real app, this would send to backend
      const newMessage = {
        id: Date.now(),
        sender: "Abhishek",
        senderId: 0,
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text",
        isRead: false,
      };

      // Add to conversation (in real app, this would be handled by backend)
      if (!mockChatData.conversations[selectedContact.id]) {
        mockChatData.conversations[selectedContact.id] = [];
      }
      mockChatData.conversations[selectedContact.id].push(newMessage);

      setMessage('');
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickResponse = (response) => {
    setMessage(response);
    setShowQuickResponses(false);
  };



  const handleMessageMenu = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'success';
      case 'away': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };



  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Support sx={{ fontSize: 40, color: '#00e6ff' }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Chat & Support
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Connect with managers and get support
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Contacts Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
            color: '#fff', 
            border: '1px solid #333', 
            height: '100%',
            boxShadow: '0 8px 32px rgba(0, 230, 255, 0.1)',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Search and Filter */}
              <Box sx={{ 
                p: 3, 
                borderBottom: '1px solid #333',
                background: 'linear-gradient(90deg, #00e6ff11 0%, transparent 100%)',
              }}>
                <Typography variant="h6" fontWeight={700} mb={2} color="#00e6ff">
                  Contacts
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: '#00e6ff', mr: 1 }} />,
                  }}
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
                <Box display="flex" gap={1} mt={2}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      sx={{
                        color: '#fff',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' },
                      }}
                    >
                      <MenuItem value="all">All Contacts</MenuItem>
                      <MenuItem value="online">Online Now</MenuItem>
                      <MenuItem value="unread">Unread Messages</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Contacts List */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
                {filteredContacts.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    color: '#666',
                    p: 3,
                  }}>
                    <Search sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" gutterBottom>
                      No contacts found
                    </Typography>
                    <Typography variant="body2" textAlign="center">
                      Try adjusting your search or filter criteria
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {filteredContacts.map((contact) => (
                      <ListItem
                        key={contact.id}
                        button
                        selected={selectedContact?.id === contact.id}
                        onClick={() => setSelectedContact(contact)}
                        sx={{
                          backgroundColor: selectedContact?.id === contact.id 
                            ? 'linear-gradient(90deg, #00e6ff22 0%, #00e6ff11 100%)' 
                            : 'transparent',
                          borderLeft: selectedContact?.id === contact.id ? '4px solid #00e6ff' : 'none',
                          borderRadius: 2,
                          mb: 1,
                          '&:hover': { 
                            backgroundColor: '#00e6ff11',
                            transform: 'translateX(4px)',
                          },
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': selectedContact?.id === contact.id ? {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(90deg, transparent 0%, #00e6ff11 100%)',
                            zIndex: 0,
                          } : {},
                        }}
                      >
                        <ListItemAvatar sx={{ position: 'relative', zIndex: 1 }}>
                          <Badge
                            badgeContent={contact.unreadCount}
                            color="error"
                            invisible={contact.unreadCount === 0}
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: '#ff4444',
                                color: '#fff',
                                fontWeight: 'bold',
                              }
                            }}
                          >
                            <Avatar sx={{ 
                              bgcolor: contact.isOnline ? '#4caf50' : '#666',
                              border: contact.isOnline ? '2px solid #00e6ff' : 'none',
                              boxShadow: contact.isOnline ? '0 0 10px rgba(76, 175, 80, 0.5)' : 'none',
                            }}>
                              {contact.avatar}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          sx={{ position: 'relative', zIndex: 1 }}
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body1" fontWeight={600} color="#fff">
                                {contact.name}
                              </Typography>
                              <Chip
                                label={contact.role}
                                size="small"
                                sx={{ 
                                  fontSize: '0.7rem', 
                                  height: 20,
                                  backgroundColor: '#333',
                                  color: '#00e6ff',
                                  border: '1px solid #00e6ff',
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography 
                                variant="body2" 
                                color={contact.unreadCount > 0 ? '#fff' : 'textSecondary'} 
                                noWrap
                                fontWeight={contact.unreadCount > 0 ? 500 : 400}
                              >
                                {contact.lastMessage}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {contact.lastMessageTime}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction sx={{ position: 'relative', zIndex: 1 }}>
                          <Chip
                            label={contact.status}
                            size="small"
                            color={getStatusColor(contact.status)}
                            sx={{ 
                              fontSize: '0.7rem', 
                              height: 20,
                              fontWeight: 500,
                            }}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
            color: '#fff', 
            border: '1px solid #333', 
            height: '100%',
            boxShadow: '0 8px 32px rgba(0, 230, 255, 0.1)',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <Box sx={{ 
                    p: 3, 
                    borderBottom: '1px solid #333', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    background: 'linear-gradient(90deg, #00e6ff11 0%, transparent 100%)',
                  }}>
                    <Avatar sx={{ 
                      bgcolor: selectedContact.isOnline ? '#4caf50' : '#666',
                      border: selectedContact.isOnline ? '2px solid #00e6ff' : 'none',
                      boxShadow: selectedContact.isOnline ? '0 0 10px rgba(76, 175, 80, 0.5)' : 'none',
                    }}>
                      {selectedContact.avatar}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={700} color="#fff">
                        {selectedContact.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedContact.role} • {selectedContact.department}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                      <Chip
                        label={selectedContact.status}
                        size="small"
                        color={getStatusColor(selectedContact.status)}
                        sx={{ fontWeight: 500 }}
                      />
                      <Tooltip title="Voice Call">
                        <IconButton size="small" sx={{ 
                          color: '#00e6ff',
                          '&:hover': { backgroundColor: '#00e6ff22' },
                        }}>
                          <Phone />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Video Call">
                        <IconButton size="small" sx={{ 
                          color: '#00e6ff',
                          '&:hover': { backgroundColor: '#00e6ff22' },
                        }}>
                          <VideoCall />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Messages */}
                  <Box sx={{ 
                    flex: 1, 
                    overflow: 'auto', 
                    p: 3,
                    background: 'linear-gradient(180deg, #1a1a1a 0%, #222 100%)',
                  }}>
                    {mockChatData.conversations[selectedContact.id]?.map((msg) => (
                      <Box
                        key={msg.id}
                        sx={{
                          display: 'flex',
                          justifyContent: msg.senderId === 0 ? 'flex-end' : 'flex-start',
                          mb: 3,
                          animation: 'fadeInUp 0.3s ease',
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: '70%',
                            backgroundColor: msg.senderId === 0 
                              ? 'linear-gradient(135deg, #00e6ff 0%, #00b3cc 100%)' 
                              : 'linear-gradient(135deg, #333 0%, #444 100%)',
                            color: msg.senderId === 0 ? '#000' : '#fff',
                            borderRadius: 3,
                            p: 3,
                            position: 'relative',
                            boxShadow: msg.senderId === 0 
                              ? '0 4px 20px rgba(0, 230, 255, 0.3)' 
                              : '0 4px 20px rgba(0, 0, 0, 0.3)',
                            border: msg.senderId === 0 ? '1px solid #00e6ff44' : '1px solid #333',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              transition: 'transform 0.2s ease',
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="body2" fontWeight={600} color={msg.senderId === 0 ? '#000' : '#00e6ff'}>
                              {msg.sender}
                            </Typography>
                            <Typography variant="caption" color={msg.senderId === 0 ? '#000' : 'textSecondary'}>
                              {msg.timestamp}
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                            {msg.message}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMessageMenu(e, msg)}
                            sx={{ 
                              position: 'absolute', 
                              top: 8, 
                              right: 8, 
                              color: 'inherit',
                              opacity: 0,
                              transition: 'opacity 0.2s ease',
                              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                              '.MuiBox-root:hover &': { opacity: 1 },
                            }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                    <div ref={messagesEndRef} />
                  </Box>

                  {/* Message Input */}
                  <Box sx={{ 
                    p: 3, 
                    borderTop: '1px solid #333',
                    background: 'linear-gradient(90deg, #00e6ff11 0%, transparent 100%)',
                  }}>
                    <Box display="flex" gap={1} mb={2}>
                      <Button
                        size="small"
                        onClick={() => setShowQuickResponses(!showQuickResponses)}
                        sx={{ 
                          color: '#00e6ff',
                          border: '1px solid #00e6ff',
                          borderRadius: 2,
                          '&:hover': { backgroundColor: '#00e6ff22' },
                        }}
                      >
                        Quick Responses
                      </Button>
                      <Tooltip title="Attach File">
                        <IconButton size="small" sx={{ 
                          color: '#00e6ff',
                          border: '1px solid #00e6ff',
                          '&:hover': { backgroundColor: '#00e6ff22' },
                        }}>
                          <AttachFile />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add Emoji">
                        <IconButton size="small" sx={{ 
                          color: '#00e6ff',
                          border: '1px solid #00e6ff',
                          '&:hover': { backgroundColor: '#00e6ff22' },
                        }}>
                          <EmojiEmotions />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    {showQuickResponses && (
                      <Box sx={{ 
                        mb: 3, 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 1,
                        p: 2,
                        backgroundColor: '#222',
                        borderRadius: 2,
                        border: '1px solid #333',
                      }}>
                        {mockChatData.quickResponses.map((response, index) => (
                          <Chip
                            key={index}
                            label={response}
                            size="small"
                            onClick={() => handleQuickResponse(response)}
                            sx={{
                              backgroundColor: '#333',
                              color: '#fff',
                              border: '1px solid #00e6ff',
                              '&:hover': { 
                                backgroundColor: '#00e6ff', 
                                color: '#000',
                                transform: 'scale(1.05)',
                              },
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                            }}
                          />
                        ))}
                      </Box>
                    )}

                    <Box display="flex" gap={2} alignItems="flex-end">
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
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
                      <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        sx={{
                          backgroundColor: '#00e6ff',
                          color: '#000',
                          minWidth: 'auto',
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          '&:hover': { 
                            backgroundColor: '#00b3cc',
                            transform: 'scale(1.05)',
                          },
                          '&:disabled': { 
                            backgroundColor: '#666',
                            color: '#999',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Send />
                      </Button>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#666',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #222 100%)',
                  }}
                >
                  <Support sx={{ 
                    fontSize: 100, 
                    mb: 3, 
                    color: '#00e6ff',
                    opacity: 0.7,
                  }} />
                  <Typography variant="h5" gutterBottom color="#00e6ff" fontWeight={600}>
                    Welcome to Chat & Support
                  </Typography>
                  <Typography variant="body1" textAlign="center" sx={{ maxWidth: 400 }}>
                    Select a contact from the sidebar to start chatting with managers, 
                    support team, or other colleagues
                  </Typography>
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Chip label="Managers" color="primary" />
                    <Chip label="Support" color="secondary" />
                    <Chip label="HR" color="info" />
                    <Chip label="Training" color="success" />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>





      {/* Message Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItemComponent onClick={() => setAnchorEl(null)}>
          <Reply sx={{ mr: 1 }} /> Reply
        </MenuItemComponent>
        <MenuItemComponent onClick={() => setAnchorEl(null)}>
          <Forward sx={{ mr: 1 }} /> Forward
        </MenuItemComponent>
        <MenuItemComponent onClick={() => setAnchorEl(null)}>
          <StarBorder sx={{ mr: 1 }} /> Star
        </MenuItemComponent>
        <MenuItemComponent onClick={() => setAnchorEl(null)}>
          <Download sx={{ mr: 1 }} /> Save
        </MenuItemComponent>
        <Divider />
        <MenuItemComponent onClick={() => setAnchorEl(null)}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItemComponent>
      </Menu>
    </Box>
  );
} 