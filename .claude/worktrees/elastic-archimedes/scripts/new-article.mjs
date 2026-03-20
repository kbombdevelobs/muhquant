#!/usr/bin/env node

import { createInterface } from "readline";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, "..", "content", "articles");

// ── City presets: [lng, lat] ──
const CITIES = {
  // North America
  "new-york":      [-74.006, 40.7128],
  "chicago":       [-87.6298, 41.8781],
  "san-francisco": [-122.4194, 37.7749],
  "los-angeles":   [-118.2437, 34.0522],
  "toronto":       [-79.3832, 43.6532],
  "miami":         [-80.1918, 25.7617],
  "boston":         [-71.0589, 42.3601],
  "seattle":       [-122.3321, 47.6062],
  "austin":        [-97.7431, 30.2672],
  "denver":        [-104.9903, 39.7392],
  // Europe
  "london":        [-0.1276, 51.5074],
  "paris":         [2.3522, 48.8566],
  "frankfurt":     [8.6821, 50.1109],
  "zurich":        [8.5417, 47.3769],
  "amsterdam":     [4.9041, 52.3676],
  "stockholm":     [18.0686, 59.3293],
  "dublin":        [-6.2603, 53.3498],
  "madrid":        [-3.7038, 40.4168],
  "milan":         [9.19, 45.4642],
  "berlin":        [13.405, 52.52],
  // Asia
  "tokyo":         [139.6917, 35.6895],
  "hong-kong":     [114.1694, 22.3193],
  "singapore":     [103.8198, 1.3521],
  "shanghai":      [121.4737, 31.2304],
  "beijing":       [116.4074, 39.9042],
  "mumbai":        [72.8777, 19.076],
  "seoul":         [126.978, 37.5665],
  "taipei":        [121.5654, 25.033],
  "dubai":         [55.2708, 25.2048],
  "tel-aviv":      [34.7818, 32.0853],
  // Oceania
  "sydney":        [151.2093, -33.8688],
  "melbourne":     [144.9631, -37.8136],
  "auckland":      [174.7633, -36.8485],
  // South America
  "sao-paulo":     [-46.6333, -23.5505],
  "buenos-aires":  [-58.3816, -34.6037],
  "santiago":      [-70.6693, -33.4489],
  // Africa
  "johannesburg":  [28.0473, -26.2041],
  "cairo":         [31.2357, 30.0444],
  "lagos":         [3.3792, 6.5244],
  "nairobi":       [36.8219, -1.2921],
};

const SORTED_CITIES = Object.keys(CITIES).sort();

// ── Helpers ──
const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(prompt, fallback = "") {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || fallback);
    });
  });
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function printCities() {
  console.log("\n  Available cities:");
  console.log("  " + "─".repeat(60));
  const cols = 3;
  for (let i = 0; i < SORTED_CITIES.length; i += cols) {
    const row = SORTED_CITIES.slice(i, i + cols)
      .map((c) => c.padEnd(20))
      .join("");
    console.log("  " + row);
  }
  console.log();
}

// ── Main ──
async function main() {
  console.log();
  console.log("  ┌──────────────────────────────────┐");
  console.log("  │  MUHQUANT — New Article Generator │");
  console.log("  └──────────────────────────────────┘");
  console.log();

  // Title
  const title = await ask("  Article title: ");
  if (!title) {
    console.log("  Error: title is required");
    process.exit(1);
  }

  const defaultSlug = slugify(title);
  const slug = await ask(`  Slug [${defaultSlug}]: `, defaultSlug);

  // Date
  const defaultDate = today();
  const date = await ask(`  Date [${defaultDate}]: `, defaultDate);

  // Excerpt
  const excerpt = await ask("  Excerpt (one line): ");

  // Tags
  const tagsRaw = await ask("  Tags (comma separated, e.g. QUANT,VOL): ");
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean);

  // Author
  const author = await ask("  Author [MuhQuant Research]: ", "MuhQuant Research");

  // Location
  console.log();
  console.log("  ── Location (for globe pin) ──");
  console.log("  Enter a city name, 'list' to see all cities,");
  console.log("  'custom' for manual lng,lat, or press Enter for none.");
  console.log();

  let location = null;
  while (true) {
    const cityInput = (await ask("  City: ")).toLowerCase();

    if (!cityInput) {
      break;
    } else if (cityInput === "list") {
      printCities();
    } else if (cityInput === "custom") {
      const lng = await ask("  Longitude (e.g. -74.006): ");
      const lat = await ask("  Latitude (e.g. 40.7128): ");
      if (lng && lat) {
        location = [parseFloat(lng), parseFloat(lat)];
        console.log(`  → [${location[0]}, ${location[1]}]`);
      }
      break;
    } else if (CITIES[cityInput]) {
      location = CITIES[cityInput];
      console.log(`  → [${location[0]}, ${location[1]}]`);
      break;
    } else {
      console.log(`  Unknown city '${cityInput}'. Type 'list' to see options.`);
    }
  }

  // Write file
  mkdirSync(ARTICLES_DIR, { recursive: true });
  const filePath = join(ARTICLES_DIR, `${slug}.md`);

  if (existsSync(filePath)) {
    const overwrite = await ask("  Warning: file exists! Overwrite? (y/N): ");
    if (overwrite.toLowerCase() !== "y") {
      console.log("  Aborted.");
      rl.close();
      return;
    }
  }

  const tagsJson = tags.map((t) => `"${t}"`).join(", ");
  const locationLine = location ? `location: [${location[0]}, ${location[1]}]\n` : "";

  const content = `---
title: "${title}"
date: "${date}"
excerpt: "${excerpt}"
tags: [${tagsJson}]
author: "${author}"
${locationLine}---

## Overview

Write your article here.

## Key Findings



## Methodology



## Conclusion

`;

  writeFileSync(filePath, content);
  console.log();
  console.log(`  ✓ Created: content/articles/${slug}.md`);
  console.log(`  Run 'npm run dev' and visit /articles/${slug}`);
  console.log();

  rl.close();
}

main();
