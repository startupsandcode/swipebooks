# SwipeBooks — swipe-through bookkeeping review (MVP v1)

A bookkeeper uploads a CSV of uncategorized transactions and gets a magic link.
The client opens the link on their phone and swipes right (confirm), left
(reject), or skips each transaction's suggested category. The bookkeeper sees
results on a dashboard; batches pending longer than 48 hours get a stub
reminder entry.

**Demo only.** No real customer data — batches are stored in a local JSON file
(`data/batches.json`) and reminders are *logged, never sent*. No emails, no
SMS, no external accounts.

## Run it

```bash
npm install
npm run dev
```

## Flow

1. `/upload` — bookkeeper uploads CSV (`date, description, amount`) → gets magic link
2. `/r/[token]` — client's magic link landing
3. `/r/[token]/review` — mobile swipe UI
4. `/results/[batchId]` — bookkeeper dashboard + stub reminder check
5. `POST /api/reminders` — logs stub reminders for batches pending 48h+ (never sends)
