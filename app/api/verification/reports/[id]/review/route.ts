import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toReportDetail } from "@/lib/verification/serializers";

interface ReviewBody {
  action: "pass" | "reject";
  reason?: string;
  actor?: string;
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

  const body = (await request.json()) as ReviewBody;
  if (body.action !== "pass" && body.action !== "reject") {
    return NextResponse.json({ error: "invalid action" }, { status: 400 });
  }

  const existing = await prisma.thirdPartyReport.findUnique({
    where: { id: reportId },
  });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const nextStatus = body.action === "pass" ? "pass" : "fail";
  const actor = body.actor ?? "环保管理员";
  const reason =
    body.reason ??
    (body.action === "pass"
      ? "已查阅报告，三类核验实质满足要求，标记为合格"
      : "确认报告存在不合规问题，要求第三方重新出具");
  const time = new Date()
    .toISOString()
    .replace("T", " ")
    .substring(0, 16);

  await prisma.thirdPartyReport.update({
    where: { id: reportId },
    data: {
      status: nextStatus,
      manualReviewed: true,
      reviewLogs: {
        create: {
          actor,
          action:
            body.action === "pass" ? "人工复核：合格" : "人工复核：驳回",
          reason,
          time,
        },
      },
    },
  });

  const updated = await prisma.thirdPartyReport.findUnique({
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

  return NextResponse.json(toReportDetail(updated!));
}
