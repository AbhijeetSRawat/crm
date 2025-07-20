import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  Business,
  Phone,
} from '@mui/icons-material';

const mockAgents = [
  {
    id: 1,
    name: "Abhishek",
    email: "abhishek@crm.com",
    phone: "9876543210",
    password: "agent123",
    avatar: "A",
    department: "Sales",
    status: "Online"
  },
  {
    id: 2,
    name: "Narayan",
    email: "narayan@crm.com", 
    phone: "9123456780",
    password: "agent123",
    avatar: "N",
    department: "Lead Generation",
    status: "On Call"
  },
  {
    id: 3,
    name: "Prince",
    email: "prince@crm.com",
    phone: "9988776655", 
    password: "agent123",
    avatar: "P",
    department: "Customer Service",
    status: "Offline"
  }
];

export default function AgentLogin({ onLogin }) {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setLoginData({ ...loginData, [field]: value });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const agent = mockAgents.find(a => 
      (a.email === loginData.email || a.phone === loginData.email) && 
      a.password === loginData.password
    );

    if (agent) {
      // Store agent data in localStorage
      localStorage.setItem('agentData', JSON.stringify({
        ...agent,
        loginTime: new Date().toISOString(),
        rememberMe: loginData.rememberMe
      }));
      
      onLogin(agent);
    } else {
      setError('Invalid email/phone or password. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          background: '#181818',
          color: '#fff',
          border: '1px solid #333',
          boxShadow: '0 8px 32px rgba(0, 230, 255, 0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(45deg, #00e6ff, #0099cc)',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              <Business />
            </Avatar>
            <Typography variant="h4" fontWeight={900} color="#00e6ff" gutterBottom>
              Techbuddy 31
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Agent Portal
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sign in to access your dashboard
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, backgroundColor: '#d32f2f', color: '#fff' }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email or Phone Number"
              variant="outlined"
              margin="normal"
              value={loginData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#00e6ff' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#333',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00e6ff',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00e6ff',
                  },
                },
              }}
              InputLabelProps={{
                sx: { color: '#ccc' },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={loginData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#00e6ff' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#00e6ff' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#333',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00e6ff',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00e6ff',
                  },
                },
              }}
              InputLabelProps={{
                sx: { color: '#ccc' },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={loginData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  sx={{
                    color: '#00e6ff',
                    '&.Mui-checked': {
                      color: '#00e6ff',
                    },
                  }}
                />
              }
              label="Remember me"
              sx={{ color: '#ccc', mt: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                background: 'linear-gradient(45deg, #00e6ff, #0099cc)',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(45deg, #0099cc, #006699)',
                },
                '&:disabled': {
                  background: '#333',
                  color: '#666',
                },
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3, borderColor: '#333' }}>
            <Typography variant="body2" color="textSecondary">
              Demo Credentials
            </Typography>
          </Divider>

          {/* Demo Credentials */}
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Try these demo accounts:
            </Typography>
            {mockAgents.map((agent) => (
              <Box key={agent.id} sx={{ mb: 1, p: 1, bgcolor: '#222', borderRadius: 1 }}>
                <Typography variant="caption" color="#00e6ff" display="block">
                  {agent.name} ({agent.department})
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  Email: {agent.email} | Phone: {agent.phone}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Password: {agent.password}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Footer */}
          <Box textAlign="center" mt={3}>
            <Typography variant="caption" color="textSecondary">
              Need help? Contact your administrator
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 