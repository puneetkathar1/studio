# External Alpha API: Institutional Specification v1.0

This document defines the requirements for the high-performance External Alpha API, designed to provide institutional access to the Predictive Insights Pro intelligence substrate.

## 1. Real-Time Streaming (WebSocket)
The API must provide a sub-100ms "Push" layer for high-conviction events.

*   **`alpha.signals`**: Stream of all nodes crossing the θ_bet threshold (0.020).
*   **`matrix.ticks`**: High-frequency price and volume normalization across Polymarket and Kalshi.
*   **`whale.recon`**: Real-time updates to behavioral intent labels (Informational vs. Mechanical).
*   **`basis.delta`**: Instant notification of cross-venue price decoupling (Arbitrage triggers).

## 2. Quantitative Query Layer (REST)
Access to the mathematical basis of every active discovery node.

*   **`GET /v1/indicators/{marketId}`**: Returns raw values for the 16 Indicators (SPS, CCI, EVS, MIS, LQS, TVS, RRS, BDS, SCS, IAS, PRS, ECS, DCS, PCS, ARS, HSS).
*   **`GET /v1/matrix/paired`**: Returns all paired-leg opportunities identified by the Title Normalization Engine.
*   **`GET /v1/whales/profile/{id}`**: Detailed hit-rate, ROI, and archetypal data for a tracked entity.

## 3. Accountability & Audit (Backtesting)
Programmatic verification of platform authority and historical veracity.

*   **`GET /v1/ledger/historical`**: Full access to the Public Ledger for backtesting.
*   **`GET /v1/ledger/replay/{marketId}?ts={timestamp}`**: Returns a high-fidelity "Matrix Snapshot" of all 16 indicators and orderbook entropy at a specific historical microsecond. Designed for quant-firm backtesting suites.
*   **`GET /v1/ledger/calibration`**: Live Brier Score and sector attribution metrics.
*   **`POST /v1/audit/hash-verification`**: Endpoint to verify the integrity of a signal hash against the oracle quorum.

## 4. Execution Support
Utilities to facilitate venue-side fulfillment.

*   **`POST /v1/execution/sor-split`**: Given a total trade size, returns the optimal capital allocation across venues based on real-time depth.
*   **`GET /v1/execution/slippage-sim`**: Returns expected alpha erosion for a specific size based on current orderbook entropy.

## 5. Security & Authorization
*   **API Key Management**: RSA-4096 based keys associated with Pro subscriber nodes.
*   **Rate Limiting**: Tiered access (Institutional: 1000 req/sec | Pro: 100 req/sec).
*   **Encryption**: All data transmitted via TLS 1.3 with AES-256 GCM payload encryption.
