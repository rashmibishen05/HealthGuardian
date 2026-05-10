
import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGemini() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  console.log("Testing Gemini API Key...");
  console.log("Key:", apiKey ? (apiKey.substring(0, 5) + "...") : "MISSING");

  if (!apiKey) {
    console.error("Missing Gemini API Key!");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you working?");
    console.log("Response:", result.response.text());
    console.log("Gemini API is working!");
  } catch (error) {
    console.error("Gemini API failed:", error.message);
  }
}

testGemini();
