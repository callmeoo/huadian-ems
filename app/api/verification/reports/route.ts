import { NextResponse } from "next/server";
import { REPORTS } from "@/components/verification/data";
import type { ReportCard, ReportDetail } from "@/components/verification/types";

function toCard(r: ReportDetail): ReportCard {
  return {
    id: r.id,
    title: r.title,
    type: r.type,
    date: r.date,
    agency: r.agency,
    status: r.status,
    nextDate: r.nextDate,
    dueLabel: r.dueLabel,
    dueLevel: r.dueLevel,
    urgent: r.urgent,
    danger: r.danger,
    manualReviewed: r.manualReviewed,
    failCount: r.failCount,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  let list = REPORTS.slice();
  if (type && type !== "all") list = list.filter((r) => r.type === type);
  if (status && status !== "all") list = list.filter((r) => r.status === status);
  list.sort((a, b) => b.date.localeCompare(a.date));

  return NextResponse.json(list.map(toCard));
}
