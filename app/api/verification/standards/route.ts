import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toStandard } from "@/lib/verification/serializers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const standards = await prisma.verificationStandard.findMany({
    where: type && type !== "all" ? { type } : undefined,
    orderBy: { id: "asc" },
  });

  return NextResponse.json(standards.map(toStandard));
}

interface CreateBody {
  type: "gas" | "water" | "noise";
  indicator: string;
  methods: string[];
  limit: string;
  sampleMin: number;
  deviationMax: string;
  source: "national" | "group" | "expert";
  sourceDoc: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateBody;
  if (!body.indicator || !body.methods?.length || !body.limit) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const today = new Date().toISOString().substring(0, 10);

  const created = await prisma.verificationStandard.create({
    data: {
      type: body.type,
      indicator: body.indicator,
      methods: JSON.stringify(body.methods),
      standardLimit: body.limit,
      sampleMin: body.sampleMin || 5,
      deviationMax: body.deviationMax || "±15%",
      source: body.source,
      sourceDoc: body.sourceDoc || "未命名引用文件",
      active: true,
      updatedAt: today,
    },
  });

  return NextResponse.json(toStandard(created), { status: 201 });
}
