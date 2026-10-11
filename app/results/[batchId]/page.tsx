import { notFound } from "next/navigation";
import { getBatch } from "@/lib/store";
import ReminderButton from "./ReminderButton";

export default async function ResultsPage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  const batch = await getBatch(batchId);
  if (!batch) notFound();

  const pending = batch.transactions.filter((t) => t.status === "pending");
  const decided = batch.transactions.filter((t) => t.status !== "pending");
  const total = batch.transactions.length;
  const donePct = total ? Math.round((decided.length / total) * 100) : 0;

  return (
    <main>
      <h1>Results — {batch.clientName}</h1>
      <p>
        Created {new Date(batch.createdAt).toLocaleString()} · {decided.length}/{total} reviewed ({donePct}%)
        {pending.length > 0 && <span className="badge pending" style={{ marginLeft: 8 }}>{pending.length} pending</span>}
        {pending.length === 0 && total > 0 && <span className="badge done" style={{ marginLeft: 8 }}>Complete</span>}
      </p>
      <div className="progress">
        <div style={{ width: `${donePct}%` }} />
      </div>

      <h2>Categorized</h2>
      {decided.length === 0 ? (
        <p>No decisions yet.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Date</th><th>Description</th><th>Amount</th><th>Category</th><th>Status</th></tr>
          </thead>
          <tbody>
            {decided.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.description}</td>
                <td>${t.amount.toFixed(2)}</td>
                <td>{t.finalCategory ?? t.suggestedCategory}</td>
                <td>{t.status === "confirmed" ? "✓" : t.status === "rejected" ? "✕" : "skipped"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Reminders (stub — never sent)</h2>
      <p>
        Last reminder: {batch.lastReminderAt ? new Date(batch.lastReminderAt).toLocaleString() : "never"} ·
        logged: {batch.reminders.length}
      </p>
      <ReminderButton batchId={batch.id} />
      <p className="hint">
        Auto-reminder rule: batches with pending transactions and no reminder in the last 48 hours
        get a stub entry when the check runs (POST /api/reminders). Nothing is emailed or texted.
      </p>
    </main>
  );
}
