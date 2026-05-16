export type ReportType = "gas" | "water" | "noise";
export type ReportStatus = "pass" | "fail" | "pending";
export type DueLevel = "very-soon" | "soon" | "normal" | "overdue";
export type QuarterType = "Q1" | "Q2" | "Q3" | "Q4";
export type RoutinePeriod = "daily" | "weekly" | "monthly" | "quarterly";

export interface VerificationItem {
  label: string;
  reportValue: string;
  requiredValue: string;
  pass: boolean;
}

export interface InstrumentItem {
  name: string;
  model: string;
  calibrationDate: string;
  certValidUntil: string;
  pass: boolean;
}

export interface SamplingItem {
  indicator: string;
  sampleCount: number;
  minRequired: number;
  reportMean: string;
  cemsMean: string;
  deviation: string;
  maxDeviation: string;
  pass: boolean;
}

export interface NoiseSamplingItem {
  pointName: string;
  duration: string;
  minDuration: string;
  value: string;
  limit: string;
  pass: boolean;
}

export interface Attachment {
  id: number;
  name: string;
  size: string;
  type: "pdf" | "image" | "excel" | "doc";
}

export interface ReviewLog {
  id: number;
  actor: string;
  action: string;
  reason?: string;
  time: string;
}

export interface ReportCard {
  id: number;
  title: string;
  type: ReportType;
  date: string;
  agency: string;
  status: ReportStatus;
  nextDate: string;
  dueLabel: string;
  dueLevel: DueLevel;
  urgent?: boolean;
  danger?: boolean;
  manualReviewed?: boolean;
  failCount?: number;
}

export interface ReportDetail extends ReportCard {
  reportNo: string;
  unit: string;
  outlet: string;
  samplingPeriod: string;
  formItems: VerificationItem[];
  instrumentItems: InstrumentItem[];
  samplingItems: SamplingItem[];
  noiseItems?: NoiseSamplingItem[];
  attachments: Attachment[];
  reviewLogs: ReviewLog[];
}

export interface RoutineTask {
  id: number;
  name: string;
  period: RoutinePeriod;
  category: string;
  owner: string;
  lastCompleted: string;
  nextDue: string;
  dueLevel: DueLevel;
  dueLabel: string;
  attachmentCount: number;
}

export interface RoutineDetail extends RoutineTask {
  description: string;
  basis: string;
  frequencyText: string;
  attachments: Attachment[];
  history: { time: string; actor: string; note: string }[];
}

export type StandardSource = "national" | "group" | "expert";

export interface VerificationStandard {
  id: number;
  type: ReportType;
  indicator: string;
  methods: string[];
  limit: string;
  sampleMin: number;
  deviationMax: string;
  source: StandardSource;
  sourceDoc: string;
  active: boolean;
  updatedAt: string;
}
