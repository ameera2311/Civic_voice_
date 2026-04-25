const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect DB
require("./models/db");


// Routes
const complaintsRoutes = require("./routes/complaints");
app.use("/api/complaints", complaintsRoutes);

const translateRoutes = require("./routes/translate");
app.use("/api/translate", translateRoutes);

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const workerRoutes = require("./routes/workerRoutes");

app.use("/api/workers", workerRoutes);

const predictRoutes = require("./routes/predict");
app.use("/api/predict", predictRoutes);

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
});
