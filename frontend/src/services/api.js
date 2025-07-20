import io from 'socket.io-client';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://crm-sily.onrender.com/api';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://crm-sily.onrender.com';

// Socket.IO connection
let socket = null;
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Initialize socket connection
export const initializeSocket = (agentId) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('✅ Connected to backend server');
    isConnected = true;
    reconnectAttempts = 0;

    // Authenticate agent
    if (agentId) {
      socket.emit('authenticate', { agentId });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from backend server');
    isConnected = false;
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    reconnectAttempts++;

    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
    isConnected = true;
    reconnectAttempts = 0;

    // Re-authenticate agent
    if (agentId) {
      socket.emit('authenticate', { agentId });
    }
  });

  return socket;
};

// Get socket instance
export const getSocket = () => socket;

// Check if connected
export const isSocketConnected = () => isConnected;

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

export { apiRequest };

// Health check
export const checkHealth = () => apiRequest('/health');

// Call API functions
export const callsAPI = {
  // Get agent's calls
  getByAgent: (agentId) => apiRequest(`/calls/agent/${agentId}`),

  // Get specific call
  getById: (id) => apiRequest(`/calls/${id}`),

  // Create new call
  create: (callData) => apiRequest('/calls', {
    method: 'POST',
    body: JSON.stringify(callData),
  }),

  // Update call
  update: (id, updates) => apiRequest(`/calls/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),

  // Delete call
  delete: (id) => apiRequest(`/calls/${id}`, {
    method: 'DELETE',
  }),

  // Start call
  start: (id, data) => apiRequest(`/calls/${id}/start`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // End call
  end: (id, data) => apiRequest(`/calls/${id}/end`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Sync calls
  sync: (agentId, since) => apiRequest(`/calls/sync/${agentId}?since=${since}`),

  // Bulk sync calls
  bulkSync: (calls, agentId) => apiRequest('/calls/sync', {
    method: 'POST',
    body: JSON.stringify({ calls, agentId }),
  }),
};

// Reminder API functions
export const remindersAPI = {
  // Get agent's reminders
  getByAgent: (agentId) => apiRequest(`/reminders/agent/${agentId}`),

  // Get specific reminder
  getById: (id) => apiRequest(`/reminders/${id}`),

  // Create new reminder
  create: (reminderData) => apiRequest('/reminders', {
    method: 'POST',
    body: JSON.stringify(reminderData),
  }),

  // Update reminder
  update: (id, updates) => apiRequest(`/reminders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),

  // Delete reminder
  delete: (id) => apiRequest(`/reminders/${id}`, {
    method: 'DELETE',
  }),

  // Complete reminder
  complete: (id, data) => apiRequest(`/reminders/${id}/complete`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Sync reminders
  sync: (agentId, since) => apiRequest(`/reminders/sync/${agentId}?since=${since}`),

  // Bulk sync reminders
  bulkSync: (reminders, agentId) => apiRequest('/reminders/sync', {
    method: 'POST',
    body: JSON.stringify({ reminders, agentId }),
  }),

  // Get overdue reminders
  getOverdue: (agentId) => apiRequest(`/reminders/overdue/${agentId}`),

  // Get due soon reminders
  getDueSoon: (agentId) => apiRequest(`/reminders/due-soon/${agentId}`),
};

// Lead API functions
export const leadsAPI = {
  // Get all leads
  getAll: () => apiRequest('/leads'),

  // Get agent's leads
  getByAgent: (agentId) => apiRequest(`/leads/agent/${agentId}`),

  // Get specific lead
  getById: (id) => apiRequest(`/leads/${id}`),

  // Create new lead
  create: (leadData) => apiRequest('/leads', {
    method: 'POST',
    body: JSON.stringify(leadData),
  }),

  // Update lead
  update: (id, updates) => apiRequest(`/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),

  // Delete lead
  delete: (id) => apiRequest(`/leads/${id}`, {
    method: 'DELETE',
  }),

  // Assign lead to agent
  assign: (id, agentId) => apiRequest(`/leads/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify({ agentId }),
  }),

  // Update lead status
  updateStatus: (id, status, notes) => apiRequest(`/leads/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status, notes }),
  }),

  // Sync leads
  sync: (agentId, since) => apiRequest(`/leads/sync/${agentId}?since=${since}`),

  // Bulk sync leads
  bulkSync: (leads, agentId) => apiRequest('/leads/sync', {
    method: 'POST',
    body: JSON.stringify({ leads, agentId }),
  }),

  // Search leads
  search: (query, agentId) => {
    const params = agentId ? `?agentId=${agentId}` : '';
    return apiRequest(`/leads/search/${query}${params}`);
  },

  // Get leads by status
  getByStatus: (status, agentId) => {
    const params = agentId ? `?agentId=${agentId}` : '';
    return apiRequest(`/leads/status/${status}${params}`);
  },

  // Get all feedback for a lead
  getFeedback: (leadId) => apiRequest(`/leads/${leadId}/feedback`),

  // Add feedback for a lead
  addFeedback: (leadId, agent_id, message, type = 'Note') => apiRequest(`/leads/${leadId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent_id, message, type }),
  }),
};

// Agent API functions
export const agentsAPI = {
  // Get all agents
  getAll: () => apiRequest('/agents'),

  // Get specific agent
  getById: (id) => apiRequest(`/agents/${id}`),

  // Create new agent
  create: (agentData) => apiRequest('/agents', {
    method: 'POST',
    body: JSON.stringify(agentData),
  }),

  // Update agent
  update: (id, updates) => apiRequest(`/agents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),

  // Update agent status
  updateStatus: (id, status) => apiRequest(`/agents/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  }),

  // Get agent statistics
  getStats: (id) => apiRequest(`/agents/${id}/stats`),
};

// Sync API functions
export const syncAPI = {
  // Get last sync timestamp
  getLastSync: (agentId, dataType) => apiRequest(`/sync/last/${agentId}?dataType=${dataType}`),

  // Full sync for agent
  fullSync: (agentId, lastSync) => apiRequest(`/sync/full/${agentId}`, {
    method: 'POST',
    body: JSON.stringify({ lastSync }),
  }),

  // Sync specific data type
  syncType: (type, agentId, lastSync, data) => apiRequest(`/sync/${type}/${agentId}`, {
    method: 'POST',
    body: JSON.stringify({ lastSync, data }),
  }),

  // Get sync status
  getStatus: (agentId) => apiRequest(`/sync/status/${agentId}`),

  // Get sync history
  getHistory: (agentId, limit) => apiRequest(`/sync/history/${agentId}?limit=${limit}`),

  // Force sync
  forceSync: (agentId, dataType) => apiRequest(`/sync/force/${agentId}`, {
    method: 'POST',
    body: JSON.stringify({ dataType }),
  }),
};

// Real-time event handlers
export const realtimeAPI = {
  // Emit call update
  emitCallUpdate: (callData) => {
    if (socket && isConnected) {
      socket.emit('call_update', callData);
    }
  },

  // Emit reminder update
  emitReminderUpdate: (reminderData) => {
    if (socket && isConnected) {
      socket.emit('reminder_update', reminderData);
    }
  },

  // Emit lead update
  emitLeadUpdate: (leadData) => {
    if (socket && isConnected) {
      socket.emit('lead_update', leadData);
    }
  },

  // Request sync
  requestSync: (data) => {
    if (socket && isConnected) {
      socket.emit('sync_request', data);
    }
  },

  // Send offline sync data
  sendOfflineSync: (data) => {
    if (socket && isConnected) {
      socket.emit('offline_sync', data);
    }
  },

  // Send ping
  ping: () => {
    if (socket && isConnected) {
      socket.emit('ping');
    }
  },
};

// Local storage utilities for offline support
export const offlineStorage = {
  // Store data locally
  store: (key, data) => {
    try {
      localStorage.setItem(`techbro24_${key}`, JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }));
    } catch (error) {
      console.error('Error storing data locally:', error);
    }
  },

  // Retrieve data from local storage
  retrieve: (key) => {
    try {
      const stored = localStorage.getItem(`techbro24_${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving data from local storage:', error);
      return null;
    }
  },

  // Remove data from local storage
  remove: (key) => {
    try {
      localStorage.removeItem(`techbro24_${key}`);
    } catch (error) {
      console.error('Error removing data from local storage:', error);
    }
  },

  // Get all offline data
  getAllOfflineData: () => {
    const offlineData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('techbro24_')) {
        const data = offlineStorage.retrieve(key.replace('techbro24_', ''));
        if (data) {
          offlineData[key.replace('techbro24_', '')] = data;
        }
      }
    }
    return offlineData;
  },

  // Clear all offline data
  clearAll: () => {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('techbro24_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }
};

// Network status monitoring
export const networkStatus = {
  isOnline: () => navigator.onLine,

  addOnlineListener: (callback) => {
    window.addEventListener('online', callback);
  },

  addOfflineListener: (callback) => {
    window.addEventListener('offline', callback);
  },

  removeOnlineListener: (callback) => {
    window.removeEventListener('online', callback);
  },

  removeOfflineListener: (callback) => {
    window.removeEventListener('offline', callback);
  }
};

export default {
  initializeSocket,
  getSocket,
  isSocketConnected,
  checkHealth,
  callsAPI,
  remindersAPI,
  leadsAPI,
  agentsAPI,
  syncAPI,
  realtimeAPI,
  offlineStorage,
  networkStatus
}; 