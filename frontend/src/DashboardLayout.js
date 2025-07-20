import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Call as CallIcon,
  EventNote as EventNoteIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  AttachMoney,
  Security,
  AdminPanelSettings,
  Message,
  Notifications,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Agent Management", icon: <PeopleIcon /> },
  { label: "Leads", icon: <AssignmentIcon /> },
  { label: "Calls", icon: <CallIcon /> },
  { label: "Tasks", icon: <EventNoteIcon /> },
  { label: "Lead Reminders", icon: <Message /> },
  { label: "Internal Reminders", icon: <Notifications /> },
  { label: "Analytics", icon: <BarChartIcon /> },
  { label: "Salary", icon: <AttachMoney /> },
  { label: "Monitoring", icon: <Security /> },
  { label: "Role Management", icon: <AdminPanelSettings /> },
  { label: "Reports", icon: <BarChartIcon /> },
  { label: "Settings", icon: <SettingsIcon /> },
  { label: "Logout", icon: <LogoutIcon /> },
];

const drawerWidth = 220;

export default function DashboardLayout({ children, onNav, currentUser }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile);

  const handleDrawerToggle = () => setOpen((o) => !o);

  const userRole = currentUser?.role || 'admin';
  const userName = currentUser?.name || 'Admin';
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
          <motion.div
            key={item.label}
            whileHover={{ scale: 1.05, backgroundColor: "#222" }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Tooltip title={item.label} placement="right" arrow>
              <ListItem button onClick={() => onNav && onNav(item.label)}>
                <ListItemIcon sx={{ color: "#00e6ff" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            </Tooltip>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#10151a" }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, background: "#0a0a0a" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 900, letterSpacing: 2, color: "#00e6ff" }}>
            TechBro24 CRM
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: "#181818",
            color: "#fff",
            borderRight: "1px solid #222",
          },
        }}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#00e6ff", fontWeight: 700 }}>
            Menu
          </Typography>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle} color="inherit">
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        <Divider />
        {drawer}
      </Drawer>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: 8,
          minHeight: "100vh",
          background: "linear-gradient(135deg, #10151a 60%, #00e6ff22 100%)",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 