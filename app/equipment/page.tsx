"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Plus, AlertTriangle, X, Wrench, Cpu,
  Filter as FilterIcon, Activity, Clock, History, CheckCircle2,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";

// ─── Types ───────────────────────────────────────────────────────────────────

type Unit = "#1 锅炉" | "#2 锅炉";

interface MaintenanceRecord {
  date: string;
  action: string;
  operator: string;
  note?: string;
}

interface Instrument {
  id: string;
  name: string;
  model: string;
  vendor: string;
  unit: Unit;
  location: string;
  installDate: string;       // YYYY-MM-DD
  lifeYears: number;         // 设计寿命（年）
  lastCalibration: string;
  status: "running" | "maintenance" | "fault";
  history: MaintenanceRecord[];
}

interface Component {
  id: string;
  name: string;
  spec: string;
  parentName: string;        // 装于哪台整机
  parentId: string;
  installDate: string;
  lifeDays: number;          // 设计寿命（天）
  isConsumable: boolean;
  history: MaintenanceRecord[];
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const TODAY = new Date("2026-05-16");

const INSTRUMENTS: Instrument[] = [
  {
    id: "INS-001",
    name: "SO₂ 分析仪",
    model: "SCS-900",
    vendor: "雪迪龙",
    unit: "#1 锅炉",
    location: "1 号 CEMS 站房",
    installDate: "2018-03-15",
    lifeYears: 10,
    lastCalibration: "2026-04-08",
    status: "running",
    history: [
      { date: "2026-04-08", action: "季度全系统校准", operator: "李运维" },
      { date: "2025-10-12", action: "更换光源灯", operator: "王工" },
      { date: "2018-03-15", action: "设备安装投运", operator: "厂家工程师" },
    ],
  },
  {
    id: "INS-002",
    name: "NOx 分析仪",
    model: "Ultramat 23",
    vendor: "西门子",
    unit: "#1 锅炉",
    location: "1 号 CEMS 站房",
    installDate: "2019-09-08",
    lifeYears: 10,
    lastCalibration: "2026-04-08",
    status: "running",
    history: [
      { date: "2026-04-08", action: "季度全系统校准", operator: "李运维" },
      { date: "2024-03-22", action: "化学发光池清洗", operator: "厂家工程师" },
      { date: "2019-09-08", action: "设备安装投运", operator: "厂家工程师" },
    ],
  },
  {
    id: "INS-003",
    name: "颗粒物监测仪",
    model: "LGM-3000",
    vendor: "聚光科技",
    unit: "#2 锅炉",
    location: "2 号 CEMS 站房",
    installDate: "2017-06-22",
    lifeYears: 8,
    lastCalibration: "2026-04-20",
    status: "running",
    history: [
      { date: "2026-04-20", action: "季度全系统校准", operator: "李运维" },
      { date: "2025-08-30", action: "光路清洗 + 反吹检修", operator: "王工" },
      { date: "2023-07-15", action: "更换采样泵隔膜", operator: "厂家工程师" },
      { date: "2017-06-22", action: "设备安装投运", operator: "厂家工程师" },
    ],
  },
  {
    id: "INS-004",
    name: "烟气流速仪",
    model: "D-FW 230",
    vendor: "DURAG",
    unit: "#2 锅炉",
    location: "2 号烟道",
    installDate: "2018-11-30",
    lifeYears: 10,
    lastCalibration: "2026-03-15",
    status: "running",
    history: [
      { date: "2026-03-15", action: "皮托管清洗 + 校准", operator: "李运维" },
      { date: "2024-05-18", action: "差压变送器更换", operator: "厂家工程师" },
      { date: "2018-11-30", action: "设备安装投运", operator: "厂家工程师" },
    ],
  },
  {
    id: "INS-005",
    name: "O₂ 分析仪",
    model: "Oxymat 6",
    vendor: "西门子",
    unit: "#1 锅炉",
    location: "1 号 CEMS 站房",
    installDate: "2018-04-20",
    lifeYears: 8,
    lastCalibration: "2026-04-08",
    status: "running",
    history: [
      { date: "2026-04-08", action: "零点/量程校准", operator: "李运维" },
      { date: "2024-06-10", action: "氧化锆探头更换", operator: "厂家工程师" },
      { date: "2018-04-20", action: "设备安装投运", operator: "厂家工程师" },
    ],
  },
  {
    id: "INS-006",
    name: "加热取样探头",
    model: "SP2000-H",
    vendor: "M&C",
    unit: "#2 锅炉",
    location: "2 号烟道取样点",
    installDate: "2020-05-12",
    lifeYears: 8,
    lastCalibration: "2026-02-10",
    status: "fault",
    history: [
      { date: "2026-05-14", action: "加热模块异常告警，待维修", operator: "李运维", note: "温度不能稳定至 180℃" },
      { date: "2025-12-05", action: "陶瓷滤芯更换", operator: "王工" },
      { date: "2020-05-12", action: "设备安装投运", operator: "厂家工程师" },
    ],
  },
  {
    id: "INS-007",
    name: "DAS 数采仪",
    model: "SCS-DAS-3",
    vendor: "雪迪龙",
    unit: "#1 锅炉",
    location: "CEMS 监控室",
    installDate: "2021-08-08",
    lifeYears: 6,
    lastCalibration: "2026-03-30",
    status: "running",
    history: [
      { date: "2026-03-30", action: "数据传输有效率核查", operator: "李运维" },
      { date: "2024-11-12", action: "硬盘升级 + 系统补丁", operator: "厂家工程师" },
      { date: "2021-08-08", action: "设备安装投运", operator: "厂家工程师" },
    ],
  },
];

const COMPONENTS: Component[] = [
  {
    id: "PRT-001",
    name: "探头陶瓷过滤芯",
    spec: "ø50×120mm",
    parentName: "SO₂ 分析仪 (INS-001)",
    parentId: "INS-001",
    installDate: "2026-04-22",
    lifeDays: 60,
    isConsumable: true,
    history: [
      { date: "2026-04-22", action: "更换新滤芯", operator: "李运维", note: "上一支堵塞严重" },
      { date: "2026-02-18", action: "更换新滤芯", operator: "李运维" },
      { date: "2025-12-15", action: "更换新滤芯", operator: "王工" },
    ],
  },
  {
    id: "PRT-002",
    name: "蠕动泵管",
    spec: "Tygon 3.2×1.6mm",
    parentName: "颗粒物监测仪 (INS-003)",
    parentId: "INS-003",
    installDate: "2026-02-08",
    lifeDays: 90,
    isConsumable: true,
    history: [
      { date: "2026-02-08", action: "更换泵管", operator: "李运维" },
      { date: "2025-11-05", action: "更换泵管", operator: "王工" },
    ],
  },
  {
    id: "PRT-003",
    name: "精密过滤器（一级）",
    spec: "M&C FP-2T",
    parentName: "SO₂ 分析仪 (INS-001)",
    parentId: "INS-001",
    installDate: "2026-03-12",
    lifeDays: 180,
    isConsumable: true,
    history: [
      { date: "2026-03-12", action: "更换滤芯", operator: "李运维" },
      { date: "2025-09-15", action: "更换滤芯", operator: "王工" },
    ],
  },
  {
    id: "PRT-004",
    name: "电子制冷器",
    spec: "EC-Pro 5L",
    parentName: "NOx 分析仪 (INS-002)",
    parentId: "INS-002",
    installDate: "2023-06-08",
    lifeDays: 1460,
    isConsumable: false,
    history: [
      { date: "2026-04-08", action: "排水管路检查 + 滤芯更换", operator: "李运维" },
      { date: "2023-06-08", action: "整机更换（旧机故障）", operator: "厂家工程师" },
    ],
  },
  {
    id: "PRT-005",
    name: "紫外光源灯",
    spec: "脉冲氙灯 D2-200",
    parentName: "SO₂ 分析仪 (INS-001)",
    parentId: "INS-001",
    installDate: "2024-05-22",
    lifeDays: 730,
    isConsumable: true,
    history: [
      { date: "2024-05-22", action: "光源灯更换", operator: "厂家工程师", note: "原灯亮度衰减" },
      { date: "2022-04-10", action: "光源灯更换", operator: "厂家工程师" },
    ],
  },
  {
    id: "PRT-006",
    name: "反吹电磁阀",
    spec: "SMC VX2120",
    parentName: "颗粒物监测仪 (INS-003)",
    parentId: "INS-003",
    installDate: "2024-08-15",
    lifeDays: 1095,
    isConsumable: false,
    history: [
      { date: "2024-08-15", action: "电磁阀更换", operator: "王工", note: "原阀线圈烧毁" },
    ],
  },
  {
    id: "PRT-007",
    name: "冷凝液排放器",
    spec: "DR-09",
    parentName: "加热取样探头 (INS-006)",
    parentId: "INS-006",
    installDate: "2025-11-20",
    lifeDays: 180,
    isConsumable: true,
    history: [
      { date: "2025-11-20", action: "排水器更换 + 管路清洗", operator: "李运维" },
      { date: "2025-05-25", action: "排水器更换", operator: "王工" },
    ],
  },
];

// ─── Utils ───────────────────────────────────────────────────────────────────

function daysBetween(a: Date, b: Date) {
  return Math.floor((a.getTime() - b.getTime()) / 86_400_000);
}

function instrumentLife(ins: Instrument) {
  const used = daysBetween(TODAY, new Date(ins.installDate));
  const total = ins.lifeYears * 365;
  const remaining = total - used;
  return { used, total, remaining, pct: Math.min(100, Math.max(0, (used / total) * 100)) };
}

function componentLife(c: Component) {
  const used = daysBetween(TODAY, new Date(c.installDate));
  const total = c.lifeDays;
  const remaining = total - used;
  return { used, total, remaining, pct: Math.min(100, Math.max(0, (used / total) * 100)) };
}

/** 返回颜色档：绿（充裕）/ 黄（≤30 天）/ 红（≤7 天或超期） */
function lifeLevel(remaining: number): "ok" | "warn" | "danger" {
  if (remaining <= 7) return "danger";
  if (remaining <= 30) return "warn";
  return "ok";
}

const LEVEL_COLORS = {
  ok:     { bar: "#52c41a", bg: "#f0fff4", text: "#389e0d", label: "充裕" },
  warn:   { bar: "#faad14", bg: "#fffbe6", text: "#d48806", label: "临期" },
  danger: { bar: "#ff4d4f", bg: "#fff1f0", text: "#cf1322", label: "告警" },
} as const;

// ─── Component pieces ────────────────────────────────────────────────────────

function LifeBar({ pct, level }: { pct: number; level: "ok" | "warn" | "danger" }) {
  return (
    <div style={{ height: 6, background: "#eef1f5", borderRadius: 3, overflow: "hidden", position: "relative" }}>
      <div style={{
        width: `${pct}%`, height: "100%",
        background: LEVEL_COLORS[level].bar,
        transition: "width 0.3s",
      }} />
    </div>
  );
}

function LifeBadge({ remaining }: { remaining: number }) {
  const level = lifeLevel(remaining);
  const c = LEVEL_COLORS[level];
  const text = remaining < 0 ? `已超期 ${-remaining} 天` : `剩余 ${remaining} 天`;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 10,
      background: c.bg, color: c.text,
      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {text}
    </div>
  );
}

function StatusDot({ status }: { status: Instrument["status"] }) {
  const map = {
    running:     { color: "#52c41a", label: "运行" },
    maintenance: { color: "#faad14", label: "检修" },
    fault:       { color: "#ff4d4f", label: "故障" },
  };
  const s = map[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6b7a8c" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
      {s.label}
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EquipmentPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"instrument" | "component">("instrument");
  const [warnOnly, setWarnOnly] = useState(false);
  const [openInsId, setOpenInsId] = useState<string | null>(null);
  const [openPrtId, setOpenPrtId] = useState<string | null>(null);
  const [replaceFor, setReplaceFor] = useState<Component | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // 预警计数
  const warnInstruments = useMemo(
    () => INSTRUMENTS.filter((i) => instrumentLife(i).remaining <= 30).length,
    [],
  );
  const warnComponents = useMemo(
    () => COMPONENTS.filter((c) => componentLife(c).remaining <= 30).length,
    [],
  );
  const totalWarn = warnInstruments + warnComponents;

  function selectTab(next: "instrument" | "component", filterWarn = false) {
    setTab(next);
    setWarnOnly(filterWarn);
  }

  function focusWarnings() {
    if (totalWarn === 0) return;
    selectTab(warnComponents >= warnInstruments ? "component" : "instrument", true);
  }

  // 当前 Tab 下要展示的列表（含告警筛选）
  const visibleInstruments = warnOnly
    ? INSTRUMENTS.filter((i) => lifeLevel(instrumentLife(i).remaining) !== "ok")
    : INSTRUMENTS;
  const visibleComponents = warnOnly
    ? COMPONENTS.filter((c) => lifeLevel(componentLife(c).remaining) !== "ok")
    : COMPONENTS;

  function handleReplace(c: Component) {
    setReplaceFor(null);
    setToast(`已记录更换：${c.name}（备件库已扣减 1 件）`);
    setTimeout(() => setToast(null), 2400);
  }

  const openIns = openInsId ? INSTRUMENTS.find((i) => i.id === openInsId) : null;
  const openPrt = openPrtId ? COMPONENTS.find((c) => c.id === openPrtId) : null;

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
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", flex: 1 }}>设备管理</span>
          <button
            onClick={() => setToast("登记表单待接入数据库")}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff", fontSize: 12, fontWeight: 500,
              borderRadius: 14, padding: "5px 10px", cursor: "pointer",
            }}
          >
            <Plus size={14} /> 登记
          </button>
        </div>

        {/* 概览数据条（可点） */}
        <div style={{ position: "relative", zIndex: 1, padding: "8px 16px 0", display: "flex", gap: 8 }}>
          {([
            { label: "整机", num: INSTRUMENTS.length, suffix: "台", onClick: () => selectTab("instrument"), active: tab === "instrument" && !warnOnly, highlight: false, disabled: false },
            { label: "零部件", num: COMPONENTS.length, suffix: "件", onClick: () => selectTab("component"), active: tab === "component" && !warnOnly, highlight: false, disabled: false },
            { label: "寿命告警", num: totalWarn, suffix: "项", onClick: focusWarnings, active: warnOnly, highlight: totalWarn > 0, disabled: totalWarn === 0 },
          ]).map((s) => (
            <button
              key={s.label}
              onClick={s.onClick}
              disabled={s.disabled}
              style={{
                flex: 1, textAlign: "left", outline: "none",
                cursor: s.disabled ? "default" : "pointer",
                background: s.active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)",
                border: `1px solid ${s.active ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.18)"}`,
                borderRadius: 10, padding: "10px 12px",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{
                  fontSize: 20, fontWeight: 700,
                  color: s.highlight ? "#ffc96b" : "#fff",
                  lineHeight: 1,
                }}>{s.num}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{s.suffix}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 预警提示条 */}
      {totalWarn > 0 && !warnOnly && (
        <div style={{ padding: "12px 14px 0" }}>
          <button
            onClick={focusWarnings}
            style={{
              width: "100%", textAlign: "left", outline: "none", cursor: "pointer", border: "none",
              background: "#fff7e6", borderLeft: "4px solid #fa8c16",
              borderRadius: 10, padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <AlertTriangle size={18} color="#fa8c16" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#874d00" }}>
                {totalWarn} 项寿命预警待处理
              </div>
              <div style={{ fontSize: 11, color: "#a06800", marginTop: 2 }}>
                {warnInstruments > 0 && `整机 ${warnInstruments} 台`}
                {warnInstruments > 0 && warnComponents > 0 && " · "}
                {warnComponents > 0 && `零部件 ${warnComponents} 件`}
                {" · 点此筛选查看"}
              </div>
            </div>
            <span style={{ fontSize: 12, color: "#fa8c16" }}>筛选 ›</span>
          </button>
        </div>
      )}

      {/* Tab */}
      <div style={{
        margin: "12px 14px 0", display: "flex",
        background: "#fff", borderRadius: 10, padding: 3,
        boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
      }}>
        {[
          { key: "instrument" as const, label: "整机", count: INSTRUMENTS.length },
          { key: "component" as const, label: "零部件", count: COMPONENTS.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => selectTab(t.key)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
              fontSize: 13, fontWeight: tab === t.key ? 600 : 500,
              background: tab === t.key ? "#1677ff" : "transparent",
              color: tab === t.key ? "#fff" : "#6b7a8c",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {t.label} · {t.count}
          </button>
        ))}
      </div>

      {/* 告警筛选指示条 */}
      {warnOnly && (
        <div style={{
          margin: "10px 14px 0",
          background: "#fff7e6", border: "1px solid #ffd591",
          borderRadius: 8, padding: "7px 12px",
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 12, color: "#874d00",
        }}>
          <AlertTriangle size={13} color="#fa8c16" />
          <span style={{ flex: 1 }}>
            仅显示寿命告警项（{tab === "instrument" ? visibleInstruments.length : visibleComponents.length} 条）
          </span>
          <button
            onClick={() => setWarnOnly(false)}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "#fa8c16", fontSize: 12, fontWeight: 500,
              display: "flex", alignItems: "center", gap: 3, padding: 0,
            }}
          >
            <X size={12} /> 看全部
          </button>
        </div>
      )}

      {/* 列表区 */}
      <div style={{ padding: "12px 14px 90px" }}>
        {tab === "instrument" ? (
          <>
            {visibleInstruments.length === 0 && (
              <div style={emptyHintStyle}>当前没有寿命告警的整机</div>
            )}
            {visibleInstruments.map((ins) => {
              const life = instrumentLife(ins);
              const level = lifeLevel(life.remaining);
              return (
                <button
                  key={ins.id}
                  onClick={() => setOpenInsId(ins.id)}
                  style={{
                    width: "100%", textAlign: "left", outline: "none", cursor: "pointer", border: "none",
                    background: "#fff", borderRadius: 12, padding: 14,
                    marginBottom: 8, boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: "#e0f7ff", color: "#0091c7",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Cpu size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{ins.name}</span>
                        <LifeBadge remaining={life.remaining} />
                      </div>
                      <div style={{ fontSize: 11, color: "#8090a8", marginTop: 3 }}>
                        {ins.vendor} {ins.model}
                      </div>
                      <div style={{ fontSize: 11, color: "#6b7a8c", marginTop: 4, display: "flex", alignItems: "center", gap: 10 }}>
                        <span>{ins.unit} · {ins.location}</span>
                        <StatusDot status={ins.status} />
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <LifeBar pct={life.pct} level={level} />
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: 10, color: "#8090a8", marginTop: 4,
                    }}>
                      <span>安装 {ins.installDate}</span>
                      <span>已运行 {(life.used / 365).toFixed(1)} / {ins.lifeYears} 年</span>
                    </div>
                  </div>
                </button>
              );
            })}
            {!warnOnly && (
              <div style={ellipsisHintStyle}>
                + 加热伴热管线、湿度仪、烟气温压一体仪 等共 12 台
              </div>
            )}
          </>
        ) : (
          <>
            {visibleComponents.length === 0 && (
              <div style={emptyHintStyle}>当前没有寿命告警的零部件</div>
            )}
            {visibleComponents.map((c) => {
              const life = componentLife(c);
              const level = lifeLevel(life.remaining);
              return (
                <div
                  key={c.id}
                  style={{
                    background: "#fff", borderRadius: 12, padding: 14,
                    marginBottom: 8, boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                  }}
                >
                  <button
                    onClick={() => setOpenPrtId(c.id)}
                    style={{
                      width: "100%", textAlign: "left", outline: "none", cursor: "pointer", border: "none",
                      background: "transparent", padding: 0,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: level === "danger" ? "#fff0f0" : level === "warn" ? "#fff7e0" : "#f0fff4",
                        color: level === "danger" ? "#cf1322" : level === "warn" ? "#d46b08" : "#389e0d",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <FilterIcon size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{c.name}</span>
                          <LifeBadge remaining={life.remaining} />
                        </div>
                        <div style={{ fontSize: 11, color: "#8090a8", marginTop: 3 }}>{c.spec}</div>
                        <div style={{ fontSize: 11, color: "#6b7a8c", marginTop: 4 }}>
                          装于 {c.parentName}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <LifeBar pct={life.pct} level={level} />
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        fontSize: 10, color: "#8090a8", marginTop: 4,
                      }}>
                        <span>上次更换 {c.installDate}</span>
                        <span>已用 {life.used} / {c.lifeDays} 天</span>
                      </div>
                    </div>
                  </button>
                  {level !== "ok" && (
                    <button
                      onClick={() => setReplaceFor(c)}
                      style={{
                        marginTop: 11, width: "100%",
                        background: level === "danger" ? "#1677ff" : "#fff",
                        color: level === "danger" ? "#fff" : "#1677ff",
                        border: level === "danger" ? "none" : "1px solid #1677ff",
                        borderRadius: 8, padding: "8px 0",
                        fontSize: 13, fontWeight: 500,
                        cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center", gap: 5,
                      }}
                    >
                      <Wrench size={14} /> 记录更换
                    </button>
                  )}
                </div>
              );
            })}
            {!warnOnly && (
              <div style={ellipsisHintStyle}>
                + 干燥剂、O 型圈、压力变送器、流量计 等共 43 件部件
              </div>
            )}
          </>
        )}
      </div>

      <TabBar />

      {/* 整机详情抽屉 */}
      {openIns && (
        <DetailDrawer onClose={() => setOpenInsId(null)} title={openIns.name} subtitle={`${openIns.vendor} ${openIns.model}`}>
          <DetailFields fields={[
            ["设备编号", openIns.id],
            ["所属机组", openIns.unit],
            ["安装位置", openIns.location],
            ["安装日期", openIns.installDate],
            ["设计寿命", `${openIns.lifeYears} 年`],
            ["累计运行", `${(instrumentLife(openIns).used / 365).toFixed(2)} 年 (${instrumentLife(openIns).used} 天)`],
            ["上次校准", openIns.lastCalibration],
          ]} />
          <LifeOverview life={instrumentLife(openIns)} unit="天" />
          <HistoryTimeline records={openIns.history} />
        </DetailDrawer>
      )}

      {/* 零部件详情抽屉 */}
      {openPrt && (
        <DetailDrawer onClose={() => setOpenPrtId(null)} title={openPrt.name} subtitle={openPrt.spec}>
          <DetailFields fields={[
            ["部件编号", openPrt.id],
            ["所属整机", openPrt.parentName],
            ["上次安装", openPrt.installDate],
            ["设计寿命", `${openPrt.lifeDays} 天`],
            ["已使用", `${componentLife(openPrt).used} 天`],
            ["类型", openPrt.isConsumable ? "耗材" : "维修件"],
          ]} />
          <LifeOverview life={componentLife(openPrt)} unit="天" />
          <HistoryTimeline records={openPrt.history} />
          <button
            onClick={() => { setOpenPrtId(null); setReplaceFor(openPrt); }}
            style={{
              marginTop: 16, width: "100%", background: "#1677ff", color: "#fff",
              border: "none", borderRadius: 10, padding: "12px 0",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <Wrench size={16} /> 记录更换
          </button>
        </DetailDrawer>
      )}

      {/* 记录更换 modal */}
      {replaceFor && (
        <ReplaceModal component={replaceFor} onClose={() => setReplaceFor(null)} onSubmit={() => handleReplace(replaceFor)} />
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

const emptyHintStyle: React.CSSProperties = {
  textAlign: "center", color: "#8090a8", fontSize: 13,
  padding: "32px 12px", background: "#fff", borderRadius: 12,
};

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

function LifeOverview({ life, unit }: { life: { used: number; total: number; remaining: number; pct: number }; unit: string }) {
  const level = lifeLevel(life.remaining);
  const c = LEVEL_COLORS[level];
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <span style={{
          width: 3, height: 14, borderRadius: 2,
          background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
        }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>寿命进度</span>
      </div>
      <div style={{
        background: c.bg, borderRadius: 10, padding: "14px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 26, fontWeight: 700, color: c.text }}>
              {life.remaining < 0 ? -life.remaining : life.remaining}
            </span>
            <span style={{ fontSize: 12, color: c.text, marginLeft: 5 }}>
              {life.remaining < 0 ? `${unit} (已超期)` : `${unit} 剩余`}
            </span>
          </div>
          <span style={{ fontSize: 11, color: c.text, fontWeight: 600 }}>
            <Clock size={11} style={{ display: "inline", verticalAlign: -1, marginRight: 3 }} />
            已使用 {Math.round(life.pct)}%
          </span>
        </div>
        <LifeBar pct={life.pct} level={level} />
      </div>
    </div>
  );
}

function HistoryTimeline({ records }: { records: MaintenanceRecord[] }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
        <span style={{
          width: 3, height: 14, borderRadius: 2,
          background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
        }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
          <History size={13} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
          维修 / 更换履历
        </span>
        <span style={{ fontSize: 11, color: "#8090a8" }}>共 {records.length} 条</span>
      </div>
      <div style={{ position: "relative", paddingLeft: 20 }}>
        {/* 时间线竖线 */}
        <div style={{
          position: "absolute", left: 5, top: 4, bottom: 4,
          width: 1, background: "#ebeef2",
        }} />
        {records.map((r, i) => (
          <div key={i} style={{ position: "relative", paddingBottom: i < records.length - 1 ? 14 : 0 }}>
            <div style={{
              position: "absolute", left: -19, top: 4,
              width: 11, height: 11, borderRadius: "50%",
              background: i === 0 ? "#1677ff" : "#d0dae8",
              border: "2px solid #fff",
              boxShadow: "0 0 0 1px " + (i === 0 ? "#1677ff" : "#d0dae8"),
            }} />
            <div style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 500 }}>{r.action}</div>
            <div style={{ fontSize: 11, color: "#8090a8", marginTop: 2 }}>
              {r.date} · {r.operator}
              {r.note && <span style={{ marginLeft: 6, color: "#6b7a8c" }}>· {r.note}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReplaceModal({ component, onClose, onSubmit }: {
  component: Component; onClose: () => void; onSubmit: () => void;
}) {
  const [reason, setReason] = useState("寿命到期");
  const [note, setNote] = useState("");

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
          <Wrench size={18} color="#1677ff" />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>记录部件更换</span>
        </div>
        <div style={{ fontSize: 13, color: "#6b7a8c", marginBottom: 16, padding: "10px 12px", background: "#f7f9fc", borderRadius: 8 }}>
          <Activity size={12} style={{ display: "inline", verticalAlign: -2, marginRight: 5 }} />
          {component.name} · {component.spec}
        </div>

        <FormItem label="更换日期">
          <input
            type="date"
            defaultValue="2026-05-16"
            style={inputStyle}
          />
        </FormItem>

        <FormItem label="更换原因">
          <select value={reason} onChange={(e) => setReason(e.target.value)} style={inputStyle}>
            <option>寿命到期</option>
            <option>故障维修</option>
            <option>预防性更换</option>
            <option>其他</option>
          </select>
        </FormItem>

        <FormItem label="备注">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="选填"
            rows={2}
            style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }}
          />
        </FormItem>

        <div style={{
          fontSize: 11, color: "#fa8c16",
          background: "#fff7e6", padding: "8px 12px",
          borderRadius: 8, marginBottom: 14,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <AlertTriangle size={13} /> 提交后将从备件库扣减 1 件「{component.name}」
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
          }}>确认更换</button>
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

function FormItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: "#6b7a8c", marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}
