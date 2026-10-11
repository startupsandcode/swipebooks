import { NextRequest, NextResponse } from "next/server";
import { getBatchByToken, saveBatch } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { token, txnId, decision } = (await req.json()) as {
    token?: string;
    txnId?: string;
    decision?: "yes" | "no" | "skip";
  };
  if (!token || !txnId || !["yes", "no", "skip"].includes(decision ?? "")) {
    return NextResponse.json({ error: "token, txnId, and decision (yes|no|skip) are required." }, { status: 400 });
  }
  const batch = await getBatchByToken(token);
  if (!batch) return NextResponse.json({ error: "Batch not found." }, { status: 404 });
  const txn = batch.transactions.find((t) => t.id === txnId);
  if (!txn) return NextResponse.json({ error: "Transaction not found." }, { status: 404 });

  txn.status = decision === "yes" ? "confirmed" : decision === "no" ? "rejected" : "skipped";
  txn.finalCategory = decision === "yes" ? txn.suggestedCategory : null;
  txn.decidedAt = new Date().toISOString();
  await saveBatch(batch);

  const pending = batch.transactions.filter((t) => t.status === "pending").length;
  return NextResponse.json({ ok: true, pending, total: batch.transactions.length });
}
