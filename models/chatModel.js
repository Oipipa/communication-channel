const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./chat.db');

// Create a table for messages if it doesn't exist
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, userId TEXT, text TEXT)");
});

function getAllMessages(callback) {
    db.all("SELECT * FROM messages", callback);
}

function addMessage(userId, text, callback) {
    db.run("INSERT INTO messages (userId, text) VALUES (?, ?)", [userId, text], callback);
}

module.exports = {
    getAllMessages,
    addMessage
};
