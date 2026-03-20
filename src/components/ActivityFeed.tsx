"use client";

import { useState, useEffect, useRef } from "react";

const verbs = [
  "SCANNING", "INDEXING", "PARSING", "ANALYZING", "CORRELATING",
  "FETCHING", "SAMPLING", "CALIBRATING", "PROCESSING", "COMPUTING",
];

const nouns = [
  "YIELD CURVES", "FACTOR LOADINGS", "VOL SURFACE", "ORDER FLOW",
  "TICK DATA", "SPREAD MATRIX", "GAMMA EXPOSURE", "DELTA HEDGES",
  "COVARIANCE", "MOMENTUM", "MEAN REVERSION", "ALPHA DECAY",
  "TERM STRUCTURE", "RISK PARITY", "BOOK DEPTH", "REGIME STATE",
];

const statuses = ["OK", "DONE", "SYNC", "ACK"];

function randomLine(): string {
  const v = verbs[Math.floor(Math.random() * verbs.length)];
  const n = nouns[Math.floor(Math.random() * nouns.length)];
  const s = statuses[Math.floor(Math.random() * statuses.length)];
  const hex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0");
  return `${v} ${n} 0x${hex} [${s}]`;
}

interface LogEntry {
  id: number;
  text: string;
  auto: boolean;
}

let nextId = 0;

export default function ActivityFeed() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [input, setInput] = useState("");
  const [paused, setPaused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-generate entries
  useEffect(() => {
    const initial = Array.from({ length: 4 }, () => ({
      id: nextId++,
      text: randomLine(),
      auto: true,
    }));
    setEntries(initial);

    const id = setInterval(() => {
      if (!paused) {
        setEntries((prev) => [
          ...prev,
          { id: nextId++, text: randomLine(), auto: true },
        ].slice(-12));
      }
    }, 1800 + Math.random() * 1500);

    return () => clearInterval(id);
  }, [paused]);

  const addCustom = () => {
    const msg = input.trim();
    if (!msg) return;
    setEntries((prev) => [
      ...prev,
      { id: nextId++, text: msg.toUpperCase(), auto: false },
    ].slice(-12));
    setInput("");
    inputRef.current?.focus();
  };

  const removeEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <span className="panel-label">System Log</span>
        <button
          onClick={() => setPaused((p) => !p)}
          className="text-[10px] font-mono uppercase tracking-wider ml-auto transition-colors"
          style={{ color: paused ? "var(--color-muted)" : "var(--color-accent-dim)" }}
        >
          {paused ? "PAUSED" : "REC"}
        </button>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className="group flex items-start gap-1 leading-[1.6]"
          >
            <span
              className="text-[11px] font-mono truncate flex-1"
              style={{
                color: !entry.auto
                  ? "var(--color-highlight)"
                  : i === entries.length - 1
                  ? "var(--color-accent)"
                  : "var(--color-muted)",
                opacity: i === entries.length - 1 || !entry.auto ? 1 : 0.4 + (i / entries.length) * 0.6,
              }}
            >
              {!entry.auto && <span className="text-highlight mr-1">&gt;</span>}
              {entry.text}
            </span>
            <button
              onClick={() => removeEntry(entry.id)}
              className="text-[10px] text-muted opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity shrink-0 px-1"
              title="Remove"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border px-3 py-2 flex gap-2">
        <span className="text-[11px] text-accent font-mono shrink-0 mt-px">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          placeholder="add message..."
          className="flex-1 bg-transparent text-[11px] text-text font-mono outline-none placeholder:text-muted/40"
        />
      </div>
    </div>
  );
}
