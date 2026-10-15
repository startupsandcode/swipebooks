# SwipeBooks

SwipeBooks is a mobile-friendly bookkeeping review prototype. A bookkeeper uploads uncategorized transactions, then shares a review link with a client. The client confirms, rejects, or skips each suggested category; the bookkeeper can review the results.

## Current status

This is a local demo, not a production bookkeeping system. It stores batches in a local JSON file under `data/`; it does not send email or SMS. The client link is displayed in the upload screen for manual sharing. Do not enter real financial or customer data, or deploy it for clients.

## How it works

1. On `/upload`, a bookkeeper enters a client name and optional email, then uploads or pastes a CSV with `date`, `description`, and `amount` columns.
2. SwipeBooks validates the rows and suggests categories with local keyword rules. No AI or external accounting service is used.
3. The server creates a batch and a random bearer token for the review link. The link is displayed for the bookkeeper to copy; no message is sent.
4. The client opens the link on a phone and swipes right to confirm, left to reject, or skips a transaction.
5. The results page shows each decision. A reminder route records a stub reminder for batches pending longer than 48 hours; it does not contact anyone.

The app is built with Next.js, React, and TypeScript. Main code areas:

- `app/upload/`: batch creation and CSV upload UI
- `app/r/[token]/`: client link and mobile review flow
- `app/results/[batchId]/`: bookkeeper results view
- `app/api/`: batch, category decision, and reminder endpoints
- `lib/csv.ts`: CSV parsing
- `lib/seed.ts`: deterministic categorization rules and synthetic transactions
- `lib/store.ts`: JSON-file batch persistence

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Choose **Load demo data** to prefill a sample CSV. Use fictional names and transaction descriptions only.

## CSV format

```csv
date,description,amount
2026-10-01,Office supply purchase,63.19
2026-10-02,Team lunch,78.42
```

Amounts should be numeric. The parser accepts a date, description, and amount for each transaction.

## Security and production limits

The random review token acts as a bearer credential: anyone who has the link can view and submit decisions for that batch. Links have no expiry or account login in this prototype. The JSON store is not designed for concurrent production use, and the reminder system is not connected to email or SMS. Add authentication, authorization, link expiry and revocation, durable storage, and verified delivery before handling real client data.

## License

No license file is currently included. The repository is public source only if its owner changes visibility; reuse rights still need to be specified.
