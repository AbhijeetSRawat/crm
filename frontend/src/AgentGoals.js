import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Tooltip,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Rating,
  Slider,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';
import {
  Flag,
  TrendingUp,
  Assessment,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Warning,
  Info,
  Star,
  StarBorder,
  CalendarToday,
  Psychology,
  School,
  Work,
  EmojiEvents,
  Timeline,
  BarChart,
  PieChart,
  Save,
  Close,
  Visibility,
  Download,
  Share,
  Refresh,
  PlayArrow,
  Pause,
  Stop,
  Done,
  Schedule,
  Notifications,
  Person,
  Group,
  Business,
  AttachMoney,
  Phone,
  Email,
  Chat,
} from '@mui/icons-material';

// Mock goals and assessment data
const mockGoalsData = {
  currentGoals: [
    {
      id: 1,
      title: 'Increase Monthly Sales',
      description: 'Achieve 20% increase in monthly sales compared to last month',
      category: 'Sales',
      target: 180000,
      current: 125000,
      deadline: '2024-08-31',
      priority: 'High',
      status: 'In Progress',
      progress: 69,
    },
    {
      id: 2,
      title: 'Improve Call Quality Score',
      description: 'Maintain call quality score above 4.5/5',
      category: 'Performance',
      target: 4.5,
      current: 4.2,
      deadline: '2024-08-15',
      priority: 'Medium',
      status: 'In Progress',
      progress: 84,
    },
    {
      id: 3,
      title: 'Complete Advanced Training',
      description: 'Complete 3 advanced sales training modules',
      category: 'Development',
      target: 3,
      current: 1,
      deadline: '2024-09-30',
      priority: 'Low',
      status: 'In Progress',
      progress: 33,
    },
  ],
  completedGoals: [
    {
      id: 4,
      title: 'Achieve Q2 Target',
      description: 'Meet Q2 sales target of ₹150,000',
      category: 'Sales',
      target: 150000,
      achieved: 165000,
      completedDate: '2024-06-30',
      status: 'Completed',
    },
  ],
  selfAssessments: [
    {
      id: 1,
      date: '2024-07-01',
      overallRating: 4.2,
      categories: {
        communication: 4.5,
        productKnowledge: 4.0,
        problemSolving: 4.3,
        teamwork: 4.1,
        timeManagement: 4.0,
      },
      strengths: ['Excellent communication skills', 'Strong product knowledge', 'Good problem-solving abilities'],
      areas: ['Time management could be improved', 'Need more training on new products'],
      goals: ['Complete time management course', 'Attend product training sessions'],
      status: 'Submitted',
    },
  ],
  assessmentQuestions: [
    {
      id: 1,
      category: 'Communication',
      question: 'How would you rate your communication skills with customers?',
      type: 'rating',
    },
    {
      id: 2,
      category: 'Product Knowledge',
      question: 'How confident are you in explaining product features and benefits?',
      type: 'rating',
    },
    {
      id: 3,
      category: 'Problem Solving',
      question: 'How well do you handle customer objections and concerns?',
      type: 'rating',
    },
    {
      id: 4,
      category: 'Teamwork',
      question: 'How effectively do you collaborate with team members?',
      type: 'rating',
    },
    {
      id: 5,
      category: 'Time Management',
      question: 'How well do you manage your time and prioritize tasks?',
      type: 'rating',
    },
    {
      id: 6,
      category: 'General',
      question: 'What are your main strengths in your role?',
      type: 'text',
    },
    {
      id: 7,
      category: 'General',
      question: 'What areas would you like to improve?',
      type: 'text',
    },
    {
      id: 8,
      category: 'General',
      question: 'What are your goals for the next month?',
      type: 'text',
    },
  ],
};

export default function AgentGoals() {
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'Sales',
    target: '',
    deadline: '',
    priority: 'Medium',
  });
  const [assessmentData, setAssessmentData] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const handleAddGoal = () => {
    setShowGoalDialog(true);
    setNewGoal({
      title: '',
      description: '',
      category: 'Sales',
      target: '',
      deadline: '',
      priority: 'Medium',
    });
  };

  const handleSaveGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) return;
    // In real app, this would save to backend
    alert('Goal saved successfully!');
    setShowGoalDialog(false);
  };

  const handleStartAssessment = () => {
    setShowAssessmentDialog(true);
    setAssessmentData({});
  };

  const handleSaveAssessment = () => {
    // In real app, this would save to backend
    alert('Self-assessment submitted successfully!');
    setShowAssessmentDialog(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Submitted': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Sales': return <AttachMoney />;
      case 'Performance': return <TrendingUp />;
      case 'Development': return <School />;
      default: return <Flag />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Flag sx={{ fontSize: 40, color: '#00e6ff' }} />
        <Box>
          <Typography variant="h4" fontWeight={900} color="#00e6ff">
            Self-Assessment & Goal Setting
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Set goals, track progress, and evaluate performance
          </Typography>
        </Box>
        <Box flex={1} />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddGoal}
          sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, borderRadius: 2, mr: 2, '&:hover': { background: '#00b3cc' } }}
        >
          Add Goal
        </Button>
        <Button
          variant="outlined"
          startIcon={<Assessment />}
          onClick={handleStartAssessment}
          sx={{ color: '#00e6ff', borderColor: '#00e6ff', fontWeight: 700, borderRadius: 2, '&:hover': { borderColor: '#00b3cc' } }}
        >
          Start Assessment
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Goals
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="#00e6ff">
                    {mockGoalsData.currentGoals.length}
                  </Typography>
                </Box>
                <Flag sx={{ fontSize: 40, color: '#00e6ff' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Completed Goals
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="#4caf50">
                    {mockGoalsData.completedGoals.length}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Progress
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="#ff9800">
                    {Math.round(mockGoalsData.currentGoals.reduce((acc, goal) => acc + goal.progress, 0) / mockGoalsData.currentGoals.length)}%
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: '#ff9800' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Last Assessment
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="#2196f3">
                    {mockGoalsData.selfAssessments[0]?.overallRating || 'N/A'}
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, color: '#2196f3' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Current Goals */}
      <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={3}>
            Current Goals
          </Typography>
          <Grid container spacing={2}>
            {mockGoalsData.currentGoals.map((goal) => (
              <Grid item xs={12} md={6} lg={4} key={goal.id}>
                <Paper sx={{ background: '#222', border: '1px solid #333', borderRadius: 2, p: 2 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Box sx={{ color: '#00e6ff' }}>
                      {getCategoryIcon(goal.category)}
                    </Box>
                    <Typography variant="h6" fontWeight={600} color="#fff">
                      {goal.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    {goal.description}
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" color="textSecondary">
                      Progress: {goal.progress}%
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="#00e6ff">
                      {goal.current}/{goal.target}
                    </Typography>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={goal.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#333',
                      mb: 2,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: goal.progress >= 80 ? '#4caf50' : goal.progress >= 50 ? '#ff9800' : '#00e6ff',
                        borderRadius: 3,
                      },
                    }}
                  />
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Chip
                      label={goal.priority}
                      color={getPriorityColor(goal.priority)}
                      size="small"
                    />
                    <Typography variant="caption" color="textSecondary">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      sx={{ color: '#00e6ff', borderColor: '#00e6ff', '&:hover': { borderColor: '#00b3cc' } }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Visibility />}
                      sx={{ background: '#00e6ff', color: '#000', '&:hover': { background: '#00b3cc' } }}
                    >
                      View
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Self-Assessment */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={3}>
                Recent Self-Assessment
              </Typography>
              {mockGoalsData.selfAssessments[0] && (
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="h4" fontWeight={900} color="#00e6ff">
                      {mockGoalsData.selfAssessments[0].overallRating}/5
                    </Typography>
                    <Rating
                      value={mockGoalsData.selfAssessments[0].overallRating}
                      readOnly
                      sx={{ '& .MuiRating-iconFilled': { color: '#00e6ff' } }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    Date: {new Date(mockGoalsData.selfAssessments[0].date).toLocaleDateString()}
                  </Typography>
                  
                  <Box mb={2}>
                    <Typography variant="body2" fontWeight={600} color="#00e6ff" mb={1}>
                      Strengths:
                    </Typography>
                    {mockGoalsData.selfAssessments[0].strengths.map((strength, index) => (
                      <Chip
                        key={index}
                        label={strength}
                        size="small"
                        sx={{ background: '#333', color: '#4caf50', mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="body2" fontWeight={600} color="#00e6ff" mb={1}>
                      Areas for Improvement:
                    </Typography>
                    {mockGoalsData.selfAssessments[0].areas.map((area, index) => (
                      <Chip
                        key={index}
                        label={area}
                        size="small"
                        sx={{ background: '#333', color: '#ff9800', mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Assessment />}
                    sx={{ color: '#00e6ff', borderColor: '#00e6ff', '&:hover': { borderColor: '#00b3cc' } }}
                  >
                    View Full Assessment
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={3}>
                Completed Goals
              </Typography>
              <List>
                {mockGoalsData.completedGoals.map((goal) => (
                  <ListItem key={goal.id} sx={{ borderBottom: '1px solid #333' }}>
                    <ListItemIcon sx={{ color: '#4caf50' }}>
                      <CheckCircle />
                    </ListItemIcon>
                    <ListItemText
                      primary={goal.title}
                      secondary={`Completed: ${new Date(goal.completedDate).toLocaleDateString()}`}
                      primaryTypographyProps={{ color: '#fff', fontWeight: 600 }}
                      secondaryTypographyProps={{ color: 'textSecondary' }}
                    />
                    <Chip
                      label={`₹${goal.achieved.toLocaleString()}`}
                      color="success"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Goal Dialog */}
      <Dialog
        open={showGoalDialog}
        onClose={() => setShowGoalDialog(false)}
        maxWidth="sm"
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
          Add New Goal
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Goal Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#00e6ff' }, '&.Mui-focused fieldset': { borderColor: '#00e6ff' } }, '& .MuiInputBase-input::placeholder': { color: '#666' } }}
          />
          
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#00e6ff' }, '&.Mui-focused fieldset': { borderColor: '#00e6ff' } }, '& .MuiInputBase-input::placeholder': { color: '#666' } }}
          />
          
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#00e6ff' }}>Category</InputLabel>
                <Select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  sx={{ color: '#fff', borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' } }}
                  label="Category"
                >
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Performance">Performance</MenuItem>
                  <MenuItem value="Development">Development</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#00e6ff' }}>Priority</InputLabel>
                <Select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                  sx={{ color: '#fff', borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' } }}
                  label="Priority"
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Target Value"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#00e6ff' }, '&.Mui-focused fieldset': { borderColor: '#00e6ff' } }, '& .MuiInputBase-input::placeholder': { color: '#666' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#00e6ff' }, '&.Mui-focused fieldset': { borderColor: '#00e6ff' } } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #333' }}>
          <Button onClick={() => setShowGoalDialog(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveGoal}
            sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, borderRadius: 2, '&:hover': { background: '#00b3cc' } }}
          >
            Save Goal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Self-Assessment Dialog */}
      <Dialog
        open={showAssessmentDialog}
        onClose={() => setShowAssessmentDialog(false)}
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
          Self-Assessment Form
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" color="textSecondary" mb={3}>
            Please rate yourself on the following criteria and provide feedback for improvement.
          </Typography>
          
          {mockGoalsData.assessmentQuestions.map((question) => (
            <Box key={question.id} sx={{ mb: 3, p: 2, background: '#222', borderRadius: 2, border: '1px solid #333' }}>
              <Typography variant="h6" color="#00e6ff" mb={2}>
                {question.category}: {question.question}
              </Typography>
              
              {question.type === 'rating' ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Rating
                    value={assessmentData[question.id] || 0}
                    onChange={(event, newValue) => {
                      setAssessmentData({ ...assessmentData, [question.id]: newValue });
                    }}
                    sx={{ '& .MuiRating-iconFilled': { color: '#00e6ff' } }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {assessmentData[question.id] || 0}/5
                  </Typography>
                </Box>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="Enter your response..."
                  value={assessmentData[question.id] || ''}
                  onChange={(e) => setAssessmentData({ ...assessmentData, [question.id]: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#00e6ff' }, '&.Mui-focused fieldset': { borderColor: '#00e6ff' } }, '& .MuiInputBase-input::placeholder': { color: '#666' } }}
                />
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #333' }}>
          <Button onClick={() => setShowAssessmentDialog(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAssessment}
            sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, borderRadius: 2, '&:hover': { background: '#00b3cc' } }}
          >
            Submit Assessment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 