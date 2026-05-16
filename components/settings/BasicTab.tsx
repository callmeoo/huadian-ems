"use client";

import { useState } from "react";
import { Check, AlertOctagon } from "lucide-react";
import { OUTLETS, POLLUTANTS } from "./constants";

// ─── Rule schema ─────────────────────────────────────────────────────────────

type Rule = { id: string; name: string };

type RuleGroup = {
  id: string;
  name: string;
  description: string;
  subgroups?: { id: string; name: string; rules: Rule[] }[];
  rules?: Rule[];
};

const RULE_GROUPS: RuleGroup[] = [
  {
    id: "data",
    name: "数据值监测",
    description: "对各粒度监测数据本身的合规性检查",
    subgroups: [
      {
        id: "hour",
        name: "小时数据",
        rules: [
          { id: "h-over",      name: "数据超标"   },
          { id: "h-limit",     name: "数据超限值" },
          { id: "h-negative",  name: "数据负值"   },
          { id: "h-zero",      name: "数据零值"   },
          { id: "h-overrange", name: "数据超量程" },
          { id: "h-constant",  name: "数据恒值"   },
          { id: "h-missing",   name: "数据缺失"   },
        ],
      },
      {
        id: "day",
        name: "日数据",
        rules: [
          { id: "d-over",    name: "数据超标"   },
          { id: "d-limit",   name: "数据超限值" },
          { id: "d-missing", name: "数据缺失"   },
        ],
      },
      {
        id: "minute",
        name: "分钟数据",
        rules: [
          { id: "m-limit", name: "数据超限值" },
        ],
      },
    ],
  },
  {
    id: "dynamic",
    name: "动态预警",
    description: "基于历史趋势的早期预警",
    rules: [
      { id: "dyn-h", name: "小时超标分钟动态预警" },
      { id: "dyn-d", name: "日超标小时动态预警"   },
    ],
  },
  {
    id: "device",
    name: "设备状态",
    description: "监测设备本身的运行状态",
    rules: [
      { id: "offline",     name: "联网异常"             },
      { id: "maintenance", name: "自动监测设备维护"     },
    ],
  },
];

// flatten for default-all-on
const ALL_RULE_IDS: string[] = RULE_GROUPS.flatMap((g) =>
  g.subgroups
    ? g.subgroups.flatMap((sg) => sg.rules.map((r) => r.id))
    : (g.rules ?? []).map((r) => r.id),
);

function rulesOfGroup(g: RuleGroup): string[] {
  return g.subgroups
    ? g.subgroups.flatMap((sg) => sg.rules.map((r) => r.id))
    : (g.rules ?? []).map((r) => r.id);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BasicTab() {
  const [masterOn, setMasterOn] = useState(true);
  const [enabledRules, setEnabledRules] = useState<Set<string>>(new Set(ALL_RULE_IDS));
  const [outlets, setOutlets] = useState<Set<string>>(new Set(OUTLETS));
  const [pollutants, setPollutants] = useState<Set<string>>(new Set(POLLUTANTS.map((p) => p.key)));
  const [toast, setToast] = useState<string | null>(null);

  function toggleRule(id: string) {
    setEnabledRules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleGroup(g: RuleGroup) {
    const ids = rulesOfGroup(g);
    setEnabledRules((prev) => {
      const next = new Set(prev);
      const allOn = ids.every((id) => next.has(id));
      if (allOn) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  }

  function toggleOutlet(o: string) {
    setOutlets((prev) => {
      const next = new Set(prev);
      if (next.has(o)) next.delete(o); else next.add(o);
      return next;
    });
  }

  function togglePollutant(key: string) {
    setPollutants((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function setAllOutlets(on: boolean) {
    setOutlets(on ? new Set(OUTLETS) : new Set());
  }

  function setAllPollutants(on: boolean) {
    setPollutants(on ? new Set(POLLUTANTS.map((p) => p.key)) : new Set());
  }

  function save() {
    setToast("配置已保存");
    setTimeout(() => setToast(null), 1600);
  }

  const groupAllOn = (g: RuleGroup): boolean => {
    const ids = rulesOfGroup(g);
    return ids.length > 0 && ids.every((id) => enabledRules.has(id));
  };

  const groupSomeOn = (g: RuleGroup): boolean => {
    const ids = rulesOfGroup(g);
    return ids.some((id) => enabledRules.has(id));
  };

  const allOutletsOn = outlets.size === OUTLETS.length;
  const allPollutantsOn = pollutants.size === POLLUTANTS.length;

  const inactiveOpacity = masterOn ? 1 : 0.5;
  const pointerEvents = masterOn ? "auto" : "none";

  return (
    <div style={{ padding: "12px 14px 96px", display: "flex", flexDirection: "column", gap: 10 }}>
      {/* ── Master switch card ─────────────────────────────── */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: "14px 16px",
        boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: masterOn ? "#e6f4ff" : "#f5f5f5",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <AlertOctagon size={18} color={masterOn ? "#1677ff" : "#8090a8"} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>报警总开关</div>
          <div style={{ fontSize: 11, color: "#8090a8", marginTop: 2, lineHeight: 1.5 }}>
            {masterOn ? "已开启 · 下方规则按勾选项生效" : "已关闭 · 所有规则均不产生报警"}
          </div>
        </div>
        <Toggle on={masterOn} onChange={setMasterOn} />
      </div>

      {/* ── Scope card ─────────────────────────────────────── */}
      <div style={{
        opacity: inactiveOpacity,
        pointerEvents,
        transition: "opacity 0.15s",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
        padding: "14px 16px",
      }}>
        <CardTitle title="监控范围" hint="规则只对下方勾选的排放口与污染物生效" />

        {/* outlets */}
        <div style={{ marginTop: 12 }}>
          <RowHeader label="排放口" onAll={() => setAllOutlets(!allOutletsOn)} allOn={allOutletsOn} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {OUTLETS.map((o) => (
              <Chip
                key={o}
                label={o}
                checked={outlets.has(o)}
                onClick={() => toggleOutlet(o)}
              />
            ))}
          </div>
        </div>

        {/* pollutants */}
        <div style={{ marginTop: 14 }}>
          <RowHeader label="污染物" onAll={() => setAllPollutants(!allPollutantsOn)} allOn={allPollutantsOn} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {POLLUTANTS.map((p) => (
              <Chip
                key={p.key}
                label={p.name}
                checked={pollutants.has(p.key)}
                onClick={() => togglePollutant(p.key)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Rule groups ──────────────────────────────────── */}
      {RULE_GROUPS.map((g) => {
        const allOn = groupAllOn(g);
        const someOn = groupSomeOn(g);
        return (
          <div
            key={g.id}
            style={{
              opacity: inactiveOpacity,
              pointerEvents,
              transition: "opacity 0.15s",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
              padding: "14px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 600, color: "#1a1a1a",
                  display: "flex", alignItems: "center", gap: 7,
                }}>
                  <span style={{
                    width: 3, height: 14, flexShrink: 0,
                    background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
                    borderRadius: 2, display: "inline-block",
                  }} />
                  {g.name}
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: someOn ? "#1677ff" : "#8090a8",
                    background: someOn ? "#e6f4ff" : "#f5f5f5",
                    padding: "1px 7px", borderRadius: 8,
                  }}>
                    {rulesOfGroup(g).filter((id) => enabledRules.has(id)).length}
                    {" / "}
                    {rulesOfGroup(g).length}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#8090a8", marginTop: 4 }}>{g.description}</div>
              </div>
              <button
                onClick={() => toggleGroup(g)}
                style={{
                  flexShrink: 0, fontSize: 12, color: "#1677ff",
                  background: "rgba(22,119,255,0.08)",
                  border: "1px solid rgba(22,119,255,0.2)",
                  borderRadius: 12, padding: "3px 10px",
                  cursor: "pointer", outline: "none",
                }}
              >
                {allOn ? "全部关闭" : "全部开启"}
              </button>
            </div>

            {/* subgroups (粒度分组) or flat rules */}
            <div style={{ marginTop: 12 }}>
              {g.subgroups ? (
                g.subgroups.map((sg, idx) => (
                  <div key={sg.id} style={{ marginTop: idx === 0 ? 0 : 14 }}>
                    <div style={{
                      fontSize: 12, color: "#6b7a8c", fontWeight: 500, marginBottom: 8,
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: 2, background: "#bae0ff",
                      }} />
                      {sg.name}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {sg.rules.map((r) => (
                        <Chip
                          key={r.id}
                          label={r.name}
                          checked={enabledRules.has(r.id)}
                          onClick={() => toggleRule(r.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(g.rules ?? []).map((r) => (
                    <Chip
                      key={r.id}
                      label={r.name}
                      checked={enabledRules.has(r.id)}
                      onClick={() => toggleRule(r.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ── Bottom action bar ────────────────────────────── */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 60,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid #ebeef2",
        padding: "10px 14px",
        zIndex: 30,
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <div style={{ flex: 1, minWidth: 0, fontSize: 11, color: "#8090a8" }}>
          已开启 <span style={{ color: "#1677ff", fontWeight: 700 }}>{enabledRules.size}</span> / {ALL_RULE_IDS.length} 条规则
        </div>
        <button
          onClick={save}
          style={{
            height: 40, padding: "0 24px",
            background: "#1677ff",
            border: "none", borderRadius: 8,
            color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: "pointer", outline: "none",
            boxShadow: "0 4px 12px rgba(22,119,255,0.3)",
          }}
        >保存配置</button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", left: "50%", bottom: 120,
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
    </div>
  );
}

// ─── UI atoms ────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      aria-pressed={on}
      style={{
        width: 46, height: 26, borderRadius: 13,
        background: on ? "#1677ff" : "#d9dee5",
        border: "none", padding: 0, cursor: "pointer",
        position: "relative", flexShrink: 0,
        transition: "background 0.18s",
        outline: "none",
      }}
    >
      <span style={{
        position: "absolute",
        top: 2, left: on ? 22 : 2,
        width: 22, height: 22, borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        transition: "left 0.18s",
      }} />
    </button>
  );
}

function Chip({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        height: 32, padding: "0 12px",
        background: checked ? "#1677ff" : "#fff",
        border: `1px solid ${checked ? "#1677ff" : "#d9dee5"}`,
        borderRadius: 16,
        color: checked ? "#fff" : "#6b7a8c",
        fontSize: 12, fontWeight: checked ? 600 : 500,
        cursor: "pointer", outline: "none",
        transition: "background 0.12s, border 0.12s, color 0.12s",
      }}
    >
      {checked && <Check size={12} strokeWidth={3} />}
      {label}
    </button>
  );
}

function CardTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div>
      <div style={{
        fontSize: 14, fontWeight: 600, color: "#1a1a1a",
        display: "flex", alignItems: "center", gap: 7,
      }}>
        <span style={{
          width: 3, height: 14, flexShrink: 0,
          background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
          borderRadius: 2, display: "inline-block",
        }} />
        {title}
      </div>
      {hint && <div style={{ fontSize: 11, color: "#8090a8", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function RowHeader({ label, onAll, allOn }: { label: string; onAll: () => void; allOn: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ fontSize: 12, color: "#6b7a8c", fontWeight: 500, flex: 1 }}>{label}</span>
      <button
        onClick={onAll}
        style={{
          fontSize: 11, color: "#1677ff",
          background: "none", border: "none", padding: 0, cursor: "pointer", outline: "none",
        }}
      >{allOn ? "全部不选" : "全选"}</button>
    </div>
  );
}
