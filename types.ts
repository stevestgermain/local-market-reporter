export interface DemographicItem {
  label: string;
  percentage: number;
}

export interface MarketReport {
  marketName: string;
  locationType: 'National' | 'State' | 'DMA' | 'City' | 'Zip';
  mapView: {
    keyword: string;
    zoom: number;
  };
  population: string;
  households: string;
  medianAge: number;
  householdIncome: string;
  topLineInsights: string[];
  ageBreakdown: DemographicItem[];
  ethnicityBreakdown: DemographicItem[];
  topIndustries: string[];
  transitHabits: string;
  populationTrend: 'Growing' | 'Stable' | 'Declining';
  mediaLandscape: string;
  mediaUsage: string[];
  hotspots: string[];
  psychographics: string[];
  commuteTime: string;
  politicalLeaning: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  hasGenerated: boolean;
}