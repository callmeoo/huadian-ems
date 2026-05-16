import { NextResponse } from "next/server";
import { ROUTINE_TASKS } from "@/components/verification/data";
import type { RoutineTask, RoutineDetail } from "@/components/verification/types";

function toCard(t: RoutineDetail): RoutineTask {
  return {
    id: t.id,
    name: t.name,
    period: t.period,
    category: t.category,
    owner: t.owner,
    lastCompleted: t.lastCompleted,
    nextDue: t.nextDue,
    dueLevel: t.dueLevel,
    dueLabel: t.dueLabel,
    attachmentCount: t.attachments.length,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");

  let list = ROUTINE_TASKS.slice();
  if (period && period !== "all") list = list.filter((t) => t.period === period);
  list.sort((a, b) => a.id - b.id);

  return NextResponse.json(list.map(toCard));
}
