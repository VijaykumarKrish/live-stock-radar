
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { fetchStockData, StocksResponse } from "@/services/stockApi";
import StockCard from "@/components/StockCard";
import StockDetail from "@/components/StockDetail";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  // Fetch stock data with React Query
  const { data: stocksData, isLoading, error } = useQuery({
    queryKey: ["stocks"],
    queryFn: fetchStockData,
    refetchInterval: 30000, // Refetch every 30 seconds to simulate real-time updates
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch stock data");
    }
  }, [error]);

  useEffect(() => {
    // Select the first stock by default when data loads
    if (stocksData && Object.keys(stocksData).length > 0 && !selectedStock) {
      setSelectedStock(Object.keys(stocksData)[0]);
    }
  }, [stocksData, selectedStock]);

  const handleSelectStock = (symbol: string) => {
    setSelectedStock(symbol);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-subtle flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2">Loading Stock Data</h2>
          <p className="text-muted-foreground">Fetching the latest market information...</p>
        </div>
      </div>
    );
  }

  if (error || !stocksData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">
            Unable to fetch stock data. Please try again later.
          </p>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Live Stock Radar</h1>
        <p className="text-muted-foreground">
          Real-time market data from the National Stock Exchange of India
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(stocksData).map(([symbol, data]) => (
          <StockCard
            key={symbol}
            symbol={symbol}
            data={data}
            onSelect={handleSelectStock}
            isSelected={selectedStock === symbol}
          />
        ))}
      </div>

      {selectedStock && stocksData[selectedStock] && (
        <StockDetail symbol={selectedStock} data={stocksData[selectedStock]} />
      )}
    </div>
  );
};

export default Dashboard;
