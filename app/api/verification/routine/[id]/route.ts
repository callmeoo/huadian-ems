import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toRoutineDetail } from "@/lib/verification/serializers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const taskId = Number(id);
  if (Number.isNaN(taskId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const task = await prisma.routineTask.findUnique({
    where: { id: taskId },
    include: {
      attachments: { orderBy: { id: "asc" } },
      history: { orderBy: { id: "desc" } },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(toRoutineDetail(task));
}
