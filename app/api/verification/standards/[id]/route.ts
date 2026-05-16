import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toStandard } from "@/lib/verification/serializers";

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

  const body = (await request.json()) as PatchBody;
  const updated = await prisma.verificationStandard.update({
    where: { id: standardId },
    data: {
      ...(typeof body.active === "boolean" ? { active: body.active } : {}),
      updatedAt: new Date().toISOString().substring(0, 10),
    },
  });

  return NextResponse.json(toStandard(updated));
}
