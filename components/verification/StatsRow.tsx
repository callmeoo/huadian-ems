"use client";

export interface StatCard {
  key: string;
  label: string;
  value: string;
  color?: string;
}

export default function StatsRow({
  stats,
  activeKey,
  onClick,
}: {
  stats: StatCard[];
  activeKey: string;
  onClick: (key: string) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: 8,
        marginTop: 14,
        zIndex: 5,
        position: "relative",
      }}
    >
      {stats.map(({ key, label, value, color }) => {
        const isActive = activeKey === key && key !== "all";
        return (
          <button
            key={key}
            onClick={() => onClick(key)}
            style={{
              background: isActive
                ? "rgba(255,255,255,0.22)"
                : "rgba(255,255,255,0.10)",
              borderRadius: 10,
              padding: "8px 4px",
              textAlign: "center",
              backdropFilter: "blur(4px)",
              border: isActive
                ? "1.5px solid rgba(255,255,255,0.50)"
                : "1.5px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1,
                color: color ?? "#fff",
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.65)",
                marginTop: 3,
              }}
            >
              {label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
