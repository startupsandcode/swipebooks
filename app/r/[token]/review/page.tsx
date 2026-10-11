import { notFound } from "next/navigation";
import { getBatchByToken } from "@/lib/store";
import SwipeClient from "./SwipeClient";

export default async function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const batch = await getBatchByToken(token);
  if (!batch) notFound();

  return (
    <SwipeClient
      token={token}
      clientName={batch.clientName}
      initialTxns={batch.transactions.filter((t) => t.status === "pending")}
      total={batch.transactions.length}
    />
  );
}
