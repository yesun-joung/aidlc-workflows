# Monitoring Design — mmp-hero

Monitoring for U2 (CAD hero price slot). Implements the no-new-observability decision from NFR Requirements Q6 A.

## Metrics and KPIs

| Metric | Source | Threshold | Why it matters |
|--------|--------|-----------|----------------|
| (none added) | — | — | NFR5.1 / Q4 A: no new metrics for marketplace price display |

Post-launch observation uses **existing** click-through signals only (NFR6 launch bar is rendering correctness, not a new metric).

## Alerts

| Alert | Condition | Severity | Routes to |
|-------|-----------|----------|-----------|
| (none added) | — | — | Q4 A: no U2-specific alarms |

## SLIs / SLOs

| SLI | SLO target | Measurement window |
|-----|------------|-------------------|
| (none added) | — | — | No new SLO for hero price slot in MVP |

## Logs and tracing

| Area | Design |
|------|--------|
| Log aggregation | **No new** hero price or mapper log streams (NFR4.2) |
| Distributed tracing | **No new** spans for price-section render |
| Dashboards | **No new** dashboards for marketplace copy / hide transitions |

## Summary

No monitoring stack changes for U2. Platform and FRE existing observability unchanged; MVP observes click-through via existing tooling after launch.
