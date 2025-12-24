import { MarketReport } from "../types";

export const DETROIT_REPORT: MarketReport = {
  marketName: "Detroit, MI",
  locationType: "DMA",
  mapView: {
    keyword: "Detroit DMA",
    zoom: 8
  },
  population: "4.35M",
  households: "1.72M",
  medianAge: 40,
  householdIncome: "$67,500",
  topLineInsights: [
    "High drive-time radio engagement due to car-centric commuter culture (28min+ avg).",
    "Strong local news loyalty; legacy stations dominate early evening slots.",
    "Resurgent downtown attracts younger demos (25-34), while suburbs retain high purchasing power families."
  ],
  ageBreakdown: [
    { label: "0-17", percentage: 22 },
    { label: "18-34", percentage: 21 },
    { label: "35-54", percentage: 26 },
    { label: "55-64", percentage: 14 },
    { label: "65+", percentage: 17 }
  ],
  ethnicityBreakdown: [
    { label: "White", percentage: 65 },
    { label: "Black / African American", percentage: 21 },
    { label: "Hispanic / Latino", percentage: 5 },
    { label: "Asian", percentage: 4 },
    { label: "Other", percentage: 5 }
  ],
  topIndustries: [
    "Automotive & Mobility",
    "Healthcare",
    "Advanced Manufacturing",
    "FinTech"
  ],
  transitHabits: "Heavily reliant on personal vehicles (90%+ commute by car). Public transit (DDOT/SMART) usage concentrated in city center. Growing micro-mobility in Downtown/Midtown.",
  populationTrend: "Stable",
  mediaLandscape: "A split market: Urban core heavily digital and mobile-first, while the sprawling suburbs (Oakland/Macomb counties) maintain traditional linear TV and terrestrial radio consumption habits. Sports broadcasting (Lions, Tigers) is a massive reach vehicle.",
  mediaUsage: [
    "Heavy Drive-Time Radio",
    "Connected TV (CTV) Growth",
    "Local News Appointment Viewing"
  ],
  hotspots: [
    "Campus Martius Park",
    "The District Detroit",
    "Royal Oak Main St",
    "Somerset Collection"
  ],
  psychographics: [
    "Sports Fanatics",
    "DIY / Home Improvement",
    "Midwestern Values"
  ],
  commuteTime: "28 min",
  politicalLeaning: "Swing Market (Urban Blue / Suburban Purple)"
};