import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  Download,
  PictureAsPdf,
  Visibility,
  CalendarToday,
  AccountBalance,
  Receipt,
  Assessment,
  BarChart,
  PieChart,
  Timeline,
  GetApp,
  Print,
  Share,
  Email,
  CloudDownload,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';

// Mock earnings data
const mockEarningsData = {
  currentMonth: {
    baseSalary: 25000,
    incentives: 6250,
    bonuses: 5000,
    deductions: 2500,
    totalEarnings: 33750,
    targetAchievement: 85,
    salesCount: 12,
    totalSales: 180000,
  },
  monthlyBreakdown: [
    {
      month: 'July 2024',
      baseSalary: 25000,
      incentives: 6250,
      bonuses: 5000,
      deductions: 2500,
      total: 33750,
      status: 'Paid',
    },
    {
      month: 'June 2024',
      baseSalary: 25000,
      incentives: 4500,
      bonuses: 3000,
      deductions: 2500,
      total: 30000,
      status: 'Paid',
    },
    {
      month: 'May 2024',
      baseSalary: 25000,
      incentives: 7500,
      bonuses: 4000,
      deductions: 2500,
      total: 34000,
      status: 'Paid',
    },
    {
      month: 'April 2024',
      baseSalary: 25000,
      incentives: 5500,
      bonuses: 2000,
      deductions: 2500,
      total: 30000,
      status: 'Paid',
    },
  ],
  payslips: [
    { id: 1, month: 'July 2024', amount: 33750, status: 'Available', date: '2024-07-31' },
    { id: 2, month: 'June 2024', amount: 30000, status: 'Available', date: '2024-06-30' },
    { id: 3, month: 'May 2024', amount: 34000, status: 'Available', date: '2024-05-31' },
    { id: 4, month: 'April 2024', amount: 30000, status: 'Available', date: '2024-04-30' },
  ],
};

export default function AgentEarnings() {
  const [selectedMonth, setSelectedMonth] = useState('current');
  const [showPayslipDialog, setShowPayslipDialog] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const handleDownloadPayslip = (payslip) => {
    // In real app, this would download the actual PDF
    alert(`Downloading payslip for ${payslip.month}`);
  };

  const handleViewPayslip = (payslip) => {
    setSelectedPayslip(payslip);
    setShowPayslipDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Available': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <AttachMoney sx={{ fontSize: 40, color: '#00e6ff' }} />
        <Box>
          <Typography variant="h4" fontWeight={900} color="#00e6ff">
            Earnings Breakdown
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Salary, incentives, and downloadable payslips
          </Typography>
        </Box>
        <Box flex={1} />
        <Button
          variant="contained"
          startIcon={<PictureAsPdf />}
          onClick={() => handleDownloadPayslip(mockEarningsData.payslips[0])}
          sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, borderRadius: 2, '&:hover': { background: '#00b3cc' } }}
        >
          Download Latest Payslip
        </Button>
      </Box>

      {/* Current Month Overview */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography color="textSecondary" variant="body2">Base Salary</Typography>
                <AccountBalance sx={{ color: '#00e6ff' }} />
              </Box>
              <Typography variant="h4" fontWeight={900} color="#00e6ff">
                ₹{mockEarningsData.currentMonth.baseSalary.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Fixed monthly salary
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography color="textSecondary" variant="body2">Incentives</Typography>
                <TrendingUp sx={{ color: '#4caf50' }} />
              </Box>
              <Typography variant="h4" fontWeight={900} color="#4caf50">
                ₹{mockEarningsData.currentMonth.incentives.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Performance based
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography color="textSecondary" variant="body2">Bonuses</Typography>
                <BarChart sx={{ color: '#ff9800' }} />
              </Box>
              <Typography variant="h4" fontWeight={900} color="#ff9800">
                ₹{mockEarningsData.currentMonth.bonuses.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Achievement rewards
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography color="textSecondary" variant="body2">Total Earnings</Typography>
                <AttachMoney sx={{ color: '#2196f3' }} />
              </Box>
              <Typography variant="h4" fontWeight={900} color="#2196f3">
                ₹{mockEarningsData.currentMonth.totalEarnings.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={2}>
                Target Achievement
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h3" fontWeight={900} color="#00e6ff">
                  {mockEarningsData.currentMonth.targetAchievement}%
                </Typography>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Target: ₹150,000
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Achieved: ₹{mockEarningsData.currentMonth.totalSales.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={mockEarningsData.currentMonth.targetAchievement}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#333',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#00e6ff',
                    borderRadius: 4,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={2}>
                Sales Performance
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" fontWeight={900} color="#4caf50">
                    {mockEarningsData.currentMonth.salesCount}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Deals Closed
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" fontWeight={900} color="#ff9800">
                    ₹{(mockEarningsData.currentMonth.totalSales / mockEarningsData.currentMonth.salesCount).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg Deal Size
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Breakdown Table */}
      <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={2}>
            Monthly Earnings Breakdown
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Month</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Base Salary</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Incentives</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Bonuses</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Deductions</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Total</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockEarningsData.monthlyBreakdown.map((row) => (
                  <TableRow key={row.month} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {row.month}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#00e6ff">
                        ₹{row.baseSalary.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#4caf50">
                        ₹{row.incentives.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#ff9800">
                        ₹{row.bonuses.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#f44336">
                        -₹{row.deductions.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="#2196f3">
                        ₹{row.total.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={getStatusColor(row.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Payslips */}
      <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={2}>
            Payslips
          </Typography>
          <Grid container spacing={2}>
            {mockEarningsData.payslips.map((payslip) => (
              <Grid item xs={12} md={6} lg={3} key={payslip.id}>
                <Paper sx={{ background: '#222', border: '1px solid #333', borderRadius: 2, p: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight={600} color="#00e6ff">
                      {payslip.month}
                    </Typography>
                    <Chip
                      label={payslip.status}
                      color={getStatusColor(payslip.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="h5" fontWeight={900} color="#fff" mb={1}>
                    ₹{payslip.amount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    Generated: {payslip.date}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewPayslip(payslip)}
                      sx={{ color: '#00e6ff', borderColor: '#00e6ff', '&:hover': { borderColor: '#00b3cc' } }}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => handleDownloadPayslip(payslip)}
                      sx={{ background: '#00e6ff', color: '#000', '&:hover': { background: '#00b3cc' } }}
                    >
                      Download
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Payslip View Dialog */}
      <Dialog
        open={showPayslipDialog}
        onClose={() => setShowPayslipDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            color: '#fff',
            borderRadius: 3,
            border: '1px solid #333',
          }
        }}
      >
        <DialogTitle sx={{ color: '#00e6ff', borderBottom: '1px solid #333', fontWeight: 700 }}>
          Payslip - {selectedPayslip?.month}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedPayslip && (
            <Box>
              <Typography variant="h5" color="#00e6ff" fontWeight={700} mb={3}>
                Techbuddy 31 - Employee Payslip
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" color="#00e6ff" mb={2}>Employee Details</Typography>
                  <Box sx={{ background: '#222', p: 2, borderRadius: 2, border: '1px solid #333' }}>
                    <Typography variant="body2" mb={1}><strong>Name:</strong> Abhishek</Typography>
                    <Typography variant="body2" mb={1}><strong>Employee ID:</strong> EMP001</Typography>
                    <Typography variant="body2" mb={1}><strong>Department:</strong> Sales</Typography>
                    <Typography variant="body2" mb={1}><strong>Designation:</strong> Sales Agent</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" color="#00e6ff" mb={2}>Pay Period</Typography>
                  <Box sx={{ background: '#222', p: 2, borderRadius: 2, border: '1px solid #333' }}>
                    <Typography variant="body2" mb={1}><strong>Month:</strong> {selectedPayslip.month}</Typography>
                    <Typography variant="body2" mb={1}><strong>Pay Date:</strong> {selectedPayslip.date}</Typography>
                    <Typography variant="body2" mb={1}><strong>Status:</strong> {selectedPayslip.status}</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" color="#00e6ff" mb={2}>Earnings Breakdown</Typography>
                  <Box sx={{ background: '#222', p: 2, borderRadius: 2, border: '1px solid #333' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary">Base Salary</Typography>
                        <Typography variant="h6" color="#00e6ff">₹25,000</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary">Incentives</Typography>
                        <Typography variant="h6" color="#4caf50">₹6,250</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary">Bonuses</Typography>
                        <Typography variant="h6" color="#ff9800">₹5,000</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary">Deductions</Typography>
                        <Typography variant="h6" color="#f44336">-₹2,500</Typography>
                      </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: '#333', my: 2 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h5" color="#fff" fontWeight={700}>Net Pay</Typography>
                      <Typography variant="h4" color="#2196f3" fontWeight={900}>
                        ₹{selectedPayslip.amount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #333' }}>
          <Button onClick={() => setShowPayslipDialog(false)} sx={{ color: '#666' }}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => handleDownloadPayslip(selectedPayslip)}
            sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, '&:hover': { background: '#00b3cc' } }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 