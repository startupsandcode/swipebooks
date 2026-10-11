// Minimal RFC-4180-ish CSV parser — enough for date,description,amount uploads.
export interface ParsedRow {
  date: string;
  description: string;
  amount: number;
}

function parseLine(line: string): string[] {
  const fields: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else cur += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      fields.push(cur);
      cur = "";
    } else cur += ch;
  }
  fields.push(cur);
  return fields.map((f) => f.trim());
}

export function parseCsv(text: string): ParsedRow[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV needs a header row plus at least one transaction row.");
  const header = parseLine(lines[0]).map((h) => h.toLowerCase());
  const di = header.indexOf("date");
  const de = header.indexOf("description");
  const ai = header.indexOf("amount");
  if (di === -1 || de === -1 || ai === -1) {
    throw new Error('CSV header must include "date", "description", and "amount" columns.');
  }
  const rows: ParsedRow[] = [];
  for (const line of lines.slice(1)) {
    const f = parseLine(line);
    const amount = parseFloat((f[ai] ?? "").replace(/[^0-9.\-]/g, ""));
    if (Number.isNaN(amount)) throw new Error(`Bad amount on row: ${line}`);
    rows.push({ date: f[di] ?? "", description: f[de] ?? "", amount });
  }
  return rows;
}
