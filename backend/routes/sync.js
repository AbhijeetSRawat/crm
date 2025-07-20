const express = require('express');
const router = express.Router();
const { calls, reminders, leads, sync } = require('../database/database');

// Get last sync timestamp for an agent
router.get('/last/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { dataType } = req.query;
    
    if (!dataType) {
      return res.status(400).json({
        success: false,
        error: 'Data type is required'
      });
    }
    
    const lastSync = await sync.getLastSync(agentId, dataType);
    
    res.json({
      success: true,
      data: lastSync,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching last sync:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch last sync',
      message: error.message
    });
  }
});

// Full sync for an agent
router.post('/full/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { lastSync } = req.body;
    
    const timestamp = lastSync || new Date(0).toISOString();
    
    // Get all data since last sync
    const syncData = {
      calls: await calls.getCallsSince(timestamp, agentId),
      reminders: await reminders.getRemindersSince(timestamp, agentId),
      leads: await leads.getLeadsSince(timestamp, agentId)
    };
    
    // Log sync
    await sync.logSync(
      agentId,
      'full',
      'all',
      Object.values(syncData).reduce((total, arr) => total + arr.length, 0),
      'success'
    );
    
    res.json({
      success: true,
      data: syncData,
      timestamp: new Date().toISOString(),
      counts: {
        calls: syncData.calls.length,
        reminders: syncData.reminders.length,
        leads: syncData.leads.length
      }
    });
  } catch (error) {
    console.error('Error performing full sync:', error);
    
    // Log sync error
    try {
      await sync.logSync(
        req.params.agentId,
        'full',
        'all',
        0,
        'error',
        error.message
      );
    } catch (logError) {
      console.error('Error logging sync:', logError);
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to perform full sync',
      message: error.message
    });
  }
});

// Sync specific data type
router.post('/:type/:agentId', async (req, res) => {
  try {
    const { type, agentId } = req.params;
    const { lastSync, data } = req.body;
    
    const timestamp = lastSync || new Date(0).toISOString();
    let syncResults = {};
    
    switch (type) {
      case 'calls':
        if (data && Array.isArray(data)) {
          syncResults = await calls.syncCalls(data, agentId);
        } else {
          syncResults = await calls.getCallsSince(timestamp, agentId);
        }
        break;
        
      case 'reminders':
        if (data && Array.isArray(data)) {
          syncResults = await reminders.syncReminders(data, agentId);
        } else {
          syncResults = await reminders.getRemindersSince(timestamp, agentId);
        }
        break;
        
      case 'leads':
        if (data && Array.isArray(data)) {
          syncResults = await leads.syncLeads(data, agentId);
        } else {
          syncResults = await leads.getLeadsSince(timestamp, agentId);
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid sync type'
        });
    }
    
    // Log sync
    await sync.logSync(
      agentId,
      data ? 'offline_sync' : 'online_sync',
      type,
      Array.isArray(syncResults) ? syncResults.length : 0,
      'success'
    );
    
    res.json({
      success: true,
      data: syncResults,
      timestamp: new Date().toISOString(),
      type
    });
  } catch (error) {
    console.error(`Error syncing ${req.params.type}:`, error);
    
    // Log sync error
    try {
      await sync.logSync(
        req.params.agentId,
        req.body.data ? 'offline_sync' : 'online_sync',
        req.params.type,
        0,
        'error',
        error.message
      );
    } catch (logError) {
      console.error('Error logging sync:', logError);
    }
    
    res.status(500).json({
      success: false,
      error: `Failed to sync ${req.params.type}`,
      message: error.message
    });
  }
});

// Get sync status for an agent
router.get('/status/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    // Get last sync for each data type
    const lastCallSync = await sync.getLastSync(agentId, 'calls');
    const lastReminderSync = await sync.getLastSync(agentId, 'reminders');
    const lastLeadSync = await sync.getLastSync(agentId, 'leads');
    
    const status = {
      calls: {
        lastSync: lastCallSync ? lastCallSync.created_at : null,
        status: lastCallSync ? lastCallSync.status : 'never'
      },
      reminders: {
        lastSync: lastReminderSync ? lastReminderSync.created_at : null,
        status: lastReminderSync ? lastReminderSync.status : 'never'
      },
      leads: {
        lastSync: lastLeadSync ? lastLeadSync.created_at : null,
        status: lastLeadSync ? lastLeadSync.status : 'never'
      },
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sync status',
      message: error.message
    });
  }
});

// Get sync history for an agent
router.get('/history/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { limit = 50 } = req.query;
    
    // This would require adding a method to get sync history
    // For now, we'll return a placeholder
    res.json({
      success: true,
      data: [],
      message: 'Sync history feature coming soon'
    });
  } catch (error) {
    console.error('Error fetching sync history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sync history',
      message: error.message
    });
  }
});

// Force sync for an agent (admin function)
router.post('/force/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { dataType } = req.body;
    
    // This would force a sync regardless of last sync time
    // For now, we'll return a placeholder
    res.json({
      success: true,
      message: 'Force sync initiated',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error forcing sync:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to force sync',
      message: error.message
    });
  }
});

module.exports = router; 