
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockData } from "@/services/stockApi";
import { formatCurrency, formatNumber, calculateChange } from "@/services/stockApi";
import { ArrowDown, ArrowUp } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from "recharts";

interface StockDetailProps {
  symbol: string;
  data: StockData;
}

const StockDetail = ({ symbol, data }: StockDetailProps) => {
  const displaySymbol = symbol.split('.')[0]; // Remove .NS suffix
  const change = calculateChange(data.current_price, data.previous_close);
  const isPositive = change >= 0;

  // Generate mock historical data based on the current price and range
  const generateChartData = () => {
    const dataPoints = 24; // 24 hours
    const volatility = (data.high - data.low) / data.low * 0.5;
    const result = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const hourOffset = dataPoints - i - 1;
      const baseValue = data.current_price * (1 - change/100 * hourOffset/dataPoints);
      const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
      
      result.push({
        time: `${hourOffset}h`,
        price: baseValue * randomFactor
      });
    }
    
    return result;
  };

  const chartData = generateChartData();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{displaySymbol}</h2>
          <p className="text-muted-foreground">National Stock Exchange of India</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{formatCurrency(data.current_price)}</div>
          <div className={`flex items-center justify-end ${
            isPositive ? 'text-stock-up' : 'text-stock-down'
          }`}>
            {isPositive ? (
              <ArrowUp className="h-5 w-5 mr-1" />
            ) : (
              <ArrowDown className="h-5 w-5 mr-1" />
            )}
            <span className="font-medium">{Math.abs(change)}%</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tickFormatter={(value) => formatCurrency(value)} 
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), "Price"]} 
                  labelFormatter={(label) => `${label} ago`}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPositive ? "#22c55e" : "#ef4444"} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Trading Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open</span>
                <span className="font-medium">{formatCurrency(data.open)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Previous Close</span>
                <span className="font-medium">{formatCurrency(data.previous_close)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Day Range</span>
                <span className="font-medium">{formatCurrency(data.low)} - {formatCurrency(data.high)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-medium">{formatNumber(data.volume)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-medium">{formatNumber(data.market_cap, true)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dividend Yield</span>
                <span className="font-medium">{data.dividend_yield}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockDetail;
