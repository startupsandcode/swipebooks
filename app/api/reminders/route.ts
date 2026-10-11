import { NextRequest, NextResponse } from "next/server";
import { readBatches, saveBatch } from "@/lib/store";

// STUB: reminders are LOGGED ONLY. No emails or SMS are ever sent.
// A bookkeeper (or a cron hitting this endpoint) triggers the check; any batch
// with pending transactions and no reminder in the last 48h gets a stub entry.
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { batchId?: string };
  const batches = await readBatches();
  const now = Date.now();
  const FORTY_EIGHT_H = 48 * 60 * 60 * 1000;
  const logged: string[] = [];

  for (const batch of Object.values(batches)) {
    if (body.batchId && batch.id !== body.batchId) continue;
    const pending = batch.transactions.filter((t) => t.status === "pending").length;
    if (pending === 0) continue;
    const last = batch.lastReminderAt ? new Date(batch.lastReminderAt).getTime() : new Date(batch.createdAt).getTime();
    if (now - last < FORTY_EIGHT_H) continue;

    // STUB — would send email/SMS here; instead we record the intent.
    batch.lastReminderAt = new Date().toISOString();
    batch.reminders.push({
      at: batch.lastReminderAt,
      channel: "email-stub",
      recipient: batch.clientEmail || "(no email on file)",
      sent: false,
    });
    await saveBatch(batch);
    logged.push(batch.id);
  }

  return NextResponse.json({ ok: true, remindersLogged: logged });
}
