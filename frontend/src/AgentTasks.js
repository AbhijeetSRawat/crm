import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  LinearProgress,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Assignment,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  Flag,
  Person,
  Business,
  Phone,
  Email,
  Note,
  TrendingUp,
  Warning,
  Done,
  Pending,
  PlayArrow,
} from '@mui/icons-material';

// Mock tasks data
const mockTasks = [
  {
    id: 1,
    title: 'Follow up with Acme Corporation',
    description: 'Call to discuss proposal and address concerns',
    category: 'sales',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-07-12',
    assignedBy: 'Manager',
    notes: 'Client showed interest in enterprise package',
    createdAt: '2024-07-10',
  },
  {
    id: 2,
    title: 'Complete product training',
    description: 'Watch training videos and take assessment',
    category: 'training',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2024-07-15',
    assignedBy: 'HR',
    notes: 'New product launch next week',
    createdAt: '2024-07-08',
  },
  {
    id: 3,
    title: 'Update CRM with Beta Industries call',
    description: 'Log call details and next steps',
    category: 'admin',
    priority: 'low',
    status: 'completed',
    dueDate: '2024-07-11',
    assignedBy: 'Self',
    notes: 'Deal closed successfully',
    createdAt: '2024-07-11',
  },
  {
    id: 4,
    title: 'Prepare monthly report',
    description: 'Compile sales data and performance metrics',
    category: 'reporting',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-07-14',
    assignedBy: 'Manager',
    notes: 'Include Q3 projections',
    createdAt: '2024-07-09',
  },
  {
    id: 5,
    title: 'Attend team meeting',
    description: 'Weekly team sync and strategy discussion',
    category: 'meeting',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-07-13',
    assignedBy: 'Manager',
    notes: 'Prepare updates on current deals',
    createdAt: '2024-07-10',
  },
];

const taskCategories = [
  { value: 'sales', label: 'Sales', icon: <Business />, color: '#4caf50' },
  { value: 'training', label: 'Training', icon: <TrendingUp />, color: '#2196f3' },
  { value: 'admin', label: 'Admin', icon: <Assignment />, color: '#ff9800' },
  { value: 'reporting', label: 'Reporting', icon: <Note />, color: '#9c27b0' },
  { value: 'meeting', label: 'Meeting', icon: <Person />, color: '#f44336' },
];

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: <Pending />, color: '#ff9800' },
  { value: 'in_progress', label: 'In Progress', icon: <PlayArrow />, color: '#2196f3' },
  { value: 'completed', label: 'Completed', icon: <Done />, color: '#4caf50' },
];

export default function AgentTasks() {
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDialog, setTaskDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    notes: '',
  });

  const filteredTasks = selectedTab === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === selectedTab);

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    completionRate: Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100),
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddTask = () => {
    setIsEdit(false);
    setTaskData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      notes: '',
    });
    setTaskDialog(true);
  };

  const handleEditTask = (task) => {
    setIsEdit(true);
    setSelectedTask(task);
    setTaskData({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      notes: task.notes,
    });
    setTaskDialog(true);
  };

  const handleSaveTask = () => {
    if (isEdit) {
      setTasks(prev => prev.map(t => 
        t.id === selectedTask.id ? { ...t, ...taskData } : t
      ));
    } else {
      const newTask = {
        id: Date.now(),
        ...taskData,
        assignedBy: 'Self',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTasks(prev => [...prev, newTask]);
    }
    setTaskDialog(false);
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    const cat = taskCategories.find(c => c.value === category);
    return cat ? cat.icon : <Assignment />;
  };

  const getCategoryColor = (category) => {
    const cat = taskCategories.find(c => c.value === category);
    return cat ? cat.color : '#666';
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && dueDate !== '';
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Assignment sx={{ fontSize: 40, color: '#00e6ff' }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Tasks & To-Do
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your tasks and track progress
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddTask}
          sx={{ backgroundColor: '#00e6ff', color: '#000' }}
        >
          Add Task
        </Button>
      </Box>

      {/* Task Statistics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h4" fontWeight={900} color="primary.main">
                {taskStats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" fontWeight={900} color="warning.main">
                {taskStats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4" fontWeight={900} color="info.main">
                {taskStats.inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completion Rate
              </Typography>
              <Typography variant="h4" fontWeight={900} color="success.main">
                {taskStats.completionRate}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={taskStats.completionRate} 
                sx={{ mt: 1, backgroundColor: '#333', "& .MuiLinearProgress-bar": { backgroundColor: '#4caf50' } }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs */}
      <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
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
            <Tab
              value="all"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Assignment />
                  All Tasks
                  <Badge badgeContent={taskStats.total} color="primary" />
                </Box>
              }
            />
            <Tab
              value="pending"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Pending />
                  Pending
                  <Badge badgeContent={taskStats.pending} color="warning" />
                </Box>
              }
            />
            <Tab
              value="in_progress"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <PlayArrow />
                  In Progress
                  <Badge badgeContent={taskStats.inProgress} color="info" />
                </Box>
              }
            />
            <Tab
              value="completed"
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Done />
                  Completed
                  <Badge badgeContent={taskStats.completed} color="success" />
                </Box>
              }
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
        <CardContent sx={{ p: 0 }}>
          {filteredTasks.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Assignment sx={{ fontSize: 60, color: '#666', mb: 2 }} />
              <Typography variant="h6" color="#666">
                No tasks found
              </Typography>
              <Typography variant="body2" color="#666">
                {selectedTab === 'all' ? 'Add your first task to get started!' : `No ${selectedTab} tasks.`}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredTasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <ListItem
                    sx={{
                      backgroundColor: isOverdue(task.dueDate) ? '#ff000011' : 'transparent',
                      borderLeft: isOverdue(task.dueDate) ? '4px solid #f44336' : 'none',
                    }}
                  >
                    <ListItemIcon sx={{ color: getCategoryColor(task.category) }}>
                      {getCategoryIcon(task.category)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color={task.status === 'completed' ? '#666' : '#fff'}
                            sx={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}
                          >
                            {task.title}
                          </Typography>
                          <Chip
                            label={task.priority}
                            size="small"
                            color={getPriorityColor(task.priority)}
                          />
                          <Chip
                            label={task.status.replace('_', ' ')}
                            size="small"
                            color={getStatusColor(task.status)}
                          />
                          {isOverdue(task.dueDate) && (
                            <Chip
                              label="Overdue"
                              size="small"
                              color="error"
                              icon={<Warning />}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                            {task.description}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="caption" color="textSecondary">
                              Due: {task.dueDate || 'No due date'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Assigned by: {task.assignedBy}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Category: {taskCategories.find(c => c.value === task.category)?.label}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" gap={1}>
                        {task.status !== 'completed' && (
                          <IconButton
                            size="small"
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            sx={{ color: '#4caf50' }}
                          >
                            <CheckCircle />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleEditTask(task)}
                          sx={{ color: '#00e6ff' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteTask(task.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredTasks.length - 1 && (
                    <Divider sx={{ borderColor: '#333' }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Task Dialog */}
      <Dialog
        open={taskDialog}
        onClose={() => setTaskDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#00e6ff' }}>
          {isEdit ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Task Title"
                fullWidth
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={taskData.category}
                  label="Category"
                  onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
                >
                  {taskCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {category.icon}
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={taskData.priority}
                  label="Priority"
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                value={taskData.dueDate}
                onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={taskData.status}
                  label="Status"
                  onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {status.icon}
                        {status.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                multiline
                rows={2}
                fullWidth
                value={taskData.notes}
                onChange={(e) => setTaskData({ ...taskData, notes: e.target.value })}
                placeholder="Add any additional notes or context..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveTask}
            disabled={!taskData.title}
          >
            {isEdit ? 'Update Task' : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 