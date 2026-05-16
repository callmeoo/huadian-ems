import { NextResponse } from "next/server";
import { REPORTS } from "@/components/verification/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reportId = Number(id);
  if (Number.isNaN(reportId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const report = REPORTS.find((r) => r.id === reportId);
  if (!report) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(report);
}
