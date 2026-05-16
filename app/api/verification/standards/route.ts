import { NextResponse } from "next/server";
import { STANDARDS } from "@/components/verification/data";
import type { VerificationStandard } from "@/components/verification/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let list = STANDARDS.slice();
  if (type && type !== "all") list = list.filter((s) => s.type === type);
  list.sort((a, b) => a.id - b.id);

  return NextResponse.json(list);
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
  const nextId = STANDARDS.reduce((m, s) => Math.max(m, s.id), 0) + 1;

  const created: VerificationStandard = {
    id: nextId,
    type: body.type,
    indicator: body.indicator,
    methods: body.methods,
    limit: body.limit,
    sampleMin: body.sampleMin || 5,
    deviationMax: body.deviationMax || "±15%",
    source: body.source,
    sourceDoc: body.sourceDoc || "未命名引用文件",
    active: true,
    updatedAt: today,
  };
  STANDARDS.push(created);

  return NextResponse.json(created, { status: 201 });
}
