"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp, Upload, Check, Menu } from "lucide-react";
import { DateRangePicker } from "@/components/stats/DateRangePicker";

// ─── Types ────────────────────────────────────────────────────────────────────
type GroupId = "abnormal" | "exceed" | "limit" | "missing";

interface DetailRecord {
  id: number;
  medium: "废气" | "废水";
  point: string;
  pollutant: string;
  anomalyLabel: string;
  dataType: string;
  time: string;
  value: string;
  standard: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const GROUP_METRICS: Record<GroupId, string[]> = {
  abnormal: ["小时数据负值", "小时数据零值", "小时数据超量程", "小时数据恒值", "自动监测设备维护"],
  exceed:   ["小时数据超标", "日数据超标"],
  limit:    ["分钟数据超限值", "小时数据超限值", "日数据超限值"],
  missing:  ["小时数据缺失", "日数据缺失", "联网异常"],
};

const GROUP_BADGE: Record<GroupId, { text: string; bg: string; color: string }> = {
  abnormal: { text: "异常", bg: "#fff7e6", color: "#d46b08" },
  exceed:   { text: "超标", bg: "#fff1f0", color: "#cf1322" },
  limit:    { text: "超限", bg: "#fff7e6", color: "#d46b08" },
  missing:  { text: "缺失", bg: "#fff7e6", color: "#d46b08" },
};

const GROUP_TITLE: Record<GroupId, string> = {
  abnormal: "数据异常", exceed: "数据超标", limit: "数据超限值", missing: "数据缺失",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const P2 = "废气排放口02", P1 = "废气排放口01";
const NOX = "氮氧化物", DUST = "烟尘", SO2 = "二氧化硫";
const STD = "50毫克/立方米";
const GAS = "废气" as const;
const PTS = [P2, P1] as const;
const POL = [NOX, DUST, SO2];

function r(id: number, medium: "废气" | "废水", point: string, pollutant: string, anomalyLabel: string, dataType: string, time: string, value: string, standard: string): DetailRecord {
  return { id, medium, point, pollutant, anomalyLabel, dataType, time, value, standard };
}

function genTime(i: number, total: number): string {
  const day = String(Math.floor((i * 4) / total) + 1).padStart(2, "0");
  const hr = String(8 + (i % 8)).padStart(2, "0");
  return `2026-05-${day} ${hr}:00`;
}

const RECORDS: Record<string, DetailRecord[]> = {
  "小时数据负值": [
    r(1,GAS,P2,NOX,"监测值为负值","小时","2026-05-03 09:00","-4.777",STD),
    r(2,GAS,P2,NOX,"监测值为负值","小时","2026-05-03 08:00","-0.063",STD),
    r(3,GAS,P2,DUST,"监测值为负值","小时","2026-05-03 16:00","-0.012",STD),
    r(4,GAS,P2,SO2,"监测值为负值","小时","2026-05-03 16:00","-0.017",STD),
    r(5,GAS,P2,DUST,"监测值为负值","小时","2026-05-03 11:00","-0.008",STD),
    r(6,GAS,P2,SO2,"监测值为负值","小时","2026-05-03 10:00","-0.021",STD),
    r(7,GAS,P1,DUST,"监测值为负值","小时","2026-05-03 09:00","-0.001",STD),
    r(8,GAS,P2,DUST,"监测值为负值","小时","2026-05-02 22:00","-0.006",STD),
    r(9,GAS,P2,SO2,"监测值为负值","小时","2026-05-02 21:00","-0.009",STD),
    r(10,GAS,P2,DUST,"监测值为负值","小时","2026-05-02 18:00","-0.004",STD),
    r(11,GAS,P2,SO2,"监测值为负值","小时","2026-05-02 17:00","-0.011",STD),
    r(12,GAS,P1,DUST,"监测值为负值","小时","2026-05-02 14:00","-0.002",STD),
    r(13,GAS,P2,DUST,"监测值为负值","小时","2026-05-02 11:00","-0.007",STD),
    r(14,GAS,P2,NOX,"监测值为负值","小时","2026-05-01 23:00","-0.003",STD),
    r(15,GAS,P2,DUST,"监测值为负值","小时","2026-05-01 20:00","-0.015",STD),
    r(16,GAS,P1,SO2,"监测值为负值","小时","2026-05-01 15:00","-0.005",STD),
    r(17,GAS,P2,DUST,"监测值为负值","小时","2026-05-01 12:00","-0.003",STD),
  ],
  "小时数据零值": [
    r(1,GAS,P2,NOX,"小时数据零值","小时","2026-05-03 13:00","0",STD),
    r(2,GAS,P2,NOX,"小时数据零值","小时","2026-05-03 12:00","0",STD),
    r(3,GAS,P1,DUST,"小时数据零值","小时","2026-05-03 12:00","0",STD),
    r(4,GAS,P1,SO2,"小时数据零值","小时","2026-05-03 12:00","0",STD),
    r(5,GAS,P1,NOX,"小时数据零值","小时","2026-05-03 12:00","0",STD),
    r(6,GAS,P1,DUST,"小时数据零值","小时","2026-05-02 20:00","0",STD),
    r(7,GAS,P1,NOX,"小时数据零值","小时","2026-05-02 19:00","0",STD),
    r(8,GAS,P1,SO2,"小时数据零值","小时","2026-05-02 13:00","0",STD),
    r(9,GAS,P1,DUST,"小时数据零值","小时","2026-05-01 18:00","0",STD),
    r(10,GAS,P1,DUST,"小时数据零值","小时","2026-05-01 15:00","0",STD),
    r(11,GAS,P1,SO2,"小时数据零值","小时","2026-05-01 12:00","0",STD),
  ],
  "小时数据超标": [
    r(1,GAS,P2,NOX,"小时数据超标","小时","2026-05-03 14:00","120.662",STD),
    r(2,GAS,P2,NOX,"小时数据超标","小时","2026-05-03 13:00","102.157",STD),
    r(3,GAS,P2,NOX,"小时数据超标","小时","2026-05-02 10:00","1809.97",STD),
    r(4,GAS,P2,NOX,"小时数据超标","小时","2026-05-02 09:00","163.43",STD),
    r(5,GAS,P2,NOX,"小时数据超标","小时","2026-05-02 08:00","51.238",STD),
  ],
  "日数据超标": [
    r(1,GAS,P2,NOX,"日数据超标","日","2026-05-02","238.5",STD),
  ],
  "自动监测设备维护": Array.from({ length: 19 }, (_, i) =>
    r(i+1, GAS, PTS[i%2], POL[i%3], "自动监测设备维护", "小时", genTime(i, 19), "维护中", "—")),
  "小时数据缺失": Array.from({ length: 14 }, (_, i) =>
    r(i+1, GAS, PTS[i%2], POL[i%3], "小时数据缺失", "小时", genTime(i, 14), "—", STD)),
  "联网异常": Array.from({ length: 41 }, (_, i) =>
    r(i+1, GAS, PTS[i%2], POL[i%3], "联网异常", "小时", genTime(i, 41), "—", "—")),
  "小时数据超量程": [], "小时数据恒值": [], "分钟数据超限值": [],
  "小时数据超限值": [], "日数据超限值": [], "日数据缺失": [],
};

const PAGE_SIZE = 10;

// ─── Styles ───────────────────────────────────────────────────────────────────
const heroStyle: React.CSSProperties = {
  background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
  position: "relative", overflow: "hidden",
};
const dotStyle: React.CSSProperties = {
  background: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
  backgroundSize: "22px 22px", opacity: 0.4,
  position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
};
const glowStyle: React.CSSProperties = {
  background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
  position: "absolute", top: -80, left: -60, width: 280, height: 280,
  pointerEvents: "none", zIndex: 0,
};
const glassStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.28)", border: "1px solid rgba(255,255,255,0.5)",
  borderRadius: 10, height: 38, color: "#fff",
  display: "flex", alignItems: "center", padding: "0 12px", gap: 6, cursor: "pointer",
};

// ─── Detail Content ───────────────────────────────────────────────────────────
function DetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const metric = searchParams.get("metric") ?? "小时数据负值";
  const group = (searchParams.get("group") ?? "abnormal") as GroupId;

  const [page, setPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [calStart, setCalStart] = useState<Date | null>(new Date(2026, 4, 1));
  const [calEnd, setCalEnd] = useState<Date | null>(new Date(2026, 4, 5));
  const [pointOpen, setPointOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState("监控点");

  function formatDate(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  const dateDisplay = calStart && calEnd ? `${formatDate(calStart)} 至 ${formatDate(calEnd)}` : "选择日期";

  const badge = GROUP_BADGE[group];
  const metrics = GROUP_METRICS[group];
  const allRecords = (RECORDS[metric] ?? []).filter(
    (rec) => selectedPoint === "监控点" || rec.point === selectedPoint
  );
  const totalPages = Math.max(1, Math.ceil(allRecords.length / PAGE_SIZE));
  const records = allRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isExceed = group === "exceed";

  function switchMetric(m: string) {
    router.push(`/stats/detail?metric=${encodeURIComponent(m)}&group=${group}`);
    setDropdownOpen(false);
    setPage(1);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", fontFamily: "system-ui, sans-serif" }}>
      {/* Hero */}
      <div style={heroStyle}>
        <div style={dotStyle} />
        <div style={glowStyle} />
        <div style={{ position: "relative", zIndex: 1, height: 44, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#fff", flex: 1, textAlign: "center" }}>
            {GROUP_TITLE[group]}
          </span>
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", marginLeft: 4 }}>
            <Menu size={20} />
          </button>
        </div>
        <div style={{ position: "relative", zIndex: 1, padding: "6px 14px 14px", display: "flex", gap: 8 }}>
          <button onClick={() => setCalOpen(true)} style={{ ...glassStyle, flex: 1, justifyContent: "space-between", background: "rgba(255,255,255,0.28)", border: "1px solid rgba(255,255,255,0.5)" }}>
            <span style={{ fontSize: 13 }}>{dateDisplay}</span>
            <ChevronDown size={16} />
          </button>
          <button onClick={() => setPointOpen(!pointOpen)} style={{ ...glassStyle, justifyContent: "space-between", background: "rgba(255,255,255,0.28)", border: "1px solid rgba(255,255,255,0.5)" }}>
            <span style={{ fontSize: 13 }}>{selectedPoint}</span>
            {pointOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Metric selector bar */}
      <div style={{ background: "#fff", padding: "10px 14px", display: "flex", gap: 8, borderBottom: "1px solid #ebeef2" }}>
        <button
          onClick={() => setDropdownOpen(true)}
          style={{ flex: 1, height: 38, background: "#f5f7fa", border: "1px solid #ebeef2", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", cursor: "pointer", fontSize: 14, color: "#1a1a1a" }}
        >
          <span>{metric}</span>
          <ChevronDown size={16} color="#6b7a8c" />
        </button>
        <button style={{ width: 38, height: 38, background: "#f5f7fa", border: "1px solid #ebeef2", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Upload size={16} color="#6b7a8c" />
        </button>
      </div>

      {/* Records list */}
      <div style={{ padding: "12px 14px 80px" }}>
        {records.length === 0 ? (
          <div style={{ textAlign: "center", color: "#8090a8", padding: 48, fontSize: 14 }}>暂无数据</div>
        ) : (
          records.map((rec) => <RecordCard key={rec.id} rec={rec} isExceed={isExceed} badge={badge} />)
        )}
        {allRecords.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, marginTop: 10, padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} style={{ fontSize: 14, color: page > 1 ? "#1677ff" : "#8090a8", background: "none", border: "none", cursor: page > 1 ? "pointer" : "default" }}>上一页</button>
            <span style={{ fontSize: 14, color: "#1a1a1a" }}>{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} style={{ fontSize: 14, color: page < totalPages ? "#1677ff" : "#8090a8", background: "none", border: "none", cursor: page < totalPages ? "pointer" : "default" }}>下一页</button>
          </div>
        )}
      </div>

      {/* Metric dropdown */}
      {dropdownOpen && (
        <>
          <div onClick={() => setDropdownOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 10 }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", zIndex: 11, borderRadius: "16px 16px 0 0", padding: "12px 0 32px" }}>
            <div style={{ padding: "8px 16px 10px", fontSize: 13, color: "#8090a8", fontWeight: 600 }}>选择指标</div>
            {metrics.map((m) => (
              <button key={m} onClick={() => switchMetric(m)} style={{ display: "flex", width: "100%", padding: "13px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 15, color: metric === m ? "#1677ff" : "#1a1a1a", fontWeight: metric === m ? 600 : 400, alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f5f7fa" }}>
                {m}
                {metric === m && <Check size={18} color="#1677ff" />}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 监控点 dropdown */}
      {pointOpen && (
        <>
          <div onClick={() => setPointOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10, background: "rgba(0,0,0,0.45)" }} />
          <div style={{ position: "fixed", top: 98, left: 0, right: 0, zIndex: 11, background: "#fff" }}>
            {["监控点", "废气排放口02", "废气排放口01"].map((pt) => (
              <button
                key={pt}
                onClick={() => { setSelectedPoint(pt); setPointOpen(false); setPage(1); }}
                style={{ display: "flex", width: "100%", padding: "15px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 15, color: selectedPoint === pt ? "#1677ff" : "#1a1a1a", fontWeight: selectedPoint === pt ? 600 : 400, alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f5f7fa" }}
              >
                {pt}
                {selectedPoint === pt && <Check size={18} color="#1677ff" />}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Date range picker */}
      {calOpen && (
        <DateRangePicker
          start={calStart}
          end={calEnd}
          onClose={() => setCalOpen(false)}
          onConfirm={(s, e) => { setCalStart(s); setCalEnd(e); setPage(1); }}
        />
      )}
    </div>
  );
}

// ─── Record Card ──────────────────────────────────────────────────────────────
function RecordCard({ rec, isExceed, badge }: { rec: DetailRecord; isExceed: boolean; badge: { text: string; bg: string; color: string } }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(10,69,149,0.06)", marginBottom: 10, overflow: "hidden" }}>
      <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #f0f3f7" }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#6b7a8c", fontWeight: 600, flexShrink: 0 }}>
          {rec.id}
        </div>
        <span style={{ fontSize: 11, color: "#0091c7", border: "1px solid #0091c7", borderRadius: 4, padding: "1px 5px", flexShrink: 0 }}>
          {rec.medium}
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", flex: 1 }}>{rec.point}</span>
        <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 600, background: badge.bg, color: badge.color, padding: "3px 8px" }}>{badge.text}</span>
          <span style={{ fontSize: 11, background: "#f0f3f7", color: "#6b7a8c", padding: "3px 8px" }}>{rec.dataType}</span>
        </div>
      </div>
      <div style={{ padding: "10px 14px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 8 }}>
        {isExceed ? (
          <>
            <Field label="监测项目" value={rec.pollutant} />
            <Field label="数据类型" value={rec.dataType} />
            <Field label="监测时间" value={rec.time} />
            <Field label="监测值" value={rec.value} />
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="标准值" value={rec.standard} bold />
            </div>
          </>
        ) : (
          <>
            <Field label="监测项目" value={rec.pollutant} />
            <Field label="异常类型" value={rec.anomalyLabel} color={badge.color} />
            <Field label="数据类型" value={rec.dataType} />
            <Field label="监测时间" value={rec.time} />
            <Field label="监测值" value={rec.value} />
            <Field label="标准值" value={rec.standard} />
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, bold, color }: { label: string; value: string; bold?: boolean; color?: string }) {
  return (
    <div>
      <span style={{ fontSize: 12, color: "#8090a8" }}>{label}：</span>
      <span style={{ fontSize: 13, color: color ?? "#1a1a1a", fontWeight: bold ? 600 : 400 }}>{value}</span>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function StatsDetailPage() {
  return (
    <Suspense>
      <DetailContent />
    </Suspense>
  );
}
