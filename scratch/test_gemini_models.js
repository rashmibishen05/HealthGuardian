
import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGemini() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Try to list models to see what's available
    // Note: listModels might not be available in all versions of the SDK
    console.log("Attempting to generate content with 'gemini-1.5-flash'...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Failed with gemini-1.5-flash:", error.message);
    
    try {
      console.log("Attempting with 'gemini-pro'...");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Hello");
      console.log("Success with gemini-pro:", result.response.text());
    } catch (err2) {
      console.error("Failed with gemini-pro:", err2.message);
    }
  }
}

testGemini();
