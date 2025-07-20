import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Badge,
  Tabs,
  Tab,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  TrendingUp,
  LocalFireDepartment,
  WorkspacePremium,
  MilitaryTech,
  Diamond,
  Psychology,
  Speed,
  Group,
  AttachMoney,
  Phone,
  CheckCircle,
  Flag,
  Schedule,
  Person,
  Business,
  School,
  Favorite,
  Share,
  Download,
} from '@mui/icons-material';

// Mock leaderboard and gamification data
const mockLeaderboardData = {
  currentAgent: {
    id: 1,
    name: "Abhishek",
    avatar: "A",
    rank: 2,
    points: 2840,
    level: 8,
    department: "Sales",
    achievements: 15,
    badges: 8,
    streak: 12,
    totalSales: 125000,
    totalCalls: 635,
    conversions: 81,
  },
  leaderboard: [
    {
      id: 3,
      name: "Prince",
      avatar: "P",
      rank: 1,
      points: 3120,
      level: 9,
      department: "Lead Generation",
      achievements: 18,
      badges: 10,
      streak: 15,
      totalSales: 185000,
      totalCalls: 720,
      conversions: 95,
      isCurrentAgent: false,
    },
    {
      id: 1,
      name: "Abhishek",
      avatar: "A",
      rank: 2,
      points: 2840,
      level: 8,
      department: "Sales",
      achievements: 15,
      badges: 8,
      streak: 12,
      totalSales: 125000,
      totalCalls: 635,
      conversions: 81,
      isCurrentAgent: true,
    },
    {
      id: 2,
      name: "Narayan",
      avatar: "N",
      rank: 3,
      points: 2650,
      level: 7,
      department: "Customer Service",
      achievements: 12,
      badges: 6,
      streak: 8,
      totalSales: 95000,
      totalCalls: 580,
      conversions: 68,
      isCurrentAgent: false,
    },
  ],
  badges: [
    {
      id: 1,
      name: "Sales Champion",
      description: "Achieve ₹100,000 in monthly sales",
      icon: <AttachMoney />,
      color: "#ffd700",
      earned: true,
      earnedDate: "2024-07-01",
      rarity: "gold",
    },
    {
      id: 2,
      name: "Call Master",
      description: "Make 500+ calls in a month",
      icon: <Phone />,
      color: "#00e6ff",
      earned: true,
      earnedDate: "2024-06-15",
      rarity: "blue",
    },
    {
      id: 3,
      name: "Conversion King",
      description: "Maintain 15%+ conversion rate for 3 months",
      icon: <CheckCircle />,
      color: "#4caf50",
      earned: true,
      earnedDate: "2024-06-01",
      rarity: "green",
    },
    {
      id: 4,
      name: "Target Smasher",
      description: "Exceed monthly target by 50%",
      icon: <Flag />,
      color: "#ff9800",
      earned: true,
      earnedDate: "2024-05-20",
      rarity: "orange",
    },
    {
      id: 5,
      name: "Early Bird",
      description: "Clock in early for 30 consecutive days",
      icon: <Schedule />,
      color: "#9c27b0",
      earned: false,
      progress: 25,
      target: 30,
      rarity: "purple",
    },
    {
      id: 6,
      name: "Team Player",
      description: "Help 10 colleagues achieve their targets",
      icon: <Group />,
      color: "#2196f3",
      earned: false,
      progress: 7,
      target: 10,
      rarity: "blue",
    },
    {
      id: 7,
      name: "Speed Demon",
      description: "Complete 50 tasks in a single day",
      icon: <Speed />,
      color: "#f44336",
      earned: false,
      progress: 0,
      target: 50,
      rarity: "red",
    },
    {
      id: 8,
      name: "Mentor",
      description: "Train 5 new agents successfully",
      icon: <School />,
      color: "#795548",
      earned: false,
      progress: 2,
      target: 5,
      rarity: "brown",
    },
  ],
  achievements: [
    {
      id: 1,
      name: "First Sale",
      description: "Close your first deal",
      points: 100,
      earned: true,
      earnedDate: "2024-01-15",
      icon: <AttachMoney />,
    },
    {
      id: 2,
      name: "Call Centurion",
      description: "Make 100 calls in a week",
      points: 200,
      earned: true,
      earnedDate: "2024-02-10",
      icon: <Phone />,
    },
    {
      id: 3,
      name: "Target Achiever",
      description: "Meet monthly target for the first time",
      points: 500,
      earned: true,
      earnedDate: "2024-03-01",
      icon: <Flag />,
    },
    {
      id: 4,
      name: "Perfect Week",
      description: "Achieve 100% attendance for a week",
      points: 300,
      earned: true,
      earnedDate: "2024-04-05",
      icon: <CheckCircle />,
    },
    {
      id: 5,
      name: "Sales Surge",
      description: "Increase sales by 50% compared to last month",
      points: 800,
      earned: true,
      earnedDate: "2024-05-15",
      icon: <TrendingUp />,
    },
    {
      id: 6,
      name: "Customer Favorite",
      description: "Receive 5-star rating from 10 customers",
      points: 400,
      earned: false,
      progress: 7,
      target: 10,
      icon: <Favorite />,
    },
    {
      id: 7,
      name: "Overtime Hero",
      description: "Work 20 hours of overtime in a month",
      points: 600,
      earned: false,
      progress: 12,
      target: 20,
      icon: <Schedule />,
    },
    {
      id: 8,
      name: "Knowledge Seeker",
      description: "Complete all training modules",
      points: 300,
      earned: false,
      progress: 8,
      target: 12,
      icon: <School />,
    },
  ],
  rewards: [
    {
      id: 1,
      name: "Coffee Break",
      description: "Free coffee for a week",
      points: 500,
      available: true,
      claimed: false,
      icon: <Favorite />,
    },
    {
      id: 2,
      name: "Flexible Hours",
      description: "Choose your work hours for a day",
      points: 1000,
      available: true,
      claimed: false,
      icon: <Schedule />,
    },
    {
      id: 3,
      name: "Training Course",
      description: "Free professional development course",
      points: 2000,
      available: true,
      claimed: false,
      icon: <School />,
    },
    {
      id: 4,
      name: "Bonus Day",
      description: "Extra day off",
      points: 5000,
      available: true,
      claimed: false,
      icon: <EmojiEvents />,
    },
    {
      id: 5,
      name: "Gift Card",
      description: "₹1000 gift card",
      points: 3000,
      available: true,
      claimed: false,
      icon: <AttachMoney />,
    },
  ],
  levels: [
    { level: 1, name: "Rookie", pointsRequired: 0, rewards: ["Basic Access"] },
    { level: 2, name: "Trainee", pointsRequired: 500, rewards: ["Coffee Break"] },
    { level: 3, name: "Agent", pointsRequired: 1000, rewards: ["Flexible Hours"] },
    { level: 4, name: "Specialist", pointsRequired: 1500, rewards: ["Training Course"] },
    { level: 5, name: "Expert", pointsRequired: 2000, rewards: ["Bonus Day"] },
    { level: 6, name: "Master", pointsRequired: 2500, rewards: ["Gift Card"] },
    { level: 7, name: "Champion", pointsRequired: 3000, rewards: ["Premium Benefits"] },
    { level: 8, name: "Legend", pointsRequired: 3500, rewards: ["VIP Status"] },
    { level: 9, name: "Elite", pointsRequired: 4000, rewards: ["Executive Perks"] },
    { level: 10, name: "Supreme", pointsRequired: 5000, rewards: ["All Rewards"] },
  ],
};

export default function AgentLeaderboard() {
  const [selectedTab, setSelectedTab] = useState('leaderboard');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badgeDialog, setBadgeDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [rewardDialog, setRewardDialog] = useState(false);

  const currentAgent = mockLeaderboardData.currentAgent;
  const currentLevel = mockLeaderboardData.levels.find(l => l.level === currentAgent.level);
  const nextLevel = mockLeaderboardData.levels.find(l => l.level === currentAgent.level + 1);
  const progressToNextLevel = nextLevel 
    ? ((currentAgent.points - currentLevel.pointsRequired) / (nextLevel.pointsRequired - currentLevel.pointsRequired)) * 100
    : 100;

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <EmojiEvents sx={{ color: '#ffd700', fontSize: 30 }} />;
      case 2: return <WorkspacePremium sx={{ color: '#c0c0c0', fontSize: 30 }} />;
      case 3: return <MilitaryTech sx={{ color: '#cd7f32', fontSize: 30 }} />;
      default: return <Typography variant="h6" color="textSecondary">{rank}</Typography>;
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'gold': return '#ffd700';
      case 'silver': return '#c0c0c0';
      case 'bronze': return '#cd7f32';
      case 'blue': return '#00e6ff';
      case 'green': return '#4caf50';
      case 'orange': return '#ff9800';
      case 'purple': return '#9c27b0';
      case 'red': return '#f44336';
      case 'brown': return '#795548';
      default: return '#666';
    }
  };

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setBadgeDialog(true);
  };

  const handleRewardClaim = (reward) => {
    setSelectedReward(reward);
    setRewardDialog(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <EmojiEvents sx={{ fontSize: 40, color: '#00e6ff' }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#00e6ff">
              Leaderboard & Gamification
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Compete, earn badges, and unlock rewards
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Share />}
          sx={{ borderColor: '#00e6ff', color: '#00e6ff' }}
        >
          Share Progress
        </Button>
      </Box>

      {/* Current Agent Stats */}
      <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <Badge
              badgeContent={getRankIcon(currentAgent.rank)}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#00e6ff',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                {currentAgent.avatar}
              </Avatar>
            </Badge>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={700} color="#00e6ff">
                {currentAgent.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {currentAgent.department} • Level {currentAgent.level} • {currentAgent.points} Points
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Chip
                  icon={<LocalFireDepartment />}
                  label={`${currentAgent.streak} Day Streak`}
                  color="warning"
                  size="small"
                />
                <Chip
                  icon={<Star />}
                  label={`${currentAgent.achievements} Achievements`}
                  color="primary"
                  size="small"
                />
                <Chip
                  icon={<Diamond />}
                  label={`${currentAgent.badges} Badges`}
                  color="secondary"
                  size="small"
                />
              </Box>
              {nextLevel && (
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Progress to Level {nextLevel.level}: {nextLevel.name}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progressToNextLevel}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#333',
                      "& .MuiLinearProgress-bar": { backgroundColor: '#00e6ff' }
                    }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {currentAgent.points - currentLevel.pointsRequired} / {nextLevel.pointsRequired - currentLevel.pointsRequired} points needed
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

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
            <Tab label="Leaderboard" value="leaderboard" />
            <Tab label="Badges" value="badges" />
            <Tab label="Achievements" value="achievements" />
            <Tab label="Rewards" value="rewards" />
            <Tab label="Levels" value="levels" />
          </Tabs>
        </CardContent>
      </Card>

      {/* Leaderboard Tab */}
      {selectedTab === 'leaderboard' && (
        <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              Top Performers
            </Typography>
            <List>
              {mockLeaderboardData.leaderboard.map((agent, index) => (
                <React.Fragment key={agent.id}>
                  <ListItem
                    sx={{
                      backgroundColor: agent.isCurrentAgent ? '#00e6ff22' : 'transparent',
                      border: agent.isCurrentAgent ? '2px solid #00e6ff' : 'none',
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Box display="flex" alignItems="center" justifyContent="center" width={40}>
                        {getRankIcon(agent.rank)}
                      </Box>
                    </ListItemAvatar>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: agent.isCurrentAgent ? '#00e6ff' : '#666' }}>
                        {agent.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="h6" fontWeight={600}>
                            {agent.name}
                          </Typography>
                          {agent.isCurrentAgent && (
                            <Chip label="You" size="small" color="primary" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {agent.department} • Level {agent.level} • {agent.points} Points
                          </Typography>
                          <Box display="flex" gap={2} mt={1}>
                            <Typography variant="caption" color="success.main">
                              ₹{agent.totalSales.toLocaleString()} Sales
                            </Typography>
                            <Typography variant="caption" color="primary.main">
                              {agent.totalCalls} Calls
                            </Typography>
                            <Typography variant="caption" color="warning.main">
                              {agent.conversions} Conversions
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          icon={<LocalFireDepartment />}
                          label={`${agent.streak} days`}
                          size="small"
                          color="warning"
                        />
                        <Typography variant="h6" color="primary" fontWeight={700}>
                          #{agent.rank}
                        </Typography>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < mockLeaderboardData.leaderboard.length - 1 && (
                    <Divider sx={{ borderColor: '#333' }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Badges Tab */}
      {selectedTab === 'badges' && (
        <Grid container spacing={3}>
          {mockLeaderboardData.badges.map((badge) => (
            <Grid item xs={12} sm={6} md={4} key={badge.id}>
              <Card
                sx={{
                  background: '#181818',
                  color: '#fff',
                  border: '1px solid #333',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' },
                  opacity: badge.earned ? 1 : 0.6,
                }}
                onClick={() => handleBadgeClick(badge)}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(45deg, ${badge.color}, ${badge.color}88)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      fontSize: 40,
                    }}
                  >
                    {badge.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {badge.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {badge.description}
                  </Typography>
                  {badge.earned ? (
                    <Chip
                      label="Earned"
                      color="success"
                      size="small"
                      icon={<CheckCircle />}
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Progress: {badge.progress}/{badge.target}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(badge.progress / badge.target) * 100}
                        sx={{
                          mt: 1,
                          backgroundColor: '#333',
                          "& .MuiLinearProgress-bar": { backgroundColor: badge.color }
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Achievements Tab */}
      {selectedTab === 'achievements' && (
        <Grid container spacing={3}>
          {mockLeaderboardData.achievements.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: achievement.earned ? '#4caf50' : '#666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                      }}
                    >
                      {achievement.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {achievement.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {achievement.points} Points
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {achievement.description}
                  </Typography>
                  {achievement.earned ? (
                    <Chip
                      label={`Earned on ${achievement.earnedDate}`}
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Progress: {achievement.progress}/{achievement.target}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(achievement.progress / achievement.target) * 100}
                        sx={{
                          mt: 1,
                          backgroundColor: '#333',
                          "& .MuiLinearProgress-bar": { backgroundColor: '#4caf50' }
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Rewards Tab */}
      {selectedTab === 'rewards' && (
        <Grid container spacing={3}>
          {mockLeaderboardData.rewards.map((reward) => (
            <Grid item xs={12} sm={6} md={4} key={reward.id}>
              <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: '#ff9800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                      }}
                    >
                      {reward.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {reward.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {reward.points} Points
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {reward.description}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleRewardClaim(reward)}
                    disabled={currentAgent.points < reward.points || reward.claimed}
                    sx={{
                      backgroundColor: currentAgent.points >= reward.points ? '#ff9800' : '#666',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: currentAgent.points >= reward.points ? '#f57c00' : '#666',
                      },
                    }}
                  >
                    {reward.claimed ? 'Claimed' : currentAgent.points >= reward.points ? 'Claim Reward' : 'Not Enough Points'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Levels Tab */}
      {selectedTab === 'levels' && (
        <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333' }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              Level Progression
            </Typography>
            <Grid container spacing={2}>
              {mockLeaderboardData.levels.map((level) => (
                <Grid item xs={12} sm={6} md={4} key={level.level}>
                  <Card
                    sx={{
                      background: level.level <= currentAgent.level ? '#222' : '#181818',
                      border: level.level === currentAgent.level ? '2px solid #00e6ff' : '1px solid #333',
                      opacity: level.level <= currentAgent.level ? 1 : 0.6,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" fontWeight={700} color={level.level === currentAgent.level ? '#00e6ff' : '#fff'}>
                        Level {level.level}
                      </Typography>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {level.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {level.pointsRequired} Points Required
                      </Typography>
                      <Box>
                        {level.rewards.map((reward, index) => (
                          <Chip
                            key={index}
                            label={reward}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                            color={level.level <= currentAgent.level ? 'success' : 'default'}
                          />
                        ))}
                      </Box>
                      {level.level === currentAgent.level && (
                        <Chip
                          label="Current Level"
                          color="primary"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Badge Detail Dialog */}
      <Dialog
        open={badgeDialog}
        onClose={() => setBadgeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#00e6ff' }}>
          Badge Details
        </DialogTitle>
        <DialogContent>
          {selectedBadge && (
            <Box textAlign="center">
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `linear-gradient(45deg, ${selectedBadge.color}, ${selectedBadge.color}88)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  fontSize: 60,
                }}
              >
                {selectedBadge.icon}
              </Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {selectedBadge.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {selectedBadge.description}
              </Typography>
              {selectedBadge.earned ? (
                <Chip
                  label={`Earned on ${selectedBadge.earnedDate}`}
                  color="success"
                  size="large"
                  icon={<CheckCircle />}
                />
              ) : (
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Progress: {selectedBadge.progress}/{selectedBadge.target}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(selectedBadge.progress / selectedBadge.target) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#333',
                      "& .MuiLinearProgress-bar": { backgroundColor: selectedBadge.color }
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBadgeDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reward Claim Dialog */}
      <Dialog
        open={rewardDialog}
        onClose={() => setRewardDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#00e6ff' }}>
          Claim Reward
        </DialogTitle>
        <DialogContent>
          {selectedReward && (
            <Box textAlign="center">
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: '#ff9800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  fontSize: 50,
                }}
              >
                {selectedReward.icon}
              </Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {selectedReward.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {selectedReward.description}
              </Typography>
              <Typography variant="h6" color="warning.main" gutterBottom>
                Cost: {selectedReward.points} Points
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your current points: {currentAgent.points}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRewardDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              alert('Reward claimed successfully!');
              setRewardDialog(false);
            }}
            sx={{ backgroundColor: '#ff9800', color: '#fff' }}
          >
            Claim Reward
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 