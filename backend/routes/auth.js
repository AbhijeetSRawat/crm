const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');
const { createAutoNotification } = require('./notifications');
const { broadcastUpdate } = require('../server');

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'techbro24-super-secret-jwt-key-2024';

// Mock admin users (in production, store in database)
const adminUsers = [
  {
    id: 'admin-1',
    email: 'admin@techbro24.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Admin User',
    role: 'admin',
    permissions: ['all'],
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'supervisor-1',
    email: 'supervisor@techbro24.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Supervisor User',
    role: 'supervisor',
    permissions: ['view_agents', 'view_leads', 'view_calls', 'view_reports'],
    status: 'active',
    created_at: new Date().toISOString()
  }
];

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType, username } = req.body;
    console.log('DEBUG: Login attempt', { email, userType, username });

    if ((userType === 'agent' && (!username || !password)) || (!email && !username) || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required for agent login, or email and password for admin/supervisor.'
      });
    }

    let user = null;

    // Check admin users first
    if (userType === 'admin' || userType === 'supervisor') {
      user = adminUsers.find(u => u.email === email && u.role === userType);

      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
          });
        }
      }
    } else {
      // Check agent users by username (MongoDB)
      user = await Agent.findOne({ username });
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
          });
        }
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id || user._id,
        email: user.email,
        role: user.role || 'agent',
        permissions: user.permissions || ['basic']
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful login
    console.log(`User ${user.username || user.email} logged in successfully`);

    // (Attendance logic can be migrated later)

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role || 'agent',
          permissions: user.permissions || ['basic']
        }
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

// Register endpoint (for agents)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, role = 'agent' } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    // Check if user already exists
    const existingAgent = await Agent.findOne({ email });

    if (existingAgent) {
      return res.status(409).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Create new agent
    const newAgent = await Agent.create({
      name,
      email,
      phone,
      role,
      status: 'active'
    });

    // Create welcome notification
    createAutoNotification(
      newAgent.id,
      'system',
      'Welcome to TechBro24!',
      `Welcome ${name}! Your account has been created successfully.`,
      { accountCreated: new Date().toISOString() },
      'normal'
    );

    res.status(201).json({
      success: true,
      data: newAgent,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message
    });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const { userId, role } = req.user;

    let user = null;

    if (role === 'admin' || role === 'supervisor') {
      user = adminUsers.find(u => u.id === userId);
    } else {
      user = await Agent.findById(userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove sensitive information
    const { password, ...userProfile } = user;

    res.json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated
    delete updates.password;
    delete updates.role;
    delete updates.permissions;
    delete updates.id;

    let updatedUser = null;

    if (role === 'admin' || role === 'supervisor') {
      const userIndex = adminUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        adminUsers[userIndex] = { ...adminUsers[userIndex], ...updates };
        updatedUser = adminUsers[userIndex];
      }
    } else {
      updatedUser = await Agent.findByIdAndUpdate(userId, updates, { new: true });
    }

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove sensitive information
    const { password, ...userProfile } = updatedUser;

    res.json({
      success: true,
      data: userProfile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

// Change password
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }

    let user = null;

    if (role === 'admin' || role === 'supervisor') {
      user = adminUsers.find(u => u.id === userId);

      if (user) {
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            error: 'Current password is incorrect'
          });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      }
    } else {
      // For agents, implement password change logic
      user = await Agent.findById(userId);
      if (user) {
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            error: 'Current password is incorrect'
          });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      message: error.message
    });
  }
});

// Logout endpoint
router.post('/logout', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    // Create logout notification
    createAutoNotification(
      userId,
      'system',
      'Logout Successful',
      'You have been logged out successfully.',
      { logoutTime: new Date().toISOString() },
      'normal'
    );

    // In a real application, you might want to blacklist the token
    // For now, we'll just return success

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      message: error.message
    });
  }
});

// Refresh token endpoint
router.post('/refresh', verifyToken, async (req, res) => {
  try {
    const { userId, email, role, permissions } = req.user;

    // Generate new token
    const newToken = jwt.sign(
      {
        userId,
        email,
        role,
        permissions
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token: newToken
      },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh token',
      message: error.message
    });
  }
});

// Check authentication status
router.get('/check', verifyToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        authenticated: true,
        user: req.user
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication check failed',
      message: error.message
    });
  }
});

// Get all users (admin only)
router.get('/users', verifyToken, async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const allAgents = await Agent.find({});
    const allUsers = [...adminUsers, ...allAgents];

    // Remove sensitive information
    const users = allUsers.map(user => {
      const { password, ...userProfile } = user;
      return userProfile;
    });

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

module.exports = { router, verifyToken }; 