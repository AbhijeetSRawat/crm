import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  IconButton,
  Paper,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Add,
  Call,
  Assignment,
  Person,
  Schedule,
  CheckCircle,
  Warning,
  Info,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Line, Doughnut } from "react-chartjs-2";
import Futuristic3DBackground from './Futuristic3DBackground';
import logo from './logo.svg';

const trackingData = {
  totalLeads: 120,
  activeLeads: 85,
  convertedLeads: 38,
  lostLeads: 22,
  totalCalls: 210,
  completedTasks: 65,
  pendingTasks: 10,
  conversionRate: 31.7,
  weeklyGrowth: 12.5,
};

const weeklyData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Leads",
      data: [15, 18, 22, 19, 25, 20, 16],
      borderColor: "#00e6ff",
      backgroundColor: "#00e6ff33",
      tension: 0.4,
    },
    {
      label: "Calls",
      data: [30, 35, 40, 38, 45, 42, 35],
      borderColor: "#00bfff",
      backgroundColor: "#00bfff33",
      tension: 0.4,
    },
  ],
};

const sourceData = {
  labels: ["Website", "Ads", "Manual", "Referral"],
  datasets: [
    {
      data: [40, 30, 20, 10],
      backgroundColor: ["#00e6ff", "#00bfff", "#00aaff", "#0077b6"],
    },
  ],
};

const recentActivity = [
  { id: 1, type: "call", message: "Call completed with Acme Corp", time: "2 min ago", status: "success" },
  { id: 2, type: "lead", message: "New lead added: Beta Ltd", time: "15 min ago", status: "info" },
  { id: 3, type: "task", message: "Follow-up task completed", time: "1 hour ago", status: "success" },
  { id: 4, type: "lead", message: "Lead converted: Gamma Inc", time: "2 hours ago", status: "success" },
  { id: 5, type: "call", message: "Missed call from Delta Corp", time: "3 hours ago", status: "warning" },
];

const getStatusIcon = (type) => {
  switch (type) {
    case "call": return <Call />;
    case "lead": return <Person />;
    case "task": return <Assignment />;
    default: return <Info />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "success": return "success";
    case "warning": return "warning";
    case "info": return "primary";
    default: return "default";
  }
};

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  return (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      {/* Glassmorphic Hero Section */}
      <Paper elevation={6} sx={{
        mb: 4,
        p: 4,
        borderRadius: 6,
        background: 'rgba(24, 24, 32, 0.7)',
        boxShadow: '0 8px 32px 0 #00e6ff33',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        <Box display="flex" alignItems="center" gap={3}>
          <motion.img
            src={logo}
            alt="Logo"
            style={{ width: 90, height: 90, filter: 'drop-shadow(0 0 24px #00e6ff)' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          />
          <Box>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Typography variant="h3" fontWeight={900} color="#00e6ff" sx={{ letterSpacing: 2, mb: 1 }}>
                Welcome to TechBro24 CRM
              </Typography>
              <Typography variant="h6" color="#fff" sx={{ opacity: 0.85 }}>
                Your futuristic, real-time sales & calling dashboard
              </Typography>
            </motion.div>
          </Box>
        </Box>
        {/* Remove the Add New Lead button from dashboard home */}
        {/* <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
          <Button variant="contained" color="primary" size="large" sx={{ fontWeight: 700, px: 4, py: 1.5, borderRadius: 3, boxShadow: '0 0 16px #00e6ff88' }}>
            + Add New Lead
          </Button>
        </motion.div> */}
      </Paper>
      {/* Tracking Cards */}
      <Grid container spacing={3} mb={3}>
        {[
          {
            label: 'Total Leads',
            value: trackingData.totalLeads,
            icon: <Person sx={{ fontSize: 40, color: "#00e6ff" }} />,
            color: 'primary.main',
            growth: `+${trackingData.weeklyGrowth}%`,
            growthIcon: <TrendingUp color="success" fontSize="small" />,
          },
          {
            label: 'Conversion Rate',
            value: `${trackingData.conversionRate}%`,
            icon: <TrendingUp sx={{ fontSize: 40, color: "#00e6ff" }} />,
            color: 'success.main',
            growth: null,
          },
          {
            label: 'Total Calls',
            value: trackingData.totalCalls,
            icon: <Call sx={{ fontSize: 40, color: "#00e6ff" }} />,
            color: 'primary.main',
            growth: null,
          },
          {
            label: 'Tasks Completed',
            value: trackingData.completedTasks,
            icon: <CheckCircle sx={{ fontSize: 40, color: "#00e6ff" }} />,
            color: 'success.main',
            growth: `${trackingData.pendingTasks} pending`,
            growthColor: 'warning.main',
          },
        ].map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 + i * 0.1 }}>
              <Card sx={{
                background: 'rgba(24, 24, 32, 0.7)',
                color: '#fff',
                borderRadius: 4,
                boxShadow: '0 4px 24px 0 #00e6ff22',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid #00e6ff33',
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>{card.label}</Typography>
                      <Typography variant="h4" fontWeight={900} color={card.color}>{card.value}</Typography>
                      {card.growth && (
                        <Box display="flex" alignItems="center" mt={1}>
                          {card.growthIcon}
                          <Typography variant="body2" color={card.growthColor || "success.main"} ml={0.5}>{card.growth}</Typography>
                        </Box>
                      )}
                    </Box>
                    {card.icon}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      {/* Charts and Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <Card sx={{
              background: 'rgba(24, 24, 32, 0.7)',
              color: '#fff',
              borderRadius: 4,
              boxShadow: '0 4px 24px 0 #00e6ff22',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid #00e6ff33',
            }}>
              <CardContent>
                <Typography variant="h6" color="primary" mb={2}>Weekly Performance</Typography>
                <Line data={weeklyData} options={{
                  responsive: true,
                  plugins: { legend: { labels: { color: "#fff" } } },
                  scales: {
                    x: { ticks: { color: "#fff" } },
                    y: { ticks: { color: "#fff" } }
                  }
                }} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <Card sx={{
              background: 'rgba(24, 24, 32, 0.7)',
              color: '#fff',
              borderRadius: 4,
              boxShadow: '0 4px 24px 0 #00e6ff22',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid #00e6ff33',
              height: "100%"
            }}>
              <CardContent>
                <Typography variant="h6" color="primary" mb={2}>Lead Sources</Typography>
                <Doughnut data={sourceData} options={{
                  responsive: true,
                  plugins: { legend: { position: "bottom", labels: { color: "#fff" } } }
                }} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <Card sx={{
              background: 'rgba(24, 24, 32, 0.7)',
              color: '#fff',
              borderRadius: 4,
              boxShadow: '0 4px 24px 0 #00e6ff22',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid #00e6ff33',
            }}>
              <CardContent>
                <Typography variant="h6" color="primary" mb={2}>Recent Activity</Typography>
                <List>
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem>
                        <ListItemIcon sx={{ color: "#00e6ff" }}>
                          {getStatusIcon(activity.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.message}
                          secondary={activity.time}
                        />
                        <Chip label={activity.status} color={getStatusColor(activity.status)} size="small" />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
} 