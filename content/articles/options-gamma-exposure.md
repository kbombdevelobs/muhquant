---
title: "Understanding Dealer Gamma Exposure"
date: "2026-03-15"
excerpt: "How market maker hedging flows create predictable intraday patterns, and why GEX matters for short-term traders."
tags: ["OPTIONS", "FLOW"]
author: "MuhQuant Research"
location: [139.7, 35.7]
---

## What is GEX?

Gamma Exposure (GEX) measures the aggregate gamma position of options market makers. When dealers are long gamma, their hedging activity dampens volatility. When short gamma, they amplify it.

## The Mechanics

Consider a dealer who sold a call option. They delta-hedge by buying the underlying. As price rises:

- Delta increases → dealer buys more
- Price falls → delta decreases → dealer sells

When dealers are **long gamma**, this hedging creates a stabilizing effect — they buy dips and sell rips.

When **short gamma** (common around large put open interest), the opposite occurs — they sell into selloffs and buy into rallies, creating a volatility-amplifying feedback loop.

## Calculating Net GEX

```python
def calculate_gex(chain):
    gex = 0
    for _, row in chain.iterrows():
        gamma = row['gamma']
        oi = row['openInterest']
        multiplier = 100  # standard equity options
        sign = 1 if row['type'] == 'call' else -1
        gex += gamma * oi * multiplier * sign
    return gex
```

## Trading Implications

| GEX Level | Expected Behavior | Strategy |
|-----------|-------------------|----------|
| High positive | Low vol, mean-reversion | Sell premium |
| Near zero | Transition zone | Reduce size |
| Negative | High vol, trending | Buy breakouts |

## The GEX Flip Level

The price at which GEX transitions from positive to negative is called the "GEX flip." This level often acts as a magnet for price action and a pivotal support/resistance zone.
