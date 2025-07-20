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
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Badge,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  AdminPanelSettings,
  SupervisorAccount,
  Person,
  Business,
  Security,
  Edit,
  Save,
  Cancel,
  Delete,
  Add,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning,
  Error,
  Lock,
  LockOpen,
  Group,
  Assignment,
  Monitor,
  ScreenShare,
  Videocam,
  PhotoCamera,
} from '@mui/icons-material';

// Mock user data with roles
const mockUsers = [
  {
    id: 'user1',
    name: 'Admin User',
    email: 'admin@crm.com',
    currentRole: 'admin',
    monitoringPermissions: {
      viewScreenshots: true,
      viewRecordings: true,
      takeScreenshots: true,
      startRecordings: true,
      assignRoles: true,
      manageSettings: true,
    },
    status: 'active',
  },
  {
    id: 'user2',
    name: 'Supervisor 1',
    email: 'supervisor1@crm.com',
    currentRole: 'supervisor',
    monitoringPermissions: {
      viewScreenshots: true,
      viewRecordings: true,
      takeScreenshots: true,
      startRecordings: true,
      assignRoles: false,
      manageSettings: false,
    },
    status: 'active',
  },
  {
    id: 'user3',
    name: 'Senior Agent',
    email: 'senior@crm.com',
    currentRole: 'senior',
    monitoringPermissions: {
      viewScreenshots: true,
      viewRecordings: false,
      takeScreenshots: true,
      startRecordings: false,
      assignRoles: false,
      manageSettings: false,
    },
    status: 'active',
  },
  {
    id: 'user4',
    name: 'Sales Agent',
    email: 'agent@crm.com',
    currentRole: 'agent',
    monitoringPermissions: {
      viewScreenshots: false,
      viewRecordings: false,
      takeScreenshots: false,
      startRecordings: false,
      assignRoles: false,
      manageSettings: false,
    },
    status: 'active',
  },
];

const roleDefinitions = {
  admin: {
    name: 'Administrator',
    description: 'Full access to all monitoring features and user management',
    color: '#f44336',
    icon: <AdminPanelSettings />,
    permissions: {
      viewScreenshots: true,
      viewRecordings: true,
      takeScreenshots: true,
      startRecordings: true,
      assignRoles: true,
      manageSettings: true,
    },
  },
  supervisor: {
    name: 'Supervisor',
    description: 'Can view all screenshots and recordings, manage monitoring',
    color: '#ff9800',
    icon: <SupervisorAccount />,
    permissions: {
      viewScreenshots: true,
      viewRecordings: true,
      takeScreenshots: true,
      startRecordings: true,
      assignRoles: false,
      manageSettings: false,
    },
  },
  senior: {
    name: 'Senior Agent',
    description: 'Can view screenshots and take screenshots',
    color: '#2196f3',
    icon: <Business />,
    permissions: {
      viewScreenshots: true,
      viewRecordings: false,
      takeScreenshots: true,
      startRecordings: false,
      assignRoles: false,
      manageSettings: false,
    },
  },
  agent: {
    name: 'Sales Agent',
    description: 'Basic agent with no monitoring access',
    color: '#4caf50',
    icon: <Person />,
    permissions: {
      viewScreenshots: false,
      viewRecordings: false,
      takeScreenshots: false,
      startRecordings: false,
      assignRoles: false,
      manageSettings: false,
    },
  },
};

export default function RoleManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  const handleEditUser = (user) => {
    setSelectedUser({ ...user });
    setShowEditDialog(true);
  };

  const handleSaveUser = () => {
    setUsers(prev => prev.map(user =>
      user.id === selectedUser.id ? selectedUser : user
    ));

    setShowEditDialog(false);
    setAlertMessage('User role updated successfully');
    setAlertType('success');
    setShowAlert(true);
  };

  const handleCancelEdit = () => {
    setShowEditDialog(false);
    setSelectedUser(null);
  };

  const getRoleColor = (role) => {
    return roleDefinitions[role]?.color || '#666';
  };

  const getRoleIcon = (role) => {
    return roleDefinitions[role]?.icon || <Person />;
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <AdminPanelSettings sx={{ fontSize: 40, color: '#00e6ff' }} />
        <Box>
          <Typography variant="h4" fontWeight={900} color="#00e6ff">
            Role Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage user roles and monitoring permissions
          </Typography>
        </Box>
      </Box>

      {/* Role Definitions */}
      <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={3}>
            Role Definitions
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(roleDefinitions).map(([roleKey, role]) => (
              <Grid item xs={12} md={6} key={roleKey}>
                <Paper sx={{ background: '#222', border: '1px solid #333', borderRadius: 2, p: 2 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: role.color, color: '#fff' }}>
                      {role.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color={role.color}>
                        {role.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {role.description}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2, borderColor: '#333' }} />
                  
                  <Typography variant="body2" fontWeight={600} color="#00e6ff" mb={1}>
                    Permissions:
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.entries(role.permissions).map(([permission, hasAccess]) => (
                      <Grid item xs={6} key={permission}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {hasAccess ? (
                            <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                          ) : (
                            <Error sx={{ fontSize: 16, color: '#f44336' }} />
                          )}
                          <Typography variant="caption" color="textSecondary">
                            {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} color="#00e6ff" mb={3}>
            User Roles & Permissions
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Current Role</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Monitoring Access</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ color: '#00e6ff', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: getRoleColor(user.currentRole), color: '#fff' }}>
                          {getRoleIcon(user.currentRole)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={roleDefinitions[user.currentRole]?.name || user.currentRole}
                        sx={{
                          bgcolor: getRoleColor(user.currentRole),
                          color: '#fff',
                          fontWeight: 600,
                        }}
                        icon={getRoleIcon(user.currentRole)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {user.monitoringPermissions.viewScreenshots && (
                          <Chip
                            label="Screenshots"
                            size="small"
                            sx={{ bgcolor: '#4caf50', color: '#fff', fontSize: '0.7rem' }}
                            icon={<PhotoCamera sx={{ fontSize: 14 }} />}
                          />
                        )}
                        {user.monitoringPermissions.viewRecordings && (
                          <Chip
                            label="Recordings"
                            size="small"
                            sx={{ bgcolor: '#f44336', color: '#fff', fontSize: '0.7rem' }}
                            icon={<Videocam sx={{ fontSize: 14 }} />}
                          />
                        )}
                        {user.monitoringPermissions.assignRoles && (
                          <Chip
                            label="Admin"
                            size="small"
                            sx={{ bgcolor: '#ff9800', color: '#fff', fontSize: '0.7rem' }}
                            icon={<AdminPanelSettings sx={{ fontSize: 14 }} />}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit Role">
                        <IconButton
                          size="small"
                          onClick={() => handleEditUser(user)}
                          sx={{ color: '#00e6ff' }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={handleCancelEdit}
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
          Edit User Role
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: getRoleColor(selectedUser.currentRole), color: '#fff', width: 56, height: 56 }}>
                    {getRoleIcon(selectedUser.currentRole)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="#00e6ff" fontWeight={700}>
                      {selectedUser.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#666' }}>Role</InputLabel>
                  <Select
                    value={selectedUser.currentRole}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setSelectedUser(prev => ({
                        ...prev,
                        currentRole: newRole,
                        monitoringPermissions: roleDefinitions[newRole].permissions,
                      }));
                    }}
                    sx={{
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' },
                    }}
                  >
                    {Object.entries(roleDefinitions).map(([roleKey, role]) => (
                      <MenuItem key={roleKey} value={roleKey}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: role.color, color: '#fff', width: 24, height: 24 }}>
                            {role.icon}
                          </Avatar>
                          <Typography>{role.name}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#666' }}>Status</InputLabel>
                  <Select
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser(prev => ({ ...prev, status: e.target.value }))}
                    sx={{
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' },
                    }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" color="#00e6ff" fontWeight={700} mb={2}>
                  Monitoring Permissions
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(selectedUser.monitoringPermissions).map(([permission, hasAccess]) => (
                    <Grid item xs={12} md={6} key={permission}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={hasAccess}
                            onChange={(e) => setSelectedUser(prev => ({
                              ...prev,
                              monitoringPermissions: {
                                ...prev.monitoringPermissions,
                                [permission]: e.target.checked,
                              },
                            }))}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': { color: '#00e6ff' },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00e6ff' },
                            }}
                          />
                        }
                        label={permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        sx={{ color: '#fff' }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #333' }}>
          <Button onClick={handleCancelEdit} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveUser}
            sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, '&:hover': { background: '#00b3cc' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertType}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 