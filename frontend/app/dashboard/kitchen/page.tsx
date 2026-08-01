"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { useApi, apiPost } from "@/lib/useApi";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  modifications: string[] | null;
  priceCents: number;
}
interface Order {
  id: string;
  orderNumber: number;
  customerName: string | null;
  customerPhone: string | null;
  totalCents: number;
  status: "PLACED" | "PREPARING" | "READY" | "COLLECTED" | "CANCELLED";
  pickupTime: string | null;
  createdAt: string;
  orderItems: OrderItem[];
}

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function timeOf(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: "Australia/Sydney" });
}

// Web Audio beep — no audio asset needed, and works the instant the tablet
// loads (no network fetch to stall on for the very first order of the day).
function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.001, now + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.3, now + i * 0.18 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.18);
      osc.stop(now + i * 0.18 + 0.32);
    });
  } catch {
    // Some browsers block AudioContext until a user gesture — the kitchen
    // tablet just misses the chime that one time, nothing to recover from.
  }
}

function receiptText(order: Order, businessName: string): string {
  const lines = [
    "================================",
    `     ${businessName.toUpperCase()}`,
    "================================",
    `Order #${String(order.orderNumber).padStart(3, "0")} - AI PHONE ORDER`,
    order.customerName ? `Customer: ${order.customerName}` : null,
    order.customerPhone ? `Phone: ${order.customerPhone}` : null,
    `Pickup: ${order.pickupTime ? `~${timeOf(order.pickupTime)}` : "ASAP"}`,
    "",
    "ITEMS:",
    ...order.orderItems.flatMap((i) => [
      `${i.quantity}x ${i.name}  ${money(i.priceCents * i.quantity)}`,
      ...(i.modifications || []).map((m) => `  - ${m}`),
    ]),
    "--------------------------------",
    `TOTAL:  ${money(order.totalCents)}`,
    "================================",
    `Placed: ${timeOf(order.createdAt)} via ZyncoAI`,
    "================================",
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}

// Epson ePOS-Print XML — POSTed directly from this browser to the printer's
// own LAN IP (a cloud server can't reach a restaurant's local network, so
// this can't go through our backend). Standard Epson TM- series endpoint;
// built to the documented ePOS-Print XML schema but not verified against
// real hardware in this session — falls back to window.print() on any
// failure (timeout, wrong IP, printer off) so an order is never silently
// unprinted.
async function printViaEpson(ip: string, order: Order, businessName: string): Promise<boolean> {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const itemLines = order.orderItems
    .flatMap((i) => [
      `<text>${esc(`${i.quantity}x ${i.name}`)}  ${esc(money(i.priceCents * i.quantity))}&#10;</text>`,
      ...(i.modifications || []).map((m) => `<text>  - ${esc(m)}&#10;</text>`),
    ])
    .join("");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body>
<epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
<text align="center" width="2" height="2">${esc(businessName)}&#10;</text>
<text align="center">Order #${String(order.orderNumber).padStart(3, "0")} - AI PHONE ORDER&#10;&#10;</text>
<text align="left">${order.customerName ? `Customer: ${esc(order.customerName)}&#10;` : ""}${order.customerPhone ? `Phone: ${esc(order.customerPhone)}&#10;` : ""}Pickup: ${esc(order.pickupTime ? `~${timeOf(order.pickupTime)}` : "ASAP")}&#10;&#10;ITEMS:&#10;</text>
${itemLines}
<text align="left">--------------------------------&#10;</text>
<text align="left" width="2" height="2">TOTAL: ${esc(money(order.totalCents))}&#10;</text>
<text align="center">&#10;Placed: ${esc(timeOf(order.createdAt))} via ZyncoAI&#10;</text>
<cut type="feed"/>
</epos-print>
</s:Body>
</s:Envelope>`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch(`http://${ip}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=5000`, {
      method: "POST",
      headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: '""' },
      body: xml,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return resp.ok;
  } catch {
    return false;
  }
}

const STATUS_LABEL: Record<Order["status"], string> = {
  PLACED: "NEW", PREPARING: "PREPARING", READY: "READY", COLLECTED: "COLLECTED", CANCELLED: "CANCELLED",
};
const STATUS_COLOR: Record<Order["status"], string> = {
  PLACED: "#f59e0b", PREPARING: "#3b82f6", READY: "#22c55e", COLLECTED: "#475569", CANCELLED: "#ef4444",
};

function OrderCard({ order, onAdvance, printing }: { order: Order; onAdvance: (id: string, status: Order["status"]) => void; printing: boolean }) {
  const nextAction: Partial<Record<Order["status"], { label: string; next: Order["status"] }>> = {
    PLACED: { label: "START PREPARING", next: "PREPARING" },
    PREPARING: { label: "READY", next: "READY" },
    READY: { label: "COLLECTED", next: "COLLECTED" },
  };
  const action = nextAction[order.status];

  return (
    <div
      style={{
        background: "#1e293b",
        border: `3px solid ${STATUS_COLOR[order.status]}`,
        borderRadius: 16,
        padding: 20,
        color: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: 1 }}>#{String(order.orderNumber).padStart(3, "0")}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: STATUS_COLOR[order.status], textTransform: "uppercase" }}>
          {STATUS_LABEL[order.status]}{printing ? " · printing…" : ""}
        </span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>
        {order.customerName || "Phone order"} — Pickup ~{timeOf(order.pickupTime)}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 20, lineHeight: 1.4 }}>
        {order.orderItems.map((item) => (
          <div key={item.id}>
            <div>🍽️ {item.quantity > 1 ? `${item.quantity}x ` : ""}{item.name}</div>
            {(item.modifications || []).map((m, i) => (
              <div key={i} style={{ fontSize: 16, color: "#cbd5e1", paddingLeft: 24 }}>
                {/no|without/i.test(m) ? "❌" : "✅"} {m}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #334155", paddingTop: 10, marginTop: 4 }}>
        <span style={{ fontSize: 24, fontWeight: 800 }}>TOTAL: {money(order.totalCents)}</span>
        <span style={{ fontSize: 14, color: "#94a3b8" }}>Placed: {timeOf(order.createdAt)}</span>
      </div>

      {action && (
        <button
          onClick={() => onAdvance(order.id, action.next)}
          style={{
            marginTop: 8, padding: "16px 0", fontSize: 22, fontWeight: 800, borderRadius: 10, border: "none",
            background: STATUS_COLOR[action.next], color: "#0f172a", cursor: "pointer", letterSpacing: 1,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default function KitchenDisplayPage() {
  const { business, role } = useDashboard();
  const router = useRouter();
  const { data, mutate } = useApi<{ orders: Order[] }>("/api/business/orders", { refreshInterval: 5000 });
  const { data: printerConfig } = useApi<{ epsonPrinterIp: string | null }>("/api/business/orders/printer-config");
  const seenOrderIds = useRef<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);
  const [printingId, setPrintingId] = useState<string | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (business.vertical !== "RESTAURANT") router.replace("/dashboard");
  }, [business.vertical, router]);

  useEffect(() => {
    if (!data?.orders) return;
    const currentIds = new Set(data.orders.map((o) => o.id));

    if (!initialized) {
      // First load — remember what's already on the board, don't chime/print
      // for orders that existed before this tablet was opened.
      seenOrderIds.current = currentIds;
      setInitialized(true);
      return;
    }

    const freshOrders = data.orders.filter((o) => o.status === "PLACED" && !seenOrderIds.current.has(o.id));
    for (const o of currentIds) seenOrderIds.current.add(o);

    if (freshOrders.length) {
      playChime();
      (async () => {
        for (const order of freshOrders) {
          setPrintingId(order.id);
          const epsonIp = printerConfig?.epsonPrinterIp;
          const epsonOk = epsonIp ? await printViaEpson(epsonIp, order, business.name) : false;
          if (!epsonOk) {
            setReceiptOrder(order);
            await new Promise((r) => setTimeout(r, 150)); // let the receipt DOM commit before print()
            window.print();
          }
          setPrintingId(null);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.orders, initialized]);

  async function advance(orderId: string, status: Order["status"]) {
    try {
      await apiPost(`/api/business/orders/${orderId}/status`, { status }, "PATCH");
      mutate();
    } catch {
      toast.error("Could not update order status");
    }
  }

  if (business.vertical !== "RESTAURANT") return null;
  if (role === "DOCTOR") return null; // no equivalent restaurant role — just a safety net, kitchen access isn't role-restricted beyond STAFF+

  const orders = data?.orders || [];
  const active = orders.filter((o) => o.status === "PLACED" || o.status === "PREPARING" || o.status === "READY");
  const recent = orders.filter((o) => o.status === "COLLECTED" || o.status === "CANCELLED");

  return (
    <div className="no-print" style={{ minHeight: "100vh", background: "#0f172a", padding: 24, margin: -24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 800 }}>{business.name} — Kitchen</h1>
        <span style={{ color: "#94a3b8", fontSize: 16 }}>{active.length} active order{active.length === 1 ? "" : "s"}</span>
      </div>

      {!active.length ? (
        <p style={{ color: "#64748b", fontSize: 20, textAlign: "center", marginTop: 80 }}>No active orders. New orders will chime and appear here automatically.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {active.map((order) => (
            <OrderCard key={order.id} order={order} onAdvance={advance} printing={printingId === order.id} />
          ))}
        </div>
      )}

      {recent.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ color: "#64748b", fontSize: 14, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Last hour</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {recent.map((o) => (
              <span key={o.id} style={{ color: "#475569", fontSize: 14, border: "1px solid #334155", borderRadius: 8, padding: "6px 12px" }}>
                #{String(o.orderNumber).padStart(3, "0")} — {STATUS_LABEL[o.status]}
              </span>
            ))}
          </div>
        </div>
      )}

      {receiptOrder && (
        <pre className="print-only kitchen-receipt" style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 14 }}>
          {receiptText(receiptOrder, business.name)}
        </pre>
      )}
      <style jsx global>{`
        @media print {
          @page kitchen-receipt-page {
            size: 80mm auto;
            margin: 4mm;
          }
          .kitchen-receipt {
            page: kitchen-receipt-page;
          }
        }
      `}</style>
    </div>
  );
}
