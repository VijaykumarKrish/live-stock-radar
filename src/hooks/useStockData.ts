
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { fetchStockData, StocksResponse } from "@/services/stockApi";

export const useStockData = (refreshInterval = 30000) => {
  const [data, setData] = useState<StocksResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      const result = await fetchStockData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast.error("Failed to fetch stock data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      fetchData();
    }, refreshInterval);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return { data, isLoading, error, refetch: fetchData };
};
