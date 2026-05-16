"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, Upload, Menu, X } from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import DateRangePicker from "@/components/ui/DateRangePicker";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PollutantRow {
  name: string;
  value: number;
  unit: string;
}

interface MonitoringPoint {
  seq: number;
  name: string;
  type: string;
  pollutants: PollutantRow[];
}

interface Outlet {
  seq: number;
  media: string;
  name: string;
  pollutants: PollutantRow[];
  monitoringPoints: MonitoringPoint[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SUMMARY_POLLUTANTS: PollutantRow[] = [
  { name: "氮氧化物", value: 1958.07, unit: "千克" },
];

const OUTLETS: Outlet[] = [
  {
    seq: 1,
    media: "废气",
    name: "废气排放口01",
    pollutants: [{ name: "氮氧化物", value: 0.345, unit: "千克" }],
    monitoringPoints: [
      {
        seq: 1,
        name: "废气排放口01",
        type: "末端",
        pollutants: [{ name: "氮氧化物", value: 0.345, unit: "千克" }],
      },
    ],
  },
  {
    seq: 2,
    media: "废气",
    name: "废气排放口02",
    pollutants: [{ name: "氮氧化物", value: 1957.748, unit: "千克" }],
    monitoringPoints: [
      {
        seq: 1,
        name: "废气排放口02",
        type: "末端",
        pollutants: [{ name: "氮氧化物", value: 1957.748, unit: "千克" }],
      },
    ],
  },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
  position: "relative",
  overflow: "hidden",
};

const dotTextureStyle: React.CSSProperties = {
  background: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
  opacity: 0.4,
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 0,
};

const glowStyle: React.CSSProperties = {
  background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
  position: "absolute",
  top: -80, left: -60,
  width: 280, height: 280,
  pointerEvents: "none",
  zIndex: 0,
};

const glassStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.28)",
  border: "1px solid rgba(255,255,255,0.5)",
  borderRadius: 10,
  height: 38,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  padding: "0 14px",
  cursor: "pointer",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function EmissionPage() {
  const router = useRouter();
  const [dateStart,    setDateStart]    = useState("2026-05-01");
  const [dateEnd,      setDateEnd]      = useState("2026-05-07");
  const [pickerOpen,   setPickerOpen]   = useState(false);
  const [detailOutlet, setDetailOutlet] = useState<Outlet | null>(null);

  const dateLabel = `${dateStart} 至 ${dateEnd}`;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <style>{`@keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

      {/* ── Hero ── */}
      <div style={heroStyle}>
        <div style={dotTextureStyle} />
        <div style={glowStyle} />

        {/* Nav */}
        <div style={{ position: "relative", zIndex: 1, height: 44, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", flexShrink: 0 }}>排放量统计</span>
          <span style={{ flex: 1 }} />
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
            <Menu size={20} />
          </button>
        </div>

        {/* Filter row */}
        <div style={{ position: "relative", zIndex: 1, padding: "10px 14px 16px", display: "flex", gap: 10 }}>
          <div onClick={() => setPickerOpen(true)} style={{ ...glassStyle, flex: 1, justifyContent: "space-between" }}>
            <span style={{ fontSize: 13 }}>{dateLabel}</span>
            <ChevronDown size={16} />
          </div>
          <button style={{ ...glassStyle, width: 38, padding: 0, justifyContent: "center", flexShrink: 0, background: "none", border: "1px solid rgba(255,255,255,0.5)" }}>
            <Upload size={18} />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "14px 14px 80px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Summary card */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(10,69,149,0.06)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(90deg, #0062d4 0%, #007AFF 100%)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>废气排放量</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>单位：千克</span>
          </div>
          <div style={{ padding: "14px 16px" }}>
            {SUMMARY_POLLUTANTS.map((p, i) => (
              <PollutantRowItem key={p.name} pollutant={p} showDivider={i > 0} />
            ))}
          </div>
        </div>

        {/* Outlets section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>排放口 ({OUTLETS.length})</span>
            <span style={{ fontSize: 13, color: "#6b7a8c" }}>单位：千克</span>
          </div>
          {OUTLETS.map((outlet) => (
            <OutletCard key={outlet.seq} outlet={outlet} onDetail={() => setDetailOutlet(outlet)} />
          ))}
        </div>
      </div>

      {/* Date range picker */}
      <DateRangePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={(s, e) => { setDateStart(s); setDateEnd(e); setPickerOpen(false); }}
        defaultStart={dateStart}
        defaultEnd={dateEnd}
      />

      {/* Detail sheet */}
      {detailOutlet && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} onClick={() => setDetailOutlet(null)} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "16px 16px 0 0", zIndex: 201, animation: "sheet-up 0.25s ease", maxHeight: "90vh", overflowY: "auto" }}>

            {/* Sheet header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 14px", borderBottom: "1px solid #ebeef2" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>详细</span>
              <button onClick={() => setDetailOutlet(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8090a8", padding: 4, display: "flex" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "14px 16px 32px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Outlet summary card */}
              <div style={{ background: "#f0f6ff", borderRadius: 12, padding: "14px 14px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ background: "#e0f7ff", color: "#0091c7", border: "1px solid #b3e8ff", borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>
                    {detailOutlet.media}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{detailOutlet.name}</span>
                </div>
                {detailOutlet.pollutants.map((p, i) => (
                  <PollutantRowItem key={p.name} pollutant={p} showDivider={i > 0} />
                ))}
              </div>

              {/* Monitoring points section */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 3, height: 14, background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)", borderRadius: 2 }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                      监控点 ({detailOutlet.monitoringPoints.length})
                    </span>
                  </div>
                  <span style={{ fontSize: 13, color: "#6b7a8c" }}>单位：千克</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {detailOutlet.monitoringPoints.map((mp) => (
                    <div key={mp.seq} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(10,69,149,0.06)", overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px 10px", borderBottom: "1px solid #f0f3f7" }}>
                        <span style={{ fontSize: 13, color: "#8090a8", fontWeight: 500, minWidth: 16 }}>{mp.seq}</span>
                        <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>{mp.name}</span>
                        <span style={{ background: "#e6fffb", color: "#08979c", border: "1px solid #87e8de", borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>
                          {mp.type}
                        </span>
                      </div>
                      <div style={{ padding: "10px 14px 12px" }}>
                        {mp.pollutants.map((p, i) => (
                          <PollutantRowItem key={p.name} pollutant={p} showDivider={i > 0} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <TabBar />
    </div>
  );
}

// ─── PollutantRowItem ─────────────────────────────────────────────────────────

function PollutantRowItem({ pollutant, showDivider }: { pollutant: PollutantRow; showDivider: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderTop: showDivider ? "1px solid #f0f3f7" : "none" }}>
      <span style={{ background: "#f0f4f8", color: "#6b7a8c", padding: "3px 10px", borderRadius: 4, fontSize: 14 }}>
        {pollutant.name}
      </span>
      <span style={{ fontSize: 20, fontWeight: 700, color: "#1677ff" }}>
        {pollutant.value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
      </span>
    </div>
  );
}

// ─── OutletCard ───────────────────────────────────────────────────────────────

function OutletCard({ outlet, onDetail }: { outlet: Outlet; onDetail: () => void }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(10,69,149,0.06)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px 10px", borderBottom: "1px solid #f0f3f7" }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid #c9d4e3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#6b7a8c", fontWeight: 600, flexShrink: 0 }}>
          {outlet.seq}
        </div>
        <span style={{ background: "#e0f7ff", color: "#0091c7", border: "1px solid #b3e8ff", borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
          {outlet.media}
        </span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{outlet.name}</span>
        <button
          onClick={onDetail}
          style={{ border: "1px solid #d8e0ea", borderRadius: 14, padding: "5px 12px", fontSize: 13, color: "#6b7a8c", background: "none", cursor: "pointer" }}
        >
          详细
        </button>
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        {outlet.pollutants.map((p, i) => (
          <PollutantRowItem key={p.name} pollutant={p} showDivider={i > 0} />
        ))}
      </div>
    </div>
  );
}
