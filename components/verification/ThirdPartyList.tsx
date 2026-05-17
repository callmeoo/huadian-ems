"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wind,
  Droplets,
  Volume2,
  AlertTriangle,
  Upload,
  ChevronRight,
  ChevronDown,
  Check,
  BookOpen,
  X,
} from "lucide-react";
import { TypeIconBox, StatusBadge, DueTag, NextDateText } from "./Badges";
import PeriodPicker, { toWindow, type PeriodValue } from "./PeriodPicker";
import type { ReportCard, ReportType } from "./types";

export type ThirdPartyFilter = "all" | ReportType;
export type ThirdPartyStat = "all" | "pending" | "fail" | "urgent";

export interface ThirdPartyListProps {
  reports: ReportCard[] | null;
  typeFilter: ThirdPartyFilter;
  onTypeFilterChange: (f: ThirdPartyFilter) => void;
  statFilter: ThirdPartyStat;
  onStatFilterChange: (s: ThirdPartyStat) => void;
  period: PeriodValue;
  onPeriodChange: (v: PeriodValue) => void;
}

const TYPE_OPTIONS: {
  key: ThirdPartyFilter;
  label: string;
  Icon?: React.ComponentType<{ size: number; color?: string }>;
}[] = [
  { key: "all", label: "全部" },
  { key: "gas", label: "废气", Icon: Wind },
  { key: "water", label: "废水", Icon: Droplets },
  { key: "noise", label: "噪声", Icon: Volume2 },
];

export default function ThirdPartyList({
  reports,
  typeFilter,
  onTypeFilterChange,
  statFilter,
  onStatFilterChange,
  period,
  onPeriodChange,
}: ThirdPartyListProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success">("idle");
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);

  const source = reports ?? [];
  let filtered = typeFilter === "all" ? source : source.filter((r) => r.type === typeFilter);
  if (statFilter === "pending") filtered = filtered.filter((r) => r.status === "pending");
  else if (statFilter === "fail") filtered = filtered.filter((r) => r.status === "fail");
  else if (statFilter === "urgent")
    filtered = filtered.filter((r) => r.dueLevel === "very-soon" || r.dueLevel === "soon");

  // 按周期时间窗口过滤（按报告日期 date 落在 [winStart, winEnd] 内）
  const [winStart, winEnd] = toWindow(period);
  filtered = filtered.filter((r) => r.date >= winStart && r.date <= winEnd);

  // 排序：不合格 → 合格 → 待核验（同状态保持原顺序）
  const STATUS_ORDER: Record<ReportCard["status"], number> = { fail: 0, pass: 1, pending: 2 };
  filtered = [...filtered].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  const currentType = TYPE_OPTIONS.find((o) => o.key === typeFilter) ?? TYPE_OPTIONS[0];

  const handleUpload = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 3000);
      e.target.value = "";
    }
  };

  return (
    <>
      {/* Alert banner */}
      <div
        style={{
          margin: "12px 14px 0",
          background: "#fff7e6",
          border: "1px solid #ffd591",
          borderRadius: 10,
          padding: "10px 12px",
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <AlertTriangle size={16} color="#fa8c16" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: "#873800", lineHeight: 1.55 }}>
          <span style={{ fontWeight: 600 }}>2台机组</span>
          监测报告即将到期，请安排监测：
          <br />
          <span style={{ color: "#d46b08", fontWeight: 600 }}>1号机组废气</span> 4天后到期，
          <span style={{ color: "#d46b08", fontWeight: 600 }}>2号机组废水</span> 8天后到期
        </div>
      </div>

      {/* 筛选行：左 = 类型 + 周期；右 = 核验标准（独立一块） */}
      <div
        style={{
          padding: "12px 14px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {/* 左侧组：类型 + 周期 紧挨 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setTypeMenuOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "#fff", border: "1px solid #e0e7ef",
              borderRadius: 8, padding: "5px 12px",
              fontSize: 12, color: "#1a1a1a", fontWeight: 500,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            {currentType.Icon && <currentType.Icon size={13} color="#6b7a8c" />}
            {currentType.label}
            <ChevronDown size={12} color="#6b7a8c" />
          </button>

          <PeriodPicker value={period} onChange={onPeriodChange} />
        </div>

        {/* 右侧：核验标准（独立块，浅蓝填充 + 内框，视觉上跟筛选区分离） */}
        <Link
          href="/verification/standards"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "#e6f4ff",
            color: "#0d52c4",
            border: "1px solid #bae0ff",
            borderRadius: 8,
            padding: "5px 12px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          <BookOpen size={13} color="#0d52c4" />
          核验标准
        </Link>
      </div>

      {/* 类型选择 sheet */}
      {typeMenuOpen && (
        <>
          <div
            onClick={() => setTypeMenuOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }}
          />
          <div style={{
            position: "fixed", left: 0, right: 0, bottom: 0,
            background: "#fff", borderRadius: "16px 16px 0 0",
            zIndex: 201, paddingBottom: 20,
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px 12px", borderBottom: "1px solid #ebeef2",
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>选择监测类型</span>
              <button onClick={() => setTypeMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8090a8", display: "flex" }}>
                <X size={20} />
              </button>
            </div>
            {TYPE_OPTIONS.map(({ key, label, Icon }) => {
              const active = typeFilter === key;
              return (
                <div
                  key={key}
                  onClick={() => { onTypeFilterChange(key); setTypeMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "14px 20px", fontSize: 15,
                    color: active ? "#1677ff" : "#1a1a1a",
                    fontWeight: active ? 600 : 400,
                    background: active ? "#f0f7ff" : "#fff",
                    borderBottom: "1px solid #f5f7fa", cursor: "pointer",
                  }}
                >
                  {Icon && <Icon size={16} color={active ? "#1677ff" : "#6b7a8c"} />}
                  <span style={{ flex: 1 }}>{label}</span>
                  {active && <Check size={18} color="#1677ff" />}
                </div>
              );
            })}
          </div>
        </>
      )}

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
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>监测报告台账</span>
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
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={handleUpload}
            style={{
              background:
                uploadStatus === "success"
                  ? "#52c41a"
                  : "linear-gradient(135deg, #0091c7 0%, #0d52c4 100%)",
              color: "#fff",
              borderRadius: 16,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "background 0.3s",
            }}
          >
            {uploadStatus === "success" ? (
              <>
                <Check size={12} color="#fff" />
                已上传
              </>
            ) : (
              <>
                <Upload size={12} color="#fff" />
                上传报告
              </>
            )}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
        onChange={handleFileChange}
      />

      {/* Report cards */}
      <div
        style={{ margin: "0 14px", display: "flex", flexDirection: "column", gap: 10 }}
      >
        {reports === null ? (
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
            暂无匹配的报告
          </div>
        ) : (
          filtered.map((report) => (
            <div
              key={report.id}
              onClick={() => router.push(`/verification/report/${report.id}`)}
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                border: report.danger
                  ? "1px solid #ffccc7"
                  : report.urgent
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
                <TypeIconBox type={report.type} />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1a1a1a",
                      marginBottom: 3,
                    }}
                  >
                    {report.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#8090a8", marginBottom: 6 }}>
                    {report.date} · {report.agency}
                  </div>
                  <StatusBadge
                    status={report.status}
                    manualReviewed={report.manualReviewed}
                  />
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
                <NextDateText level={report.dueLevel} date={report.nextDate} />
                <DueTag level={report.dueLevel} label={report.dueLabel} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
