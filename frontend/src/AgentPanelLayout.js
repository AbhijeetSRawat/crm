import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Avatar,
  useMediaQuery,
  CssBaseline,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AssignmentTurnedIn,
  AccessTime,
  BarChart,
  EmojiEvents,
  Chat,
  Description,
  AccountCircle,
  Event,
  Feedback,
  AttachMoney,
  Flag,
  ExitToApp,
  NoteAdd,
  ListAlt,
  Star,
  Phone,
} from '@mui/icons-material';
import Futuristic3DBackground from './Futuristic3DBackground';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', icon: <BarChart />, id: 'dashboard' },
  { label: 'Notifications', icon: <NotificationsIcon />, id: 'notifications' },
  { label: 'Tasks & To-Do', icon: <AssignmentTurnedIn />, id: 'tasks' },
  { label: 'Call History', icon: <Phone />, id: 'callHistory' },
  { label: 'Attendance', icon: <AccessTime />, id: 'attendance' },
  { label: 'Performance', icon: <BarChart />, id: 'analytics' },
  { label: 'Leaderboard', icon: <EmojiEvents />, id: 'leaderboard' },
  { label: 'Chat/Support', icon: <Chat />, id: 'chat' },
  { label: 'Resources', icon: <Description />, id: 'resources' },
  { label: 'Profile', icon: <AccountCircle />, id: 'profile' },
  { label: 'Leave', icon: <Event />, id: 'leave' },
  { label: 'Scripts/Templates', icon: <NoteAdd />, id: 'scripts' },
  { label: 'Feedback/Notes', icon: <Feedback />, id: 'feedback' },
  { label: 'Calendar', icon: <ListAlt />, id: 'calendar' },
  { label: 'Earnings', icon: <AttachMoney />, id: 'earnings' },
  { label: 'Goals', icon: <Flag />, id: 'goals' },
  { label: 'Logout', icon: <ExitToApp />, id: 'logout' },
];

export default function AgentPanelLayout({ agent, selected, onSelect, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const userRole = agent?.role || 'agent';
  const userName = agent?.name || 'Agent';
  const roleColors = { admin: '#f44336', supervisor: '#ff9800', agent: '#4caf50' };
  const roleLabels = { admin: 'Admin', supervisor: 'Supervisor', agent: 'Agent' };

  const drawer = (
    <Box sx={{ height: '100%', background: '#181818', color: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 2 }}>
        <Avatar sx={{ bgcolor: roleColors[userRole], color: '#fff', fontWeight: 700 }}>{userName.charAt(0).toUpperCase()}</Avatar>
        <Box>
          <Typography fontWeight={700} color="#00e6ff">{userName}</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color={roleColors[userRole]} fontWeight={700}>
              {roleLabels[userRole]}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ borderColor: '#222' }} />
      <List>
        {navItems.map((item) => (
          <Tooltip title={item.label} placement="right" arrow key={item.id}>
            <ListItem
              button
              selected={selected === item.id}
              onClick={() => onSelect(item.id)}
              sx={{
                color: selected === item.id ? '#00e6ff' : '#fff',
                background: selected === item.id ? '#00e6ff22' : 'none',
                '&:hover': { background: '#00e6ff11', color: '#00e6ff' },
                borderRadius: 2,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ color: selected === item.id ? '#00e6ff' : '#fff', minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', position: 'relative' }}>
      <Futuristic3DBackground />
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: '#181818',
          color: '#00e6ff',
          boxShadow: '0 2px 8px #00e6ff22',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight={900} sx={{ flexGrow: 1, letterSpacing: 2 }}>
            TechBro24 Agent Panel
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="agent navigation"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: '#181818', color: '#fff' },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: '#181818', color: '#fff' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: 8,
          minHeight: '100vh',
          background: 'transparent',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 