"use client";

import { useEffect } from "react";
import { X, AlertTriangle, FileText } from "lucide-react";
import { FAILED_EXAM_RECORDS } from "@/lib/mock/training";

type Props = {
  open: boolean;
  onClose: () => void;
  totalStaff: number;
};

export default function FailedExamModal({ open, onClose, totalStaff }: Props) {
  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const failedCount = FAILED_EXAM_RECORDS.length;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 1100,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 520,
          background: "#fff",
          borderRadius: "16px 16px 0 0",
          maxHeight: "82vh",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* 顶栏 */}
        <div style={{
          padding: "14px 16px 12px",
          borderBottom: "1px solid #f0f3f7",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: "#fff1f0",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AlertTriangle size={16} color="#cf1322" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>考试不合格明细</div>
            <div style={{ fontSize: 11, color: "#8090a8", marginTop: 2 }}>
              共 <span style={{ color: "#cf1322", fontWeight: 600 }}>{failedCount}</span> 人次未达合格线（60 分），覆盖在册 {totalStaff} 人
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: "none", background: "none", cursor: "pointer", padding: 4, display: "flex" }}
            aria-label="关闭"
          >
            <X size={18} color="#6b7a8c" />
          </button>
        </div>

        {/* 列表 */}
        <div style={{ overflowY: "auto", padding: "8px 12px 20px" }}>
          {failedCount === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#8090a8", fontSize: 13 }}>
              暂无不合格记录
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FAILED_EXAM_RECORDS.map((r) => {
                const gap = r.passLine - r.score;
                return (
                  <div key={r.id} style={{
                    border: "1px solid #ffe1de",
                    background: "#fff8f7",
                    borderRadius: 10,
                    padding: "11px 12px",
                  }}>
                    {/* 第一行：员工 + 分数 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                        background: "#fff", border: "1px solid #ffd6d2",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#cf1322", fontSize: 12, fontWeight: 600,
                      }}>{r.staffName.slice(0, 1)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                          {r.staffName}
                          <span style={{ fontSize: 11, color: "#8090a8", fontWeight: 400, marginLeft: 6 }}>· {r.dept}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#8090a8", marginTop: 1 }}>{r.examAt}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div>
                          <span style={{ fontSize: 20, fontWeight: 700, color: "#cf1322", lineHeight: 1 }}>{r.score}</span>
                          <span style={{ fontSize: 11, color: "#8090a8", marginLeft: 2 }}>/ {r.passLine}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#cf1322", marginTop: 2 }}>差 {gap} 分</div>
                      </div>
                    </div>

                    {/* 第二行：科目信息 */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 10px",
                      background: "#fff",
                      border: "1px solid #f0f3f7",
                      borderRadius: 8,
                    }}>
                      <FileText size={13} color="#0d52c4" style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.3 }}>{r.trainingTitle}</div>
                        <div style={{ fontSize: 11, color: "#8090a8", marginTop: 2 }}>科目：{r.subject}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 底部提示 */}
        {failedCount > 0 && (
          <div style={{
            padding: "10px 16px",
            borderTop: "1px solid #f0f3f7",
            background: "#fafbfc",
            fontSize: 11, color: "#8090a8",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <AlertTriangle size={11} color="#fa8c16" />
            建议安排补考，或单独推送相关题库进行加强训练
          </div>
        )}
      </div>
    </div>
  );
}
