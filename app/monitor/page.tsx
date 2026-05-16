"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp, Check, Menu, Maximize2, Minimize2, Inbox } from "lucide-react";
import dynamic from "next/dynamic";
import TabBar from "@/components/layout/TabBar";
import type { Granularity } from "@/components/monitor/MonitorCharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const OUTLETS = ["废气排放口01", "废气排放口02"];
const POLLUTANTS = ["氮氧化物", "流量", "氧含量", "烟气流速", "烟气温度", "烟气湿度", "烟气压力"];
const GRANULARITIES: Granularity[] = ["实时", "分钟", "小时", "日"];

// ─── Types ───────────────────────────────────────────────────────────────────

type DropdownKey = "outlet" | "pollutant" | "granularity";

// ─── Dynamic import (avoids SSR issues with Recharts) ─────────────────────────

const MonitorCharts = dynamic(
  () => import("@/components/monitor/MonitorCharts"),
  { ssr: false, loading: () => (
    <div style={{ height: 480, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <span style={{ fontSize: 13, color: "#8090a8" }}>加载中…</span>
    </div>
  ) },
);

const MonitorTable = dynamic(
  () => import("@/components/monitor/MonitorTable"),
  { ssr: false },
);

// ─── Time range helper ────────────────────────────────────────────────────────

function getTimeRange(granularity: Granularity): string {
  switch (granularity) {
    case "实时":  return "2026-05-16 18:00:00 至 2026-05-16 19:00:00";
    case "分钟":  return "2026-05-16 17:59:00 至 2026-05-16 18:59:59";
    case "小时":  return "2026-05-16 00 至 2026-05-16 18";
    case "日":    return "2026-05-01 至 2026-05-10";
  }
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ subtitle = "实时数据采集中，请稍后查看" }: { subtitle?: string }) {
  return (
    <div style={{
      background: "#fff",
      padding: "60px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      height: "100%",
      minHeight: 240,
    }}>
      <div style={{
        width: 76, height: 76,
        borderRadius: "50%",
        background: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Inbox size={34} color="#c0cad8" strokeWidth={1.5} />
      </div>
      <span style={{ fontSize: 14, color: "#8090a8" }}>暂无数据</span>
      <span style={{ fontSize: 11, color: "#a8b4c4" }}>{subtitle}</span>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MonitorPage() {
  const router = useRouter();

  const [outlet, setOutlet] = useState("废气排放口02");
  const [pollutant, setPollutant] = useState("氮氧化物");
  const [granularity, setGranularity] = useState<Granularity>("小时");
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);

  const [isLandscape, setIsLandscape] = useState(false);
  const [deviceLandscape, setDeviceLandscape] = useState(false);

  const filterBarRef = useRef<HTMLDivElement>(null);
  const [filterBottom, setFilterBottom] = useState(0);

  useEffect(() => {
    if (filterBarRef.current) {
      const rect = filterBarRef.current.getBoundingClientRect();
      setFilterBottom(rect.bottom);
    }
  }, []);

  // Detect physical device orientation — if device is already landscape,
  // skip the CSS rotation (otherwise the user sees content rotated twice).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(orientation: landscape)");
    const update = () => setDeviceLandscape(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lock body scroll while in landscape view
  useEffect(() => {
    if (isLandscape) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isLandscape]);

  const isRealtime = granularity === "实时";

  function toggleDropdown(key: DropdownKey) {
    if (filterBarRef.current) {
      const rect = filterBarRef.current.getBoundingClientRect();
      setFilterBottom(rect.bottom);
    }
    setOpenDropdown((prev) => (prev === key ? null : key));
  }

  function closeAll() {
    setOpenDropdown(null);
  }

  const dropdownConfig: {
    key: DropdownKey;
    label: string;
    options: string[];
    value: string;
    setter: (v: string) => void;
  }[] = [
    { key: "outlet", label: outlet, options: OUTLETS, value: outlet, setter: setOutlet },
    { key: "pollutant", label: pollutant, options: POLLUTANTS, value: pollutant, setter: setPollutant },
    {
      key: "granularity",
      label: granularity,
      options: GRANULARITIES,
      value: granularity,
      setter: (v) => setGranularity(v as Granularity),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
        position: "relative",
        overflow: "visible",
        zIndex: 10,
      }}>
        {/* dot texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.4,
          pointerEvents: "none",
          zIndex: 0,
        }} />
        {/* glow */}
        <div style={{
          position: "absolute", top: -80, left: -60,
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Nav bar */}
        <div style={{
          position: "relative", zIndex: 1,
          height: 44, display: "flex", alignItems: "center",
          padding: "0 14px", gap: 8,
        }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}
          >
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", flex: 1 }}>实时监控</span>
          <button
            onClick={() => setIsLandscape(true)}
            aria-label="横屏查看"
            style={{ background: "none", border: "none", padding: "4px 6px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}
          >
            <Maximize2 size={17} />
          </button>
          <button style={{ background: "none", border: "none", padding: "4px 6px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
            <Menu size={20} />
          </button>
        </div>

        {/* Filter pills */}
        <div
          ref={filterBarRef}
          style={{
            position: "relative", zIndex: 1,
            display: "flex", gap: 8,
            padding: "8px 14px 0",
          }}
        >
          {dropdownConfig.map(({ key, label, value: _ }) => {
            const isOpen = openDropdown === key;
            return (
              <button
                key={key}
                onClick={() => toggleDropdown(key)}
                style={{
                  flex: 1,
                  height: 36,
                  background: isOpen ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.22)",
                  border: `1px solid ${isOpen ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.4)"}`,
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: isOpen ? 600 : 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  cursor: "pointer",
                  transition: "background 0.15s, border 0.15s",
                  padding: "0 10px",
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 72 }}>{label}</span>
                {isOpen ? <ChevronUp size={14} style={{ flexShrink: 0 }} /> : <ChevronDown size={14} style={{ flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>

        {/* Time range bar */}
        <div style={{
          position: "relative", zIndex: 1,
          margin: "10px 14px 14px",
          background: "rgba(0,0,0,0.18)",
          borderRadius: 8,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}>
          <span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{getTimeRange(granularity)}</span>
          <ChevronDown size={16} color="rgba(255,255,255,0.8)" style={{ flexShrink: 0, marginLeft: 8 }} />
        </div>
      </div>

      {/* ── Dropdown overlay ── */}
      {openDropdown && (
        <>
          <div
            onClick={closeAll}
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.18)" }}
          />
          <div style={{
            position: "fixed",
            top: filterBottom,
            left: 0,
            right: 0,
            zIndex: 51,
            background: "#fff",
            boxShadow: "0 4px 16px rgba(10,40,100,0.12)",
          }}>
            {dropdownConfig
              .find((d) => d.key === openDropdown)!
              .options.map((opt, i, arr) => {
                const conf = dropdownConfig.find((d) => d.key === openDropdown)!;
                const selected = conf.value === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => { conf.setter(opt); closeAll(); }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "15px 20px",
                      background: "none",
                      border: "none",
                      borderBottom: i < arr.length - 1 ? "1px solid #f0f3f7" : "none",
                      cursor: "pointer",
                      fontSize: 15,
                      color: selected ? "#1677ff" : "#1a1a1a",
                      fontWeight: selected ? 600 : 400,
                      textAlign: "left",
                    }}
                  >
                    {opt}
                    {selected && <Check size={18} color="#1677ff" />}
                  </button>
                );
              })}
          </div>
        </>
      )}

      {/* ── Charts + Table (or empty state when realtime) ── */}
      <div style={{ paddingBottom: 80 }}>
        {isRealtime ? (
          <EmptyState />
        ) : (
          <>
            <MonitorCharts granularity={granularity} />
            <div style={{ height: 8, background: "#f5f7fa" }} />
            <MonitorTable granularity={granularity} />
          </>
        )}
      </div>

      <TabBar />

      {/* ── Landscape overlay ── */}
      {isLandscape && (
        <div
          style={
            deviceLandscape
              ? {
                  position: "fixed",
                  inset: 0,
                  background: "#f5f7fa",
                  zIndex: 9999,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }
              : {
                  position: "fixed",
                  top: 0,
                  left: "100vw",
                  width: "100vh",
                  height: "100vw",
                  transformOrigin: "0 0",
                  transform: "rotate(90deg)",
                  background: "#f5f7fa",
                  zIndex: 9999,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }
          }
        >
          {/* Top bar */}
          <div style={{
            height: 44,
            background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 10,
            flexShrink: 0,
          }}>
            <button
              onClick={() => setIsLandscape(false)}
              aria-label="退出横屏"
              style={{ background: "none", border: "none", padding: "4px 6px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}
            >
              <Minimize2 size={17} />
            </button>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>实时监控</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>·</span>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13 }}>
              {outlet} · {pollutant} · {granularity}
            </span>
            <span style={{ flex: 1 }} />
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
              {getTimeRange(granularity)}
            </span>
          </div>

          {/* Body: chart 50% + table 50% */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
            {isRealtime ? (
              <>
                <div style={{ flex: 1, background: "#fff", minHeight: 0, overflow: "hidden" }}>
                  <EmptyState subtitle="实时数据采集中" />
                </div>
                <div style={{ height: 6, background: "#f5f7fa", flexShrink: 0 }} />
                <div style={{ flex: 1, background: "#fff", minHeight: 0, overflow: "hidden" }}>
                  <EmptyState subtitle="实时数据采集中" />
                </div>
              </>
            ) : (
              <>
                <div style={{ flex: 1, background: "#fff", minHeight: 0, overflow: "hidden" }}>
                  <MonitorCharts granularity={granularity} compact />
                </div>
                <div style={{ height: 6, background: "#f5f7fa", flexShrink: 0 }} />
                <div style={{ flex: 1, background: "#fff", minHeight: 0, overflow: "auto" }}>
                  <MonitorTable granularity={granularity} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
