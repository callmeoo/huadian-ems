"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Users, Check, FlaskConical, ChevronDown } from "lucide-react";
import { ROLE_DESC, ROLE_LABEL, type TrainingRole } from "@/lib/mock/training";

type Props = {
  value: TrainingRole;
  onChange: (role: TrainingRole) => void;
};

const ROLES: TrainingRole[] = ["employee", "leader", "config"];

export default function RoleSwitcher({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // 计算下拉位置（基于触发器 boundingRect，逃出 Hero 的 overflow:hidden）
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const update = () => {
      const r = triggerRef.current!.getBoundingClientRect();
      setPos({
        top: r.bottom + 8,
        right: Math.max(8, window.innerWidth - r.right),
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  // 点击外部收起
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(t) &&
        panelRef.current && !panelRef.current.contains(t)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const dropdown = open && pos && (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: pos.top,
        right: pos.right,
        width: 240,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(10,69,149,0.18)",
        border: "1px solid #ebeef2",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          fontSize: 11,
          color: "#8090a8",
          letterSpacing: 0.5,
          borderBottom: "1px solid #f0f3f7",
          background: "#fafbfc",
        }}
      >
        切换演示视角
      </div>
      {ROLES.map((r) => {
        const active = r === value;
        return (
          <button
            key={r}
            onClick={() => { onChange(r); setOpen(false); }}
            style={{
              width: "100%",
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "10px 14px",
              background: active ? "#e6f4ff" : "transparent",
              border: "none",
              borderBottom: "1px solid #f5f7fa",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: active ? "#0d52c4" : "#1a1a1a",
                marginBottom: 2,
              }}>
                {ROLE_LABEL[r]}
              </div>
              <div style={{ fontSize: 11, color: "#8090a8" }}>{ROLE_DESC[r]}</div>
            </div>
            {active && <Check size={16} color="#1677ff" style={{ marginTop: 2 }} />}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* 触发器：演示徽标 + 当前角色 */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.32)",
          borderRadius: 20, padding: "4px 10px 4px 8px",
          color: "#fff", fontSize: 12, fontWeight: 500,
          cursor: "pointer", outline: "none",
        }}
      >
        <FlaskConical size={13} />
        <span style={{ fontSize: 10, opacity: 0.78, letterSpacing: 0.4 }}>演示</span>
        <span style={{ width: 1, height: 10, background: "rgba(255,255,255,0.32)" }} />
        <Users size={13} />
        <span>{ROLE_LABEL[value]}</span>
        <ChevronDown size={13} style={{ transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {mounted && dropdown && createPortal(dropdown, document.body)}
    </>
  );
}
