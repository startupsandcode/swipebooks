"use client";

import { useState } from "react";

export default function ReminderButton({ batchId }: { batchId: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function check() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ batchId }),
      });
      const data = await res.json();
      setMsg(
        data.remindersLogged?.includes(batchId)
          ? "Reminder logged (stub — not sent)."
          : "No reminder due yet (48-hour window not elapsed)."
      );
    } catch {
      setMsg("Reminder check failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button onClick={check} disabled={busy}>Check / send reminder (stub)</button>
      {msg && <p className="hint">{msg}</p>}
    </div>
  );
}
