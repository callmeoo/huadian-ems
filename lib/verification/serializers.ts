import type {
  ThirdPartyReport,
  ReportFormItem,
  ReportInstrument,
  ReportSampling,
  ReportNoise,
  ReportAttachment,
  ReportReviewLog,
  RoutineTask,
  RoutineAttachment,
  RoutineHistory,
  VerificationStandard as VerificationStandardModel,
} from "@prisma/client";
import type {
  ReportCard,
  ReportDetail,
  RoutineTask as RoutineTaskCard,
  RoutineDetail,
  VerificationStandard,
  Attachment,
  ReviewLog,
  VerificationItem,
  InstrumentItem,
  SamplingItem,
  NoiseSamplingItem,
  ReportType,
  ReportStatus,
  DueLevel,
  RoutinePeriod,
  StandardSource,
} from "@/components/verification/types";

type ReportWithRelations = ThirdPartyReport & {
  formItems: ReportFormItem[];
  instruments: ReportInstrument[];
  samplings: ReportSampling[];
  noiseItems: ReportNoise[];
  attachments: ReportAttachment[];
  reviewLogs: ReportReviewLog[];
};

type RoutineWithRelations = RoutineTask & {
  attachments: RoutineAttachment[];
  history: RoutineHistory[];
};

export function toReportCard(r: ThirdPartyReport & {
  attachments?: ReportAttachment[];
}): ReportCard {
  return {
    id: r.id,
    title: r.title,
    type: r.type as ReportType,
    date: r.reportDate,
    agency: r.agency,
    status: r.status as ReportStatus,
    nextDate: r.nextDate,
    dueLabel: r.dueLabel,
    dueLevel: r.dueLevel as DueLevel,
    urgent: r.urgent,
    danger: r.danger,
    manualReviewed: r.manualReviewed,
    failCount: r.failCount ?? undefined,
  };
}

export function toReportDetail(r: ReportWithRelations): ReportDetail {
  return {
    ...toReportCard(r),
    reportNo: r.reportNo,
    unit: r.unit,
    outlet: r.outlet,
    samplingPeriod: r.samplingPeriod,
    formItems: r.formItems.map<VerificationItem>((i) => ({
      label: i.label,
      reportValue: i.reportValue,
      requiredValue: i.requiredValue,
      pass: i.pass,
    })),
    instrumentItems: r.instruments.map<InstrumentItem>((i) => ({
      name: i.name,
      model: i.model,
      calibrationDate: i.calibrationDate,
      certValidUntil: i.certValidUntil,
      pass: i.pass,
    })),
    samplingItems: r.samplings.map<SamplingItem>((i) => ({
      indicator: i.indicator,
      sampleCount: i.sampleCount,
      minRequired: i.minRequired,
      reportMean: i.reportMean,
      cemsMean: i.cemsMean,
      deviation: i.deviation,
      maxDeviation: i.maxDeviation,
      pass: i.pass,
    })),
    noiseItems: r.noiseItems.length
      ? r.noiseItems.map<NoiseSamplingItem>((i) => ({
          pointName: i.pointName,
          duration: i.duration,
          minDuration: i.minDuration,
          value: i.value,
          limit: i.noiseLimit,
          pass: i.pass,
        }))
      : undefined,
    attachments: r.attachments.map<Attachment>((a) => ({
      id: a.id,
      name: a.name,
      size: a.size,
      type: a.type as Attachment["type"],
    })),
    reviewLogs: r.reviewLogs.map<ReviewLog>((l) => ({
      id: l.id,
      actor: l.actor,
      action: l.action,
      reason: l.reason ?? undefined,
      time: l.time,
    })),
  };
}

export function toRoutineCard(
  t: RoutineTask & { attachments?: { id: number }[] },
): RoutineTaskCard {
  return {
    id: t.id,
    name: t.name,
    period: t.period as RoutinePeriod,
    category: t.category,
    owner: t.owner,
    lastCompleted: t.lastCompleted,
    nextDue: t.nextDue,
    dueLevel: t.dueLevel as DueLevel,
    dueLabel: t.dueLabel,
    attachmentCount: t.attachments?.length ?? 0,
  };
}

export function toRoutineDetail(t: RoutineWithRelations): RoutineDetail {
  return {
    ...toRoutineCard(t),
    description: t.description,
    basis: t.basis,
    frequencyText: t.frequencyText,
    attachments: t.attachments.map<Attachment>((a) => ({
      id: a.id,
      name: a.name,
      size: a.size,
      type: a.type as Attachment["type"],
    })),
    history: t.history.map((h) => ({
      time: h.time,
      actor: h.actor,
      note: h.note,
    })),
  };
}

export function toStandard(s: VerificationStandardModel): VerificationStandard {
  let methods: string[] = [];
  try {
    const parsed = JSON.parse(s.methods);
    methods = Array.isArray(parsed) ? parsed : [];
  } catch {
    methods = [];
  }
  return {
    id: s.id,
    type: s.type as ReportType,
    indicator: s.indicator,
    methods,
    limit: s.standardLimit,
    sampleMin: s.sampleMin,
    deviationMax: s.deviationMax,
    source: s.source as StandardSource,
    sourceDoc: s.sourceDoc,
    active: s.active,
    updatedAt: s.updatedAt,
  };
}
