const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { calls, leads, reminders, agents } = require('../database/database');
const { createAutoNotification } = require('./notifications');

// In-memory storage for automation rules (in production, use database)
let automationRules = [];

// Get all automation rules
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: automationRules,
      count: automationRules.length
    });
  } catch (error) {
    console.error('Error fetching automation rules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch automation rules',
      message: error.message
    });
  }
});

// Create a new automation rule
router.post('/', async (req, res) => {
  try {
    const { name, trigger, conditions, actions, isActive = true } = req.body;

    if (!name || !trigger || !conditions || !actions) {
      return res.status(400).json({
        success: false,
        error: 'Name, trigger, conditions, and actions are required'
      });
    }

    const rule = {
      id: uuidv4(),
      name,
      trigger,
      conditions,
      actions,
      isActive,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    automationRules.push(rule);

    res.status(201).json({
      success: true,
      data: rule,
      message: 'Automation rule created successfully'
    });
  } catch (error) {
    console.error('Error creating automation rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create automation rule',
      message: error.message
    });
  }
});

// Update automation rule
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const ruleIndex = automationRules.findIndex(rule => rule.id === id);
    if (ruleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Automation rule not found'
      });
    }

    automationRules[ruleIndex] = {
      ...automationRules[ruleIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: automationRules[ruleIndex],
      message: 'Automation rule updated successfully'
    });
  } catch (error) {
    console.error('Error updating automation rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update automation rule',
      message: error.message
    });
  }
});

// Delete automation rule
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ruleIndex = automationRules.findIndex(rule => rule.id === id);

    if (ruleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Automation rule not found'
      });
    }

    automationRules.splice(ruleIndex, 1);

    res.json({
      success: true,
      message: 'Automation rule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting automation rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete automation rule',
      message: error.message
    });
  }
});

// Execute automation rules for a specific trigger
const executeAutomationRules = async (trigger, data) => {
  try {
    const activeRules = automationRules.filter(rule => 
      rule.isActive && rule.trigger === trigger
    );

    for (const rule of activeRules) {
      // Check conditions
      const conditionsMet = checkConditions(rule.conditions, data);
      
      if (conditionsMet) {
        // Execute actions
        await executeActions(rule.actions, data);
      }
    }
  } catch (error) {
    console.error('Error executing automation rules:', error);
  }
};

// Check if conditions are met
const checkConditions = (conditions, data) => {
  for (const condition of conditions) {
    const { field, operator, value } = condition;
    
    let fieldValue = data[field];
    
    switch (operator) {
      case 'equals':
        if (fieldValue !== value) return false;
        break;
      case 'not_equals':
        if (fieldValue === value) return false;
        break;
      case 'contains':
        if (!fieldValue || !fieldValue.toString().includes(value)) return false;
        break;
      case 'greater_than':
        if (!fieldValue || fieldValue <= value) return false;
        break;
      case 'less_than':
        if (!fieldValue || fieldValue >= value) return false;
        break;
      case 'is_empty':
        if (fieldValue && fieldValue.toString().trim() !== '') return false;
        break;
      case 'is_not_empty':
        if (!fieldValue || fieldValue.toString().trim() === '') return false;
        break;
      default:
        return false;
    }
  }
  
  return true;
};

// Execute automation actions
const executeActions = async (actions, data) => {
  for (const action of actions) {
    try {
      switch (action.type) {
        case 'create_reminder':
          await createReminderAction(action, data);
          break;
        case 'update_lead_status':
          await updateLeadStatusAction(action, data);
          break;
        case 'send_notification':
          await sendNotificationAction(action, data);
          break;
        case 'assign_lead':
          await assignLeadAction(action, data);
          break;
        case 'create_follow_up':
          await createFollowUpAction(action, data);
          break;
        default:
          console.warn(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error);
    }
  }
};

// Action implementations
const createReminderAction = async (action, data) => {
  const { agentId, title, description, dueDate, priority } = action.params;
  
  const reminderData = {
    agent_id: agentId || data.agent_id,
    title: title || `Follow up for ${data.name || 'Lead'}`,
    description: description || `Automated reminder for ${data.phone || 'contact'}`,
    category: 'followup',
    priority: priority || 'medium',
    due_date: dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  };

  await reminders.create(reminderData);
};

const updateLeadStatusAction = async (action, data) => {
  const { status } = action.params;
  
  if (data.id) {
    await leads.update(data.id, { status });
  }
};

const sendNotificationAction = async (action, data) => {
  const { agentId, title, message, priority } = action.params;
  
  createAutoNotification(
    agentId || data.agent_id,
    'automation',
    title || 'Automated Notification',
    message || 'An automated action was triggered',
    data,
    priority || 'normal'
  );
};

const assignLeadAction = async (action, data) => {
  const { agentId } = action.params;
  
  if (data.id && agentId) {
    await leads.update(data.id, { 
      assigned_agent_id: agentId,
      status: 'assigned'
    });
  }
};

const createFollowUpAction = async (action, data) => {
  const { days, agentId } = action.params;
  
  const followUpDate = new Date();
  followUpDate.setDate(followUpDate.getDate() + (days || 3));
  
  const reminderData = {
    agent_id: agentId || data.agent_id,
    title: `Follow up - ${data.name || 'Lead'}`,
    description: `Follow up call for ${data.phone || 'contact'}`,
    category: 'followup',
    priority: 'medium',
    due_date: followUpDate.toISOString(),
    status: 'pending'
  };

  await reminders.create(reminderData);
};

// Predefined automation templates
const automationTemplates = [
  {
    name: 'New Lead Follow-up',
    trigger: 'lead_created',
    conditions: [
      { field: 'status', operator: 'equals', value: 'new' }
    ],
    actions: [
      {
        type: 'create_reminder',
        params: {
          title: 'Follow up with new lead',
          description: 'Call new lead within 24 hours',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high'
        }
      },
      {
        type: 'send_notification',
        params: {
          title: 'New Lead Assigned',
          message: 'A new lead has been assigned to you',
          priority: 'high'
        }
      }
    ]
  },
  {
    name: 'Missed Call Follow-up',
    trigger: 'call_ended',
    conditions: [
      { field: 'outcome', operator: 'equals', value: 'no_answer' }
    ],
    actions: [
      {
        type: 'create_reminder',
        params: {
          title: 'Follow up - No Answer',
          description: 'Try calling again later',
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          priority: 'medium'
        }
      }
    ]
  },
  {
    name: 'Lead Qualification',
    trigger: 'call_ended',
    conditions: [
      { field: 'outcome', operator: 'equals', value: 'successful' },
      { field: 'duration', operator: 'greater_than', value: 300 }
    ],
    actions: [
      {
        type: 'update_lead_status',
        params: { status: 'qualified' }
      },
      {
        type: 'create_follow_up',
        params: { days: 7 }
      }
    ]
  },
  {
    name: 'Overdue Reminder Alert',
    trigger: 'reminder_overdue',
    conditions: [
      { field: 'status', operator: 'equals', value: 'pending' }
    ],
    actions: [
      {
        type: 'send_notification',
        params: {
          title: 'Overdue Reminder',
          message: 'You have overdue reminders that need attention',
          priority: 'high'
        }
      }
    ]
  }
];

// Get automation templates
router.get('/templates', async (req, res) => {
  try {
    res.json({
      success: true,
      data: automationTemplates
    });
  } catch (error) {
    console.error('Error fetching automation templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch automation templates',
      message: error.message
    });
  }
});

// Create automation rule from template
router.post('/from-template/:templateName', async (req, res) => {
  try {
    const { templateName } = req.params;
    const { agentId, customizations } = req.body;

    const template = automationTemplates.find(t => t.name === templateName);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    // Customize template with agent-specific settings
    const customizedActions = template.actions.map(action => ({
      ...action,
      params: {
        ...action.params,
        agentId: agentId || action.params.agentId,
        ...customizations
      }
    }));

    const rule = {
      id: uuidv4(),
      name: `${template.name} - ${agentId || 'All Agents'}`,
      trigger: template.trigger,
      conditions: template.conditions,
      actions: customizedActions,
      isActive: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    automationRules.push(rule);

    res.status(201).json({
      success: true,
      data: rule,
      message: 'Automation rule created from template successfully'
    });
  } catch (error) {
    console.error('Error creating automation rule from template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create automation rule from template',
      message: error.message
    });
  }
});

// Test automation rule
router.post('/:id/test', async (req, res) => {
  try {
    const { id } = req.params;
    const { testData } = req.body;

    const rule = automationRules.find(r => r.id === id);
    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Automation rule not found'
      });
    }

    const conditionsMet = checkConditions(rule.conditions, testData);
    const actions = conditionsMet ? rule.actions : [];

    res.json({
      success: true,
      data: {
        conditionsMet,
        actions,
        testData
      }
    });
  } catch (error) {
    console.error('Error testing automation rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test automation rule',
      message: error.message
    });
  }
});

module.exports = { router, executeAutomationRules }; 