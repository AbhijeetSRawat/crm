# TechBro24 CRM Backend

Real-time backend server for the TechBro24 CRM system with WebSocket support and database synchronization.

## Features

- **Real-time Updates**: WebSocket connections for live data synchronization
- **Database Integration**: SQLite database with comprehensive data models
- **API Endpoints**: RESTful APIs for all CRM operations
- **Offline Sync**: Support for offline data synchronization
- **Agent Management**: Complete agent lifecycle management
- **Call Tracking**: Comprehensive call history and management
- **Lead Management**: Full lead lifecycle with assignment
- **Reminder System**: Internal and lead reminder management

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# TechBro24 CRM Backend Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_PATH=./database/crm.db

# JWT Configuration
JWT_SECRET=techbro24-super-secret-jwt-key-2024
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info

# Sync Configuration
SYNC_BATCH_SIZE=100
SYNC_TIMEOUT=30000
```

### 3. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Calls
- `GET /api/calls/agent/:agentId` - Get agent's calls
- `GET /api/calls/:id` - Get specific call
- `POST /api/calls` - Create new call
- `PUT /api/calls/:id` - Update call
- `DELETE /api/calls/:id` - Delete call
- `POST /api/calls/:id/start` - Start call
- `POST /api/calls/:id/end` - End call
- `GET /api/calls/sync/:agentId` - Sync calls
- `POST /api/calls/sync` - Bulk sync calls

### Reminders
- `GET /api/reminders/agent/:agentId` - Get agent's reminders
- `GET /api/reminders/:id` - Get specific reminder
- `POST /api/reminders` - Create new reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder
- `POST /api/reminders/:id/complete` - Complete reminder
- `GET /api/reminders/sync/:agentId` - Sync reminders
- `POST /api/reminders/sync` - Bulk sync reminders
- `GET /api/reminders/overdue/:agentId` - Get overdue reminders
- `GET /api/reminders/due-soon/:agentId` - Get due soon reminders

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/agent/:agentId` - Get agent's leads
- `GET /api/leads/:id` - Get specific lead
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `POST /api/leads/:id/assign` - Assign lead to agent
- `POST /api/leads/:id/status` - Update lead status
- `GET /api/leads/sync/:agentId` - Sync leads
- `POST /api/leads/sync` - Bulk sync leads
- `GET /api/leads/search/:query` - Search leads
- `GET /api/leads/status/:status` - Get leads by status

### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get specific agent
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `POST /api/agents/:id/status` - Update agent status
- `GET /api/agents/:id/stats` - Get agent statistics

### Sync
- `GET /api/sync/last/:agentId` - Get last sync timestamp
- `POST /api/sync/full/:agentId` - Full sync for agent
- `POST /api/sync/:type/:agentId` - Sync specific data type
- `GET /api/sync/status/:agentId` - Get sync status
- `GET /api/sync/history/:agentId` - Get sync history
- `POST /api/sync/force/:agentId` - Force sync

## WebSocket Events

### Client to Server
- `authenticate` - Authenticate agent
- `call_update` - Update call data
- `reminder_update` - Update reminder data
- `lead_update` - Update lead data
- `sync_request` - Request data sync
- `offline_sync` - Sync offline data
- `ping` - Connection ping

### Server to Client
- `call_updated` - Call data updated
- `reminder_updated` - Reminder data updated
- `lead_updated` - Lead data updated
- `sync_response` - Sync response
- `offline_sync_response` - Offline sync response
- `data_synced` - Data sync notification
- `pong` - Connection pong

## Database Schema

### Tables
- `agents` - Agent information
- `calls` - Call history and data
- `leads` - Lead information
- `reminders` - Internal reminders
- `lead_reminders` - Lead-specific reminders
- `sync_log` - Sync operation logs

## Real-time Features

1. **Live Updates**: All data changes are broadcast to connected clients
2. **Offline Support**: Data can be synced when connection is restored
3. **Conflict Resolution**: Handles data conflicts during sync
4. **Connection Monitoring**: Tracks client connections and activity
5. **Batch Operations**: Efficient bulk data synchronization

## Security Features

- Rate limiting to prevent abuse
- CORS configuration for frontend access
- Input validation and sanitization
- Error handling and logging
- Connection monitoring

## Development

### File Structure
```
backend/
├── server.js              # Main server file
├── database/
│   └── database.js        # Database operations
├── routes/
│   ├── calls.js          # Call API routes
│   ├── reminders.js      # Reminder API routes
│   ├── leads.js          # Lead API routes
│   ├── agents.js         # Agent API routes
│   └── sync.js           # Sync API routes
├── package.json
└── README.md
```

### Adding New Features

1. Create new route file in `routes/` directory
2. Add database operations in `database/database.js`
3. Register route in `server.js`
4. Add WebSocket events if needed
5. Update documentation

## Troubleshooting

### Common Issues

1. **Port already in use**: Change PORT in .env file
2. **Database errors**: Check database file permissions
3. **CORS errors**: Verify CORS_ORIGIN in .env
4. **WebSocket connection issues**: Check frontend URL configuration

### Logs

Check console output for detailed error messages and connection logs.

## Support

For issues and questions, check the logs and ensure all environment variables are properly configured. 