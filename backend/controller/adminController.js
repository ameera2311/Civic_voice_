const jwt = require("jsonwebtoken");

exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  // ✅ Admin credentials
  if (email === "admin@civicvoice.gov" && password === "admin123") {

    const token = jwt.sign(
      {
        id: 1,
        email: "admin@civicvoice.gov",
        role: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      role: "admin"
    });
  }

  res.status(401).json({ message: "Invalid credentials" });
};
