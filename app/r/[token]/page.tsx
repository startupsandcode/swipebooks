import Link from "next/link";
import { notFound } from "next/navigation";
import { getBatchByToken } from "@/lib/store";

export default async function MagicLinkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const batch = await getBatchByToken(token);
  if (!batch) notFound();

  const pending = batch.transactions.filter((t) => t.status === "pending").length;
  const total = batch.transactions.length;

  return (
    <main>
      <h1>Hi, {batch.clientName}</h1>
      <p>
        Your bookkeeper needs your help with <b>{pending} of {total}</b> transactions.
        Swipe <b>right</b> to confirm the suggested category, <b>left</b> to reject it,
        or use the buttons below each card.
      </p>
      <div className="card" style={{ textAlign: "center" }}>
        <div className="progress">
          <div style={{ width: `${((total - pending) / total) * 100}%` }} />
        </div>
        <p>{total - pending} of {total} reviewed</p>
        {pending > 0 ? (
          <Link href={`/r/${token}/review`}><button>Start swiping</button></Link>
        ) : (
          <p>All done — thanks! Your bookkeeper has the results.</p>
        )}
      </div>
    </main>
  );
}
