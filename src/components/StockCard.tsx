
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockData } from "@/services/stockApi";
import { ArrowDown, ArrowUp } from "lucide-react";
import { calculateChange, formatCurrency } from "@/services/stockApi";

interface StockCardProps {
  symbol: string;
  data: StockData;
  onSelect: (symbol: string) => void;
  isSelected: boolean;
}

const StockCard = ({ symbol, data, onSelect, isSelected }: StockCardProps) => {
  const displaySymbol = symbol.split('.')[0]; // Remove .NS suffix
  const change = calculateChange(data.current_price, data.previous_close);
  const isPositive = change >= 0;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={() => onSelect(symbol)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{displaySymbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-2xl font-bold mb-2">
            {formatCurrency(data.current_price)}
          </div>
          <div className={`flex items-center text-sm ${
            isPositive ? 'text-stock-up' : 'text-stock-down'
          }`}>
            {isPositive ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span className="font-medium">{Math.abs(change)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;
