"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Plus, AlertTriangle, X, Package, Boxes,
  ShoppingCart, Clock, CheckCircle2, ArrowUpRight, ArrowDownLeft,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface StockMove {
  date: string;
  type: "in" | "out";
  qty: number;
  reason: string;
  operator: string;
}

interface SparePart {
  id: string;
  name: string;
  spec: string;
  vendor: string;
  category: string;          // 类别：耗材 / 维修件 / 标气
  stock: number;             // 当前库存
  minStock: number;          // 最低库存
  unit: string;              // 件 / 支 / 瓶
  purchaseDate: string;      // 采购日期
  productionDate: string;    // 生产日期
  arrivalDate: string;       // 到场日期
  shelfLifeMonths: number;   // 货架/使用寿命（月）
  moves: StockMove[];
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const TODAY = new Date("2026-05-16");

const PARTS: SparePart[] = [
  {
    id: "SP-001",
    name: "探头陶瓷过滤芯",
    spec: "ø50×120mm",
    vendor: "M&C",
    category: "耗材",
    stock: 3,
    minStock: 5,
    unit: "支",
    purchaseDate: "2024-12-10",
    productionDate: "2024-11-15",
    arrivalDate: "2024-12-15",
    shelfLifeMonths: 24,
    moves: [
      { date: "2026-04-22", type: "out", qty: 1, reason: "更换 SO₂ 分析仪滤芯", operator: "李运维" },
      { date: "2026-02-18", type: "out", qty: 1, reason: "更换 SO₂ 分析仪滤芯", operator: "李运维" },
      { date: "2025-12-15", type: "out", qty: 1, reason: "更换 NOx 分析仪滤芯", operator: "王工" },
      { date: "2024-12-15", type: "in",  qty: 6, reason: "采购入库", operator: "采购部" },
    ],
  },
  {
    id: "SP-002",
    name: "蠕动泵管",
    spec: "Tygon 3.2×1.6mm",
    vendor: "Saint-Gobain",
    category: "耗材",
    stock: 8,
    minStock: 10,
    unit: "段",
    purchaseDate: "2025-08-22",
    productionDate: "2025-08-01",
    arrivalDate: "2025-08-30",
    shelfLifeMonths: 36,
    moves: [
      { date: "2026-02-08", type: "out", qty: 1, reason: "更换颗粒物监测仪泵管", operator: "李运维" },
      { date: "2025-11-05", type: "out", qty: 1, reason: "更换颗粒物监测仪泵管", operator: "王工" },
      { date: "2025-08-30", type: "in",  qty: 10, reason: "采购入库", operator: "采购部" },
    ],
  },
  {
    id: "SP-003",
    name: "SO₂ 标准气体钢瓶",
    spec: "10L · 100 ppm",
    vendor: "南京特种气体",
    category: "标气",
    stock: 2,
    minStock: 1,
    unit: "瓶",
    purchaseDate: "2025-06-15",
    productionDate: "2025-05-30",
    arrivalDate: "2025-06-20",
    shelfLifeMonths: 12,
    moves: [
      { date: "2025-06-20", type: "in", qty: 2, reason: "采购入库", operator: "采购部" },
    ],
  },
  {
    id: "SP-004",
    name: "精密过滤器（一级）",
    spec: "M&C FP-2T",
    vendor: "M&C",
    category: "耗材",
    stock: 6,
    minStock: 5,
    unit: "支",
    purchaseDate: "2025-09-20",
    productionDate: "2025-09-01",
    arrivalDate: "2025-09-28",
    shelfLifeMonths: 36,
    moves: [
      { date: "2026-03-12", type: "out", qty: 1, reason: "更换 SO₂ 分析仪一级滤芯", operator: "李运维" },
      { date: "2025-09-28", type: "in",  qty: 8, reason: "采购入库", operator: "采购部" },
    ],
  },
  {
    id: "SP-005",
    name: "紫外光源灯",
    spec: "脉冲氙灯 D2-200",
    vendor: "Hamamatsu",
    category: "维修件",
    stock: 1,
    minStock: 2,
    unit: "支",
    purchaseDate: "2024-05-10",
    productionDate: "2024-04-20",
    arrivalDate: "2024-05-15",
    shelfLifeMonths: 36,
    moves: [
      { date: "2024-05-22", type: "out", qty: 1, reason: "更换 SO₂ 分析仪光源", operator: "厂家工程师" },
      { date: "2024-05-15", type: "in",  qty: 2, reason: "采购入库", operator: "采购部" },
    ],
  },
  {
    id: "SP-006",
    name: "干燥剂（Nafion 管）",
    spec: "MD-110-72",
    vendor: "Perma Pure",
    category: "耗材",
    stock: 4,
    minStock: 3,
    unit: "支",
    purchaseDate: "2025-10-05",
    productionDate: "2025-09-15",
    arrivalDate: "2025-10-12",
    shelfLifeMonths: 24,
    moves: [
      { date: "2026-01-18", type: "out", qty: 1, reason: "更换 NOx 分析仪除湿管", operator: "李运维" },
      { date: "2025-10-12", type: "in",  qty: 5, reason: "采购入库", operator: "采购部" },
    ],
  },
  {
    id: "SP-007",
    name: "NO 标准气体钢瓶",
    spec: "10L · 200 ppm",
    vendor: "南京特种气体",
    category: "标气",
    stock: 1,
    minStock: 1,
    unit: "瓶",
    purchaseDate: "2025-04-20",
    productionDate: "2025-04-10",
    arrivalDate: "2025-04-25",
    shelfLifeMonths: 12,
    moves: [
      { date: "2025-04-25", type: "in", qty: 2, reason: "采购入库", operator: "采购部" },
      { date: "2025-12-08", type: "out", qty: 1, reason: "NOx 量程校准开瓶使用", operator: "李运维" },
    ],
  },
  {
    id: "SP-008",
    name: "反吹电磁阀",
    spec: "SMC VX2120",
    vendor: "SMC",
    category: "维修件",
    stock: 3,
    minStock: 2,
    unit: "只",
    purchaseDate: "2024-07-12",
    productionDate: "2024-06-25",
    arrivalDate: "2024-07-18",
    shelfLifeMonths: 60,
    moves: [
      { date: "2024-08-15", type: "out", qty: 1, reason: "更换颗粒物监测仪电磁阀", operator: "王工" },
      { date: "2024-07-18", type: "in",  qty: 4, reason: "采购入库", operator: "采购部" },
    ],
  },
];

// ─── Utils ───────────────────────────────────────────────────────────────────

function daysBetween(a: Date, b: Date) {
  return Math.floor((a.getTime() - b.getTime()) / 86_400_000);
}

function stockLevel(p: SparePart): "ok" | "warn" | "danger" {
  if (p.stock < p.minStock) return "danger";
  if (p.stock <= p.minStock + 1) return "warn";
  return "ok";
}

function shelfLife(p: SparePart) {
  // 以"生产日期 + 寿命"作为有效期
  const expire = new Date(p.productionDate);
  expire.setMonth(expire.getMonth() + p.shelfLifeMonths);
  const remaining = daysBetween(expire, TODAY);
  const total = p.shelfLifeMonths * 30;
  const used = total - remaining;
  return { expire, remaining, total, pct: Math.min(100, Math.max(0, (used / total) * 100)) };
}

function shelfLevel(remaining: number): "ok" | "warn" | "danger" {
  if (remaining <= 30) return "danger";
  if (remaining <= 90) return "warn";
  return "ok";
}

const LEVEL_COLORS = {
  ok:     { bar: "#52c41a", bg: "#f0fff4", text: "#389e0d", iconBg: "#f0fff4", icon: "#389e0d" },
  warn:   { bar: "#faad14", bg: "#fffbe6", text: "#d48806", iconBg: "#fff7e0", icon: "#d46b08" },
  danger: { bar: "#ff4d4f", bg: "#fff1f0", text: "#cf1322", iconBg: "#fff0f0", icon: "#cf1322" },
} as const;

type FilterType = "all" | "low" | "expiring" | "ok";

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PartsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [adjustFor, setAdjustFor] = useState<SparePart | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const stats = useMemo(() => {
    const low = PARTS.filter((p) => stockLevel(p) !== "ok").length;
    const expiring = PARTS.filter((p) => shelfLevel(shelfLife(p).remaining) !== "ok").length;
    const totalQty = PARTS.reduce((s, p) => s + p.stock, 0);
    return { low, expiring, totalQty };
  }, []);

  const filtered = useMemo(() => {
    return PARTS.filter((p) => {
      if (filter === "all") return true;
      if (filter === "low") return stockLevel(p) !== "ok";
      if (filter === "expiring") return shelfLevel(shelfLife(p).remaining) !== "ok";
      if (filter === "ok") return stockLevel(p) === "ok" && shelfLevel(shelfLife(p).remaining) === "ok";
      return true;
    });
  }, [filter]);

  const openPart = openId ? PARTS.find((p) => p.id === openId) : null;

  function handleAdjust() {
    if (!adjustFor) return;
    setToast(`已更新 ${adjustFor.name} 库存`);
    setAdjustFor(null);
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
        position: "relative", overflow: "hidden", paddingBottom: 18,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px", opacity: 0.4, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -80, left: -60,
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Nav */}
        <div style={{ position: "relative", zIndex: 1, height: 44, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex" }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", flex: 1 }}>备件库</span>
          <button
            onClick={() => setToast("入库登记表单待接入数据库")}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff", fontSize: 12, fontWeight: 500,
              borderRadius: 14, padding: "5px 10px", cursor: "pointer",
            }}
          >
            <Plus size={14} /> 入库
          </button>
        </div>

        {/* 概览数据（可点筛选） */}
        <div style={{ position: "relative", zIndex: 1, padding: "8px 16px 0", display: "flex", gap: 8 }}>
          {([
            { label: "备件种类", num: PARTS.length, suffix: "种", target: "all" as FilterType },
            { label: "在库总数", num: stats.totalQty, suffix: "件", target: "all" as FilterType },
            { label: "库存预警", num: stats.low, suffix: "种", highlight: stats.low > 0, target: "low" as FilterType, disabled: stats.low === 0 },
            { label: "临期预警", num: stats.expiring, suffix: "种", highlight: stats.expiring > 0, target: "expiring" as FilterType, disabled: stats.expiring === 0 },
          ]).map((s) => {
            const active = filter === s.target && (s.target !== "all" || ["all"].includes(filter));
            return (
              <button
                key={s.label}
                onClick={() => setFilter(s.target)}
                disabled={s.disabled}
                style={{
                  flex: 1, textAlign: "left", outline: "none",
                  cursor: s.disabled ? "default" : "pointer",
                  background: active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)",
                  border: `1px solid ${active ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.18)"}`,
                  borderRadius: 10, padding: "10px 8px",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{s.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <span style={{
                    fontSize: 18, fontWeight: 700,
                    color: s.highlight ? "#ffc96b" : "#fff",
                    lineHeight: 1,
                  }}>{s.num}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{s.suffix}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 采购预警条 */}
      {stats.low > 0 && (
        <div style={{ padding: "12px 14px 0" }}>
          <button
            onClick={() => setFilter("low")}
            style={{
              width: "100%", textAlign: "left", outline: "none", cursor: "pointer", border: "none",
              background: "#fff1f0", borderLeft: "4px solid #f5222d",
              borderRadius: 10, padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <ShoppingCart size={18} color="#f5222d" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#cf1322" }}>
                {stats.low} 种备件低于最低库存
              </div>
              <div style={{ fontSize: 11, color: "#a8071a", marginTop: 2 }}>
                建议尽快采购补货，避免影响 CEMS 正常运行
              </div>
            </div>
            <span style={{ fontSize: 12, color: "#cf1322" }}>查看 ›</span>
          </button>
        </div>
      )}

      {/* 状态筛选 */}
      <div style={{
        margin: "12px 14px 0",
        display: "flex", gap: 6, overflowX: "auto",
        paddingBottom: 2,
      }}>
        {[
          { key: "all" as const, label: `全部 ${PARTS.length}` },
          { key: "low" as const, label: `库存不足 ${stats.low}` },
          { key: "expiring" as const, label: `临期 ${stats.expiring}` },
          { key: "ok" as const, label: "正常" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "6px 14px", borderRadius: 16,
              fontSize: 12, fontWeight: filter === f.key ? 600 : 500,
              background: filter === f.key ? "#1677ff" : "#fff",
              color: filter === f.key ? "#fff" : "#6b7a8c",
              border: filter === f.key ? "none" : "1px solid #ebeef2",
              whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 备件列表 */}
      <div style={{ padding: "12px 14px 90px" }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", color: "#8090a8", fontSize: 13,
            padding: "40px 12px", background: "#fff", borderRadius: 12,
          }}>
            该分类下暂无备件
          </div>
        ) : (
          filtered.map((p) => {
            const sLevel = stockLevel(p);
            const shelf = shelfLife(p);
            const shLevel = shelfLevel(shelf.remaining);
            const stockPct = Math.min(100, (p.stock / Math.max(p.minStock * 2, 1)) * 100);

            return (
              <div
                key={p.id}
                style={{
                  background: "#fff", borderRadius: 12, padding: 14,
                  marginBottom: 8, boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                }}
              >
                <button
                  onClick={() => setOpenId(p.id)}
                  style={{
                    width: "100%", textAlign: "left", outline: "none", cursor: "pointer", border: "none",
                    background: "transparent", padding: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: LEVEL_COLORS[sLevel].iconBg,
                      color: LEVEL_COLORS[sLevel].icon,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Boxes size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{p.name}</span>
                        <div style={{ display: "flex", gap: 5 }}>
                          {sLevel !== "ok" && (
                            <span style={{
                              fontSize: 10, fontWeight: 600,
                              padding: "2px 7px", borderRadius: 8,
                              background: LEVEL_COLORS[sLevel].bg, color: LEVEL_COLORS[sLevel].text,
                            }}>{sLevel === "danger" ? "库存不足" : "库存偏低"}</span>
                          )}
                          {shLevel !== "ok" && (
                            <span style={{
                              fontSize: 10, fontWeight: 600,
                              padding: "2px 7px", borderRadius: 8,
                              background: LEVEL_COLORS[shLevel].bg, color: LEVEL_COLORS[shLevel].text,
                            }}>{shLevel === "danger" && shelf.remaining < 0 ? "已过期" : "临期"}</span>
                          )}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: "#8090a8", marginTop: 3 }}>
                        {p.spec} · {p.vendor} · {p.category}
                      </div>
                    </div>
                  </div>

                  {/* 库存进度 */}
                  <div style={{ marginTop: 11, display: "flex", gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        fontSize: 11, marginBottom: 4,
                      }}>
                        <span style={{ color: "#6b7a8c" }}>当前库存</span>
                        <span style={{ color: "#1a1a1a", fontWeight: 600 }}>
                          {p.stock}
                          <span style={{ color: "#8090a8", fontWeight: 400, marginLeft: 2 }}>/ 最低 {p.minStock} {p.unit}</span>
                        </span>
                      </div>
                      <LifeBar pct={stockPct} level={sLevel} />
                    </div>
                  </div>
                </button>

                {sLevel !== "ok" && (
                  <button
                    onClick={() => setAdjustFor(p)}
                    style={{
                      marginTop: 11, width: "100%",
                      background: sLevel === "danger" ? "#1677ff" : "#fff",
                      color: sLevel === "danger" ? "#fff" : "#1677ff",
                      border: sLevel === "danger" ? "none" : "1px solid #1677ff",
                      borderRadius: 8, padding: "8px 0",
                      fontSize: 13, fontWeight: 500,
                      cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center", gap: 5,
                    }}
                  >
                    <ShoppingCart size={14} /> {sLevel === "danger" ? "登记采购入库" : "调整库存"}
                  </button>
                )}
              </div>
            );
          })
        )}
        <div style={ellipsisHintStyle}>
          + O 型圈、隔膜泵、压力变送器、流量计 等共 26 种备件
        </div>
      </div>

      <TabBar />

      {/* 详情抽屉 */}
      {openPart && (
        <DetailDrawer onClose={() => setOpenId(null)} title={openPart.name} subtitle={`${openPart.spec} · ${openPart.vendor}`}>
          <DetailFields fields={[
            ["备件编号", openPart.id],
            ["分类", openPart.category],
            ["采购日期", openPart.purchaseDate],
            ["生产日期", openPart.productionDate],
            ["到场日期", openPart.arrivalDate],
            ["货架/使用寿命", `${openPart.shelfLifeMonths} 个月`],
            ["有效期至", shelfLife(openPart).expire.toISOString().slice(0, 10)],
          ]} />

          <StockOverview part={openPart} />
          <ShelfOverview part={openPart} />
          <MovesList moves={openPart.moves} unit={openPart.unit} />

          <button
            onClick={() => { setOpenId(null); setAdjustFor(openPart); }}
            style={{
              marginTop: 16, width: "100%", background: "#1677ff", color: "#fff",
              border: "none", borderRadius: 10, padding: "12px 0",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <Package size={16} /> 调整库存
          </button>
        </DetailDrawer>
      )}

      {/* 调整库存 modal */}
      {adjustFor && (
        <AdjustModal part={adjustFor} onClose={() => setAdjustFor(null)} onSubmit={handleAdjust} />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
          background: "rgba(20,30,45,0.92)", color: "#fff",
          padding: "10px 18px", borderRadius: 22, fontSize: 13,
          display: "flex", alignItems: "center", gap: 7, zIndex: 400,
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        }}>
          <CheckCircle2 size={16} color="#52c41a" /> {toast}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const ellipsisHintStyle: React.CSSProperties = {
  textAlign: "center", color: "#8090a8", fontSize: 12,
  padding: "16px 12px", background: "#fff", borderRadius: 12,
  border: "1px dashed #d9e0e8",
};

function LifeBar({ pct, level }: { pct: number; level: "ok" | "warn" | "danger" }) {
  return (
    <div style={{ height: 6, background: "#eef1f5", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: LEVEL_COLORS[level].bar, transition: "width 0.3s" }} />
    </div>
  );
}

function DetailDrawer({ title, subtitle, onClose, children }: {
  title: string; subtitle?: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300 }} />
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0,
        background: "#fff", borderRadius: "20px 20px 0 0", zIndex: 301,
        maxHeight: "85vh", display: "flex", flexDirection: "column",
      }}>
        <div style={{ width: 36, height: 4, background: "#e0e6ef", borderRadius: 2, margin: "12px auto 0" }} />
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px 14px", borderBottom: "1px solid #f0f3f7",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: "#8090a8", marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: "50%", border: "none",
              background: "#f0f3f7", cursor: "pointer", color: "#6b7a8c",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          ><X size={16} /></button>
        </div>
        <div style={{ overflowY: "auto", padding: "16px 20px 32px" }}>
          {children}
        </div>
      </div>
    </>
  );
}

function DetailFields({ fields }: { fields: [string, string][] }) {
  return (
    <div style={{ background: "#f7f9fc", borderRadius: 10, padding: "10px 14px" }}>
      {fields.map(([k, v], i) => (
        <div key={k} style={{
          display: "flex", justifyContent: "space-between", padding: "8px 0",
          borderBottom: i < fields.length - 1 ? "1px solid #ebeef2" : "none",
          fontSize: 13,
        }}>
          <span style={{ color: "#6b7a8c" }}>{k}</span>
          <span style={{ color: "#1a1a1a", fontWeight: 500, textAlign: "right" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, marginTop: 16 }}>
      <span style={{
        width: 3, height: 14, borderRadius: 2,
        background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
      }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{children}</span>
    </div>
  );
}

function StockOverview({ part }: { part: SparePart }) {
  const level = stockLevel(part);
  const c = LEVEL_COLORS[level];
  const pct = Math.min(100, (part.stock / Math.max(part.minStock * 2, 1)) * 100);
  return (
    <>
      <SectionLabel>库存情况</SectionLabel>
      <div style={{ background: c.bg, borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 26, fontWeight: 700, color: c.text }}>{part.stock}</span>
            <span style={{ fontSize: 12, color: c.text, marginLeft: 5 }}>{part.unit} · 当前库存</span>
          </div>
          <span style={{ fontSize: 11, color: c.text, fontWeight: 600 }}>
            最低 {part.minStock} {part.unit}
          </span>
        </div>
        <LifeBar pct={pct} level={level} />
        {level !== "ok" && (
          <div style={{ marginTop: 8, fontSize: 11, color: c.text }}>
            <ShoppingCart size={11} style={{ display: "inline", verticalAlign: -1, marginRight: 4 }} />
            建议采购 {Math.max(part.minStock * 2 - part.stock, 1)} {part.unit}
          </div>
        )}
      </div>
    </>
  );
}

function ShelfOverview({ part }: { part: SparePart }) {
  const shelf = shelfLife(part);
  const level = shelfLevel(shelf.remaining);
  const c = LEVEL_COLORS[level];
  return (
    <>
      <SectionLabel>有效期 / 寿命</SectionLabel>
      <div style={{ background: c.bg, borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 26, fontWeight: 700, color: c.text }}>
              {shelf.remaining < 0 ? -shelf.remaining : shelf.remaining}
            </span>
            <span style={{ fontSize: 12, color: c.text, marginLeft: 5 }}>
              天 {shelf.remaining < 0 ? "(已过期)" : "剩余"}
            </span>
          </div>
          <span style={{ fontSize: 11, color: c.text, fontWeight: 600 }}>
            <Clock size={11} style={{ display: "inline", verticalAlign: -1, marginRight: 3 }} />
            已使用 {Math.round(shelf.pct)}%
          </span>
        </div>
        <LifeBar pct={shelf.pct} level={level} />
      </div>
    </>
  );
}

function MovesList({ moves, unit }: { moves: StockMove[]; unit: string }) {
  return (
    <>
      <SectionLabel>入库 / 出库流水（共 {moves.length} 条）</SectionLabel>
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #ebeef2" }}>
        {moves.map((m, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px",
            borderBottom: i < moves.length - 1 ? "1px solid #f0f3f7" : "none",
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: m.type === "in" ? "#f0fff4" : "#fff7e0",
              color: m.type === "in" ? "#389e0d" : "#d46b08",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {m.type === "in" ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a" }}>{m.reason}</div>
              <div style={{ fontSize: 11, color: "#8090a8", marginTop: 2 }}>{m.date} · {m.operator}</div>
            </div>
            <div style={{
              fontSize: 13, fontWeight: 700,
              color: m.type === "in" ? "#389e0d" : "#d46b08",
            }}>
              {m.type === "in" ? "+" : "−"}{m.qty} {unit}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function AdjustModal({ part, onClose, onSubmit }: {
  part: SparePart; onClose: () => void; onSubmit: () => void;
}) {
  const [type, setType] = useState<"in" | "out">("in");
  const [qty, setQty] = useState(part.stock < part.minStock ? part.minStock * 2 - part.stock : 1);
  const [reason, setReason] = useState("");

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 400 }} />
      <div style={{
        position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
        background: "#fff", borderRadius: 14, zIndex: 401,
        width: "calc(100% - 40px)", maxWidth: 380, padding: 20,
        boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Package size={18} color="#1677ff" />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>调整库存</span>
        </div>
        <div style={{
          fontSize: 13, color: "#6b7a8c",
          padding: "10px 12px", background: "#f7f9fc",
          borderRadius: 8, marginBottom: 16,
          display: "flex", justifyContent: "space-between",
        }}>
          <span>{part.name}</span>
          <span style={{ color: "#1a1a1a" }}>当前 {part.stock} {part.unit}</span>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#6b7a8c", marginBottom: 6 }}>操作类型</div>
          <div style={{ display: "flex", gap: 6 }}>
            {([
              { k: "in" as const, label: "入库 +", color: "#389e0d", bg: "#f0fff4" },
              { k: "out" as const, label: "出库 −", color: "#d46b08", bg: "#fff7e0" },
            ]).map((t) => (
              <button
                key={t.k}
                onClick={() => setType(t.k)}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8,
                  border: type === t.k ? `1.5px solid ${t.color}` : "1px solid #ebeef2",
                  background: type === t.k ? t.bg : "#fff",
                  color: type === t.k ? t.color : "#6b7a8c",
                  fontSize: 13, fontWeight: type === t.k ? 600 : 500, cursor: "pointer",
                }}
              >{t.label}</button>
            ))}
          </div>
        </div>

        <FormItem label="数量">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              style={qtyBtnStyle}
            >−</button>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ ...inputStyle, textAlign: "center", flex: 1 }}
            />
            <button
              onClick={() => setQty(qty + 1)}
              style={qtyBtnStyle}
            >+</button>
            <span style={{ fontSize: 13, color: "#8090a8" }}>{part.unit}</span>
          </div>
        </FormItem>

        <FormItem label={type === "in" ? "入库来源" : "出库用途"}>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={type === "in" ? "如：采购入库 / 退还" : "如：更换某设备零部件"}
            style={inputStyle}
          />
        </FormItem>

        <div style={{
          fontSize: 12, color: "#1a1a1a",
          background: "#e6f4ff", padding: "8px 12px",
          borderRadius: 8, marginBottom: 14,
        }}>
          操作后库存：<strong>{type === "in" ? part.stock + qty : Math.max(0, part.stock - qty)} {part.unit}</strong>
          {type === "out" && part.stock - qty < part.minStock && (
            <span style={{ color: "#cf1322", marginLeft: 8 }}>
              <AlertTriangle size={11} style={{ display: "inline", verticalAlign: -1 }} /> 将低于最低库存
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px 0", borderRadius: 8,
            background: "#f0f3f7", color: "#6b7a8c", border: "none",
            fontSize: 14, fontWeight: 500, cursor: "pointer",
          }}>取消</button>
          <button onClick={onSubmit} style={{
            flex: 2, padding: "10px 0", borderRadius: 8,
            background: "#1677ff", color: "#fff", border: "none",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>确认</button>
        </div>
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 12px", borderRadius: 8,
  border: "1px solid #d9e0e8", fontSize: 13, color: "#1a1a1a",
  background: "#fff", outline: "none", boxSizing: "border-box",
};

const qtyBtnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8,
  border: "1px solid #d9e0e8", background: "#fff",
  fontSize: 18, color: "#1677ff", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
};

function FormItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: "#6b7a8c", marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}
