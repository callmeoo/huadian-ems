"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (start: string, end: string) => void;
  defaultStart?: string;
  defaultEnd?: string;
  maxDate?: string;
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function pad(n: number) { return String(n).padStart(2, "0"); }
function fmt(y: number, m: number, d: number) { return `${y}-${pad(m)}-${pad(d)}`; }

export default function DateRangePicker({ open, onClose, onConfirm, defaultStart, defaultEnd, maxDate = "2026-05-16" }: Props) {
  const [year,  setYear]  = useState(() => defaultStart ? +defaultStart.slice(0, 4) : 2026);
  const [month, setMonth] = useState(() => defaultStart ? +defaultStart.slice(5, 7) : 5);
  const [start, setStart] = useState(defaultStart ?? "");
  const [end,   setEnd]   = useState(defaultEnd   ?? "");

  if (!open) return null;

  function prevMonth() {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
  }

  function handleDay(dateStr: string) {
    if (dateStr > maxDate) return;
    if (!start || (start && end)) {
      setStart(dateStr);
      setEnd("");
    } else {
      if (dateStr >= start) {
        setEnd(dateStr);
      } else {
        setStart(dateStr);
        setEnd("");
      }
    }
  }

  function handleConfirm() {
    if (!start) return;
    onConfirm(start, end || start);
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow    = new Date(year, month - 1, 1).getDay();
  const cells: (number | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const canConfirm = !!start;
  const hasRange   = start && end && start !== end;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200 }} onClick={onClose} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "16px 16px 0 0", zIndex: 201, display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px", borderBottom: "1px solid #ebeef2" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>日期选择</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8090a8", padding: 4, display: "flex" }}>
            <X size={20} />
          </button>
        </div>

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 18px 8px", gap: 24 }}>
          <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7a8c", padding: 4, display: "flex" }}>
            <ChevronLeft size={22} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", minWidth: 96, textAlign: "center" }}>
            {year}年{month}月
          </span>
          <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7a8c", padding: 4, display: "flex" }}>
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Weekday row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 8px 6px" }}>
          {WEEKDAYS.map((w) => (
            <div key={w} style={{ textAlign: "center", fontSize: 12, color: "#8090a8", fontWeight: 500, padding: "2px 0" }}>{w}</div>
          ))}
        </div>

        {/* Day grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 8px 4px", rowGap: 4 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} />;

            const dateStr  = fmt(year, month, day);
            const isStart  = dateStr === start;
            const isEnd    = dateStr === end;
            const inRange  = hasRange && dateStr > start && dateStr < end;
            const isFuture = dateStr > maxDate;
            const col      = i % 7;
            const isWeekend = col === 0 || col === 6;

            // range band background — spans the full cell width, centered vertically
            const rangeBg = inRange || isStart || isEnd;

            return (
              <div key={dateStr} style={{ position: "relative", height: 48 }}>
                {/* Range highlight band */}
                {rangeBg && (
                  <div style={{
                    position: "absolute",
                    top: "50%", transform: "translateY(-50%)",
                    height: 40,
                    left:  isStart ? "50%" : 0,
                    right: isEnd   ? "50%" : 0,
                    background: "#e6f4ff",
                    zIndex: 0,
                  }} />
                )}
                {/* Circle */}
                <div
                  onClick={() => !isFuture && handleDay(dateStr)}
                  style={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    zIndex: 1,
                    cursor: isFuture ? "default" : "pointer",
                  }}
                >
                  <div style={{
                    width: 40, height: 40,
                    borderRadius: "50%",
                    background: (isStart || isEnd) ? "#1677ff" : "transparent",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: 1,
                  }}>
                    <span style={{
                      fontSize: 16,
                      fontWeight: (isStart || isEnd) ? 700 : 400,
                      color: (isStart || isEnd) ? "#fff"
                           : isFuture ? "#c9d4e3"
                           : isWeekend ? "#1677ff"
                           : "#1a1a1a",
                      lineHeight: 1,
                    }}>
                      {day}
                    </span>
                    {isStart && hasRange && <span style={{ fontSize: 9, color: "#fff", lineHeight: 1 }}>开始</span>}
                    {isEnd   && hasRange && <span style={{ fontSize: 9, color: "#fff", lineHeight: 1 }}>结束</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirm */}
        <div style={{ padding: "12px 18px 32px" }}>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            style={{
              width: "100%", padding: "14px 0",
              background: canConfirm ? "#1677ff" : "#c9d4e3",
              color: "#fff", fontSize: 16, fontWeight: 700,
              borderRadius: 50, border: "none",
              cursor: canConfirm ? "pointer" : "default",
            }}
          >
            确定
          </button>
        </div>
      </div>
    </>
  );
}
