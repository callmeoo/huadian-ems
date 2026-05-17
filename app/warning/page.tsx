"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, Menu, Check } from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import DateRangePicker from "@/components/ui/DateRangePicker";

// ─── Types ───────────────────────────────────────────────────────────────────

type TabKey = "all" | "hour" | "day";
type PointKey = "all" | "outlet02" | "outlet01";

interface WarningRecord {
  id: number;
  point: "废气排放口02" | "废气排放口01";
  media: "废气";
  pollutant: string;
  type: "hour" | "day";          // 小时预警 / 日预警
  avgValue: number;              // 小时（或日）平均浓度
  limit: number;                 // 标准值
  unit: string;                  // 毫克/立方米
  time: string;                  // 预警时间 yyyy-MM-dd HH:mm
}

// ─── Data ────────────────────────────────────────────────────────────────────

const ALL_RECORDS: WarningRecord[] = [
  // 2026-05-16 三条小时预警（与截图一致）
  { id: 1, point: "废气排放口02", media: "废气", pollutant: "氮氧化物", type: "hour", avgValue: 113.956, limit: 50, unit: "毫克/立方米", time: "2026-05-16 08:30" },
  { id: 2, point: "废气排放口02", media: "废气", pollutant: "氮氧化物", type: "hour", avgValue: 108.645, limit: 50, unit: "毫克/立方米", time: "2026-05-16 08:20" },
  { id: 3, point: "废气排放口02", media: "废气", pollutant: "氮氧化物", type: "hour", avgValue: 98.452,  limit: 50, unit: "毫克/立方米", time: "2026-05-16 08:10" },

  // 历史数据（用于跨日期范围查询时呈现）
  { id: 4,  point: "废气排放口02", media: "废气", pollutant: "氮氧化物", type: "hour", avgValue: 89.330,  limit: 50, unit: "毫克/立方米", time: "2026-05-15 16:00" },
  { id: 5,  point: "废气排放口02", media: "废气", pollutant: "氮氧化物", type: "day",  avgValue: 56.872,  limit: 50, unit: "毫克/立方米", time: "2026-05-15 00:00" },
  { id: 6,  point: "废气排放口01", media: "废气", pollutant: "二氧化硫", type: "hour", avgValue: 178.110, limit: 100, unit: "毫克/立方米", time: "2026-05-14 21:00" },
  { id: 7,  point: "废气排放口02", media: "废气", pollutant: "氮氧化物", type: "hour", avgValue: 75.220,  limit: 50, unit: "毫克/立方米", time: "2026-05-13 10:00" },
  { id: 8,  point: "废气排放口02", media: "废气", pollutant: "氮氧化物", type: "day",  avgValue: 62.105,  limit: 50, unit: "毫克/立方米", time: "2026-05-12 00:00" },
  { id: 9,  point: "废气排放口01", media: "废气", pollutant: "二氧化硫", type: "hour", avgValue: 162.840, limit: 100, unit: "毫克/立方米", time: "2026-05-10 14:00" },
  { id: 10, point: "废气排放口02", media: "废气", pollutant: "氮氧化物", type: "hour", avgValue: 81.450,  limit: 50, unit: "毫克/立方米", time: "2026-05-08 09:00" },
];

const PAGE_SIZE = 8;

const POINT_OPTIONS: { key: PointKey; label: string }[] = [
  { key: "all",      label: "全部监控点" },
  { key: "outlet02", label: "废气排放口02" },
  { key: "outlet01", label: "废气排放口01" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function WarningPage() {
  const router = useRouter();

  const [dateStart, setDateStart] = useState("2026-05-16");
  const [dateEnd,   setDateEnd]   = useState("2026-05-16");
  const [pickerOpen, setPickerOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedPoint, setSelectedPoint] = useState<PointKey>("all");
  const [pointOpen, setPointOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const pointRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (pointRef.current && !pointRef.current.contains(e.target as Node)) setPointOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // ── Filtering ──
  const inRangeAndPoint = useMemo(() => {
    return ALL_RECORDS.filter((r) => {
      const date = r.time.slice(0, 10);
      if (date < dateStart || date > dateEnd) return false;
      if (selectedPoint === "outlet02" && r.point !== "废气排放口02") return false;
      if (selectedPoint === "outlet01" && r.point !== "废气排放口01") return false;
      return true;
    });
  }, [dateStart, dateEnd, selectedPoint]);

  const counts = useMemo(() => ({
    all:  inRangeAndPoint.length,
    hour: inRangeAndPoint.filter((r) => r.type === "hour").length,
    day:  inRangeAndPoint.filter((r) => r.type === "day").length,
  }), [inRangeAndPoint]);

  const filtered = useMemo(() => {
    if (activeTab === "all") return inRangeAndPoint;
    return inRangeAndPoint.filter((r) => r.type === activeTab);
  }, [inRangeAndPoint, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageRecords = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const dateLabel = `${dateStart} 至 ${dateEnd}`;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)", backgroundSize: "22px 22px", opacity: 0.4, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -80, left: -60, width: 280, height: 280, background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Nav */}
        <div style={{ position: "relative", zIndex: 1, height: 44, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", flexShrink: 0 }}>超标预警</span>
          <span style={{ flex: 1 }} />
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center" }}>
            <Menu size={20} />
          </button>
        </div>

        {/* Date pill */}
        <div style={{ position: "relative", zIndex: 1, padding: "10px 14px 18px" }}>
          <div
            onClick={() => setPickerOpen(true)}
            style={{
              background: "rgba(255,255,255,0.28)",
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: 22,
              height: 42,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              cursor: "pointer",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600 }}>{dateLabel}</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* ── Stat tiles ── */}
      <div style={{ padding: "14px 14px 4px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <StatTile
          active={activeTab === "all"}
          count={counts.all}
          label="全部(条)"
          onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
        />
        <StatTile
          active={activeTab === "hour"}
          count={counts.hour}
          label="小时预警(条)"
          onClick={() => { setActiveTab("hour"); setCurrentPage(1); }}
        />
        <StatTile
          active={activeTab === "day"}
          count={counts.day}
          label="日预警(条)"
          onClick={() => { setActiveTab("day"); setCurrentPage(1); }}
        />
      </div>

      {/* ── Point filter ── */}
      <div ref={pointRef} style={{ position: "relative", padding: "10px 14px 0" }}>
        <div
          onClick={() => setPointOpen((v) => !v)}
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>
            {POINT_OPTIONS.find((o) => o.key === selectedPoint)?.label}
          </span>
          <ChevronDown
            size={18}
            color="#6b7a8c"
            style={{ transition: "transform 0.2s", transform: pointOpen ? "rotate(180deg)" : "rotate(0)" }}
          />
        </div>
        {pointOpen && (
          <div style={{ position: "absolute", left: 14, right: 14, top: "calc(100% - 2px)", background: "#fff", boxShadow: "0 8px 24px rgba(10,69,149,0.12)", borderRadius: 12, overflow: "hidden", zIndex: 20 }}>
            {POINT_OPTIONS.map((opt) => (
              <div
                key={opt.key}
                onClick={() => { setSelectedPoint(opt.key); setCurrentPage(1); setPointOpen(false); }}
                style={{
                  padding: "13px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f3f7",
                  color: selectedPoint === opt.key ? "#1677ff" : "#1a1a1a",
                  fontWeight: selectedPoint === opt.key ? 600 : 400,
                  fontSize: 14,
                  background: selectedPoint === opt.key ? "#f0f7ff" : "#fff",
                }}
              >
                {opt.label}
                {selectedPoint === opt.key && <Check size={16} color="#1677ff" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Record list ── */}
      <div style={{ padding: "10px 14px 80px", display: "flex", flexDirection: "column", gap: 10 }}>
        {pageRecords.length === 0 ? (
          <div style={{ textAlign: "center", color: "#8090a8", padding: "40px 0", fontSize: 14 }}>暂无数据</div>
        ) : (
          pageRecords.map((r, idx) => (
            <RecordCard key={r.id} record={r} index={(safePage - 1) * PAGE_SIZE + idx + 1} />
          ))
        )}

        {filtered.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "10px 0 4px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                border: "1px solid #ebeef2",
                background: safePage === 1 ? "#f5f7fa" : "#fff",
                color: safePage === 1 ? "#8090a8" : "#1a1a1a",
                cursor: safePage === 1 ? "default" : "pointer",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              上一页
            </button>
            <span style={{ fontSize: 13, color: "#6b7a8c", fontWeight: 500 }}>{safePage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                border: "1px solid #ebeef2",
                background: safePage === totalPages ? "#f5f7fa" : "#fff",
                color: safePage === totalPages ? "#8090a8" : "#1a1a1a",
                cursor: safePage === totalPages ? "default" : "pointer",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              下一页
            </button>
          </div>
        )}
      </div>

      <DateRangePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={(s, e) => { setDateStart(s); setDateEnd(e); setPickerOpen(false); setCurrentPage(1); }}
        defaultStart={dateStart}
        defaultEnd={dateEnd}
      />

      <TabBar />
    </div>
  );
}

// ─── StatTile ────────────────────────────────────────────────────────────────

function StatTile({ active, count, label, onClick }: { active: boolean; count: number; label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        height: 90,
        borderRadius: 14,
        cursor: "pointer",
        overflow: "hidden",
        background: active
          ? "linear-gradient(135deg, #0062d4 0%, #1677ff 55%, #2ca5ff 100%)"
          : "#fff",
        boxShadow: active
          ? "0 6px 18px rgba(22,119,255,0.25)"
          : "0 2px 8px rgba(10,69,149,0.06)",
        border: active ? "none" : "1px solid #ebeef2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.18s",
      }}
    >
      {/* Active 角标 */}
      {active ? (
        <div style={{
          position: "absolute",
          right: 0, bottom: 0,
          width: 36, height: 36,
          background: "rgba(255,255,255,0.18)",
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }} />
      ) : null}
      {active && (
        <div style={{
          position: "absolute",
          right: 4, bottom: 4,
          width: 14, height: 14,
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Check size={10} color="#1677ff" strokeWidth={3} />
        </div>
      )}
      {/* 光晕装饰（active 状态） */}
      {active && (
        <div style={{
          position: "absolute",
          top: -20, right: -20,
          width: 80, height: 80,
          background: "radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      )}

      <div style={{ fontSize: 26, fontWeight: 800, color: active ? "#fff" : "#1a1a1a", lineHeight: 1, zIndex: 1 }}>
        {count}
      </div>
      <div style={{ fontSize: 13, color: active ? "rgba(255,255,255,0.95)" : "#6b7a8c", marginTop: 6, zIndex: 1 }}>
        {label}
      </div>
    </div>
  );
}

// ─── RecordCard ──────────────────────────────────────────────────────────────

function RecordCard({ record, index }: { record: WarningRecord; index: number }) {
  const isHour = record.type === "hour";
  const avgLabel = isHour ? "小时平均浓度" : "日平均浓度";
  const badgeLabel = isHour ? "小时预警" : "日预警";

  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(10,69,149,0.06)", overflow: "hidden" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px 10px", borderBottom: "1px solid #f0f3f7" }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid #c9d4e3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#6b7a8c", flexShrink: 0 }}>
          {index}
        </div>
        <span style={{ background: "#e0f7ff", color: "#0091c7", border: "1px solid #b3e8ff", borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
          {record.media}
        </span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {record.point}
        </span>
        <span style={{
          background: isHour ? "#fff7e6" : "#fff0f0",
          color: isHour ? "#fa8c16" : "#f5222d",
          border: `1px solid ${isHour ? "#ffd591" : "#ffb8b8"}`,
          borderRadius: 20,
          padding: "3px 10px",
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
        }}>
          {badgeLabel}
        </span>
      </div>

      {/* Body grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "12px 14px 14px", gap: "10px 12px" }}>
        <Field label="监测项目" value={record.pollutant} />
        <Field label="预警时间" value={record.time} />
        <Field label={avgLabel} value={record.avgValue.toFixed(3)} highlight />
        <Field label="标准值" value={`${record.limit}${record.unit}`} />
      </div>
    </div>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontSize: 12, color: "#8090a8" }}>{label}：</span>
      <span style={{ fontSize: 14, fontWeight: highlight ? 700 : 500, color: highlight ? "#f5222d" : "#1a1a1a" }}>
        {value}
      </span>
    </div>
  );
}
