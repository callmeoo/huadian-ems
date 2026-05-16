import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toReportDetail } from "@/lib/verification/serializers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reportId = Number(id);
  if (Number.isNaN(reportId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const report = await prisma.thirdPartyReport.findUnique({
    where: { id: reportId },
    include: {
      formItems: true,
      instruments: true,
      samplings: true,
      noiseItems: true,
      attachments: true,
      reviewLogs: { orderBy: { id: "asc" } },
    },
  });

  if (!report) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(toReportDetail(report));
}
