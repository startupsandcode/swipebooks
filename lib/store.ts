import { promises as fs } from "fs";
import path from "path";

export type Decision = "yes" | "no" | "skip";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  suggestedCategory: string;
  status: "pending" | "confirmed" | "rejected" | "skipped";
  finalCategory: string | null;
  decidedAt: string | null;
}

export interface ReminderEvent {
  at: string;
  channel: "email-stub" | "sms-stub";
  recipient: string;
  sent: false; // STUB: never actually sent — logged only
}

export interface Batch {
  id: string;
  clientName: string;
  clientEmail: string; // demo only; no real customer data
  token: string;
  createdAt: string;
  lastReminderAt: string | null;
  reminders: ReminderEvent[];
  transactions: Transaction[];
}

const DATA_FILE = path.join(process.cwd(), "data", "batches.json");

async function ensureFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, "{}");
  }
}

export async function readBatches(): Promise<Record<string, Batch>> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    return JSON.parse(raw) as Record<string, Batch>;
  } catch {
    return {};
  }
}

export async function writeBatches(batches: Record<string, Batch>) {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(batches, null, 2));
}

export async function getBatch(id: string): Promise<Batch | null> {
  const batches = await readBatches();
  return batches[id] ?? null;
}

export async function getBatchByToken(token: string): Promise<Batch | null> {
  const batches = await readBatches();
  return Object.values(batches).find((b) => b.token === token) ?? null;
}

export async function saveBatch(batch: Batch) {
  const batches = await readBatches();
  batches[batch.id] = batch;
  await writeBatches(batches);
}
