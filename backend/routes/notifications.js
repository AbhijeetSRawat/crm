const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { broadcastUpdate } = require('../server');

// In-memory storage for notifications (in production, use database)
let notifications = [];

// Get notifications for an agent
router.get('/agent/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { unreadOnly = false, limit = 50 } = req.query;

    let agentNotifications = notifications.filter(n => 
      n.agentId === agentId || n.agentId === 'all'
    );

    if (unreadOnly === 'true') {
      agentNotifications = agentNotifications.filter(n => !n.read);
    }

    // Sort by created_at descending and limit
    agentNotifications = agentNotifications
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: agentNotifications,
      count: agentNotifications.length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      message: error.message
    });
  }
});

// Create a new notification
router.post('/', async (req, res) => {
  try {
    const { agentId, type, title, message, data, priority = 'normal' } = req.body;

    if (!agentId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Agent ID, type, title, and message are required'
      });
    }

    const notification = {
      id: uuidv4(),
      agentId,
      type,
      title,
      message,
      data: data || {},
      priority,
      read: false,
      created_at: new Date().toISOString(),
      read_at: null
    };

    notifications.push(notification);

    // Broadcast real-time notification
    broadcastUpdate('notification', {
      type: 'created',
      data: notification,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification',
      message: error.message
    });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = notifications.find(n => n.id === id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    notification.read = true;
    notification.read_at = new Date().toISOString();

    // Broadcast real-time update
    broadcastUpdate('notification', {
      type: 'read',
      data: notification,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      message: error.message
    });
  }
});

// Mark all notifications as read for an agent
router.put('/agent/:agentId/read-all', async (req, res) => {
  try {
    const { agentId } = req.params;
    const now = new Date().toISOString();

    const updatedNotifications = notifications.map(notification => {
      if ((notification.agentId === agentId || notification.agentId === 'all') && !notification.read) {
        return {
          ...notification,
          read: true,
          read_at: now
        };
      }
      return notification;
    });

    notifications = updatedNotifications;

    // Broadcast real-time update
    broadcastUpdate('notification', {
      type: 'read_all',
      data: { agentId, count: updatedNotifications.filter(n => n.read_at === now).length },
      timestamp: now
    });

    res.json({
      success: true,
      message: 'All notifications marked as read',
      count: updatedNotifications.filter(n => n.read_at === now).length
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read',
      message: error.message
    });
  }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notificationIndex = notifications.findIndex(n => n.id === id);

    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    const deletedNotification = notifications[notificationIndex];
    notifications.splice(notificationIndex, 1);

    // Broadcast real-time update
    broadcastUpdate('notification', {
      type: 'deleted',
      data: deletedNotification,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification',
      message: error.message
    });
  }
});

// Get notification statistics
router.get('/stats/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    const agentNotifications = notifications.filter(n => 
      n.agentId === agentId || n.agentId === 'all'
    );

    const stats = {
      total: agentNotifications.length,
      unread: agentNotifications.filter(n => !n.read).length,
      read: agentNotifications.filter(n => n.read).length,
      byType: {
        call: agentNotifications.filter(n => n.type === 'call').length,
        reminder: agentNotifications.filter(n => n.type === 'reminder').length,
        lead: agentNotifications.filter(n => n.type === 'lead').length,
        system: agentNotifications.filter(n => n.type === 'system').length,
        alert: agentNotifications.filter(n => n.type === 'alert').length
      },
      byPriority: {
        high: agentNotifications.filter(n => n.priority === 'high').length,
        normal: agentNotifications.filter(n => n.priority === 'normal').length,
        low: agentNotifications.filter(n => n.priority === 'low').length
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notification stats',
      message: error.message
    });
  }
});

// Create system notification (admin function)
router.post('/system', async (req, res) => {
  try {
    const { title, message, data, priority = 'normal', targetAgents = 'all' } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required'
      });
    }

    const notification = {
      id: uuidv4(),
      agentId: targetAgents === 'all' ? 'all' : targetAgents,
      type: 'system',
      title,
      message,
      data: data || {},
      priority,
      read: false,
      created_at: new Date().toISOString(),
      read_at: null
    };

    notifications.push(notification);

    // Broadcast real-time notification
    broadcastUpdate('notification', {
      type: 'system',
      data: notification,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: 'System notification created successfully'
    });
  } catch (error) {
    console.error('Error creating system notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create system notification',
      message: error.message
    });
  }
});

// Auto-create notifications for various events
const createAutoNotification = (agentId, type, title, message, data = {}, priority = 'normal') => {
  const notification = {
    id: uuidv4(),
    agentId,
    type,
    title,
    message,
    data,
    priority,
    read: false,
    created_at: new Date().toISOString(),
    read_at: null
  };

  notifications.push(notification);

  // Broadcast real-time notification
  broadcastUpdate('notification', {
    type: 'created',
    data: notification,
    timestamp: new Date().toISOString()
  });

  return notification;
};

// Export for use in other modules
module.exports = { router, createAutoNotification }; 