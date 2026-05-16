"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, FileText, Search, X } from "lucide-react";

type Category = "all" | "national" | "group" | "listed";

const FILES = [
  { name: "华电集团环境保护管理办法（2024修订版）", date: "2024-03", size: "2.1 MB", cat: "group" },
  { name: "新能源公司环保合规操作指南 V3.0", date: "2025-01", size: "1.8 MB", cat: "listed" },
  { name: "华电集团环保信息披露管理规定", date: "2023-11", size: "980 KB", cat: "group" },
  { name: "新能源公司污染防治专项行动方案", date: "2024-06", size: "1.2 MB", cat: "listed" },
  { name: "华电集团碳排放管理办法（2023版）", date: "2023-09", size: "3.4 MB", cat: "group" },
  { name: "新能源公司环保责任制实施细则", date: "2024-01", size: "760 KB", cat: "listed" },
  { name: "华电集团绿色发展行动计划（2024-2026）", date: "2024-02", size: "5.1 MB", cat: "group" },
  { name: "新能源公司排污许可管理规程", date: "2023-07", size: "1.1 MB", cat: "listed" },
  { name: "华电集团环境应急预案（综合版）", date: "2023-12", size: "2.8 MB", cat: "group" },
  { name: "新能源公司固废危废管理规定", date: "2024-04", size: "890 KB", cat: "listed" },
  { name: "华电集团噪声污染防治管理规定", date: "2023-05", size: "640 KB", cat: "group" },
  { name: "新能源公司VOCs管控专项方案", date: "2024-08", size: "1.5 MB", cat: "listed" },
  { name: "华电集团水污染防治管理办法", date: "2023-03", size: "1.3 MB", cat: "group" },
  { name: "新能源公司环保台账管理规范", date: "2025-01", size: "720 KB", cat: "listed" },
] as const;

const countOf = (cat: Exclude<Category, "all">) =>
  FILES.filter((f) => f.cat === cat).length;

const TABS: { key: Category; label: string; count: number }[] = [
  { key: "all", label: "全部", count: FILES.length },
  { key: "national", label: "全国", count: countOf("national") },
  { key: "group", label: "集团", count: countOf("group") },
  { key: "listed", label: "上市公司", count: countOf("listed") },
];

const ICON_COLOR: Record<Category, { bg: string; fg: string }> = {
  all:      { bg: "#e6f4ff", fg: "#0d52c4" },
  national: { bg: "#f0fff4", fg: "#389e0d" },
  group:    { bg: "#e6f4ff", fg: "#0d52c4" },
  listed:   { bg: "#f5f0ff", fg: "#531dab" },
};

export default function InternalFolderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [query, setQuery] = useState("");

  const filtered = FILES.filter((f) => {
    const matchTab = activeTab === "all" || f.cat === activeTab;
    const matchSearch = f.name.toLowerCase().includes(query.toLowerCase());
    return matchTab && matchSearch;
  });

  const { bg, fg } = ICON_COLOR[activeTab];

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
          padding: "0 16px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -40,
            width: 200,
            height: 200,
            background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Nav row */}
          <div style={{ display: "flex", alignItems: "center", height: 50, gap: 8 }}>
            <button
              onClick={() => router.back()}
              style={{ border: "none", background: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
            >
              <ChevronLeft size={20} color="rgba(255,255,255,0.9)" />
            </button>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>集团及上级公司环保制度</span>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex" }}>
            {TABS.map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    flex: 1,
                    padding: "10px 0 11px",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  {t.label}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      lineHeight: 1,
                      padding: "2px 5px",
                      borderRadius: 8,
                      background: isActive ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.14)",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    }}
                  >
                    {t.count}
                  </span>
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "20%",
                        right: "20%",
                        height: 2,
                        background: "#fff",
                        borderRadius: 1,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: "12px 14px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 12px",
            boxShadow: "0 1px 4px rgba(10,69,149,0.06)",
          }}
        >
          <Search size={14} color="#8090a8" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文件名…"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "#1a1a1a",
              background: "transparent",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex" }}
            >
              <X size={14} color="#8090a8" />
            </button>
          )}
        </div>
      </div>

      {/* Result count hint */}
      {(query || activeTab !== "all") && (
        <div style={{ padding: "0 14px 8px" }}>
          <span style={{ fontSize: 12, color: "#8090a8" }}>共 {filtered.length} 份文件</span>
        </div>
      )}

      {/* File list */}
      {filtered.length > 0 ? (
        <div style={{ margin: "0 14px", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(10,69,149,0.06)", overflow: "hidden" }}>
          {filtered.map((f, i) => (
            <div
              key={f.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderBottom: i < filtered.length - 1 ? "1px solid #f0f3f7" : undefined,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileText size={16} color={fg} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "#1a1a1a", marginBottom: 2, lineHeight: 1.4 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: "#8090a8" }}>{f.size} · {f.date}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#8090a8", fontSize: 13 }}>
          没有匹配的文件
        </div>
      )}

      <div style={{ height: 32 }} />
    </div>
  );
}
