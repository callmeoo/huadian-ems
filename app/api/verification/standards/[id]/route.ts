import { NextResponse } from "next/server";
import { STANDARDS } from "@/components/verification/data";

interface PatchBody {
  active?: boolean;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const standardId = Number(id);
  if (Number.isNaN(standardId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const standard = STANDARDS.find((s) => s.id === standardId);
  if (!standard) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const body = (await request.json()) as PatchBody;
  if (typeof body.active === "boolean") standard.active = body.active;
  standard.updatedAt = new Date().toISOString().substring(0, 10);

  return NextResponse.json(standard);
}
