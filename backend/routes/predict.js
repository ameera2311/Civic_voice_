

const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

router.post("/", async (req, res) => {

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text required" });
  }

  const command = `python ml_models/predict.py "${text}"`;

  exec(command, (error, stdout, stderr) => {

    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Prediction failed" });
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Invalid prediction output" });
    }

  });

});

module.exports = router;