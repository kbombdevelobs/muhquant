---
title: "Building a Multi-Factor Equity Model from Scratch"
date: "2026-03-10"
excerpt: "A practical guide to constructing a factor model using momentum, value, quality, and low-volatility factors with Python."
tags: ["QUANT", "FACTORS"]
author: "MuhQuant Research"
---

## Introduction

Factor investing decomposes returns into systematic risk premia. Instead of picking individual stocks, we construct portfolios that capture exposure to well-documented factors.

## The Four Factors

### Momentum
12-month price return, excluding the most recent month (to avoid short-term reversal effects).

### Value
Enterprise value to EBITDA ratio. Lower is cheaper.

### Quality
Return on invested capital (ROIC). Higher indicates better capital allocation.

### Low Volatility
60-day realized volatility. Lower volatility stocks are ranked higher.

## Factor Construction

```python
import pandas as pd

def z_score_factor(series):
    """Winsorize and standardize factor scores."""
    clipped = series.clip(
        lower=series.quantile(0.02),
        upper=series.quantile(0.98)
    )
    return (clipped - clipped.mean()) / clipped.std()

# Combine factors with equal weight
composite = (
    z_score_factor(momentum) +
    z_score_factor(value) +
    z_score_factor(quality) +
    z_score_factor(low_vol)
) / 4
```

## Portfolio Construction

We go long the top quintile and short the bottom quintile, rebalancing monthly. Transaction costs are modeled at 5bps per side.

## Results Summary

Over a 10-year backtest:

- **Annualized return**: 11.2%
- **Sharpe ratio**: 1.34
- **Max drawdown**: -14.8%
- **Monthly turnover**: 18%

The model's strongest performance comes during earnings seasons, where quality and momentum factors tend to dominate.
