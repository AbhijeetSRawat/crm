import React, { useState } from 'react';
import AgentLogin from './AgentLogin';
import AgentPanelLayout from './AgentPanelLayout';
import AgentNotifications from './AgentNotifications';
import AgentTasks from './AgentTasks';
import AgentAttendance from './AgentAttendance';
import AgentAnalytics from './AgentAnalytics';
import AgentLeaderboard from './AgentLeaderboard';
import AgentChat from './AgentChat';
import AgentResources from './AgentResources';
import AgentProfile from './AgentProfile';
import AgentLeave from './AgentLeave';
import AgentScripts from './AgentScripts';
import AgentFeedbackNotes from './AgentFeedbackNotes';
import AgentCalendar from './AgentCalendar';
import AgentEarnings from './AgentEarnings';
import AgentGoals from './AgentGoals';
import AgentCallHistory from './AgentCallHistory';
import { Box, Typography } from '@mui/material';

const featurePlaceholders = {
  dashboard: 'Welcome to your Agent Dashboard! Here you will see your performance overview and quick stats.',
  attendance: 'Clock in/out and view your attendance history here.',
  analytics: 'Performance analytics and charts will be shown here.',
  leaderboard: 'See your ranking and achievements here.',
  chat: 'Chat with your manager or support team here.',
  resources: 'Access training materials and resources here.',
  profile: 'Manage your profile and account details here.',
  leave: 'Apply for leave and view status here.',
  scripts: 'Access call scripts and templates here.',
  feedback: 'Log customer feedback and notes here.',
  calendar: 'View your calendar, meetings, and follow-ups here.',
  earnings: 'See your earnings breakdown and payslips here.',
  goals: 'Set and track your goals and self-assessments here.',
};

export default function AgentApp() {
  const [agent, setAgent] = useState(() => {
    const agentData = localStorage.getItem('agentData');
    return agentData ? JSON.parse(agentData) : null;
  });
  const [selected, setSelected] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('agentData');
    setAgent(null);
    setSelected('dashboard');
  };

  if (!agent) {
    return <AgentLogin onLogin={setAgent} />;
  }

  if (selected === 'logout') {
    handleLogout();
    return null;
  }

  const renderContent = () => {
    switch (selected) {
      case 'notifications':
        return <AgentNotifications />;
      case 'tasks':
        return <AgentTasks />;
      case 'callHistory':
        return <AgentCallHistory />;
      case 'attendance':
        return <AgentAttendance />;
      case 'analytics':
        return <AgentAnalytics />;
      case 'leaderboard':
        return <AgentLeaderboard />;
      case 'chat':
        return <AgentChat />;
      case 'resources':
        return <AgentResources />;
      case 'profile':
        return <AgentProfile />;
      case 'leave':
        return <AgentLeave />;
      case 'scripts':
        return <AgentScripts />;
      case 'feedback':
        return <AgentFeedbackNotes />;
      case 'calendar':
        return <AgentCalendar />;
      case 'earnings':
        return <AgentEarnings />;
      case 'goals':
        return <AgentGoals />;
      default:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" color="#00e6ff" fontWeight={800} mb={2}>
              {featurePlaceholders[selected] ? selected.charAt(0).toUpperCase() + selected.slice(1) : 'Agent Panel'}
            </Typography>
            <Typography variant="body1" color="#fff">
              {featurePlaceholders[selected] || 'Feature coming soon.'}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <AgentPanelLayout agent={agent} selected={selected} onSelect={setSelected}>
      {renderContent()}
    </AgentPanelLayout>
  );
} 