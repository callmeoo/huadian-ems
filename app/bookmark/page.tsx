"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronDown, Check, X, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import TabBar from "@/components/layout/TabBar";

type StatusKey = "all" | "pending" | "confirmed" | "closed";
type PointKey  = "all" | "outlet01" | "outlet02";

interface MarkRecord {
  id: number;
  point: string;
  markType: string;
  category: string;
  pollutant: string;
  status: "pending" | "confirmed" | "closed";
  startTime: string;
  endTime: string;
  operator: string;
  remark: string;
}

const RECORDS: MarkRecord[] = [
  { id: 1,  point: "废气排放口02", markType: "设备检修",   category: "停运", pollutant: "氮氧化物", status: "confirmed", startTime: "2026-05-03 08:00", endTime: "2026-05-03 12:00", operator: "张工", remark: "例行检修，数据按停运处理" },
  { id: 2,  point: "废气排放口02", markType: "数据异常",   category: "异常", pollutant: "烟尘",     status: "pending",   startTime: "2026-05-03 14:00", endTime: "—",                 operator: "李工", remark: "传感器漂移，待核实" },
  { id: 3,  point: "废气排放口01", markType: "工况波动",   category: "波动", pollutant: "二氧化硫", status: "confirmed", startTime: "2026-05-02 09:00", endTime: "2026-05-02 11:00", operator: "王工", remark: "负荷波动引起浓度升高" },
  { id: 4,  point: "废气排放口02", markType: "校准比对",   category: "停运", pollutant: "氮氧化物", status: "closed",     startTime: "2026-05-01 10:00", endTime: "2026-05-01 11:30", operator: "张工", remark: "季度比对校准完成" },
  { id: 5,  point: "废气排放口01", markType: "停电停运",   category: "停运", pollutant: "全部",     status: "confirmed", startTime: "2026-04-30 06:00", endTime: "2026-04-30 18:00", operator: "值班员", remark: "计划停电检修" },
  { id: 6,  point: "废气排放口02", markType: "数据异常",   category: "异常", pollutant: "烟尘",     status: "pending",   startTime: "2026-04-29 16:00", endTime: "—",                 operator: "李工", remark: "负值持续出现，已上报" },
  { id: 7,  point: "废气排放口01", markType: "设备检修",   category: "停运", pollutant: "全部",     status: "closed",     startTime: "2026-04-28 08:00", endTime: "2026-04-28 17:00", operator: "王工", remark: "更换采样泵" },
  { id: 8,  point: "废气排放口02", markType: "超标说明",   category: "超标", pollutant: "氮氧化物", status: "confirmed", startTime: "2026-04-27 13:00", endTime: "2026-04-27 15:00", operator: "张工", remark: "机组启动阶段，申报超标豁免" },
  { id: 9,  point: "废气排放口01", markType: "工况波动",   category: "波动", pollutant: "二氧化硫", status: "closed",     startTime: "2026-04-26 09:00", endTime: "2026-04-26 10:30", operator: "值班员", remark: "已复核确认" },
  { id: 10, point: "废气排放口02", markType: "校准比对",   category: "停运", pollutant: "全部",     status: "closed",     startTime: "2026-04-25 14:00", endTime: "2026-04-25 15:00", operator: "李工", remark: "月度比对" },
];

const STATUS_CFG: { key: StatusKey; label: string; bg: string; color: string; dot: string }[] = [
  { key: "all",       label: "全部",   bg: "#e6f4ff", color: "#1677ff", dot: "#1677ff" },
  { key: "pending",   label: "待确认", bg: "#fff7e6", color: "#d46b08", dot: "#fa8c16" },
  { key: "confirmed", label: "已确认", bg: "#f0fff4", color: "#389e0d", dot: "#52c41a" },
  { key: "closed",    label: "已关闭", bg: "#f5f5f5", color: "#595959", dot: "#8090a8" },
];

const CATEGORIES = ["全部", "停运", "异常", "波动", "超标"];

const HERO: React.CSSProperties = {
  background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
  position: "relative", overflow: "hidden",
};

export default function BookmarkPage() {
  const router = useRouter();
  const [status,      setStatus]      = useState<StatusKey>("all");
  const [point,       setPoint]       = useState<PointKey>("all");
  const [category,    setCategory]    = useState("全部");
  const [pointOpen,   setPointOpen]   = useState(false);
  const [filterOpen,  setFilterOpen]  = useState(false);

  const filtered = useMemo(() =>
    RECORDS.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (point  !== "all") {
        const label = point === "outlet01" ? "废气排放口01" : "废气排放口02";
        if (r.point !== label) return false;
      }
      if (category !== "全部" && r.category !== category) return false;
      return true;
    }), [status, point, category]);

  const counts = {
    all:       RECORDS.length,
    pending:   RECORDS.filter((r) => r.status === "pending").length,
    confirmed: RECORDS.filter((r) => r.status === "confirmed").length,
    closed:    RECORDS.filter((r) => r.status === "closed").length,
  };

  const pointLabel = point === "all" ? "全部监控点" : point === "outlet01" ? "废气排放口01" : "废气排放口02";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>

      {/* Hero */}
      <div style={HERO}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)", backgroundSize: "22px 22px", opacity: 0.4, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -80, left: -60, width: 280, height: 280, background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Nav */}
        <div style={{ position: "relative", zIndex: 1, height: 44, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#fff", flex: 1 }}>标记查阅</span>

          {/* Filter button */}
          <button
            onClick={() => setFilterOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "6px 12px", color: "#fff", fontSize: 13, cursor: "pointer" }}
          >
            <Filter size={14} />
            {category !== "全部" ? category : "类型筛选"}
          </button>
        </div>

        {/* Point selector */}
        <div style={{ position: "relative", zIndex: 1, padding: "8px 14px 16px" }}>
          <button
            onClick={() => setPointOpen((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "7px 14px", color: "#fff", fontSize: 13, cursor: "pointer" }}
          >
            <span>{pointLabel}</span>
            <ChevronDown size={14} style={{ transform: pointOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {pointOpen && (
            <div style={{ position: "absolute", top: "calc(100% - 4px)", left: 14, background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(10,69,149,0.18)", zIndex: 50, overflow: "hidden", minWidth: 160 }}>
              {(["all", "outlet01", "outlet02"] as PointKey[]).map((k) => {
                const lbl = k === "all" ? "全部监控点" : k === "outlet01" ? "废气排放口01" : "废气排放口02";
                return (
                  <div key={k} onClick={() => { setPoint(k); setPointOpen(false); }}
                    style={{ padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", borderBottom: "1px solid #f0f3f7", color: point === k ? "#1677ff" : "#1a1a1a", fontWeight: point === k ? 600 : 400, fontSize: 14, background: point === k ? "#f0f7ff" : "#fff" }}>
                    {lbl}
                    {point === k && <Check size={15} color="#1677ff" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Status tabs */}
      <div style={{ background: "#fff", boxShadow: "0 2px 8px rgba(10,69,149,0.06)", display: "flex", padding: "0 8px" }}>
        {STATUS_CFG.map((s) => {
          const active = status === s.key;
          return (
            <button key={s.key} onClick={() => setStatus(s.key)}
              style={{ flex: 1, padding: "12px 4px", border: "none", background: "transparent", cursor: "pointer", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? s.dot : "#d0dae8", display: "inline-block" }} />
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? s.color : "#6b7a8c" }}>{s.label}</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: active ? s.color : "#1a1a1a", lineHeight: 1 }}>{counts[s.key]}</span>
              {active && <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 28, height: 2, borderRadius: 2, background: s.color }} />}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div style={{ padding: "12px 14px 80px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#8090a8", padding: "48px 0", fontSize: 14 }}>暂无标记记录</div>
        ) : (
          filtered.map((r) => {
            const sc = STATUS_CFG.find((s) => s.key === r.status)!;
            return (
              <div key={r.id} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(10,69,149,0.06)", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", padding: "12px 14px 11px", gap: 8, borderBottom: "1px solid #f0f3f7" }}>
                  <span style={{ fontSize: 13, color: "#6b7a8c", width: 20, textAlign: "center", flexShrink: 0 }}>#{r.id}</span>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{r.point}</span>
                  <span style={{ background: sc.bg, color: sc.color, fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600, flexShrink: 0 }}>
                    {sc.label}
                  </span>
                </div>
                {/* Body */}
                <div style={{ padding: "10px 14px 13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span style={{ background: "#e6f4ff", color: "#1677ff", fontSize: 12, padding: "2px 9px", borderRadius: 10, fontWeight: 500 }}>{r.markType}</span>
                    <span style={{ background: "#f5f7fa", color: "#6b7a8c", fontSize: 12, padding: "2px 9px", borderRadius: 10 }}>{r.category}</span>
                    <span style={{ background: "#f5f7fa", color: "#6b7a8c", fontSize: 12, padding: "2px 9px", borderRadius: 10 }}>{r.pollutant}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#8090a8", marginBottom: 2 }}>开始时间</div>
                      <div style={{ fontSize: 13, color: "#1a1a1a" }}>{r.startTime}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#8090a8", marginBottom: 2 }}>结束时间</div>
                      <div style={{ fontSize: 13, color: "#1a1a1a" }}>{r.endTime}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#8090a8", marginBottom: 2 }}>操作人</div>
                      <div style={{ fontSize: 13, color: "#1a1a1a" }}>{r.operator}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7a8c", background: "#f8fafc", borderRadius: 8, padding: "8px 10px", borderLeft: "3px solid #e0e8f5" }}>
                    {r.remark}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Category filter sheet */}
      {filterOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }} onClick={() => setFilterOpen(false)} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "16px 16px 0 0", zIndex: 101, paddingBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px", borderBottom: "1px solid #ebeef2" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>标记类型</span>
              <button onClick={() => setFilterOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8090a8", display: "flex", alignItems: "center" }}>
                <X size={20} />
              </button>
            </div>
            {CATEGORIES.map((c) => (
              <div key={c} onClick={() => { setCategory(c); setFilterOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px", fontSize: 15, color: category === c ? "#1677ff" : "#1a1a1a", fontWeight: category === c ? 600 : 400, background: category === c ? "#f0f7ff" : "#fff", borderBottom: "1px solid #f5f7fa", cursor: "pointer" }}>
                {c}
                {category === c && <Check size={18} color="#1677ff" />}
              </div>
            ))}
          </div>
        </>
      )}

      <TabBar />
    </div>
  );
}
