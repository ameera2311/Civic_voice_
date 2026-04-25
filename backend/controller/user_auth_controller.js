// user_auth_controller.js
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../models/db"); // your MySQL connection
const jwt = require("jsonwebtoken");
const router = express.Router();


exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (results.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
        [name, email, password],
        (err, result) => {

          const token = jwt.sign(
            { id: result.insertId, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

          res.status(201).json({
            token,
            user: {
              id: result.insertId,
              username: name,
              email: email,
              role: "user"
            }
          });
        }
      );
    }
  );
};


/* -------------------- LOGIN -------------------- */
exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];

    // ⚠️ For now plain password (later use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // ✅ Create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
  token,
  user: {
    id: user.id,
    username: user.name,
    email: user.email,
    role: user.role
  }
});

  });
};

