"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Wind,
  Droplets,
  Volume2,
  Plus,
  Upload,
  FileText,
  X,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import type {
  ReportType,
  StandardSource,
  VerificationStandard,
} from "@/components/verification/types";

const TYPE_TABS: { key: ReportType; label: string; Icon: typeof Wind }[] = [
  { key: "gas", label: "废气", Icon: Wind },
  { key: "water", label: "废水", Icon: Droplets },
  { key: "noise", label: "噪声", Icon: Volume2 },
];

const SOURCE_LABEL: Record<StandardSource, { label: string; bg: string; color: string }> = {
  national: { label: "国家标准", bg: "#e6f4ff", color: "#0958d9" },
  group: { label: "集团内规", bg: "#f0fff4", color: "#389e0d" },
  expert: { label: "专家意见", bg: "#f5f0ff", color: "#531dab" },
};

interface NewStandardDraft {
  indicator: string;
  methods: string;
  limit: string;
  sampleMin: string;
  deviationMax: string;
  source: StandardSource;
  sourceDoc: string;
}

const EMPTY_DRAFT: NewStandardDraft = {
  indicator: "",
  methods: "",
  limit: "",
  sampleMin: "5",
  deviationMax: "±15%",
  source: "national",
  sourceDoc: "",
};

export default function StandardsPage() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<ReportType>("gas");
  const [items, setItems] = useState<VerificationStandard[] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState<NewStandardDraft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/verification/standards")
      .then((r) => r.json())
      .then((data: VerificationStandard[]) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  const filtered = useMemo(
    () => (items ?? []).filter((s) => s.type === activeType),
    [items, activeType],
  );

  const toggleActive = async (id: number, current: boolean) => {
    setItems((prev) =>
      (prev ?? []).map((s) => (s.id === id ? { ...s, active: !current } : s)),
    );
    await fetch(`/api/verification/standards/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    });
  };

  const handleAdd = async () => {
    if (!draft.indicator || !draft.methods || !draft.limit || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/verification/standards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeType,
          indicator: draft.indicator,
          methods: draft.methods.split(/[,，、\s]+/).filter(Boolean),
          limit: draft.limit,
          sampleMin: Number(draft.sampleMin) || 5,
          deviationMax: draft.deviationMax,
          source: draft.source,
          sourceDoc: draft.sourceDoc,
        }),
      });
      if (res.ok) {
        const created: VerificationStandard = await res.json();
        setItems((prev) => [...(prev ?? []), created]);
        setDraft(EMPTY_DRAFT);
        setShowAdd(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
          position: "relative",
          overflow: "hidden",
          paddingBottom: 14,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
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
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: 44,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 8,
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              padding: 0,
            }}
          >
            <ChevronLeft size={24} color="#fff" />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", flex: 1 }}>
            核验标准
          </span>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "5px 10px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Plus size={13} color="#fff" />
            新增
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: 8,
            padding: "10px 14px 0",
          }}
        >
          {TYPE_TABS.map(({ key, label, Icon }) => {
            const isActive = activeType === key;
            return (
              <button
                key={key}
                onClick={() => setActiveType(key)}
                style={{
                  flex: 1,
                  background: isActive ? "#fff" : "rgba(255,255,255,0.14)",
                  color: isActive ? "#0d52c4" : "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "9px 0",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <Icon size={14} color={isActive ? "#0d52c4" : "#fff"} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List header */}
      <div
        style={{
          padding: "14px 14px 8px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
          {TYPE_TABS.find((t) => t.key === activeType)?.label} 核验标准
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
          {filtered.length}
        </span>
      </div>

      {/* Standard cards */}
      <div
        style={{
          margin: "0 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {items === null ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "#8090a8",
              fontSize: 13,
            }}
          >
            加载中…
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "#8090a8",
              fontSize: 13,
            }}
          >
            该分类下暂无标准，点击右上角「新增」录入
          </div>
        ) : (
          filtered.map((s) => {
            const srcCfg = SOURCE_LABEL[s.source];
            return (
              <div
                key={s.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                  padding: "12px 14px",
                  opacity: s.active ? 1 : 0.55,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1a1a1a",
                      flex: 1,
                    }}
                  >
                    {s.indicator}
                  </div>
                  <span
                    style={{
                      background: srcCfg.bg,
                      color: srcCfg.color,
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 8,
                      fontWeight: 500,
                    }}
                  >
                    {srcCfg.label}
                  </span>
                  <ToggleSwitch
                    on={s.active}
                    onChange={() => toggleActive(s.id, s.active)}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 10, color: "#8090a8", marginBottom: 2 }}>
                      限值
                    </div>
                    <div style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 500 }}>
                      {s.limit}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#8090a8", marginBottom: 2 }}>
                      最少采样组数
                    </div>
                    <div style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 500 }}>
                      {s.sampleMin}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#8090a8", marginBottom: 2 }}>
                      偏差允许（与 CEMS）
                    </div>
                    <div style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 500 }}>
                      {s.deviationMax}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#8090a8", marginBottom: 2 }}>
                      更新于
                    </div>
                    <div style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 500 }}>
                      {s.updatedAt}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "#8090a8", marginBottom: 4 }}>
                    允许检测方法
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {s.methods.map((m) => (
                      <span
                        key={m}
                        style={{
                          background: "#f0f5ff",
                          color: "#1d39c4",
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 8,
                          fontWeight: 500,
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 10px",
                    background: "#f5f7fa",
                    borderRadius: 8,
                  }}
                >
                  <FileText size={13} color="#8090a8" />
                  <span
                    style={{
                      fontSize: 11,
                      color: "#6b7a8c",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.sourceDoc}
                  </span>
                  <button
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#1677ff",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: 11,
                    }}
                  >
                    <Upload size={11} color="#1677ff" />
                    更换
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 200,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: "18px 16px 22px",
              width: "100%",
              maxWidth: 480,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>
                新增{TYPE_TABS.find((t) => t.key === activeType)?.label}核验标准
              </span>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#8090a8",
                  display: "flex",
                  padding: 0,
                }}
              >
                <X size={20} color="#8090a8" />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="指标名称" required>
                <input
                  value={draft.indicator}
                  onChange={(e) => setDraft({ ...draft, indicator: e.target.value })}
                  placeholder="例如：氮氧化物 NOx"
                  style={inputStyle}
                />
              </Field>
              <Field label="允许检测方法" required hint="多个方法用逗号分隔">
                <input
                  value={draft.methods}
                  onChange={(e) => setDraft({ ...draft, methods: e.target.value })}
                  placeholder="HJ 692-2014, HJ 693-2014"
                  style={inputStyle}
                />
              </Field>
              <Field label="限值" required>
                <input
                  value={draft.limit}
                  onChange={(e) => setDraft({ ...draft, limit: e.target.value })}
                  placeholder="例如：≤ 50 mg/m³"
                  style={inputStyle}
                />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="最少采样组数">
                  <input
                    type="number"
                    value={draft.sampleMin}
                    onChange={(e) => setDraft({ ...draft, sampleMin: e.target.value })}
                    style={inputStyle}
                  />
                </Field>
                <Field label="偏差允许">
                  <input
                    value={draft.deviationMax}
                    onChange={(e) => setDraft({ ...draft, deviationMax: e.target.value })}
                    placeholder="±15%"
                    style={inputStyle}
                  />
                </Field>
              </div>
              <Field label="标准来源">
                <div style={{ display: "flex", gap: 6 }}>
                  {(["national", "group", "expert"] as StandardSource[]).map((src) => {
                    const cfg = SOURCE_LABEL[src];
                    const isActive = draft.source === src;
                    return (
                      <button
                        key={src}
                        onClick={() => setDraft({ ...draft, source: src })}
                        style={{
                          flex: 1,
                          padding: "8px 0",
                          borderRadius: 8,
                          border: isActive ? `1.5px solid ${cfg.color}` : "1px solid #e0e7ef",
                          background: isActive ? cfg.bg : "#fff",
                          color: isActive ? cfg.color : "#6b7a8c",
                          fontSize: 12,
                          fontWeight: isActive ? 600 : 500,
                          cursor: "pointer",
                        }}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="引用文件" hint="标准来源文件名（PDF 上传待开发）">
                <input
                  value={draft.sourceDoc}
                  onChange={(e) => setDraft({ ...draft, sourceDoc: e.target.value })}
                  placeholder="GB 13223-2011 火电厂大气污染物排放标准"
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  flex: 1,
                  background: "#f5f7fa",
                  color: "#6b7a8c",
                  border: "none",
                  borderRadius: 10,
                  padding: "11px 0",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                取消
              </button>
              <button
                onClick={handleAdd}
                disabled={!draft.indicator || !draft.methods || !draft.limit}
                style={{
                  flex: 1,
                  background:
                    !draft.indicator || !draft.methods || !draft.limit
                      ? "#a0c4ff"
                      : "linear-gradient(135deg, #1677ff 0%, #0d52c4 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "11px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor:
                    !draft.indicator || !draft.methods || !draft.limit
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #e0e7ef",
  borderRadius: 8,
  fontSize: 13,
  color: "#1a1a1a",
  outline: "none",
  boxSizing: "border-box",
};

function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          color: "#1a1a1a",
          fontWeight: 500,
          marginBottom: 5,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {label}
        {required && <span style={{ color: "#cf1322" }}>*</span>}
        {hint && (
          <span style={{ fontSize: 10, color: "#8090a8", fontWeight: 400 }}>
            （{hint}）
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: on ? "#1677ff" : "#d9d9d9",
        border: "none",
        cursor: "pointer",
        padding: 0,
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}
