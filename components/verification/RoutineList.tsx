"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Paperclip,
  CalendarDays,
  User,
  BookOpen,
} from "lucide-react";
import { DueTag, NextDateText } from "./Badges";
import type { RoutinePeriod, RoutineTask } from "./types";

export type RoutineFilter = "all" | RoutinePeriod;
export type RoutineStat = "all" | "due-soon" | "overdue" | "today";

export interface RoutineListProps {
  tasks: RoutineTask[] | null;
  periodFilter: RoutineFilter;
  onPeriodFilterChange: (f: RoutineFilter) => void;
  statFilter: RoutineStat;
  onStatFilterChange: (s: RoutineStat) => void;
}

const PERIOD_FILTERS: { key: RoutineFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "daily", label: "日" },
  { key: "weekly", label: "周" },
  { key: "monthly", label: "月" },
  { key: "quarterly", label: "季" },
];

const PERIOD_LABEL: Record<RoutinePeriod, { label: string; bg: string; color: string }> = {
  daily: { label: "日", bg: "#e6f4ff", color: "#1677ff" },
  weekly: { label: "周", bg: "#f0fff4", color: "#389e0d" },
  monthly: { label: "月", bg: "#fff7e0", color: "#d46b08" },
  quarterly: { label: "季", bg: "#f5f0ff", color: "#531dab" },
};

export default function RoutineList({
  tasks,
  periodFilter,
  onPeriodFilterChange,
  statFilter,
  onStatFilterChange,
}: RoutineListProps) {
  const router = useRouter();

  const source = tasks ?? [];
  let filtered = periodFilter === "all"
    ? source
    : source.filter((t) => t.period === periodFilter);

  if (statFilter === "today") {
    filtered = filtered.filter((t) => t.period === "daily");
  } else if (statFilter === "due-soon") {
    filtered = filtered.filter(
      (t) => t.dueLevel === "very-soon" || t.dueLevel === "soon"
    );
  } else if (statFilter === "overdue") {
    filtered = filtered.filter((t) => t.dueLevel === "overdue");
  }

  return (
    <>
      {/* Filter pills */}
      <div
        style={{
          padding: "12px 14px 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {PERIOD_FILTERS.map(({ key, label }) => {
          const isActive = periodFilter === key;
          return (
            <button
              key={key}
              onClick={() => onPeriodFilterChange(key)}
              style={{
                padding: "5px 16px",
                borderRadius: 20,
                fontSize: 13,
                border: isActive ? "1px solid #0d52c4" : "1px solid #e0e7ef",
                background: isActive ? "#0d52c4" : "#fff",
                color: isActive ? "#fff" : "#6b7a8c",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* List header */}
      <div
        style={{
          padding: "14px 14px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
            定期工作台账
          </span>
          <span
            style={{
              background: "#0d52c4",
              color: "#fff",
              fontSize: 11,
              padding: "1px 7px",
              borderRadius: 10,
            }}
          >
            {filtered.length}
          </span>
          {statFilter !== "all" && (
            <button
              onClick={() => onStatFilterChange("all")}
              style={{
                background: "#f0f4f8",
                border: "none",
                borderRadius: 6,
                padding: "2px 7px",
                fontSize: 11,
                color: "#6b7a8c",
                cursor: "pointer",
              }}
            >
              清除筛选
            </button>
          )}
        </div>
        <Link
          href="/verification/standards"
          style={{
            background: "#fff",
            color: "#0d52c4",
            border: "1px solid #d6e4ff",
            borderRadius: 16,
            padding: "5px 10px",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            textDecoration: "none",
          }}
        >
          <BookOpen size={12} color="#0d52c4" />
          核验标准
        </Link>
      </div>

      {/* Routine cards */}
      <div
        style={{ margin: "0 14px", display: "flex", flexDirection: "column", gap: 10 }}
      >
        {tasks === null ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "#8090a8",
              fontSize: 13,
            }}
          >
            加载中…
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "#8090a8",
              fontSize: 13,
            }}
          >
            暂无匹配的任务
          </div>
        ) : (
          filtered.map((task) => {
            const periodCfg = PERIOD_LABEL[task.period];
            const showDueTag = task.period !== "daily";
            return (
              <div
                key={task.id}
                onClick={() => router.push(`/verification/routine/${task.id}`)}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                  border:
                    task.dueLevel === "overdue" || task.dueLevel === "very-soon"
                      ? "1px solid #ffccc7"
                      : task.dueLevel === "soon"
                      ? "1px solid #ffe7ba"
                      : "1px solid #ebeef2",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    padding: "12px 14px",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: periodCfg.bg,
                      color: periodCfg.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {periodCfg.label}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1a1a1a",
                        marginBottom: 4,
                      }}
                    >
                      {task.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        fontSize: 11,
                        color: "#8090a8",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <User size={11} color="#8090a8" />
                        {task.owner}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Paperclip size={11} color="#8090a8" />
                        {task.attachmentCount} 份附件
                      </span>
                    </div>
                    <span
                      style={{
                        background: "#f5f7fa",
                        color: "#6b7a8c",
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 8,
                      }}
                    >
                      {task.category}
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    color="#bfcbd9"
                    style={{ marginTop: 8, flexShrink: 0 }}
                  />
                </div>
                <div
                  style={{
                    borderTop: "1px dashed #ebeef2",
                    padding: "8px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#fafbfc",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#8090a8",
                    }}
                  >
                    <CalendarDays size={12} color="#8090a8" />
                    上次：{task.lastCompleted}
                  </span>
                  {showDueTag ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <NextDateText
                        level={task.dueLevel}
                        date={task.nextDue}
                        prefix="下次"
                      />
                      <DueTag level={task.dueLevel} label={task.dueLabel} />
                    </div>
                  ) : (
                    <span
                      style={{
                        background: "#f0f5ff",
                        color: "#2f54eb",
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 8,
                        fontWeight: 500,
                      }}
                    >
                      每日（不提醒）
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
