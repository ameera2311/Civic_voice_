const langMap = {
  en: "English",
  ta: "Tamil",
  hi: "Hindi",
  te: "Telugu",
  fr: "French",
  es: "Spanish",
  ml: "Malayalam",
  kn: "Kannada",
  ur: "Urdu",
  zh: "Chinese",
  ar: "Arabic",
  bn: "Bengali",
  gu: "Gujarati",
  pa: "Punjabi",
};

/**
 * Calls your backend to translate text and return a readable language name
 */
export async function detectAndTranslate(input) {
  if (!input || !input.trim()) {
    return { lang: "", translation: "" };
  }

  try {
    // 🔹 Call your local backend route
    const response = await fetch("http://localhost:5000/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });

    if (!response.ok) throw new Error("Backend translation error");

    const data = await response.json();
    
    // 🔹 Map the code (ta) to the full name (Tamil)
    const langCode = data.detectedLang;
    const fullLanguageName = langMap[langCode] || `Unknown (${langCode})`;

    return {
      lang: fullLanguageName,
      translation: data.translatedText,
    };
  } catch (error) {
    console.error("Frontend Translation error:", error);
    return { lang: "Error", translation: input };
  }
}
