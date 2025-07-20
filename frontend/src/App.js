import React from "react";
import { Box, Button, Typography, CssBaseline, ThemeProvider, createTheme, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, InputAdornment, Alert, CircularProgress, Snackbar } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DashboardLayout from "./DashboardLayout";
import UsersPage from "./UsersPage";
import LeadsPage from "./LeadsPage";
import CallsPage from "./CallsPage";
import TasksPage from "./TasksPage";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./SettingsPage";
import DashboardPage from "./DashboardPage";
import AgentManagementPage from "./AgentManagementPage";
import ReportsPage from "./ReportsPage";
import SalaryPanel from "./SalaryPanel";
import AgentApp from "./AgentApp";
import ScreenMonitoring from "./ScreenMonitoring";
import MonitoringDashboard from "./MonitoringDashboard";
import RoleManagement from "./RoleManagement";
import LeadReminders from "./LeadReminders";
import InternalReminders from "./InternalReminders";
import { RealtimeProvider } from "./contexts/RealtimeContext";
import authService from "./services/auth";
import AdminAttendance from './AdminAttendance';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00e6ff" }, // neon blue
    background: { default: "#0a0a0a", paper: "#181818" },
    text: { primary: "#fff", secondary: "#00e6ff" },
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial',
    h2: { fontWeight: 900, letterSpacing: 2 },
  },
});

export default function App() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [nav, setNav] = useState("Dashboard");
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [userType, setUserType] = useState("admin");
  const [userRole, setUserRole] = useState("admin");
  const [currentUser, setCurrentUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await authService.checkAuth();
        if (authStatus.authenticated) {
          setLoggedIn(true);
          setCurrentUser(authService.getUser());
          setUserRole(authService.getUserRole());
        } else {
          setLoggedIn(false);
          setCurrentUser(null);
          setUserRole('admin');
        }
      } catch (error) {
        setLoggedIn(false);
        setCurrentUser(null);
        setUserRole('admin');
        console.error('Auth check failed:', error);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    if (userType === 'agent') {
      if (!form.username || !form.password) {
        setError("Please enter both Agent ID and password.");
        setSnackbar({ open: true, message: 'Please enter both Agent ID and password.', severity: 'error' });
        return;
      }
    } else {
      if (!form.email || !form.password) {
        setError("Please enter both email and password.");
        setSnackbar({ open: true, message: 'Please enter both email and password.', severity: 'error' });
        return;
      }
    }
    setLoading(true);
    setError("");
    try {
      let response;
      if (userType === 'agent') {
        response = await authService.login(form.username, form.password, userType);
      } else {
        response = await authService.login(form.email, form.password, userType);
      }
      if (response.success) {
        setLoggedIn(true);
        setCurrentUser(response.data.user);
        setUserRole(response.data.user.role);
        setOpen(false);
        setForm({ email: "", password: "", username: "" });
        setSnackbar({ open: true, message: `Welcome, ${response.data.user.name} (${response.data.user.role})!`, severity: 'success' });
      }
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.");
      setSnackbar({ open: true, message: error.message || 'Login failed.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setLoggedIn(false);
      setCurrentUser(null);
      setUserRole("admin");
      setNav("Dashboard");
      setLogoutDialog(false);
      setSnackbar({ open: true, message: 'Logged out successfully.', severity: 'success' });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setLoggedIn(false);
      setCurrentUser(null);
      setUserRole("admin");
      setNav("Dashboard");
      setLogoutDialog(false);
      setSnackbar({ open: true, message: 'Logout error. Forced logout.', severity: 'warning' });
    }
  };

  // If user type is agent, show agent app with monitoring
  if (userType === "agent" && loggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RealtimeProvider>
          <Box sx={{ position: 'relative' }}>
            <AgentApp />
            <ScreenMonitoring userRole="agent" />
          </Box>
        </RealtimeProvider>
      </ThemeProvider>
    );
  }

  if (!loggedIn && !authChecked) {
    // Don't render anything until auth check is complete
    return null;
  }

  if (loggedIn) {
    const handleNav = (navItem) => {
      if (navItem === "Logout") setLogoutDialog(true);
      else setNav(navItem);
    };
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RealtimeProvider>
          <DashboardLayout onNav={handleNav} currentUser={currentUser}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Welcome message with role badge */}
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: currentUser?.role === 'admin' ? '#f44336' : currentUser?.role === 'supervisor' ? '#ff9800' : '#4caf50', color: '#fff', fontWeight: 700 }}>{currentUser?.name?.charAt(0).toUpperCase() || 'U'}</Avatar>
                <Typography variant="h5" fontWeight={900} color="#00e6ff">
                  Welcome, {currentUser?.name || 'User'}
                </Typography>
                <Box ml={1}>
                  <Typography variant="caption" fontWeight={700} color={currentUser?.role === 'admin' ? '#f44336' : currentUser?.role === 'supervisor' ? '#ff9800' : '#4caf50'}>
                    {currentUser?.role?.charAt(0).toUpperCase() + currentUser?.role?.slice(1) || 'User'}
                  </Typography>
                </Box>
              </Box>
              {/* Main content */}
              {nav === "Dashboard" ? (
                <DashboardPage />
              ) : nav === "Agent Management" ? (
                <AgentManagementPage />
              ) : nav === "Leads" ? (
                <LeadsPage />
              ) : nav === "Calls" ? (
                <CallsPage />
              ) : nav === "Tasks" ? (
                <TasksPage />
              ) : nav === "Lead Reminders" ? (
                <LeadReminders />
              ) : nav === "Internal Reminders" ? (
                <InternalReminders />
              ) : nav === "Analytics" ? (
                <AnalyticsPage />
              ) : nav === "Salary" ? (
                <SalaryPanel />
              ) : nav === "Reports" ? (
                <ReportsPage />
              ) : nav === "Monitoring" ? (
                <MonitoringDashboard userRole={userRole} />
              ) : nav === "Role Management" ? (
                <RoleManagement />
              ) : nav === "Settings" ? (
                <SettingsPage />
              ) : nav === "Admin Attendance" ? (
                <AdminAttendance />
              ) : (
                <>
                  <Typography variant="h4" sx={{ color: "primary.main", fontWeight: 800, mb: 2 }}>
                    {nav}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#fff" }}>
                    {`This is the ${nav} section. More features coming soon.`}
                  </Typography>
                </>
              )}
            </motion.div>
            {/* Logout Confirmation Dialog */}
            <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to log out?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setLogoutDialog(false)}>Cancel</Button>
                <Button color="error" variant="contained" onClick={handleLogout}>Logout</Button>
              </DialogActions>
            </Dialog>
          </DashboardLayout>
          <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </RealtimeProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ background: "linear-gradient(135deg, #0a0a0a 60%, #00e6ff 100%)" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "primary.main",
              textShadow: "0 0 16px #00e6ff, 0 0 32px #00e6ff",
              mb: 2,
              fontSize: { xs: 36, sm: 48, md: 64 },
              textAlign: "center",
            }}
          >
            TechBro24
          </Typography>
        </motion.div>
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <Typography variant="subtitle1" sx={{ color: "#fff", mb: 4, textAlign: "center" }}>
            TechBro24 CRM System
          </Typography>
          <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(90deg, #00e6ff 40%, #fff 100%)",
                color: "#0a0a0a",
                fontWeight: 700,
                fontSize: 18,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                boxShadow: "0 0 16px #00e6ff",
                transition: "transform 0.2s",
                '&:hover': { transform: 'scale(1.08)', background: "#00e6ff", color: "#fff" },
              }}
              component={motion.button}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setUserType("admin");
                setOpen(true);
              }}
            >
              Admin Login
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "#00e6ff",
                color: "#00e6ff",
                fontWeight: 700,
                fontSize: 18,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                borderWidth: 2,
                transition: "transform 0.2s",
                '&:hover': {
                  transform: 'scale(1.08)',
                  borderColor: "#0099cc",
                  backgroundColor: "rgba(0, 230, 255, 0.1)",
                  color: "#0099cc"
                },
              }}
              component={motion.button}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setUserType("agent");
                setOpen(true);
              }}
            >
              Agent Portal
            </Button>
          </Box>
        </motion.div>

        {/* Login Dialog */}
        <Dialog open={open && !loggedIn && authChecked} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: "#00e6ff", textAlign: "center", fontWeight: 700 }}>
            {userType === "admin" ? "Admin Login" : "Agent Login"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {userType === "agent" ? (
                <TextField
                  fullWidth
                  label="Agent ID"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  disabled={loading}
                />
              ) : (
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  disabled={loading}
                />
              )}
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {userType === "agent" && (
                <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 2 }}>
                  Enter your Agent ID and password to login.
                </Typography>
              )}
              {userType === "admin" && (
                <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 2 }}>
                  Admin credentials: admin@techbro24.com / password
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleLogin}
              variant="contained"
              disabled={loading}
              sx={{ backgroundColor: "#00e6ff", color: "#000" }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Login"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
