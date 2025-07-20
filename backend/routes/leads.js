const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Agent = require('../models/Agent');

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().populate('assigned_agent_id', 'username name email');
    res.json({ success: true, data: leads, count: leads.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leads', message: error.message });
  }
});

// Get leads by agent
router.get('/agent/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    let agent = await Agent.findOne({ $or: [{ _id: agentId }, { username: agentId }] });
    if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
    const leads = await Lead.find({ assigned_agent_id: agent._id }).populate('assigned_agent_id', 'username name email');
    res.json({ success: true, data: leads, count: leads.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch agent leads', message: error.message });
  }
});

// Get a specific lead by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id).populate('assigned_agent_id', 'username name email');
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch lead', message: error.message });
  }
});

// Create a new lead
router.post('/', async (req, res) => {
  try {
    const leadData = req.body;
    if (!leadData.name || !leadData.phone) {
      return res.status(400).json({ success: false, error: 'Name and phone are required' });
    }
    if (leadData.assigned_agent_id && typeof leadData.assigned_agent_id === 'string') {
      const agent = await Agent.findOne({ $or: [{ _id: leadData.assigned_agent_id }, { username: leadData.assigned_agent_id }] });
      if (agent) leadData.assigned_agent_id = agent._id;
    }
    const newLead = await Lead.create(leadData);
    res.status(201).json({ success: true, data: newLead, message: 'Lead created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create lead', message: error.message });
  }
});

// Update a lead
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date();
    const updatedLead = await Lead.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedLead) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, data: updatedLead, message: 'Lead updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update lead', message: error.message });
  }
});

// Delete a lead (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLead = await Lead.findByIdAndUpdate(id, { status: 'deleted', updated_at: new Date() }, { new: true });
    if (!updatedLead) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete lead', message: error.message });
  }
});

// Assign lead to agent
router.post('/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;
    if (!agentId) return res.status(400).json({ success: false, error: 'Agent ID is required' });
    const agent = await Agent.findOne({ $or: [{ _id: agentId }, { username: agentId }] });
    if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
    const updatedLead = await Lead.findByIdAndUpdate(id, { assigned_agent_id: agent._id, status: 'assigned', updated_at: new Date() }, { new: true });
    if (!updatedLead) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, data: updatedLead, message: 'Lead assigned successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to assign lead', message: error.message });
  }
});

// Update lead status
router.post('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'Status is required' });
    const updates = { status, updated_at: new Date() };
    if (notes) updates.notes = notes;
    const updatedLead = await Lead.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedLead) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, data: updatedLead, message: 'Lead status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update lead status', message: error.message });
  }
});

// Search leads
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { agentId } = req.query;
    const search = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } }
      ]
    };
    if (agentId) {
      const agent = await Agent.findOne({ $or: [{ _id: agentId }, { username: agentId }] });
      if (agent) search.assigned_agent_id = agent._id;
    }
    const leads = await Lead.find(search).populate('assigned_agent_id', 'username name email');
    res.json({ success: true, data: leads, count: leads.length, query });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to search leads', message: error.message });
  }
});

// Get leads by status
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const { agentId } = req.query;
    const filter = { status };
    if (agentId) {
      const agent = await Agent.findOne({ $or: [{ _id: agentId }, { username: agentId }] });
      if (agent) filter.assigned_agent_id = agent._id;
    }
    const leads = await Lead.find(filter).populate('assigned_agent_id', 'username name email');
    res.json({ success: true, data: leads, count: leads.length, status });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leads by status', message: error.message });
  }
});

// Bulk upload leads (JSON only)
router.post('/bulk', async (req, res) => {
  try {
    let leadList = req.body.leads;
    if (!leadList || !Array.isArray(leadList)) {
      return res.status(400).json({ success: false, error: 'Leads array is required' });
    }
    const createdLeads = [];
    for (const lead of leadList) {
      if (lead.assigned_agent_id && typeof lead.assigned_agent_id === 'string') {
        const agent = await Agent.findOne({ $or: [{ _id: lead.assigned_agent_id }, { username: lead.assigned_agent_id }] });
        if (agent) lead.assigned_agent_id = agent._id;
      }
      const newLead = await Lead.create(lead);
      createdLeads.push(newLead);
    }
    res.status(201).json({ success: true, data: createdLeads, count: createdLeads.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to upload leads', message: error.message });
  }
});

// Feedback endpoints (stub, to be migrated separately)
router.get('/:id/feedback', async (req, res) => {
  res.status(501).json({ success: false, error: 'Not implemented yet' });
});
router.post('/:id/feedback', async (req, res) => {
  res.status(501).json({ success: false, error: 'Not implemented yet' });
});

module.exports = router; 