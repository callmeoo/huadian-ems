"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import TabBar from "@/components/layout/TabBar";
import {
  Zap, Building2, Activity, AlertTriangle,
  PieChart, FileText, ShieldCheck, BarChart3,
  LayoutGrid, Check, Plus, Gauge, SlidersHorizontal,
  Bell, BookOpen, ClipboardList, HardDrive, Package,
} from "lucide-react";

type WorkspaceModule = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
};

const ALL_MODULES: WorkspaceModule[] = [
  { id: "enterprise",   name: "企业档案",   icon: <Building2 />,          color: "c-cyan",   href: "/enterprise" },
  { id: "anomaly",      name: "超标异常",   icon: <AlertTriangle />,      color: "c-orange", href: "/anomaly" },
  { id: "control",      name: "超标管控",   icon: <ShieldCheck />,        color: "c-red",    href: "/control" },
  { id: "monitor",      name: "实时监控",   icon: <Activity />,           color: "c-blue",   href: "/monitor" },
  { id: "emission",     name: "排放量统计", icon: <BarChart3 />,          color: "c-green",  href: "/emission" },
  { id: "report",       name: "监测报表",   icon: <FileText />,           color: "c-teal",   href: "/report" },
  { id: "stats",        name: "数据统计",   icon: <PieChart />,           color: "c-green",  href: "/stats" },
  { id: "gauge",        name: "有效传输率", icon: <Gauge />,              color: "c-teal",   href: "/gauge" },
  { id: "notification", name: "工作通知",   icon: <Bell />,               color: "c-red",    href: "/notifications" },
  { id: "verification", name: "第三方检测", icon: <ClipboardList />,      color: "c-purple", href: "/verification" },
  { id: "equipment",    name: "设备管理",   icon: <HardDrive />,          color: "c-blue",   href: "/equipment" },
  { id: "parts",        name: "备件库",     icon: <Package />,            color: "c-purple", href: "/parts" },
  { id: "settings",     name: "报警设置",   icon: <SlidersHorizontal />,  color: "c-gray",   href: "/settings" },
  { id: "training",     name: "培训考试",   icon: <BookOpen />,           color: "c-teal",   href: "/training" },
];

const MODULE_REGISTRY: Record<string, WorkspaceModule> = Object.fromEntries(
  ALL_MODULES.map((m) => [m.id, m]),
);

const STORAGE_KEY = "workspace.modules.v2";

const COLOR_MAP: Record<string, { bg: string; icon: string }> = {
  "c-blue":   { bg: "#e6f4ff", icon: "#1677ff" },
  "c-cyan":   { bg: "#e0f7ff", icon: "#0091c7" },
  "c-orange": { bg: "#fff7e0", icon: "#d46b08" },
  "c-red":    { bg: "#fff0f0", icon: "#cf1322" },
  "c-green":  { bg: "#f0fff4", icon: "#389e0d" },
  "c-purple": { bg: "#f5f0ff", icon: "#531dab" },
  "c-gray":   { bg: "#f5f5f5", icon: "#595959" },
  "c-teal":   { bg: "#e6fffb", icon: "#08979c" },
};

type AlertType = "all" | "warn" | "over" | "limit" | "miss";

const NOTIFICATIONS = [
  {
    id: 1,
    urgent: true,
    title: "【紧急】NOx超标预警 — 4号排放口",
    body: "今日10:15至11:40，4号排放口NOx小时均值连续3次超过许可浓度限值（限值：100 mg/m³，实测：117 mg/m³）。请运行部门立即排查燃烧调整，并在系统内标记工况说明。",
    time: "2026-05-16 11:45",
  },
  {
    id: 2,
    urgent: true,
    title: "【重要】脱硫系统月度检修安排",
    body: "1号机组脱硫系统将于本月20日08:00—16:00进行例行检修，届时相关监控数据可能出现中断，请各岗位知悉并做好手工记录备档。",
    time: "2026-05-16 09:30",
  },
  {
    id: 3,
    urgent: false,
    title: "排污许可证年度执行报告提交提醒",
    body: "2025年度排污许可证执行报告提交截止日期为2026年3月31日，请环保管理员及时核实各项数据并完成网上提交，避免逾期处罚。",
    time: "2026-05-15 14:00",
  },
  {
    id: 4,
    urgent: false,
    title: "环保培训通知 — 新版《排污单位自行监测技术指南》解读",
    body: "环保部将于本周五（5月17日）15:00—17:00在行政楼三楼会议室开展新版技术指南培训，请相关岗位人员准时参加，培训后需在线完成知识测验。",
    time: "2026-05-14 16:20",
  },
];

export default function HomePage() {
  const [activeAlert, setActiveAlert] = useState<AlertType>("all");
  const [editing, setEditing] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [moduleIds, setModuleIds] = useState<string[]>(() => ALL_MODULES.map((m) => m.id));
  const hydratedRef = useRef(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
          const valid = parsed.filter((id) => MODULE_REGISTRY[id]);
          // Auto-append any new ALL_MODULES entries the user hasn't seen yet
          // — so a new module shipped via code shows up even if the user has
          // an older customized list cached in localStorage.
          const stored = new Set(valid);
          const newlyShipped = ALL_MODULES.filter((m) => !stored.has(m.id)).map((m) => m.id);
          const merged = [...valid, ...newlyShipped];
          if (merged.length > 0) setModuleIds(merged);
        }
      }
    } catch {
      // ignore corrupted storage
    }
    hydratedRef.current = true;
  }, []);

  // Persist on change (skip the initial render so we don't clobber storage before hydration)
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(moduleIds));
    } catch {
      // ignore quota / privacy mode
    }
  }, [moduleIds]);

  const modules = useMemo(
    () => moduleIds.map((id) => MODULE_REGISTRY[id]).filter(Boolean),
    [moduleIds],
  );

  function removeModule(id: string) {
    setModuleIds((prev) => prev.filter((mid) => mid !== id));
  }

  function addModule(mod: WorkspaceModule) {
    setModuleIds((prev) => (prev.includes(mod.id) ? prev : [...prev, mod.id]));
    setPanelOpen(false);
  }

  const addedIds = new Set(moduleIds);

  return (
    <div style={{ minHeight: "100vh", background: "var(--hd-bg)", fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
        position: "relative",
        overflow: "hidden",
        paddingBottom: 20,
      }}>
        {/* dot texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.4,
          pointerEvents: "none",
        }} />
        {/* glow */}
        <div style={{
          position: "absolute", top: -80, left: -60,
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Top bar */}
        <div style={{ position: "relative", zIndex: 5, display: "flex", alignItems: "center", padding: "12px 20px 0" }}>
          <span style={{ flex: 1, textAlign: "center", color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 500, letterSpacing: 0.3 }}>
            广州大学城华电新能源有限公司
          </span>
        </div>

        {/* Title */}
        <div style={{ position: "relative", zIndex: 5, padding: "14px 20px 6px", display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{
            width: 38, height: 38, background: "#1677ff", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(22,119,255,0.35)", flexShrink: 0,
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: 1, lineHeight: 1.2 }}>环保管理平台</h1>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2, letterSpacing: 1.5 }}>
              CHINA HUADIAN · ENV MONITORING
            </div>
          </div>
          {/* live badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(0,232,122,0.1)", border: "1px solid rgba(0,232,122,0.28)",
            borderRadius: 20, padding: "3px 9px 3px 7px", flexShrink: 0,
          }}>
            <span style={{ width: 5, height: 5, background: "#00e87a", borderRadius: "50%", display: "inline-block" }} />
            <span style={{ fontSize: 10, color: "rgba(0,232,122,0.9)", fontWeight: 600 }}>实时</span>
          </div>
        </div>

        {/* Alert cards */}
        <div style={{ position: "relative", zIndex: 5, margin: "12px 16px 0" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", letterSpacing: 2, marginBottom: 8, display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ display: "inline-block", width: 14, height: 1, background: "rgba(30,160,255,0.55)" }} />
            今日报警
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {([
              { type: "all" as AlertType, num: 0, label: "全部", numColor: "#60e8f7" },
              { type: "warn" as AlertType, num: 0, label: "异常", numColor: "#ffc96b" },
              { type: "over" as AlertType, num: 0, label: "超标", numColor: "#ff8080" },
              { type: "limit" as AlertType, num: 0, label: "超限值", numColor: "#ff5050" },
              { type: "miss" as AlertType, num: 0, label: "缺失", numColor: "#9eb5cc" },
            ] as const).map(({ type, num, label, numColor }) => (
              <button
                key={type}
                onClick={() => setActiveAlert(type)}
                style={{
                  background: activeAlert === type ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)",
                  border: `1px solid ${activeAlert === type ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 10, padding: "10px 2px 8px",
                  textAlign: "center", cursor: "pointer",
                  transition: "all 0.15s",
                  outline: "none",
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1, color: numColor }}>{num}</div>
                <div style={{ fontSize: 10, marginTop: 3, color: numColor + "b3" }}>{label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0 14px 80px" }}>

        {/* Risk section */}
        <div style={{ paddingTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <SectionTitle>趋势重点风险</SectionTitle>
            <span style={{ fontSize: 12, color: "#1677ff", cursor: "pointer" }}>查看全部 ›</span>
          </div>
          <div style={{
            background: "#fff", borderRadius: 12, padding: "14px 16px",
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)", display: "flex", alignItems: "center", cursor: "pointer",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: "var(--text-1)", fontWeight: 500 }}>7 日内重点风险问题</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>近期无异常 · 状态良好</div>
            </div>
            <div style={{
              minWidth: 34, height: 26, padding: "0 11px", borderRadius: 13,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13, background: "#f0fff4", color: "#389e0d",
            }}>0</div>
          </div>
        </div>

        {/* Notification section */}
        <div style={{ paddingTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <SectionTitle color="#f5222d">工作通知</SectionTitle>
            <span style={{
              fontSize: 11, fontWeight: 600, color: "#fff",
              background: "#f5222d", borderRadius: 10, padding: "1px 8px",
            }}>{NOTIFICATIONS.filter(n => n.urgent).length} 条重要</span>
          </div>
          <Link
            href="/notifications"
            style={{
              display: "block", width: "100%", textDecoration: "none",
              background: "#fff1f0",
              borderRadius: 12,
              borderLeft: "4px solid #f5222d",
              padding: "13px 14px",
              boxShadow: "0 2px 8px rgba(245,34,45,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#cf1322", marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
                  {NOTIFICATIONS[0].title}
                  <span style={{ fontSize: 10, background: "#f5222d", color: "#fff", borderRadius: 4, padding: "1px 5px", flexShrink: 0 }}>紧急</span>
                </div>
                <div style={{ fontSize: 11, color: "#8090a8", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {NOTIFICATIONS[0].body}
                </div>
              </div>
              <span style={{ fontSize: 11, color: "#cf1322", flexShrink: 0, alignSelf: "center" }}>
                共 {NOTIFICATIONS.length} 条 ›
              </span>
            </div>
          </Link>
        </div>

        {/* Workspace */}
        <div style={{ paddingTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <SectionTitle>工作台</SectionTitle>
            <button
              onClick={() => { setEditing(!editing); if (editing) setPanelOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 12, color: "#1677ff", padding: "4px 10px",
                borderRadius: 12, background: editing ? "rgba(22,119,255,0.12)" : "rgba(22,119,255,0.07)",
                border: `1px solid ${editing ? "rgba(22,119,255,0.3)" : "rgba(22,119,255,0.2)"}`,
                cursor: "pointer", outline: "none",
              }}
            >
              {editing ? <Check size={13} /> : <LayoutGrid size={13} />}
              {editing ? "保存" : "自定义"}
            </button>
          </div>

          <div style={{
            background: "#fff", borderRadius: 14, padding: 10,
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6,
          }}>
            {modules.map((mod) => {
              const colors = COLOR_MAP[mod.color] ?? COLOR_MAP["c-blue"];
              const tileStyle: React.CSSProperties = {
                position: "relative", display: "flex", flexDirection: "column",
                alignItems: "center", padding: "12px 4px 10px", borderRadius: 10,
                cursor: "pointer", textDecoration: "none", color: "inherit",
                animation: editing ? "jiggle 0.5s ease-in-out infinite alternate" : "none",
              };
              const inner = (
                <>
                  {editing && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeModule(mod.id); }}
                      style={{
                        position: "absolute", top: 4, right: 4,
                        width: 18, height: 18, background: "#ff4d4f", color: "#fff",
                        borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, cursor: "pointer", border: "none", zIndex: 2,
                      }}
                    >×</button>
                  )}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: colors.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 7,
                  }}>
                    <span style={{ color: colors.icon, display: "flex" }}>{mod.icon}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-1)", fontWeight: 500, textAlign: "center" }}>{mod.name}</div>
                </>
              );
              return !editing && mod.href ? (
                <Link key={mod.id} href={mod.href} style={tileStyle}>{inner}</Link>
              ) : (
                <div key={mod.id} style={tileStyle}>{inner}</div>
              );
            })}

            {editing && ALL_MODULES.length > moduleIds.length && (
              <button
                onClick={() => setPanelOpen(true)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "12px 4px 10px", borderRadius: 10,
                  border: "1.5px dashed #d0dae8", cursor: "pointer", background: "transparent", outline: "none",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: "#f5f7fa",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 7,
                }}>
                  <Plus size={20} color="#8090a8" />
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)" }}>添加</div>
              </button>
            )}

          </div>

          {editing && (
            <div style={{
              marginTop: 8, padding: "7px 12px", background: "rgba(22,119,255,0.07)",
              borderRadius: 8, fontSize: 11, color: "#1677ff", textAlign: "center",
            }}>
              {ALL_MODULES.length > moduleIds.length
                ? "点击 × 移除 · 点击「添加」加回模块 · 完成后点「保存」"
                : "点击 × 移除模块 · 完成后点「保存」"}
            </div>
          )}
        </div>
      </div>

      <TabBar />

      {/* Module panel overlay */}
      {panelOpen && (
        <>
          <div
            onClick={() => setPanelOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", zIndex: 200 }}
          />
          <div style={{
            position: "fixed", left: 0, right: 0, bottom: 60,
            background: "#fff", borderRadius: "20px 20px 0 0", zIndex: 201, paddingBottom: 20,
          }}>
            <div style={{ width: 36, height: 4, background: "#e0e6ef", borderRadius: 2, margin: "12px auto 16px" }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)", padding: "0 20px 12px", borderBottom: "1px solid var(--line)" }}>
              添加模块
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, padding: "14px 10px" }}>
              {ALL_MODULES.filter((m) => !addedIds.has(m.id)).length === 0 && (
                <div style={{
                  gridColumn: "1 / -1",
                  textAlign: "center", color: "#8090a8", fontSize: 13,
                  padding: "20px 16px",
                }}>
                  所有模块已加入工作台
                </div>
              )}
              {ALL_MODULES.filter((m) => !addedIds.has(m.id)).map((mod) => {
                const colors = COLOR_MAP[mod.color] ?? COLOR_MAP["c-blue"];
                return (
                  <button
                    key={mod.id}
                    onClick={() => addModule(mod)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      padding: "10px 4px 8px", borderRadius: 10, cursor: "pointer",
                      border: "1.5px solid #ebeef2",
                      background: "transparent", outline: "none",
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, background: colors.bg,
                      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6,
                    }}>
                      <span style={{ color: colors.icon, display: "flex" }}>{mod.icon}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-2)" }}>{mod.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes jiggle {
          from { transform: rotate(-4deg); }
          to   { transform: rotate(4deg); }
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ children, color }: { children: React.ReactNode; color?: string }) {
  const bar = color
    ? color
    : "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)";
  return (
    <div style={{
      fontSize: 13, fontWeight: 600, color: color ?? "var(--text-1)",
      display: "flex", alignItems: "center", gap: 7,
    }}>
      <span style={{
        width: 3, height: 14, flexShrink: 0,
        background: bar,
        borderRadius: 2, display: "inline-block",
      }} />
      {children}
    </div>
  );
}
