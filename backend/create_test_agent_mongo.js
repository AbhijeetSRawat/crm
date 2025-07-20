// Usage: node create_test_agent_mongo.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Agent = require('./models/Agent');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm-calling';

async function createTestAgent() {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const username = 'testagent';
    const password = 'test1234';
    const name = 'Test Agent';
    const email = 'testagent@crm.com';
    const phone = '9999999999';
    const role = 'agent';
    const status = 'active';

    // Check if agent already exists
    const existing = await Agent.findOne({ username });
    if (existing) {
        console.log('Agent already exists:', username);
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Agent.create({
        username,
        password: hashedPassword,
        name,
        email,
        phone,
        role,
        status,
    });

    console.log('Test agent created:', username);
    process.exit(0);
}

createTestAgent().catch(err => {
    console.error('Error:', err);
    process.exit(1);
}); 