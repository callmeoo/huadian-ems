import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toRoutineCard } from "@/lib/verification/serializers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");

  const tasks = await prisma.routineTask.findMany({
    where: period && period !== "all" ? { period } : undefined,
    include: { attachments: { select: { id: true } } },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(tasks.map((t) => toRoutineCard(t)));
}
