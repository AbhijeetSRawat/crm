const express = require('express');
const router = express.Router();
const { calls, leads, reminders, agents } = require('../database/database');

// Get overall system analytics
router.get('/overview', async (req, res) => {
  try {
    const { startDate, endDate, agentId } = req.query;
    
    // Get all data
    const allCalls = await calls.getByAgent(agentId || 'all');
    const allLeads = await leads.getAll();
    const allReminders = await reminders.getByAgent(agentId || 'all');
    const allAgents = await agents.getAll();

    // Filter by date range if provided
    const filterByDate = (data, start, end) => {
      if (!start && !end) return data;
      return data.filter(item => {
        const itemDate = new Date(item.created_at);
        const startDate = start ? new Date(start) : new Date(0);
        const endDate = end ? new Date(end) : new Date();
        return itemDate >= startDate && itemDate <= endDate;
      });
    };

    const filteredCalls = filterByDate(allCalls, startDate, endDate);
    const filteredLeads = filterByDate(allLeads, startDate, endDate);
    const filteredReminders = filterByDate(allReminders, startDate, endDate);

    // Calculate analytics
    const analytics = {
      calls: {
        total: filteredCalls.length,
        completed: filteredCalls.filter(call => call.status === 'completed').length,
        pending: filteredCalls.filter(call => call.status === 'pending').length,
        averageDuration: filteredCalls.length > 0 ? 
          Math.round(filteredCalls.reduce((sum, call) => sum + (call.duration || 0), 0) / filteredCalls.length) : 0,
        outcomes: {
          successful: filteredCalls.filter(call => call.outcome === 'successful').length,
          noAnswer: filteredCalls.filter(call => call.outcome === 'no_answer').length,
          busy: filteredCalls.filter(call => call.outcome === 'busy').length,
          voicemail: filteredCalls.filter(call => call.outcome === 'voicemail').length,
          other: filteredCalls.filter(call => !['successful', 'no_answer', 'busy', 'voicemail'].includes(call.outcome)).length
        }
      },
      leads: {
        total: filteredLeads.length,
        new: filteredLeads.filter(lead => lead.status === 'new').length,
        contacted: filteredLeads.filter(lead => lead.status === 'contacted').length,
        qualified: filteredLeads.filter(lead => lead.status === 'qualified').length,
        converted: filteredLeads.filter(lead => lead.status === 'converted').length,
        lost: filteredLeads.filter(lead => lead.status === 'lost').length
      },
      reminders: {
        total: filteredReminders.length,
        pending: filteredReminders.filter(reminder => reminder.status === 'pending').length,
        completed: filteredReminders.filter(reminder => reminder.status === 'completed').length,
        overdue: filteredReminders.filter(reminder => 
          reminder.status === 'pending' && 
          reminder.due_date && 
          new Date(reminder.due_date) < new Date()
        ).length
      },
      agents: {
        total: allAgents.length,
        active: allAgents.filter(agent => agent.status === 'active').length,
        inactive: allAgents.filter(agent => agent.status === 'inactive').length
      },
      performance: {
        conversionRate: filteredLeads.length > 0 ? 
          Math.round((filteredLeads.filter(lead => lead.status === 'converted').length / filteredLeads.length) * 100) : 0,
        callSuccessRate: filteredCalls.length > 0 ? 
          Math.round((filteredCalls.filter(call => call.outcome === 'successful').length / filteredCalls.length) * 100) : 0,
        reminderCompletionRate: filteredReminders.length > 0 ? 
          Math.round((filteredReminders.filter(reminder => reminder.status === 'completed').length / filteredReminders.length) * 100) : 0
      }
    };

    res.json({
      success: true,
      data: analytics,
      filters: { startDate, endDate, agentId }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// Get agent performance analytics
router.get('/agent/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { startDate, endDate } = req.query;

    // Get agent data
    const agentCalls = await calls.getByAgent(agentId);
    const allLeads = await leads.getAll();
    const agentLeads = allLeads.filter(lead => lead.assigned_agent_id === agentId);
    const agentReminders = await reminders.getByAgent(agentId);

    // Filter by date range
    const filterByDate = (data, start, end) => {
      if (!start && !end) return data;
      return data.filter(item => {
        const itemDate = new Date(item.created_at);
        const startDate = start ? new Date(start) : new Date(0);
        const endDate = end ? new Date(end) : new Date();
        return itemDate >= startDate && itemDate <= endDate;
      });
    };

    const filteredCalls = filterByDate(agentCalls, startDate, endDate);
    const filteredLeads = filterByDate(agentLeads, startDate, endDate);
    const filteredReminders = filterByDate(agentReminders, startDate, endDate);

    // Calculate daily performance for the last 30 days
    const dailyStats = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayCalls = filteredCalls.filter(call => 
        call.created_at && call.created_at.startsWith(dateStr)
      );
      const dayLeads = filteredLeads.filter(lead => 
        lead.created_at && lead.created_at.startsWith(dateStr)
      );
      const dayReminders = filteredReminders.filter(reminder => 
        reminder.created_at && reminder.created_at.startsWith(dateStr)
      );

      dailyStats.push({
        date: dateStr,
        calls: dayCalls.length,
        completedCalls: dayCalls.filter(call => call.status === 'completed').length,
        leads: dayLeads.length,
        reminders: dayReminders.length,
        completedReminders: dayReminders.filter(reminder => reminder.status === 'completed').length
      });
    }

    const analytics = {
      calls: {
        total: filteredCalls.length,
        completed: filteredCalls.filter(call => call.status === 'completed').length,
        averageDuration: filteredCalls.length > 0 ? 
          Math.round(filteredCalls.reduce((sum, call) => sum + (call.duration || 0), 0) / filteredCalls.length) : 0,
        successRate: filteredCalls.length > 0 ? 
          Math.round((filteredCalls.filter(call => call.outcome === 'successful').length / filteredCalls.length) * 100) : 0
      },
      leads: {
        total: filteredLeads.length,
        converted: filteredLeads.filter(lead => lead.status === 'converted').length,
        conversionRate: filteredLeads.length > 0 ? 
          Math.round((filteredLeads.filter(lead => lead.status === 'converted').length / filteredLeads.length) * 100) : 0
      },
      reminders: {
        total: filteredReminders.length,
        completed: filteredReminders.filter(reminder => reminder.status === 'completed').length,
        overdue: filteredReminders.filter(reminder => 
          reminder.status === 'pending' && 
          reminder.due_date && 
          new Date(reminder.due_date) < new Date()
        ).length,
        completionRate: filteredReminders.length > 0 ? 
          Math.round((filteredReminders.filter(reminder => reminder.status === 'completed').length / filteredReminders.length) * 100) : 0
      },
      dailyStats,
      performance: {
        overallScore: Math.round(
          (filteredCalls.filter(call => call.outcome === 'successful').length / Math.max(filteredCalls.length, 1) * 40) +
          (filteredLeads.filter(lead => lead.status === 'converted').length / Math.max(filteredLeads.length, 1) * 40) +
          (filteredReminders.filter(reminder => reminder.status === 'completed').length / Math.max(filteredReminders.length, 1) * 20)
        )
      }
    };

    res.json({
      success: true,
      data: analytics,
      agentId,
      filters: { startDate, endDate }
    });
  } catch (error) {
    console.error('Error fetching agent analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent analytics',
      message: error.message
    });
  }
});

// Get call analytics with detailed breakdown
router.get('/calls', async (req, res) => {
  try {
    const { startDate, endDate, agentId, outcome, status } = req.query;
    
    let allCalls = [];
    if (agentId && agentId !== 'all') {
      allCalls = await calls.getByAgent(agentId);
    } else {
      // Get calls from all agents
      const allAgents = await agents.getAll();
      for (const agent of allAgents) {
        const agentCalls = await calls.getByAgent(agent.id);
        allCalls = [...allCalls, ...agentCalls];
      }
    }

    // Apply filters
    let filteredCalls = allCalls;
    
    if (startDate || endDate) {
      filteredCalls = filteredCalls.filter(call => {
        const callDate = new Date(call.created_at);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return callDate >= start && callDate <= end;
      });
    }

    if (outcome) {
      filteredCalls = filteredCalls.filter(call => call.outcome === outcome);
    }

    if (status) {
      filteredCalls = filteredCalls.filter(call => call.status === status);
    }

    // Group by date
    const callsByDate = {};
    filteredCalls.forEach(call => {
      const date = call.created_at.split('T')[0];
      if (!callsByDate[date]) {
        callsByDate[date] = [];
      }
      callsByDate[date].push(call);
    });

    // Calculate trends
    const trends = Object.keys(callsByDate).map(date => ({
      date,
      total: callsByDate[date].length,
      completed: callsByDate[date].filter(call => call.status === 'completed').length,
      successful: callsByDate[date].filter(call => call.outcome === 'successful').length,
      averageDuration: callsByDate[date].length > 0 ? 
        Math.round(callsByDate[date].reduce((sum, call) => sum + (call.duration || 0), 0) / callsByDate[date].length) : 0
    }));

    res.json({
      success: true,
      data: {
        total: filteredCalls.length,
        trends,
        breakdown: {
          byOutcome: {
            successful: filteredCalls.filter(call => call.outcome === 'successful').length,
            noAnswer: filteredCalls.filter(call => call.outcome === 'no_answer').length,
            busy: filteredCalls.filter(call => call.outcome === 'busy').length,
            voicemail: filteredCalls.filter(call => call.outcome === 'voicemail').length,
            other: filteredCalls.filter(call => !['successful', 'no_answer', 'busy', 'voicemail'].includes(call.outcome)).length
          },
          byStatus: {
            pending: filteredCalls.filter(call => call.status === 'pending').length,
            inProgress: filteredCalls.filter(call => call.status === 'in_progress').length,
            completed: filteredCalls.filter(call => call.status === 'completed').length,
            cancelled: filteredCalls.filter(call => call.status === 'cancelled').length
          }
        }
      },
      filters: { startDate, endDate, agentId, outcome, status }
    });
  } catch (error) {
    console.error('Error fetching call analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch call analytics',
      message: error.message
    });
  }
});

// Get lead conversion funnel
router.get('/leads/funnel', async (req, res) => {
  try {
    const { startDate, endDate, agentId } = req.query;
    
    let allLeads = [];
    if (agentId && agentId !== 'all') {
      allLeads = await leads.getAll().then(leads => leads.filter(lead => lead.assigned_agent_id === agentId));
    } else {
      allLeads = await leads.getAll();
    }

    // Filter by date range
    if (startDate || endDate) {
      allLeads = allLeads.filter(lead => {
        const leadDate = new Date(lead.created_at);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return leadDate >= start && leadDate <= end;
      });
    }

    const funnel = {
      total: allLeads.length,
      new: allLeads.filter(lead => lead.status === 'new').length,
      contacted: allLeads.filter(lead => lead.status === 'contacted').length,
      qualified: allLeads.filter(lead => lead.status === 'qualified').length,
      converted: allLeads.filter(lead => lead.status === 'converted').length,
      lost: allLeads.filter(lead => lead.status === 'lost').length
    };

    // Calculate conversion rates
    const conversionRates = {
      newToContacted: funnel.new > 0 ? Math.round((funnel.contacted / funnel.new) * 100) : 0,
      contactedToQualified: funnel.contacted > 0 ? Math.round((funnel.qualified / funnel.contacted) * 100) : 0,
      qualifiedToConverted: funnel.qualified > 0 ? Math.round((funnel.converted / funnel.qualified) * 100) : 0,
      overallConversion: funnel.total > 0 ? Math.round((funnel.converted / funnel.total) * 100) : 0
    };

    res.json({
      success: true,
      data: {
        funnel,
        conversionRates,
        filters: { startDate, endDate, agentId }
      }
    });
  } catch (error) {
    console.error('Error fetching lead funnel:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lead funnel',
      message: error.message
    });
  }
});

module.exports = router; 