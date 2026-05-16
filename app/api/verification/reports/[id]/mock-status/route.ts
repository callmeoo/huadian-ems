import { NextResponse } from "next/server";
import { REPORTS } from "@/components/verification/data";
import type { ReportStatus } from "@/components/verification/types";

interface MockStatusBody {
  status: ReportStatus;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reportId = Number(id);
  if (Number.isNaN(reportId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const body = (await request.json()) as MockStatusBody;
  if (body.status !== "pass" && body.status !== "fail" && body.status !== "pending") {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const report = REPORTS.find((r) => r.id === reportId);
  if (!report) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  report.status = body.status;
  // 演示工具：重置为 pending 时连人工复核标记一起清掉
  if (body.status === "pending") report.manualReviewed = false;

  return NextResponse.json(report);
}
