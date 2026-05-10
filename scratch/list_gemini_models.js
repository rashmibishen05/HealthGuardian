
async function listModels() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  
  console.log("Listing available models...");
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Status:", response.status);
    if (data.models) {
      console.log("Available models:");
      data.models.forEach(m => console.log("- " + m.name));
    } else {
      console.log("No models found. Error:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

listModels();
