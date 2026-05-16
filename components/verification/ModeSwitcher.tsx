"use client";

import { ClipboardList, CalendarCheck } from "lucide-react";

export type VerificationMode = "third-party" | "routine";

export default function ModeSwitcher({
  mode,
  onModeChange,
}: {
  mode: VerificationMode;
  onModeChange: (m: VerificationMode) => void;
}) {
  const options: { key: VerificationMode; label: string; Icon: typeof ClipboardList }[] = [
    { key: "third-party", label: "第三方检测核验", Icon: ClipboardList },
    { key: "routine", label: "定期工作核验", Icon: CalendarCheck },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        background: "rgba(255,255,255,0.16)",
        padding: 4,
        borderRadius: 10,
        backdropFilter: "blur(4px)",
      }}
    >
      {options.map(({ key, label, Icon }) => {
        const active = mode === key;
        return (
          <button
            key={key}
            onClick={() => onModeChange(key)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: active ? "#fff" : "transparent",
              color: active ? "#0d52c4" : "rgba(255,255,255,0.92)",
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              transition: "all 0.15s",
            }}
          >
            <Icon size={14} color={active ? "#0d52c4" : "rgba(255,255,255,0.92)"} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
