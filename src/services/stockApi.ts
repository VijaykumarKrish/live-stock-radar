
export interface StockData {
  current_price: number;
  previous_close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  market_cap: number;
  dividend_yield: number;
}

export interface StocksResponse {
  [symbol: string]: StockData;
}

// Fetch stock data from the local API server
export const fetchStockData = async (): Promise<StocksResponse> => {
  try {
    const baseUrl = "http://localhost:5000/";
    const response = await fetch(`${baseUrl}api/stocks`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stock data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Fetched stock data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error; // Re-throw to let caller handle the error
  }
};

// Helper to calculate percentage change
export const calculateChange = (current: number, previous: number): number => {
  return parseFloat(((current - previous) / previous * 100).toFixed(2));
};

// Helper to format large numbers
export const formatNumber = (num: number, compact = false): string => {
  if (compact) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  }
  return new Intl.NumberFormat('en-US').format(num);
};

// Helper to format currency values
export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(num);
};
