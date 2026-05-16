"use client";

import {
  BookOpen, Clock, Award, ChevronRight, CalendarClock, AlertCircle,
  CheckCircle2, Trophy, TrendingUp, Library,
} from "lucide-react";
import {
  MY_TRAININGS, MY_SCORES, MY_SCORE_SUMMARY,
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

export default function EmployeeTrainingView() {
  const available = MY_TRAININGS.filter((t) => t.status === "available");
  const ongoing = MY_TRAININGS.filter((t) => t.status === "ongoing");
  const optional = [...ongoing, ...available];
  const history = MY_TRAININGS.filter((t) => t.status === "completed");

  return (
    <div style={{ padding: "14px 14px 80px", display: "flex", flexDirection: "column", gap: 18 }}>

      {/* 1. 当前可选培训 */}
      <section>
        <SectionHeader
          icon={<CalendarClock size={15} />}
          title="当前可选培训"
          right={<span style={{ fontSize: 11, color: "#8090a8" }}>{optional.length} 项待参加</span>}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {optional.map((t) => {
            const isOngoing = t.status === "ongoing";
            return (
              <div key={t.id} style={cardStyle}>
                <div style={{ padding: "12px 14px 10px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: isOngoing ? "#fff7e0" : "#e6f4ff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {isOngoing
                        ? <AlertCircle size={20} color="#d46b08" />
                        : <BookOpen size={20} color="#1677ff" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.3 }}>{t.title}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
                        {t.required && (
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#cf1322", background: "#fff1f0", padding: "1px 6px", borderRadius: 4 }}>必修</span>
                        )}
                        {isOngoing && (
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#d46b08", background: "#fff7e0", padding: "1px 6px", borderRadius: 4 }}>进行中</span>
                        )}
                        <span style={{ fontSize: 10, color: "#6b7a8c", background: "#f5f7fa", padding: "1px 6px", borderRadius: 4 }}>{t.category}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#8090a8" }}>
                        截止 {t.deadline} · {t.questionCount} 题 · {t.duration} · 及格 {t.passScore} 分
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    borderTop: "1px dashed #ebeef2",
                    padding: "9px 14px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 12, color: isOngoing ? "#d46b08" : "#1677ff", fontWeight: 600 }}>
                    {isOngoing ? "继续作答" : "开始培训"}
                  </span>
                  <ChevronRight size={16} color="#bfcbd9" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. 个人成绩 */}
      <section>
        <SectionHeader icon={<Trophy size={15} />} title="个人成绩" />

        {/* 概览卡 */}
        <div
          style={{
            ...cardStyle,
            padding: "14px 14px 12px",
            marginBottom: 10,
            background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
            {[
              { label: "平均分", val: MY_SCORE_SUMMARY.avg, color: "#0d52c4" },
              { label: "最高分", val: MY_SCORE_SUMMARY.best, color: "#52c41a" },
              { label: "已完成", val: MY_SCORE_SUMMARY.completed, color: "#1a1a1a" },
              { label: "通过", val: MY_SCORE_SUMMARY.passed, color: "#1a1a1a" },
            ].map((m, i) => (
              <div key={m.label} style={{
                textAlign: "center",
                borderRight: i < 3 ? "1px solid #e5ecf5" : undefined,
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: m.color, lineHeight: 1.1 }}>{m.val}</div>
                <div style={{ fontSize: 11, color: "#8090a8", marginTop: 3 }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#389e0d" }}>
            <TrendingUp size={13} />
            较去年同期 +6 分
          </div>
        </div>

        {/* 历次明细 */}
        <div style={cardStyle}>
          {MY_SCORES.map((s, i) => (
            <div
              key={s.trainingId}
              style={{
                padding: "12px 14px",
                borderBottom: i < MY_SCORES.length - 1 ? "1px solid #f0f3f7" : "none",
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 3 }}>{s.trainingTitle}</div>
                <div style={{ fontSize: 11, color: "#8090a8" }}>
                  {s.finishedAt} · 用时 {s.durationUsed} · 排名 {s.rank}/{s.total}
                </div>
              </div>
              <div
                style={{
                  minWidth: 52, padding: "4px 10px", borderRadius: 10,
                  background: s.score >= 90 ? "#f0fff4" : s.score >= 80 ? "#e6f4ff" : "#fff7e0",
                  color: s.score >= 90 ? "#389e0d" : s.score >= 80 ? "#0d52c4" : "#d46b08",
                  fontSize: 15, fontWeight: 700, textAlign: "center",
                }}
              >
                {s.score}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 已参与的培训 */}
      <section>
        <SectionHeader
          icon={<CheckCircle2 size={15} />}
          title="已参与的培训"
          right={<span style={{ fontSize: 11, color: "#8090a8" }}>{history.length} 次</span>}
        />
        <div style={cardStyle}>
          {history.map((t, i) => {
            const score = MY_SCORES.find((s) => s.trainingId === t.id);
            return (
              <div
                key={t.id}
                style={{
                  padding: "11px 14px",
                  borderBottom: i < history.length - 1 ? "1px solid #f0f3f7" : "none",
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: "#f0fff4",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Award size={18} color="#389e0d" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 2 }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: "#8090a8" }}>
                    {t.category} · 完成 {score?.finishedAt.split(" ")[0] ?? t.deadline}
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#389e0d", flexShrink: 0 }}>已通过</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. 题库（自主练习） */}
      <section>
        <SectionHeader
          icon={<Library size={15} />}
          title="题库（可自主练习）"
          right={<span style={{ fontSize: 11, color: "#8090a8" }}>共 {TOTAL_QUESTIONS} 题</span>}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {QUESTION_CATEGORIES.map((c) => (
            <div
              key={c.id}
              style={{
                ...cardStyle,
                padding: "12px 12px 10px",
                cursor: "pointer",
              }}
            >
              <div style={{
                display: "inline-flex",
                fontSize: 10, fontWeight: 600,
                color: c.difficulty === "难" ? "#cf1322" : c.difficulty === "中" ? "#d46b08" : "#389e0d",
                background: c.difficulty === "难" ? "#fff1f0" : c.difficulty === "中" ? "#fff7e0" : "#f0fff4",
                padding: "1px 6px", borderRadius: 4, marginBottom: 6,
              }}>{c.difficulty}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 4, lineHeight: 1.3 }}>{c.name}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#8090a8" }}>{c.count} 题</span>
                <span style={{ fontSize: 11, color: "#1677ff", fontWeight: 500 }}>开始练习 ›</span>
              </div>
              <div style={{ fontSize: 10, color: "#bfcbd9", marginTop: 4 }}>
                <Clock size={9} style={{ verticalAlign: -1, marginRight: 2 }} />
                更新于 {c.updatedAt}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
