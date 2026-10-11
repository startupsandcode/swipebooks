"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { demoCsv } from "@/lib/seed";

function UploadForm() {
  const search = useSearchParams();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [csv, setCsv] = useState(search.get("demo") ? demoCsv() : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ batchId: string; magicLink: string; count: number } | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setCsv(await f.text());
  }

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ clientName, clientEmail, csv }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create batch");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1>Upload transactions</h1>
      <p>CSV with columns: <code>date, description, amount</code>. Demo data only — no real customer data.</p>
      <label>Client name</label>
      <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Demo Client" />
      <label>Client email (demo — nothing is ever sent)</label>
      <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="demo@example.com" />
      <label>CSV file</label>
      <input type="file" accept=".csv,text/csv" onChange={onFile} />
      <label>…or paste CSV</label>
      <textarea value={csv} onChange={(e) => setCsv(e.target.value)} spellCheck={false} />
      <button className="ghost" type="button" onClick={() => setCsv(demoCsv())}>Load demo data</button>{" "}
      <button type="button" onClick={submit} disabled={busy || !clientName.trim() || !csv.trim()}>
        {busy ? "Creating…" : "Create review link"}
      </button>
      {error && <p style={{ color: "#dc2626" }}>{error}</p>}
      {result && (
        <div className="card">
          <h2>Batch ready — {result.count} transactions</h2>
          <p>Copy this magic link to your client (STUB — no message is sent by the app):</p>
          <div className="link-box">{result.magicLink}</div>
          <p><a href={result.magicLink}>Open magic link</a> · <a href={`/results/${result.batchId}`}>View results dashboard</a></p>
        </div>
      )}
    </main>
  );
}

export default function UploadPage() {
  return (
    <Suspense>
      <UploadForm />
    </Suspense>
  );
}
