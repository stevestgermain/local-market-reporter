import { MarketReport } from '../types';

export async function generateMarketReport(marketName: string): Promise<MarketReport> {
  try {
    const response = await fetch('/.netlify/functions/generate-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketName })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}
