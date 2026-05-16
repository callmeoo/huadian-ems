"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Library,
  Upload,
  FolderOpen,
  Landmark,
  FileText,
  ChevronRight,
  Zap,
  HelpCircle,
  Send,
  BarChart2,
  ClipboardList,
  PieChart,
  Award,
  Clock,
  GraduationCap,
  Sparkles,
  X,
  CheckCircle,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadState, setUploadState] = useState<"idle" | "preview" | "success">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", paddingBottom: 80 }}>
      {/* White topbar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #ebeef2",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 50,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", letterSpacing: 0.5 }}>
            培训
          </span>
          <Search size={20} color="#6b7a8c" />
        </div>
      </div>

      {/* Sub-tabs */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #ebeef2",
          display: "flex",
        }}
      >
        {(["制度法规", "培训考试"] as const).map((tab, i) => {
          const isActive = activeTab === i;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(i as 0 | 1)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "11px 0 10px",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#0d52c4" : "#6b7a8c",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {tab}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "20%",
                    right: "20%",
                    height: 2,
                    background: "#0d52c4",
                    borderRadius: 1,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel 0: 制度法规 */}
      {activeTab === 0 && (
        <div>
          {/* Section header */}
          <div
            style={{
              padding: "16px 14px 10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Library size={16} color="#1677ff" />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>法规文件库</span>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: "#e6f0ff",
                color: "#0d52c4",
                borderRadius: 14,
                padding: "4px 10px",
                fontSize: 12,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 500,
              }}
            >
              <Upload size={12} color="#0d52c4" />
              上传文件
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              style={{ display: "none" }}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length > 0) {
                  setUploadFiles(files);
                  setUploadState("preview");
                }
                e.target.value = "";
              }}
            />
          </div>

          {/* Folder cards */}
          <div style={{ margin: "0 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Folder 1 */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                border: "1px solid #ebeef2",
                overflow: "hidden",
              }}
            >
              <div
                onClick={() => router.push("/training/folder/internal")}
                style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#e6f4ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FolderOpen size={22} color="#0d52c4" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 3 }}>
                    集团及上级公司环保制度
                  </div>
                  <div style={{ fontSize: 11, color: "#8090a8" }}>
                    华电集团 / 新能源公司内部环保管理制度
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      background: "#e6f4ff",
                      color: "#0d52c4",
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 8,
                    }}
                  >
                    14份
                  </span>
                  <ChevronRight size={16} color="#bfcbd9" />
                </div>
              </div>
              <div style={{ borderTop: "1px dashed #ebeef2" }}>
                {[
                  { name: "华电集团环境保护管理办法（2024修订版）", date: "2024-03" },
                  { name: "新能源公司环保合规操作指南 V3.0", date: "2025-01" },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
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
                    onClick={() => router.push("/training/folder/internal")}
                    style={{ fontSize: 12, color: "#1677ff", cursor: "pointer" }}
                  >
                    查看全部 14 份文件 →
                  </span>
                </div>
              </div>
            </div>

            {/* Folder 2 */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                border: "1px solid #ebeef2",
                overflow: "hidden",
              }}
            >
              <div
                onClick={() => router.push("/training/folder/national")}
                style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#f6ffed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Landmark size={22} color="#52c41a" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 3 }}>
                    国家环保法律法规及规范
                  </div>
                  <div style={{ fontSize: 11, color: "#8090a8" }}>
                    环保法、排污许可、大气水土污染防治
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      background: "#f6ffed",
                      color: "#52c41a",
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 8,
                    }}
                  >
                    32份
                  </span>
                  <ChevronRight size={16} color="#bfcbd9" />
                </div>
              </div>
              <div style={{ borderTop: "1px dashed #ebeef2" }}>
                {[
                  { name: "中华人民共和国环境保护法（2014修订）", date: "2014-04" },
                  { name: "固定污染源排污许可分类管理名录（2023）", date: "2023-06" },
                  { name: "火电厂大气污染物排放标准 GB13271-2014", date: "2014-07" },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
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
                    onClick={() => router.push("/training/folder/national")}
                    style={{ fontSize: 12, color: "#1677ff", cursor: "pointer" }}
                  >
                    查看全部 32 份文件 →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel 1: 培训考试 */}
      {activeTab === 1 && (
        <div>
          {/* Quick actions header */}
          <div
            style={{
              padding: "16px 14px 10px",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Zap size={16} color="#1677ff" />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>快速操作</span>
          </div>

          {/* 2x2 grid */}
          <div
            style={{
              padding: "0 14px",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 10,
            }}
          >
            {/* 题库管理 */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                border: "1px solid #ebeef2",
                padding: 14,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#f5f0ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <HelpCircle size={20} color="#722ed1" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
                题库管理
              </div>
              <div style={{ fontSize: 11, color: "#8090a8", marginBottom: 6 }}>共 286 道题</div>
              <span
                style={{
                  background: "#f5f0ff",
                  color: "#722ed1",
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Sparkles size={10} color="#722ed1" />
                AI 自动生成
              </span>
            </div>

            {/* 发起培训 */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                border: "1px solid #ebeef2",
                padding: 14,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#fff7e6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Send size={20} color="#fa8c16" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
                发起培训
              </div>
              <div style={{ fontSize: 11, color: "#8090a8" }}>指定人员 · 设置时限</div>
            </div>

            {/* 成绩统计 */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                border: "1px solid #ebeef2",
                padding: 14,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#e6fffb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <BarChart2 size={20} color="#13c2c2" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
                成绩统计
              </div>
              <div style={{ fontSize: 11, color: "#8090a8" }}>人员 × 培训 × 分数</div>
            </div>

            {/* 培训记录 */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                border: "1px solid #ebeef2",
                padding: 14,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#e6f4ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <ClipboardList size={20} color="#0d52c4" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
                培训记录
              </div>
              <div style={{ fontSize: 11, color: "#8090a8" }}>历史培训档案</div>
            </div>
          </div>

          {/* Score chart section header */}
          <div
            style={{
              padding: "16px 14px 10px",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <PieChart size={16} color="#1677ff" />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>上次培训成绩分布</span>
          </div>

          {/* Score chart card */}
          <div
            style={{
              margin: "0 14px",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
              border: "1px solid #ebeef2",
              padding: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 14,
              }}
            >
              <Award size={16} color="#1677ff" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                2026年Q1 全员环保培训 · 平均 86 分
              </span>
            </div>

            {/* Bar chart */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "90+", pct: 50, color: "linear-gradient(90deg, #52c41a, #73d13d)", count: "6人" },
                { label: "80-89", pct: 33, color: "linear-gradient(90deg, #1677ff, #40a9ff)", count: "4人" },
                { label: "70-79", pct: 17, color: "linear-gradient(90deg, #fa8c16, #ffa940)", count: "2人" },
                { label: "60-69", pct: 8, color: "#f5222d", count: "1人" },
              ].map(({ label, pct, color, count }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span
                    style={{
                      width: 36,
                      textAlign: "right",
                      fontSize: 11,
                      color: "#6b7a8c",
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      background: "#eef1f5",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: color,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <span
                    style={{ width: 24, fontSize: 11, color: "#6b7a8c", flexShrink: 0 }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent training header */}
          <div
            style={{
              padding: "16px 14px 10px",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Clock size={16} color="#1677ff" />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>近期培训</span>
          </div>

          {/* Training record cards */}
          <div style={{ margin: "0 14px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                title: "2026年Q1 全员环保培训",
                date: "2026-01-10",
                iconGrad: "linear-gradient(135deg, #1677ff 0%, #0d52c4 100%)",
                metrics: [
                  { val: "13人", label: "参与人数" },
                  { val: "86分", label: "平均分", color: "#0d52c4" },
                  { val: "92%", label: "完成率", color: "#52c41a" },
                ],
              },
              {
                title: "2025年Q4 排污许可专项培训",
                date: "2025-10-15",
                iconGrad: "linear-gradient(135deg, #fa8c16, #ffa940)",
                metrics: [
                  { val: "8人", label: "参与人数" },
                  { val: "79分", label: "平均分", color: "#0d52c4" },
                  { val: "87%", label: "完成率", color: "#fa8c16" },
                ],
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                  border: "1px solid #ebeef2",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "12px 14px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: card.iconGrad,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <GraduationCap size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 3 }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#8090a8" }}>{card.date}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#389e0d", marginRight: 4 }}>
                    已完成
                  </span>
                  <ChevronRight size={16} color="#bfcbd9" />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    borderTop: "1px dashed #ebeef2",
                    background: "#fafbfc",
                  }}
                >
                  {card.metrics.map((m, i) => (
                    <div
                      key={m.label}
                      style={{
                        textAlign: "center",
                        padding: "8px 4px",
                        borderRight: i < 2 ? "1px solid #ebeef2" : undefined,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: m.color ?? "#1a1a1a",
                          lineHeight: 1,
                          marginBottom: 3,
                        }}
                      >
                        {m.val}
                      </div>
                      <div style={{ fontSize: 10, color: "#8090a8" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <TabBar />

      {/* Upload preview sheet */}
      {uploadState === "preview" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 200,
            display: "flex",
            alignItems: "flex-end",
          }}
          onClick={() => { setUploadState("idle"); setUploadFiles([]); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              background: "#fff",
              borderRadius: "16px 16px 0 0",
              padding: "20px 16px 32px",
            }}
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
                width: "100%",
                background: "linear-gradient(90deg, #1677ff, #0d52c4)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 0",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              确认上传
            </button>
          </div>
        </div>
      )}

      {/* Upload success toast */}
      {uploadState === "success" && (
        <div
          style={{
            position: "fixed",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            border: "1px solid #b7eb8f",
            borderRadius: 10,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            zIndex: 300,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <CheckCircle size={16} color="#52c41a" />
          <span style={{ fontSize: 13, color: "#1a1a1a" }}>
            上传成功，文件已入库
          </span>
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
