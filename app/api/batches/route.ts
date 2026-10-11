import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { parseCsv } from "@/lib/csv";
import { suggestCategory } from "@/lib/seed";
import { saveBatch, type Batch, type Transaction } from "@/lib/store";

function baseUrl(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const host = req.headers.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  try {
    const { clientName, clientEmail, csv } = (await req.json()) as {
      clientName?: string;
      clientEmail?: string;
      csv?: string;
    };
    if (!clientName?.trim()) return NextResponse.json({ error: "Client name is required." }, { status: 400 });
    if (!csv?.trim()) return NextResponse.json({ error: "CSV content is required." }, { status: 400 });

    const rows = parseCsv(csv);
    if (rows.length === 0) return NextResponse.json({ error: "No transaction rows found." }, { status: 400 });
    if (rows.length > 500) return NextResponse.json({ error: "MVP limit: 500 transactions per batch." }, { status: 400 });

    const batchId = randomBytes(8).toString("hex");
    const token = randomBytes(24).toString("hex");
    const now = new Date().toISOString();

    const transactions: Transaction[] = rows.map((r, i) => ({
      id: `${batchId}-${i}`,
      date: r.date,
      description: r.description,
      amount: r.amount,
      suggestedCategory: suggestCategory(r.description),
      status: "pending",
      finalCategory: null,
      decidedAt: null,
    }));

    const batch: Batch = {
      id: batchId,
      clientName: clientName.trim(),
      clientEmail: (clientEmail ?? "").trim(),
      token,
      createdAt: now,
      lastReminderAt: null,
      reminders: [],
      transactions,
    };
    await saveBatch(batch);

    return NextResponse.json({
      batchId,
      magicLink: `${baseUrl(req)}/r/${token}`,
      count: transactions.length,
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to create batch." }, { status: 400 });
  }
}
