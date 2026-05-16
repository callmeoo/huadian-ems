import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toReportCard } from "@/lib/verification/serializers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const reports = await prisma.thirdPartyReport.findMany({
    where: {
      ...(type && type !== "all" ? { type } : {}),
      ...(status && status !== "all" ? { status } : {}),
    },
    orderBy: { reportDate: "desc" },
  });

  return NextResponse.json(reports.map((r) => toReportCard(r)));
}
