"use client";

const tickerData = [
  { symbol: "SPY", price: "542.18", change: "+1.24%", up: true },
  { symbol: "QQQ", price: "468.32", change: "+1.67%", up: true },
  { symbol: "BTC", price: "87,241", change: "-0.43%", up: false },
  { symbol: "ETH", price: "3,128", change: "+2.11%", up: true },
  { symbol: "DXY", price: "103.42", change: "-0.18%", up: false },
  { symbol: "VIX", price: "14.32", change: "-3.21%", up: false },
  { symbol: "GLD", price: "218.90", change: "+0.54%", up: true },
  { symbol: "TNX", price: "4.28%", change: "+0.02", up: true },
  { symbol: "CL=F", price: "78.42", change: "-1.12%", up: false },
  { symbol: "AAPL", price: "198.11", change: "+0.89%", up: true },
  { symbol: "NVDA", price: "924.56", change: "+3.42%", up: true },
  { symbol: "TSLA", price: "248.12", change: "-2.15%", up: false },
];

export default function Ticker() {
  const items = [...tickerData, ...tickerData];

  return (
    <div className="bg-terminal-bg border-b border-terminal-border overflow-hidden h-7 flex items-center">
      <div className="ticker-animate flex whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 mx-4">
            <span className="font-mono text-[11px] font-semibold text-terminal-text">
              {item.symbol}
            </span>
            <span className="font-mono text-[11px] text-terminal-muted">
              {item.price}
            </span>
            <span
              className={`font-mono text-[11px] font-medium ${
                item.up ? "text-terminal-green" : "text-terminal-red"
              }`}
            >
              {item.change}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
