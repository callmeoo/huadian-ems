// 环保整改 mock 数据 / 类型 / 状态推导
// 落地数据库前，所有页面共用这里的纯函数和静态记录。
// 接 Prisma 后，把 RECTIFICATIONS 换成查询结果即可，类型保持不变。

export type RectificationStatus =
  | "pending"      // 待制定措施
  | "in-progress"  // 整改中
  | "review"       // 待验收
  | "closed"       // 已闭环（销号）
  | "overdue";     // 已超期（由 dueAt 推导）

export type RectificationSeverity = "high" | "medium" | "low";

export type RectificationCategory =
  | "air" | "water" | "noise" | "solid" | "management";

export type RectificationSource =
  | "epb"         // 环保局检查
  | "internal"    // 内部巡查
  | "third-party" // 第三方检测
  | "monitor"     // 监测系统超标
  | "other";

export type AttachmentKind = "before" | "during" | "after" | "report" | "other";

export interface RectificationAttachment {
  id: string;
  name: string;
  kind: AttachmentKind;
  size?: string;
  uploadedAt?: string;
}

export interface RectificationItem {
  id: string;                  // 单号，例如 ZG-2026-001
  title: string;
  status: RectificationStatus;
  severity: RectificationSeverity;
  category: RectificationCategory;

  // 1. 问题来源
  source: RectificationSource;
  sourceDetail?: string;       // 检查文号 / 报告编号 / 工单号
  discoveredAt: string;        // 发现时间 (yyyy-MM-dd HH:mm)

  // 2. 问题内容
  description: string;
  location?: string;

  // 3. 整改措施（空字符串 = 未制定）
  measures?: string;
  responsibleDept?: string;
  responsiblePerson?: string;

  // 4. 整改时间
  dueAt: string;               // 要求完成时间 (yyyy-MM-dd)
  completedAt?: string;

  // 5. 资料存档
  attachments: RectificationAttachment[];

  // 6. 验收闭环
  acceptedBy?: string;
  acceptedAt?: string;
  acceptanceNote?: string;
}

// ───────────────── Mock 数据 ─────────────────

export const RECTIFICATIONS: RectificationItem[] = [
  {
    id: "ZG-2026-008",
    title: "废气排放口02 氮氧化物连续3小时超标 — 需调整燃烧工况并形成长效机制",
    status: "in-progress",
    severity: "high",
    category: "air",
    source: "monitor",
    sourceDetail: "监控系统自动派单 #YJ-20260515",
    discoveredAt: "2026-05-15 16:00",
    description:
      "5月15日14:00—16:00，废气排放口02的 NOx 小时均值连续 3 次超过许可浓度限值（限值 100 mg/m³，最高 131.89 mg/m³）。初判燃烧工况偏离，二次风配比异常。",
    location: "废气排放口02 / 1号机组",
    measures:
      "1) 立即调整二次风门开度至 35%；2) 排查 SCR 喷氨系统是否结晶；3) 形成《NOx 工况控制 SOP》补丁，纳入运行交接班核对项。",
    responsibleDept: "运行部",
    responsiblePerson: "李工",
    dueAt: "2026-05-20",
    attachments: [
      { id: "a1", name: "整改前现场照片.jpg", kind: "before", size: "2.1 MB", uploadedAt: "2026-05-15 18:20" },
      { id: "a2", name: "燃烧工况调整记录.xlsx", kind: "during", size: "48 KB", uploadedAt: "2026-05-16 09:10" },
    ],
  },
  {
    id: "ZG-2026-007",
    title: "环保局现场检查 — 危废暂存间标识不规范、记录缺失",
    status: "pending",
    severity: "medium",
    category: "solid",
    source: "epb",
    sourceDetail: "广州生态环境局检查 文号 穗环检〔2026〕117号",
    discoveredAt: "2026-05-12 10:30",
    description:
      "现场检查发现：危废暂存间未按《危险废物贮存污染控制标准》（GB18597）张贴警示标识；废物出入库台账自 2026 年 3 月 起未及时登记。",
    location: "动力中心 危废暂存间",
    // 故意留空：用于演示「滞后预警 — 未制定措施」
    measures: undefined,
    responsibleDept: "环保部",
    responsiblePerson: undefined,
    dueAt: "2026-05-26",
    attachments: [
      { id: "a3", name: "环保局检查通知书.pdf", kind: "report", size: "780 KB", uploadedAt: "2026-05-12 14:00" },
    ],
  },
  {
    id: "ZG-2026-006",
    title: "第三方检测报告 — 废水排口 COD 超标整改",
    status: "review",
    severity: "high",
    category: "water",
    source: "third-party",
    sourceDetail: "粤检字〔2026〕Q1-009 号检测报告",
    discoveredAt: "2026-04-28 09:00",
    description:
      "第三方季度检测显示废水总排口 COD 均值 86 mg/L，超许可限值（80 mg/L）7.5%。涉及指标：COD。",
    location: "废水总排口",
    measures:
      "更换二沉池絮凝剂规格；增加 PAC 投加点 1 处；委托第三方复测确认。",
    responsibleDept: "运行部",
    responsiblePerson: "王工",
    dueAt: "2026-05-18",
    completedAt: "2026-05-16",
    attachments: [
      { id: "a4", name: "第三方检测报告.pdf", kind: "report", size: "3.4 MB", uploadedAt: "2026-04-28 11:00" },
      { id: "a5", name: "整改完成现场照.jpg", kind: "after", size: "2.8 MB", uploadedAt: "2026-05-16 15:20" },
      { id: "a6", name: "复测结果通知.pdf", kind: "report", size: "612 KB", uploadedAt: "2026-05-16 17:00" },
    ],
  },
  {
    id: "ZG-2026-005",
    title: "厂界噪声夜间监测点位 N3 超标 1.8 dB",
    status: "overdue",
    severity: "medium",
    category: "noise",
    source: "third-party",
    sourceDetail: "粤检字〔2026〕Q1-014 号检测报告",
    discoveredAt: "2026-04-10 22:00",
    description:
      "第三方夜间检测显示北侧厂界 N3 点位 Leq 56.8 dB(A)，超出夜间限值 55 dB(A)。疑似冷却塔风机噪声。",
    location: "北侧厂界 N3",
    measures: "冷却塔加装隔音罩，但施工进度滞后未在限期完成。",
    responsibleDept: "设备部",
    responsiblePerson: "赵工",
    dueAt: "2026-05-10",
    attachments: [
      { id: "a7", name: "噪声检测报告.pdf", kind: "report", size: "1.6 MB", uploadedAt: "2026-04-11 10:00" },
      { id: "a8", name: "隔音罩采购合同.pdf", kind: "during", size: "420 KB", uploadedAt: "2026-04-25 14:30" },
    ],
  },
  {
    id: "ZG-2026-004",
    title: "内部巡查 — 应急柴油机日常启动测试记录缺失 3 次",
    status: "closed",
    severity: "low",
    category: "management",
    source: "internal",
    sourceDetail: "环保部月度巡查 #XC-202604-03",
    discoveredAt: "2026-04-05 15:30",
    description:
      "4 月份应急柴油机周启动测试记录缺失 3 次，未按内部 SOP 执行。属管理类问题。",
    location: "应急柴油机房",
    measures: "补录记录；下发《应急设备巡检纪律提醒》；纳入月度考核。",
    responsibleDept: "运行部",
    responsiblePerson: "李工",
    dueAt: "2026-04-20",
    completedAt: "2026-04-18",
    acceptedBy: "何建奇（环保部）",
    acceptedAt: "2026-04-22 10:00",
    acceptanceNote: "整改到位，记录补齐，已纳入月度考核。同意销号。",
    attachments: [
      { id: "a9", name: "补录记录.xlsx", kind: "after", size: "32 KB", uploadedAt: "2026-04-18 16:00" },
      { id: "a10", name: "巡检纪律提醒.pdf", kind: "after", size: "180 KB", uploadedAt: "2026-04-19 09:30" },
    ],
  },
  {
    id: "ZG-2026-003",
    title: "二氧化硫排放口01 — 单小时偶发超标",
    status: "closed",
    severity: "low",
    category: "air",
    source: "monitor",
    sourceDetail: "监控系统自动派单 #YJ-20260415",
    discoveredAt: "2026-04-15 17:00",
    description:
      "4月15日17时，废气排放口01 SO₂ 小时均值 215.38 mg/m³，超限 7.7%。事后核查为机组负荷快速变动叠加吸收塔短暂偏离。",
    location: "废气排放口01 / 2号机组",
    measures:
      "调整负荷上升速率上限至 ≤ 5 MW/min；吸收塔自动调节增加 SO₂ 前馈回路。",
    responsibleDept: "运行部",
    responsiblePerson: "王工",
    dueAt: "2026-04-25",
    completedAt: "2026-04-22",
    acceptedBy: "何建奇（环保部）",
    acceptedAt: "2026-04-26 14:20",
    acceptanceNote: "复盘到位，前馈回路验证有效。",
    attachments: [
      { id: "a11", name: "调整后趋势图.png", kind: "after", size: "560 KB" },
    ],
  },
];

// ───────────────── 推导函数 ─────────────────

// 把日期字符串规整为 Date（兼容 "2026-05-20" 和 "2026-05-15 16:00"）
function parseDate(s: string): Date {
  return new Date(s.replace(" ", "T"));
}

// 当前时间锚点 — 与 globals 一致用 2026-05-17
const NOW = parseDate("2026-05-17 12:00");

export function daysUntilDue(item: RectificationItem): number {
  const due = parseDate(item.dueAt);
  return Math.ceil((due.getTime() - NOW.getTime()) / (24 * 3600 * 1000));
}

// 真实状态（把 in-progress / pending 中已逾期的归到 overdue）
export function effectiveStatus(item: RectificationItem): RectificationStatus {
  if (item.status === "closed" || item.status === "review") return item.status;
  return daysUntilDue(item) < 0 ? "overdue" : item.status;
}

// 滞后预警：未制定措施 且 已经过了一半整改期
export function isLagWarning(item: RectificationItem): boolean {
  if (item.status === "closed" || item.status === "review") return false;
  if (item.measures && item.measures.trim().length > 0) return false;
  const due = parseDate(item.dueAt).getTime();
  const found = parseDate(item.discoveredAt).getTime();
  const halfway = found + (due - found) / 2;
  return NOW.getTime() >= halfway;
}

export function getById(id: string): RectificationItem | undefined {
  return RECTIFICATIONS.find((r) => r.id === id);
}

// ───────────────── 展示映射 ─────────────────

export const STATUS_LABEL: Record<RectificationStatus, string> = {
  pending: "待制定",
  "in-progress": "整改中",
  review: "待验收",
  closed: "已闭环",
  overdue: "已超期",
};

export const STATUS_COLOR: Record<RectificationStatus, { bg: string; fg: string }> = {
  pending:       { bg: "#fff7e0", fg: "#d46b08" },
  "in-progress": { bg: "#e6f4ff", fg: "#1677ff" },
  review:        { bg: "#f5f0ff", fg: "#531dab" },
  closed:        { bg: "#f0fff4", fg: "#389e0d" },
  overdue:       { bg: "#fff0f0", fg: "#cf1322" },
};

export const SEVERITY_LABEL: Record<RectificationSeverity, string> = {
  high: "严重",
  medium: "一般",
  low: "轻微",
};

export const SEVERITY_COLOR: Record<RectificationSeverity, { bg: string; fg: string }> = {
  high:   { bg: "#fff0f0", fg: "#cf1322" },
  medium: { bg: "#fff7e0", fg: "#d46b08" },
  low:    { bg: "#f0fff4", fg: "#389e0d" },
};

export const CATEGORY_LABEL: Record<RectificationCategory, string> = {
  air: "废气",
  water: "废水",
  noise: "噪声",
  solid: "固废",
  management: "管理类",
};

export const SOURCE_LABEL: Record<RectificationSource, string> = {
  epb: "环保局检查",
  internal: "内部巡查",
  "third-party": "第三方检测",
  monitor: "监测系统",
  other: "其他",
};

// 顶部统计（用 effectiveStatus 推导）
export function buildStats(items: RectificationItem[]) {
  const eff = items.map(effectiveStatus);
  return {
    total: items.length,
    inProgress: eff.filter((s) => s === "in-progress" || s === "pending").length,
    review: eff.filter((s) => s === "review").length,
    overdue: eff.filter((s) => s === "overdue").length,
    closed: eff.filter((s) => s === "closed").length,
    lag: items.filter(isLagWarning).length,
  };
}
