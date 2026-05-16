"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, Menu, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import TabBar from "@/components/layout/TabBar";

type TabKey = "all" | "abnormal" | "over" | "limit" | "missing";
type PointKey = "all" | "outlet02" | "outlet01";

interface AnomalyRecord {
  id: number;
  point: "废气排放口02" | "废气排放口01";
  pollutant: string;
  dataType: string;
  value: string;
  limit: string;
  exceedRatio: string;
  time: string;
  type: "over" | "abnormal";
}

interface DateRange {
  startDate: string;
  endDate: string;
}

const ALL_RECORDS: AnomalyRecord[] = [
  { id: 1,  point: "废气排放口02", pollutant: "氮氧化物", dataType: "小时", value: "120.662 mg/m³", limit: "100 mg/m³", exceedRatio: "+20.7%", time: "2026-05-03 14:00", type: "over" },
  { id: 2,  point: "废气排放口02", pollutant: "氮氧化物", dataType: "小时", value: "102.157 mg/m³", limit: "100 mg/m³", exceedRatio: "+2.2%",  time: "2026-05-03 13:00", type: "over" },
  { id: 3,  point: "废气排放口02", pollutant: "氮氧化物", dataType: "小时", value: "1809.97 mg/m³", limit: "100 mg/m³", exceedRatio: "+1710%", time: "2026-05-02 09:00", type: "over" },
  { id: 4,  point: "废气排放口02", pollutant: "氮氧化物", dataType: "小时", value: "163.43 mg/m³",  limit: "100 mg/m³", exceedRatio: "+63.4%", time: "2026-05-02 08:00", type: "over" },
  { id: 5,  point: "废气排放口02", pollutant: "氮氧化物", dataType: "小时", value: "114.663 mg/m³", limit: "100 mg/m³", exceedRatio: "+14.7%", time: "2026-05-01 22:00", type: "over" },
  { id: 6,  point: "废气排放口02", pollutant: "烟尘",     dataType: "小时", value: "-0.003 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-03 16:00", type: "abnormal" },
  { id: 7,  point: "废气排放口02", pollutant: "二氧化硫", dataType: "小时", value: "-0.017 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-03 16:00", type: "abnormal" },
  { id: 8,  point: "废气排放口02", pollutant: "烟尘",     dataType: "小时", value: "-0.012 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-03 15:00", type: "abnormal" },
  { id: 9,  point: "废气排放口02", pollutant: "二氧化硫", dataType: "小时", value: "-0.005 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-03 15:00", type: "abnormal" },
  { id: 10, point: "废气排放口01", pollutant: "烟尘",     dataType: "小时", value: "0.000 mg/m³",   limit: "—", exceedRatio: "—", time: "2026-05-03 12:00", type: "abnormal" },
  { id: 11, point: "废气排放口01", pollutant: "二氧化硫", dataType: "小时", value: "0.000 mg/m³",   limit: "—", exceedRatio: "—", time: "2026-05-03 12:00", type: "abnormal" },
  { id: 12, point: "废气排放口01", pollutant: "氮氧化物", dataType: "小时", value: "0.000 mg/m³",   limit: "—", exceedRatio: "—", time: "2026-05-03 12:00", type: "abnormal" },
  { id: 13, point: "废气排放口02", pollutant: "烟尘",     dataType: "小时", value: "-0.008 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-03 11:00", type: "abnormal" },
  { id: 14, point: "废气排放口02", pollutant: "二氧化硫", dataType: "小时", value: "-0.021 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-03 10:00", type: "abnormal" },
  { id: 15, point: "废气排放口01", pollutant: "烟尘",     dataType: "小时", value: "-0.001 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-02 14:00", type: "abnormal" },
  { id: 16, point: "废气排放口01", pollutant: "二氧化硫", dataType: "小时", value: "0.000 mg/m³",   limit: "—", exceedRatio: "—", time: "2026-05-03 08:00", type: "abnormal" },
  { id: 17, point: "废气排放口02", pollutant: "烟尘",     dataType: "小时", value: "-0.006 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-02 22:00", type: "abnormal" },
  { id: 18, point: "废气排放口02", pollutant: "二氧化硫", dataType: "小时", value: "-0.009 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-02 21:00", type: "abnormal" },
  { id: 19, point: "废气排放口01", pollutant: "烟尘",     dataType: "小时", value: "0.000 mg/m³",   limit: "—", exceedRatio: "—", time: "2026-05-02 20:00", type: "abnormal" },
  { id: 20, point: "废气排放口01", pollutant: "氮氧化物", dataType: "小时", value: "0.000 mg/m³",   limit: "—", exceedRatio: "—", time: "2026-05-02 19:00", type: "abnormal" },
  { id: 21, point: "废气排放口02", pollutant: "烟尘",     dataType: "小时", value: "-0.004 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-02 18:00", type: "abnormal" },
  { id: 22, point: "废气排放口02", pollutant: "二氧化硫", dataType: "小时", value: "-0.011 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-02 17:00", type: "abnormal" },
  { id: 23, point: "废气排放口01", pollutant: "烟尘",     dataType: "小时", value: "-0.002 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-02 14:00", type: "abnormal" },
  { id: 24, point: "废气排放口01", pollutant: "二氧化硫", dataType: "小时", value: "0.000 mg/m³",   limit: "—", exceedRatio: "—", time: "2026-05-02 13:00", type: "abnormal" },
  { id: 25, point: "废气排放口02", pollutant: "烟尘",     dataType: "小时", value: "-0.007 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-02 11:00", type: "abnormal" },
  { id: 26, point: "废气排放口02", pollutant: "氮氧化物", dataType: "小时", value: "-0.003 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-01 23:00", type: "abnormal" },
  { id: 27, point: "废气排放口01", pollutant: "烟尘",     dataType: "小时", value: "0.000 mg/m³",   limit: "—", exceedRatio: "—", time: "2026-05-01 21:00", type: "abnormal" },
  { id: 28, point: "废气排放口01", pollutant: "二氧化硫", dataType: "小时", value: "-0.001 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-01 20:00", type: "abnormal" },
  { id: 29, point: "废气排放口02", pollutant: "烟尘",     dataType: "小时", value: "-0.005 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-01 19:00", type: "abnormal" },
  { id: 30, point: "废气排放口02", pollutant: "二氧化硫", dataType: "小时", value: "-0.014 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-01 18:00", type: "abnormal" },
  { id: 31, point: "废气排放口01", pollutant: "氮氧化物", dataType: "小时", value: "0.000 mg/m³",   limit: "—", exceedRatio: "—", time: "2026-05-01 17:00", type: "abnormal" },
  { id: 32, point: "废气排放口01", pollutant: "烟尘",     dataType: "小时", value: "-0.002 mg/m³",  limit: "—", exceedRatio: "—", time: "2026-05-01 16:00", type: "abnormal" },
  { id: 33, point: "废气排放口01", pollutant: "二氧化硫", dataType: "小时", value: "0.000 mg/m³",   limit: "—", exceedRatio: "—", time: "2026-05-01 15:00", type: "abnormal" },
];

const PAGE_SIZE = 10;

const TAB_CFG = [
  { key: "all"      as TabKey, label: "全部(条)", numColor: "#1677ff", activeBg: "#e8f0fe", underline: "#1677ff" },
  { key: "abnormal" as TabKey, label: "异常",     numColor: "#fa8c16", activeBg: "#fff7e6", underline: "#fa8c16", dot: "#fa8c16" },
  { key: "over"     as TabKey, label: "超标",     numColor: "#f5222d", activeBg: "#fff0f0", underline: "#f5222d", dot: "#f5222d" },
  { key: "limit"    as TabKey, label: "超限值",   numColor: "#f5222d", activeBg: "#fff0f0", underline: "#f5222d", dot: "#f5222d" },
  { key: "missing"  as TabKey, label: "缺失",     numColor: "#8090a8", activeBg: "#f5f5f5", underline: "#8090a8", dot: "#8090a8" },
];

// ─── Calendar helpers ────────────────────────────────────────────────────────

const MONTH_NAMES = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const DAY_HEADERS = ["一","二","三","四","五","六","日"];

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayMon(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }
function fmtDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function cmpDate(a: string, b: string) { return a < b ? -1 : a > b ? 1 : 0; }
function genMonths(fy: number, fm: number, ty: number, tm: number) {
  const arr: { year: number; month: number }[] = [];
  let y = fy, m = fm;
  while (y < ty || (y === ty && m <= tm)) {
    arr.push({ year: y, month: m });
    if (++m > 11) { m = 0; y++; }
  }
  return arr;
}

// ─── CalendarModal ───────────────────────────────────────────────────────────

function CalendarModal({ draft, setDraft, onConfirm, onClose }: {
  draft: DateRange;
  setDraft: (d: DateRange) => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [picking, setPicking] = useState<"start" | "end">("start");
  const calBodyRef = useRef<HTMLDivElement>(null);
  const months = genMonths(2026, 0, 2026, 4);

  useEffect(() => {
    if (!calBodyRef.current) return;
    const [y, m] = draft.endDate.split("-").map(Number);
    const monthIdx = months.findIndex(({ year, month }) => year === y && month === m - 1);
    if (monthIdx >= 0) {
      setTimeout(() => { if (calBodyRef.current) calBodyRef.current.scrollTop = monthIdx * 330; }, 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDayClick(ds: string) {
    if (picking === "start") {
      setDraft({ startDate: ds, endDate: ds });
      setPicking("end");
    } else {
      if (cmpDate(ds, draft.startDate) < 0) {
        setDraft({ startDate: ds, endDate: ds });
      } else {
        setDraft({ ...draft, endDate: ds });
        setPicking("start");
      }
    }
  }

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100 }} onClick={onClose} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "16px 16px 0 0", zIndex: 101, animation: "sheet-up 0.25s ease", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px", borderBottom: "1px solid #ebeef2", flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>选择日期</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8090a8", padding: 4, display: "flex", alignItems: "center" }}>
            <X size={18} />
          </button>
        </div>

        {/* Date range selectors */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid #ebeef2", flexShrink: 0 }}>
          <button
            onClick={() => setPicking("start")}
            style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${picking === "start" ? "#1677ff" : "#ebeef2"}`, background: picking === "start" ? "#f0f7ff" : "#f5f7fa", color: picking === "start" ? "#1677ff" : "#1a1a1a", fontSize: 13, display: "flex", alignItems: "center", cursor: "pointer" }}>
            <span style={{ flex: 1, textAlign: "left" }}>{draft.startDate.replace(/-/g, "/")}</span>
          </button>
          <span style={{ color: "#8090a8", fontSize: 13, flexShrink: 0 }}>至</span>
          <button
            onClick={() => setPicking("end")}
            style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${picking === "end" ? "#1677ff" : "#ebeef2"}`, background: picking === "end" ? "#f0f7ff" : "#f5f7fa", color: picking === "end" ? "#1677ff" : "#1a1a1a", fontSize: 13, display: "flex", alignItems: "center", cursor: "pointer" }}>
            <span style={{ flex: 1, textAlign: "left" }}>{draft.endDate.replace(/-/g, "/")}</span>
          </button>
        </div>

        {/* Day-of-week header */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "8px 14px 4px", borderBottom: "1px solid #f0f3f7", flexShrink: 0 }}>
          {DAY_HEADERS.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 12, color: "#8090a8", fontWeight: 500 }}>{d}</div>
          ))}
        </div>

        {/* Calendar body */}
        <div ref={calBodyRef} style={{ overflowY: "auto", flex: 1 }}>
          {months.map(({ year, month }) => (
            <div key={`${year}-${month}`} style={{ padding: "0 14px 8px" }}>
              <div style={{ textAlign: "center", padding: "14px 0 8px", fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                {year}年{MONTH_NAMES[month]}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px 0" }}>
                {Array.from({ length: firstDayMon(year, month) }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth(year, month) }).map((_, i) => {
                  const day = i + 1;
                  const ds = fmtDate(year, month, day);
                  const isStart = ds === draft.startDate;
                  const isEnd = ds === draft.endDate;
                  const single = draft.startDate === draft.endDate;
                  const inRange = cmpDate(ds, draft.startDate) >= 0 && cmpDate(ds, draft.endDate) <= 0;
                  return (
                    <div key={day} onClick={() => handleDayClick(ds)}
                      style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 46, cursor: "pointer" }}>
                      {inRange && !single && (
                        <div style={{ position: "absolute", top: "22%", bottom: "22%", left: isStart ? "50%" : 0, right: isEnd ? "50%" : 0, background: "#dbeafe", zIndex: 0 }} />
                      )}
                      <div style={{ position: "relative", zIndex: 1, width: 34, height: 34, borderRadius: "50%", background: (isStart || isEnd) ? "#1677ff" : "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 14, fontWeight: (isStart || isEnd) ? 700 : 400, color: (isStart || isEnd) ? "#fff" : "#1a1a1a", lineHeight: 1 }}>{day}</span>
                        {(isStart || isEnd) && (
                          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.9)", lineHeight: 1, marginTop: 1 }}>
                            {single ? "开始/结束" : isStart ? "开始" : "结束"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Confirm */}
        <div style={{ padding: "12px 16px 24px", borderTop: "1px solid #ebeef2", flexShrink: 0 }}>
          <button onClick={onConfirm}
            style={{ width: "100%", padding: "13px", borderRadius: 12, background: "#1677ff", color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>
            确定
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Arrow ───────────────────────────────────────────────────────────────────

function Arrow({ open, dark }: { open: boolean; dark?: boolean }) {
  return (
    <span style={{ display: "inline-block", width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: `5px solid ${dark ? "#8090a8" : "rgba(255,255,255,0.85)"}`, marginLeft: 6, verticalAlign: "middle", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }} />
  );
}

// ─── RecordCard ──────────────────────────────────────────────────────────────

function RecordCard({ record, index }: { record: AnomalyRecord; index: number }) {
  const isOver = record.type === "over";
  const fields = [
    { label: "污染物",   value: record.pollutant },
    { label: "数据类型", value: record.dataType },
    { label: "监测值",   value: record.value },
    { label: "标准限值", value: record.limit },
    { label: "超标倍率", value: record.exceedRatio },
    { label: "时间",     value: record.time },
  ];
  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(10,69,149,0.06)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "11px 14px 10px", gap: 8, borderBottom: "1px solid #f0f3f7" }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid #c9d4e3", color: "#6b7a8c", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{index}</div>
        <span style={{ background: "#e0f7ff", color: "#0091c7", border: "1px solid #b3e8ff", fontSize: 12, padding: "3px 8px", borderRadius: 4, flexShrink: 0 }}>废气</span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{record.point}</span>
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          <span style={{ background: isOver ? "#fff0f0" : "#fff7e6", color: isOver ? "#f5222d" : "#fa8c16", border: `1px solid ${isOver ? "#ffb8b8" : "#ffd591"}`, fontSize: 11, padding: "2px 7px", borderRadius: 20, fontWeight: 600 }}>{isOver ? "超标" : "异常"}</span>
          <span style={{ background: "#f5f5f5", color: "#595959", fontSize: 11, padding: "2px 7px", borderRadius: 20 }}>{record.dataType}</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "10px 14px 12px", gap: "8px 12px" }}>
        {fields.map((f) => (
          <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 11, color: "#8090a8" }}>{f.label}</span>
            <span style={{ fontSize: 13, fontWeight: (f.label === "监测值" || f.label === "超标倍率") && isOver ? 600 : 400, color: (f.label === "监测值" || f.label === "超标倍率") && isOver ? "#f5222d" : "#1a1a1a" }}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

const DEFAULT_RANGE: DateRange = { startDate: "2026-05-01", endDate: "2026-05-03" };

export default function AnomalyPage() {
  const router = useRouter();
  const [activeTab,      setActiveTab]      = useState<TabKey>("all");
  const [selectedPoint,  setSelectedPoint]  = useState<PointKey>("all");
  const [currentPage,    setCurrentPage]    = useState(1);
  const [pointOpen,      setPointOpen]      = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [committed,      setCommitted]      = useState<DateRange>(DEFAULT_RANGE);
  const [draft,          setDraft]          = useState<DateRange>(DEFAULT_RANGE);

  const pointRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (pointRef.current && !pointRef.current.contains(e.target as Node)) setPointOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const dateFiltered = useMemo(() => {
    return ALL_RECORDS.filter((r) => {
      const date = r.time.slice(0, 10);
      if (date < committed.startDate || date > committed.endDate) return false;
      if (selectedPoint !== "all") {
        if (r.point !== (selectedPoint === "outlet02" ? "废气排放口02" : "废气排放口01")) return false;
      }
      return true;
    });
  }, [selectedPoint, committed]);

  const filtered = useMemo(() => {
    return dateFiltered.filter((r) => {
      if (activeTab === "all") return true;
      if (activeTab === "limit" || activeTab === "missing") return false;
      return r.type === activeTab;
    });
  }, [dateFiltered, activeTab]);

  const counts = useMemo(() => ({
    all:      dateFiltered.length,
    abnormal: dateFiltered.filter(r => r.type === "abnormal").length,
    over:     dateFiltered.filter(r => r.type === "over").length,
    limit:    0,
    missing:  0,
  }), [dateFiltered]);

  const totalPages      = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageRecords     = filtered.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  function openDatePicker() {
    setDraft({ ...committed });
    setDatePickerOpen(true);
  }

  function commitDraft() {
    setCommitted({ ...draft });
    setDatePickerOpen(false);
    setCurrentPage(1);
  }

  const datePillText = `${committed.startDate} 至 ${committed.endDate}`;

  const pillStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 20,
    padding: "7px 12px",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    userSelect: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <style>{`@keyframes sheet-up{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg,#0062d4 0%,#007AFF 55%,#2ca5ff 100%)", position: "relative", overflow: "visible" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(100,200,255,0.22) 1px,transparent 1px)", backgroundSize: "22px 22px", opacity: 0.4, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -80, left: -60, width: 280, height: 280, background: "radial-gradient(circle,rgba(50,150,255,0.18) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 5, height: 44, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <button onClick={() => router.back()} style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
            <ChevronLeft size={20} color="#fff" />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: 1, flexShrink: 0 }}>超标异常</span>
          <span style={{ flex: 1 }} />
          <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Menu size={20} color="rgba(255,255,255,0.75)" />
          </button>
        </div>

        {/* Filter row */}
        <div style={{ position: "relative", zIndex: 30, padding: "10px 14px 16px" }}>
          <div onClick={openDatePicker}>
            <div style={{ ...pillStyle }}>
              <span style={{ flex: 1, fontSize: 12 }}>{datePillText}</span>
              <Arrow open={datePickerOpen} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats tab strip */}
      <div style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10, padding: "14px 14px 0", boxShadow: "0 2px 8px rgba(10,69,149,0.06)", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
          {TAB_CFG.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                style={{ minWidth: 66, padding: "10px 10px 12px", borderRadius: "12px 12px 0 0", textAlign: "center", cursor: "pointer", border: "none", background: isActive ? tab.activeBg : "transparent", position: "relative", transition: "background 0.15s" }}>
                {"dot" in tab && tab.dot && (
                  <span style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: tab.dot }} />
                )}
                <div style={{ fontSize: 22, fontWeight: 700, color: isActive ? tab.numColor : "#1a1a1a", lineHeight: 1.1 }}>{counts[tab.key]}</div>
                <div style={{ fontSize: 12, color: isActive ? tab.numColor : "#6b7a8c", marginTop: 2 }}>{tab.label}</div>
                {isActive && <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 24, height: 2, borderRadius: 2, background: tab.underline }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Point filter bar */}
      <div ref={pointRef} style={{ position: "relative" }}>
        <div onClick={() => setPointOpen(v => !v)}
          style={{ background: "#fff", padding: "14px 14px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f3f7", cursor: "pointer" }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>
            {selectedPoint === "all" ? "全部监控点" : selectedPoint === "outlet02" ? "废气排放口02" : "废气排放口01"}
          </span>
          <Arrow open={pointOpen} dark />
        </div>
        {pointOpen && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", boxShadow: "0 8px 24px rgba(10,69,149,0.12)", zIndex: 20, borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
            {([
              { key: "all"      as PointKey, label: "全部监控点" },
              { key: "outlet02" as PointKey, label: "废气排放口02" },
              { key: "outlet01" as PointKey, label: "废气排放口01" },
            ]).map(opt => (
              <div key={opt.key} onClick={() => { setSelectedPoint(opt.key); setCurrentPage(1); setPointOpen(false); }}
                style={{ padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", borderBottom: "1px solid #f0f3f7", color: selectedPoint === opt.key ? "#1677ff" : "#1a1a1a", fontWeight: selectedPoint === opt.key ? 600 : 400, fontSize: 14, background: selectedPoint === opt.key ? "#f0f7ff" : "#fff" }}>
                {opt.label}
                {selectedPoint === opt.key && <Check size={16} color="#1677ff" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record list */}
      <div style={{ padding: "12px 14px 80px", display: "flex", flexDirection: "column", gap: 10 }}>
        {pageRecords.length === 0 ? (
          <div style={{ textAlign: "center", color: "#8090a8", padding: "40px 0", fontSize: 14 }}>暂无数据</div>
        ) : (
          pageRecords.map((record, idx) => (
            <RecordCard key={record.id} record={record} index={(safeCurrentPage - 1) * PAGE_SIZE + idx + 1} />
          ))
        )}
        {filtered.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "8px 0 4px" }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safeCurrentPage === 1}
              style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #ebeef2", background: safeCurrentPage === 1 ? "#f5f7fa" : "#fff", color: safeCurrentPage === 1 ? "#8090a8" : "#1a1a1a", cursor: safeCurrentPage === 1 ? "default" : "pointer", fontSize: 13, fontWeight: 500 }}>
              上一页
            </button>
            <span style={{ fontSize: 13, color: "#6b7a8c", fontWeight: 500 }}>{safeCurrentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safeCurrentPage === totalPages}
              style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #ebeef2", background: safeCurrentPage === totalPages ? "#f5f7fa" : "#fff", color: safeCurrentPage === totalPages ? "#8090a8" : "#1a1a1a", cursor: safeCurrentPage === totalPages ? "default" : "pointer", fontSize: 13, fontWeight: 500 }}>
              下一页
            </button>
          </div>
        )}
      </div>

      {datePickerOpen && (
        <CalendarModal
          draft={draft}
          setDraft={setDraft}
          onConfirm={commitDraft}
          onClose={() => setDatePickerOpen(false)}
        />
      )}

      <TabBar />
    </div>
  );
}
