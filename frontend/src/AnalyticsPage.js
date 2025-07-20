import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const stats = {
  totalLeads: 120,
  converted: 38,
  lost: 22,
  totalCalls: 210,
  totalTasks: 75,
};

const agentPerformance = {
  labels: ["Charlie", "Diana", "Eve"],
  datasets: [
    {
      label: "Leads Converted",
      data: [15, 12, 11],
      backgroundColor: ["#00e6ff", "#00bfff", "#00aaff"],
    },
  ],
};

const sourceData = {
  labels: ["Website", "Ads", "Manual", "Referral"],
  datasets: [
    {
      label: "Leads",
      data: [40, 30, 25, 25],
      backgroundColor: ["#00e6ff", "#00bfff", "#00aaff", "#0077b6"],
    },
  ],
};

const callAnalytics = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Calls",
      data: [30, 28, 35, 25, 40, 32, 20],
      borderColor: "#00e6ff",
      backgroundColor: "#00e6ff33",
      tension: 0.4,
      fill: true,
    },
  ],
};

export default function AnalyticsPage() {
  return (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Paper elevation={6} sx={{
        mb: 4,
        p: 3,
        borderRadius: 6,
        background: 'rgba(24, 24, 32, 0.7)',
        boxShadow: '0 8px 32px 0 #00e6ff33',
        backdropFilter: 'blur(12px)',
      }}>
        <Typography variant="h4" fontWeight={800} color="primary.main" mb={2}>
          Analytics
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={6} md={2.4}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
              <Paper sx={{ p: 2, textAlign: "center", background: "#181818", color: "#00e6ff" }}>
                <Typography variant="h6">Total Leads</Typography>
                <Typography variant="h4" fontWeight={900}>{stats.totalLeads}</Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Paper sx={{ p: 2, textAlign: "center", background: "#181818", color: "#00e6ff" }}>
                <Typography variant="h6">Converted %</Typography>
                <Typography variant="h4" fontWeight={900}>{Math.round((stats.converted / stats.totalLeads) * 100)}%</Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
              <Paper sx={{ p: 2, textAlign: "center", background: "#181818", color: "#00e6ff" }}>
                <Typography variant="h6">Lost %</Typography>
                <Typography variant="h4" fontWeight={900}>{Math.round((stats.lost / stats.totalLeads) * 100)}%</Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7 }}>
              <Paper sx={{ p: 2, textAlign: "center", background: "#181818", color: "#00e6ff" }}>
                <Typography variant="h6">Total Calls</Typography>
                <Typography variant="h4" fontWeight={900}>{stats.totalCalls}</Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
              <Paper sx={{ p: 2, textAlign: "center", background: "#181818", color: "#00e6ff" }}>
                <Typography variant="h6">Total Tasks</Typography>
                <Typography variant="h4" fontWeight={900}>{stats.totalTasks}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <Paper sx={{ p: 2, background: "#181818" }}>
              <Typography variant="subtitle1" color="primary" mb={1}>Agent-wise Lead Conversion</Typography>
              <Bar data={agentPerformance} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <Paper sx={{ p: 2, background: "#181818" }}>
              <Typography variant="subtitle1" color="primary" mb={1}>Lead Source Tracking</Typography>
              <Pie data={sourceData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={12}>
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <Paper sx={{ p: 2, background: "#181818" }}>
              <Typography variant="subtitle1" color="primary" mb={1}>Calls & Follow-ups (Weekly)</Typography>
              <Line data={callAnalytics} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
} 