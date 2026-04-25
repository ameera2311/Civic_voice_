const express = require("express");
const router = express.Router();

const authController = require("../controller/user_auth_controller");

// Signup → saves user in DB
router.post("/signup", authController.signup);

// Login → fetches user from DB
router.post("/login", authController.login);

// (optional, can stay dummy for now)
router.post("/forgot-password", (req, res) => {
  res.json({ message: "Forgot password API working" });
});

module.exports = router;
