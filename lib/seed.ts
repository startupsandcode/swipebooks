// Seeded DEMO data only — no real customer data anywhere in this app.

export interface DemoTxn {
  date: string;
  description: string;
  amount: number;
}

export const CATEGORIES = [
  "Meals & Entertainment",
  "Office Supplies",
  "Travel",
  "Software & Subscriptions",
  "Marketing & Advertising",
  "Utilities",
  "Professional Services",
  "Vehicle & Fuel",
  "Rent & Facilities",
  "Other",
];

const RULES: Array<{ pattern: RegExp; category: string }> = [
  { pattern: /starbucks|chipotle|sweetgreen|restaurant|cafe|diner|pizza|doordash|ubereats/i, category: "Meals & Entertainment" },
  { pattern: /staples|amazon|office depot|paper|ink/i, category: "Office Supplies" },
  { pattern: /delta|united|airline|hotel|marriott|lyft|uber|expedia/i, category: "Travel" },
  { pattern: /github|notion|figma|slack|vercel|aws|google workspace|saas|subscription/i, category: "Software & Subscriptions" },
  { pattern: /google ads|meta ads|facebook ads|mailchimp|hubspot/i, category: "Marketing & Advertising" },
  { pattern: /con ed|pg&e|electric|water|gas bill|internet|comcast/i, category: "Utilities" },
  { pattern: /law firm|attorney|accountant|cpa|consulting/i, category: "Professional Services" },
  { pattern: /shell|exxon|chevron|gas station|auto repair|tires/i, category: "Vehicle & Fuel" },
  { pattern: /rent|wework|lease/i, category: "Rent & Facilities" },
];

export function suggestCategory(description: string): string {
  for (const rule of RULES) {
    if (rule.pattern.test(description)) return rule.category;
  }
  return "Other";
}

export const DEMO_TXNS: DemoTxn[] = [
  { date: "2026-09-28", description: "Starbucks - Client Meeting", amount: 24.50 },
  { date: "2026-09-29", description: "Delta Airlines - Conference Trip", amount: 412.80 },
  { date: "2026-09-30", description: "GitHub Team Plan - Monthly", amount: 84.00 },
  { date: "2026-10-01", description: "Staples - Printer Paper", amount: 63.19 },
  { date: "2026-10-02", description: "Chipotle - Team Lunch", amount: 78.42 },
  { date: "2026-10-03", description: "Google Ads - Campaign", amount: 500.00 },
  { date: "2026-10-04", description: "Shell - Fuel", amount: 55.10 },
  { date: "2026-10-05", description: "WeWork - October Rent", amount: 1250.00 },
  { date: "2026-10-06", description: "Con Edison - Electric Bill", amount: 210.44 },
  { date: "2026-10-07", description: "Smith & Associates Law Firm", amount: 1800.00 },
];

export function demoCsv(): string {
  const header = "date,description,amount";
  const rows = DEMO_TXNS.map((t) => `${t.date},"${t.description}",${t.amount.toFixed(2)}`);
  return [header, ...rows].join("\n");
}
