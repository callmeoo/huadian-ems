"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import type { QuarterType } from "./types";

const QUARTERS: QuarterType[] = ["Q1", "Q2", "Q3", "Q4"];

export default function PeriodPicker({
  year,
  quarter,
  onYearChange,
  onQuarterChange,
}: {
  year: number;
  quarter: QuarterType;
  onYearChange: (y: number) => void;
  onQuarterChange: (q: QuarterType) => void;
}) {
  const [open, setOpen] = useState(false);
  const maxYear = new Date().getFullYear();
  const atMaxYear = year >= maxYear;

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          background: "#fff",
          border: "1px solid #e0e7ef",
          borderRadius: 8,
          padding: "5px 10px",
          fontSize: 12,
          color: "#1a1a1a",
          cursor: "pointer",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        <Calendar size={12} color="#6b7a8c" />
        {year}年 {quarter}
        <ChevronDown
          size={12}
          color="#6b7a8c"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 50 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
              padding: 14,
              zIndex: 100,
              minWidth: 164,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <button
                onClick={() => onYearChange(year - 1)}
                style={{
                  background: "#f5f7fa",
                  border: "none",
                  borderRadius: 6,
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#6b7a8c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ‹
              </button>
              <span style={{ fontWeight: 600, fontSize: 13, color: "#1a1a1a" }}>
                {year}年
              </span>
              <button
                onClick={() => !atMaxYear && onYearChange(year + 1)}
                disabled={atMaxYear}
                style={{
                  background: "#f5f7fa",
                  border: "none",
                  borderRadius: 6,
                  width: 28,
                  height: 28,
                  cursor: atMaxYear ? "not-allowed" : "pointer",
                  fontSize: 16,
                  color: atMaxYear ? "#c9d4e3" : "#6b7a8c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ›
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {QUARTERS.map((q) => {
                const isSelected = quarter === q;
                return (
                  <button
                    key={q}
                    onClick={() => {
                      onQuarterChange(q);
                      setOpen(false);
                    }}
                    style={{
                      background: isSelected ? "#0d52c4" : "#f5f7fa",
                      color: isSelected ? "#fff" : "#1a1a1a",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 0",
                      fontSize: 13,
                      fontWeight: isSelected ? 600 : 400,
                      cursor: "pointer",
                    }}
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
