"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronDown, ChevronUp, ChevronRight, Menu, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import TabBar from "@/components/layout/TabBar";

type PeriodType = "hour" | "month" | "quarter" | "year";

// ── Utils ────────────────────────────────────────────────────────────────────

function pad(n: number) { return String(n).padStart(2, "0"); }
function daysInMonth(y: number, m: number) { return new Date(y, m, 0).getDate(); }
function firstWeekday(y: number, m: number) { const d = new Date(y, m - 1, 1).getDay(); return d === 0 ? 6 : d - 1; }
function toDateStr(y: number, m: number, d: number) { return `${y}-${pad(m)}-${pad(d)}`; }
function seeded(s: number) { const x = Math.sin(s + 12.9898) * 43758.5453; return x - Math.floor(x); }

// ── Constants ─────────────────────────────────────────────────────────────────

const PERIOD_LABELS: Record<PeriodType, string> = { hour: "时段", month: "月", quarter: "季度", year: "年" };
const YEARS = Array.from({ length: 7 }, (_, i) => String(2020 + i));
const MONTHS_LIST = Array.from({ length: 12 }, (_, i) => pad(i + 1));
const QUARTERS_LIST = ["第一季度", "第二季度", "第三季度", "第四季度"];
const THRESHOLD = 95;
const POINTS = [
  "废气排放口01 · 氮氧化物", "废气排放口01 · 二氧化硫", "废气排放口01 · 烟尘",
  "废气排放口02 · 氮氧化物", "废气排放口02 · 二氧化硫", "废气排放口02 · 烟尘",
];

// ── Data ─────────────────────────────────────────────────────────────────────

function genRates(type: PeriodType, y: number, m: number, q: number, hs: string) {
  const seed = type === "hour" ? new Date(hs).getTime() / 86400000
    : type === "month" ? y * 100 + m
    : type === "quarter" ? y * 10 + q
    : y;
  const oi = 91 + seeded(seed) * 8;
  return {
    overall: { instant: oi, filled: Math.min(99.9, oi + seeded(seed + 1) * 3) },
    points: POINTS.map((name, i) => ({
      name,
      instant: 88 + seeded(seed + i + 2) * 11,
      filled: Math.min(99.9, 91 + seeded(seed + i + 3) * 8),
    })),
  };
}

function displayValue(type: PeriodType, hs: string, he: string, y: number, m: number, q: number) {
  if (type === "hour")    return hs === he ? hs : `${hs} 至 ${he}`;
  if (type === "month")   return `${y}年${pad(m)}月`;
  if (type === "quarter") return `${y}年 ${QUARTERS_LIST[q - 1]}`;
  return `${y}年`;
}

// ── DrumPicker ────────────────────────────────────────────────────────────────

const ITEM_H = 44;

function DrumPicker({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  const allItems = useMemo(() => ["", "", ...items, "", ""], [items]);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scrollTo = useCallback((realIdx: number) => {
    if (ref.current) ref.current.scrollTop = realIdx * ITEM_H;
  }, []);

  useEffect(() => {
    const idx = items.indexOf(value);
    if (idx >= 0) scrollTo(idx);
  }, [value, items, scrollTo]);

  function onScroll() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!ref.current) return;
      const idx = Math.max(0, Math.min(items.length - 1, Math.round(ref.current.scrollTop / ITEM_H)));
      ref.current.scrollTop = idx * ITEM_H;
      onChange(items[idx]);
    }, 120);
  }

  return (
    <div style={{ position: "relative", height: ITEM_H * 5, flex: 1, overflow: "hidden", minWidth: 80 }}>
      <div style={{ position: "absolute", top: ITEM_H * 2, left: 6, right: 6, height: ITEM_H, background: "#f0f3f7", borderRadius: 8, pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: ITEM_H * 2, background: "linear-gradient(to bottom,rgba(255,255,255,1),rgba(255,255,255,0))", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: ITEM_H * 2, background: "linear-gradient(to top,rgba(255,255,255,1),rgba(255,255,255,0))", zIndex: 2, pointerEvents: "none" }} />
      <div ref={ref} onScroll={onScroll} className="drum-scroll" style={{ height: "100%", overflowY: "scroll", scrollSnapType: "y mandatory", scrollbarWidth: "none" }}>
        {allItems.map((item, i) => (
          <div key={i}
            onClick={() => { if (!item) return; const ri = i - 2; if (ri >= 0 && ri < items.length) { onChange(item); scrollTo(ri); } }}
            style={{ height: ITEM_H, display: "flex", alignItems: "center", justifyContent: "center", scrollSnapAlign: "start", fontSize: 16, fontWeight: item === value ? 700 : 400, color: item === value ? "#1a1a1a" : "#8090a8", cursor: item ? "pointer" : "default", userSelect: "none", position: "relative", zIndex: 3 }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CalendarPicker ────────────────────────────────────────────────────────────

function CalendarPicker({ start, end, onChange }: { start: string; end: string; onChange: (s: string, e: string) => void }) {
  const now = new Date();
  const [vy, setVy] = useState(now.getFullYear());
  const [vm, setVm] = useState(now.getMonth() + 1);
  const [sel1, setSel1] = useState(start);
  const [sel2, setSel2] = useState(end);
  const [phase, setPhase] = useState<"start" | "end">("start");

  function prev() {
    if (vm === 1) { setVy(y => y - 1); setVm(12); } else { setVm(m => m - 1); }
  }
  function next() {
    if (vm === 12) { setVy(y => y + 1); setVm(1); } else { setVm(m => m + 1); }
  }

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
  const todayStr = toDateStr(now.getFullYear(), now.getMonth() + 1, now.getDate());

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "14px 0 8px" }}>
        <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", color: "#1677ff", display: "flex" }}><ChevronLeft size={20} /></button>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", minWidth: 110, textAlign: "center" }}>{vy}年{pad(vm)}月</span>
        <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", color: "#1677ff", display: "flex" }}><ChevronRight size={20} /></button>
      </div>
      <div style={{ textAlign: "center", fontSize: 11, color: "#8090a8", marginBottom: 10 }}>
        {phase === "start" ? "选择开始日期" : `开始：${sel1} · 再选结束日期`}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 }}>
        {["一","二","三","四","五","六","日"].map(w => (
          <div key={w} style={{ textAlign: "center", fontSize: 12, color: "#8090a8", padding: "4px 0" }}>{w}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "3px 0" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const ds = toDateStr(vy, vm, day);
          const isStart = ds === sel1, isEnd = ds === sel2;
          const inRange = sel1 && sel2 && ds > sel1 && ds < sel2;
          const isToday = ds === todayStr;
          return (
            <div key={i} onClick={() => tap(ds)} style={{ textAlign: "center", cursor: "pointer", background: inRange ? "#e6f4ff" : "transparent" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: (isStart || isEnd) ? "#1677ff" : "transparent", fontSize: 14, fontWeight: (isStart || isEnd || isToday) ? 700 : 400, color: (isStart || isEnd) ? "#fff" : isToday ? "#1677ff" : "#1a1a1a" }}>
                {day}
              </div>
              {(isStart || isEnd) && (
                <div style={{ fontSize: 9, color: "#1677ff", lineHeight: 1.3 }}>
                  {isStart && isEnd ? "开始/结束" : isStart ? "开始" : "结束"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── RateBar ───────────────────────────────────────────────────────────────────

function RateBar({ value, color }: { value: number; color: string }) {
  const warn = value < THRESHOLD;
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#f0f3f7", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, value)}%`, height: "100%", background: warn ? "#fa8c16" : color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: warn ? "#fa8c16" : "#1a1a1a", minWidth: 44, textAlign: "right" }}>{value.toFixed(1)}%</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GaugePage() {
  const router = useRouter();

  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const [hourStart, setHourStart] = useState("2026-05-16");
  const [hourEnd,   setHourEnd]   = useState("2026-05-16");
  const [year,    setYear]    = useState(2026);
  const [month,   setMonth]   = useState(5);
  const [quarter, setQuarter] = useState(2);

  const [typeOpen,   setTypeOpen]   = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // pending (uncommitted picker state)
  const [pYear,    setPYear]    = useState("2026");
  const [pMonth,   setPMonth]   = useState("05");
  const [pQuarter, setPQuarter] = useState(2);
  const [pHs, setPHs] = useState(hourStart);
  const [pHe, setPHe] = useState(hourEnd);

  function openPicker() {
    setPYear(String(year)); setPMonth(pad(month)); setPQuarter(quarter);
    setPHs(hourStart); setPHe(hourEnd);
    setPickerOpen(true);
  }

  function confirm() {
    if (periodType === "hour")    { setHourStart(pHs); setHourEnd(pHe); }
    if (periodType === "month")   { setYear(+pYear); setMonth(+pMonth); }
    if (periodType === "quarter") { setYear(+pYear); setQuarter(pQuarter); }
    if (periodType === "year")    { setYear(+pYear); }
    setPickerOpen(false);
  }

  const label = displayValue(periodType, hourStart, hourEnd, year, month, quarter);
  const data  = useMemo(() => genRates(periodType, year, month, quarter, hourStart), [periodType, year, month, quarter, hourStart]);

  const pickerTitle = periodType === "hour" ? "选择日期" : periodType === "month" ? "选择年月" : periodType === "quarter" ? "选择季度" : "选择年份";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", fontFamily: "-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif" }}>
      <style>{`.drum-scroll::-webkit-scrollbar{display:none}`}</style>

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(160deg,#0062d4 0%,#007AFF 55%,#2ca5ff 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(100,200,255,0.22) 1px,transparent 1px)", backgroundSize: "22px 22px", opacity: 0.4, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -80, left: -60, width: 280, height: 280, background: "radial-gradient(circle,rgba(50,150,255,0.18) 0%,transparent 70%)", pointerEvents: "none" }} />

        {/* Nav */}
        <div style={{ position: "relative", zIndex: 1, height: 44, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex" }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#fff", flexShrink: 0 }}>有效传输率</span>
          <span style={{ flex: 1 }} />
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex" }}>
            <Menu size={20} color="rgba(255,255,255,0.75)" />
          </button>
        </div>

        {/* Filter row */}
        <div style={{ position: "relative", zIndex: 1, padding: "8px 14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setTypeOpen(true)} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "7px 13px", color: "#fff", fontSize: 13, cursor: "pointer", flexShrink: 0 }}>
            {PERIOD_LABELS[periodType]} <ChevronDown size={13} />
          </button>
          <button onClick={openPicker} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "7px 14px", color: "#fff", fontSize: 13, cursor: "pointer" }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
            {pickerOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "14px 14px 80px" }}>

        {/* Overall */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "16px 16px 18px", boxShadow: "0 2px 8px rgba(10,69,149,0.06)", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
            <span style={{ width: 3, height: 14, background: "linear-gradient(180deg,#1677ff,#0d52c4)", borderRadius: 2, display: "inline-block" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>综合传输率</span>
            <span style={{ fontSize: 11, color: "#8090a8", marginLeft: 4 }}>统计周期：{label}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "即时传输率", value: data.overall.instant, color: "#1677ff" },
              { label: "补全传输率", value: data.overall.filled,  color: "#389e0d" },
            ].map(({ label: l, value, color }) => {
              const warn = value < THRESHOLD;
              return (
                <div key={l} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 14px" }}>
                  <div style={{ fontSize: 12, color: "#6b7a8c", marginBottom: 6 }}>{l}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: warn ? "#fa8c16" : color, lineHeight: 1 }}>
                    {value.toFixed(2)}<span style={{ fontSize: 14, fontWeight: 500 }}>%</span>
                  </div>
                  {warn && <div style={{ fontSize: 11, color: "#fa8c16", marginTop: 3 }}>⚠ 低于 {THRESHOLD}% 基准</div>}
                  <div style={{ marginTop: 10, height: 5, background: "#e8eef5", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, value)}%`, height: "100%", background: warn ? "#fa8c16" : color, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Points */}
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px rgba(10,69,149,0.06)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "14px 16px 12px", borderBottom: "1px solid #f0f3f7" }}>
            <span style={{ width: 3, height: 14, background: "linear-gradient(180deg,#1677ff,#0d52c4)", borderRadius: 2, display: "inline-block" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>监控点明细</span>
          </div>
          {data.points.map((pt, i) => (
            <div key={pt.name} style={{ padding: "13px 16px", borderBottom: i < data.points.length - 1 ? "1px solid #f0f3f7" : "none" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 10 }}>{pt.name}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#8090a8", minWidth: 52 }}>即时传输</span>
                  <RateBar value={pt.instant} color="#1677ff" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#8090a8", minWidth: 52 }}>补全传输</span>
                  <RateBar value={pt.filled} color="#389e0d" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Period type sheet ── */}
      {typeOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }} onClick={() => setTypeOpen(false)} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "16px 16px 0 0", zIndex: 101, paddingBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px", borderBottom: "1px solid #ebeef2" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>统计周期类型</span>
              <button onClick={() => setTypeOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8090a8", display: "flex" }}><X size={20} /></button>
            </div>
            {(["hour", "month", "quarter", "year"] as PeriodType[]).map((t) => (
              <div key={t} onClick={() => { setPeriodType(t); setTypeOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", fontSize: 15, color: periodType === t ? "#1677ff" : "#1a1a1a", fontWeight: periodType === t ? 600 : 400, background: periodType === t ? "#f0f7ff" : "#fff", borderBottom: "1px solid #f5f7fa", cursor: "pointer" }}>
                {PERIOD_LABELS[t]}
                {periodType === t && <Check size={18} color="#1677ff" />}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Date picker sheet ── */}
      {pickerOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }} onClick={() => setPickerOpen(false)} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "16px 16px 0 0", zIndex: 101, paddingBottom: 20, maxHeight: "82vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px", borderBottom: "1px solid #ebeef2", position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
              <button onClick={() => setPickerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8090a8", fontSize: 15 }}>取消</button>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{pickerTitle}</span>
              <button onClick={confirm} style={{ background: "none", border: "none", cursor: "pointer", color: "#1677ff", fontSize: 15, fontWeight: 600 }}>确认</button>
            </div>

            {periodType === "hour" && (
              <CalendarPicker start={pHs} end={pHe} onChange={(s, e) => { setPHs(s); setPHe(e); }} />
            )}

            {periodType !== "hour" && (
              <div style={{ display: "flex", padding: "8px 24px 0" }}>
                <DrumPicker items={YEARS} value={pYear} onChange={setPYear} />
                {periodType === "month" && (
                  <DrumPicker items={MONTHS_LIST} value={pMonth} onChange={setPMonth} />
                )}
                {periodType === "quarter" && (
                  <DrumPicker
                    items={QUARTERS_LIST}
                    value={QUARTERS_LIST[pQuarter - 1]}
                    onChange={(v) => setPQuarter(QUARTERS_LIST.indexOf(v) + 1)}
                  />
                )}
              </div>
            )}
          </div>
        </>
      )}

      <TabBar />
    </div>
  );
}
