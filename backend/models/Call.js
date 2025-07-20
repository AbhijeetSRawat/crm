const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    lead_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    phone_number: { type: String, required: true },
    call_type: { type: String, default: 'outbound' },
    status: { type: String, default: 'pending' },
    outcome: { type: String },
    duration: { type: Number, default: 0 },
    notes: { type: String },
    recording_url: { type: String },
    scheduled_at: { type: Date },
    started_at: { type: Date },
    ended_at: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Call', callSchema); 