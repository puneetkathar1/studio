# Predictive Insights Pro (v4.2)

Institutional-grade intelligence substrate for prediction markets. Powered by the **GAD + TQS Framework**.

## 🧠 Platform Philosophy

PI-Pro separates structural risk from execution discipline. We don't just track price; we audit the math of price discovery.

1.  **GAD (Generalized Adaptive Discontinuity)** decides *what* the market is by filtering for regime stress.
2.  **TQS (Trade Quality Score)** decides *if* we act based on risk-adjusted edge.
3.  **Stance** (BET / NO_BET / WAIT) is the deterministic result of multi-factor convergence.

## 🛠️ Technical Architecture

### 1. Autonomous Ingestion Cluster
*   **Deep Sweep Protocol**: Geographically distributed nodes fetch sub-second ticks from Polymarket Gamma (CLOB) and Kalshi (V2).
*   **Hierarchical Resolution**: Specialized engine that purges malformed outcome lists and stringified metadata, restoring original contract questions.
*   **Optic Sync**: Maintains 12ms ingestion latency across decentralized and regulated protocols.

### 2. The GAD Engine (Structural)
*   **Regime Detection**: Classifies markets into **CALM**, **NORMAL**, or **STRESS** states using latent variance ($v_t$) estimation.
*   **Discontinuity ($\lambda_t$)**: Estimates latent stress and adaptive jump probability ($p_t$) to detect informed capital flow.
*   **Fair Envelope**: Constructs adaptive sigma-bands that expand during volatility to preserve capital and inhibit noise-trading.

### 3. The TQS Gate (Execution)
*   **$\theta_{bet}$ Threshold**: Consumes GAD vitals to calculate real-time trade quality. Signals only trigger when TQS crosses the 0.020 floor.
*   **AEV Basis**: Calculates Execution-Adjusted Expected Value after venue fees and depth-sensitive slippage.
*   **Smart Order Router (SOR)**: Proportional capital split across venues based on real-time depth ratios.

## 🚀 Professional Execution Nodes

*   **Alpha Stream**: Live high-conviction feed broadcasting only verified threshold crossings.
*   **Whale Matrix**: Behavioral recon separating Informational discovery from Mechanical pinning traps.
*   **Arb Matrix**: Deterministic venue decoupling for risk-free alpha extraction via Δ-basis spreads.
*   **Alpha Journey**: Tactical execution environment with high-fidelity real-time charting and sub-second path traces.
*   **Trade Guardrails**: Automated discipline enforcement engine utilizing hard-coded logic constraints.

## 📊 Intelligence Methodology (16 Indicators)

The platform utilizes 16 unique quantitative dimensions to calculate the **Fair Probability Envelope**:
*   **Quadrant 1 (Microstructure)**: SPS (Pressure), CCI (Consistency), EVS (Value), MIS (Inefficiency), LQS (Liquidity).
*   **Quadrant 2 (Strategic)**: TVS (Timing), RRS (Regime), BDS (Belief), SCS (Clarity), IAS (Invalidation).
*   **Quadrant 3 (Accountability)**: PRS (Reliability), ECS (Capture), DCS (Discipline).
*   **Quadrant 4 (Risk Complexity)**: PCS (Correlation), ARS (Asymmetry), HSS (Horizon).

## 🔐 Security & Integrity
*   **Zero-Knowledge Audit**: All signals are hashed to the Public Ledger via ZK-Audit Proofs for historical veracity.
*   **Oracle Consensus**: 12-node quorum verification for venue settlement and signal finality.
*   **Encryption**: Bank-grade AES-256 GCM for all session keys and node identities.

## ⚡ Development

### Quick Start
```bash
npm install
npm run dev # App available at http://localhost:9002
```

### Backend Ingestion
```bash
# local dev
npm run dev

# external cron target (daily)
POST /api/ingest/all?limit=100
# optional header: x-ingest-token: <INGEST_API_TOKEN>
```
