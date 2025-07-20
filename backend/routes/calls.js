const express = require('express');
const router = express.Router();
const Call = require('../models/Call');
const Agent = require('../models/Agent');
const Lead = require('../models/Lead');

// Get all calls
router.get('/', async (req, res) => {
  try {
    const calls = await Call.find()
      .populate('agent_id', 'username name email')
      .populate('lead_id', 'name phone email');
    res.json({ success: true, data: calls, count: calls.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch calls', message: error.message });
  }
});

// Get calls by agent
router.get('/agent/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    let agent = await Agent.findOne({ $or: [{ _id: agentId }, { username: agentId }] });
    if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
    const calls = await Call.find({ agent_id: agent._id })
      .populate('agent_id', 'username name email')
      .populate('lead_id', 'name phone email');
    res.json({ success: true, data: calls, count: calls.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch agent calls', message: error.message });
  }
});

// Get a specific call by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const call = await Call.findById(id)
      .populate('agent_id', 'username name email')
      .populate('lead_id', 'name phone email');
    if (!call) return res.status(404).json({ success: false, error: 'Call not found' });
    res.json({ success: true, data: call });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch call', message: error.message });
  }
});

// Create a new call
router.post('/', async (req, res) => {
  try {
    const callData = req.body;
    if (!callData.agent_id || !callData.phone_number) {
      return res.status(400).json({ success: false, error: 'Agent ID and phone number are required' });
    }
    if (typeof callData.agent_id === 'string') {
      const agent = await Agent.findOne({ $or: [{ _id: callData.agent_id }, { username: callData.agent_id }] });
      if (agent) callData.agent_id = agent._id;
    }
    if (callData.lead_id && typeof callData.lead_id === 'string') {
      const lead = await Lead.findOne({ _id: callData.lead_id });
      if (lead) callData.lead_id = lead._id;
    }
    const newCall = await Call.create(callData);
    res.status(201).json({ success: true, data: newCall, message: 'Call created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create call', message: error.message });
  }
});

// Update a call
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date();
    const updatedCall = await Call.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedCall) return res.status(404).json({ success: false, error: 'Call not found' });
    res.json({ success: true, data: updatedCall, message: 'Call updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update call', message: error.message });
  }
});

// Delete a call (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCall = await Call.findByIdAndUpdate(id, { status: 'deleted', updated_at: new Date() }, { new: true });
    if (!updatedCall) return res.status(404).json({ success: false, error: 'Call not found' });
    res.json({ success: true, message: 'Call deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete call', message: error.message });
  }
});

// Start a call
router.post('/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    const { started_at } = req.body;
    const updatedCall = await Call.findByIdAndUpdate(id, { status: 'in_progress', started_at: started_at || new Date(), updated_at: new Date() }, { new: true });
    if (!updatedCall) return res.status(404).json({ success: false, error: 'Call not found' });
    res.json({ success: true, data: updatedCall, message: 'Call started successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to start call', message: error.message });
  }
});

// End a call
router.post('/:id/end', async (req, res) => {
  try {
    const { id } = req.params;
    const { ended_at, outcome, duration, notes } = req.body;
    const updates = { status: 'completed', ended_at: ended_at || new Date(), updated_at: new Date() };
    if (outcome) updates.outcome = outcome;
    if (duration) updates.duration = duration;
    if (notes) updates.notes = notes;
    const updatedCall = await Call.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedCall) return res.status(404).json({ success: false, error: 'Call not found' });
    res.json({ success: true, data: updatedCall, message: 'Call ended successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to end call', message: error.message });
  }
});

// Get calls since a specific timestamp (for sync)
router.get('/sync/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { since } = req.query;
    if (!since) return res.status(400).json({ success: false, error: 'Since timestamp is required' });
    let agent = await Agent.findOne({ $or: [{ _id: agentId }, { username: agentId }] });
    if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
    const calls = await Call.find({ agent_id: agent._id, updated_at: { $gt: new Date(since) } })
      .populate('agent_id', 'username name email')
      .populate('lead_id', 'name phone email');
    res.json({ success: true, data: calls, count: calls.length, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to sync calls', message: error.message });
  }
});

// Bulk sync calls (for offline sync)
router.post('/sync', async (req, res) => {
  try {
    const { calls: callList, agentId } = req.body;
    if (!callList || !Array.isArray(callList) || !agentId) {
      return res.status(400).json({ success: false, error: 'Calls array and agent ID are required' });
    }
    let agent = await Agent.findOne({ $or: [{ _id: agentId }, { username: agentId }] });
    if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
    const results = [];
    for (const call of callList) {
      if (call.id || call._id) {
        const updated = await Call.findByIdAndUpdate(call.id || call._id, call, { new: true });
        results.push({ id: call.id || call._id, status: updated ? 'updated' : 'not found' });
      } else {
        call.agent_id = agent._id;
        const newCall = await Call.create(call);
        results.push({ id: newCall._id, status: 'created' });
      }
    }
    res.json({ success: true, data: results, count: results.length, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to sync calls', message: error.message });
  }
});

module.exports = router; 