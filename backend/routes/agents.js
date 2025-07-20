const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');

// Get all agents
router.get('/', async (req, res) => {
  try {
    const agentList = await Agent.find();
    res.json({
      success: true,
      data: agentList,
      count: agentList.length
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents',
      message: error.message
    });
  }
});

// Create a new agent or supervisor
router.post('/', async (req, res) => {
  try {
    const agentData = req.body;
    if (!agentData.name || !agentData.email || !agentData.username || !agentData.password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, username, and password are required'
      });
    }
    const validRoles = ['agent', 'supervisor'];
    agentData.role = agentData.role || 'agent';
    if (!validRoles.includes(agentData.role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be agent or supervisor.'
      });
    }
    agentData.status = agentData.status || 'active';
    // Hash password
    agentData.password = await bcrypt.hash(agentData.password, 10);
    // Create agent
    const newAgent = await Agent.create(agentData);
    res.status(201).json({
      success: true,
      data: newAgent,
      message: `${agentData.role.charAt(0).toUpperCase() + agentData.role.slice(1)} created successfully`
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create agent',
      message: error.message
    });
  }
});

module.exports = router; 