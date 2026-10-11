import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>SwipeBooks</h1>
      <p>
        Your client has uncategorized transactions. Instead of a spreadsheet,
        send them a link. They swipe right to confirm, left to reject — and you
        get clean books.
      </p>
      <div className="card">
        <h2>For bookkeepers</h2>
        <p>Upload a CSV of uncategorized transactions, get a magic link for your client.</p>
        <Link href="/upload"><button>Get started</button></Link>
      </div>
      <div className="card">
        <h2>Try the demo</h2>
        <p>No real data — a seeded demo batch with 10 transactions is built in.</p>
        <Link href="/upload?demo=1"><button className="ghost">Load demo data</button></Link>
      </div>
      <p className="hint">MVP v1 — reminder messages are logged only, never actually sent.</p>
    </main>
  );
}
