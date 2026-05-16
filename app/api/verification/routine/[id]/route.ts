import { NextResponse } from "next/server";
import { ROUTINE_TASKS } from "@/components/verification/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const taskId = Number(id);
  if (Number.isNaN(taskId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const task = ROUTINE_TASKS.find((t) => t.id === taskId);
  if (!task) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}
