"use client";

import { useState } from "react";
import {
  ChevronLeft,
  Menu,
  Building2,
  Phone,
  MapPin,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import TabBar from "@/components/layout/TabBar";

// ─── helpers ────────────────────────────────────────────────────────────────

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
  position: "relative",
  overflow: "hidden",
  paddingBottom: 18,
};

const dotTextureStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
  opacity: 0.4,
  pointerEvents: "none",
};

const glowStyle: React.CSSProperties = {
  position: "absolute",
  top: -80,
  left: -60,
  width: 280,
  height: 280,
  background:
    "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
  pointerEvents: "none",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#1a1a1a",
  display: "flex",
  alignItems: "center",
  gap: 7,
};

const accentBar: React.CSSProperties = {
  width: 3,
  height: 14,
  background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
  borderRadius: 2,
  flexShrink: 0,
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  padding: "11px 16px",
  borderBottom: "1px solid #f0f3f7",
  fontSize: 13,
  alignItems: "flex-start",
};

const labelColStyle: React.CSSProperties = {
  width: 112,
  color: "#6b7a8c",
  fontSize: 12,
  flexShrink: 0,
  paddingTop: 1,
};

const valueColStyle: React.CSSProperties = {
  flex: 1,
  color: "#1a1a1a",
  wordBreak: "break-all",
};

// ─── data ───────────────────────────────────────────────────────────────────

interface Outlet {
  id: number;
  name: string;
  type: string;
  monitorName: string;
  mn: string;
}

const outlets: Outlet[] = [
  {
    id: 1,
    name: "废气排放口 01",
    type: "废气",
    monitorName: "废气排放口01监控点",
    mn: "74829970146001",
  },
  {
    id: 2,
    name: "废气排放口 02",
    type: "废气",
    monitorName: "废气排放口02监控点",
    mn: "74829970146002",
  },
];

// ─── sub-components ──────────────────────────────────────────────────────────

function GreenDot() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#52c41a",
        marginRight: 4,
        verticalAlign: "middle",
      }}
    />
  );
}

function OutletCard({ outlet }: { outlet: Outlet }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 14px",
          gap: 10,
          cursor: "pointer",
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* number badge */}
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: "#1677ff",
            color: "#fff",
            fontWeight: 700,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {outlet.id}
        </div>
        {/* name */}
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", flex: 1 }}>
          {outlet.name}
        </span>
        {/* type badge */}
        <span
          style={{
            background: "rgba(22,119,255,0.1)",
            color: "#1677ff",
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 4,
            marginRight: 6,
          }}
        >
          {outlet.type}
        </span>
        {/* toggle */}
        {expanded ? (
          <ChevronUp size={16} color="#8090a8" />
        ) : (
          <ChevronDown size={16} color="#8090a8" />
        )}
      </div>

      {/* body */}
      {expanded && (
        <div style={{ padding: "0 14px 14px" }}>
          <div
            style={{
              background: "#f7faff",
              border: "1px solid #e6f0fa",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
            }}
          >
            {[
              { label: "监控点名称", value: outlet.monitorName },
              {
                label: "数据折算",
                value: (
                  <span>
                    <GreenDot />
                    已启用
                  </span>
                ),
              },
              { label: "MN 号", value: outlet.mn },
              {
                label: "在线状态",
                value: (
                  <span>
                    <GreenDot />
                    正常在线
                  </span>
                ),
              },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingBottom: i < arr.length - 1 ? 8 : 0,
                  marginBottom: i < arr.length - 1 ? 8 : 0,
                  borderBottom:
                    i < arr.length - 1 ? "1px solid #e6f0fa" : "none",
                }}
              >
                <span style={{ width: 88, color: "#6b7a8c", fontSize: 12 }}>
                  {row.label}
                </span>
                <span style={{ color: "#1a1a1a" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function EnterprisePage() {
  const router = useRouter();
  const [basicOpen, setBasicOpen] = useState(true);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* ── Hero ── */}
      <div style={heroStyle}>
        <div style={dotTextureStyle} />
        <div style={glowStyle} />

        {/* nav bar */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: 44,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
          }}
        >
          {/* back button */}
          <button
            onClick={() => router.back()}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={18} color="#fff" />
          </button>

          {/* title */}
          <span
            style={{
              flex: 1,
              textAlign: "center",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            企业档案
          </span>

          {/* menu icon */}
          <button
            style={{
              width: 32,
              height: 32,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Menu size={20} color="rgba(255,255,255,0.75)" />
          </button>
        </div>

        {/* company identity */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "12px 20px 0",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          {/* logo box */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#1677ff",
              boxShadow: "0 4px 12px rgba(22,119,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Building2 size={24} color="#fff" />
          </div>

          {/* meta */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.4,
                marginBottom: 6,
              }}
            >
              广州大学城华电新能源有限公司
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span
                style={{
                  background: "rgba(22,119,255,0.15)",
                  border: "1px solid rgba(22,119,255,0.3)",
                  color: "#7ab8ff",
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                广州市 · 番禺区
              </span>
              <span
                style={{
                  background: "rgba(255,196,107,0.15)",
                  border: "1px solid rgba(255,196,107,0.3)",
                  color: "#ffc96b",
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                热电联产
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ paddingBottom: 80 }}>
        {/* Section 1: 基础信息 */}
        <div style={{ padding: "16px 14px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div style={sectionTitleStyle}>
              <div style={accentBar} />
              排污单位基础信息
            </div>
            <button
              onClick={() => setBasicOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6b7a8c",
                fontSize: 12,
                padding: 0,
              }}
            >
              {basicOpen ? (
                <>
                  <ChevronUp size={14} />
                  收起
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  展开
                </>
              )}
            </button>
          </div>

          {basicOpen && (
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                overflow: "hidden",
              }}
            >
              {/* row: 企业名称 */}
              <div style={infoRowStyle}>
                <span style={labelColStyle}>企业名称</span>
                <span style={valueColStyle}>广州大学城华电新能源有限公司</span>
              </div>
              {/* row: 行政区划 */}
              <div style={infoRowStyle}>
                <span style={labelColStyle}>行政区划</span>
                <span style={valueColStyle}>广州市 · 番禺区</span>
              </div>
              {/* row: 行业类别 */}
              <div style={infoRowStyle}>
                <span style={labelColStyle}>行业类别</span>
                <span style={valueColStyle}>热电联产</span>
              </div>
              {/* row: 社会信用代码 */}
              <div style={infoRowStyle}>
                <span style={labelColStyle}>社会信用代码</span>
                <span style={valueColStyle}>91440101671829338D</span>
              </div>
              {/* row: 排污许可证 */}
              <div style={infoRowStyle}>
                <span style={labelColStyle}>排污许可证编号</span>
                <span style={{ ...valueColStyle, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                  91440101671829338D001P
                  <span
                    style={{
                      background: "#e6f4ff",
                      color: "#1677ff",
                      fontSize: 10,
                      padding: "1px 6px",
                      borderRadius: 4,
                    }}
                  >
                    有效
                  </span>
                </span>
              </div>
              {/* row: 联系电话 */}
              <div style={infoRowStyle}>
                <span style={labelColStyle}>联系电话</span>
                <span
                  style={{
                    ...valueColStyle,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#1677ff",
                  }}
                >
                  <Phone size={13} />
                  18198920175
                </span>
              </div>
              {/* row: 地址 */}
              <div style={{ ...infoRowStyle, borderBottom: "none" }}>
                <span style={labelColStyle}>地址</span>
                <span
                  style={{
                    ...valueColStyle,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 4,
                  }}
                >
                  <MapPin size={13} style={{ marginTop: 1, flexShrink: 0, color: "#6b7a8c" }} />
                  广州市番禺区南村镇新北路1689号
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: 排放口 */}
        <div style={{ padding: "16px 14px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <div style={sectionTitleStyle}>
              <div style={accentBar} />
              排放口
            </div>
            <span style={{ fontSize: 12, color: "#8090a8", marginLeft: 2 }}>
              2 个
            </span>
          </div>

          {outlets.map((outlet) => (
            <OutletCard key={outlet.id} outlet={outlet} />
          ))}
        </div>
      </div>

      <TabBar />
    </div>
  );
}
