// db.js
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "CIVIC_VOICE_AUTH_DETAILS",
    port:3306
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL database");
});

module.exports = db;
