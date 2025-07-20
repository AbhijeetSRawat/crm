import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  ShowChart,
  Assessment,
  AttachMoney,
  Phone,
  CheckCircle,
  Flag,
  Download,
  Refresh,
  CalendarToday,
  AccessTime,
  Person,
  Business,
} from '@mui/icons-material';

// Mock analytics data
const mockAnalyticsData = {
  currentPeriod: 'monthly',
  salesData: {
    daily: [
      { date: '2024-07-01', sales: 15000, calls: 25, conversions: 3 },
      { date: '2024-07-02', sales: 22000, calls: 30, conversions: 4 },
      { date: '2024-07-03', sales: 18000, calls: 28, conversions: 3 },
      { date: '2024-07-04', sales: 25000, calls: 35, conversions: 5 },
      { date: '2024-07-05', sales: 20000, calls: 32, conversions: 4 },
      { date: '2024-07-06', sales: 12000, calls: 20, conversions: 2 },
      { date: '2024-07-07', sales: 8000, calls: 15, conversions: 1 },
      { date: '2024-07-08', sales: 28000, calls: 40, conversions: 6 },
      { date: '2024-07-09', sales: 32000, calls: 45, conversions: 7 },
      { date: '2024-07-10', sales: 24000, calls: 38, conversions: 5 },
      { date: '2024-07-11', sales: 26000, calls: 42, conversions: 6 },
    ],
    weekly: [
      { week: 'Week 1', sales: 85000, calls: 150, conversions: 18 },
      { week: 'Week 2', sales: 92000, calls: 165, conversions: 22 },
      { week: 'Week 3', sales: 78000, calls: 140, conversions: 16 },
      { week: 'Week 4', sales: 105000, calls: 180, conversions: 25 },
    ],
    monthly: [
      { month: 'Jan', sales: 280000, calls: 520, conversions: 65 },
      { month: 'Feb', sales: 320000, calls: 580, conversions: 72 },
      { month: 'Mar', sales: 290000, calls: 540, conversions: 68 },
      { month: 'Apr', sales: 350000, calls: 620, conversions: 78 },
      { month: 'May', sales: 380000, calls: 650, conversions: 82 },
      { month: 'Jun', sales: 420000, calls: 680, conversions: 88 },
      { month: 'Jul', sales: 360000, calls: 635, conversions: 81 },
    ],
  },
  callStats: {
    totalCalls: 635,
    answeredCalls: 580,
    missedCalls: 55,
    avgCallDuration: '4m 32s',
    totalCallTime: '45h 20m',
    conversionRate: 12.8,
    avgDealSize: 15625,
  },
  targetProgress: {
    monthlyTarget: 400000,
    currentSales: 360000,
    targetAchievement: 90,
    daysRemaining: 20,
    dailyRequired: 2000,
    projectedSales: 400000,
  },
  performanceMetrics: {
    salesGrowth: 15.2,
    callGrowth: 8.5,
    conversionGrowth: 12.3,
    efficiencyScore: 87,
    qualityScore: 92,
    customerSatisfaction: 4.6,
  },
  topPerformances: [
    { metric: 'Highest Daily Sales', value: '₹32,000', date: '2024-07-09' },
    { metric: 'Most Calls in a Day', value: '45 calls', date: '2024-07-09' },
    { metric: 'Best Conversion Rate', value: '15.6%', date: '2024-07-04' },
    { metric: 'Longest Call Duration', value: '12m 45s', date: '2024-07-08' },
  ],
  conversionBreakdown: [
    { stage: 'Initial Contact', count: 635, percentage: 100 },
    { stage: 'Qualified Leads', count: 254, percentage: 40 },
    { stage: 'Proposals Sent', count: 127, percentage: 20 },
    { stage: 'Negotiations', count: 89, percentage: 14 },
    { stage: 'Closed Deals', count: 81, percentage: 12.8 },
  ],
};

// Simple chart components (in real app, use Chart.js or similar)
const LineChart = ({ data, title, color = '#00e6ff' }) => (
  <Box sx={{ p: 2, background: '#222', borderRadius: 2, mb: 2 }}>
    <Typography variant="h6" color="primary" gutterBottom>
      {title}
    </Typography>
    <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1 }}>
      {data.map((item, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            background: `linear-gradient(to top, ${color}, ${color}88)`,
            height: `${(item.sales / Math.max(...data.map(d => d.sales))) * 100}%`,
            minHeight: 20,
            borderRadius: '4px 4px 0 0',
            position: 'relative',
          }}
        >
          <Tooltip title={`${item.date || item.week || item.month}: ₹${item.sales.toLocaleString()}`}>
            <Box sx={{ height: '100%', cursor: 'pointer' }} />
          </Tooltip>
        </Box>
      ))}
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
      {data.map((item, index) => (
        <Typography key={index} variant="caption" color="textSecondary">
          {item.date || item.week || item.month}
        </Typography>
      ))}
    </Box>
  </Box>
);

const PieChartComponent = ({ data, title }) => (
  <Box sx={{ p: 2, background: '#222', borderRadius: 2, mb: 2 }}>
    <Typography variant="h6" color="primary" gutterBottom>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {data.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: `hsl(${index * 60}, 70%, 50%)`,
            }}
          />
          <Typography variant="body2" sx={{ flex: 1 }}>
            {item.stage}
          </Typography>
          <Typography variant="body2" color="primary" fontWeight={600}>
            {item.percentage}%
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

export default function AgentAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedTab, setSelectedTab] = useState('overview');

  const currentData = mockAnalyticsData.salesData[selectedPeriod];

  const getGrowthIcon = (value) => {
    return value >= 0 ? <TrendingUp sx={{ color: '#4caf50' }} /> : <TrendingDown sx={{ color: '#f44336' }} />;
  };

  const getGrowthColor = (value) => {
    return value >= 0 ? '#4caf50' : '#f44336';
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Assessment sx={{ fontSize: 40, color: '#00e6ff' }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Performance Analytics
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Track your performance and identify growth opportunities
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Download />}
            sx={{ borderColor: '#00e6ff', color: '#00e6ff' }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Filter Tabs */}
      <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
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
            <Tab label="Overview" value="overview" />
            <Tab label="Sales Analytics" value="sales" />
            <Tab label="Call Analytics" value="calls" />
            <Tab label="Target Progress" value="target" />
            <Tab label="Performance Metrics" value="metrics" />
          </Tabs>
        </CardContent>
      </Card>

      {selectedTab === 'overview' && (
        <>
          {/* Key Performance Indicators */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Sales
                      </Typography>
                      <Typography variant="h4" fontWeight={900} color="success.main">
                        ₹{mockAnalyticsData.salesData.monthly[mockAnalyticsData.salesData.monthly.length - 1].sales.toLocaleString()}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        {getGrowthIcon(mockAnalyticsData.performanceMetrics.salesGrowth)}
                        <Typography variant="body2" color={getGrowthColor(mockAnalyticsData.performanceMetrics.salesGrowth)}>
                          +{mockAnalyticsData.performanceMetrics.salesGrowth}%
                        </Typography>
                      </Box>
                    </Box>
                    <AttachMoney sx={{ fontSize: 40, color: '#4caf50' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Calls
                      </Typography>
                      <Typography variant="h4" fontWeight={900} color="primary.main">
                        {mockAnalyticsData.callStats.totalCalls}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        {getGrowthIcon(mockAnalyticsData.performanceMetrics.callGrowth)}
                        <Typography variant="body2" color={getGrowthColor(mockAnalyticsData.performanceMetrics.callGrowth)}>
                          +{mockAnalyticsData.performanceMetrics.callGrowth}%
                        </Typography>
                      </Box>
                    </Box>
                    <Phone sx={{ fontSize: 40, color: '#00e6ff' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Conversion Rate
                      </Typography>
                      <Typography variant="h4" fontWeight={900} color="warning.main">
                        {mockAnalyticsData.callStats.conversionRate}%
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        {getGrowthIcon(mockAnalyticsData.performanceMetrics.conversionGrowth)}
                        <Typography variant="body2" color={getGrowthColor(mockAnalyticsData.performanceMetrics.conversionGrowth)}>
                          +{mockAnalyticsData.performanceMetrics.conversionGrowth}%
                        </Typography>
                      </Box>
                    </Box>
                    <CheckCircle sx={{ fontSize: 40, color: '#ff9800' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Target Achievement
                      </Typography>
                      <Typography variant="h4" fontWeight={900} color="info.main">
                        {mockAnalyticsData.targetProgress.targetAchievement}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={mockAnalyticsData.targetProgress.targetAchievement} 
                        sx={{ mt: 1, backgroundColor: '#333', "& .MuiLinearProgress-bar": { backgroundColor: '#00e6ff' } }}
                      />
                    </Box>
                    <Flag sx={{ fontSize: 40, color: '#2196f3' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Sales Trend Chart */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Sales Trend - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
                  </Typography>
                  <LineChart data={currentData} title="" color="#00e6ff" />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Conversion Funnel
                  </Typography>
                  <PieChartComponent data={mockAnalyticsData.conversionBreakdown} title="" />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {selectedTab === 'sales' && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Sales Performance Details
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#00e6ff' }}>Period</TableCell>
                        <TableCell sx={{ color: '#00e6ff' }}>Sales (₹)</TableCell>
                        <TableCell sx={{ color: '#00e6ff' }}>Calls</TableCell>
                        <TableCell sx={{ color: '#00e6ff' }}>Conversions</TableCell>
                        <TableCell sx={{ color: '#00e6ff' }}>Conversion Rate</TableCell>
                        <TableCell sx={{ color: '#00e6ff' }}>Avg Deal Size</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentData.map((item, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{item.date || item.week || item.month}</TableCell>
                          <TableCell>
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              ₹{item.sales.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>{item.calls}</TableCell>
                          <TableCell>{item.conversions}</TableCell>
                          <TableCell>
                            <Typography variant="body2" color="warning.main">
                              {((item.conversions / item.calls) * 100).toFixed(1)}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="info.main">
                              ₹{(item.sales / item.conversions).toLocaleString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 'calls' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Call Statistics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Total Calls</Typography>
                    <Typography variant="h6" color="primary">{mockAnalyticsData.callStats.totalCalls}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Answered Calls</Typography>
                    <Typography variant="h6" color="success.main">{mockAnalyticsData.callStats.answeredCalls}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Missed Calls</Typography>
                    <Typography variant="h6" color="error.main">{mockAnalyticsData.callStats.missedCalls}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Avg Call Duration</Typography>
                    <Typography variant="h6" color="warning.main">{mockAnalyticsData.callStats.avgCallDuration}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Total Call Time</Typography>
                    <Typography variant="h6" color="info.main">{mockAnalyticsData.callStats.totalCallTime}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Top Performances
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {mockAnalyticsData.topPerformances.map((performance, index) => (
                    <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">{performance.metric}</Typography>
                      <Box textAlign="right">
                        <Typography variant="h6" color="primary">{performance.value}</Typography>
                        <Typography variant="caption" color="textSecondary">{performance.date}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 'target' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Target Progress
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography>Monthly Target</Typography>
                      <Typography variant="h6" color="primary">
                        ₹{mockAnalyticsData.targetProgress.monthlyTarget.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography>Current Sales</Typography>
                      <Typography variant="h6" color="success.main">
                        ₹{mockAnalyticsData.targetProgress.currentSales.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={mockAnalyticsData.targetProgress.targetAchievement} 
                      sx={{ height: 8, borderRadius: 4, backgroundColor: '#333', "& .MuiLinearProgress-bar": { backgroundColor: '#00e6ff' } }}
                    />
                    <Typography variant="body2" color="textSecondary" mt={1}>
                      {mockAnalyticsData.targetProgress.targetAchievement}% achieved
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Days Remaining</Typography>
                    <Typography variant="h6" color="warning.main">{mockAnalyticsData.targetProgress.daysRemaining}</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Daily Required</Typography>
                    <Typography variant="h6" color="info.main">₹{mockAnalyticsData.targetProgress.dailyRequired.toLocaleString()}</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Projected Sales</Typography>
                    <Typography variant="h6" color="success.main">₹{mockAnalyticsData.targetProgress.projectedSales.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Performance Metrics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Efficiency Score</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6" color="success.main">{mockAnalyticsData.performanceMetrics.efficiencyScore}%</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={mockAnalyticsData.performanceMetrics.efficiencyScore} 
                        sx={{ width: 60, height: 6, backgroundColor: '#333', "& .MuiLinearProgress-bar": { backgroundColor: '#4caf50' } }}
                      />
                    </Box>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Quality Score</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6" color="success.main">{mockAnalyticsData.performanceMetrics.qualityScore}%</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={mockAnalyticsData.performanceMetrics.qualityScore} 
                        sx={{ width: 60, height: 6, backgroundColor: '#333', "& .MuiLinearProgress-bar": { backgroundColor: '#4caf50' } }}
                      />
                    </Box>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Customer Satisfaction</Typography>
                    <Typography variant="h6" color="warning.main">{mockAnalyticsData.performanceMetrics.customerSatisfaction}/5</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 'metrics' && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Detailed Performance Metrics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, background: '#222', borderRadius: 2 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Growth Metrics
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography>Sales Growth</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getGrowthIcon(mockAnalyticsData.performanceMetrics.salesGrowth)}
                            <Typography color={getGrowthColor(mockAnalyticsData.performanceMetrics.salesGrowth)}>
                              +{mockAnalyticsData.performanceMetrics.salesGrowth}%
                            </Typography>
                          </Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography>Call Growth</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getGrowthIcon(mockAnalyticsData.performanceMetrics.callGrowth)}
                            <Typography color={getGrowthColor(mockAnalyticsData.performanceMetrics.callGrowth)}>
                              +{mockAnalyticsData.performanceMetrics.callGrowth}%
                            </Typography>
                          </Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography>Conversion Growth</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getGrowthIcon(mockAnalyticsData.performanceMetrics.conversionGrowth)}
                            <Typography color={getGrowthColor(mockAnalyticsData.performanceMetrics.conversionGrowth)}>
                              +{mockAnalyticsData.performanceMetrics.conversionGrowth}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, background: '#222', borderRadius: 2 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Efficiency Metrics
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="body2" gutterBottom>Efficiency Score</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={mockAnalyticsData.performanceMetrics.efficiencyScore} 
                            sx={{ height: 8, backgroundColor: '#333', "& .MuiLinearProgress-bar": { backgroundColor: '#4caf50' } }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {mockAnalyticsData.performanceMetrics.efficiencyScore}%
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" gutterBottom>Quality Score</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={mockAnalyticsData.performanceMetrics.qualityScore} 
                            sx={{ height: 8, backgroundColor: '#333', "& .MuiLinearProgress-bar": { backgroundColor: '#4caf50' } }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {mockAnalyticsData.performanceMetrics.qualityScore}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, background: '#222', borderRadius: 2 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Customer Metrics
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography>Customer Satisfaction</Typography>
                          <Typography variant="h6" color="warning.main">
                            {mockAnalyticsData.performanceMetrics.customerSatisfaction}/5
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography>Avg Deal Size</Typography>
                          <Typography variant="h6" color="success.main">
                            ₹{mockAnalyticsData.callStats.avgDealSize.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography>Conversion Rate</Typography>
                          <Typography variant="h6" color="info.main">
                            {mockAnalyticsData.callStats.conversionRate}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
} 