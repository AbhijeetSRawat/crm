const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://crm-mauve-one.vercel.app",
    methods: ["GET", "POST"]
  }
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI ;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: [
    "*",
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database initialization
const db = require('./database/database');
const { attendance } = require('./database/database');

// Routes
app.use('/api/calls', require('./routes/calls'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/sync', require('./routes/sync'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/notifications', require('./routes/notifications').router);
app.use('/api/automation', require('./routes/automation').router);
app.use('/api/auth', require('./routes/auth').router);

// Get attendance for an agent
app.get('/api/attendance/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const records = await attendance.getAll(agentId);
    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch attendance', message: error.message });
  }
});

// Get attendance for all agents (admin view)
app.get('/api/attendance', async (req, res) => {
  try {
    const { start, end } = req.query;
    let query = 'SELECT * FROM attendance';
    const params = [];
    if (start && end) {
      query += ' WHERE date >= ? AND date <= ?';
      params.push(start, end);
    } else if (start) {
      query += ' WHERE date >= ?';
      params.push(start);
    } else if (end) {
      query += ' WHERE date <= ?';
      params.push(end);
    }
    query += ' ORDER BY date DESC';
    const records = await db.all(query, params);
    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch all attendance', message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'TechBro24 CRM Backend',
    version: '1.0.0'
  });
});

// Socket.IO connection handling
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Store client info
  connectedClients.set(socket.id, {
    id: socket.id,
    connectedAt: new Date(),
    agentId: null,
    lastActivity: new Date()
  });

  // Handle agent authentication
  socket.on('authenticate', (data) => {
    const client = connectedClients.get(socket.id);
    if (client) {
      client.agentId = data.agentId;
      client.lastActivity = new Date();
      console.log(`Agent ${data.agentId} authenticated on socket ${socket.id}`);
    }
  });

  // Handle real-time call updates
  socket.on('call_update', (data) => {
    console.log('Call update received:', data);
    // Broadcast to all connected clients
    io.emit('call_updated', data);
  });

  // Handle reminder updates
  socket.on('reminder_update', (data) => {
    console.log('Reminder update received:', data);
    io.emit('reminder_updated', data);
  });

  // Handle lead updates
  socket.on('lead_update', (data) => {
    console.log('Lead update received:', data);
    io.emit('lead_updated', data);
  });

  // Handle sync requests
  socket.on('sync_request', (data) => {
    console.log('Sync request received:', data);
    // Process sync and send back updated data
    handleSyncRequest(socket, data);
  });

  // Handle offline data sync
  socket.on('offline_sync', (data) => {
    console.log('Offline sync received:', data);
    handleOfflineSync(socket, data);
  });

  // Handle ping/pong for connection monitoring
  socket.on('ping', () => {
    const client = connectedClients.get(socket.id);
    if (client) {
      client.lastActivity = new Date();
    }
    socket.emit('pong');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    connectedClients.delete(socket.id);
  });
});

// Sync request handler
async function handleSyncRequest(socket, data) {
  try {
    const { type, lastSync, agentId } = data;
    let updates = {};

    switch (type) {
      case 'calls':
        updates.calls = await db.getCallsSince(lastSync, agentId);
        break;
      case 'reminders':
        updates.reminders = await db.getRemindersSince(lastSync, agentId);
        break;
      case 'leads':
        updates.leads = await db.getLeadsSince(lastSync, agentId);
        break;
      case 'all':
        updates = {
          calls: await db.getCallsSince(lastSync, agentId),
          reminders: await db.getRemindersSince(lastSync, agentId),
          leads: await db.getLeadsSince(lastSync, agentId)
        };
        break;
    }

    socket.emit('sync_response', {
      type,
      updates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync request error:', error);
    socket.emit('sync_error', { error: error.message });
  }
}

// Offline sync handler
async function handleOfflineSync(socket, data) {
  try {
    const { calls, reminders, leads, agentId } = data;
    const results = {};

    // Sync calls
    if (calls && calls.length > 0) {
      results.calls = await db.syncCalls(calls, agentId);
    }

    // Sync reminders
    if (reminders && reminders.length > 0) {
      results.reminders = await db.syncReminders(reminders, agentId);
    }

    // Sync leads
    if (leads && leads.length > 0) {
      results.leads = await db.syncLeads(leads, agentId);
    }

    socket.emit('offline_sync_response', {
      results,
      timestamp: new Date().toISOString()
    });

    // Broadcast updates to other clients
    io.emit('data_synced', { type: 'offline_sync', agentId });
  } catch (error) {
    console.error('Offline sync error:', error);
    socket.emit('offline_sync_error', { error: error.message });
  }
}

// Broadcast function for server-side updates
function broadcastUpdate(type, data) {
  io.emit(`${type}_updated`, data);
}

// Export for use in routes
module.exports = { io, broadcastUpdate };

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 TechBro24 CRM Backend running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for real-time connections`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 