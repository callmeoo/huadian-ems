"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import TabBar from "@/components/layout/TabBar";

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = "hour" | "day";

interface TableRow {
  pollutant: string;
  standard: number;
  avg: number;
  limit: number;
}

interface OutletData {
  id: string;
  seq: number;
  media: string;
  name: string;
  hourData: TableRow[];
  dayData: TableRow[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const OUTLETS: OutletData[] = [
  {
    id: "outlet1",
    seq: 1,
    media: "废气",
    name: "1号排放口",
    hourData: [
      { pollutant: "氮氧化物", standard: 50, avg: 44.264, limit: 51.434 },
    ],
    dayData: [
      { pollutant: "氮氧化物", standard: 50, avg: 9.721, limit: 78.77 },
    ],
  },
  {
    id: "outlet2",
    seq: 2,
    media: "废气",
    name: "2号排放口",
    hourData: [
      { pollutant: "氮氧化物", standard: 50, avg: -278.624, limit: 132.156 },
    ],
    dayData: [
      { pollutant: "氮氧化物", standard: 50, avg: 62.735, limit: 40.903 },
    ],
  },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
  position: "relative",
  overflow: "hidden",
  paddingBottom: 32,
};

const dotTextureStyle: React.CSSProperties = {
  background:
    "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
  opacity: 0.4,
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 0,
};

const glowStyle: React.CSSProperties = {
  background:
    "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
  position: "absolute",
  top: -80,
  left: -60,
  width: 280,
  height: 280,
  pointerEvents: "none",
  zIndex: 0,
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ControlPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("hour");
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(OUTLETS.map((o) => [o.id, true]))
  );

  function toggleExpanded(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--hd-bg)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* ── Hero ── */}
      <div style={heroStyle}>
        <div style={dotTextureStyle} />
        <div style={glowStyle} />

        {/* Nav — back + title */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: 44,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 8,
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <span
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "#fff",
              flex: 1,
            }}
          >
            超标管控
          </span>
        </div>

        {/* Segment toggle */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            margin: "16px 18px 0",
            display: "inline-flex",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.85)",
              borderRadius: 22,
              padding: 4,
              backdropFilter: "blur(8px)",
              boxShadow: "0 6px 16px rgba(10,69,149,0.22)",
            }}
          >
            {(["hour", "day"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  background:
                    mode === m
                      ? "linear-gradient(180deg, #007AFF 0%, #0055d4 100%)"
                      : "transparent",
                  color: mode === m ? "#fff" : "#2c5ea1",
                  border: "none",
                  borderRadius: 18,
                  padding: "6px 22px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow:
                    mode === m
                      ? "0 3px 8px rgba(28,108,214,0.35)"
                      : "none",
                  transition: "all 0.18s ease",
                }}
              >
                {m === "hour" ? "小时" : "日"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Date card ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          margin: "16px 14px 0",
          padding: "18px 16px",
          boxShadow: "0 6px 18px rgba(10,69,149,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {mode === "hour" ? (
          <HourDateDisplay />
        ) : (
          <DayDateDisplay />
        )}
      </div>

      {/* ── Outlet cards ── */}
      <div style={{ margin: "14px 14px 0", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 80 }}>
        {OUTLETS.map((outlet) => (
          <OutletCard
            key={outlet.id}
            outlet={outlet}
            mode={mode}
            isExpanded={expanded[outlet.id]}
            onToggle={() => toggleExpanded(outlet.id)}
          />
        ))}
      </div>

      <TabBar />
    </div>
  );
}

// ─── HourDateDisplay ──────────────────────────────────────────────────────────

function HourDateDisplay() {
  const digitStyle: React.CSSProperties = {
    width: 32,
    height: 38,
    borderRadius: 8,
    background: "linear-gradient(180deg, #007AFF 0%, #0055d4 100%)",
    color: "#fff",
    fontSize: 22,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 3px 8px rgba(28,108,214,0.3)",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 16,
    color: "#2363b8",
    fontWeight: 600,
  };

  const colonStyle: React.CSSProperties = {
    color: "#2363b8",
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1,
  };

  return (
    <>
      <span style={labelStyle}>2026年05月16日</span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={digitStyle}>1</div>
        <div style={digitStyle}>0</div>
      </div>
      <span style={colonStyle}>:</span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={digitStyle}>1</div>
        <div style={digitStyle}>2</div>
      </div>
    </>
  );
}

// ─── DayDateDisplay ───────────────────────────────────────────────────────────

function DayDateDisplay() {
  const digitStyle: React.CSSProperties = {
    width: 32,
    height: 38,
    borderRadius: 8,
    background: "linear-gradient(180deg, #007AFF 0%, #0055d4 100%)",
    color: "#fff",
    fontSize: 22,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 3px 8px rgba(28,108,214,0.3)",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 16,
    color: "#2363b8",
    fontWeight: 600,
  };

  return (
    <>
      <span style={labelStyle}>2026年05月</span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={digitStyle}>1</div>
        <div style={digitStyle}>6</div>
      </div>
      <span style={labelStyle}>日</span>
    </>
  );
}

// ─── OutletCard ───────────────────────────────────────────────────────────────

function OutletCard({
  outlet,
  mode,
  isExpanded,
  onToggle,
}: {
  outlet: OutletData;
  mode: Mode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const rows = mode === "hour" ? outlet.hourData : outlet.dayData;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 16px 12px",
          gap: 10,
        }}
      >
        {/* Seq */}
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: "1px solid #c9d4e3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "#6b7a8c",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {outlet.seq}
        </div>

        {/* Media badge */}
        <span
          style={{
            background: "#d9efff",
            color: "#1e6fc4",
            borderRadius: 4,
            padding: "2px 8px",
            fontSize: 12,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {outlet.media}
        </span>

        {/* Name */}
        <span
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 700,
            color: "#1a1a1a",
          }}
        >
          {outlet.name}
        </span>

        {/* Toggle */}
        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "#1677ff",
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: 0,
          }}
        >
          {isExpanded ? (
            <>收起 <ChevronUp size={14} /></>
          ) : (
            <>展开 <ChevronDown size={14} /></>
          )}
        </button>
      </div>

      {/* Card body — table */}
      {isExpanded && (
        <div style={{ padding: "0 12px 14px" }}>
          <div
            style={{
              background: "#f6f9fc",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  {[
                    "监测项目",
                    "标准值",
                    mode === "hour" ? "前12分钟浓度均值" : "日均浓度",
                    mode === "hour" ? "后48分钟管控阀值" : "管控阀值",
                  ].map((col, i) => (
                    <th
                      key={col}
                      style={{
                        padding: "10px 8px",
                        textAlign: i === 0 ? "left" : "center",
                        color: "#6b7a8c",
                        fontWeight: 600,
                        fontSize: 12,
                        borderBottom: "1px solid #e8edf4",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isOver = row.avg > row.standard;
                  return (
                    <tr key={row.pollutant}>
                      <td
                        style={{
                          padding: "12px 8px",
                          color: "#1a1a1a",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {row.pollutant}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          textAlign: "center",
                          color: "#1a1a1a",
                          fontSize: 14,
                        }}
                      >
                        {row.standard}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isOver
                              ? "linear-gradient(180deg, #ff7373 0%, #f25757 100%)"
                              : "linear-gradient(180deg, #40b0ff 0%, #007AFF 100%)",
                            color: "#fff",
                            padding: "6px 10px",
                            borderRadius: 16,
                            minWidth: 78,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {row.avg.toFixed(3)}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          textAlign: "center",
                          color: "#1a1a1a",
                          fontSize: 14,
                        }}
                      >
                        {row.limit}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
