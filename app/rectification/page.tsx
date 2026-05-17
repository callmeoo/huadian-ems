"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, SlidersHorizontal, AlertTriangle, Clock, CheckCircle2,
  Building2, Activity, ClipboardList, Wind, Droplets, Volume2, Trash2,
  Plus, ChevronRight,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import {
  RECTIFICATIONS, buildStats, daysUntilDue, effectiveStatus, isLagWarning,
  STATUS_LABEL, STATUS_COLOR, SEVERITY_LABEL, SEVERITY_COLOR,
  CATEGORY_LABEL, SOURCE_LABEL,
  type RectificationCategory, type RectificationSource, type RectificationStatus,
} from "@/lib/rectification/mock";

type StatusFilter = "all" | RectificationStatus | "lag";
type SourceFilter = "all" | RectificationSource;
type CategoryFilter = "all" | RectificationCategory;

const SOURCE_CHIPS: { key: SourceFilter; label: string }[] = [
  { key: "all", label: "全部来源" },
  { key: "epb", label: "环保局" },
  { key: "internal", label: "内部巡查" },
  { key: "third-party", label: "第三方" },
  { key: "monitor", label: "监测系统" },
];

const CATEGORY_CHIPS: { key: CategoryFilter; label: string; Icon: React.ComponentType<{ size: number; color?: string }> }[] = [
  { key: "all", label: "全部", Icon: ClipboardList },
  { key: "air", label: "废气", Icon: Wind },
  { key: "water", label: "废水", Icon: Droplets },
  { key: "noise", label: "噪声", Icon: Volume2 },
  { key: "solid", label: "固废", Icon: Trash2 },
  { key: "management", label: "管理类", Icon: Building2 },
];

export default function RectificationPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const stats = useMemo(() => buildStats(RECTIFICATIONS), []);

  const filtered = useMemo(() => {
    return RECTIFICATIONS.filter((item) => {
      const eff = effectiveStatus(item);
      if (statusFilter === "lag") {
        if (!isLagWarning(item)) return false;
      } else if (statusFilter !== "all" && eff !== statusFilter) return false;
      if (sourceFilter !== "all" && item.source !== sourceFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      return true;
    }).sort((a, b) => {
      // 已闭环排到最后；其他按 dueAt 升序
      const aClosed = a.status === "closed" ? 1 : 0;
      const bClosed = b.status === "closed" ? 1 : 0;
      if (aClosed !== bClosed) return aClosed - bClosed;
      return a.dueAt.localeCompare(b.dueAt);
    });
  }, [statusFilter, sourceFilter, categoryFilter]);

  const statCards: { key: StatusFilter; label: string; value: number; color: string }[] = [
    { key: "all",         label: "全部",   value: stats.total,      color: "#fff" },
    { key: "in-progress", label: "整改中", value: stats.inProgress, color: "#60e8f7" },
    { key: "review",      label: "待验收", value: stats.review,     color: "#c8a8ff" },
    { key: "overdue",     label: "已超期", value: stats.overdue,    color: "#ff8080" },
    { key: "lag",         label: "滞后预警", value: stats.lag,       color: "#ffc96b" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
        position: "relative",
        overflow: "hidden",
        paddingBottom: 16,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px", opacity: 0.4, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -80, left: -60,
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* 导航 */}
        <div style={{ position: "relative", zIndex: 1, height: 44, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex" }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ flex: 1, fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>环保整改</span>
          <button style={{
            width: 32, height: 32, background: "rgba(255,255,255,0.12)",
            borderRadius: 8, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <SlidersHorizontal size={18} color="rgba(255,255,255,0.85)" />
          </button>
        </div>

        {/* 统计行 */}
        <div style={{ position: "relative", zIndex: 1, padding: "8px 14px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {statCards.map((c) => {
              const active = statusFilter === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setStatusFilter(active && c.key !== "all" ? "all" : c.key)}
                  style={{
                    background: active ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.07)",
                    border: `1px solid ${active ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 10, padding: "9px 2px 8px",
                    textAlign: "center", cursor: "pointer", outline: "none",
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1, color: c.color }}>{c.value}</div>
                  <div style={{ fontSize: 10, marginTop: 3, color: c.color + "b3" }}>{c.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 筛选区 */}
      <div style={{ padding: "12px 14px 0" }}>
        {/* 类型 chips */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
          {CATEGORY_CHIPS.map((c) => {
            const active = categoryFilter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCategoryFilter(c.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
                  padding: "6px 12px", borderRadius: 16,
                  background: active ? "#1677ff" : "#fff",
                  color: active ? "#fff" : "#6b7a8c",
                  border: `1px solid ${active ? "#1677ff" : "#ebeef2"}`,
                  fontSize: 12, fontWeight: 500, cursor: "pointer", outline: "none",
                }}
              >
                <c.Icon size={13} />{c.label}
              </button>
            );
          })}
        </div>
        {/* 来源 chips */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
          {SOURCE_CHIPS.map((c) => {
            const active = sourceFilter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setSourceFilter(c.key)}
                style={{
                  flexShrink: 0,
                  padding: "5px 11px", borderRadius: 14,
                  background: active ? "rgba(22,119,255,0.1)" : "transparent",
                  color: active ? "#1677ff" : "#8090a8",
                  border: `1px solid ${active ? "rgba(22,119,255,0.3)" : "#ebeef2"}`,
                  fontSize: 11, cursor: "pointer", outline: "none",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 列表 */}
      <div style={{ padding: "10px 14px 0", display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{
            padding: "40px 16px", textAlign: "center", color: "#8090a8", fontSize: 13,
            background: "#fff", borderRadius: 12,
          }}>
            没有符合筛选条件的整改单
          </div>
        )}
        {filtered.map((item) => {
          const eff = effectiveStatus(item);
          const sColor = STATUS_COLOR[eff];
          const sevColor = SEVERITY_COLOR[item.severity];
          const days = daysUntilDue(item);
          const lag = isLagWarning(item);

          let countdownLabel: string;
          let countdownColor: string;
          if (item.status === "closed") {
            countdownLabel = `已闭环 · ${item.completedAt ?? ""}`;
            countdownColor = "#389e0d";
          } else if (eff === "overdue") {
            countdownLabel = `已超期 ${Math.abs(days)} 天`;
            countdownColor = "#cf1322";
          } else if (eff === "review") {
            countdownLabel = `待验收`;
            countdownColor = "#531dab";
          } else if (days <= 3) {
            countdownLabel = `剩余 ${days} 天`;
            countdownColor = "#d46b08";
          } else {
            countdownLabel = `剩余 ${days} 天`;
            countdownColor = "#6b7a8c";
          }

          return (
            <Link
              key={item.id}
              href={`/rectification/${item.id}`}
              style={{
                display: "block", textDecoration: "none", color: "inherit",
                background: "#fff", borderRadius: 12, padding: "12px 14px",
                boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
              }}
            >
              {/* 顶部 meta */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                <span style={{ fontSize: 11, color: "#8090a8", fontFamily: "ui-monospace, monospace" }}>
                  {item.id}
                </span>
                <span style={{
                  fontSize: 10, padding: "1px 6px", borderRadius: 4,
                  background: sevColor.bg, color: sevColor.fg, fontWeight: 600,
                }}>{SEVERITY_LABEL[item.severity]}</span>
                <span style={{
                  fontSize: 10, padding: "1px 6px", borderRadius: 4,
                  background: "#f5f7fa", color: "#6b7a8c",
                }}>{CATEGORY_LABEL[item.category]}</span>
                {lag && (
                  <span style={{
                    fontSize: 10, padding: "1px 6px", borderRadius: 4,
                    background: "#fff7e0", color: "#d46b08", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 3,
                  }}>
                    <AlertTriangle size={10} />滞后
                  </span>
                )}
                <span style={{ flex: 1 }} />
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 10,
                  background: sColor.bg, color: sColor.fg, fontWeight: 600,
                }}>{STATUS_LABEL[eff]}</span>
              </div>

              {/* 标题 */}
              <div style={{
                fontSize: 14, color: "#1a1a1a", fontWeight: 500, lineHeight: 1.4,
                overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                marginBottom: 8,
              }}>
                {item.title}
              </div>

              {/* 底部行 */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                fontSize: 11, color: "#8090a8",
                paddingTop: 8, borderTop: "1px solid #f0f3f7",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Activity size={12} />{SOURCE_LABEL[item.source]}
                </span>
                {item.responsibleDept && (
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Building2 size={12} />{item.responsibleDept}
                  </span>
                )}
                <span style={{ flex: 1 }} />
                <span style={{ color: countdownColor, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                  {eff === "overdue" ? <AlertTriangle size={12} />
                    : item.status === "closed" ? <CheckCircle2 size={12} />
                    : <Clock size={12} />}
                  {countdownLabel}
                </span>
                <ChevronRight size={14} color="#bfcbd9" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 浮动新增按钮 */}
      <button
        onClick={() => alert("新建整改单 — 接 DB 后开放表单页")}
        style={{
          position: "fixed", right: 18, bottom: 78,
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(160deg, #1677ff 0%, #0d52c4 100%)",
          color: "#fff", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 18px rgba(13,82,196,0.4)",
          zIndex: 50,
        }}
        aria-label="新建整改单"
      >
        <Plus size={26} />
      </button>

      <TabBar />
    </div>
  );
}
