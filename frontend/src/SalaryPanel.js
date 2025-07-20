import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Download,
  PictureAsPdf,
  TableChart,
  Calculate,
  TrendingUp,
  TrendingDown,
  Visibility,
  Payment,
  AttachMoney,
  Edit,
  Settings,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const salaryStructure = {
  baseSalary: 25000,
  targetIncentive: 15000,
  maxSalary: 50000,
  incentivePercentageOnExtraSales: 10, // 10% on extra sales above target
};

const mockSalaryData = [
  {
    id: 1,
    agent: "Abhishek",
    baseSalary: 25000,
    targetAchievement: 83,
    salesTarget: 150000,
    actualSales: 125000,
    proRataFactor: 0.83,
    incentiveEarned: 0, // No incentive as sales are below target
    deductions: 0,
    totalSalary: 25000,
    status: "Pending",
    month: "July 2024",
    incentivePercentage: 100, // Default 100%, can be adjusted by admin
    isAdjusted: false, // Flag to show if admin has made manual adjustments
    adminNotes: "",
  },
  {
    id: 2,
    agent: "Narayan",
    baseSalary: 25000,
    targetAchievement: 123,
    salesTarget: 150000,
    actualSales: 185000,
    proRataFactor: 1.0, // Exceeded target, full incentive
    incentiveEarned: 3500, // 10% of (185000 - 150000) = 3500
    deductions: 0,
    totalSalary: 28500,
    status: "Approved",
    month: "July 2024",
    incentivePercentage: 100,
    isAdjusted: false,
    adminNotes: "",
  },
  {
    id: 3,
    agent: "Prince",
    baseSalary: 25000,
    targetAchievement: 63,
    salesTarget: 150000,
    actualSales: 95000,
    proRataFactor: 0.63,
    incentiveEarned: 0, // No incentive as sales are below target
    deductions: 0,
    totalSalary: 25000,
    status: "Pending",
    month: "July 2024",
    incentivePercentage: 100,
    isAdjusted: false,
    adminNotes: "",
  },
];

export default function SalaryPanel() {
  const [selectedMonth, setSelectedMonth] = useState("July 2024");
  const [salaryDialog, setSalaryDialog] = useState({ open: false, agent: null });
  const [generateDialog, setGenerateDialog] = useState(false);
  const [adjustmentDialog, setAdjustmentDialog] = useState({ open: false, agent: null });
  const [salaryData, setSalaryData] = useState(mockSalaryData);
  const [globalIncentivePercentage, setGlobalIncentivePercentage] = useState(salaryStructure.incentivePercentageOnExtraSales);

  const calculateSalary = (agent) => {
    let incentiveEarned = 0;
    if (agent.actualSales > agent.salesTarget) {
      const extraSales = agent.actualSales - agent.salesTarget;
      const baseIncentive = Math.round(extraSales * (globalIncentivePercentage / 100));
      incentiveEarned = Math.round(baseIncentive * (agent.incentivePercentage / 100));
    }
    const totalSalary = agent.baseSalary + incentiveEarned - agent.deductions;
    return {
      incentiveEarned,
      totalSalary
    };
  };

  const handleGenerateSalary = () => {
    // Recalculate all salaries with current adjustments
    const updatedData = salaryData.map(agent => {
      const calculated = calculateSalary(agent);
      return {
        ...agent,
        incentiveEarned: calculated.incentiveEarned,
        totalSalary: calculated.totalSalary,
        status: "Pending" // Reset status for new month
      };
    });
    
    setSalaryData(updatedData);
    alert("Salary sheets generated successfully for " + selectedMonth);
    setGenerateDialog(false);
  };

  const handleAdjustSalary = (agent) => {
    setAdjustmentDialog({ open: true, agent });
  };

  const handleSaveAdjustment = (adjustedAgent) => {
    const calculated = calculateSalary(adjustedAgent);
    const updatedAgent = {
      ...adjustedAgent,
      incentiveEarned: calculated.incentiveEarned,
      totalSalary: calculated.totalSalary,
      isAdjusted: true,
      status: "Pending" // Reset to pending for admin review
    };

    const updatedData = salaryData.map(agent => 
      agent.id === updatedAgent.id ? updatedAgent : agent
    );
    
    setSalaryData(updatedData);
    setAdjustmentDialog({ open: false, agent: null });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "success";
      case "Pending": return "warning";
      case "Rejected": return "error";
      default: return "default";
    }
  };

  const totalPayroll = salaryData.reduce((sum, agent) => sum + agent.totalSalary, 0);
  const averageSalary = Math.round(totalPayroll / salaryData.length);

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={800} color="primary.main">
          Salary Management & Payroll
        </Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="July 2024">July 2024</MenuItem>
              <MenuItem value="June 2024">June 2024</MenuItem>
              <MenuItem value="May 2024">May 2024</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Calculate />}
            onClick={() => setGenerateDialog(true)}
          >
            Generate Salary
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
          >
            Export Payroll
          </Button>
        </Box>
      </Box>

      {/* Global Settings Card */}
      <Card sx={{ background: "#181818", color: "#fff", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" color="primary" mb={2}>Global Incentive Settings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Current Incentive Rate</Typography>
              <Typography variant="h5" fontWeight={600} color="success.main">
                {globalIncentivePercentage}% on Extra Sales
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Applied to sales above target only
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Agents Earning Incentive</Typography>
              <Typography variant="h5" fontWeight={600} color="warning.main">
                {salaryData.filter(a => a.actualSales > a.salesTarget).length} / {salaryData.length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Agents who exceeded their targets
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Salary Overview Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
            <Card sx={{ background: "#181818", color: "#fff" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Payroll</Typography>
                <Typography variant="h4" fontWeight={900} color="success.main">
                  ₹{totalPayroll.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main">This month</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card sx={{ background: "#181818", color: "#fff" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Average Salary</Typography>
                <Typography variant="h4" fontWeight={900} color="primary.main">
                  ₹{averageSalary.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main">Per agent</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
            <Card sx={{ background: "#181818", color: "#fff" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Pro-Rata Cases</Typography>
                <Typography variant="h4" fontWeight={900} color="warning.main">
                  {salaryData.filter(a => a.proRataFactor < 1).length}
                </Typography>
                <Typography variant="body2" color="warning.main">Target not met</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7 }}>
            <Card sx={{ background: "#181818", color: "#fff" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Pending Approvals</Typography>
                <Typography variant="h4" fontWeight={900} color="info.main">
                  {salaryData.filter(a => a.status === "Pending").length}
                </Typography>
                <Typography variant="body2" color="info.main">Awaiting approval</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
            <Card sx={{ background: "#181818", color: "#fff" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Admin Adjustments</Typography>
                <Typography variant="h4" fontWeight={900} color="warning.main">
                  {salaryData.filter(a => a.isAdjusted).length}
                </Typography>
                <Typography variant="body2" color="warning.main">Manually adjusted</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Salary Table */}
      <Card sx={{ background: "#181818", color: "#fff" }}>
        <CardContent>
          <Typography variant="h6" color="primary" mb={2}>Salary Sheet - {selectedMonth}</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Agent</TableCell>
                  <TableCell>Base Salary</TableCell>
                  <TableCell>Target Achievement</TableCell>
                  <TableCell>Pro-Rata Factor</TableCell>
                  <TableCell>Incentive Earned</TableCell>
                  <TableCell>Deductions</TableCell>
                  <TableCell>Total Salary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Adjustment</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaryData.map((agent) => (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell>{agent.agent}</TableCell>
                    <TableCell>₹{agent.baseSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" mr={1}>{agent.targetAchievement}%</Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={agent.targetAchievement} 
                          sx={{ width: 60, backgroundColor: "#333", "& .MuiLinearProgress-bar": { backgroundColor: agent.targetAchievement >= 100 ? "#4caf50" : "#ff9800" } }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${(agent.proRataFactor * 100).toFixed(0)}%`} 
                        color={agent.proRataFactor < 1 ? "warning" : "success"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>₹{agent.incentiveEarned.toLocaleString()}</TableCell>
                    <TableCell>₹{agent.deductions.toLocaleString()}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        ₹{agent.totalSalary.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={agent.status} color={getStatusColor(agent.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      {agent.isAdjusted ? (
                        <Chip 
                          label="Adjusted" 
                          color="warning" 
                          size="small" 
                          icon={<Settings />}
                          title={`Incentive: ${agent.incentivePercentage}%`}
                        />
                      ) : (
                        <Chip label="Auto" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => setSalaryDialog({ open: true, agent })}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton color="primary" size="small">
                        <Download />
                      </IconButton>
                      <IconButton color="success" size="small">
                        <Payment />
                      </IconButton>
                      <IconButton color="info" size="small" onClick={() => handleAdjustSalary(agent)}>
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Salary Details Dialog */}
      <Dialog open={salaryDialog.open} onClose={() => setSalaryDialog({ open: false, agent: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          Salary Details - {salaryDialog.agent?.agent}
        </DialogTitle>
        <DialogContent>
          {salaryDialog.agent && (
            <Box>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="primary">Base Salary</Typography>
                  <Typography variant="h6">₹{salaryDialog.agent.baseSalary.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="primary">Target Achievement</Typography>
                  <Typography variant="h6">{salaryDialog.agent.targetAchievement}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="primary">Sales Target</Typography>
                  <Typography variant="h6">₹{salaryDialog.agent.salesTarget.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="primary">Actual Sales</Typography>
                  <Typography variant="h6">₹{salaryDialog.agent.actualSales.toLocaleString()}</Typography>
                </Grid>
              </Grid>
              
              {salaryDialog.agent.isAdjusted && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#fff3cd', borderRadius: 1, border: '1px solid #ffeaa7' }}>
                  <Typography variant="subtitle2" color="warning.main" fontWeight={600}>
                    ⚠️ Admin Adjustments Applied
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Incentive: {salaryDialog.agent.incentivePercentage}%
                  </Typography>
                  {salaryDialog.agent.adminNotes && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Notes: {salaryDialog.agent.adminNotes}
                    </Typography>
                  )}
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="primary" mb={1}>Salary Breakdown</Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Base Salary" />
                  <Typography>₹{salaryDialog.agent.baseSalary.toLocaleString()}</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Target Incentive" 
                    secondary={
                      salaryDialog.agent.actualSales > salaryDialog.agent.salesTarget 
                        ? `₹${(salaryDialog.agent.actualSales - salaryDialog.agent.salesTarget).toLocaleString()} extra sales × ${globalIncentivePercentage}%${salaryDialog.agent.isAdjusted ? ` (Admin: ${salaryDialog.agent.incentivePercentage}%)` : ''}`
                        : `No incentive - target not exceeded${salaryDialog.agent.isAdjusted ? ` (Admin: ${salaryDialog.agent.incentivePercentage}%)` : ''}`
                    }
                  />
                  <Typography color="success.main">+₹{salaryDialog.agent.incentiveEarned.toLocaleString()}</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Deductions" />
                  <Typography color="error.main">-₹{salaryDialog.agent.deductions.toLocaleString()}</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Total Salary" />
                  <Typography variant="h6" color="success.main" fontWeight={600}>
                    ₹{salaryDialog.agent.totalSalary.toLocaleString()}
                  </Typography>
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSalaryDialog({ open: false, agent: null })}>Close</Button>
          <Button variant="contained" startIcon={<Download />}>
            Download Slip
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Salary Dialog */}
      <Dialog open={generateDialog} onClose={() => setGenerateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Salary Sheets</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" mb={2}>
            This will automatically calculate salaries based on performance and generate salary sheets for {selectedMonth}.
          </Typography>
          
          <Typography variant="subtitle2" color="primary" mb={1}>
            Global Incentive Settings
          </Typography>
          <TextField
            label="Incentive Percentage on Extra Sales (%)"
            type="number"
            value={globalIncentivePercentage}
            onChange={(e) => setGlobalIncentivePercentage(parseInt(e.target.value) || 0)}
            fullWidth
            margin="dense"
            helperText="Percentage of extra sales above target that agents will earn as incentive"
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="July 2024">July 2024</MenuItem>
              <MenuItem value="June 2024">June 2024</MenuItem>
              <MenuItem value="May 2024">May 2024</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="info.main" fontWeight={600}>
              💡 Incentive Calculation:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Incentive = (Actual Sales - Target) × {globalIncentivePercentage}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Only earned when actual sales exceed target
            </Typography>
          </Box>
          
          <Typography variant="body2" color="warning.main">
            ⚠️ Pro-rata calculations will be applied for agents who haven't met their targets.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleGenerateSalary}>
            Generate Salary Sheets
          </Button>
        </DialogActions>
      </Dialog>

      {/* Salary Adjustment Dialog */}
      <Dialog open={adjustmentDialog.open} onClose={() => setAdjustmentDialog({ open: false, agent: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Adjust Salary for {adjustmentDialog.agent?.agent}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary">Base Salary</Typography>
              <Typography variant="h6">₹{adjustmentDialog.agent?.baseSalary.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary">Target Achievement</Typography>
              <Typography variant="h6">{adjustmentDialog.agent?.targetAchievement}%</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary">Pro-Rata Factor</Typography>
              <Typography variant="h6">{(adjustmentDialog.agent?.proRataFactor * 100).toFixed(0)}%</Typography>
            </Grid>
                         <Grid item xs={12}>
               <Typography variant="subtitle2" color="primary">Extra Sales Above Target</Typography>
               <Typography variant="h6">
                 {adjustmentDialog.agent?.actualSales > adjustmentDialog.agent?.salesTarget 
                   ? `₹${(adjustmentDialog.agent.actualSales - adjustmentDialog.agent.salesTarget).toLocaleString()}`
                   : "₹0 (Target not exceeded)"
                 }
               </Typography>
             </Grid>
             <Grid item xs={12}>
               <Typography variant="subtitle2" color="primary">Current Incentive Earned</Typography>
               <Typography variant="h6">₹{adjustmentDialog.agent?.incentiveEarned.toLocaleString()}</Typography>
               <Typography variant="caption" color="textSecondary">
                 Based on {globalIncentivePercentage}% of extra sales
               </Typography>
             </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary">Current Total Salary</Typography>
              <Typography variant="h6">₹{adjustmentDialog.agent?.totalSalary.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={adjustmentDialog.agent?.isAdjusted} 
                    onChange={(e) => {
                      const updatedAgent = {
                        ...adjustmentDialog.agent,
                        isAdjusted: e.target.checked,
                        incentivePercentage: e.target.checked ? 100 : 100, // Reset to 100% if adjusted
                      };
                      setSalaryData(salaryData.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent));
                    }}
                    name="isAdjusted"
                    color="primary"
                  />
                } 
                label="Admin has made manual adjustments to this agent's salary." 
              />
            </Grid>
            <Grid item xs={12}>
                             <Typography variant="subtitle2" color="primary" mb={1}>
                 Global Incentive Rate: {globalIncentivePercentage}% on extra sales
               </Typography>
               <TextField
                 label="Incentive Percentage (%) - Admin Override"
                 type="number"
                 value={adjustmentDialog.agent?.incentivePercentage}
                 onChange={(e) => {
                   const updatedAgent = {
                     ...adjustmentDialog.agent,
                     incentivePercentage: parseInt(e.target.value) || 0,
                   };
                   setSalaryData(salaryData.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent));
                 }}
                 fullWidth
                 margin="dense"
                 helperText={`Multiplier on the global ${globalIncentivePercentage}% rate. 100% = normal rate, 120% = 20% bonus, 80% = 20% reduction`}
                 sx={{ mb: 2 }}
               />
              <TextField
                label="Admin Notes (Optional)"
                multiline
                rows={2}
                value={adjustmentDialog.agent?.adminNotes || ""}
                onChange={(e) => {
                  const updatedAgent = {
                    ...adjustmentDialog.agent,
                    adminNotes: e.target.value,
                  };
                  setSalaryData(salaryData.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent));
                }}
                fullWidth
                margin="dense"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustmentDialog({ open: false, agent: null })}>Cancel</Button>
          <Button variant="contained" onClick={() => handleSaveAdjustment(adjustmentDialog.agent)}>
            Save Adjustment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 