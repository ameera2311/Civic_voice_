const express = require("express");
const router = express.Router();
const { translate } = require("google-translate-api-x");
const predictDepartment = require("../utils/predictDepartment");

// Predict API with auto-translation
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    // 1️⃣ Translate text to English
    const translationResult = await translate(text, { to: "en" });
    const translatedText = translationResult.text;
    const detectedLang = translationResult.from?.language?.iso || "unknown";

    // 2️⃣ Predict category using translated text
    const category = await predictDepartment(translatedText);

    // 3️⃣ Return both translation and prediction
    res.json({
      language: detectedLang,
      translatedText,
      category,
    });
  } catch (err) {
    console.error("Prediction API failed:", err);

    if (err.name === "TooManyRequestsError" || err.status === 429) {
      return res.status(429).json({ message: "Too many requests. Please wait." });
    }

    res.status(500).json({ message: "Prediction failed" });
  }
});

module.exports = router;