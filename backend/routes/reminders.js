const express = require('express');
const router = express.Router();
const { reminders } = require('../database/database');
const { broadcastUpdate } = require('../server');

// Get all reminders for an agent
router.get('/agent/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const reminderList = await reminders.getByAgent(agentId);
    res.json({
      success: true,
      data: reminderList,
      count: reminderList.length
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reminders',
      message: error.message
    });
  }
});

// Get a specific reminder by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await reminders.getById(id);
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }
    
    res.json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error('Error fetching reminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reminder',
      message: error.message
    });
  }
});

// Create a new reminder
router.post('/', async (req, res) => {
  try {
    const reminderData = req.body;
    
    // Validate required fields
    if (!reminderData.agent_id || !reminderData.title) {
      return res.status(400).json({
        success: false,
        error: 'Agent ID and title are required'
      });
    }
    
    const newReminder = await reminders.create(reminderData);
    
    // Broadcast real-time update
    broadcastUpdate('reminder', {
      type: 'created',
      data: newReminder,
      timestamp: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      data: newReminder,
      message: 'Reminder created successfully'
    });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create reminder',
      message: error.message
    });
  }
});

// Update a reminder
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.created_at;
    
    const updatedReminder = await reminders.update(id, updates);
    
    if (!updatedReminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }
    
    // Broadcast real-time update
    broadcastUpdate('reminder', {
      type: 'updated',
      data: updatedReminder,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: updatedReminder,
      message: 'Reminder updated successfully'
    });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update reminder',
      message: error.message
    });
  }
});

// Delete a reminder
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get reminder before deletion for broadcast
    const reminder = await reminders.getById(id);
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }
    
    // Delete the reminder (you might want to implement soft delete)
    // For now, we'll just mark it as deleted
    await reminders.update(id, { status: 'deleted' });
    
    // Broadcast real-time update
    broadcastUpdate('reminder', {
      type: 'deleted',
      data: { id, ...reminder },
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete reminder',
      message: error.message
    });
  }
});

// Complete a reminder
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const updates = {
      status: 'completed',
      completed_at: new Date().toISOString()
    };
    
    if (notes) updates.notes = notes;
    
    const updatedReminder = await reminders.update(id, updates);
    
    // Broadcast real-time update
    broadcastUpdate('reminder', {
      type: 'completed',
      data: updatedReminder,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: updatedReminder,
      message: 'Reminder marked as completed'
    });
  } catch (error) {
    console.error('Error completing reminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete reminder',
      message: error.message
    });
  }
});

// Get reminders since a specific timestamp (for sync)
router.get('/sync/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { since } = req.query;
    
    if (!since) {
      return res.status(400).json({
        success: false,
        error: 'Since timestamp is required'
      });
    }
    
    const reminderList = await reminders.getRemindersSince(since, agentId);
    
    res.json({
      success: true,
      data: reminderList,
      count: reminderList.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error syncing reminders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync reminders',
      message: error.message
    });
  }
});

// Bulk sync reminders (for offline sync)
router.post('/sync', async (req, res) => {
  try {
    const { reminders: reminderList, agentId } = req.body;
    
    if (!reminderList || !Array.isArray(reminderList) || !agentId) {
      return res.status(400).json({
        success: false,
        error: 'Reminders array and agent ID are required'
      });
    }
    
    const results = await reminders.syncReminders(reminderList, agentId);
    
    res.json({
      success: true,
      data: results,
      count: results.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error bulk syncing reminders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync reminders',
      message: error.message
    });
  }
});

// Get overdue reminders
router.get('/overdue/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const now = new Date().toISOString();
    
    const overdueReminders = await reminders.getByAgent(agentId);
    const filtered = overdueReminders.filter(reminder => 
      reminder.status === 'pending' && 
      reminder.due_date && 
      new Date(reminder.due_date) < new Date()
    );
    
    res.json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    console.error('Error fetching overdue reminders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overdue reminders',
      message: error.message
    });
  }
});

// Get due soon reminders (next 24 hours)
router.get('/due-soon/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const allReminders = await reminders.getByAgent(agentId);
    const dueSoon = allReminders.filter(reminder => 
      reminder.status === 'pending' && 
      reminder.due_date && 
      new Date(reminder.due_date) >= now &&
      new Date(reminder.due_date) <= tomorrow
    );
    
    res.json({
      success: true,
      data: dueSoon,
      count: dueSoon.length
    });
  } catch (error) {
    console.error('Error fetching due soon reminders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch due soon reminders',
      message: error.message
    });
  }
});

module.exports = router; 