"use client";

import React from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Granularity = "实时" | "分钟" | "小时" | "日";

interface Props {
  granularity: Granularity;
}

interface Row {
  time: string;
  flag?: boolean;
  measured: number;
  corrected: number;
  correctedRed?: boolean;
  standard: number;
  emission: number | string;
  maintenance: string;
  cMarkedMeasured?: string;
  cMarkedCorrected?: string;
  cExemptMeasured?: string;
  cExemptCorrected?: string;
  cEmission?: number | string;
  flow: number;
  flowMaintenance: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const DAILY_ROWS: Row[] = [
  { time: "2026-05-09", measured: 40.389, corrected: 43.695, standard: 50, emission: 354.112, maintenance: "数据有效(N)", flow: 8766790.303, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-08", measured: 40.147, corrected: 42.503, standard: 50, emission: 347.783, maintenance: "数据有效(N)", flow: 8662577.593, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-07", measured: 40.047, corrected: 42.494, standard: 50, emission: 317.208, maintenance: "数据有效(N)", flow: 8618582.383, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-06", measured: 39.178, corrected: 41.815, standard: 50, emission: 342.233, maintenance: "数据有效(N)", flow: 8735333.288, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-05", measured: 38.313, corrected: 41.454, standard: 50, emission: 336.173, maintenance: "数据有效(N)", flow: 8774223.944, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-04", measured: 39.66, corrected: 42.569, standard: 50, emission: 346.764, maintenance: "数据有效(N)", flow: 8743230.265, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-03", measured: 19.204, corrected: 52.236, correctedRed: true, standard: 50, emission: 149.882, maintenance: "数据有效(N)", cMarkedMeasured: "有效数据不足", cMarkedCorrected: "涉及因子无效", cExemptMeasured: "有效数据不足", cExemptCorrected: "涉及因子无效", cEmission: 149.881, flow: 3426049.049, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-02", measured: 15.645, corrected: 48.597, standard: 50, emission: 117.467, maintenance: "数据有效(N)", cMarkedMeasured: "有效数据不足", cMarkedCorrected: "涉及因子无效", cExemptMeasured: "有效数据不足", cExemptCorrected: "涉及因子无效", cEmission: 114.128, flow: 3239876.614, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-01", measured: 39.762, corrected: 42.598, standard: 50, emission: 348.021, maintenance: "数据有效(N)", flow: 8752343.14, flowMaintenance: "数据有效(N)" },
];

const HOURLY_ROWS: Row[] = [
  { time: "2026-05-16 10", flag: true, measured: 4.258, corrected: -192.105, correctedRed: true, standard: 50, emission: "涉及因子无效", maintenance: "数据有效(N)", cMarkedMeasured: "有效数据不足", cMarkedCorrected: "涉及因子无效", cExemptMeasured: "有效数据不足", cExemptCorrected: "涉及因子无效", cEmission: "涉及因子无效", flow: 13687.859, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 09", flag: true, measured: 5.488, corrected: 167.376, correctedRed: true, standard: 50, emission: "涉及因子无效", maintenance: "数据有效(N)", cMarkedMeasured: "有效数据不足", cMarkedCorrected: "涉及因子无效", cExemptMeasured: "有效数据不足", cExemptCorrected: "涉及因子无效", cEmission: "涉及因子无效", flow: 10659.242, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 08", flag: true, measured: 57.5, corrected: 114.663, correctedRed: true, standard: 50, emission: 9.764, maintenance: "数据有效(N)", flow: 169810.788, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 07", measured: 40.8, corrected: 43.316, standard: 50, emission: 14.753, maintenance: "数据有效(N)", flow: 361583.219, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 06", measured: 41.127, corrected: 43.005, standard: 50, emission: 15.141, maintenance: "数据有效(N)", flow: 368137.446, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 05", measured: 41.273, corrected: 43.143, standard: 50, emission: 15.192, maintenance: "数据有效(N)", flow: 368071.079, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 04", measured: 41.179, corrected: 43.086, standard: 50, emission: 15.155, maintenance: "数据有效(N)", flow: 368037.295, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 03", measured: 41.227, corrected: 43.17, standard: 50, emission: 15.179, maintenance: "数据有效(N)", flow: 368173.799, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 02", measured: 41.078, corrected: 42.955, standard: 50, emission: 15.157, maintenance: "数据有效(N)", flow: 368982.611, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 01", measured: 41.693, corrected: 43.205, standard: 50, emission: 15.549, maintenance: "数据有效(N)", flow: 372952.99, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 00", measured: 41.825, corrected: 43.438, standard: 50, emission: 15.537, maintenance: "数据有效(N)", flow: 371481.026, flowMaintenance: "数据有效(N)" },
];

const MINUTE_ROWS: Row[] = [
  { time: "2026-05-16 19:10", flag: true, measured: 0.488, corrected: 146.398, correctedRed: true, standard: 50, emission: 0.001, maintenance: "数据有效(N)", flow: 1717.429, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 19:00", flag: true, measured: 1.262, corrected: 378.642, correctedRed: true, standard: 50, emission: 0.002, maintenance: "数据有效(N)", flow: 1671.317, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 18:50", flag: true, measured: 0.861, corrected: 258.305, correctedRed: true, standard: 50, emission: 0.002, maintenance: "数据有效(N)", flow: 2378.522, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 18:40", flag: true, measured: 0.562, corrected: 127.666, correctedRed: true, standard: 50, emission: 0.002, maintenance: "数据有效(N)", flow: 3420.582, flowMaintenance: "数据有效(N)" },
  { time: "2026-05-16 18:30", flag: true, measured: 0.94, corrected: 188.044, correctedRed: true, standard: 50, emission: 0.002, maintenance: "数据有效(N)", flow: 2443.126, flowMaintenance: "数据有效(N)" },
];

function getRows(g: Granularity): Row[] {
  if (g === "日") return DAILY_ROWS;
  if (g === "小时") return HOURLY_ROWS;
  return MINUTE_ROWS;
}

// ─── Cell rendering ───────────────────────────────────────────────────────────

function fmt(v: number | string | undefined): React.ReactNode {
  if (v === undefined || v === null || v === "") return "";
  if (typeof v === "number") return String(v);
  return v;
}

function FlagBadge() {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 22,
      height: 22,
      borderRadius: "50%",
      border: "1px solid #1677ff",
      color: "#1677ff",
      fontSize: 11,
      background: "#fff",
      fontWeight: 500,
    }}>标</span>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const tableStyle: React.CSSProperties = {
  borderCollapse: "separate",
  borderSpacing: 0,
  width: "100%",
  minWidth: 1300,
  fontSize: 12,
};

// Sticky first column ("监控时间") — pinned to the left while user scrolls horizontally.
const stickyH1: React.CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 3,
  minWidth: 130,
  boxShadow: "2px 0 6px -2px rgba(0,0,0,0.18)",
};

const stickyCell: React.CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 2,
  boxShadow: "2px 0 6px -2px rgba(0,0,0,0.08)",
};

const h1: React.CSSProperties = {
  background: "#1677ff",
  color: "#fff",
  fontWeight: 600,
  fontSize: 13,
  padding: "10px 12px",
  textAlign: "center" as const,
  whiteSpace: "nowrap",
  borderRight: "1px solid rgba(255,255,255,0.25)",
};

const h2: React.CSSProperties = {
  background: "#e6f0ff",
  color: "#1a1a1a",
  fontWeight: 600,
  fontSize: 12,
  padding: "8px 10px",
  textAlign: "center" as const,
  whiteSpace: "nowrap",
  borderRight: "1px solid #fff",
  borderBottom: "1px solid #fff",
  lineHeight: 1.4,
};

const h3: React.CSSProperties = {
  background: "#e6f0ff",
  color: "#1a1a1a",
  fontWeight: 500,
  fontSize: 12,
  padding: "6px 10px",
  textAlign: "center" as const,
  whiteSpace: "nowrap",
  borderRight: "1px solid #fff",
};

const cell: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "center" as const,
  fontSize: 12,
  color: "#1a1a1a",
  borderBottom: "1px solid #f0f3f7",
  whiteSpace: "nowrap",
  background: "#fff",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function MonitorTable({ granularity }: Props) {
  const rows = getRows(granularity);

  return (
    <div style={{ background: "#fff" }}>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th rowSpan={3} style={{ ...h1, ...stickyH1 }}>监控时间</th>
              <th rowSpan={3} style={h1}>标记</th>
              <th colSpan={5} style={h1}>上报值</th>
              <th colSpan={5} style={h1}>修正值</th>
              <th colSpan={2} style={{ ...h1, borderRight: "none" }}>流量</th>
            </tr>
            <tr>
              <th colSpan={2} style={h2}>浓度</th>
              <th rowSpan={2} style={h2}>标准值</th>
              <th rowSpan={2} style={h2}>排放量<br />(千克)</th>
              <th style={h2}>自动监测设备维护<br />标记</th>
              <th colSpan={2} style={h2}>浓度-标记后</th>
              <th colSpan={2} style={h2}>浓度-豁免后</th>
              <th rowSpan={2} style={h2}>排放量<br />(千克)</th>
              <th rowSpan={2} style={h2}>累计流量<br />(立方米)</th>
              <th style={{ ...h2, borderRight: "none" }}>自动监测设备维护<br />标记</th>
            </tr>
            <tr>
              <th style={h3}>实测值</th>
              <th style={h3}>折算值</th>
              <th style={h3}>自动</th>
              <th style={h3}>实测值</th>
              <th style={h3}>折算值</th>
              <th style={h3}>实测值</th>
              <th style={h3}>折算值</th>
              <th style={{ ...h3, borderRight: "none" }}>自动</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td style={{ ...cell, ...stickyCell }}>{row.time}</td>
                <td style={cell}>{row.flag ? <FlagBadge /> : ""}</td>
                <td style={cell}>{fmt(row.measured)}</td>
                <td style={{
                  ...cell,
                  color: row.correctedRed ? "#f5222d" : cell.color,
                  fontWeight: row.correctedRed ? 700 : "normal",
                }}>{fmt(row.corrected)}</td>
                <td style={cell}>{row.standard}</td>
                <td style={cell}>{fmt(row.emission)}</td>
                <td style={cell}>{row.maintenance}</td>
                <td style={cell}>{row.cMarkedMeasured ?? ""}</td>
                <td style={cell}>{row.cMarkedCorrected ?? ""}</td>
                <td style={cell}>{row.cExemptMeasured ?? ""}</td>
                <td style={cell}>{row.cExemptCorrected ?? ""}</td>
                <td style={cell}>{fmt(row.cEmission)}</td>
                <td style={cell}>{fmt(row.flow)}</td>
                <td style={cell}>{row.flowMaintenance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
