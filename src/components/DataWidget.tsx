"use client";

interface DataWidgetProps {
  title: string;
  children: React.ReactNode;
}

export function DataWidget({ title, children }: DataWidgetProps) {
  return (
    <div className="border border-terminal-border bg-terminal-surface rounded">
      <div className="px-3 py-2 border-b border-terminal-border flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-terminal-accent" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-terminal-muted">
          {title}
        </span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

export function MarketOverview() {
  const markets = [
    { name: "S&P 500", value: "5,421.80", change: "+1.24%", up: true },
    { name: "NASDAQ", value: "17,142.56", change: "+1.67%", up: true },
    { name: "DOW", value: "39,872.10", change: "+0.82%", up: true },
    { name: "RUSSELL", value: "2,098.34", change: "-0.31%", up: false },
  ];

  return (
    <DataWidget title="Market Overview">
      <div className="space-y-2">
        {markets.map((m) => (
          <div key={m.name} className="flex justify-between items-center">
            <span className="font-mono text-xs text-terminal-muted">{m.name}</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-terminal-text">{m.value}</span>
              <span
                className={`font-mono text-xs font-medium w-16 text-right ${
                  m.up ? "text-terminal-green" : "text-terminal-red"
                }`}
              >
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DataWidget>
  );
}

export function RecentActivity() {
  const activities = [
    { time: "09:42", event: "Fed minutes released", tag: "MACRO" },
    { time: "09:15", event: "NVDA earnings beat estimates", tag: "EQUITY" },
    { time: "08:30", event: "CPI comes in at 2.8% YoY", tag: "DATA" },
    { time: "07:00", event: "ECB holds rates steady", tag: "RATES" },
  ];

  return (
    <DataWidget title="Activity Feed">
      <div className="space-y-2.5">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="font-mono text-[10px] text-terminal-muted mt-0.5 shrink-0">
              {a.time}
            </span>
            <span className="font-mono text-xs text-terminal-text leading-snug">
              {a.event}
            </span>
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-terminal-bg text-terminal-accent rounded shrink-0 ml-auto">
              {a.tag}
            </span>
          </div>
        ))}
      </div>
    </DataWidget>
  );
}

export function QuickStats() {
  const stats = [
    { label: "FEAR/GREED", value: "62", sub: "GREED", color: "text-terminal-green" },
    { label: "PUT/CALL", value: "0.84", sub: "NEUTRAL", color: "text-terminal-yellow" },
    { label: "BREADTH", value: "58%", sub: "ADVANCING", color: "text-terminal-green" },
    { label: "YIELD 10Y", value: "4.28%", sub: "+2BPS", color: "text-terminal-red" },
  ];

  return (
    <DataWidget title="Quick Stats">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-mono text-[9px] text-terminal-muted uppercase tracking-wider">
              {s.label}
            </div>
            <div className={`font-mono text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="font-mono text-[9px] text-terminal-muted">{s.sub}</div>
          </div>
        ))}
      </div>
    </DataWidget>
  );
}
