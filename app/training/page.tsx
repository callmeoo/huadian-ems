"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, FolderOpen, Landmark, FileText,
  Library, Upload, X, CheckCircle,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import RoleSwitcher from "@/components/training/RoleSwitcher";
import EmployeeTrainingView from "@/components/training/EmployeeTrainingView";
import LeaderTrainingView from "@/components/training/LeaderTrainingView";
import ConfigTrainingView from "@/components/training/ConfigTrainingView";
import FailedExamModal from "@/components/training/FailedExamModal";
import {
  DEMO_USERS, ROLE_LABEL, type TrainingRole,
  MY_SCORE_SUMMARY, MY_TRAININGS,
  STAFF_PARTICIPATION, TRAINING_RECORDS,
  FAILED_EXAM_RECORDS,
  CONFIG_TASKS, TOTAL_QUESTIONS, QUESTION_CATEGORIES,
} from "@/lib/mock/training";

const STORAGE_KEY = "training.demo.role.v1";

export default function TrainingPage() {
  const router = useRouter();
  const [role, setRole] = useState<TrainingRole>("employee");
  const [activeTab, setActiveTab] = useState<0 | 1>(1); // 默认进「培训考试」
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadState, setUploadState] = useState<"idle" | "preview" | "success">("idle");
  const [failedModalOpen, setFailedModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hydrated = useRef(false);

  // 持久化演示角色
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "employee" || raw === "leader" || raw === "config") {
        setRole(raw);
      }
    } catch { /* noop */ }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try { localStorage.setItem(STORAGE_KEY, role); } catch { /* noop */ }
  }, [role]);

  const user = DEMO_USERS[role];

  type HeroStat = {
    label: string;
    val: string | number;
    hint: string;
    onClick?: () => void;
    danger?: boolean;
  };

  // Hero 区不同角色看到的概览指标
  const heroStats: HeroStat[] = (() => {
    if (role === "employee") {
      const pending = MY_TRAININGS.filter((t) => t.status === "available" || t.status === "ongoing").length;
      return [
        { label: "平均分", val: MY_SCORE_SUMMARY.avg, hint: "本年度" },
        { label: "已完成", val: MY_SCORE_SUMMARY.completed, hint: "次培训" },
        { label: "待参加", val: pending, hint: "项任务" },
      ];
    }
    if (role === "leader") {
      const fully = STAFF_PARTICIPATION.filter((s) => s.completed === s.required).length;
      const rate = Math.round((fully / STAFF_PARTICIPATION.length) * 100);
      const failedCount = FAILED_EXAM_RECORDS.length;
      return [
        {
          label: "考试不合格",
          val: failedCount,
          hint: `/ ${STAFF_PARTICIPATION.length} 人在册`,
          onClick: () => setFailedModalOpen(true),
          danger: failedCount > 0,
        },
        { label: "完成率", val: `${rate}%`, hint: "全员培训" },
        { label: "进行中", val: TRAINING_RECORDS.filter((t) => t.status === "ongoing").length, hint: "项培训" },
      ];
    }
    return [
      { label: "题库", val: TOTAL_QUESTIONS, hint: `${QUESTION_CATEGORIES.length} 分类` },
      { label: "待办", val: CONFIG_TASKS.length, hint: "需处理" },
      { label: "AI 草稿", val: 12, hint: "待审核" },
    ];
  })();

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Hero：渐变 + 点阵 + 光晕 + 返回 + 标题 + 角色切换 */}
      <div style={{
        background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
        position: "relative",
        overflow: "hidden",
        paddingBottom: 16,
      }}>
        {/* 点阵 */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.4, pointerEvents: "none",
        }} />
        {/* 光晕 */}
        <div style={{
          position: "absolute", top: -80, left: -60,
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* 顶部导航行：返回 + 标题 + 角色切换 */}
        <div style={{
          position: "relative", zIndex: 5,
          height: 44, display: "flex", alignItems: "center",
          padding: "0 14px", gap: 8,
        }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", padding: 4 }}
          >
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", flex: 1 }}>培训考试</span>
          <RoleSwitcher value={role} onChange={setRole} />
        </div>

        {/* 当前演示账号 */}
        <div style={{
          position: "relative", zIndex: 5,
          padding: "6px 16px 12px",
          display: "flex", alignItems: "center", gap: 8,
          color: "rgba(255,255,255,0.85)", fontSize: 12,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 8, padding: "2px 8px",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00e87a" }} />
            演示账号 · {user.name} · {user.dept}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
            视角：{ROLE_LABEL[role]}
          </span>
        </div>

        {/* 概览指标 */}
        <div style={{
          position: "relative", zIndex: 5,
          margin: "0 16px",
          display: "grid", gridTemplateColumns: `repeat(${heroStats.length}, 1fr)`, gap: 8,
        }}>
          {heroStats.map((s) => {
            const clickable = !!s.onClick;
            const isDanger = !!s.danger;
            return (
              <div
                key={s.label}
                onClick={s.onClick}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={clickable ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    s.onClick?.();
                  }
                } : undefined}
                style={{
                  background: isDanger ? "rgba(255,80,80,0.18)" : "rgba(255,255,255,0.1)",
                  border: `1px solid ${isDanger ? "rgba(255,140,140,0.45)" : "rgba(255,255,255,0.16)"}`,
                  borderRadius: 10,
                  padding: "10px 8px 8px",
                  textAlign: "center",
                  cursor: clickable ? "pointer" : "default",
                  position: "relative",
                  transition: "background 0.15s, border-color 0.15s",
                }}
              >
                <div style={{
                  fontSize: 22, fontWeight: 700,
                  color: isDanger ? "#ffd2cf" : "#fff",
                  lineHeight: 1.1,
                }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.78)", marginTop: 3 }}>
                  {s.label}
                  {clickable && (
                    <span style={{ marginLeft: 3, fontSize: 10, opacity: 0.7 }}>›</span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{s.hint}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 子 Tab：制度法规 / 培训考试 */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ebeef2", display: "flex" }}>
        {(["制度法规", "培训考试"] as const).map((tab, i) => {
          const isActive = activeTab === i;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(i as 0 | 1)}
              style={{
                flex: 1, textAlign: "center",
                padding: "11px 0 10px",
                fontSize: 14, fontWeight: isActive ? 600 : 400,
                color: isActive ? "#0d52c4" : "#6b7a8c",
                border: "none", background: "transparent",
                cursor: "pointer", position: "relative", outline: "none",
              }}
            >
              {tab}
              {isActive && (
                <span style={{
                  position: "absolute", bottom: 0, left: "20%", right: "20%",
                  height: 2, background: "#0d52c4", borderRadius: 1,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel 0: 制度法规（与角色无关，所有人可见） */}
      {activeTab === 0 && (
        <RegulationsPanel
          fileInputRef={fileInputRef}
          onPickFile={(files) => {
            if (files.length > 0) {
              setUploadFiles(files);
              setUploadState("preview");
            }
          }}
          onOpenFolder={(slug) => router.push(`/training/folder/${slug}`)}
        />
      )}

      {/* Panel 1: 培训考试（按角色分发） */}
      {activeTab === 1 && (
        role === "employee" ? <EmployeeTrainingView /> :
        role === "leader" ? <LeaderTrainingView /> :
        <ConfigTrainingView />
      )}

      <TabBar />

      {/* 考试不合格明细（领导视角，Hero 点击触发） */}
      <FailedExamModal
        open={failedModalOpen}
        onClose={() => setFailedModalOpen(false)}
        totalStaff={STAFF_PARTICIPATION.length}
      />

      {/* 文件上传预览（仅制度法规） */}
      {uploadState === "preview" && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "flex-end" }}
          onClick={() => { setUploadState("idle"); setUploadFiles([]); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", background: "#fff", borderRadius: "16px 16px 0 0", padding: "20px 16px 32px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>
                准备上传 {uploadFiles.length} 个文件
              </span>
              <button
                onClick={() => { setUploadState("idle"); setUploadFiles([]); }}
                style={{ border: "none", background: "none", cursor: "pointer", padding: 4 }}
              >
                <X size={18} color="#6b7a8c" />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18, maxHeight: 200, overflowY: "auto" }}>
              {uploadFiles.map((f) => (
                <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#f5f7fa", borderRadius: 8 }}>
                  <FileText size={14} color="#1677ff" style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12, color: "#1a1a1a", wordBreak: "break-all" }}>{f.name}</span>
                  <span style={{ fontSize: 11, color: "#8090a8", flexShrink: 0 }}>{(f.size / 1024).toFixed(0)} KB</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setUploadState("success")}
              style={{
                width: "100%", background: "linear-gradient(90deg, #1677ff, #0d52c4)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}
            >
              确认上传
            </button>
          </div>
        </div>
      )}

      {uploadState === "success" && (
        <div style={{
          position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)",
          background: "#fff", border: "1px solid #b7eb8f", borderRadius: 10,
          padding: "10px 16px", display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 300,
        }}>
          <CheckCircle size={16} color="#52c41a" />
          <span style={{ fontSize: 13, color: "#1a1a1a" }}>上传成功，文件已入库</span>
          <button
            onClick={() => { setUploadState("idle"); setUploadFiles([]); }}
            style={{ border: "none", background: "none", cursor: "pointer", padding: 0, marginLeft: 4 }}
          >
            <X size={14} color="#8090a8" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── 制度法规面板（与原有功能一致，保持不变） ────────────────────────────

function RegulationsPanel({
  fileInputRef, onPickFile, onOpenFolder,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onPickFile: (files: File[]) => void;
  onOpenFolder: (slug: string) => void;
}) {
  return (
    <div>
      <div style={{ padding: "16px 14px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Library size={16} color="#1677ff" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>法规文件库</span>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: "#e6f0ff", color: "#0d52c4", borderRadius: 14,
            padding: "4px 10px", fontSize: 12, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4, fontWeight: 500,
          }}
        >
          <Upload size={12} color="#0d52c4" />
          上传文件
        </button>
        <input
          ref={fileInputRef}
          type="file" multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          style={{ display: "none" }}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            onPickFile(files);
            e.target.value = "";
          }}
        />
      </div>

      <div style={{ margin: "0 14px 80px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Folder 1 */}
        <FolderCard
          title="集团及上级公司环保制度"
          subtitle="华电集团 / 新能源公司内部环保管理制度"
          count={14}
          accent="#0d52c4"
          accentBg="#e6f4ff"
          icon={<FolderOpen size={22} color="#0d52c4" />}
          docs={[
            { name: "华电集团环境保护管理办法（2024修订版）", date: "2024-03" },
            { name: "新能源公司环保合规操作指南 V3.0", date: "2025-01" },
          ]}
          onOpen={() => onOpenFolder("internal")}
        />
        {/* Folder 2 */}
        <FolderCard
          title="国家环保法律法规及规范"
          subtitle="环保法、排污许可、大气水土污染防治"
          count={32}
          accent="#52c41a"
          accentBg="#f6ffed"
          icon={<Landmark size={22} color="#52c41a" />}
          docs={[
            { name: "中华人民共和国环境保护法（2014修订）", date: "2014-04" },
            { name: "固定污染源排污许可分类管理名录（2023）", date: "2023-06" },
            { name: "火电厂大气污染物排放标准 GB13271-2014", date: "2014-07" },
          ]}
          onOpen={() => onOpenFolder("national")}
        />
      </div>
    </div>
  );
}

function FolderCard({
  title, subtitle, count, accent, accentBg, icon, docs, onOpen,
}: {
  title: string; subtitle: string; count: number;
  accent: string; accentBg: string;
  icon: React.ReactNode;
  docs: { name: string; date: string }[];
  onOpen: () => void;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
      border: "1px solid #ebeef2", overflow: "hidden",
    }}>
      <div
        onClick={onOpen}
        style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: accentBg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 3 }}>{title}</div>
          <div style={{ fontSize: 11, color: "#8090a8" }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            background: accentBg, color: accent,
            fontSize: 12, fontWeight: 600,
            padding: "2px 8px", borderRadius: 8,
          }}>{count}份</span>
          <ChevronRight size={16} color="#bfcbd9" />
        </div>
      </div>
      <div style={{ borderTop: "1px dashed #ebeef2" }}>
        {docs.map((doc) => (
          <div
            key={doc.name}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 14px",
              borderBottom: "1px solid #f0f3f7",
            }}
          >
            <FileText size={14} color="#8090a8" style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 12, color: "#1a1a1a" }}>{doc.name}</span>
            <span style={{ fontSize: 11, color: "#8090a8", flexShrink: 0 }}>{doc.date}</span>
          </div>
        ))}
        <div style={{ padding: "9px 14px" }}>
          <span
            onClick={onOpen}
            style={{ fontSize: 12, color: "#1677ff", cursor: "pointer" }}
          >
            查看全部 {count} 份文件 →
          </span>
        </div>
      </div>
    </div>
  );
}
