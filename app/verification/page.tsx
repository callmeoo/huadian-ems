"use client";

import { useState, useRef } from "react";
import {
  SlidersHorizontal,
  Wind,
  Droplets,
  Volume2,
  AlertTriangle,
  Upload,
  ChevronRight,
  Clock,
  Calendar,
  ChevronDown,
  Check,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";

type FilterType = "all" | "gas" | "water" | "noise";
type StatFilter = "all" | "pending" | "fail" | "urgent";
type QuarterType = "Q1" | "Q2" | "Q3" | "Q4";

interface ReportCard {
  id: number;
  title: string;
  type: "gas" | "water" | "noise";
  date: string;
  agency: string;
  status: "pass" | "fail" | "pending";
  nextDate: string;
  dueLabel: string;
  dueLevel: "very-soon" | "soon" | "normal";
  urgent?: boolean;
  danger?: boolean;
}

const REPORTS: ReportCard[] = [
  {
    id: 1,
    title: "1号机组·废气",
    type: "gas",
    date: "2026-01-05",
    agency: "华能检测",
    status: "pass",
    nextDate: "2026-04-05",
    dueLabel: "4天后到期",
    dueLevel: "very-soon",
    urgent: true,
  },
  {
    id: 2,
    title: "2号机组·废水",
    type: "water",
    date: "2026-01-08",
    agency: "华能检测",
    status: "pass",
    nextDate: "2026-04-08",
    dueLabel: "8天后到期",
    dueLevel: "soon",
    urgent: true,
  },
  {
    id: 3,
    title: "1号机组·噪声",
    type: "noise",
    date: "2026-01-10",
    agency: "华能检测",
    status: "pending",
    nextDate: "2026-04-10",
    dueLabel: "25天后",
    dueLevel: "normal",
  },
  {
    id: 4,
    title: "2号机组·废气",
    type: "gas",
    date: "2026-01-12",
    agency: "华能检测",
    status: "fail",
    nextDate: "2026-04-12",
    dueLabel: "27天后",
    dueLevel: "normal",
    danger: true,
  },
  {
    id: 5,
    title: "1号机组·废水",
    type: "water",
    date: "2026-01-15",
    agency: "华能检测",
    status: "pending",
    nextDate: "2026-04-15",
    dueLabel: "30天后",
    dueLevel: "normal",
  },
];

function TypeIconBox({ type }: { type: "gas" | "water" | "noise" }) {
  const configs = {
    gas: { bg: "#e6f7ff", color: "#0a84ff", Icon: Wind },
    water: { bg: "#e6fffb", color: "#13c2c2", Icon: Droplets },
    noise: { bg: "#fff7e6", color: "#fa8c16", Icon: Volume2 },
  };
  const { bg, color, Icon } = configs[type];
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={18} color={color} />
    </div>
  );
}

function StatusBadge({ status }: { status: "pass" | "fail" | "pending" }) {
  const configs = {
    pass: { bg: "#f6ffed", color: "#389e0d", label: "✓ 已合格" },
    fail: { bg: "#fff1f0", color: "#cf1322", label: "✗ 不合格" },
    pending: { bg: "#e6f4ff", color: "#0958d9", label: "待核验" },
  };
  const { bg, color, label } = configs[status];
  return (
    <span
      style={{
        background: bg,
        color,
        padding: "2px 8px",
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

function DueTag({
  level,
  label,
}: {
  level: "very-soon" | "soon" | "normal";
  label: string;
}) {
  const configs = {
    "very-soon": { bg: "#fff1f0", color: "#cf1322" },
    soon: { bg: "#fff7e6", color: "#d46b08" },
    normal: { bg: "#f0f5ff", color: "#2f54eb" },
  };
  const { bg, color } = configs[level];
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 8,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

function NextDateText({
  level,
  date,
}: {
  level: "very-soon" | "soon" | "normal";
  date: string;
}) {
  const color =
    level === "very-soon" ? "#cf1322" : level === "soon" ? "#d46b08" : "#8090a8";
  return (
    <span
      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color }}
    >
      <Clock size={12} color={color} />
      下次监测: {date}
    </span>
  );
}

function PeriodPicker({
  year,
  quarter,
  onYearChange,
  onQuarterChange,
}: {
  year: number;
  quarter: QuarterType;
  onYearChange: (y: number) => void;
  onQuarterChange: (q: QuarterType) => void;
}) {
  const [open, setOpen] = useState(false);
  const QUARTERS: QuarterType[] = ["Q1", "Q2", "Q3", "Q4"];

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          background: "#fff",
          border: "1px solid #e0e7ef",
          borderRadius: 8,
          padding: "5px 10px",
          fontSize: 12,
          color: "#1a1a1a",
          cursor: "pointer",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        <Calendar size={12} color="#6b7a8c" />
        {year}年 {quarter}
        <ChevronDown
          size={12}
          color="#6b7a8c"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 50 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
              padding: 14,
              zIndex: 100,
              minWidth: 164,
            }}
          >
            {/* Year selector */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <button
                onClick={() => onYearChange(year - 1)}
                style={{
                  background: "#f5f7fa",
                  border: "none",
                  borderRadius: 6,
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#6b7a8c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ‹
              </button>
              <span style={{ fontWeight: 600, fontSize: 13, color: "#1a1a1a" }}>
                {year}年
              </span>
              <button
                onClick={() => onYearChange(year + 1)}
                style={{
                  background: "#f5f7fa",
                  border: "none",
                  borderRadius: 6,
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#6b7a8c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ›
              </button>
            </div>

            {/* Quarter grid */}
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
            >
              {QUARTERS.map((q) => {
                const isSelected = quarter === q;
                return (
                  <button
                    key={q}
                    onClick={() => {
                      onQuarterChange(q);
                      setOpen(false);
                    }}
                    style={{
                      background: isSelected ? "#0d52c4" : "#f5f7fa",
                      color: isSelected ? "#fff" : "#1a1a1a",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 0",
                      fontSize: 13,
                      fontWeight: isSelected ? 600 : 400,
                      cursor: "pointer",
                    }}
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerificationPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [statFilter, setStatFilter] = useState<StatFilter>("all");
  const [activeYear, setActiveYear] = useState(2026);
  const [activeQuarter, setActiveQuarter] = useState<QuarterType>("Q1");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success">("idle");

  const filterMap: Record<FilterType, "gas" | "water" | "noise" | null> = {
    all: null,
    gas: "gas",
    water: "water",
    noise: "noise",
  };

  let filteredReports =
    activeFilter === "all"
      ? REPORTS
      : REPORTS.filter((r) => r.type === filterMap[activeFilter]);

  if (statFilter === "pending") {
    filteredReports = filteredReports.filter((r) => r.status === "pending");
  } else if (statFilter === "fail") {
    filteredReports = filteredReports.filter((r) => r.status === "fail");
  } else if (statFilter === "urgent") {
    filteredReports = filteredReports.filter(
      (r) => r.dueLevel === "very-soon" || r.dueLevel === "soon"
    );
  }

  const FILTERS: {
    key: FilterType;
    label: string;
    Icon?: React.ComponentType<{ size: number; color?: string }>;
  }[] = [
    { key: "all", label: "全部" },
    { key: "gas", label: "废气", Icon: Wind },
    { key: "water", label: "废水", Icon: Droplets },
    { key: "noise", label: "噪声", Icon: Volume2 },
  ];

  const handleStatClick = (filter: StatFilter) => {
    setStatFilter((prev) => (prev === filter && filter !== "all" ? "all" : filter));
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 3000);
      e.target.value = "";
    }
  };

  const statCards = [
    { label: "本季报告", value: "12", color: "#fff", filter: "all" as StatFilter },
    { label: "待核验", value: "3", color: "#ffd666", filter: "pending" as StatFilter },
    { label: "不合格", value: "1", color: "#ff7875", filter: "fail" as StatFilter },
    { label: "即将到期", value: "2", color: "#ffd666", filter: "urgent" as StatFilter },
  ];

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
          padding: "0 20px 18px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            opacity: 0.4,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Glow */}
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
            zIndex: 0,
          }}
        />

        {/* Topbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
            zIndex: 5,
            position: "relative",
          }}
        >
          <div style={{ width: 32 }} />
          <span
            style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: 1 }}
          >
            核验
          </span>
          <button
            style={{
              width: 32,
              height: 32,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 8,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <SlidersHorizontal size={18} color="rgba(255,255,255,0.85)" />
          </button>
        </div>

        {/* Stats row — clickable */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            marginTop: 14,
            zIndex: 5,
            position: "relative",
          }}
        >
          {statCards.map(({ label, value, color, filter }) => {
            const isActive = statFilter === filter && filter !== "all";
            return (
              <button
                key={label}
                onClick={() => handleStatClick(filter)}
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.22)"
                    : "rgba(255,255,255,0.10)",
                  borderRadius: 10,
                  padding: "8px 4px",
                  textAlign: "center",
                  backdropFilter: "blur(4px)",
                  border: isActive
                    ? "1.5px solid rgba(255,255,255,0.50)"
                    : "1.5px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color }}>
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.65)",
                    marginTop: 3,
                  }}
                >
                  {label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert banner — no left thick border */}
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
        <AlertTriangle
          size={16}
          color="#fa8c16"
          style={{ flexShrink: 0, marginTop: 1 }}
        />
        <div style={{ fontSize: 12, color: "#873800", lineHeight: 1.55 }}>
          <span style={{ fontWeight: 600 }}>2台机组</span>
          监测报告即将到期，请安排监测：
          <br />
          <span style={{ color: "#d46b08", fontWeight: 600 }}>1号机组废气</span>{" "}
          4天后到期，
          <span style={{ color: "#d46b08", fontWeight: 600 }}>2号机组废水</span>{" "}
          8天后到期
        </div>
      </div>

      {/* Filter pills + period picker on same row */}
      <div
        style={{
          padding: "12px 14px 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            flex: 1,
            scrollbarWidth: "none",
          }}
        >
          {FILTERS.map(({ key, label, Icon }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 20,
                  fontSize: 13,
                  border: isActive ? "1px solid #0d52c4" : "1px solid #e0e7ef",
                  background: isActive ? "#0d52c4" : "#fff",
                  color: isActive ? "#fff" : "#6b7a8c",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {Icon && <Icon size={13} color={isActive ? "#fff" : "#6b7a8c"} />}
                {label}
              </button>
            );
          })}
        </div>
        <PeriodPicker
          year={activeYear}
          quarter={activeQuarter}
          onYearChange={setActiveYear}
          onQuarterChange={setActiveQuarter}
        />
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
            监测报告台账
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
            {filteredReports.length}
          </span>
          {statFilter !== "all" && (
            <button
              onClick={() => setStatFilter("all")}
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
        onChange={handleFileChange}
      />

      {/* Report cards */}
      <div style={{ margin: "0 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredReports.length === 0 ? (
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
          filteredReports.map((report) => (
            <div
              key={report.id}
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
              }}
            >
              {/* Card top */}
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
                  <div
                    style={{ fontSize: 11, color: "#8090a8", marginBottom: 6 }}
                  >
                    {report.date} · {report.agency}
                  </div>
                  <StatusBadge status={report.status} />
                </div>
                <ChevronRight
                  size={18}
                  color="#bfcbd9"
                  style={{ marginTop: 8, flexShrink: 0 }}
                />
              </div>

              {/* Card bottom */}
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

      <TabBar />
    </div>
  );
}
