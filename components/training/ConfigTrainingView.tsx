"use client";

import {
  HelpCircle, Send, SlidersHorizontal, Library,
  Sparkles, CalendarPlus, ShieldCheck, ChevronRight, AlertCircle,
} from "lucide-react";
import {
  CONFIG_OVERVIEW, CONFIG_TASKS,
  QUESTION_CATEGORIES, TOTAL_QUESTIONS,
} from "@/lib/mock/training";

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: "#1a1a1a",
  display: "flex", alignItems: "center", gap: 7,
};

const sectionBarStyle: React.CSSProperties = {
  width: 3, height: 14, flexShrink: 0,
  background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
  borderRadius: 2, display: "inline-block",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
  border: "1px solid #ebeef2",
};

function SectionHeader({ icon, title, right }: { icon: React.ReactNode; title: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <div style={sectionTitleStyle}>
        <span style={sectionBarStyle} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#1677ff", display: "flex" }}>{icon}</span>
          {title}
        </span>
      </div>
      {right}
    </div>
  );
}

const ACTIONS = [
  { id: "qb",    label: "题库管理",   desc: `${TOTAL_QUESTIONS} 题 · 6 分类`,   icon: HelpCircle,        bg: "#f5f0ff", color: "#531dab" },
  { id: "ai",    label: "AI 出题",    desc: "上传文件自动生成题库",            icon: Sparkles,          bg: "#fff7e0", color: "#d46b08" },
  { id: "plan",  label: "发起培训",   desc: "指定人员、设置时限",              icon: CalendarPlus,      bg: "#e6f4ff", color: "#0d52c4" },
  { id: "rule",  label: "考试规则",   desc: "及格线、优秀线、是否重做",        icon: SlidersHorizontal, bg: "#e6fffb", color: "#08979c" },
  { id: "perm",  label: "权限管理",   desc: "谁能看 / 谁能发起 / 谁能审核",     icon: ShieldCheck,       bg: "#f0fff4", color: "#389e0d" },
  { id: "push",  label: "通知推送",   desc: "培训发起 / 截止前提醒",            icon: Send,              bg: "#fff0f0", color: "#cf1322" },
];

const TASK_ICON = {
  review:   { icon: AlertCircle, color: "#d46b08", bg: "#fff7e0", label: "待审核" },
  schedule: { icon: CalendarPlus, color: "#0d52c4", bg: "#e6f4ff", label: "待发起" },
  rule:     { icon: SlidersHorizontal, color: "#08979c", bg: "#e6fffb", label: "已更新" },
} as const;

export default function ConfigTrainingView() {
  return (
    <div style={{ padding: "14px 14px 80px", display: "flex", flexDirection: "column", gap: 18 }}>

      {/* 概览 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {CONFIG_OVERVIEW.map((s) => (
          <div key={s.label} style={{
            ...cardStyle,
            padding: "12px 14px",
            background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)",
          }}>
            <div style={{ fontSize: 11, color: "#8090a8", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#0d52c4", lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#6b7a8c", marginTop: 4 }}>{s.hint}</div>
          </div>
        ))}
      </div>

      {/* 操作入口 */}
      <section>
        <SectionHeader icon={<SlidersHorizontal size={15} />} title="配置入口" />
        <div style={{
          ...cardStyle,
          padding: 10,
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4,
        }}>
          {ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "12px 6px 10px", borderRadius: 10,
                  border: "none", background: "transparent",
                  cursor: "pointer", textAlign: "center", outline: "none",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: a.bg, color: a.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 7,
                }}>
                  <Icon size={20} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", marginBottom: 2 }}>{a.label}</div>
                <div style={{ fontSize: 10, color: "#8090a8", lineHeight: 1.3 }}>{a.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 待办 */}
      <section>
        <SectionHeader
          icon={<AlertCircle size={15} />}
          title="待办事项"
          right={<span style={{ fontSize: 11, color: "#cf1322", background: "#fff1f0", padding: "1px 6px", borderRadius: 6 }}>
            {CONFIG_TASKS.length} 项
          </span>}
        />
        <div style={cardStyle}>
          {CONFIG_TASKS.map((t, i) => {
            const meta = TASK_ICON[t.type];
            const Icon = meta.icon;
            return (
              <div
                key={t.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px",
                  borderBottom: i < CONFIG_TASKS.length - 1 ? "1px solid #f0f3f7" : "none",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: meta.bg, color: meta.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
                    {t.title}
                    {t.count !== undefined && (
                      <span style={{
                        fontSize: 10, fontWeight: 600,
                        color: meta.color, background: meta.bg,
                        padding: "1px 5px", borderRadius: 4,
                      }}>{t.count}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "#8090a8" }}>
                    {meta.label} · {t.updatedAt}
                  </div>
                </div>
                <ChevronRight size={16} color="#bfcbd9" />
              </div>
            );
          })}
        </div>
      </section>

      {/* 题库快览（带快速增删入口） */}
      <section>
        <SectionHeader
          icon={<Library size={15} />}
          title="题库分类"
          right={<span style={{ fontSize: 11, color: "#1677ff", cursor: "pointer" }}>+ 新增分类</span>}
        />
        <div style={cardStyle}>
          {QUESTION_CATEGORIES.map((c, i) => (
            <div
              key={c.id}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 14px",
                borderBottom: i < QUESTION_CATEGORIES.length - 1 ? "1px solid #f0f3f7" : "none",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#8090a8" }}>
                  {c.count} 题 · 难度 {c.difficulty} · 更新 {c.updatedAt}
                </div>
              </div>
              <button style={{
                fontSize: 11, color: "#1677ff", background: "#e6f4ff",
                border: "none", borderRadius: 6, padding: "3px 8px",
                cursor: "pointer",
              }}>编辑</button>
              <button style={{
                fontSize: 11, color: "#722ed1", background: "#f5f0ff",
                border: "none", borderRadius: 6, padding: "3px 8px",
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3,
              }}>
                <Sparkles size={11} />
                AI 扩充
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
