# Intelligence Engine: Quantitative Breakdown (16 Indicators)

This document provides the authoritative mathematical and logical breakdown of the signals used in the **PRO AUDIT** and **PRO CHAMPION** layers.

## Quadrant 1: Market Microstructure (The "What")

### 1. SPS (Signal Probability Score)
*   **Methodology**: Bayesian Inference Engine.
*   **Formula**: $P(H|E) = \frac{P(E|H) \cdot P(H)}{P(E)}$
*   **Application**: Updates the "True Odds" of a contract by weighing buy/sell pressure against historical base rates. It filters for "Smart Money" vs "Noise."

### 2. CCI (Confidence Consistency Index)
*   **Methodology**: Inverse Volatility weighting.
*   **Formula**: $1 / \sigma_{rolling}$
*   **Application**: Measures the stability of the current price level. High CCI indicates a firm market consensus; low CCI indicates a "fragile" price easily moved by small trades.

### 3. EVS (Expected Value Score)
*   **Methodology**: Linear Alpha Delta.
*   **Formula**: $Fair Value - Market Price$
*   **Application**: The primary measure of mispricing. It quantifies the profit potential if the market moves to the model's calculated fair value.

### 4. MIS (Market Inefficiency Score)
*   **Methodology**: Kullback-Leibler (KL) Divergence.
*   **Formula**: $D_{KL}(P || Q) = \sum P(i) \log \frac{P(i)}{Q(i)}$
*   **Application**: Detects systemic biases in sentiment. Compares current pricing distributions (P) against historical "Logical" distributions (Q). It identifies "Crowd Hallucinations" where sentiment decouples from base rates.

### 5. LQS (Liquidity Quality Score)
*   **Methodology**: Depth-Weighted Spread analysis.
*   **Application**: The "Execution Reality Gatekeeper." Assesses the integrity of the price by scanning the top 10 levels of the CLOB. It protects against "Thin Tail" traps and "Mechanical Pinning."
*   **Machine Function**: Acts as a deterministic inhibitor. TQS = (Conviction) * LQS. If LQS is low, signals are suppressed to WAIT to prevent execution in toxic/illiquid nodes.

---

## Quadrant 2: Strategic Context (The "When")

### 6. TVS (Timing Value Score)
*   **Methodology**: Theta Sensitivity ($\partial P / \partial t$).
*   **Application**: Identifies the optimal entry window relative to the event horizon. It prevents "Early Alpha Decay" where capital is locked up for too long.

### 7. RRS (Regime Risk Score)
*   **Methodology**: Multi-factor Beta analysis.
*   **Application**: Monitors external shocks (Macro, News). High RRS indicates the model's environment has changed, and assumptions may no longer hold.

### 8. BDS (Belief Divergence Score)
*   **Methodology**: Polarity / Concentration analysis (HHI).
*   **Application**: Measures the "Tug-of-War" between participants. High BDS often precedes high-volatility "Price Discovery" events.

### 9. SCS (Signal Clarity Score)
*   **Methodology**: Signal-to-Noise Ratio (SNR).
*   **Application**: The final "Confidence" gate. It ensures the projected Alpha (Signal) is significantly larger than the market's standard deviation (Noise).

### 10. IAS (Invalidation Alert Score)
*   **Methodology**: Proximity to Thesis Breakdown.
*   **Application**: Real-time stop-loss proxy. Measures how much "Error Room" remains before the original analytical thesis is proven wrong.

---

## Quadrant 3: Accountability (The "Evidence")

### 11. PRS (Predictive Reliability)
*   **Methodology**: Rolling Bayesian Accuracy Weight.
*   **Application**: Penalizes or promotes specific sub-models based on their recent historical performance in that specific sector.

### 12. ECS (Edge Capture Score)
*   **Methodology**: Post-Facto Alpha Leakage calculation.
*   **Application**: Measures the delta between "Theoretical Profit" at issue and "Actual Profit" at settlement.

### 13. DCS (Discipline Consistency)
*   **Methodology**: Compliance Audit.
*   **Application**: Verifies that the signal was issued within the platform's risk-management parameters (e.g., no bets during forbidden high-volatility regimes).

---

## Quadrant 4: Risk Complexity (The "Hidden")

### 14. PCS (Portfolio Correlation)
*   **Methodology**: Pearson Correlation Coefficient.
*   **Application**: Detects over-exposure across correlated events (e.g., multiple bets all depending on the same Fed decision).

### 15. ARS (Asymmetric Risk Score)
*   **Methodology**: Fisher Skewness (3rd Moment).
*   **Application**: Favors "Positive Skew" opportunities where the potential upside is significantly larger than the statistical downside.

### 16. HSS (Horizon Sensitivity)
*   **Methodology**: Monte-Carlo Event-Delay Simulation.
*   **Application**: Quantifies the risk of event-delays (court stays, election recounts) destroying the bet's ROI.
