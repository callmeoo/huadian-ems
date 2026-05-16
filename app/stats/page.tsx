"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Menu,
  Upload,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import { DateRangePicker } from "@/components/stats/DateRangePicker";

// ─── Types ───────────────────────────────────────────────────────────────────

type GroupId = "abnormal" | "exceed" | "limit" | "missing";

interface Metric {
  label: string;
  value: number;
}

interface Group {
  id: GroupId;
  title: string;
  metrics: Metric[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const GROUPS: Group[] = [
  {
    id: "abnormal",
    title: "数据异常",
    metrics: [
      { label: "小时数据负值", value: 17 },
      { label: "小时数据零值", value: 11 },
      { label: "小时数据超量程", value: 0 },
      { label: "小时数据恒值", value: 0 },
      { label: "自动监测设备维护", value: 19 },
    ],
  },
  {
    id: "exceed",
    title: "数据超标",
    metrics: [
      { label: "小时数据超标", value: 5 },
      { label: "日数据超标", value: 1 },
    ],
  },
  {
    id: "limit",
    title: "数据超限值",
    metrics: [
      { label: "分钟数据超限值", value: 0 },
      { label: "小时数据超限值", value: 0 },
      { label: "日数据超限值", value: 0 },
    ],
  },
  {
    id: "missing",
    title: "数据缺失",
    metrics: [
      { label: "小时数据缺失", value: 14 },
      { label: "日数据缺失", value: 0 },
      { label: "联网异常", value: 41 },
    ],
  },
];

const TYPE_OPTIONS: { label: string; value: GroupId | "all" }[] = [
  { label: "全部类型", value: "all" },
  { label: "数据异常", value: "abnormal" },
  { label: "数据超标", value: "exceed" },
  { label: "数据超限值", value: "limit" },
  { label: "数据缺失", value: "missing" },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
  position: "relative",
  overflow: "hidden",
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

const glassStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.28)",
  border: "1px solid rgba(255,255,255,0.5)",
  borderRadius: 10,
  height: 40,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  padding: "0 14px",
  cursor: "pointer",
};

const accentBar: React.CSSProperties = {
  width: 3,
  height: 14,
  borderRadius: 2,
  background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
  flexShrink: 0,
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function StatsPage() {
  const router = useRouter();
  const [entExpanded, setEntExpanded] = useState(true);
  const [groupExpanded, setGroupExpanded] = useState<Record<GroupId, boolean>>({
    abnormal: true,
    exceed: true,
    limit: true,
    missing: true,
  });
  const [activeType, setActiveType] = useState<GroupId | "all">("all");
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [calStart, setCalStart] = useState<Date | null>(new Date(2026, 4, 1));
  const [calEnd, setCalEnd] = useState<Date | null>(new Date(2026, 4, 8));

  const visibleGroups =
    activeType === "all"
      ? GROUPS
      : GROUPS.filter((g) => g.id === activeType);

  const activeLabel =
    TYPE_OPTIONS.find((o) => o.value === activeType)?.label ?? "全部类型";

  function toggleGroup(id: GroupId) {
    setGroupExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleMetricClick(label: string, groupId: GroupId) {
    router.push(`/stats/detail?metric=${encodeURIComponent(label)}&group=${groupId}`);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", fontFamily: "system-ui, sans-serif" }}>
      {/* ── Hero ── */}
      <div style={heroStyle}>
        <div style={dotTextureStyle} />
        <div style={glowStyle} />

        {/* Nav */}
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
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}
          >
            <ChevronLeft size={24} />
          </button>

          <span style={{ fontSize: 17, fontWeight: 600, color: "#fff", flex: 1, textAlign: "center" }}>
            数据统计
          </span>

          {/* Type filter button */}
          <button
            onClick={() => setTypeDropdownOpen(true)}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", fontSize: 13, display: "flex", alignItems: "center", gap: 2 }}
          >
            {activeLabel} ▾
          </button>

          <button
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", marginLeft: 4 }}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Filter bar */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "6px 14px 14px",
            display: "flex",
            gap: 8,
          }}
        >
          {/* Date pill */}
          <button
            onClick={() => setDatePickerOpen(true)}
            style={{ ...glassStyle, flex: 1, justifyContent: "space-between" }}
          >
            <span style={{ fontSize: 13 }}>
              {calStart ? fmtDate(calStart) : "开始日期"} 至 {calEnd ? fmtDate(calEnd) : "结束日期"}
            </span>
            <ChevronDown size={16} />
          </button>

          {/* Export button */}
          <button
            style={{
              ...glassStyle,
              width: 40,
              padding: 0,
              justifyContent: "center",
              flexShrink: 0,
              background: "none",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            <Upload size={18} />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "14px 14px 80px" }}>
        {/* Enterprise card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #ebeef2",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>
              1. 广州大学城华电新能源有限公司
            </span>
            <button
              onClick={() => setEntExpanded((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                color: "#1677ff",
                padding: 0,
                flexShrink: 0,
                marginLeft: 8,
              }}
            >
              {entExpanded ? "收起" : "展开"}
            </button>
          </div>

          {/* Card body */}
          {entExpanded && (
            <div style={{ padding: "10px 12px 12px" }}>
              {visibleGroups.map((group) => (
                <GroupSection
                  key={group.id}
                  group={group}
                  expanded={groupExpanded[group.id]}
                  onToggle={() => toggleGroup(group.id)}
                  onMetricClick={(label) => handleMetricClick(label, group.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid #ebeef2",
            borderRadius: 12,
            marginTop: 12,
            padding: "14px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 14, color: "#8090a8" }}>上一页</span>
          <span style={{ fontSize: 14, color: "#1a1a1a" }}>1 / 1</span>
          <span style={{ fontSize: 14, color: "#8090a8" }}>下一页</span>
        </div>
      </div>

      {/* ── Type Dropdown ── */}
      {typeDropdownOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setTypeDropdownOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 10,
            }}
          />
          {/* Panel */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              background: "#fff",
              zIndex: 11,
              padding: "6px 0 12px",
              borderRadius: "0 0 16px 16px",
              boxShadow: "0 4px 20px rgba(10,69,149,0.12)",
            }}
          >
            <div style={{ padding: "10px 16px 6px", fontSize: 13, color: "#8090a8", fontWeight: 600 }}>
              选择类型
            </div>
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setActiveType(opt.value);
                  setTypeDropdownOpen(false);
                }}
                style={{
                  display: "flex",
                  width: "100%",
                  padding: "13px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 15,
                  color: activeType === opt.value ? "#1677ff" : "#1a1a1a",
                  fontWeight: activeType === opt.value ? 600 : 400,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid #f5f7fa",
                }}
              >
                {opt.label}
                {activeType === opt.value && (
                  <span style={{ color: "#1677ff", fontSize: 18 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Date Picker ── */}
      {datePickerOpen && (
        <DateRangePicker
          start={calStart}
          end={calEnd}
          onClose={() => setDatePickerOpen(false)}
          onConfirm={(s, e) => {
            setCalStart(s);
            setCalEnd(e);
            setDatePickerOpen(false);
          }}
        />
      )}

      <TabBar />
    </div>
  );
}

function fmtDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ─── GroupSection ─────────────────────────────────────────────────────────────

function GroupSection({
  group,
  expanded,
  onToggle,
  onMetricClick,
}: {
  group: Group;
  expanded: boolean;
  onToggle: () => void;
  onMetricClick: (label: string) => void;
}) {
  return (
    <div
      style={{
        background: "#f6f9fc",
        borderRadius: 10,
        marginBottom: 10,
        overflow: "hidden",
      }}
    >
      {/* Group header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "11px 12px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={accentBar} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
            {group.title}
          </span>
        </div>
        <button
          onClick={onToggle}
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: "1px solid #d8e0ea",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {expanded ? (
            <ChevronUp size={14} color="#6b7a8c" />
          ) : (
            <ChevronDown size={14} color="#6b7a8c" />
          )}
        </button>
      </div>

      {/* Group body */}
      {expanded && (
        <div style={{ padding: "0 10px 10px" }}>
          {group.metrics.map((m, i) => (
            <div
              key={m.label}
              onClick={() => m.value > 0 && onMetricClick(m.label)}
              style={{
                background: "#fff",
                borderRadius: 8,
                padding: "13px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: i === 0 ? 0 : 6,
                cursor: m.value > 0 ? "pointer" : "default",
              }}
            >
              <span style={{ fontSize: 14, color: "#1a1a1a" }}>{m.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: m.value > 0 ? "#f5222d" : "#b8c0cc",
                  }}
                >
                  {m.value}
                </span>
                {m.value > 0 && <ChevronRight size={14} color="#b8c0cc" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
