"use client";

import { use, useState, cloneElement, isValidElement, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, AlertTriangle, Clock, CheckCircle2, FileText, Paperclip,
  MapPin, User, Building2, Calendar, Upload, ClipboardCheck, Activity,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import {
  getById, daysUntilDue, effectiveStatus, isLagWarning,
  STATUS_LABEL, STATUS_COLOR, SEVERITY_LABEL, SEVERITY_COLOR,
  CATEGORY_LABEL, SOURCE_LABEL,
  type RectificationAttachment,
} from "@/lib/rectification/mock";

const ATT_KIND_LABEL: Record<RectificationAttachment["kind"], string> = {
  before: "整改前", during: "整改中", after: "整改后", report: "报告", other: "其他",
};

const ATT_KIND_COLOR: Record<RectificationAttachment["kind"], { bg: string; fg: string }> = {
  before: { bg: "#fff7e0", fg: "#d46b08" },
  during: { bg: "#e6f4ff", fg: "#1677ff" },
  after:  { bg: "#f0fff4", fg: "#389e0d" },
  report: { bg: "#f5f0ff", fg: "#531dab" },
  other:  { bg: "#f5f5f5", fg: "#6b7a8c" },
};

export default function RectificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const item = getById(id);
  const [closing, setClosing] = useState(false);

  if (!item) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: 40, textAlign: "center" }}>
        <div style={{ color: "#8090a8", fontSize: 14 }}>未找到该整改单（{id}）</div>
        <button onClick={() => router.back()} style={{
          marginTop: 16, padding: "8px 18px", borderRadius: 8,
          background: "#1677ff", color: "#fff", border: "none", cursor: "pointer",
        }}>返回</button>
      </div>
    );
  }

  const eff = effectiveStatus(item);
  const sColor = STATUS_COLOR[eff];
  const sevColor = SEVERITY_COLOR[item.severity];
  const days = daysUntilDue(item);
  const lag = isLagWarning(item);

  let countdown: { label: string; color: string };
  if (item.status === "closed") {
    countdown = { label: `已闭环 · ${item.completedAt ?? ""}`, color: "#389e0d" };
  } else if (eff === "overdue") {
    countdown = { label: `已超期 ${Math.abs(days)} 天`, color: "#cf1322" };
  } else if (eff === "review") {
    countdown = { label: `待验收`, color: "#531dab" };
  } else if (days <= 3) {
    countdown = { label: `剩余 ${days} 天`, color: "#d46b08" };
  } else {
    countdown = { label: `剩余 ${days} 天`, color: "#fff" };
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
        position: "relative", overflow: "hidden", paddingBottom: 18,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px", opacity: 0.4, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -80, left: -60,
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, height: 44, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex" }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ flex: 1, fontSize: 17, fontWeight: 700, color: "#fff" }}>整改详情</span>
          <span style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 10,
            background: sColor.bg, color: sColor.fg, fontWeight: 600,
          }}>{STATUS_LABEL[eff]}</span>
        </div>

        {/* 主标题块 */}
        <div style={{ position: "relative", zIndex: 1, padding: "8px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
            <span style={{ fontFamily: "ui-monospace, monospace" }}>{item.id}</span>
            <span>·</span>
            <span style={{
              padding: "1px 6px", borderRadius: 4,
              background: sevColor.bg, color: sevColor.fg, fontWeight: 600,
            }}>{SEVERITY_LABEL[item.severity]}</span>
            <span style={{
              padding: "1px 6px", borderRadius: 4,
              background: "rgba(255,255,255,0.16)", color: "#fff",
            }}>{CATEGORY_LABEL[item.category]}</span>
          </div>
          <div style={{ fontSize: 16, color: "#fff", lineHeight: 1.45, fontWeight: 600 }}>
            {item.title}
          </div>

          {/* 倒计时 */}
          <div style={{
            marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", borderRadius: 10,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {eff === "overdue" ? <AlertTriangle size={16} color="#ff8080" />
                : item.status === "closed" ? <CheckCircle2 size={16} color="#7be09c" />
                : <Clock size={16} color="#fff" />}
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>整改时限</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: countdown.color }}>
                {countdown.label}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>要求 {item.dueAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 滞后预警 banner */}
      {lag && (
        <div style={{ padding: "10px 14px 0" }}>
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            background: "#fff7e0", borderLeft: "4px solid #fa8c16",
            borderRadius: 10, padding: "10px 12px",
          }}>
            <AlertTriangle size={18} color="#d46b08" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#d46b08", fontWeight: 600, marginBottom: 2 }}>
                滞后预警 — 整改措施未制定
              </div>
              <div style={{ fontSize: 11, color: "#8c5a1a", lineHeight: 1.5 }}>
                距问题发现已过 50% 整改期，仍未填写整改措施。请尽快指派责任人并制定方案。
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6 步流程 */}
      <div style={{ padding: "14px 14px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Step 1 问题来源 */}
        <SectionCard step={1} title="问题来源">
          <KV icon={<Activity />} label="来源" value={SOURCE_LABEL[item.source]} />
          {item.sourceDetail && <KV icon={<FileText />} label="编号" value={item.sourceDetail} />}
          <KV icon={<Calendar />} label="发现时间" value={item.discoveredAt} />
        </SectionCard>

        {/* Step 2 问题内容 */}
        <SectionCard step={2} title="问题内容">
          <div style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.65, marginBottom: item.location ? 10 : 0 }}>
            {item.description}
          </div>
          {item.location && <KV icon={<MapPin />} label="涉及点位" value={item.location} />}
        </SectionCard>

        {/* Step 3 整改措施 */}
        <SectionCard step={3} title="整改措施">
          {item.measures ? (
            <div style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.65, marginBottom: 10 }}>
              {item.measures}
            </div>
          ) : (
            <EmptyHint text="尚未制定整改措施" />
          )}
          {item.responsibleDept && <KV icon={<Building2 />} label="责任部门" value={item.responsibleDept} />}
          {item.responsiblePerson && <KV icon={<User />} label="责任人" value={item.responsiblePerson} />}
        </SectionCard>

        {/* Step 4 整改时间 */}
        <SectionCard step={4} title="整改时间">
          <KV icon={<Calendar />} label="要求完成" value={item.dueAt} />
          <KV
            icon={<CheckCircle2 />}
            label="实际完成"
            value={item.completedAt ?? "—"}
            valueColor={item.completedAt ? "#389e0d" : "#8090a8"}
          />
          <KV
            icon={<Clock />}
            label="剩余天数"
            value={
              item.status === "closed" ? "已完成"
              : eff === "overdue" ? `已超期 ${Math.abs(days)} 天`
              : `${days} 天`
            }
            valueColor={
              item.status === "closed" ? "#389e0d"
              : eff === "overdue" ? "#cf1322"
              : days <= 3 ? "#d46b08" : "#1a1a1a"
            }
          />
        </SectionCard>

        {/* Step 5 资料存档 */}
        <SectionCard step={5} title={`资料存档（${item.attachments.length}）`}>
          {item.attachments.length === 0 ? (
            <EmptyHint text="暂无附件" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {item.attachments.map((att) => {
                const c = ATT_KIND_COLOR[att.kind];
                return (
                  <div
                    key={att.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", borderRadius: 10,
                      background: "#f8fafc", border: "1px solid #ebeef2",
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: c.bg, color: c.fg,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Paperclip size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {att.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#8090a8", marginTop: 2, display: "flex", gap: 8 }}>
                        <span style={{ color: c.fg, fontWeight: 500 }}>{ATT_KIND_LABEL[att.kind]}</span>
                        {att.size && <span>{att.size}</span>}
                        {att.uploadedAt && <span>{att.uploadedAt}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {item.status !== "closed" && (
            <button
              onClick={() => alert("上传附件 — 接 DB 后开放")}
              style={{
                marginTop: 10, width: "100%", padding: "10px",
                background: "#fff", border: "1px dashed #1677ff",
                borderRadius: 10, color: "#1677ff", fontSize: 13,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <Upload size={14} />上传附件
            </button>
          )}
        </SectionCard>

        {/* Step 6 验收闭环 */}
        <SectionCard step={6} title="验收闭环">
          {item.status === "closed" ? (
            <>
              <KV icon={<User />} label="验收人" value={item.acceptedBy ?? "—"} valueColor="#389e0d" />
              <KV icon={<Calendar />} label="验收时间" value={item.acceptedAt ?? "—"} />
              {item.acceptanceNote && (
                <div style={{
                  marginTop: 8, padding: "10px 12px", borderRadius: 8,
                  background: "#f0fff4", border: "1px solid #d9f7be", fontSize: 12, color: "#389e0d", lineHeight: 1.6,
                }}>
                  {item.acceptanceNote}
                </div>
              )}
              <div style={{
                marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "8px", background: "#f0fff4", borderRadius: 8, color: "#389e0d", fontSize: 12, fontWeight: 600,
              }}>
                <CheckCircle2 size={14} />已销号
              </div>
            </>
          ) : (
            <>
              <EmptyHint text="问题解决后由验收人确认销号" />
              <button
                onClick={() => {
                  setClosing(true);
                  setTimeout(() => alert("验收销号 — 接 DB 后写入 ReviewLog"), 100);
                }}
                disabled={eff !== "review"}
                style={{
                  marginTop: 10, width: "100%", padding: "12px",
                  background: eff === "review" ? "linear-gradient(160deg, #389e0d 0%, #237804 100%)" : "#e0e6ef",
                  color: eff === "review" ? "#fff" : "#8090a8",
                  border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
                  cursor: eff === "review" ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  opacity: closing ? 0.7 : 1,
                }}
              >
                <ClipboardCheck size={16} />
                {eff === "review" ? "确认验收并销号" : "待整改完成后可验收"}
              </button>
            </>
          )}
        </SectionCard>
      </div>

      <TabBar />
    </div>
  );
}

// ───────────────── 子组件 ─────────────────

function SectionCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "12px 14px 14px",
      boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{
          width: 22, height: 22, borderRadius: 6,
          background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
          color: "#fff", fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{step}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function KV({ icon, label, value, valueColor }: {
  icon: ReactElement<{ size?: number; color?: string }>;
  label: string;
  value: string;
  valueColor?: string;
}) {
  const sized = isValidElement(icon)
    ? cloneElement(icon, { size: 14, color: "#8090a8" })
    : icon;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "6px 0", fontSize: 13,
    }}>
      <span style={{ display: "flex", flexShrink: 0 }}>{sized}</span>
      <span style={{ color: "#8090a8", minWidth: 64 }}>{label}</span>
      <span style={{ flex: 1, color: valueColor ?? "#1a1a1a", fontWeight: 500, wordBreak: "break-all" }}>
        {value}
      </span>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div style={{
      padding: "12px", textAlign: "center",
      background: "#f8fafc", borderRadius: 8, border: "1px dashed #ebeef2",
      color: "#8090a8", fontSize: 12,
    }}>
      {text}
    </div>
  );
}
