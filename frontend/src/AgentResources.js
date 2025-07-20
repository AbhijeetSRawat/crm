import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Tooltip,
  Menu,
  MenuItem as MenuItemComponent,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  PlayArrow,
  Book,
  School,
  Description,
  VideoLibrary,
  Article,
  Quiz,
  Assignment,
  Folder,
  FolderOpen,
  Star,
  StarBorder,
  Bookmark,
  BookmarkBorder,
  Share,
  Print,
  Visibility,
  GetApp,
  CloudDownload,
  PictureAsPdf,
  Image,
  Movie,
  AudioFile,
  Code,
  Business,
  Psychology,
  TrendingUp,
  EmojiEvents,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Schedule,
  AccessTime,
  Person,
  Category,
  Language,
  Update,
  NewReleases,
  LocalOffer,
  Grade,
} from '@mui/icons-material';

// Mock resource data
const mockResources = {
  categories: [
    {
      id: 'training',
      name: 'Training Materials',
      icon: <School />,
      color: '#00e6ff',
      count: 15,
    },
    {
      id: 'scripts',
      name: 'Call Scripts',
      icon: <Psychology />,
      color: '#4caf50',
      count: 8,
    },
    {
      id: 'products',
      name: 'Product Information',
      icon: <Business />,
      color: '#ff9800',
      count: 12,
    },
    {
      id: 'faqs',
      name: 'FAQs & Help',
      icon: <Quiz />,
      color: '#9c27b0',
      count: 20,
    },
    {
      id: 'videos',
      name: 'Video Tutorials',
      icon: <VideoLibrary />,
      color: '#f44336',
      count: 10,
    },
    {
      id: 'documents',
      name: 'Documents',
      icon: <Description />,
      color: '#2196f3',
      count: 25,
    },
  ],
  resources: {
    training: [
      {
        id: 1,
        title: 'CRM System Basics',
        description: 'Complete guide to using the CRM system effectively',
        type: 'pdf',
        size: '2.5 MB',
        duration: '45 min',
        difficulty: 'Beginner',
        rating: 4.8,
        downloads: 156,
        lastUpdated: '2024-07-10',
        tags: ['CRM', 'Basics', 'Training'],
        isBookmarked: true,
        isCompleted: false,
      },
      {
        id: 2,
        title: 'Advanced Sales Techniques',
        description: 'Master advanced sales strategies and closing techniques',
        type: 'video',
        size: '15.2 MB',
        duration: '1h 20min',
        difficulty: 'Advanced',
        rating: 4.9,
        downloads: 89,
        lastUpdated: '2024-07-08',
        tags: ['Sales', 'Advanced', 'Techniques'],
        isBookmarked: false,
        isCompleted: true,
      },
      {
        id: 3,
        title: 'Customer Service Excellence',
        description: 'Best practices for exceptional customer service',
        type: 'pdf',
        size: '1.8 MB',
        duration: '30 min',
        difficulty: 'Intermediate',
        rating: 4.7,
        downloads: 203,
        lastUpdated: '2024-07-05',
        tags: ['Customer Service', 'Best Practices'],
        isBookmarked: true,
        isCompleted: false,
      },
    ],
    scripts: [
      {
        id: 4,
        title: 'Cold Call Opening Script',
        description: 'Effective opening lines for cold calling prospects',
        type: 'pdf',
        size: '0.5 MB',
        duration: '10 min',
        difficulty: 'Beginner',
        rating: 4.6,
        downloads: 234,
        lastUpdated: '2024-07-12',
        tags: ['Cold Call', 'Opening', 'Script'],
        isBookmarked: false,
        isCompleted: false,
      },
      {
        id: 5,
        title: 'Objection Handling Scripts',
        description: 'Proven responses to common customer objections',
        type: 'pdf',
        size: '1.2 MB',
        duration: '25 min',
        difficulty: 'Intermediate',
        rating: 4.8,
        downloads: 167,
        lastUpdated: '2024-07-09',
        tags: ['Objections', 'Handling', 'Responses'],
        isBookmarked: true,
        isCompleted: false,
      },
      {
        id: 6,
        title: 'Product Demo Script',
        description: 'Step-by-step product demonstration guide',
        type: 'video',
        size: '8.7 MB',
        duration: '45 min',
        difficulty: 'Intermediate',
        rating: 4.7,
        downloads: 98,
        lastUpdated: '2024-07-06',
        tags: ['Demo', 'Product', 'Guide'],
        isBookmarked: false,
        isCompleted: true,
      },
    ],
    products: [
      {
        id: 7,
        title: 'Enterprise Package Features',
        description: 'Complete overview of enterprise solution features',
        type: 'pdf',
        size: '3.1 MB',
        duration: '40 min',
        difficulty: 'Intermediate',
        rating: 4.9,
        downloads: 145,
        lastUpdated: '2024-07-11',
        tags: ['Enterprise', 'Features', 'Package'],
        isBookmarked: true,
        isCompleted: false,
      },
      {
        id: 8,
        title: 'Product Comparison Guide',
        description: 'Compare different product tiers and features',
        type: 'pdf',
        size: '2.8 MB',
        duration: '35 min',
        difficulty: 'Beginner',
        rating: 4.5,
        downloads: 178,
        lastUpdated: '2024-07-07',
        tags: ['Comparison', 'Features', 'Tiers'],
        isBookmarked: false,
        isCompleted: false,
      },
      {
        id: 9,
        title: 'Pricing Strategy Guide',
        description: 'Understanding pricing models and strategies',
        type: 'video',
        size: '12.3 MB',
        duration: '55 min',
        difficulty: 'Advanced',
        rating: 4.6,
        downloads: 67,
        lastUpdated: '2024-07-04',
        tags: ['Pricing', 'Strategy', 'Models'],
        isBookmarked: true,
        isCompleted: false,
      },
    ],
    faqs: [
      {
        id: 10,
        title: 'Common CRM Issues & Solutions',
        description: 'Frequently asked questions about CRM usage',
        type: 'pdf',
        size: '1.5 MB',
        duration: '20 min',
        difficulty: 'Beginner',
        rating: 4.4,
        downloads: 189,
        lastUpdated: '2024-07-13',
        tags: ['FAQ', 'CRM', 'Issues'],
        isBookmarked: false,
        isCompleted: false,
      },
      {
        id: 11,
        title: 'Technical Support Guide',
        description: 'How to get technical support and troubleshoot issues',
        type: 'pdf',
        size: '2.1 MB',
        duration: '30 min',
        difficulty: 'Beginner',
        rating: 4.3,
        downloads: 156,
        lastUpdated: '2024-07-10',
        tags: ['Support', 'Technical', 'Troubleshoot'],
        isBookmarked: true,
        isCompleted: false,
      },
    ],
    videos: [
      {
        id: 12,
        title: 'CRM Navigation Tutorial',
        description: 'Step-by-step video guide to CRM navigation',
        type: 'video',
        size: '18.5 MB',
        duration: '1h 15min',
        difficulty: 'Beginner',
        rating: 4.8,
        downloads: 134,
        lastUpdated: '2024-07-12',
        tags: ['Navigation', 'Tutorial', 'Video'],
        isBookmarked: false,
        isCompleted: false,
      },
      {
        id: 13,
        title: 'Lead Management Best Practices',
        description: 'Video guide on effective lead management',
        type: 'video',
        size: '22.1 MB',
        duration: '1h 30min',
        difficulty: 'Intermediate',
        rating: 4.7,
        downloads: 89,
        lastUpdated: '2024-07-08',
        tags: ['Lead Management', 'Best Practices'],
        isBookmarked: true,
        isCompleted: false,
      },
    ],
    documents: [
      {
        id: 14,
        title: 'Sales Process Documentation',
        description: 'Complete sales process and workflow documentation',
        type: 'pdf',
        size: '4.2 MB',
        duration: '50 min',
        difficulty: 'Intermediate',
        rating: 4.6,
        downloads: 112,
        lastUpdated: '2024-07-09',
        tags: ['Sales Process', 'Workflow', 'Documentation'],
        isBookmarked: false,
        isCompleted: false,
      },
      {
        id: 15,
        title: 'Company Policies & Procedures',
        description: 'Updated company policies and standard procedures',
        type: 'pdf',
        size: '3.8 MB',
        duration: '60 min',
        difficulty: 'Beginner',
        rating: 4.5,
        downloads: 145,
        lastUpdated: '2024-07-06',
        tags: ['Policies', 'Procedures', 'Company'],
        isBookmarked: true,
        isCompleted: false,
      },
    ],
  },
  recentResources: [
    { id: 1, title: 'CRM System Basics', category: 'Training', date: '2024-07-12' },
    { id: 4, title: 'Cold Call Opening Script', category: 'Scripts', date: '2024-07-12' },
    { id: 7, title: 'Enterprise Package Features', category: 'Products', date: '2024-07-11' },
    { id: 10, title: 'Common CRM Issues & Solutions', category: 'FAQs', date: '2024-07-13' },
  ],
  popularResources: [
    { id: 3, title: 'Customer Service Excellence', downloads: 203 },
    { id: 4, title: 'Cold Call Opening Script', downloads: 234 },
    { id: 8, title: 'Product Comparison Guide', downloads: 178 },
    { id: 10, title: 'Common CRM Issues & Solutions', downloads: 189 },
  ],
};

export default function AgentResources() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [bookmarkedResources, setBookmarkedResources] = useState([1, 3, 7, 10, 13, 15]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    setShowResourceDialog(true);
  };

  const handleBookmark = (resourceId) => {
    if (bookmarkedResources.includes(resourceId)) {
      setBookmarkedResources(bookmarkedResources.filter(id => id !== resourceId));
    } else {
      setBookmarkedResources([...bookmarkedResources, resourceId]);
    }
  };

  const handleDownload = (resource) => {
    // In real app, this would trigger download
    alert(`Downloading: ${resource.title}`);
  };

  const getFilteredResources = () => {
    let resources = [];
    
    if (selectedCategory === 'all') {
      Object.values(mockResources.resources).forEach(categoryResources => {
        resources = [...resources, ...categoryResources];
      });
    } else {
      resources = mockResources.resources[selectedCategory] || [];
    }

    // Filter by search query
    if (searchQuery) {
      resources = resources.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by difficulty
    if (filterDifficulty !== 'all') {
      resources = resources.filter(resource => resource.difficulty === filterDifficulty);
    }

    // Filter by type
    if (filterType !== 'all') {
      resources = resources.filter(resource => resource.type === filterType);
    }

    return resources;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return <PictureAsPdf />;
      case 'video': return <Movie />;
      case 'audio': return <AudioFile />;
      case 'image': return <Image />;
      default: return <Description />;
    }
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
    const category = mockResources.categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#666';
  };

  const filteredResources = getFilteredResources();

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Book sx={{ fontSize: 40, color: '#00e6ff' }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Document & Resource Center
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Access training materials, scripts, and product information
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Chip
            icon={<Bookmark />}
            label={`${bookmarkedResources.length} Bookmarked`}
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
                Categories
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
                    <FolderOpen />
                  </ListItemIcon>
                  <ListItemText 
                    primary="All Resources" 
                    secondary={`${Object.values(mockResources.resources).flat().length} items`}
                  />
                </ListItem>
                
                {mockResources.categories.map((category) => (
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
                      secondary={`${category.count} items`}
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
                  <Typography variant="body2">Total Resources</Typography>
                  <Typography variant="body2" fontWeight={600} color="#00e6ff">
                    {Object.values(mockResources.resources).flat().length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Bookmarked</Typography>
                  <Typography variant="body2" fontWeight={600} color="#00e6ff">
                    {bookmarkedResources.length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Completed</Typography>
                  <Typography variant="body2" fontWeight={600} color="#00e6ff">
                    {Object.values(mockResources.resources).flat().filter(r => r.isCompleted).length}
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
                    placeholder="Search resources..."
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
                <Grid item xs={12} md={2}>
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
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      sx={{
                        color: '#fff',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' },
                      }}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="pdf">PDF</MenuItem>
                      <MenuItem value="video">Video</MenuItem>
                      <MenuItem value="audio">Audio</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="textSecondary">
                    {filteredResources.length} results
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          <Grid container spacing={2}>
            {filteredResources.map((resource) => (
              <Grid item xs={12} md={6} lg={4} key={resource.id}>
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
                onClick={() => handleResourceClick(resource)}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ color: getCategoryColor(selectedCategory) }}>
                          {getTypeIcon(resource.type)}
                        </Box>
                        <Chip
                          label={resource.type.toUpperCase()}
                          size="small"
                          sx={{ 
                            backgroundColor: '#333',
                            color: '#00e6ff',
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(resource.id);
                        }}
                        sx={{ color: bookmarkedResources.includes(resource.id) ? '#00e6ff' : '#666' }}
                      >
                        {bookmarkedResources.includes(resource.id) ? <Bookmark /> : <BookmarkBorder />}
                      </IconButton>
                    </Box>

                    <Typography variant="h6" fontWeight={600} mb={1} color="#fff">
                      {resource.title}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" mb={2} sx={{ lineHeight: 1.5 }}>
                      {resource.description}
                    </Typography>

                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      {resource.tags.slice(0, 2).map((tag, index) => (
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
                      {resource.tags.length > 2 && (
                        <Chip
                          label={`+${resource.tags.length - 2}`}
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
                      <Chip
                        label={resource.difficulty}
                        size="small"
                        color={getDifficultyColor(resource.difficulty)}
                        sx={{ fontSize: '0.7rem' }}
                      />
                      <Box display="flex" alignItems="center" gap={1}>
                        <Star sx={{ fontSize: 16, color: '#ffd700' }} />
                        <Typography variant="body2" color="textSecondary">
                          {resource.rating}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="textSecondary">
                        {resource.duration} • {resource.size}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(resource);
                            }}
                            sx={{ color: '#00e6ff' }}
                          >
                            <Download />
                          </IconButton>
                        </Tooltip>
                        {resource.isCompleted && (
                          <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredResources.length === 0 && (
            <Card sx={{ 
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
              color: '#fff', 
              border: '1px solid #333',
              borderRadius: 3,
            }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Search sx={{ fontSize: 60, mb: 2, color: '#666' }} />
                <Typography variant="h6" gutterBottom>
                  No resources found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Try adjusting your search criteria or filters
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Resource Detail Dialog */}
      <Dialog
        open={showResourceDialog}
        onClose={() => setShowResourceDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedResource && (
          <>
            <DialogTitle sx={{ 
              color: '#00e6ff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Box display="flex" alignItems="center" gap={2}>
                {getTypeIcon(selectedResource.type)}
                <Typography variant="h6">{selectedResource.title}</Typography>
              </Box>
              <IconButton
                onClick={() => handleBookmark(selectedResource.id)}
                sx={{ color: bookmarkedResources.includes(selectedResource.id) ? '#00e6ff' : '#666' }}
              >
                {bookmarkedResources.includes(selectedResource.id) ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="body1" paragraph>
                    {selectedResource.description}
                  </Typography>
                  
                  <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                    {selectedResource.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{ backgroundColor: '#333', color: '#00e6ff' }}
                      />
                    ))}
                  </Box>

                  <Box display="flex" gap={2} mb={3}>
                    <Chip
                      label={selectedResource.difficulty}
                      color={getDifficultyColor(selectedResource.difficulty)}
                    />
                    <Chip label={`${selectedResource.duration}`} />
                    <Chip label={`${selectedResource.size}`} />
                  </Box>

                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Star sx={{ color: '#ffd700' }} />
                      <Typography variant="body2">{selectedResource.rating}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      • {selectedResource.downloads} downloads
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      • Updated {selectedResource.lastUpdated}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ background: '#f5f5f5' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Resource Details
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Type:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedResource.type.toUpperCase()}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Size:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedResource.size}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Duration:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedResource.duration}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Difficulty:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedResource.difficulty}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowResourceDialog(false)}>Close</Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => handleDownload(selectedResource)}
                sx={{ backgroundColor: '#00e6ff', color: '#000' }}
              >
                Download
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 