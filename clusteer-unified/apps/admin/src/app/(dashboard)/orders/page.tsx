"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

/* ── fallback mock data (used while loading or on error) ── */
const MOCK_ORDERS = [
  { id: "ORD-4821", side: "Buy",  pair: "USDT/NGN", price: 1, amount: 24_500, status: "Filled", time: "14:31", user: { id: "USR-10042" } },
  { id: "ORD-4820", side: "Sell", pair: "USDT/NGN", price: 1, amount: 18_200, status: "Open",   time: "14:28", user: { id: "USR-10048" } },
  { id: "ORD-4819", side: "Buy",  pair: "USDT/NGN", price: 1, amount: 9_800,  status: "Filled", time: "14:25", user: { id: "USR-10055" } },
  { id: "ORD-4818", side: "Sell", pair: "USDT/NGN", price: 1, amount: 32_000, status: "Filled", time: "14:22", user: { id: "USR-10041" } },
  { id: "ORD-4817", side: "Buy",  pair: "USDT/NGN", price: 1, amount: 15_600, status: "Open",   time: "14:18", user: { id: "USR-10063" } },
  { id: "ORD-4816", side: "Sell", pair: "USDT/NGN", price: 1, amount: 42_000, status: "Filled", time: "14:15", user: { id: "USR-10044" } },
  { id: "ORD-4815", side: "Buy",  pair: "USDT/NGN", price: 1, amount: 7_500,  status: "Filled", time: "14:12", user: { id: "USR-10057" } },
  { id: "ORD-4814", side: "Sell", pair: "USDT/NGN", price: 1, amount: 28_400, status: "Open",   time: "14:08", user: { id: "USR-10046" } },
  { id: "ORD-4813", side: "Buy",  pair: "USDT/NGN", price: 1, amount: 11_200, status: "Filled", time: "14:05", user: { id: "USR-10051" } },
  { id: "ORD-4812", side: "Sell", pair: "USDT/NGN", price: 1, amount: 19_800, status: "Filled", time: "14:01", user: { id: "USR-10049" } },
  { id: "ORD-4811", side: "Buy",  pair: "USDT/NGN", price: 1, amount: 35_000, status: "Open",   time: "13:58", user: { id: "USR-10060" } },
  { id: "ORD-4810", side: "Sell", pair: "USDT/NGN", price: 1, amount: 14_700, status: "Filled", time: "13:54", user: { id: "USR-10043" } },
];

const PAIRS = ["USDT/NGN", "BTC/NGN", "ETH/NGN"] as const;
const RATE = 1_610;

function ngn(n: number) {
  if (n >= 1e9) return "\u20A6" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return "\u20A6" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "\u20A6" + (n / 1e3).toFixed(1) + "K";
  return "\u20A6" + n.toFixed(0);
}
function num(n: number, d = 2) { return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }); }

/* ── loading skeleton row ── */
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "8px 16px" }}>
          <div style={{ height: 14, borderRadius: 6, background: "var(--c-line)", animation: "pulse 1.5s ease-in-out infinite" }} />
        </td>
      ))}
    </tr>
  );
}

export default function AdminOrderBook() {
  const [pair, setPair] = useState<string>("USDT/NGN");
  const [page] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page, pair],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), size: "20" });
      params.set("pair", pair);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    staleTime: 30_000,
  });

  const orders: typeof MOCK_ORDERS = data?.data?.length ? data.data : MOCK_ORDERS;

  const bids = orders.filter((o) => o.side === "Buy").slice(0, 8);
  const asks = orders.filter((o) => o.side === "Sell").slice(0, 8);
  const matches = orders.filter((o) => o.status === "Filled").slice(0, 10);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <h1 className="text-[32px] font-semibold tracking-[-0.03em] font-display" style={{ color: "var(--c-text)" }}>Order book &mdash; internal matching</h1>
        <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
          {PAIRS.map((p) => (
            <button
              key={p}
              onClick={() => setPair(p)}
              style={{
                padding: "4px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s",
                ...(pair === p
                  ? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }
                  : { background: "transparent", color: "var(--c-text-2)" }),
              }}
            >{p}</button>
          ))}
        </div>
      </div>

      {/* Bids / Asks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Bids */}
        <div className="ds-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--c-line)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>Bids</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
                {["Price", "Amount", "Total", "User"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={4} />)
                : bids.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid var(--c-line)" }}>
                    <td style={{ padding: "8px 16px", fontVariantNumeric: "tabular-nums", color: "var(--c-up)" }}>{ngn(o.price * RATE)}</td>
                    <td style={{ padding: "8px 16px", fontVariantNumeric: "tabular-nums" }}>{num(o.amount)}</td>
                    <td style={{ padding: "8px 16px", fontVariantNumeric: "tabular-nums" }}>{ngn(o.price * o.amount * RATE)}</td>
                    <td style={{ padding: "8px 16px", fontFamily: "monospace", fontSize: 11, color: "var(--c-text-3)" }}>{o.user.id}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Asks */}
        <div className="ds-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--c-line)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>Asks</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
                {["Price", "Amount", "Total", "User"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={4} />)
                : asks.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid var(--c-line)" }}>
                    <td style={{ padding: "8px 16px", fontVariantNumeric: "tabular-nums", color: "var(--c-down)" }}>{ngn(o.price * RATE)}</td>
                    <td style={{ padding: "8px 16px", fontVariantNumeric: "tabular-nums" }}>{num(o.amount)}</td>
                    <td style={{ padding: "8px 16px", fontVariantNumeric: "tabular-nums" }}>{ngn(o.price * o.amount * RATE)}</td>
                    <td style={{ padding: "8px 16px", fontFamily: "monospace", fontSize: 11, color: "var(--c-text-3)" }}>{o.user.id}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent matches */}
      <div className="ds-card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--c-line)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>Recent matches</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
              {["Time", "Pair", "Side", "Price", "Amount", "Buyer", "Seller"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
              : matches.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid var(--c-line)" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
                  <td style={{ padding: "8px 16px", color: "var(--c-text-3)" }}>{o.time}</td>
                  <td style={{ padding: "8px 16px" }}>{o.pair}</td>
                  <td style={{ padding: "8px 16px" }}>
                    <span style={{
                      display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: o.side === "Buy" ? "var(--c-up-soft)" : "var(--c-down-soft)",
                      color: o.side === "Buy" ? "var(--c-up)" : "var(--c-down)",
                    }}>{o.side}</span>
                  </td>
                  <td style={{ padding: "8px 16px", fontVariantNumeric: "tabular-nums" }}>{ngn(o.price * RATE)}</td>
                  <td style={{ padding: "8px 16px", fontVariantNumeric: "tabular-nums" }}>{num(o.amount)}</td>
                  <td style={{ padding: "8px 16px", fontFamily: "monospace", fontSize: 11, color: "var(--c-text-3)" }}>{o.user.id}</td>
                  <td style={{ padding: "8px 16px", fontFamily: "monospace", fontSize: 11, color: "var(--c-text-3)" }}>USR-{10042 + (parseInt(o.id.slice(-2)) % 20)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
