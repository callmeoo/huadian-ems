"use client";

import { Wind, Droplets, Volume2, Clock, ShieldCheck } from "lucide-react";
import type { ReportType, ReportStatus, DueLevel } from "./types";

export function TypeIconBox({ type, size = 38 }: { type: ReportType; size?: number }) {
  const configs = {
    gas: { bg: "#e6f7ff", color: "#0a84ff", Icon: Wind },
    water: { bg: "#e6fffb", color: "#13c2c2", Icon: Droplets },
    noise: { bg: "#fff7e6", color: "#fa8c16", Icon: Volume2 },
  } as const;
  const { bg, color, Icon } = configs[type];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size >= 36 ? 10 : 8,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={size * 0.5} color={color} />
    </div>
  );
}

export function StatusBadge({
  status,
  manualReviewed,
}: {
  status: ReportStatus;
  manualReviewed?: boolean;
}) {
  const configs = {
    pass: { bg: "#f6ffed", color: "#389e0d", label: "✓ 合格" },
    fail: { bg: "#fff1f0", color: "#cf1322", label: "✗ 不合格" },
    pending: { bg: "#e6f4ff", color: "#0958d9", label: "待核验" },
  } as const;
  const { bg, color, label } = configs[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          background: bg,
          color,
          padding: "2px 8px",
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      {manualReviewed && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            background: "#f0f5ff",
            color: "#2f54eb",
            padding: "2px 7px",
            borderRadius: 8,
            fontSize: 10,
            fontWeight: 500,
          }}
        >
          <ShieldCheck size={11} color="#2f54eb" />
          已复核
        </span>
      )}
    </span>
  );
}

export function DueTag({ level, label }: { level: DueLevel; label: string }) {
  const configs = {
    "very-soon": { bg: "#fff1f0", color: "#cf1322" },
    soon: { bg: "#fff7e6", color: "#d46b08" },
    normal: { bg: "#f0f5ff", color: "#2f54eb" },
    overdue: { bg: "#fff1f0", color: "#a8071a" },
  } as const;
  const { bg, color } = configs[level];
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 8,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

export function NextDateText({ level, date, prefix = "下次监测" }: {
  level: DueLevel;
  date: string;
  prefix?: string;
}) {
  const color =
    level === "very-soon" || level === "overdue"
      ? "#cf1322"
      : level === "soon"
      ? "#d46b08"
      : "#8090a8";
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color }}>
      <Clock size={12} color={color} />
      {prefix}: {date}
    </span>
  );
}
