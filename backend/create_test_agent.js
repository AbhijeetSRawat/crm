// Usage: node create_test_agent.js
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database', 'crm.db');
const db = new sqlite3.Database(dbPath);

const username = 'testagent';
const password = 'test1234';
const name = 'Test Agent';
const email = 'testagent@crm.com';
const phone = '9999999999';
const role = 'agent';
const status = 'active';

async function createAgent() {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM agents WHERE username = ?', [username], async (err, row) => {
            if (err) return reject(err);
            if (row) {
                console.log('Agent already exists:', row.username);
                return resolve();
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = uuidv4();
            db.run(
                `INSERT INTO agents (id, username, password, name, email, phone, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, username, hashedPassword, name, email, phone, role, status],
                function (err) {
                    if (err) return reject(err);
                    console.log('Test agent created:', username);
                    resolve();
                }
            );
        });
    });
}

createAgent()
    .then(() => {
        db.close();
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error creating agent:', err);
        db.close();
        process.exit(1);
    }); 