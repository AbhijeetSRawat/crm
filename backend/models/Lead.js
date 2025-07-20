const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    company: { type: String },
    status: { type: String, default: 'new' },
    source: { type: String },
    notes: { type: String },
    assigned_agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lead', leadSchema); 