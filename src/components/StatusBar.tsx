"use client";

import { useState, useEffect } from "react";

export default function StatusBar() {
  const [time, setTime] = useState("");
  const [cpu, setCpu] = useState(12);
  const [mem, setMem] = useState(34);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-US", { hour12: false }));
      setCpu(Math.floor(8 + Math.random() * 30));
      setMem(Math.floor(28 + Math.random() * 20));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-6 bg-surface border-t border-border flex items-center px-6 gap-6 shrink-0">
      <span className="text-[9px] text-accent">■</span>
      <span className="text-[11px] text-muted font-mono tracking-wider">{time}</span>
      <span className="text-[11px] text-muted font-mono">CPU {cpu}%</span>
      <span className="text-[11px] text-muted font-mono">MEM {mem}%</span>
      <span className="text-[11px] text-muted font-mono ml-auto tracking-wider">MUH QUANT v1.0</span>
    </div>
  );
}
