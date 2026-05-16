"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  FileText,
  ShieldCheck,
  Wrench,
  Activity,
  Volume2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Clock,
  History,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import { TypeIconBox, StatusBadge } from "@/components/verification/Badges";
import type {
  ReportDetail,
  ReportStatus,
  VerificationItem,
  InstrumentItem,
  SamplingItem,
  NoiseSamplingItem,
} from "@/components/verification/types";

const TYPE_LABEL: Record<ReportDetail["type"], string> = {
  gas: "废气核验报告",
  water: "废水核验报告",
  noise: "噪声核验报告",
};

function Section({
  title,
  Icon,
  pass,
  failCount,
  children,
  defaultOpen = true,
}: {
  title: string;
  Icon: typeof ShieldCheck;
  pass: boolean | null;
  failCount?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const statusColor = pass === null ? "#8090a8" : pass ? "#389e0d" : "#cf1322";
  const StatusIcon = pass === null ? AlertCircle : pass ? CheckCircle2 : XCircle;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#e6f4ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={16} color="#1677ff" />
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{title}</div>
          <div
            style={{
              fontSize: 11,
              color: statusColor,
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            <StatusIcon size={12} color={statusColor} />
            {pass === null
              ? "待核验"
              : pass
              ? "通过"
              : `不通过${failCount ? ` · ${failCount} 项` : ""}`}
          </div>
        </div>
        {open ? (
          <ChevronUp size={16} color="#8090a8" />
        ) : (
          <ChevronDown size={16} color="#8090a8" />
        )}
      </button>
      {open && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid #f0f3f7" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ResultRow({
  label,
  values,
  pass,
}: {
  label: string;
  values: { k: string; v: string; emphasize?: boolean }[];
  pass: boolean;
}) {
  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #f0f3f7",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{label}</span>
        {pass ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              background: "#f6ffed",
              color: "#389e0d",
              fontSize: 11,
              padding: "2px 7px",
              borderRadius: 8,
              fontWeight: 500,
            }}
          >
            <CheckCircle2 size={11} color="#389e0d" />
            合格
          </span>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              background: "#fff1f0",
              color: "#cf1322",
              fontSize: 11,
              padding: "2px 7px",
              borderRadius: 8,
              fontWeight: 500,
            }}
          >
            <XCircle size={11} color="#cf1322" />
            不合格
          </span>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {values.map(({ k, v, emphasize }) => (
          <div key={k}>
            <div style={{ fontSize: 10, color: "#8090a8", marginBottom: 2 }}>{k}</div>
            <div
              style={{
                fontSize: 12,
                color: emphasize ? (pass ? "#389e0d" : "#cf1322") : "#1a1a1a",
                fontWeight: emphasize ? 600 : 500,
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormItemRow({ item }: { item: VerificationItem }) {
  return (
    <ResultRow
      label={item.label}
      pass={item.pass}
      values={[
        { k: "报告检测方法", v: item.reportValue, emphasize: !item.pass },
        { k: "许可证要求", v: item.requiredValue },
      ]}
    />
  );
}

function InstrumentRow({ item }: { item: InstrumentItem }) {
  return (
    <ResultRow
      label={`${item.name} · ${item.model}`}
      pass={item.pass}
      values={[
        { k: "校准日期", v: item.calibrationDate },
        { k: "证书有效期", v: item.certValidUntil, emphasize: !item.pass },
      ]}
    />
  );
}

function SamplingRow({ item }: { item: SamplingItem }) {
  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid #f0f3f7" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
          {item.indicator}
        </span>
        {item.pass ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              background: "#f6ffed",
              color: "#389e0d",
              fontSize: 11,
              padding: "2px 7px",
              borderRadius: 8,
              fontWeight: 500,
            }}
          >
            <CheckCircle2 size={11} color="#389e0d" />
            合格
          </span>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              background: "#fff1f0",
              color: "#cf1322",
              fontSize: 11,
              padding: "2px 7px",
              borderRadius: 8,
              fontWeight: 500,
            }}
          >
            <XCircle size={11} color="#cf1322" />
            不合格
          </span>
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 8,
          fontSize: 11,
        }}
      >
        <div>
          <div style={{ color: "#8090a8", marginBottom: 2 }}>采样组数 / 最少</div>
          <div
            style={{
              color: item.sampleCount >= item.minRequired ? "#1a1a1a" : "#cf1322",
              fontWeight: 600,
            }}
          >
            {item.sampleCount} / {item.minRequired}
          </div>
        </div>
        <div>
          <div style={{ color: "#8090a8", marginBottom: 2 }}>偏差 / 允许</div>
          <div
            style={{
              color: item.pass ? "#1a1a1a" : "#cf1322",
              fontWeight: 600,
            }}
          >
            {item.deviation} / {item.maxDeviation}
          </div>
        </div>
        <div>
          <div style={{ color: "#8090a8", marginBottom: 2 }}>报告均值</div>
          <div style={{ color: "#1a1a1a", fontWeight: 500 }}>{item.reportMean}</div>
        </div>
        <div>
          <div style={{ color: "#8090a8", marginBottom: 2 }}>CEMS 同期均值</div>
          <div style={{ color: "#1a1a1a", fontWeight: 500 }}>{item.cemsMean}</div>
        </div>
      </div>
    </div>
  );
}

function NoiseRow({ item }: { item: NoiseSamplingItem }) {
  return (
    <ResultRow
      label={`点位：${item.pointName}`}
      pass={item.pass}
      values={[
        { k: "实测值", v: item.value, emphasize: !item.pass },
        { k: "限值", v: item.limit },
        { k: "采样时长", v: item.duration },
        { k: "最少时长", v: item.minDuration },
      ]}
    />
  );
}

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const reportId = Number(params?.id);

  const [baseReport, setBaseReport] = useState<ReportDetail | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (Number.isNaN(reportId)) {
      setLoadError(true);
      return;
    }
    fetch(`/api/verification/reports/${reportId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: ReportDetail) => setBaseReport(data))
      .catch(() => setLoadError(true));
  }, [reportId]);

  if (loadError) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#8090a8" }}>
        报告不存在
        <button
          onClick={() => router.back()}
          style={{
            marginTop: 12,
            background: "#0d52c4",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            display: "block",
            marginInline: "auto",
          }}
        >
          返回
        </button>
      </div>
    );
  }

  if (!baseReport) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "#8090a8",
          fontSize: 13,
        }}
      >
        加载中…
      </div>
    );
  }

  const status = baseReport.status;
  const manualReviewed = baseReport.manualReviewed ?? false;
  const reviewLogs = baseReport.reviewLogs;
  const isFail = status === "fail";

  const formFailCount = baseReport.formItems.filter((i) => !i.pass).length;
  const instrumentFailCount = baseReport.instrumentItems.filter((i) => !i.pass).length;
  const samplingFailCount = baseReport.samplingItems.filter((i) => !i.pass).length;
  const noiseFailCount = (baseReport.noiseItems ?? []).filter((i) => !i.pass).length;

  const handleReview = async (asPass: boolean) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/verification/reports/${reportId}/review`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: asPass ? "pass" : "reject" }),
        },
      );
      if (res.ok) {
        const updated: ReportDetail = await res.json();
        setBaseReport(updated);
        setReviewOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleMockStatus = async (target: ReportStatus) => {
    if (submitting || status === target) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/verification/reports/${reportId}/mock-status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: target }),
        },
      );
      if (res.ok) {
        const updated: ReportDetail = await res.json();
        setBaseReport(updated);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const showSampling = baseReport.type !== "noise";
  const showNoise = baseReport.type === "noise" && (baseReport.noiseItems?.length ?? 0) > 0;

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", paddingBottom: 100 }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
          position: "relative",
          overflow: "hidden",
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

        {/* Topbar */}
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
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>
            {TYPE_LABEL[baseReport.type]}
          </span>
        </div>

        {/* Status block */}
        <div
          style={{
            margin: "0 14px 18px",
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(6px)",
            borderRadius: 14,
            padding: "14px 14px",
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <TypeIconBox type={baseReport.type} size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 4,
              }}
            >
              {baseReport.title}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                marginBottom: 8,
              }}
            >
              {baseReport.reportNo} · {baseReport.date}
            </div>
            <StatusBadge status={status} manualReviewed={manualReviewed} />
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Fail summary — 不合格报告首屏直接看到 */}
        {isFail && (
          <div
            style={{
              background: "#fff1f0",
              border: "1px solid #ffccc7",
              borderLeft: "4px solid #cf1322",
              borderRadius: 12,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#cf1322",
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <XCircle size={16} color="#cf1322" />
              不合格项汇总
              <span
                style={{
                  fontSize: 11,
                  background: "#cf1322",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "1px 8px",
                  fontWeight: 600,
                }}
              >
                {formFailCount + instrumentFailCount + samplingFailCount + noiseFailCount} 项
              </span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#a8071a",
                marginBottom: 10,
              }}
            >
              系统自动核验发现以下问题，请查阅附件凭证后决定复核或驳回
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                fontSize: 12,
                color: "#820014",
                lineHeight: 1.85,
              }}
            >
              {baseReport.formItems
                .filter((i) => !i.pass)
                .map((i, k) => (
                  <li key={`form-${k}`}>
                    形式：<strong>{i.label}</strong> 检测方法与许可证不一致（{i.reportValue} ≠ {i.requiredValue}）
                  </li>
                ))}
              {baseReport.instrumentItems
                .filter((i) => !i.pass)
                .map((i, k) => (
                  <li key={`inst-${k}`}>
                    仪器：<strong>{i.name}</strong>{" "}
                    {i.certValidUntil < baseReport.date ? "证书已过期" : "校准记录不符要求"}（有效期至 {i.certValidUntil}）
                  </li>
                ))}
              {baseReport.samplingItems
                .filter((i) => !i.pass)
                .map((i, k) => (
                  <li key={`samp-${k}`}>
                    采样：<strong>{i.indicator}</strong>{" "}
                    {i.sampleCount < i.minRequired
                      ? `采样组数不足（${i.sampleCount} < ${i.minRequired}）`
                      : `与 CEMS 偏差超限（${i.deviation} > ${i.maxDeviation}）`}
                  </li>
                ))}
              {(baseReport.noiseItems ?? [])
                .filter((i) => !i.pass)
                .map((i, k) => (
                  <li key={`noise-${k}`}>
                    噪声：<strong>{i.pointName}</strong> 实测 {i.value} 超出限值 {i.limit}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Attachments — 一并置顶，方便查看凭证 */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 3,
                height: 14,
                background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
              报告附件
            </span>
            <span style={{ fontSize: 11, color: "#8090a8" }}>
              共 {baseReport.attachments.length} 份
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {baseReport.attachments.map((att) => (
              <div
                key={att.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  background: "#f5f7fa",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#e6f4ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={14} color="#1677ff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#1a1a1a",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {att.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#8090a8", marginTop: 2 }}>
                    {att.size} · {att.type.toUpperCase()}
                  </div>
                </div>
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
                  <Download size={12} color="#1677ff" />
                  下载
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Basic info */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 3,
                height: 14,
                background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
              报告基本信息
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { k: "出具机构", v: baseReport.agency },
              { k: "机组", v: baseReport.unit },
              { k: "排放口", v: baseReport.outlet },
              { k: "采样周期", v: baseReport.samplingPeriod },
              { k: "报告日期", v: baseReport.date },
              { k: "下次监测", v: baseReport.nextDate },
            ].map(({ k, v }) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: "#8090a8", marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form verification */}
        <Section
          title="形式核验"
          Icon={ShieldCheck}
          pass={formFailCount === 0}
          failCount={formFailCount}
        >
          {baseReport.formItems.map((item, i) => (
            <FormItemRow key={i} item={item} />
          ))}
        </Section>

        {/* Instrument verification */}
        <Section
          title="仪器核验"
          Icon={Wrench}
          pass={instrumentFailCount === 0}
          failCount={instrumentFailCount}
        >
          {baseReport.instrumentItems.map((item, i) => (
            <InstrumentRow key={i} item={item} />
          ))}
        </Section>

        {/* Sampling data comparison */}
        {showSampling && (
          <Section
            title="采样数据比对"
            Icon={Activity}
            pass={samplingFailCount === 0}
            failCount={samplingFailCount}
          >
            {baseReport.samplingItems.length === 0 ? (
              <div
                style={{
                  padding: "16px 0",
                  textAlign: "center",
                  color: "#8090a8",
                  fontSize: 12,
                }}
              >
                暂无采样数据
              </div>
            ) : (
              baseReport.samplingItems.map((item, i) => <SamplingRow key={i} item={item} />)
            )}
          </Section>
        )}

        {/* Noise sampling */}
        {showNoise && (
          <Section
            title="点位与采样时长"
            Icon={Volume2}
            pass={noiseFailCount === 0}
            failCount={noiseFailCount}
          >
            {baseReport.noiseItems?.map((item, i) => <NoiseRow key={i} item={item} />)}
          </Section>
        )}

        {/* Review log */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 3,
                height: 14,
                background: "linear-gradient(180deg, #1677ff 0%, #0d52c4 100%)",
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
              核验记录
            </span>
            <History size={12} color="#8090a8" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {reviewLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  borderLeft: "2px solid #d6e4ff",
                  paddingLeft: 12,
                  paddingBottom: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1a1a1a",
                    marginBottom: 2,
                  }}
                >
                  {log.action}
                </div>
                {log.reason && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#6b7a8c",
                      lineHeight: 1.55,
                      marginBottom: 4,
                    }}
                  >
                    {log.reason}
                  </div>
                )}
                <div
                  style={{
                    fontSize: 10,
                    color: "#8090a8",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Clock size={10} color="#8090a8" />
                  {log.actor} · {log.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom controls */}
      <div
        style={{
          position: "fixed",
          bottom: 60,
          left: 0,
          right: 0,
          background: "#fff",
          borderTop: "1px solid #ebeef2",
          zIndex: 90,
        }}
      >
        {/* 演示工具：在三种状态间任意切换（仅用于演示/调试，可反复试） */}
        <div
          style={{
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: (isFail || status === "pending") ? "1px solid #f0f3f7" : "none",
          }}
        >
          <span style={{ fontSize: 11, color: "#8090a8", flexShrink: 0 }}>演示工具</span>
          {(["pass", "fail", "pending"] as ReportStatus[]).map((s) => {
            const active = status === s;
            const label = s === "pass" ? "合格" : s === "fail" ? "不合格" : "待核验";
            const fg = s === "pass" ? "#389e0d" : s === "fail" ? "#cf1322" : "#d46b08";
            const bg = s === "pass" ? "#f0fff4" : s === "fail" ? "#fff1f0" : "#fff7e0";
            return (
              <button
                key={s}
                onClick={() => handleMockStatus(s)}
                disabled={active || submitting}
                style={{
                  flex: 1,
                  padding: "5px 0",
                  borderRadius: 8,
                  border: active ? `1px solid ${fg}` : "1px solid #ebeef2",
                  background: active ? bg : "#fff",
                  color: active ? fg : "#6b7a8c",
                  fontSize: 12,
                  fontWeight: active ? 600 : 500,
                  cursor: active || submitting ? "default" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                  outline: "none",
                  transition: "background 0.15s, border 0.15s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 人工复核操作：仅在不合格/待核验时显示 */}
        {(isFail || status === "pending") && (
          <div style={{ padding: "10px 14px", display: "flex", gap: 10 }}>
            <button
              onClick={() => handleReview(true)}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 0",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <ShieldCheck size={14} color="#fff" />
              人工复核为合格
            </button>
            <button
              onClick={() => setReviewOpen(true)}
              style={{
                flex: 1,
                background: "#fff",
                color: "#cf1322",
                border: "1px solid #ffa39e",
                borderRadius: 10,
                padding: "10px 0",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <XCircle size={14} color="#cf1322" />
              驳回报告
            </button>
          </div>
        )}
      </div>

      {/* Reject confirm modal */}
      {reviewOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setReviewOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 18,
              width: "100%",
              maxWidth: 320,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
              驳回报告？
            </div>
            <div style={{ fontSize: 12, color: "#6b7a8c", marginBottom: 14, lineHeight: 1.6 }}>
              将通知第三方机构 <strong>{baseReport.agency}</strong>{" "}
              重新出具该机组的检测报告，操作不可撤销。
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setReviewOpen(false)}
                style={{
                  flex: 1,
                  background: "#f5f7fa",
                  color: "#6b7a8c",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 0",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                取消
              </button>
              <button
                onClick={() => handleReview(false)}
                style={{
                  flex: 1,
                  background: "#cf1322",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                确认驳回
              </button>
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
}
