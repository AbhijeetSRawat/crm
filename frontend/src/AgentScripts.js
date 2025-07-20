import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Chip,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Tooltip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  InputAdornment,
} from '@mui/material';
import {
  ContentCopy,
  Search,
  FilterList,
  Favorite,
  FavoriteBorder,
  Star,
  StarBorder,
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  VolumeOff,
  Download,
  Share,
  Edit,
  Delete,
  Add,
  ExpandMore,
  ExpandLess,
  Category,
  Description,
  Psychology,
  Business,
  School,
  TrendingUp,
  Assessment,
  History,
  Notifications,
  Visibility,
  VisibilityOff,
  FilterList as FilterListIcon,
  Sort,
  Refresh,
  CloudDownload,
  PictureAsPdf,
  Image,
  AttachFile,
  Send,
  Save,
  Close,
  Phone,
  VideoCall,
  Email,
  Chat,
  Support,
} from '@mui/icons-material';

// Mock scripts data
const mockScriptsData = {
  categories: [
    {
      id: 'introduction',
      name: 'Introduction Scripts',
      icon: <Psychology />,
      color: '#4caf50',
      count: 8,
      description: 'Opening lines and introductions',
    },
    {
      id: 'presentation',
      name: 'Presentation Scripts',
      icon: <Description />,
      color: '#2196f3',
      count: 12,
      description: 'Product and service presentations',
    },
    {
      id: 'objection',
      name: 'Objection Handling',
      icon: <Assessment />,
      color: '#ff9800',
      count: 15,
      description: 'Handle customer objections',
    },
    {
      id: 'closing',
      name: 'Closing Scripts',
      icon: <TrendingUp />,
      color: '#9c27b0',
      count: 10,
      description: 'Deal closing techniques',
    },
    {
      id: 'followup',
      name: 'Follow-up Scripts',
      icon: <History />,
      color: '#00bcd4',
      count: 6,
      description: 'Follow-up and nurturing',
    },
    {
      id: 'onboarding',
      name: 'Onboarding Scripts',
      icon: <School />,
      color: '#795548',
      count: 5,
      description: 'Customer onboarding process',
    },
  ],

  scripts: {
    introduction: [
      {
        id: 1,
        title: 'Cold Call Opening',
        content: "Hi [Name], this is [Your Name] from Techbuddy 31. I hope I'm not catching you at a bad time. I'm reaching out because we've been helping companies like yours [specific benefit]. Would you be interested in a quick 5-minute conversation about how we could potentially help [Company Name] achieve similar results?",
        category: 'introduction',
        difficulty: 'Beginner',
        duration: '30 seconds',
        usage: 45,
        rating: 4.8,
        isFavorite: true,
        tags: ['cold call', 'opening', 'introduction'],
        variables: ['Name', 'Your Name', 'Company Name'],
      },
      {
        id: 2,
        title: 'Warm Introduction',
        content: "Hi [Name], [Referrer Name] mentioned that you might be interested in [specific solution]. They thought we could be a great fit for [Company Name] given your current [challenge/opportunity]. Do you have a few minutes to discuss how we've helped similar companies?",
        category: 'introduction',
        difficulty: 'Intermediate',
        duration: '25 seconds',
        usage: 32,
        rating: 4.9,
        isFavorite: false,
        tags: ['referral', 'warm call', 'introduction'],
        variables: ['Name', 'Referrer Name', 'Company Name'],
      },
    ],
    presentation: [
      {
        id: 3,
        title: 'Product Demo Opening',
        content: "Great! I'd love to show you how [Product Name] works. Before we dive in, could you tell me a bit about your current [process/challenge]? This will help me tailor the demo to show you the most relevant features for your situation.",
        category: 'presentation',
        difficulty: 'Beginner',
        duration: '20 seconds',
        usage: 67,
        rating: 4.7,
        isFavorite: true,
        tags: ['demo', 'presentation', 'discovery'],
        variables: ['Product Name'],
      },
      {
        id: 4,
        title: 'Value Proposition',
        content: "What makes [Product Name] unique is our ability to [key benefit] while [secondary benefit]. We've found that our customers typically see [specific result] within [timeframe]. Would you like me to show you how this works in practice?",
        category: 'presentation',
        difficulty: 'Intermediate',
        duration: '35 seconds',
        usage: 28,
        rating: 4.6,
        isFavorite: false,
        tags: ['value prop', 'benefits', 'presentation'],
        variables: ['Product Name', 'key benefit', 'secondary benefit', 'specific result', 'timeframe'],
      },
    ],
    objection: [
      {
        id: 5,
        title: 'Price Objection',
        content: "I understand that budget is always a consideration. Let me ask you this: if we could help you [specific benefit] that would result in [ROI/impact], would that be worth exploring? Many of our clients find that the investment pays for itself within [timeframe].",
        category: 'objection',
        difficulty: 'Advanced',
        duration: '40 seconds',
        usage: 89,
        rating: 4.9,
        isFavorite: true,
        tags: ['price', 'budget', 'ROI', 'objection'],
        variables: ['specific benefit', 'ROI/impact', 'timeframe'],
      },
      {
        id: 6,
        title: 'Not Interested',
        content: "I appreciate your honesty. Many people say that initially, but then they discover how [Product Name] can actually [specific benefit]. Would you be open to a quick 10-minute demo? If it's not relevant, we can end there, and you'll have a better understanding of what we do.",
        category: 'objection',
        difficulty: 'Intermediate',
        duration: '30 seconds',
        usage: 56,
        rating: 4.5,
        isFavorite: false,
        tags: ['not interested', 'objection', 'demo'],
        variables: ['Product Name', 'specific benefit'],
      },
    ],
    closing: [
      {
        id: 7,
        title: 'Assumptive Close',
        content: "Based on what we've discussed, it sounds like [Product Name] would be a great fit for [Company Name]. When would be the best time to get started? We have availability next week, or would you prefer to begin the following week?",
        category: 'closing',
        difficulty: 'Advanced',
        duration: '25 seconds',
        usage: 34,
        rating: 4.7,
        isFavorite: true,
        tags: ['closing', 'assumptive', 'timeline'],
        variables: ['Product Name', 'Company Name'],
      },
      {
        id: 8,
        title: 'Alternative Close',
        content: "We have two great options for you: [Option A] which includes [benefits] for [price], or [Option B] which includes [benefits] for [price]. Which option feels like the best fit for your needs?",
        category: 'closing',
        difficulty: 'Intermediate',
        duration: '30 seconds',
        usage: 42,
        rating: 4.6,
        isFavorite: false,
        tags: ['closing', 'alternatives', 'options'],
        variables: ['Option A', 'benefits', 'price', 'Option B'],
      },
    ],
  },

  templates: [
    {
      id: 1,
      title: 'Discovery Call Template',
      category: 'template',
      content: `1. Introduction (30 seconds)
- Introduce yourself and company
- Confirm prospect's role and company
- Set agenda and time expectation

2. Discovery Questions (10-15 minutes)
- Current situation and challenges
- Goals and objectives
- Decision-making process
- Timeline and budget

3. Value Proposition (5 minutes)
- Present relevant solution
- Share success stories
- Address key pain points

4. Next Steps (5 minutes)
- Summarize key findings
- Propose next steps
- Schedule follow-up meeting`,
      usage: 23,
      rating: 4.8,
      isFavorite: true,
    },
    {
      id: 2,
      title: 'Demo Call Template',
      category: 'template',
      content: `1. Pre-Demo Setup (5 minutes)
- Confirm technical requirements
- Set expectations
- Review prospect's goals

2. Demo Flow (15-20 minutes)
- Start with overview
- Show key features
- Address specific use cases
- Handle questions

3. Post-Demo Discussion (10 minutes)
- Gather feedback
- Address concerns
- Discuss next steps

4. Follow-up Plan (5 minutes)
- Send materials
- Schedule next meeting
- Assign action items`,
      usage: 18,
      rating: 4.7,
      isFavorite: false,
    },
  ],

  recentScripts: [
    { id: 1, title: 'Cold Call Opening', category: 'introduction', lastUsed: '2 hours ago' },
    { id: 5, title: 'Price Objection', category: 'objection', lastUsed: '1 day ago' },
    { id: 7, title: 'Assumptive Close', category: 'closing', lastUsed: '2 days ago' },
  ],

  popularScripts: [
    { id: 5, title: 'Price Objection', usage: 89 },
    { id: 3, title: 'Product Demo Opening', usage: 67 },
    { id: 6, title: 'Not Interested', usage: 56 },
  ],
};

export default function AgentScripts() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [showScriptDialog, setShowScriptDialog] = useState(false);
  const [selectedScript, setSelectedScript] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [favoriteScripts, setFavoriteScripts] = useState([1, 3, 5, 7]);
  const [copiedScript, setCopiedScript] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleScriptClick = (script) => {
    setSelectedScript(script);
    setShowScriptDialog(true);
  };

  const handleFavorite = (scriptId) => {
    if (favoriteScripts.includes(scriptId)) {
      setFavoriteScripts(favoriteScripts.filter(id => id !== scriptId));
    } else {
      setFavoriteScripts([...favoriteScripts, scriptId]);
    }
  };

  const handleCopyScript = (script) => {
    // In real app, this would copy to clipboard
    navigator.clipboard.writeText(script.content);
    setCopiedScript(script.id);
    setTimeout(() => setCopiedScript(null), 2000);
    alert('Script copied to clipboard!');
  };

  const getFilteredScripts = () => {
    let scripts = [];
    
    if (selectedCategory === 'all') {
      Object.values(mockScriptsData.scripts).forEach(categoryScripts => {
        scripts = [...scripts, ...categoryScripts];
      });
    } else {
      scripts = mockScriptsData.scripts[selectedCategory] || [];
    }

    // Filter by search query
    if (searchQuery) {
      scripts = scripts.filter(script =>
        script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by difficulty
    if (filterDifficulty !== 'all') {
      scripts = scripts.filter(script => script.difficulty === filterDifficulty);
    }

    return scripts;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = mockScriptsData.categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#666';
  };

  const getCategoryIcon = (categoryId) => {
    const category = mockScriptsData.categories.find(cat => cat.id === categoryId);
    return category ? category.icon : <Description />;
  };

  const getCategoryName = (categoryId) => {
    const category = mockScriptsData.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const filteredScripts = getFilteredScripts();

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Psychology sx={{ fontSize: 40, color: '#00e6ff' }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Call Scripts & Templates
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Access and copy scripts for different call scenarios
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Chip
            icon={<Favorite />}
            label={`${favoriteScripts.length} Favorites`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Categories Sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
            color: '#fff', 
            border: '1px solid #333',
            boxShadow: '0 8px 32px rgba(0, 230, 255, 0.1)',
            borderRadius: 3,
          }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={3} color="#00e6ff">
                Script Categories
              </Typography>
              
              <List>
                <ListItem
                  button
                  selected={selectedCategory === 'all'}
                  onClick={() => handleCategorySelect('all')}
                  sx={{
                    backgroundColor: selectedCategory === 'all' ? '#00e6ff22' : 'transparent',
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': { backgroundColor: '#00e6ff11' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon sx={{ color: '#00e6ff' }}>
                    <Category />
                  </ListItemIcon>
                  <ListItemText 
                    primary="All Scripts" 
                    secondary={`${Object.values(mockScriptsData.scripts).flat().length} scripts`}
                  />
                </ListItem>
                
                {mockScriptsData.categories.map((category) => (
                  <ListItem
                    key={category.id}
                    button
                    selected={selectedCategory === category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    sx={{
                      backgroundColor: selectedCategory === category.id ? '#00e6ff22' : 'transparent',
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': { backgroundColor: '#00e6ff11' },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon sx={{ color: category.color }}>
                      {category.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={category.name} 
                      secondary={`${category.count} scripts`}
                    />
                    <Badge badgeContent={category.count} color="primary" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
            color: '#fff', 
            border: '1px solid #333',
            mt: 2,
            borderRadius: 3,
          }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2} color="#00e6ff">
                Quick Stats
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Total Scripts</Typography>
                  <Typography variant="body2" fontWeight={600} color="#00e6ff">
                    {Object.values(mockScriptsData.scripts).flat().length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Favorites</Typography>
                  <Typography variant="body2" fontWeight={600} color="#00e6ff">
                    {favoriteScripts.length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Most Used</Typography>
                  <Typography variant="body2" fontWeight={600} color="#00e6ff">
                    Price Objection
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Search and Filters */}
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
            color: '#fff', 
            border: '1px solid #333',
            mb: 3,
            borderRadius: 3,
          }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search scripts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ color: '#00e6ff', mr: 1 }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#00e6ff' },
                        '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
                      },
                      '& .MuiInputBase-input::placeholder': { color: '#666' },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={filterDifficulty}
                      onChange={(e) => setFilterDifficulty(e.target.value)}
                      sx={{
                        color: '#fff',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' },
                      }}
                    >
                      <MenuItem value="all">All Levels</MenuItem>
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    {filteredScripts.length} results
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Scripts Grid */}
          <Grid container spacing={2}>
            {filteredScripts.map((script) => (
              <Grid item xs={12} md={6} lg={4} key={script.id}>
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
                  color: '#fff', 
                  border: '1px solid #333',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(0, 230, 255, 0.2)',
                    borderColor: '#00e6ff',
                  },
                }}
                onClick={() => handleScriptClick(script)}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ color: getCategoryColor(script.category) }}>
                          {getCategoryIcon(script.category)}
                        </Box>
                        <Chip
                          label={script.difficulty}
                          size="small"
                          color={getDifficultyColor(script.difficulty)}
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavorite(script.id);
                        }}
                        sx={{ color: favoriteScripts.includes(script.id) ? '#00e6ff' : '#666' }}
                      >
                        {favoriteScripts.includes(script.id) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Box>

                    <Typography variant="h6" fontWeight={600} mb={1} color="#fff">
                      {script.title}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" mb={2} sx={{ 
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {script.content}
                    </Typography>

                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      {script.tags.slice(0, 2).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{ 
                            backgroundColor: '#333',
                            color: '#00e6ff',
                            fontSize: '0.7rem',
                          }}
                        />
                      ))}
                      {script.tags.length > 2 && (
                        <Chip
                          label={`+${script.tags.length - 2}`}
                          size="small"
                          sx={{ 
                            backgroundColor: '#333',
                            color: '#666',
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Star sx={{ fontSize: 16, color: '#ffd700' }} />
                        <Typography variant="body2" color="textSecondary">
                          {script.rating}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {script.duration}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="textSecondary">
                        Used {script.usage} times
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Copy Script">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyScript(script);
                            }}
                            sx={{ 
                              color: copiedScript === script.id ? '#4caf50' : '#00e6ff',
                              '&:hover': { backgroundColor: '#00e6ff22' },
                            }}
                          >
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredScripts.length === 0 && (
            <Card sx={{ 
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
              color: '#fff', 
              border: '1px solid #333',
              borderRadius: 3,
            }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Search sx={{ fontSize: 60, mb: 2, color: '#666' }} />
                <Typography variant="h6" gutterBottom>
                  No scripts found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Try adjusting your search criteria or filters
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Script Details Dialog */}
      <Dialog
        open={showScriptDialog}
        onClose={() => setShowScriptDialog(false)}
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
        {selectedScript && (
          <>
            <DialogTitle sx={{ 
              color: '#00e6ff',
              borderBottom: '1px solid #333',
              background: 'linear-gradient(90deg, #00e6ff11 0%, transparent 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}>
              <Box sx={{ color: getCategoryColor(selectedScript.category) }}>
                {getCategoryIcon(selectedScript.category)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                  {selectedScript.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {getCategoryName(selectedScript.category)} • {selectedScript.difficulty} • {selectedScript.duration}
                </Typography>
              </Box>
              <Chip
                label={selectedScript.difficulty}
                size="small"
                color={getDifficultyColor(selectedScript.difficulty)}
                sx={{ fontWeight: 600 }}
              />
            </DialogTitle>
            
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Script Content */}
                <Grid item xs={12}>
                  <Card sx={{ 
                    background: '#222', 
                    border: '1px solid #333',
                    borderRadius: 2,
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={3} color="#00e6ff">
                        Script Content
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.8,
                        backgroundColor: '#333',
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid #444',
                        whiteSpace: 'pre-wrap',
                      }}>
                        {selectedScript.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Script Details */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    background: '#222', 
                    border: '1px solid #333',
                    borderRadius: 2,
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={3} color="#00e6ff">
                        Script Details
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="textSecondary">Category:</Typography>
                          <Typography variant="body2" fontWeight={600} color="#fff">
                            {getCategoryName(selectedScript.category)}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="textSecondary">Difficulty:</Typography>
                          <Chip
                            label={selectedScript.difficulty}
                            size="small"
                            color={getDifficultyColor(selectedScript.difficulty)}
                          />
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="textSecondary">Duration:</Typography>
                          <Typography variant="body2" fontWeight={600} color="#fff">
                            {selectedScript.duration}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="textSecondary">Usage:</Typography>
                          <Typography variant="body2" fontWeight={600} color="#00e6ff">
                            {selectedScript.usage} times
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="textSecondary">Rating:</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Star sx={{ color: '#ffd700' }} />
                            <Typography variant="body2" fontWeight={600}>
                              {selectedScript.rating}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Variables */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    background: '#222', 
                    border: '1px solid #333',
                    borderRadius: 2,
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={3} color="#00e6ff">
                        Variables to Replace
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {selectedScript.variables.map((variable, index) => (
                          <Chip
                            key={index}
                            label={variable}
                            size="small"
                            sx={{ 
                              backgroundColor: '#333',
                              color: '#00e6ff',
                              border: '1px solid #00e6ff',
                            }}
                          />
                        ))}
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        Replace these variables with actual values when using the script.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Tags */}
                <Grid item xs={12}>
                  <Card sx={{ 
                    background: '#222', 
                    border: '1px solid #333',
                    borderRadius: 2,
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={2} color="#00e6ff">
                        Tags
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {selectedScript.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{ 
                              backgroundColor: '#333',
                              color: '#00e6ff',
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ 
              p: 3, 
              borderTop: '1px solid #333',
              background: 'linear-gradient(90deg, #00e6ff11 0%, transparent 100%)',
            }}>
              <Button 
                onClick={() => setShowScriptDialog(false)}
                sx={{ 
                  color: '#666',
                  '&:hover': { backgroundColor: '#333' },
                }}
              >
                Close
              </Button>
              <Button
                variant="outlined"
                startIcon={<FavoriteBorder />}
                onClick={() => handleFavorite(selectedScript.id)}
                sx={{ 
                  borderColor: favoriteScripts.includes(selectedScript.id) ? '#00e6ff' : '#666',
                  color: favoriteScripts.includes(selectedScript.id) ? '#00e6ff' : '#666',
                }}
              >
                {favoriteScripts.includes(selectedScript.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              <Button
                variant="contained"
                startIcon={<ContentCopy />}
                onClick={() => handleCopyScript(selectedScript)}
                sx={{ 
                  backgroundColor: '#00e6ff', 
                  color: '#000',
                  '&:hover': { backgroundColor: '#00b3cc' },
                }}
              >
                Copy Script
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 