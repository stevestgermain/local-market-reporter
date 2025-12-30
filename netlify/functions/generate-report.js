const { GoogleGenerativeAI } = require("@google/genai");

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { marketName } = JSON.parse(event.body);
    
    if (!marketName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Market name required' })
      };
    }

    // API key is stored securely in Netlify environment variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Generate a comprehensive market intelligence report for: ${marketName}

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "marketName": "string",
  "locationType": "DMA|City|ZIP",
  "population": "string (e.g., 4.3M)",
  "populationTrend": "Growing|Stable|Declining",
  "households": "string",
  "medianAge": "string",
  "householdIncome": "string",
  "topLineInsights": ["string", "string", "string"],
  "ageBreakdown": [{"label": "18-34", "percentage": 25}],
  "ethnicityBreakdown": [{"label": "White", "percentage": 60}],
  "mediaUsage": ["string"],
  "hotspots": ["string"],
  "psychographics": ["string"],
  "topIndustries": ["string"],
  "transitHabits": "string",
  "mediaLandscape": "string",
  "mapView": {"keyword": "string", "zoom": 10}
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse JSON
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleaned);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate report' })
    };
  }
};
