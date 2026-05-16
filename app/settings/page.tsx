"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronDown, ChevronUp, Check, Menu,
  Info, AlertTriangle,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import BasicTab from "@/components/settings/BasicTab";
import { ENTERPRISES, OUTLETS, POLLUTANTS, type Pollutant } from "@/components/settings/constants";

const DEFAULT_DURATION = "4";

// ─── Types ───────────────────────────────────────────────────────────────────

type DropdownKey = "enterprise" | "outlet";
type SettingTab = "basic" | "limit";

type LimitConfig = {
  upper:    string;
  lower:    string;
  emission: string;
  duration: string;
};

const EMPTY_CONFIG: LimitConfig = { upper: "", lower: "", emission: "", duration: "" };

// key = `${outlet}::${pollutantKey}`
type LimitMap = Record<string, LimitConfig>;

const INITIAL_DATA: LimitMap = {
  "废气排放口01::nox": { upper: "50", lower: "50", emission: "50", duration: "4" },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();

  const [tab, setTab] = useState<SettingTab>("limit");
  const [enterprise, setEnterprise] = useState(ENTERPRISES[0]);
  const [outlet, setOutlet]         = useState(OUTLETS[0]);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set([POLLUTANTS[0].key]));
  const [data, setData] = useState<LimitMap>(INITIAL_DATA);
  const [draft, setDraft] = useState<LimitMap>(INITIAL_DATA);
  const [toast, setToast] = useState<string | null>(null);

  const filterBarRef = useRef<HTMLDivElement>(null);
  const [filterBottom, setFilterBottom] = useState(0);

  useEffect(() => {
    if (filterBarRef.current) {
      setFilterBottom(filterBarRef.current.getBoundingClientRect().bottom);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  function toggleDropdown(key: DropdownKey) {
    if (filterBarRef.current) {
      setFilterBottom(filterBarRef.current.getBoundingClientRect().bottom);
    }
    setOpenDropdown((prev) => (prev === key ? null : key));
  }

  function closeDropdown() {
    setOpenDropdown(null);
  }

  function configKey(p: Pollutant): string {
    return `${outlet}::${p.key}`;
  }

  function getDraft(p: Pollutant): LimitConfig {
    return draft[configKey(p)] ?? EMPTY_CONFIG;
  }

  function getSaved(p: Pollutant): LimitConfig {
    return data[configKey(p)] ?? EMPTY_CONFIG;
  }

  function isConfigured(cfg: LimitConfig): boolean {
    return !!(cfg.upper || cfg.lower || cfg.emission);
  }

  function isDirty(p: Pollutant): boolean {
    const a = getDraft(p), b = getSaved(p);
    return a.upper !== b.upper || a.lower !== b.lower
        || a.emission !== b.emission || a.duration !== b.duration;
  }

  function updateDraft(p: Pollutant, patch: Partial<LimitConfig>) {
    setDraft((prev) => ({
      ...prev,
      [configKey(p)]: { ...(prev[configKey(p)] ?? EMPTY_CONFIG), ...patch },
    }));
  }

  function save(p: Pollutant) {
    const cfg = getDraft(p);
    setData((prev) => ({ ...prev, [configKey(p)]: cfg }));
    setToast(`已保存「${p.name}」`);
  }

  function clear(p: Pollutant) {
    setData((prev) => {
      const next = { ...prev };
      delete next[configKey(p)];
      return next;
    });
    setDraft((prev) => ({ ...prev, [configKey(p)]: { ...EMPTY_CONFIG } }));
    setToast(`已清空「${p.name}」`);
  }

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function expandAll() {
    setExpanded(new Set(POLLUTANTS.map((p) => p.key)));
  }
  function collapseAll() {
    setExpanded(new Set());
  }

  const configuredCount = useMemo(() => {
    return POLLUTANTS.filter((p) => isConfigured(getSaved(p))).length;
  }, [data, outlet]); // eslint-disable-line react-hooks/exhaustive-deps

  const allDropdowns: {
    key: DropdownKey;
    label: string;
    options: string[];
    value: string;
    setter: (v: string) => void;
  }[] = [
    { key: "enterprise", label: enterprise, options: ENTERPRISES, value: enterprise, setter: setEnterprise },
    { key: "outlet",     label: outlet,     options: OUTLETS,     value: outlet,     setter: setOutlet     },
  ];
  // outlet pill only makes sense on the limit tab; basic tab uses multi-select scope inside.
  const dropdownConfig = tab === "limit" ? allDropdowns : allDropdowns.slice(0, 1);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif", paddingBottom: 80 }}>

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
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", flex: 1 }}>报警设置</span>
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
            <Menu size={20} />
          </button>
        </div>

        {/* Sub Tabs */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", padding: "0 14px", gap: 24,
          marginTop: 2,
        }}>
          {([
            { key: "basic" as SettingTab, label: "基础配置" },
            { key: "limit" as SettingTab, label: "报警限值" },
          ]).map(({ key, label }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  background: "none", border: "none", padding: "10px 0 12px",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  opacity: active ? 1 : 0.65,
                  position: "relative", cursor: "pointer", outline: "none",
                }}
              >
                {label}
                {active && (
                  <span style={{
                    position: "absolute", bottom: 4, left: 0, right: 0,
                    height: 3, background: "#fff", borderRadius: 2,
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Filter pills */}
        <div
          ref={filterBarRef}
          style={{
            position: "relative", zIndex: 1,
            display: "flex", gap: 8,
            padding: "4px 14px 14px",
          }}
        >
          {dropdownConfig.map(({ key, label }) => {
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
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "calc(100% - 22px)" }}>{label}</span>
                {isOpen ? <ChevronUp size={14} style={{ flexShrink: 0 }} /> : <ChevronDown size={14} style={{ flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dropdown overlay */}
      {openDropdown && (
        <>
          <div
            onClick={closeDropdown}
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
                    onClick={() => { conf.setter(opt); closeDropdown(); }}
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

      {tab === "limit" ? (
        <>
          {/* Info banner */}
          <div style={{
            margin: "12px 14px 0",
            background: "#e6f4ff",
            border: "1px solid #bae0ff",
            borderRadius: 10,
            padding: "10px 12px",
            display: "flex", alignItems: "flex-start", gap: 8,
          }}>
            <Info size={16} color="#1677ff" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: "#0958d9", lineHeight: 1.55 }}>
              自定义污染物限值，将忽略数据超过该限值产生的报警提示。仅对当前选中的排放口生效。
            </span>
          </div>

          {/* Status bar */}
          <div style={{
            margin: "12px 14px 0",
            padding: "10px 12px",
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 11, color: "#8090a8" }}>当前配置</span>
              <span style={{
                fontSize: 12, color: "#1a1a1a", fontWeight: 500,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {outlet} · 已配置 <span style={{ color: "#1677ff", fontWeight: 700 }}>{configuredCount}</span> / {POLLUTANTS.length}
              </span>
            </div>
            <button
              onClick={() => (expanded.size === POLLUTANTS.length ? collapseAll() : expandAll())}
              style={{
                fontSize: 12, color: "#1677ff",
                background: "rgba(22,119,255,0.08)",
                border: "1px solid rgba(22,119,255,0.2)",
                borderRadius: 12, padding: "3px 10px",
                cursor: "pointer", outline: "none", flexShrink: 0,
              }}
            >
              {expanded.size === POLLUTANTS.length ? "全部收起" : "全部展开"}
            </button>
          </div>

          {/* Pollutant cards */}
          <div style={{ padding: "10px 14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {POLLUTANTS.map((p) => {
              const isOpen = expanded.has(p.key);
              const cfg = getDraft(p);
              const saved = getSaved(p);
              const configured = isConfigured(saved);
              const dirty = isDirty(p);
              return (
                <div
                  key={p.key}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                    overflow: "hidden",
                  }}
                >
                  {/* Card head */}
                  <button
                    onClick={() => toggleExpand(p.key)}
                    style={{
                      width: "100%",
                      display: "flex", alignItems: "center",
                      padding: "12px 14px",
                      background: "none", border: "none",
                      cursor: "pointer", outline: "none",
                      textAlign: "left", gap: 10,
                    }}
                  >
                    <span style={{
                      fontSize: 14, color: "#1a1a1a", fontWeight: 600, flex: 1,
                    }}>{p.name}</span>

                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      padding: "2px 8px", borderRadius: 10,
                      background: configured ? "#f0fff4" : "#f5f5f5",
                      color: configured ? "#389e0d" : "#8090a8",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: configured ? "#52c41a" : "#bfbfbf",
                      }} />
                      {configured ? "已配置" : "未配置"}
                    </span>

                    {dirty && (
                      <span style={{
                        fontSize: 10, color: "#fa8c16", fontWeight: 600,
                        padding: "2px 6px", borderRadius: 8,
                        background: "#fff7e6", border: "1px solid #ffd591",
                      }}>未保存</span>
                    )}

                    {isOpen
                      ? <ChevronUp size={16} color="#8090a8" />
                      : <ChevronDown size={16} color="#8090a8" />
                    }
                  </button>

                  {/* Card body */}
                  {isOpen && (
                    <div style={{
                      padding: "4px 14px 14px",
                      borderTop: "1px solid #f0f3f7",
                    }}>
                      <FieldRow
                        label="报警上限"
                        unit={p.unit}
                        value={cfg.upper}
                        placeholder="—"
                        onChange={(v) => updateDraft(p, { upper: v })}
                      />
                      <FieldRow
                        label="报警下限"
                        unit={p.unit}
                        value={cfg.lower}
                        placeholder="—"
                        onChange={(v) => updateDraft(p, { lower: v })}
                      />
                      {p.hasEmissionLimit && (
                        <FieldRow
                          label="排放限值"
                          unit={p.unit}
                          value={cfg.emission}
                          placeholder="—"
                          onChange={(v) => updateDraft(p, { emission: v })}
                        />
                      )}
                      <FieldRow
                        label="恒值持续时长"
                        unit="小时"
                        value={cfg.duration}
                        placeholder={DEFAULT_DURATION}
                        onChange={(v) => updateDraft(p, { duration: v })}
                      />

                      <div style={{
                        marginTop: 10,
                        padding: "8px 10px",
                        background: "#fffbe6",
                        border: "1px solid #ffe58f",
                        borderRadius: 8,
                        display: "flex", alignItems: "flex-start", gap: 6,
                      }}>
                        <AlertTriangle size={13} color="#d48806" style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: 11, color: "#874d00", lineHeight: 1.55 }}>
                          点击「清空设置」后，该污染物将不再产生报警提示。
                        </span>
                      </div>

                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <button
                          onClick={() => clear(p)}
                          style={{
                            flex: 1, height: 36,
                            background: "#f5f7fa",
                            border: "1px solid #ebeef2",
                            borderRadius: 8,
                            color: "#6b7a8c", fontSize: 13, fontWeight: 500,
                            cursor: "pointer", outline: "none",
                          }}
                        >清空设置</button>
                        <button
                          onClick={() => save(p)}
                          disabled={!dirty}
                          style={{
                            flex: 1, height: 36,
                            background: dirty ? "#1677ff" : "#bfdbfe",
                            border: "none",
                            borderRadius: 8,
                            color: "#fff", fontSize: 13, fontWeight: 600,
                            cursor: dirty ? "pointer" : "not-allowed",
                            outline: "none",
                            transition: "background 0.15s",
                          }}
                        >保存设置</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <BasicTab />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", left: "50%", bottom: 90,
          transform: "translateX(-50%)",
          background: "rgba(30,40,55,0.92)",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: 20,
          fontSize: 13,
          zIndex: 300,
          display: "flex", alignItems: "center", gap: 6,
          boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
        }}>
          <Check size={14} color="#52c41a" />
          {toast}
        </div>
      )}

      <TabBar />
    </div>
  );
}

// ─── Field row ───────────────────────────────────────────────────────────────

function FieldRow({
  label, unit, value, placeholder, onChange,
}: {
  label: string;
  unit: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid #f5f7fa",
    }}>
      <span style={{
        fontSize: 13, color: "#6b7a8c",
        width: 92, flexShrink: 0,
      }}>{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        style={{
          flex: 1,
          height: 32,
          border: "1px solid #ebeef2",
          borderRadius: 6,
          background: "#fafbfd",
          padding: "0 10px",
          fontSize: 13,
          color: "#1a1a1a",
          outline: "none",
          minWidth: 0,
        }}
      />
      <span style={{
        fontSize: 12, color: "#8090a8",
        marginLeft: 8, width: 76,
        textAlign: "right", flexShrink: 0,
      }}>{unit}</span>
    </div>
  );
}
