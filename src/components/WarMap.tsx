"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COLS, ROWS, LAND_TILES } from "@/lib/tile-map";

interface Article {
  slug: string;
  title: string;
  date: string;
  location?: [number, number];
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function slugToLatLng(slug: string): [number, number] {
  const h = hashCode(slug);
  const zones = [
    [38, 55, -8, 25], [28, 48, -120, -75], [22, 42, 100, 138],
    [-34, -22, 138, 152], [-22, 2, -58, -38], [28, 36, 44, 56],
    [52, 62, 35, 85], [12, 28, 72, 88],
  ];
  const z = zones[h % zones.length];
  const h2 = hashCode(slug + "a");
  const h3 = hashCode(slug + "b");
  const lat = z[0] + ((h2 % 1000) / 1000) * (z[1] - z[0]);
  const lng = z[2] + ((h3 % 1000) / 1000) * (z[3] - z[2]);
  return [lng, lat];
}

function tileToLatLng(col: number, row: number): [number, number] {
  const lng = (col / COLS) * 360 - 180;
  const lat = 90 - (row / ROWS) * 180;
  return [lng, lat];
}

const DEG = Math.PI / 180;

function projectOrtho(
  lng: number, lat: number, rotX: number, rotY: number, cx: number, cy: number, r: number
): [number, number, boolean] {
  const lam = (lng + rotX) * DEG;
  const phi = lat * DEG;
  const phiR = -rotY * DEG;

  const cosPhi = Math.cos(phi);
  const x0 = cosPhi * Math.sin(lam);
  const y0 = Math.sin(phi);
  const z0 = cosPhi * Math.cos(lam);

  const cosR = Math.cos(phiR);
  const sinR = Math.sin(phiR);
  const y1 = y0 * cosR - z0 * sinR;
  const z1 = y0 * sinR + z0 * cosR;

  if (z1 < 0) return [0, 0, false];
  return [cx + x0 * r, cy - y1 * r, true];
}

// Pre-compute lat/lng for all land tiles once at module level
const TILE_COORDS: [number, number][] = LAND_TILES.map(([c, r]) => tileToLatLng(c, r));

export default function WarMap({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<[number, number]>([-30, -20]);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const lastPos = useRef<[number, number]>([0, 0]);
  const hoveredRef = useRef<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const animRef = useRef<number>(0);
  const sizeRef = useRef<[number, number]>([380, 380]);

  const articlePins = useRef(
    articles.slice(0, 20).map((a) => ({
      ...a,
      lngLat: a.location || slugToLatLng(a.slug),
    }))
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = sizeRef.current[0];
    const h = sizeRef.current[1];
    const size = Math.min(w, h);
    const cx = w / 2;
    const cy = h / 2;
    const r = size / 2 - 6;
    const [rotX, rotY] = rotationRef.current;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);

    // Globe background
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#0a0e17";
    ctx.fill();
    ctx.strokeStyle = "#1e2a3a";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Land tiles — single fillStyle, batch fillRect calls
    ctx.fillStyle = "#1a5c3a";
    const ts = 3.4;
    const half = ts / 2;
    for (let i = 0; i < TILE_COORDS.length; i++) {
      const [lng, lat] = TILE_COORDS[i];
      const [x, y, vis] = projectOrtho(lng, lat, rotX, rotY, cx, cy, r);
      if (vis) {
        ctx.fillRect(x - half, y - half, ts, ts);
      }
    }

    // Article pins
    const hSlug = hoveredRef.current;
    for (const pin of articlePins.current) {
      const [x, y, vis] = projectOrtho(pin.lngLat[0], pin.lngLat[1], rotX, rotY, cx, cy, r);
      if (!vis) continue;

      const isH = hSlug === pin.slug;
      const color = isH ? "#ffb050" : "#ff8c00";

      // Crosshairs
      ctx.strokeStyle = color;
      ctx.lineWidth = isH ? 1 : 0.6;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(x - 14, y); ctx.lineTo(x - 5, y);
      ctx.moveTo(x + 5, y); ctx.lineTo(x + 14, y);
      ctx.moveTo(x, y - 14); ctx.lineTo(x, y - 5);
      ctx.moveTo(x, y + 5); ctx.lineTo(x, y + 14);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Outer ring
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.strokeStyle = "#ff8c00";
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Inner ring
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = isH ? 0.8 : 0.6;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Center dot with glow
      ctx.shadowColor = "#ff8c00";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(x, y, isH ? 3 : 2, 0, Math.PI * 2);
      ctx.fillStyle = isH ? "#ffb050" : "#ff9920";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Tooltip
      if (isH) {
        const label = pin.title.length > 30 ? pin.title.slice(0, 30) + "..." : pin.title;
        ctx.font = "9px monospace";
        const tw = ctx.measureText(label).width + 16;
        const boxW = Math.min(tw, 170);

        ctx.fillStyle = "#0a0e17";
        ctx.strokeStyle = "#c46a00";
        ctx.lineWidth = 0.6;
        ctx.fillRect(x + 16, y - 12, boxW, 20);
        ctx.strokeRect(x + 16, y - 12, boxW, 20);

        ctx.fillStyle = "#ffb050";
        ctx.fillText(label, x + 24, y + 2);
      }
    }

    // Outer accent ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "#ff8c00";
    ctx.lineWidth = 0.4;
    ctx.globalAlpha = 0.1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, []);

  // Animation loop — requestAnimationFrame instead of setInterval
  useEffect(() => {
    let lastTime = 0;
    const animate = (time: number) => {
      if (!dragging.current && time - lastTime > 50) {
        rotationRef.current = [rotationRef.current[0] - 0.1, rotationRef.current[1]];
        lastTime = time;
      }
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  // Resize observer for responsive canvas
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      sizeRef.current = [width, height];
    });
    ro.observe(container);
    sizeRef.current = [container.clientWidth, container.clientHeight];
    return () => ro.disconnect();
  }, []);

  // Hit testing for pin hover/click
  const getHitPin = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    const w = sizeRef.current[0];
    const h = sizeRef.current[1];
    const size = Math.min(w, h);
    const cx = w / 2;
    const cy = h / 2;
    const r = size / 2 - 6;
    const [rotX, rotY] = rotationRef.current;

    for (const pin of articlePins.current) {
      const [x, y, vis] = projectOrtho(pin.lngLat[0], pin.lngLat[1], rotX, rotY, cx, cy, r);
      if (!vis) continue;
      const dx = mx - x;
      const dy = my - y;
      if (dx * dx + dy * dy < 400) return pin.slug;
    }
    return null;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    didDrag.current = false;
    lastPos.current = [e.clientX, e.clientY];
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const hit = getHitPin(e.clientX, e.clientY);
    if (hit !== hoveredRef.current) {
      hoveredRef.current = hit;
      setHovered(hit);
    }

    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current[0];
    const dy = e.clientY - lastPos.current[1];
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag.current = true;
    lastPos.current = [e.clientX, e.clientY];
    rotationRef.current = [
      rotationRef.current[0] - dx * 0.35,
      Math.max(-60, Math.min(60, rotationRef.current[1] + dy * 0.35)),
    ];
  }, [getHitPin]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    if (!didDrag.current) {
      const hit = getHitPin(e.clientX, e.clientY);
      if (hit) router.push(`/articles/${hit}`);
    }
  }, [getHitPin, router]);

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <span className="panel-label">Global Network</span>
        <span className="text-[11px] text-muted ml-auto">
          {articles.length} locations
        </span>
      </div>
      <div ref={containerRef} className="tile-map-wrap flex-1 relative">
        <div className="tile-map-scanlines" />
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
          style={{
            cursor: hovered ? "pointer" : "grab",
            touchAction: "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
      </div>
    </div>
  );
}
