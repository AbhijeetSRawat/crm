import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, Button, Alert } from '@mui/material';
import { CheckCircle, Error, Sync, Wifi, WifiOff } from '@mui/icons-material';
import { useRealtime } from '../contexts/RealtimeContext';
import { checkHealth, callsAPI } from '../services/api';

const BackendStatus = () => {
  const { isConnected, isOnline, syncStatus, lastSync } = useRealtime();
  const [healthStatus, setHealthStatus] = useState(null);
  const [testResult, setTestResult] = useState(null);

  // Check backend health
  const checkBackendHealth = async () => {
    try {
      const response = await checkHealth();
      setHealthStatus({ status: 'success', data: response });
    } catch (error) {
      setHealthStatus({ status: 'error', error: error.message });
    }
  };

  // Test API call
  const testAPICall = async () => {
    try {
      setTestResult({ status: 'loading' });
      const response = await callsAPI.getByAgent('test-agent');
      setTestResult({ status: 'success', data: response });
    } catch (error) {
      setTestResult({ status: 'error', error: error.message });
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'connected':
        return 'success';
      case 'error':
      case 'disconnected':
        return 'error';
      case 'syncing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'connected':
        return <CheckCircle />;
      case 'error':
      case 'disconnected':
        return <Error />;
      case 'syncing':
        return <Sync />;
      default:
        return null;
    }
  };

  return (
    <Card sx={{ background: '#181818', color: '#fff', border: '1px solid #333', mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#00e6ff', mb: 2, fontWeight: 600 }}>
          Backend Status
        </Typography>
        
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Network Status */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">Network:</Typography>
            <Chip
              icon={isOnline ? <Wifi /> : <WifiOff />}
              label={isOnline ? 'Online' : 'Offline'}
              color={isOnline ? 'success' : 'error'}
              size="small"
            />
          </Box>

          {/* WebSocket Connection */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">WebSocket:</Typography>
            <Chip
              icon={getStatusIcon(isConnected ? 'connected' : 'disconnected')}
              label={isConnected ? 'Connected' : 'Disconnected'}
              color={getStatusColor(isConnected ? 'connected' : 'disconnected')}
              size="small"
            />
          </Box>

          {/* Backend Health */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">Backend:</Typography>
            {healthStatus ? (
              <Chip
                icon={getStatusIcon(healthStatus.status)}
                label={healthStatus.status === 'success' ? 'Healthy' : 'Error'}
                color={getStatusColor(healthStatus.status)}
                size="small"
              />
            ) : (
              <Chip label="Checking..." size="small" />
            )}
          </Box>

          {/* Sync Status */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">Sync:</Typography>
            <Chip
              icon={getStatusIcon(syncStatus)}
              label={syncStatus}
              color={getStatusColor(syncStatus)}
              size="small"
            />
          </Box>

          {/* Last Sync */}
          {lastSync && (
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2">Last Sync:</Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(lastSync).toLocaleString()}
              </Typography>
            </Box>
          )}

          {/* Test Results */}
          {testResult && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>API Test:</Typography>
              {testResult.status === 'loading' && (
                <Alert severity="info" sx={{ mb: 1 }}>Testing API connection...</Alert>
              )}
              {testResult.status === 'success' && (
                <Alert severity="success" sx={{ mb: 1 }}>
                  API test successful! Found {testResult.data?.count || 0} records.
                </Alert>
              )}
              {testResult.status === 'error' && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  API test failed: {testResult.error}
                </Alert>
              )}
            </Box>
          )}

          {/* Action Buttons */}
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="outlined"
              size="small"
              onClick={checkBackendHealth}
              sx={{ color: '#00e6ff', borderColor: '#00e6ff' }}
            >
              Check Health
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={testAPICall}
              sx={{ color: '#00e6ff', borderColor: '#00e6ff' }}
            >
              Test API
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BackendStatus; 