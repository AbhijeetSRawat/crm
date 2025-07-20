const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Database file path
const dbPath = path.join(__dirname, 'crm.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeTables();
  }
});

// Initialize database tables
function initializeTables() {
  // Agents table
  db.run(`CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT DEFAULT 'agent',
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Calls table
  db.run(`CREATE TABLE IF NOT EXISTS calls (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL,
    lead_id TEXT,
    phone_number TEXT NOT NULL,
    call_type TEXT DEFAULT 'outbound',
    status TEXT DEFAULT 'pending',
    outcome TEXT,
    duration INTEGER DEFAULT 0,
    notes TEXT,
    recording_url TEXT,
    scheduled_at DATETIME,
    started_at DATETIME,
    ended_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'synced',
    FOREIGN KEY (agent_id) REFERENCES agents (id)
  )`);

  // Leads table
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company TEXT,
    status TEXT DEFAULT 'new',
    source TEXT,
    notes TEXT,
    assigned_agent_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'synced',
    FOREIGN KEY (assigned_agent_id) REFERENCES agents (id)
  )`);

  // Reminders table
  db.run(`CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    due_date DATETIME,
    reminder_time DATETIME,
    is_recurring BOOLEAN DEFAULT 0,
    recurring_type TEXT,
    notes TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'synced',
    FOREIGN KEY (agent_id) REFERENCES agents (id)
  )`);

  // Lead reminders table
  db.run(`CREATE TABLE IF NOT EXISTS lead_reminders (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL,
    lead_id TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    scheduled_at DATETIME NOT NULL,
    status TEXT DEFAULT 'pending',
    sent_at DATETIME,
    delivery_status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'synced',
    FOREIGN KEY (agent_id) REFERENCES agents (id),
    FOREIGN KEY (lead_id) REFERENCES leads (id)
  )`);

  // Sync log table
  db.run(`CREATE TABLE IF NOT EXISTS sync_log (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL,
    sync_type TEXT NOT NULL,
    data_type TEXT NOT NULL,
    record_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'success',
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Attendance table
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL,
    date TEXT NOT NULL,
    login_time DATETIME,
    logout_time DATETIME,
    status TEXT DEFAULT 'present',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents (id)
  )`);

  // Lead feedback table
  db.run(`CREATE TABLE IF NOT EXISTS lead_feedback (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'Note',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads (id),
    FOREIGN KEY (agent_id) REFERENCES agents (id)
  )`);

  console.log('✅ Database tables initialized');
}

// Helper function to run queries with promises
function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

function getQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function allQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Call operations
const calls = {
  async create(callData) {
    const id = uuidv4();
    const query = `
      INSERT INTO calls (id, agent_id, lead_id, phone_number, call_type, status, outcome, duration, notes, scheduled_at, started_at, ended_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id, callData.agent_id, callData.lead_id, callData.phone_number,
      callData.call_type, callData.status, callData.outcome, callData.duration,
      callData.notes, callData.scheduled_at, callData.started_at, callData.ended_at
    ];

    await runQuery(query, params);
    return this.getById(id);
  },

  async getById(id) {
    return getQuery('SELECT * FROM calls WHERE id = ?', [id]);
  },

  async getByAgent(agentId) {
    return allQuery('SELECT * FROM calls WHERE agent_id = ? ORDER BY created_at DESC', [agentId]);
  },

  async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(new Date().toISOString(), id);

    const query = `UPDATE calls SET ${fields}, updated_at = ? WHERE id = ?`;
    await runQuery(query, values);
    return this.getById(id);
  },

  async getCallsSince(timestamp, agentId) {
    return allQuery(
      'SELECT * FROM calls WHERE updated_at > ? AND agent_id = ? ORDER BY updated_at DESC',
      [timestamp, agentId]
    );
  },

  async syncCalls(calls, agentId) {
    const results = [];
    for (const call of calls) {
      try {
        if (call.id) {
          await this.update(call.id, call);
          results.push({ id: call.id, status: 'updated' });
        } else {
          const newCall = await this.create({ ...call, agent_id: agentId });
          results.push({ id: newCall.id, status: 'created' });
        }
      } catch (error) {
        results.push({ id: call.id, status: 'error', error: error.message });
      }
    }
    return results;
  }
};

// Reminder operations
const reminders = {
  async create(reminderData) {
    const id = uuidv4();
    const query = `
      INSERT INTO reminders (id, agent_id, title, description, category, priority, status, due_date, reminder_time, is_recurring, recurring_type, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id, reminderData.agent_id, reminderData.title, reminderData.description,
      reminderData.category, reminderData.priority, reminderData.status,
      reminderData.due_date, reminderData.reminder_time, reminderData.is_recurring,
      reminderData.recurring_type, reminderData.notes
    ];

    await runQuery(query, params);
    return this.getById(id);
  },

  async getById(id) {
    return getQuery('SELECT * FROM reminders WHERE id = ?', [id]);
  },

  async getByAgent(agentId) {
    return allQuery('SELECT * FROM reminders WHERE agent_id = ? ORDER BY created_at DESC', [agentId]);
  },

  async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(new Date().toISOString(), id);

    const query = `UPDATE reminders SET ${fields}, updated_at = ? WHERE id = ?`;
    await runQuery(query, values);
    return this.getById(id);
  },

  async getRemindersSince(timestamp, agentId) {
    return allQuery(
      'SELECT * FROM reminders WHERE updated_at > ? AND agent_id = ? ORDER BY updated_at DESC',
      [timestamp, agentId]
    );
  },

  async syncReminders(reminders, agentId) {
    const results = [];
    for (const reminder of reminders) {
      try {
        if (reminder.id) {
          await this.update(reminder.id, reminder);
          results.push({ id: reminder.id, status: 'updated' });
        } else {
          const newReminder = await this.create({ ...reminder, agent_id: agentId });
          results.push({ id: newReminder.id, status: 'created' });
        }
      } catch (error) {
        results.push({ id: reminder.id, status: 'error', error: error.message });
      }
    }
    return results;
  }
};

// Lead operations
const leads = {
  async create(leadData) {
    const id = uuidv4();
    const query = `
      INSERT INTO leads (id, name, phone, email, company, status, source, notes, assigned_agent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id, leadData.name, leadData.phone, leadData.email, leadData.company,
      leadData.status, leadData.source, leadData.notes, leadData.assigned_agent_id
    ];

    await runQuery(query, params);
    return this.getById(id);
  },

  async getById(id) {
    return getQuery('SELECT * FROM leads WHERE id = ?', [id]);
  },

  async getAll() {
    return allQuery('SELECT * FROM leads ORDER BY created_at DESC');
  },

  async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(new Date().toISOString(), id);

    const query = `UPDATE leads SET ${fields}, updated_at = ? WHERE id = ?`;
    await runQuery(query, values);
    return this.getById(id);
  },

  async getLeadsSince(timestamp, agentId) {
    return allQuery(
      'SELECT * FROM leads WHERE updated_at > ? AND (assigned_agent_id = ? OR assigned_agent_id IS NULL) ORDER BY updated_at DESC',
      [timestamp, agentId]
    );
  },

  async syncLeads(leads, agentId) {
    const results = [];
    for (const lead of leads) {
      try {
        if (lead.id) {
          await this.update(lead.id, lead);
          results.push({ id: lead.id, status: 'updated' });
        } else {
          const newLead = await this.create({ ...lead, assigned_agent_id: agentId });
          results.push({ id: newLead.id, status: 'created' });
        }
      } catch (error) {
        results.push({ id: lead.id, status: 'error', error: error.message });
      }
    }
    return results;
  }
};

// Agent operations
const agents = {
  async create(agentData) {
    const id = uuidv4();
    const query = `
      INSERT INTO agents (id, name, email, phone, role, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [id, agentData.name, agentData.email, agentData.phone, agentData.role, agentData.status];

    await runQuery(query, params);
    return this.getById(id);
  },

  async getById(id) {
    return getQuery('SELECT * FROM agents WHERE id = ?', [id]);
  },

  async getAll() {
    return allQuery('SELECT * FROM agents ORDER BY created_at DESC');
  },

  async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(new Date().toISOString(), id);

    const query = `UPDATE agents SET ${fields}, updated_at = ? WHERE id = ?`;
    await runQuery(query, values);
    return this.getById(id);
  }
};

// Sync operations
const sync = {
  async logSync(agentId, syncType, dataType, recordCount, status, errorMessage = null) {
    const id = uuidv4();
    const query = `
      INSERT INTO sync_log (id, agent_id, sync_type, data_type, record_count, status, error_message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await runQuery(query, [id, agentId, syncType, dataType, recordCount, status, errorMessage]);
  },

  async getLastSync(agentId, dataType) {
    return getQuery(
      'SELECT * FROM sync_log WHERE agent_id = ? AND data_type = ? ORDER BY created_at DESC LIMIT 1',
      [agentId, dataType]
    );
  }
};

// Attendance operations
const attendance = {
  async markLogin(agentId) {
    const today = new Date().toISOString().split('T')[0];
    // Check if already marked
    const existing = await getQuery('SELECT * FROM attendance WHERE agent_id = ? AND date = ?', [agentId, today]);
    if (existing) return existing;
    const id = uuidv4();
    const now = new Date().toISOString();
    const query = `INSERT INTO attendance (id, agent_id, date, login_time, status) VALUES (?, ?, ?, ?, 'present')`;
    await runQuery(query, [id, agentId, today, now]);
    return getQuery('SELECT * FROM attendance WHERE id = ?', [id]);
  },
  async markLogout(agentId) {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    const existing = await getQuery('SELECT * FROM attendance WHERE agent_id = ? AND date = ?', [agentId, today]);
    if (!existing) return null;
    const query = `UPDATE attendance SET logout_time = ?, updated_at = ? WHERE id = ?`;
    await runQuery(query, [now, now, existing.id]);
    return getQuery('SELECT * FROM attendance WHERE id = ?', [existing.id]);
  },
  async getToday(agentId) {
    const today = new Date().toISOString().split('T')[0];
    return getQuery('SELECT * FROM attendance WHERE agent_id = ? AND date = ?', [agentId, today]);
  },
  async getAll(agentId) {
    return allQuery('SELECT * FROM attendance WHERE agent_id = ? ORDER BY date DESC', [agentId]);
  },
  async getDaysPresent(agentId) {
    const rows = await allQuery('SELECT * FROM attendance WHERE agent_id = ? AND status = "present"', [agentId]);
    return rows.length;
  }
};

// Lead feedback operations
const leadFeedback = {
  async create(feedbackData) {
    const id = uuidv4();
    const query = `
      INSERT INTO lead_feedback (id, lead_id, agent_id, message, type, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      feedbackData.lead_id,
      feedbackData.agent_id,
      feedbackData.message,
      feedbackData.type || 'Note',
      feedbackData.timestamp || new Date().toISOString()
    ];
    await runQuery(query, params);
    return this.getById(id);
  },
  async getById(id) {
    return getQuery('SELECT * FROM lead_feedback WHERE id = ?', [id]);
  },
  async getByLead(lead_id) {
    return allQuery('SELECT * FROM lead_feedback WHERE lead_id = ? ORDER BY timestamp DESC', [lead_id]);
  },
  async getAll() {
    return allQuery('SELECT * FROM lead_feedback ORDER BY timestamp DESC');
  }
};

module.exports = {
  db,
  calls,
  reminders,
  leads,
  agents,
  sync,
  attendance,
  runQuery,
  getQuery,
  allQuery,
  leadFeedback
}; 