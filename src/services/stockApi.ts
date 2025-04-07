
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

// In a real app, this would be a real API call
// For now, we'll use the sample data provided
export const fetchStockData = async (): Promise<StocksResponse> => {
  // Simulating API call with the provided sample data
  return {
    "TATAMOTORS.NS": {
      "current_price": 572.7,
      "previous_close": 613.85,
      "open": 560.5,
      "high": 574.0,
      "low": 535.75,
      "volume": 39155475,
      "market_cap": 2108309110784,
      "dividend_yield": 0.49
    },
    "POWERGRID.NS": {
      "current_price": 288.05,
      "previous_close": 293.9,
      "open": 283.6,
      "high": 293.9,
      "low": 282.3,
      "volume": 17986289,
      "market_cap": 2679037755392,
      "dividend_yield": 5.1
    },
    "BEL.NS": {
      "current_price": 269.45,
      "previous_close": 280.0,
      "open": 257.0,
      "high": 271.55,
      "low": 256.2,
      "volume": 16900759,
      "market_cap": 1969620254720,
      "dividend_yield": 1.32
    },
    "ENGINERSIN.NS": {
      "current_price": 155.9,
      "previous_close": 162.7,
      "open": 150.0,
      "high": 156.4,
      "low": 148.81,
      "volume": 3307506,
      "market_cap": 87622344704,
      "dividend_yield": 1.84
    }
  };
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
