"use client";

import { useRef, useState } from "react";
import type { Transaction } from "@/lib/store";

export default function SwipeClient({
  token,
  clientName,
  initialTxns,
  total,
}: {
  token: string;
  clientName: string;
  initialTxns: Transaction[];
  total: number;
}) {
  const [queue, setQueue] = useState<Transaction[]>(initialTxns);
  const [dragX, setDragX] = useState(0);
  const [done, setDone] = useState(0);
  const startX = useRef<number | null>(null);
  const activePointer = useRef<number | null>(null);

  const current = queue[0];

  async function decide(decision: "yes" | "no" | "skip") {
    if (!current) return;
    const txn = current;
    setQueue((q) => q.slice(1));
    setDragX(0);
    setDone((d) => d + 1);
    try {
      await fetch("/api/categorize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, txnId: txn.id, decision }),
      });
    } catch {
      // best-effort for MVP; transaction is re-queued server-side only on success,
      // so a failed request leaves the client behind — acceptable for v1.
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    activePointer.current = e.pointerId;
    startX.current = e.clientX;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (activePointer.current !== e.pointerId || startX.current === null) return;
    setDragX(e.clientX - startX.current);
  }
  function onPointerUp(e: React.PointerEvent) {
    if (activePointer.current !== e.pointerId) return;
    const dx = e.clientX - (startX.current ?? e.clientX);
    activePointer.current = null;
    startX.current = null;
    if (dx > 80) void decide("yes");
    else if (dx < -80) void decide("no");
    else setDragX(0);
  }

  if (!current) {
    return (
      <main>
        <h1>All done, {clientName}!</h1>
        <p>You reviewed {done} of {total} transactions. Your bookkeeper has the results — thank you.</p>
      </main>
    );
  }

  const tilt = Math.max(-12, Math.min(12, dragX / 18));
  const stamp = dragX > 40 ? "CONFIRM" : dragX < -40 ? "REJECT" : null;

  return (
    <main>
      <h1>Swipe to categorize</h1>
      <p>{done + 1} of {total}</p>
      <div className="progress">
        <div style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <div className="swipe-wrap" style={{ marginTop: 16 }}>
        <div
          className="txn-card"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => setDragX(0)}
          style={{ transform: `translateX(${dragX}px) rotate(${tilt}deg)`, position: "relative" }}
        >
          {stamp && (
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                border: `3px solid ${stamp === "CONFIRM" ? "#16a34a" : "#dc2626"}`,
                color: stamp === "CONFIRM" ? "#16a34a" : "#dc2626",
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: 8,
                transform: "rotate(8deg)",
              }}
            >
              {stamp}
            </div>
          )}
          <div className="date">{current.date}</div>
          <div className="amount">${current.amount.toFixed(2)}</div>
          <div className="desc">{current.description}</div>
          <div className="suggest">
            Suggested category: <b>{current.suggestedCategory}</b>
          </div>
        </div>
      </div>
      <div className="btn-row">
        <button className="btn-no" onClick={() => decide("no")}>✕ Reject</button>
        <button className="ghost" onClick={() => decide("skip")}>Skip</button>
        <button className="btn-yes" onClick={() => decide("yes")}>✓ Confirm</button>
      </div>
      <p className="hint">Tip: swipe the card right to confirm, left to reject.</p>
    </main>
  );
}
