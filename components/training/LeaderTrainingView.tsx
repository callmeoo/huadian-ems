"use client";

import {
  Library, ClipboardList, Users, PieChart, ChevronRight,
  Award, CheckCircle2, AlertTriangle, Clock,
} from "lucide-react";
import {
  QUESTION_CATEGORIES, TOTAL_QUESTIONS,
  TRAINING_RECORDS, STAFF_PARTICIPATION,
  SCORE_DISTRIBUTION, SCORE_DIST_META,
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

const STATUS_BADGE = {
  good:   { label: "正常",     color: "#389e0d", bg: "#f0fff4" },
  warn:   { label: "有未完成", color: "#d46b08", bg: "#fff7e0" },
  danger: { label: "需督促",   color: "#cf1322", bg: "#fff1f0" },
} as const;

export default function LeaderTrainingView() {
  const totalStaff = STAFF_PARTICIPATION.length;
  const fullyCompleted = STAFF_PARTICIPATION.filter((s) => s.completed === s.required).length;
  const completionRate = Math.round((fullyCompleted / totalStaff) * 100);
  const maxDistCount = Math.max(...SCORE_DISTRIBUTION.map((d) => d.count));

  return (
    <div style={{ padding: "14px 14px 80px", display: "flex", flexDirection: "column", gap: 18 }}>

      {/* 顶部概览 */}
      <div
        style={{
          ...cardStyle,
          padding: "14px 14px 12px",
          background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4,
        }}
      >
        {[
          { label: "在册员工",   val: totalStaff, color: "#1a1a1a" },
          { label: "全部完成",   val: fullyCompleted, color: "#52c41a" },
          { label: "完成率",     val: `${completionRate}%`, color: "#0d52c4" },
          { label: "进行中培训", val: TRAINING_RECORDS.filter((t) => t.status === "ongoing").length, color: "#d46b08" },
        ].map((m, i) => (
          <div key={m.label} style={{ textAlign: "center", borderRight: i < 3 ? "1px solid #e5ecf5" : undefined }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: m.color, lineHeight: 1.1 }}>{m.val}</div>
            <div style={{ fontSize: 11, color: "#8090a8", marginTop: 3 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* 1. 整体题库 */}
      <section>
        <SectionHeader
          icon={<Library size={15} />}
          title="整体题库"
          right={<span style={{ fontSize: 11, color: "#1677ff", cursor: "pointer" }}>查看全部 ›</span>}
        />
        <div style={{ ...cardStyle, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#0d52c4", lineHeight: 1 }}>{TOTAL_QUESTIONS}</span>
              <span style={{ fontSize: 12, color: "#6b7a8c", marginLeft: 6 }}>题 / {QUESTION_CATEGORIES.length} 个分类</span>
            </div>
            <span style={{ fontSize: 11, color: "#52c41a", background: "#f0fff4", padding: "2px 8px", borderRadius: 8 }}>
              本月新增 18 题
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {QUESTION_CATEGORIES.map((c) => {
              const pct = Math.round((c.count / TOTAL_QUESTIONS) * 100);
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 96, fontSize: 12, color: "#1a1a1a", flexShrink: 0 }}>{c.name}</span>
                  <div style={{ flex: 1, height: 8, background: "#eef1f5", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: "linear-gradient(90deg, #1677ff, #40a9ff)", borderRadius: 4,
                    }} />
                  </div>
                  <span style={{ width: 44, textAlign: "right", fontSize: 12, color: "#6b7a8c", flexShrink: 0 }}>
                    {c.count} 题
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. 培训记录 */}
      <section>
        <SectionHeader
          icon={<ClipboardList size={15} />}
          title="培训记录"
          right={<span style={{ fontSize: 11, color: "#8090a8" }}>近 12 个月</span>}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TRAINING_RECORDS.map((r) => {
            const isOngoing = r.status === "ongoing";
            return (
              <div key={r.id} style={{ ...cardStyle, overflow: "hidden" }}>
                <div style={{ display: "flex", padding: "12px 14px 10px", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: isOngoing
                      ? "linear-gradient(135deg, #fa8c16, #ffa940)"
                      : "linear-gradient(135deg, #1677ff, #0d52c4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isOngoing
                      ? <Clock size={18} color="#fff" />
                      : <Award size={18} color="#fff" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: "#8090a8" }}>{r.date}</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    color: isOngoing ? "#d46b08" : "#389e0d",
                  }}>
                    {isOngoing ? "进行中" : "已完成"}
                  </span>
                  <ChevronRight size={16} color="#bfcbd9" />
                </div>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                  borderTop: "1px dashed #ebeef2", background: "#fafbfc",
                }}>
                  {[
                    { val: `${r.finished}/${r.participants}`, label: "完成 / 参与" },
                    { val: isOngoing && r.avgScore === 0 ? "—" : `${r.avgScore} 分`, label: "平均分", color: "#0d52c4" },
                    { val: isOngoing && r.passRate === 0 ? "—" : `${r.passRate}%`, label: "通过率", color: r.passRate >= 85 ? "#52c41a" : "#fa8c16" },
                  ].map((m, i) => (
                    <div key={m.label} style={{
                      textAlign: "center", padding: "8px 4px",
                      borderRight: i < 2 ? "1px solid #ebeef2" : undefined,
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: m.color ?? "#1a1a1a", lineHeight: 1, marginBottom: 3 }}>{m.val}</div>
                      <div style={{ fontSize: 10, color: "#8090a8" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 人员参与情况 */}
      <section>
        <SectionHeader
          icon={<Users size={15} />}
          title="人员参与情况"
          right={
            <span style={{ fontSize: 11, color: "#cf1322", background: "#fff1f0", padding: "1px 6px", borderRadius: 6 }}>
              {STAFF_PARTICIPATION.filter((s) => s.status !== "good").length} 人需关注
            </span>
          }
        />
        <div style={cardStyle}>
          {STAFF_PARTICIPATION.map((s, i) => {
            const badge = STATUS_BADGE[s.status];
            const StatusIcon = s.status === "good" ? CheckCircle2 : AlertTriangle;
            return (
              <div
                key={s.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 14px",
                  borderBottom: i < STAFF_PARTICIPATION.length - 1 ? "1px solid #f0f3f7" : "none",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: "#e6f4ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#0d52c4", fontSize: 12, fontWeight: 600,
                }}>{s.name.slice(0, 1)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 2 }}>
                    {s.name} <span style={{ fontSize: 11, color: "#8090a8", fontWeight: 400 }}>· {s.dept}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#8090a8" }}>
                    完成 {s.completed}/{s.required} · 平均 {s.avgScore} 分
                  </div>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11, fontWeight: 500,
                  color: badge.color, background: badge.bg,
                  padding: "2px 8px", borderRadius: 8,
                }}>
                  <StatusIcon size={11} />
                  {badge.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. 整体成绩分布 */}
      <section>
        <SectionHeader icon={<PieChart size={15} />} title="考试成绩分布" />
        <div style={{ ...cardStyle, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{SCORE_DIST_META.trainingTitle}</span>
            <span style={{ fontSize: 11, color: "#8090a8" }}>共 {SCORE_DIST_META.totalParticipants} 人</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 14 }}>
            {[
              { label: "平均分", val: SCORE_DIST_META.avgScore, color: "#0d52c4" },
              { label: "通过率", val: `${SCORE_DIST_META.passRate}%`, color: "#52c41a" },
              { label: "优秀率", val: `${Math.round((6 / SCORE_DIST_META.totalParticipants) * 100)}%`, color: "#fa8c16" },
            ].map((m) => (
              <div key={m.label} style={{
                textAlign: "center", padding: "8px 4px",
                background: "#f5f9ff", borderRadius: 8,
              }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: m.color, lineHeight: 1.1 }}>{m.val}</div>
                <div style={{ fontSize: 10, color: "#8090a8", marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SCORE_DISTRIBUTION.map((d) => {
              const pct = maxDistCount === 0 ? 0 : Math.round((d.count / maxDistCount) * 100);
              return (
                <div key={d.range} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 42, textAlign: "right", fontSize: 11, color: "#6b7a8c", flexShrink: 0 }}>{d.range}</span>
                  <div style={{ flex: 1, height: 10, background: "#eef1f5", borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: d.color, borderRadius: 5 }} />
                  </div>
                  <span style={{ width: 32, fontSize: 11, color: "#6b7a8c", flexShrink: 0 }}>{d.count} 人</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
