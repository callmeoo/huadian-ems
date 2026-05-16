"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  CalendarDays,
  User,
  Bell,
  FileText,
  Download,
  Clock,
  History,
  BookText,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import { DueTag } from "@/components/verification/Badges";
import type { RoutineDetail, RoutinePeriod } from "@/components/verification/types";

const PERIOD_LABEL: Record<RoutinePeriod, { label: string; bg: string; color: string; cn: string }> = {
  daily: { label: "日", bg: "#e6f4ff", color: "#1677ff", cn: "每日" },
  weekly: { label: "周", bg: "#f0fff4", color: "#389e0d", cn: "每周" },
  monthly: { label: "月", bg: "#fff7e0", color: "#d46b08", cn: "每月" },
  quarterly: { label: "季", bg: "#f5f0ff", color: "#531dab", cn: "每季" },
};

const FILE_ICON_BG: Record<string, string> = {
  pdf: "#fff1f0",
  excel: "#f0fff4",
  doc: "#e6f4ff",
  image: "#fff7e0",
};
const FILE_ICON_COLOR: Record<string, string> = {
  pdf: "#cf1322",
  excel: "#389e0d",
  doc: "#1677ff",
  image: "#d46b08",
};

export default function RoutineDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const taskId = Number(params?.id);

  const [task, setTask] = useState<RoutineDetail | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (Number.isNaN(taskId)) {
      setLoadError(true);
      return;
    }
    fetch(`/api/verification/routine/${taskId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: RoutineDetail) => setTask(data))
      .catch(() => setLoadError(true));
  }, [taskId]);

  if (loadError) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#8090a8" }}>
        任务不存在
        <button
          onClick={() => router.back()}
          style={{
            marginTop: 12,
            background: "#0d52c4",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            display: "block",
            marginInline: "auto",
          }}
        >
          返回
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#8090a8", fontSize: 13 }}>
        加载中…
      </div>
    );
  }

  const periodCfg = PERIOD_LABEL[task.period];
  const showDueTag = task.period !== "daily";

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -60,
            width: 280,
            height: 280,
            background:
              "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Topbar */}
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
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              padding: 0,
            }}
          >
            <ChevronLeft size={24} color="#fff" />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>
            定期工作详情
          </span>
        </div>

        {/* Task header */}
        <div
          style={{
            margin: "0 14px 18px",
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(6px)",
            borderRadius: 14,
            padding: "14px",
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#fff",
              color: periodCfg.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {periodCfg.label}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 4,
              }}
            >
              {task.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                marginBottom: 6,
              }}
            >
              {periodCfg.cn} · {task.category}
            </div>
            {showDueTag && (
              <DueTag level={task.dueLevel} label={task.dueLabel} />
            )}
            {!showDueTag && (
              <span
                style={{
                  background: "rgba(255,255,255,0.22)",
                  color: "#fff",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 8,
                  fontWeight: 500,
                }}
              >
                每日 · 不额外提醒
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Basic info */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 3,
                height: 14,
                background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
              任务信息
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <InfoRow
              Icon={User}
              k="责任人"
              v={task.owner}
            />
            <InfoRow
              Icon={Bell}
              k="提醒规则"
              v={task.frequencyText}
            />
            <InfoRow
              Icon={CalendarDays}
              k="上次完成"
              v={task.lastCompleted}
            />
            {showDueTag && (
              <InfoRow
                Icon={Clock}
                k="下次到期"
                v={task.nextDue}
                emphasize={task.dueLevel === "very-soon" || task.dueLevel === "overdue"}
              />
            )}
            <InfoRow Icon={BookText} k="依据" v={task.basis} />
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 3,
                height: 14,
                background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
              工作说明
            </span>
          </div>
          <div style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.7 }}>
            {task.description}
          </div>
        </div>

        {/* Attachments */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 3,
                height: 14,
                background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
              相关附件
            </span>
            <span style={{ fontSize: 11, color: "#8090a8" }}>
              共 {task.attachments.length} 份
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {task.attachments.map((att) => (
              <div
                key={att.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  background: "#f5f7fa",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: FILE_ICON_BG[att.type] ?? "#e6f4ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={14} color={FILE_ICON_COLOR[att.type] ?? "#1677ff"} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#1a1a1a",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {att.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#8090a8", marginTop: 2 }}>
                    {att.size} · {att.type.toUpperCase()}
                  </div>
                </div>
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#1677ff",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 11,
                  }}
                >
                  <Download size={12} color="#1677ff" />
                  下载
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 3,
                height: 14,
                background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
              历史完成记录
            </span>
            <History size={12} color="#8090a8" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {task.history.map((h, i) => (
              <div
                key={i}
                style={{
                  borderLeft: "2px solid #d6e4ff",
                  paddingLeft: 12,
                  paddingBottom: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#1a1a1a",
                    lineHeight: 1.55,
                    marginBottom: 4,
                  }}
                >
                  {h.note}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#8090a8",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Clock size={10} color="#8090a8" />
                  {h.actor} · {h.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
}

function InfoRow({
  Icon,
  k,
  v,
  emphasize,
}: {
  Icon: typeof User;
  k: string;
  v: string;
  emphasize?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <Icon size={14} color="#8090a8" style={{ marginTop: 2, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#8090a8", flexShrink: 0, minWidth: 56 }}>
          {k}
        </span>
        <span
          style={{
            fontSize: 12,
            color: emphasize ? "#cf1322" : "#1a1a1a",
            fontWeight: emphasize ? 600 : 500,
            lineHeight: 1.5,
          }}
        >
          {v}
        </span>
      </div>
    </div>
  );
}
