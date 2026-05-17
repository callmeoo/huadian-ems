"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import type { QuarterType } from "./types";

export type PeriodType = "year" | "quarter" | "month" | "range";

export interface PeriodValue {
  type: PeriodType;
  year: number;
  month: number;        // 1-12
  quarter: QuarterType; // Q1-Q4
  rangeStart: string;   // yyyy-MM-dd
  rangeEnd: string;
}

interface Props {
  value: PeriodValue;
  onChange: (v: PeriodValue) => void;
}

const QUARTER_OPTIONS: QuarterType[] = ["Q1", "Q2", "Q3", "Q4"];
const QUARTER_LABEL: Record<QuarterType, string> = {
  Q1: "第一季度", Q2: "第二季度", Q3: "第三季度", Q4: "第四季度",
};

function pad(n: number) { return String(n).padStart(2, "0"); }
function daysInMonth(y: number, m: number) { return new Date(y, m, 0).getDate(); }
function firstWeekday(y: number, m: number) {
  const d = new Date(y, m - 1, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function toDateStr(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

export function formatPeriodLabel(v: PeriodValue): string {
  switch (v.type) {
    case "year":    return `${v.year}年`;
    case "quarter": return `${v.year}年 ${v.quarter}`;
    case "month":   return `${v.year}年 ${pad(v.month)}月`;
    case "range":   return v.rangeStart === v.rangeEnd ? v.rangeStart : `${v.rangeStart} ~ ${v.rangeEnd}`;
  }
}

// 把 PeriodValue 解析为闭区间 [start, end]（yyyy-MM-dd）
export function toWindow(v: PeriodValue): [string, string] {
  if (v.type === "range") return [v.rangeStart, v.rangeEnd];
  if (v.type === "year") return [`${v.year}-01-01`, `${v.year}-12-31`];
  if (v.type === "month") {
    const last = daysInMonth(v.year, v.month);
    return [`${v.year}-${pad(v.month)}-01`, `${v.year}-${pad(v.month)}-${pad(last)}`];
  }
  // quarter
  const qStart: Record<QuarterType, number> = { Q1: 1, Q2: 4, Q3: 7, Q4: 10 };
  const s = qStart[v.quarter];
  const e = s + 2;
  const last = daysInMonth(v.year, e);
  return [`${v.year}-${pad(s)}-01`, `${v.year}-${pad(e)}-${pad(last)}`];
}

// ───────────────── Component ─────────────────

export default function PeriodPicker({ value, onChange }: Props) {
  const [valOpen, setValOpen] = useState(false);

  const label = formatPeriodLabel(value);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {/* 周期值按钮 */}
        <button
          onClick={() => setValOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "#fff", border: "1px solid #e0e7ef",
            borderRadius: 8, padding: "5px 10px",
            fontSize: 12, color: "#1a1a1a", fontWeight: 500,
            cursor: "pointer", whiteSpace: "nowrap",
            maxWidth: 200,
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
          {valOpen ? <ChevronUp size={12} color="#6b7a8c" /> : <ChevronDown size={12} color="#6b7a8c" />}
        </button>
      </div>

      {/* 周期值选择 sheet */}
      {valOpen && (
        <ValueSheet
          value={value}
          onConfirm={(v) => { onChange(v); setValOpen(false); }}
          onClose={() => setValOpen(false)}
        />
      )}
    </>
  );
}

// ───────────────── ValueSheet — 不同类型的选值面板 ─────────────────

function ValueSheet({ value, onConfirm, onClose }: {
  value: PeriodValue;
  onConfirm: (v: PeriodValue) => void;
  onClose: () => void;
}) {
  // pending state — 未点确认前不影响外部
  const [pending, setPending] = useState<PeriodValue>(value);

  // 切换类型时重置 pending
  useEffect(() => { setPending(value); }, [value]);

  const title =
    pending.type === "year" ? "选择年份" :
    pending.type === "quarter" ? "选择季度" :
    pending.type === "month" ? "选择年月" : "选择日期范围";

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }}
      />
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0,
        background: "#fff", borderRadius: "16px 16px 0 0",
        zIndex: 201, paddingBottom: 20, maxHeight: "82vh", overflowY: "auto",
      }}>
        {/* Header with 取消 / 标题 / 确认 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px 12px", borderBottom: "1px solid #ebeef2",
          position: "sticky", top: 0, background: "#fff", zIndex: 2,
        }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8090a8", fontSize: 15 }}>取消</button>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{title}</span>
          <button
            onClick={() => onConfirm(pending)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#1677ff", fontSize: 15, fontWeight: 600 }}
          >确认</button>
        </div>

        {/* 内容区 */}
        <div style={{ padding: "14px 18px 8px" }}>
          {pending.type !== "range" && (
            <YearStepper
              year={pending.year}
              onChange={(y) => setPending({ ...pending, year: y })}
            />
          )}

          {pending.type === "quarter" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              {QUARTER_OPTIONS.map((q) => {
                const active = pending.quarter === q;
                return (
                  <button
                    key={q}
                    onClick={() => setPending({ ...pending, quarter: q })}
                    style={{
                      background: active ? "#0d52c4" : "#f5f7fa",
                      color: active ? "#fff" : "#1a1a1a",
                      border: "none", borderRadius: 10,
                      padding: "12px 0", fontSize: 14,
                      fontWeight: active ? 600 : 400, cursor: "pointer",
                    }}
                  >
                    {QUARTER_LABEL[q]}
                  </button>
                );
              })}
            </div>
          )}

          {pending.type === "month" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const active = pending.month === m;
                return (
                  <button
                    key={m}
                    onClick={() => setPending({ ...pending, month: m })}
                    style={{
                      background: active ? "#0d52c4" : "#f5f7fa",
                      color: active ? "#fff" : "#1a1a1a",
                      border: "none", borderRadius: 10,
                      padding: "10px 0", fontSize: 13,
                      fontWeight: active ? 600 : 400, cursor: "pointer",
                    }}
                  >{m}月</button>
                );
              })}
            </div>
          )}

          {pending.type === "range" && (
            <RangeCalendar
              start={pending.rangeStart}
              end={pending.rangeEnd}
              onChange={(s, e) => setPending({ ...pending, rangeStart: s, rangeEnd: e })}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ───────────────── YearStepper（年份 ‹ year › ） ─────────────────

function YearStepper({ year, onChange }: { year: number; onChange: (y: number) => void }) {
  const maxYear = new Date().getFullYear();
  const atMax = year >= maxYear;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
      <button
        onClick={() => onChange(year - 1)}
        style={{ background: "#f5f7fa", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7a8c" }}
      ><ChevronLeft size={18} /></button>
      <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", minWidth: 80, textAlign: "center" }}>{year}年</span>
      <button
        onClick={() => !atMax && onChange(year + 1)}
        disabled={atMax}
        style={{ background: "#f5f7fa", border: "none", borderRadius: 8, width: 36, height: 36, cursor: atMax ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: atMax ? "#c9d4e3" : "#6b7a8c" }}
      ><ChevronRight size={18} /></button>
    </div>
  );
}

// ───────────────── RangeCalendar — 日期范围日历 ─────────────────

function RangeCalendar({ start, end, onChange }: { start: string; end: string; onChange: (s: string, e: string) => void }) {
  const [vy, setVy] = useState(() => start ? +start.slice(0, 4) : 2026);
  const [vm, setVm] = useState(() => start ? +start.slice(5, 7) : 1);
  const [sel1, setSel1] = useState(start);
  const [sel2, setSel2] = useState(end);
  const [phase, setPhase] = useState<"start" | "end">("start");

  function prev() { if (vm === 1) { setVy((y) => y - 1); setVm(12); } else setVm((m) => m - 1); }
  function next() { if (vm === 12) { setVy((y) => y + 1); setVm(1); } else setVm((m) => m + 1); }

  function tap(ds: string) {
    if (phase === "start") {
      setSel1(ds); setSel2(ds); setPhase("end"); onChange(ds, ds);
    } else {
      const s = ds < sel1 ? ds : sel1;
      const e = ds < sel1 ? sel1 : ds;
      setSel1(s); setSel2(e); setPhase("start"); onChange(s, e);
    }
  }

  const days = daysInMonth(vy, vm);
  const offset = firstWeekday(vy, vm);
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "4px 0 8px" }}>
        <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", color: "#1677ff", display: "flex" }}><ChevronLeft size={20} /></button>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", minWidth: 110, textAlign: "center" }}>{vy}年{pad(vm)}月</span>
        <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", color: "#1677ff", display: "flex" }}><ChevronRight size={20} /></button>
      </div>
      <div style={{ textAlign: "center", fontSize: 11, color: "#8090a8", marginBottom: 10 }}>
        {phase === "start" ? "选择开始日期" : `开始：${sel1} · 再选结束日期`}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 }}>
        {["一","二","三","四","五","六","日"].map((w) => (
          <div key={w} style={{ textAlign: "center", fontSize: 12, color: "#8090a8", padding: "4px 0" }}>{w}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "3px 0" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const ds = toDateStr(vy, vm, day);
          const isStart = ds === sel1;
          const isEnd = ds === sel2;
          const inRange = sel1 && sel2 && ds > sel1 && ds < sel2;
          return (
            <div key={i} onClick={() => tap(ds)} style={{ textAlign: "center", cursor: "pointer", background: inRange ? "#e6f4ff" : "transparent" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", margin: "0 auto",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: (isStart || isEnd) ? "#1677ff" : "transparent",
                fontSize: 14, fontWeight: (isStart || isEnd) ? 700 : 400,
                color: (isStart || isEnd) ? "#fff" : "#1a1a1a",
              }}>{day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
