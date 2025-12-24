import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MarketReport } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// Assume this variable is pre-configured, valid, and accessible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const marketReportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    marketName: { type: Type.STRING, description: "The display name of the market (e.g. 'Chicago DMA', 'Texas', 'Austin, TX')" },
    locationType: { 
      type: Type.STRING, 
      enum: ["National", "State", "DMA", "City", "Zip"],
      description: "The type of region being analyzed."
    },
    mapView: {
      type: Type.OBJECT,
      properties: {
        keyword: { type: Type.STRING, description: "Optimized Google Maps search query to show the boundary. For DMAs use 'Metropolitan Area' (e.g. 'Chicago Metropolitan Area'). For Cities use 'City, State'. For Zips use the code." },
        zoom: { type: Type.NUMBER, description: "Recommended zoom level. CRITICAL for display. National: 3, State: 5 (Big States) to 7 (Small States), DMA: 8, City: 11, Zip: 13." }
      }
    },
    population: { type: Type.STRING, description: "Total individuals (e.g. '4.3M')" },
    households: { type: Type.STRING, description: "Total households (e.g. '1.6M')" },
    medianAge: { type: Type.NUMBER, description: "Median age (number only)" },
    householdIncome: { type: Type.STRING, description: "Median HH Income formatted" },
    populationTrend: { type: Type.STRING, enum: ["Growing", "Stable", "Declining"] },
    topLineInsights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 brief, high-impact bullet points summarizing the market opportunity for a media buyer."
    },
    ageBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Age range (e.g., '18-34')" },
          percentage: { type: Type.NUMBER, description: "Percentage number (0-100)" }
        }
      },
      description: "Demographic breakdown by key age groups (0-18, 19-34, 35-54, 55-64, 65+)"
    },
    ethnicityBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Ethnicity Group" },
          percentage: { type: Type.NUMBER, description: "Percentage number (0-100)" }
        }
      },
      description: "Demographic breakdown by major ethnicity groups"
    },
    topIndustries: { type: Type.ARRAY, items: { type: Type.STRING } },
    transitHabits: { type: Type.STRING },
    mediaLandscape: { type: Type.STRING },
    mediaUsage: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "3-4 specific media consumption habits (e.g. 'High podcast usage', 'Heavy drive-time radio')." 
    },
    hotspots: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Specific neighborhoods, districts, or venues where people congregate (e.g. 'The Battery', 'Downtown Arts District')." 
    },
    psychographics: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Key lifestyle interests, activities, or values (e.g. 'Outdoor enthusiasts', 'Tech early adopters', 'Sports fanatics')." 
    },
    commuteTime: { type: Type.STRING },
    politicalLeaning: { type: Type.STRING }
  },
  required: [
    "marketName", "locationType", "mapView", "population", "households", "medianAge", "householdIncome", 
    "topLineInsights", "ageBreakdown", "ethnicityBreakdown", 
    "topIndustries", "transitHabits", "mediaLandscape", "mediaUsage", 
    "hotspots", "psychographics", "politicalLeaning"
  ],
};

export const generateMarketReport = async (marketInput: string): Promise<MarketReport> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a detailed media buyer market report for ${marketInput}. Return JSON.
      
      CRITICAL: Identify the 'locationType' (Zip, City, DMA, State, or National). 
      For 'mapView.keyword', provide a search term that will make Google Maps outline the area (e.g. use 'Metropolitan Area' suffix for DMAs).
      For 'mapView.zoom', ensure the value allows seeing the WHOLE boundary. E.g. Texas needs zoom 5.
      
      Include separate counts for Population and Households. 
      Provide a specific 'Age Breakdown' and 'Ethnicity Breakdown' with percentages.
      Provide 3 'Top Line Insights' that are actionable for advertising strategy.
      Include specific media usage habits, key aggregation territories (hotspots), and psychographic interests.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: marketReportSchema,
        systemInstruction: "You are a Senior Media Researcher. Provide precise, data-backed summaries. Ensure financial data uses currency symbols. Ensure percentages add up reasonably. Top Line insights should be strategic. Focus on where people go and what they do.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI");

    return JSON.parse(text) as MarketReport;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate market report. Please try again.");
  }
};