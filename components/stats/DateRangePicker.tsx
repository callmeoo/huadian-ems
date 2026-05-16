"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  start: Date | null;
  end: Date | null;
  onClose: () => void;
  onConfirm: (start: Date, end: Date) => void;
}

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getMonthCells(year: number, month: number): (Date | null)[] {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

export function DateRangePicker({ start, end, onClose, onConfirm }: Props) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const [tempStart, setTempStart] = useState<Date | null>(start);
  const [tempEnd, setTempEnd] = useState<Date | null>(end);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const months = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - 2 + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  function handleDay(date: Date) {
    if (date > today) return;
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(date);
      setTempEnd(null);
    } else if (date >= tempStart) {
      setTempEnd(date);
    } else {
      setTempStart(date);
      setTempEnd(null);
    }
  }

  function handleConfirm() {
    if (tempStart) onConfirm(tempStart, tempEnd ?? tempStart);
    onClose();
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 20, background: "rgba(0,0,0,0.4)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 21, background: "#fff", borderRadius: "16px 16px 0 0", maxHeight: "82vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 10px", flexShrink: 0 }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#1a1a1a" }}>选择日期</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: "#8090a8", cursor: "pointer", padding: 4 }}>✕</button>
        </div>
        {/* Week header */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 8px 4px", borderBottom: "1px solid #f0f3f7", flexShrink: 0 }}>
          {WEEKDAYS.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 12, color: "#8090a8", padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        {/* Scrollable months */}
        <div ref={scrollRef} style={{ overflow: "auto", flex: 1, padding: "0 8px" }}>
          {months.map(({ year, month }) => (
            <div key={`${year}-${month}`}>
              <div style={{ textAlign: "center", fontSize: 14, fontWeight: 600, color: "#1a1a1a", padding: "14px 0 8px" }}>
                {year}年{month + 1}月
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                {getMonthCells(year, month).map((date, idx) => {
                  if (!date) return <div key={idx} />;
                  const isSt = !!(tempStart && isSameDay(date, tempStart));
                  const isEn = !!(tempEnd && isSameDay(date, tempEnd));
                  const inRng = !!(tempStart && tempEnd && date > tempStart && date < tempEnd);
                  const future = date > today;
                  const sel = isSt || isEn;
                  const bothSame = isSt && isEn;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleDay(date)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        padding: "3px 0", cursor: future ? "default" : "pointer",
                        background: inRng ? "#e6f4ff" : "transparent",
                      }}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: sel ? "#1677ff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 15, color: sel ? "#fff" : future ? "#c8d0da" : "#1a1a1a" }}>
                          {date.getDate()}
                        </span>
                      </div>
                      {sel && (
                        <span style={{ fontSize: 9, color: "#1677ff", lineHeight: 1, marginTop: 1 }}>
                          {bothSame ? "开始/结束" : isSt ? "开始" : "结束"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {/* Confirm */}
        <div style={{ padding: "12px 16px 32px", borderTop: "1px solid #f0f3f7", flexShrink: 0 }}>
          <button
            onClick={handleConfirm}
            style={{ width: "100%", height: 48, background: "#1677ff", border: "none", borderRadius: 24, fontSize: 16, fontWeight: 600, color: "#fff", cursor: "pointer" }}
          >
            确定
          </button>
        </div>
      </div>
    </>
  );
}
