"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, Download, Menu } from "lucide-react";
import TabBar from "@/components/layout/TabBar";

// ─── Types ────────────────────────────────────────────────────────────────────

type PeriodType = "year" | "quarter" | "month";
type SheetType = "outlet" | "type" | "period" | null;

// ─── Data ─────────────────────────────────────────────────────────────────────

const OUTLETS = ["废气排放口02", "废气排放口01"];

const PERIODS: Record<PeriodType, string[]> = {
  year: ["2026年", "2025年", "2024年", "2023年"],
  quarter: [
    "2026年第二季度", "2026年第一季度",
    "2025年第四季度", "2025年第三季度", "2025年第二季度", "2025年第一季度",
  ],
  month: [
    "2026年05月", "2026年04月", "2026年03月", "2026年02月", "2026年01月",
    "2025年12月", "2025年11月", "2025年10月",
  ],
};

const TYPE_LABEL: Record<PeriodType, string> = { year: "年", quarter: "季度", month: "月" };

const DASH = "—";

// 每行 25 个数据列；占位用 "—" / "--" / 字符串（"--" 代表本月尚无数据）
type Row = [string, ...string[]];

const MONTHLY_DAILY: Row[] = [
  ["01日","1029.295","—","47.036","44.158","484.027","—","—","—","—","—","—","—","—","—","14.609","—","—","23.686","—","107.591","—","11.576","—","-0.417","—"],
  ["02日","1019.479","—","47.077","43.331","479.933","—","—","—","—","—","—","—","—","—","14.481","—","—","23.582","—","107.698","—","12.003","—","-0.423","—"],
  ["03日","1015.484","—","47.224","42.857","459.040","—","—","—","—","—","—","—","—","—","14.389","—","—","23.349","—","107.965","—","12.055","—","-0.420","—"],
  ["04日","864.682","—","38.477","42.789","326.358","—","—","—","—","—","—","—","—","—","15.605","—","—","19.005","—","103.474","—","10.557","—","0.292","—"],
  ["05日","861.917","—","39.660","42.816","341.824","—","—","—","—","—","—","—","—","—","15.442","—","—","19.443","—","103.474","—","10.455","—","-0.306","—"],
  ["06日","856.442","—","40.422","41.829","346.187","—","—","—","—","—","—","—","—","—","15.415","—","—","19.435","—","103.413","—","11.192","—","-0.312","—"],
  ["07日","853.696","—","40.261","43.243","343.806","—","—","—","—","—","—","—","—","—","15.414","—","—","19.396","—","104.108","—","11.325","—","-0.296","—"],
  ["08日","864.663","—","39.863","43.289","285.639","—","—","—","—","—","—","—","—","—","15.475","—","—","19.478","—","104.136","—","10.593","—","-0.307","—"],
  ["09日","861.129","—","41.409","42.981","311.624","—","—","—","—","—","—","—","—","—","15.236","—","—","19.986","—","104.431","—","11.005","—","-0.309","—"],
  ["10日","862.449","—","40.519","42.567","318.619","—","—","—","—","—","—","—","—","—","15.317","—","—","19.626","—","105.987","—","11.254","—","-0.306","—"],
  ["11日","860.569","—","40.505","42.014","348.582","—","—","—","—","—","—","—","—","—","15.297","—","—","19.626","—","105.987","—","11.254","—","-0.306","—"],
  ["12日","862.886","—","40.484","42.567","349.328","—","—","—","—","—","—","—","—","—","15.294","—","—","19.682","—","104.985","—","11.261","—","-0.306","—"],
  ["13日","861.695","—","41.033","45.320","353.574","—","—","—","—","—","—","—","—","—","15.317","—","—","19.649","—","105.813","—","11.286","—","-0.307","—"],
  ["14日","861.382","—","40.255","43.075","346.957","—","—","—","—","—","—","—","—","—","15.383","—","—","19.587","—","105.094","—","11.286","—","-0.307","—"],
  ["15日","861.091","—","41.033","43.075","346.957","—","—","—","—","—","—","—","—","—","15.393","—","—","19.587","—","105.094","—","11.286","—","-0.307","—"],
  ["16日","863.542","—","40.636","43.322","350.908","—","—","—","—","—","—","—","—","—","15.372","—","—","19.629","—","105.247","—","11.131","—","-0.308","—"],
  ["17日","—","—","__warn__有效数据不足","__warn__涉及因子无效","__warn__有效数据不足","__warn__涉及因子无效","__warn__有效数据不足","__warn__涉及因子无效","—","—","—","—","—","—","119.338","__warn__有效数据不足","—","9.476","__warn__有效数据不足","—","—","—","—","—","—"],
  ["18日","—","—","__warn__有效数据不足","__warn__涉及因子无效","__warn__有效数据不足","__warn__涉及因子无效","__warn__有效数据不足","__warn__涉及因子无效","—","—","—","—","—","—","53.232","__warn__有效数据不足","—","18.006","__warn__有效数据不足","__warn__有效数据不足","__warn__有效数据不足","__warn__有效数据不足","__warn__有效数据不足","__warn__有效数据不足","__warn__有效数据不足"],
  ["19日","862.316","—","40.827","42.463","352.026","—","—","—","—","—","—","—","—","—","15.231","—","—","19.496","—","104.243","—","10.894","—","-0.302","—"],
  ["20日","—","—","39.992","42.802","353.221","—","—","—","—","—","—","—","—","—","15.394","—","—","19.601","—","104.945","—","10.977","—","-0.309","—"],
  ["21日","853.221","—","40.920","43.319","353.221","—","—","—","—","—","—","—","—","—","15.338","—","—","19.586","—","105.938","—","11.048","—","-0.312","—"],
  ["22日","860.806","—","40.522","43.122","348.846","—","—","—","—","—","—","—","—","—","15.362","—","—","19.586","—","105.938","—","11.048","—","-0.312","—"],
  ["23日","877.888","—","39.276","42.449","344.756","—","—","—","—","—","—","—","—","—","15.448","—","—","20.114","—","105.988","—","10.731","—","-0.321","—"],
  ["24日","880.104","—","38.936","42.487","331.857","—","—","—","—","—","—","—","—","—","15.501","—","—","20.112","—","105.988","—","10.423","—","-0.321","—"],
  ["25日","879.854","—","40.149","43.069","353.212","—","—","—","—","—","—","—","—","—","15.407","—","—","19.804","—","103.993","—","10.543","—","-0.307","—"],
  ["26日","869.358","—","38.936","43.129","348.083","—","—","—","—","—","—","—","—","—","15.429","—","—","19.642","—","103.891","—","10.532","—","-0.307","—"],
  ["27日","866.797","—","40.989","43.708","355.281","—","—","—","—","—","—","—","—","—","15.373","—","—","19.585","—","103.785","—","10.938","—","-0.311","—"],
  ["28日","868.590","—","40.765","42.810","337.889","—","—","—","—","—","—","—","—","—","15.415","—","—","19.660","—","103.579","—","10.862","—","-0.309","—"],
  ["29日","874.020","—","40.792","43.823","313.146","—","—","—","—","—","—","—","—","—","15.415","—","—","19.714","—","104.009","—","10.726","—","-0.309","—"],
  ["30日","884.172","—","40.527","44.017","342.968","—","—","—","—","—","—","—","—","—","15.476","—","—","19.887","—","105.192","—","10.192","—","-0.320","—"],
];

const MONTHLY_SUMMARY: { cls: string; row: Row }[] = [
  { cls: "r-avg", row: ["平均值","39.345","44.702","41.026","43.102","41.026","43.102","15.550","15.289","—","—","—","—","—","—","20.034","102.67","105.1","10.751","11.028","-0.306","—","23.686","—","—","—"] },
  { cls: "r-max", row: ["最大值","1029.295","79.488","47.224","45.320","484.027","—","—","—","—","—","—","—","—","—","119.338","—","—","23.686","—","107.965","—","12.055","—","-0.292","—"] },
  { cls: "r-min", row: ["最小值","110.806","79.489","8.995","42.449","53.387","—","—","—","—","—","—","—","—","—","14.389","—","—","9.476","—","56.753","—","5.898","—","-0.423","—"] },
];

// 12 个月的基础数据（年报视图直接用全部 12 行；季度视图按季度切片；月视图独立用 MONTHLY_DAILY）
const MONTHLY_BASE: Row[] = [
  ["1月","36792.648","36663.048","41.026","43.102","484.027","—","—","—","—","—","—","—","—","—","18.234","—","—","21.340","—","106.200","—","11.820","—","-0.312","—"],
  ["2月","28514.320","28390.211","40.812","42.950","412.350","—","—","—","—","—","—","—","—","—","16.781","—","—","20.842","—","105.640","—","11.234","—","-0.305","—"],
  ["3月","31205.480","31082.340","40.210","42.640","396.720","—","—","—","—","—","—","—","—","—","17.453","—","—","20.456","—","105.180","—","11.456","—","-0.298","—"],
  ["4月","25235.242","25182.951","41.026","43.102","484.027","—","—","—","—","—","—","—","—","—","39.345","—","—","19.643","—","105.094","—","11.143","—","-0.307","—"],
  ["5月","11557.406","11480.097","40.022","42.518","395.640","—","—","—","—","—","—","—","—","—","36.132","—","—","20.034","—","104.158","—","12.003","—","-0.292","—"],
  ["6月","27894.530","27812.408","40.611","42.901","404.310","—","—","—","—","—","—","—","—","—","17.012","—","—","20.180","—","104.811","—","11.342","—","-0.301","—"],
  ["7月","33450.910","33332.140","41.388","43.220","438.940","—","—","—","—","—","—","—","—","—","18.105","—","—","20.760","—","105.382","—","11.640","—","-0.304","—"],
  ["8月","34780.225","34651.082","41.602","43.435","447.812","—","—","—","—","—","—","—","—","—","18.392","—","—","20.985","—","105.518","—","11.712","—","-0.305","—"],
  ["9月","30615.118","30498.701","40.918","42.890","415.220","—","—","—","—","—","—","—","—","—","17.642","—","—","20.508","—","105.038","—","11.502","—","-0.302","—"],
  ["10月","29013.487","28902.115","40.502","42.730","403.118","—","—","—","—","—","—","—","—","—","17.298","—","—","20.310","—","104.872","—","11.418","—","-0.300","—"],
  ["11月","27450.318","27340.812","40.215","42.531","389.405","—","—","—","—","—","—","—","—","—","16.985","—","—","20.105","—","104.610","—","11.328","—","-0.298","—"],
  ["12月","30912.564","30801.219","41.105","43.087","422.184","—","—","—","—","—","—","—","—","—","17.812","—","—","20.642","—","105.218","—","11.580","—","-0.303","—"],
];

// 月份索引 0..4（1-5 月）在当前年（2026）已有真实数据；6 月起仍未发生 → 视图层换成 "--"
const FUTURE_MONTH_IDX_2026 = 5; // 0-indexed; 5 = 6月

function placeholderMonthRow(monthIdx: number): Row {
  return [`${monthIdx + 1}月`, ...Array(25).fill("--")] as Row;
}

function placeholderDayRow(day: number): Row {
  return [`${String(day).padStart(2, "0")}日`, ...Array(25).fill("--")] as Row;
}

// ─── Period helpers ──────────────────────────────────────────────────────────

function parseYear(period: string): number {
  const m = period.match(/(\d{4})年/);
  return m ? Number(m[1]) : 2026;
}

function parseQuarter(period: string): { year: number; q: 1 | 2 | 3 | 4 } {
  const year = parseYear(period);
  if (period.includes("第一")) return { year, q: 1 };
  if (period.includes("第二")) return { year, q: 2 };
  if (period.includes("第三")) return { year, q: 3 };
  return { year, q: 4 };
}

function parseMonth(period: string): { year: number; month: number } {
  const year = parseYear(period);
  const m = period.match(/(\d{2})月/);
  return { year, month: m ? Number(m[1]) : 1 };
}

// 该月份是否「尚未发生」（仅对当前年 2026 的 6 月及以后判定 true）
function isFutureMonth(year: number, monthIdx0: number): boolean {
  return year === 2026 && monthIdx0 >= FUTURE_MONTH_IDX_2026;
}

// ─── Data scaling (让不同年/季度/月/排放口 显示不同的数值) ──────────────────

// 排放口 01 与 02 的全局缩放：01 偏低
function outletMultiplier(outlet: string): number {
  return outlet === "废气排放口01" ? 0.91 : 1.0;
}

// 年份缩放：越久远，污染因子越高（设备/管控逐年优化）
function yearMultiplier(year: number): number {
  if (year >= 2026) return 1.0;
  if (year === 2025) return 1.06;
  if (year === 2024) return 1.13;
  return 1.21;
}

function scaleNumStr(v: string, m: number): string {
  if (v === DASH || v === "--" || !v) return v;
  if (v.startsWith("__warn__")) return v;
  const num = Number(v);
  if (!Number.isFinite(num)) return v;
  const dotIdx = v.indexOf(".");
  const decimals = dotIdx >= 0 ? v.length - dotIdx - 1 : 0;
  return (num * m).toFixed(decimals);
}

function scaleRow(row: Row, m: number): Row {
  const [label, ...cols] = row;
  return [label, ...cols.map((v) => scaleNumStr(v, m))] as Row;
}

// 给定一组数据列（每行 25 列），计算平均/最大/最小 摘要行（按数值列）
function buildSummary(rows: Row[]): { cls: string; row: Row }[] {
  const colCount = 25;
  const stats = Array.from({ length: colCount }, () => ({ sum: 0, n: 0, max: -Infinity, min: Infinity, decimals: 0, anyNumber: false }));
  for (const r of rows) {
    for (let i = 0; i < colCount; i++) {
      const v = r[i + 1];
      if (!v || v === DASH || v === "--" || (typeof v === "string" && v.startsWith("__warn__"))) continue;
      const num = Number(v);
      if (!Number.isFinite(num)) continue;
      stats[i].sum += num;
      stats[i].n += 1;
      if (num > stats[i].max) stats[i].max = num;
      if (num < stats[i].min) stats[i].min = num;
      const dotIdx = v.indexOf(".");
      const dec = dotIdx >= 0 ? v.length - dotIdx - 1 : 0;
      if (dec > stats[i].decimals) stats[i].decimals = dec;
      stats[i].anyNumber = true;
    }
  }
  const fmt = (n: number, d: number) => n.toFixed(d);
  const avg = stats.map((s) => (s.anyNumber ? fmt(s.sum / s.n, s.decimals) : DASH));
  const max = stats.map((s) => (s.anyNumber ? fmt(s.max, s.decimals) : DASH));
  const min = stats.map((s) => (s.anyNumber ? fmt(s.min, s.decimals) : DASH));
  return [
    { cls: "r-avg", row: ["平均值", ...avg] as Row },
    { cls: "r-max", row: ["最大值", ...max] as Row },
    { cls: "r-min", row: ["最小值", ...min] as Row },
  ];
}

// 计算季度排放总量行（仅汇总「累计流量」「累计修正流量」与三个排放量列）
function buildQuarterTotal(rows: Row[]): { cls: string; row: Row } {
  const colCount = 25;
  // 索引 0..24 对应数据列；总量行只填特定几列
  const totalCols: string[] = Array(colCount).fill(DASH);
  const sumIdx = [0, 1, 4]; // 累计流量、累计修正流量、二氧化硫上限值排放量
  for (const i of sumIdx) {
    let s = 0;
    let dec = 0;
    let any = false;
    for (const r of rows) {
      const v = r[i + 1];
      if (!v || v === DASH || v === "--") continue;
      const num = Number(v);
      if (!Number.isFinite(num)) continue;
      s += num;
      any = true;
      const dotIdx = v.indexOf(".");
      const d = dotIdx >= 0 ? v.length - dotIdx - 1 : 0;
      if (d > dec) dec = d;
    }
    totalCols[i] = any ? s.toFixed(dec) : DASH;
  }
  return { cls: "r-total", row: ["季度排放总量（吨）", ...totalCols] as Row };
}

// 构建给定 outlet/period 的表格行
function buildRows(outlet: string, periodType: PeriodType, period: string): { cls?: string; row: Row }[] {
  const om = outletMultiplier(outlet);

  if (periodType === "year") {
    const year = parseYear(period);
    const ym = yearMultiplier(year);
    const m = om * ym;
    const monthRows: Row[] = MONTHLY_BASE.map((base, idx) => {
      if (isFutureMonth(year, idx)) return placeholderMonthRow(idx);
      return scaleRow(base, m);
    });
    const filled = monthRows.filter((r) => r[1] !== "--");
    return [
      ...monthRows.map((r) => ({ row: r })),
      ...buildSummary(filled),
    ];
  }

  if (periodType === "quarter") {
    const { year, q } = parseQuarter(period);
    const ym = yearMultiplier(year);
    const m = om * ym;
    const start = (q - 1) * 3;
    const monthRows: Row[] = [start, start + 1, start + 2].map((idx) => {
      if (isFutureMonth(year, idx)) return placeholderMonthRow(idx);
      return scaleRow(MONTHLY_BASE[idx], m);
    });
    const filled = monthRows.filter((r) => r[1] !== "--");
    return [
      ...monthRows.map((r) => ({ row: r })),
      ...buildSummary(filled),
      buildQuarterTotal(filled),
    ];
  }

  // month
  const { year, month } = parseMonth(period);
  const ym = yearMultiplier(year);
  const m = om * ym;
  if (isFutureMonth(year, month - 1)) {
    // 该月尚未发生：生成 30 行占位
    const days = Array.from({ length: 30 }, (_, i) => placeholderDayRow(i + 1));
    return [
      ...days.map((r) => ({ row: r })),
      { cls: "r-avg", row: ["平均值", ...Array(25).fill("--")] as Row },
      { cls: "r-max", row: ["最大值", ...Array(25).fill("--")] as Row },
      { cls: "r-min", row: ["最小值", ...Array(25).fill("--")] as Row },
    ];
  }
  const daily = MONTHLY_DAILY.map((r) => scaleRow(r, m));
  const summary = MONTHLY_SUMMARY.map((s) => ({ cls: s.cls, row: scaleRow(s.row, m) }));
  return [...daily.map((r) => ({ row: r })), ...summary];
}

// ─── Header column groups (data columns 1..25) ────────────────────────────────

const COL_TINTS: Record<string, { g1Bg: string; g1Fg: string; g23Bg: string; g23Fg: string }> = {
  flow: { g1Bg: "#ccfbf1", g1Fg: "#0f766e", g23Bg: "#ecfdf5", g23Fg: "#065f46" },
  so2:  { g1Bg: "#dbeafe", g1Fg: "#1e40af", g23Bg: "#eff6ff", g23Fg: "#1d4ed8" },
  nox:  { g1Bg: "#fce7f3", g1Fg: "#9d174d", g23Bg: "#fdf2f8", g23Fg: "#be185d" },
  nh3:  { g1Bg: "#fef3c7", g1Fg: "#92400e", g23Bg: "#fffbeb", g23Fg: "#b45309" },
  gas:  { g1Bg: "#f3e8ff", g1Fg: "#6b21a8", g23Bg: "#faf5ff", g23Fg: "#7c3aed" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderCell(v: string) {
  if (v === DASH) return <span style={{ color: "#b0bec5" }}>—</span>;
  if (v === "--") return <span style={{ color: "#b0bec5" }}>--</span>;
  if (v.startsWith("__warn__"))
    return <span style={{ color: "#d97706", fontSize: 10 }}>{v.slice(8)}</span>;
  return v;
}

function stripCell(v: string) {
  if (v.startsWith("__warn__")) return v.slice(8);
  return v;
}

// ─── Header (shared by all 3 views) ───────────────────────────────────────────

function Thead() {
  const g1: React.CSSProperties = { fontWeight: 600, fontSize: 10.5, lineHeight: 1.35 };
  const g2: React.CSSProperties = { fontWeight: 600, fontSize: 10.5, lineHeight: 1.35 };
  const g3: React.CSSProperties = { fontWeight: 600, fontSize: 10.5, lineHeight: 1.35 };
  const cell: React.CSSProperties = { border: "1px solid #dce3ed", padding: "6px 9px", textAlign: "center" };
  const tCell: React.CSSProperties = { ...cell, position: "sticky", left: 0, minWidth: 56, background: "#dbeafe", color: "#1a3a8a", zIndex: 8 };

  const flow = COL_TINTS.flow, so2 = COL_TINTS.so2, nox = COL_TINTS.nox, nh3 = COL_TINTS.nh3, gas = COL_TINTS.gas;

  return (
    <thead>
      <tr>
        <th style={tCell} rowSpan={3}>时间</th>
        <th colSpan={2} style={{ ...cell, ...g1, background: flow.g1Bg, color: flow.g1Fg }}>流量<br />（万标立方米）</th>
        <th colSpan={6} style={{ ...cell, ...g1, background: so2.g1Bg, color: so2.g1Fg }}>二氧化硫（毫克/立方米）</th>
        <th colSpan={6} style={{ ...cell, ...g1, background: nox.g1Bg, color: nox.g1Fg }}>氮氧化物（毫克/立方米）</th>
        <th colSpan={3} style={{ ...cell, ...g1, background: nh3.g1Bg, color: nh3.g1Fg }}>氨含量<br />（百分比）</th>
        <th colSpan={2} style={{ ...cell, ...g1, background: gas.g1Bg, color: gas.g1Fg }}>烟气流速<br />（米/秒）</th>
        <th colSpan={2} style={{ ...cell, ...g1, background: gas.g1Bg, color: gas.g1Fg }}>烟气温度<br />（摄氏度）</th>
        <th colSpan={2} style={{ ...cell, ...g1, background: gas.g1Bg, color: gas.g1Fg }}>烟气湿度<br />（百分比）</th>
        <th colSpan={2} style={{ ...cell, ...g1, background: gas.g1Bg, color: gas.g1Fg }}>烟气压力<br />（千帕）</th>
      </tr>
      <tr>
        <th rowSpan={2} style={{ ...cell, ...g2, background: flow.g23Bg, color: flow.g23Fg }}>累计流量</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: flow.g23Bg, color: flow.g23Fg }}>累计<br />修正流量</th>
        <th colSpan={3} style={{ ...cell, ...g2, background: so2.g23Bg, color: so2.g23Fg }}>上限值</th>
        <th colSpan={3} style={{ ...cell, ...g2, background: so2.g23Bg, color: so2.g23Fg }}>修正值</th>
        <th colSpan={3} style={{ ...cell, ...g2, background: nox.g23Bg, color: nox.g23Fg }}>上限值</th>
        <th colSpan={3} style={{ ...cell, ...g2, background: nox.g23Bg, color: nox.g23Fg }}>修正值</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: nh3.g23Bg, color: nh3.g23Fg }}>监测值</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: nh3.g23Bg, color: nh3.g23Fg }}>修正值</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: nh3.g23Bg, color: nh3.g23Fg }}>豁免值</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: gas.g23Bg, color: gas.g23Fg }}>监测值</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: gas.g23Bg, color: gas.g23Fg }}>修正值</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: gas.g23Bg, color: gas.g23Fg }}>监测值</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: gas.g23Bg, color: gas.g23Fg }}>修正值</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: gas.g23Bg, color: gas.g23Fg }}>监测值</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: gas.g23Bg, color: gas.g23Fg }}>修正值</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: gas.g23Bg, color: gas.g23Fg }}>监测值</th>
        <th rowSpan={2} style={{ ...cell, ...g2, background: gas.g23Bg, color: gas.g23Fg }}>修正值</th>
      </tr>
      <tr>
        {(["实测值", "折算值", "排放量（千克）"] as const).map((t, i) => (
          <th key={`so2u-${i}`} style={{ ...cell, ...g3, background: so2.g23Bg, color: so2.g23Fg }}>{t}</th>
        ))}
        {(["实测值", "度/邻后折算值", "排放量（千克）"] as const).map((t, i) => (
          <th key={`so2c-${i}`} style={{ ...cell, ...g3, background: so2.g23Bg, color: so2.g23Fg }}>{t}</th>
        ))}
        {(["实测值", "折算值", "排放量（千克）"] as const).map((t, i) => (
          <th key={`noxu-${i}`} style={{ ...cell, ...g3, background: nox.g23Bg, color: nox.g23Fg }}>{t}</th>
        ))}
        {(["实测值", "度/邻后折算值", "排放量（千克）"] as const).map((t, i) => (
          <th key={`noxc-${i}`} style={{ ...cell, ...g3, background: nox.g23Bg, color: nox.g23Fg }}>{t}</th>
        ))}
      </tr>
    </thead>
  );
}

function TableRow({ row, cls }: { row: Row; cls?: string }) {
  const [label, ...cols] = row;

  const isSummary = cls === "r-avg" || cls === "r-max" || cls === "r-min";
  const isTotal = cls === "r-total";

  const tdBase: React.CSSProperties = { border: "1px solid #dce3ed", padding: "6px 9px", textAlign: "center", color: "#1a1a1a", fontSize: 11 };
  const tdData: React.CSSProperties = {
    ...tdBase,
    background: isTotal ? "#e6f4ff" : isSummary ? "#f8faff" : "#fff",
  };
  const tdLabel: React.CSSProperties = {
    ...tdBase,
    position: "sticky", left: 0, zIndex: 6, minWidth: 56,
    fontWeight: isSummary || isTotal ? 700 : 600,
    background: isTotal ? "#bfdbfe" : isSummary ? "#eef2ff" : "#fafbff",
    color: isTotal ? "#1d4ed8" : isSummary ? "#3730a3" : "#374151",
    fontSize: isTotal ? 10 : 11,
    lineHeight: isTotal ? 1.3 : undefined,
    whiteSpace: "pre-line" as const,
  };

  return (
    <tr>
      <td style={tdLabel}>{label.replace("（吨）", "\n（吨）")}</td>
      {cols.map((v, i) => <td key={i} style={tdData}>{renderCell(v)}</td>)}
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportPage() {
  const router = useRouter();

  const [outlet, setOutlet] = useState(OUTLETS[0]);
  const [periodType, setPeriodType] = useState<PeriodType>("quarter");
  const [period, setPeriod] = useState(PERIODS.quarter[0]);

  const [sheet, setSheet] = useState<SheetType>(null);
  const [draftOutlet, setDraftOutlet] = useState(outlet);
  const [draftType, setDraftType] = useState<PeriodType>(periodType);
  const [draftPeriod, setDraftPeriod] = useState(period);

  function openSheet(s: SheetType) {
    setDraftOutlet(outlet);
    setDraftType(periodType);
    setDraftPeriod(period);
    setSheet(s);
  }

  function confirmOutlet() { setOutlet(draftOutlet); setSheet(null); }
  function confirmType()   {
    setPeriodType(draftType);
    const next = PERIODS[draftType][0];
    setPeriod(next);
    setSheet(null);
  }
  function confirmPeriod() { setPeriod(draftPeriod); setSheet(null); }

  const tableRows = useMemo(
    () => buildRows(outlet, periodType, period),
    [outlet, periodType, period],
  );

  function handleExport() {
    // 直接生成 CSV：Excel/WPS 双击即可打开，且不依赖任何外部资源（内网友好）
    const H1 = ["时间","流量（万标立方米）","","二氧化硫（毫克/立方米）","","","","","","氮氧化物（毫克/立方米）","","","","","","氨含量（百分比）","","","烟气流速（米/秒）","","烟气温度（摄氏度）","","烟气湿度（百分比）","","烟气压力（千帕）",""];
    const H2 = ["","累计流量","累计修正流量","SO₂上限值-实测值","SO₂上限值-折算值","SO₂上限值-排放量(kg)","SO₂修正值-实测值","SO₂修正值-折算值","SO₂修正值-排放量(kg)","NOx上限值-实测值","NOx上限值-折算值","NOx上限值-排放量(kg)","NOx修正值-实测值","NOx修正值-折算值","NOx修正值-排放量(kg)","NH₃-监测值","NH₃-修正值","NH₃-豁免值","流速-监测值","流速-修正值","温度-监测值","温度-修正值","湿度-监测值","湿度-修正值","压力-监测值","压力-修正值"];

    const escCell = (v: string) => {
      const s = stripCell(v).replace(/\r?\n/g, " ");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const csv = [H1, H2, ...tableRows.map(({ row }) => row.map(stripCell))]
      .map((r) => r.map(escCell).join(","))
      .join("\r\n");

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/report/export";
    form.style.display = "none";

    const csvField = document.createElement("input");
    csvField.type = "hidden";
    csvField.name = "csv";
    csvField.value = csv;
    form.appendChild(csvField);

    const nameField = document.createElement("input");
    nameField.type = "hidden";
    nameField.name = "filename";
    nameField.value = `监测报表_${outlet}_${period}.csv`;
    form.appendChild(nameField);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
        position: "relative",
        overflow: "hidden",
        paddingBottom: 14,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.4,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 200, height: 200,
          background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Nav */}
        <div style={{ position: "relative", zIndex: 1, height: 44, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", flexShrink: 0 }}>监测报表</span>
          <span style={{ flex: 1 }} />
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
            <Menu size={22} />
          </button>
        </div>

        {/* Outlet selector pill */}
        <div style={{ position: "relative", zIndex: 1, padding: "0 16px" }}>
          <button
            onClick={() => openSheet("outlet")}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.16)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              borderRadius: 24,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              color: "#fff",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            <span>{outlet}</span>
            <ChevronDown size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── Filter bar (sticky) ── */}
      <div style={{
        background: "#fff",
        padding: "9px 14px",
        display: "flex",
        gap: 8,
        alignItems: "center",
        borderBottom: "1px solid #ebeef2",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}>
        <button
          onClick={() => openSheet("type")}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "#f5f7fa",
            border: "1px solid #ebeef2",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 13, color: "#1a1a1a", fontWeight: 500,
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          {TYPE_LABEL[periodType]}
          <ChevronDown size={13} color="#8090a8" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => openSheet("period")}
          style={{
            flex: 1,
            display: "flex", alignItems: "center", gap: 4, justifyContent: "space-between",
            background: "#f5f7fa",
            border: "1px solid #ebeef2",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 13, color: "#1a1a1a", fontWeight: 500,
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          <span>{period}</span>
          <ChevronDown size={13} color="#8090a8" strokeWidth={2.5} />
        </button>
        <button
          onClick={handleExport}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "#e6f4ff",
            border: "1.5px solid #1677ff",
            borderRadius: 6,
            padding: "6px 12px",
            fontSize: 13, color: "#1677ff", fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          <Download size={13} />
          导出
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{ background: "#fff", overflowX: "auto", paddingBottom: 80 }}>
        <table style={{ borderCollapse: "collapse", whiteSpace: "nowrap", fontSize: 11, minWidth: "max-content" }}>
          <Thead />
          <tbody>
            {tableRows.map((r, i) => (
              <TableRow key={i} row={r.row} cls={"cls" in r ? r.cls : undefined} />
            ))}
          </tbody>
        </table>
      </div>

      <TabBar />

      {/* ── Bottom sheets ── */}
      {sheet && (
        <>
          <div
            onClick={() => setSheet(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.42)", zIndex: 200 }}
          />
          <div style={{
            position: "fixed", left: 0, right: 0, bottom: 0,
            background: "#fff", borderRadius: "18px 18px 0 0", zIndex: 201,
            maxHeight: "65%", display: "flex", flexDirection: "column",
            animation: "sheet-up 0.28s cubic-bezier(0.32,0.72,0,1)",
          }}>
            <style>{`@keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
            <div style={{ width: 36, height: 4, background: "#dce3ed", borderRadius: 2, margin: "10px auto 0", flexShrink: 0 }} />
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 20px 10px", borderBottom: "1px solid #f0f3f7", flexShrink: 0,
            }}>
              <span onClick={() => setSheet(null)} style={{ color: "#8090a8", fontSize: 15, cursor: "pointer", padding: 4 }}>取消</span>
              <span
                onClick={() => {
                  if (sheet === "outlet") confirmOutlet();
                  else if (sheet === "type") confirmType();
                  else if (sheet === "period") confirmPeriod();
                }}
                style={{ color: "#1677ff", fontSize: 15, fontWeight: 600, cursor: "pointer", padding: 4 }}
              >
                确认
              </span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {sheet === "outlet" && OUTLETS.map((o) => (
                <PickItem key={o} label={o} selected={draftOutlet === o} onClick={() => setDraftOutlet(o)} />
              ))}
              {sheet === "type" && (["year", "quarter", "month"] as const).map((t) => (
                <PickItem key={t} label={TYPE_LABEL[t]} selected={draftType === t} onClick={() => setDraftType(t)} />
              ))}
              {sheet === "period" && PERIODS[draftType].map((p) => (
                <PickItem key={p} label={p} selected={draftPeriod === p} onClick={() => setDraftPeriod(p)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PickItem({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "15px 20px",
        fontSize: selected ? 17 : 16,
        textAlign: "center",
        cursor: "pointer",
        color: selected ? "#1a1a1a" : "#8090a8",
        fontWeight: selected ? 700 : 400,
        borderBottom: "1px solid #f8f9fb",
      }}
    >
      {label}
    </div>
  );
}
