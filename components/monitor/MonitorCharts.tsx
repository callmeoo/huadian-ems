"use client";

import React, { useCallback } from "react";
import {
  ComposedChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Granularity = "实时" | "分钟" | "小时" | "日";

interface Props {
  granularity: Granularity;
  compact?: boolean;
}

interface DataPoint {
  time: string;
  concentration: number;
  corrected: number;
  flow: number;
  emission: number | null;
}

// ─── Mock data (consistent with MonitorTable) ─────────────────────────────────

const MINUTE_DATA: DataPoint[] = [
  { time: "18:30", concentration: 0.94, corrected: 188.044, flow: 2443.126, emission: 0.002 },
  { time: "18:40", concentration: 0.562, corrected: 127.666, flow: 3420.582, emission: 0.002 },
  { time: "18:50", concentration: 0.861, corrected: 258.305, flow: 2378.522, emission: 0.002 },
  { time: "19:00", concentration: 1.262, corrected: 378.642, flow: 1671.317, emission: 0.002 },
  { time: "19:10", concentration: 0.488, corrected: 146.398, flow: 1717.429, emission: 0.001 },
];

const REALTIME_DATA: DataPoint[] = MINUTE_DATA;

const HOURLY_DATA: DataPoint[] = [
  { time: "00:00", concentration: 41.825, corrected: 43.438, flow: 371481.026, emission: 15.537 },
  { time: "01:00", concentration: 41.693, corrected: 43.205, flow: 372952.99,  emission: 15.549 },
  { time: "02:00", concentration: 41.078, corrected: 42.955, flow: 368982.611, emission: 15.157 },
  { time: "03:00", concentration: 41.227, corrected: 43.17,  flow: 368173.799, emission: 15.179 },
  { time: "04:00", concentration: 41.179, corrected: 43.086, flow: 368037.295, emission: 15.155 },
  { time: "05:00", concentration: 41.273, corrected: 43.143, flow: 368071.079, emission: 15.192 },
  { time: "06:00", concentration: 41.127, corrected: 43.005, flow: 368137.446, emission: 15.141 },
  { time: "07:00", concentration: 40.8,   corrected: 43.316, flow: 361583.219, emission: 14.753 },
  { time: "08:00", concentration: 57.5,   corrected: 114.663, flow: 169810.788, emission: 9.764 },
  { time: "09:00", concentration: 5.488,  corrected: 167.376, flow: 10659.242,  emission: null },
  { time: "10:00", concentration: 4.258,  corrected: -192.105, flow: 13687.859, emission: null },
];

const DAILY_DATA: DataPoint[] = [
  { time: "05-01", concentration: 39.762, corrected: 42.598, flow: 8752343.14,  emission: 348.021 },
  { time: "05-02", concentration: 15.645, corrected: 48.597, flow: 3239876.614, emission: 117.467 },
  { time: "05-03", concentration: 19.204, corrected: 52.236, flow: 3426049.049, emission: 149.882 },
  { time: "05-04", concentration: 39.66,  corrected: 42.569, flow: 8743230.265, emission: 346.764 },
  { time: "05-05", concentration: 38.313, corrected: 41.454, flow: 8774223.944, emission: 336.173 },
  { time: "05-06", concentration: 39.178, corrected: 41.815, flow: 8735333.288, emission: 342.233 },
  { time: "05-07", concentration: 40.047, corrected: 42.494, flow: 8618582.383, emission: 317.208 },
  { time: "05-08", concentration: 40.147, corrected: 42.503, flow: 8662577.593, emission: 347.783 },
  { time: "05-09", concentration: 40.389, corrected: 43.695, flow: 8766790.303, emission: 354.112 },
];

const STANDARD_VALUE = 50;

function getFlowUnit() {
  return "立方米";
}

function getData(granularity: Granularity): DataPoint[] {
  if (granularity === "实时") return REALTIME_DATA;
  if (granularity === "分钟") return MINUTE_DATA;
  if (granularity === "小时") return HOURLY_DATA;
  return DAILY_DATA;
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LineTooltip({ active, payload, label, std, flowUnit }: any) {
  if (!active || !payload?.length) return null;

  const nameMap: Record<string, string> = {
    concentration: "浓度",
    corrected: "折算浓度",
    flow: "监控点流量",
  };
  const unitMap: Record<string, string> = {
    concentration: "毫克/立方米",
    corrected: "毫克/立方米",
    flow: flowUnit,
  };

  return (
    <div style={{
      background: "#fff",
      padding: "10px 14px",
      borderRadius: 8,
      boxShadow: "0 2px 14px rgba(0,0,0,0.13)",
      fontSize: 12,
      minWidth: 180,
    }}>
      <div style={{ fontWeight: 600, color: "#1a1a1a", marginBottom: 7 }}>{label}</div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ color: "#6b7a8c" }}>
            {nameMap[p.dataKey] ?? p.dataKey}：{typeof p.value === "number" ? p.value.toFixed(3) : p.value}{unitMap[p.dataKey] ? `${unitMap[p.dataKey]}` : ""}
          </span>
        </div>
      ))}
      <div style={{ color: "#6b7a8c", marginTop: 3 }}>标准值：{std}毫克/立方米</div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      padding: "10px 14px",
      borderRadius: 8,
      boxShadow: "0 2px 14px rgba(0,0,0,0.13)",
      fontSize: 12,
    }}>
      <div style={{ fontWeight: 600, color: "#1a1a1a", marginBottom: 7 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#9c6fce", flexShrink: 0 }} />
        <span style={{ color: "#6b7a8c" }}>氮氧化物：{payload[0]?.value}千克</span>
      </div>
    </div>
  );
}

// ─── Legend item ─────────────────────────────────────────────────────────────

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: color, display: "inline-block" }} />
      <span style={{ fontSize: 12, color: "#6b7a8c" }}>{label}</span>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MonitorCharts({ granularity, compact }: Props) {
  const data = getData(granularity);
  const std = STANDARD_VALUE;
  const flowUnit = getFlowUnit();

  const lineTooltip = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: any) => <LineTooltip {...props} std={std} flowUnit={flowUnit} />,
    [std, flowUnit],
  );

  const tickStyle = { fontSize: 11, fill: "#8090a8" };

  // ── Compact (landscape) mode: only line chart, fills container height ──
  if (compact) {
    return (
      <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, padding: "8px 0 2px", flexShrink: 0 }}>
          <LegendDot color="#4fc3f7" label="浓度" />
          <LegendDot color="#3b82f6" label="折算浓度" />
          <LegendDot color="#4ade80" label="监控点流量" />
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          padding: "0 16px 2px", fontSize: 11, color: "#8090a8", flexShrink: 0,
        }}>
          <span>浓度：毫克/立方米</span>
          <span>流量：{flowUnit}</span>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 60, left: 55, bottom: 24 }}>
              <CartesianGrid stroke="#f0f3f7" vertical={false} />
              <XAxis dataKey="time" tick={tickStyle} angle={-40} textAnchor="end" interval="preserveStartEnd" tickLine={false} axisLine={{ stroke: "#ebeef2" }} />
              <YAxis yAxisId="left" tick={tickStyle} tickLine={false} axisLine={false} width={52} />
              <YAxis yAxisId="right" orientation="right" tick={tickStyle} tickLine={false} axisLine={false} width={58} />
              <Tooltip content={lineTooltip} />
              <ReferenceLine yAxisId="left" y={std} stroke="#f5222d" strokeWidth={1.5} label={{ value: "标准值", position: "right", fontSize: 10, fill: "#f5222d", dx: 4 }} />
              <Line yAxisId="left" type="monotone" dataKey="concentration" stroke="#4fc3f7" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="left" type="monotone" dataKey="corrected" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="flow" stroke="#4ade80" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff" }}>

      {/* Legend */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 22,
        padding: "14px 0 6px",
      }}>
        <LegendDot color="#4fc3f7" label="浓度" />
        <LegendDot color="#3b82f6" label="折算浓度" />
        <LegendDot color="#4ade80" label="监控点流量" />
      </div>

      {/* Axis labels */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        padding: "0 16px 4px", fontSize: 11, color: "#8090a8",
      }}>
        <span>浓度：毫克/立方米</span>
        <span>流量：{flowUnit}</span>
      </div>

      {/* Line chart */}
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={data} margin={{ top: 8, right: 60, left: 55, bottom: 24 }}>
          <CartesianGrid stroke="#f0f3f7" vertical={false} />
          <XAxis
            dataKey="time"
            tick={tickStyle}
            angle={-40}
            textAnchor="end"
            interval="preserveStartEnd"
            tickLine={false}
            axisLine={{ stroke: "#ebeef2" }}
          />
          <YAxis
            yAxisId="left"
            tick={tickStyle}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={tickStyle}
            tickLine={false}
            axisLine={false}
            width={58}
          />
          <Tooltip content={lineTooltip} />
          <ReferenceLine
            yAxisId="left"
            y={std}
            stroke="#f5222d"
            strokeWidth={1.5}
            strokeDasharray=""
            label={{ value: "标准值", position: "right", fontSize: 10, fill: "#f5222d", dx: 4 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="concentration"
            stroke="#4fc3f7"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="corrected"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="flow"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Gap between charts */}
      <div style={{ height: 16 }} />

      {/* Bar chart header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px 8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#9c6fce", display: "inline-block" }} />
          <span style={{ fontSize: 13, color: "#1a1a1a" }}>排放量</span>
        </div>
        <span style={{ fontSize: 11, color: "#8090a8" }}>单位：千克</span>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 20, left: 40, bottom: 24 }}>
          <CartesianGrid stroke="#f0f3f7" vertical={false} />
          <XAxis
            dataKey="time"
            tick={tickStyle}
            angle={-40}
            textAnchor="end"
            interval="preserveStartEnd"
            tickLine={false}
            axisLine={{ stroke: "#ebeef2" }}
          />
          <YAxis
            tick={tickStyle}
            tickLine={false}
            axisLine={false}
            width={38}
          />
          <Tooltip content={BarTooltip} />
          <Bar dataKey="emission" fill="#9c6fce" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ height: 16 }} />
    </div>
  );
}
