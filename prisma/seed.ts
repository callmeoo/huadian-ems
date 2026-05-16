import { PrismaClient } from "@prisma/client";
import { REPORTS, ROUTINE_TASKS, STANDARDS } from "../components/verification/data";

const prisma = new PrismaClient();

async function main() {
  console.log("→ 清空现有核验数据...");
  await prisma.reportReviewLog.deleteMany();
  await prisma.reportAttachment.deleteMany();
  await prisma.reportFormItem.deleteMany();
  await prisma.reportInstrument.deleteMany();
  await prisma.reportSampling.deleteMany();
  await prisma.reportNoise.deleteMany();
  await prisma.thirdPartyReport.deleteMany();

  await prisma.routineAttachment.deleteMany();
  await prisma.routineHistory.deleteMany();
  await prisma.routineTask.deleteMany();

  await prisma.verificationStandard.deleteMany();

  console.log("→ 写入第三方检测报告...");
  for (const r of REPORTS) {
    await prisma.thirdPartyReport.create({
      data: {
        id: r.id,
        title: r.title,
        type: r.type,
        reportNo: r.reportNo,
        unit: r.unit,
        outlet: r.outlet,
        agency: r.agency,
        samplingPeriod: r.samplingPeriod,
        reportDate: r.date,
        nextDate: r.nextDate,
        dueLabel: r.dueLabel,
        dueLevel: r.dueLevel,
        status: r.status,
        manualReviewed: r.manualReviewed ?? false,
        failCount: r.failCount ?? null,
        urgent: r.urgent ?? false,
        danger: r.danger ?? false,
        formItems: { create: r.formItems.map((i) => ({ ...i })) },
        instruments: { create: r.instrumentItems.map((i) => ({ ...i })) },
        samplings: { create: r.samplingItems.map((i) => ({ ...i })) },
        noiseItems: {
          create: (r.noiseItems ?? []).map((i) => ({
            pointName: i.pointName,
            duration: i.duration,
            minDuration: i.minDuration,
            value: i.value,
            noiseLimit: i.limit,
            pass: i.pass,
          })),
        },
        attachments: {
          create: r.attachments.map((a) => ({
            name: a.name,
            size: a.size,
            type: a.type,
          })),
        },
        reviewLogs: {
          create: r.reviewLogs.map((l) => ({
            actor: l.actor,
            action: l.action,
            reason: l.reason ?? null,
            time: l.time,
          })),
        },
      },
    });
  }

  console.log("→ 写入定期工作任务...");
  for (const t of ROUTINE_TASKS) {
    await prisma.routineTask.create({
      data: {
        id: t.id,
        name: t.name,
        period: t.period,
        category: t.category,
        owner: t.owner,
        lastCompleted: t.lastCompleted,
        nextDue: t.nextDue,
        dueLevel: t.dueLevel,
        dueLabel: t.dueLabel,
        description: t.description,
        basis: t.basis,
        frequencyText: t.frequencyText,
        attachments: {
          create: t.attachments.map((a) => ({
            name: a.name,
            size: a.size,
            type: a.type,
          })),
        },
        history: {
          create: t.history.map((h) => ({
            time: h.time,
            actor: h.actor,
            note: h.note,
          })),
        },
      },
    });
  }

  console.log("→ 写入核验标准...");
  for (const s of STANDARDS) {
    await prisma.verificationStandard.create({
      data: {
        id: s.id,
        type: s.type,
        indicator: s.indicator,
        methods: JSON.stringify(s.methods),
        standardLimit: s.limit,
        sampleMin: s.sampleMin,
        deviationMax: s.deviationMax,
        source: s.source,
        sourceDoc: s.sourceDoc,
        active: s.active,
        updatedAt: s.updatedAt,
      },
    });
  }

  const stats = {
    reports: await prisma.thirdPartyReport.count(),
    routines: await prisma.routineTask.count(),
    standards: await prisma.verificationStandard.count(),
  };
  console.log("✓ Seed 完成:", stats);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
