"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import ModeSwitcher, { type VerificationMode } from "@/components/verification/ModeSwitcher";
import StatsRow, { type StatCard } from "@/components/verification/StatsRow";
import ThirdPartyList, {
  type ThirdPartyFilter,
  type ThirdPartyStat,
} from "@/components/verification/ThirdPartyList";
import RoutineList, {
  type RoutineFilter,
  type RoutineStat,
} from "@/components/verification/RoutineList";
import type { PeriodValue } from "@/components/verification/PeriodPicker";
import type {
  ReportCard,
  RoutineTask,
} from "@/components/verification/types";

export default function VerificationPage() {
  const [mode, setMode] = useState<VerificationMode>("third-party");
  const [reports, setReports] = useState<ReportCard[] | null>(null);
  const [routines, setRoutines] = useState<RoutineTask[] | null>(null);

  // Third-party filter state
  const [tpType, setTpType] = useState<ThirdPartyFilter>("all");
  const [tpStat, setTpStat] = useState<ThirdPartyStat>("all");
  const [tpPeriod, setTpPeriod] = useState<PeriodValue>({
    type: "quarter",
    year: 2026,
    month: 1,
    quarter: "Q1",
    rangeStart: "2026-01-01",
    rangeEnd: "2026-03-31",
  });

  // Routine filter state
  const [rtPeriod, setRtPeriod] = useState<RoutineFilter>("all");
  const [rtStat, setRtStat] = useState<RoutineStat>("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/verification/reports").then((r) => r.json()),
      fetch("/api/verification/routine").then((r) => r.json()),
    ]).then(([r, t]: [ReportCard[], RoutineTask[]]) => {
      setReports(r);
      setRoutines(t);
    });
  }, []);

  const thirdPartyStats: StatCard[] = useMemo(() => {
    const list = reports ?? [];
    const all = list.length;
    const pending = list.filter((r) => r.status === "pending").length;
    const fail = list.filter((r) => r.status === "fail").length;
    const urgent = list.filter(
      (r) => r.dueLevel === "very-soon" || r.dueLevel === "soon",
    ).length;
    return [
      { key: "all", label: "本季报告", value: String(all), color: "#fff" },
      { key: "pending", label: "待核验", value: String(pending), color: "#ffd666" },
      { key: "fail", label: "不合格", value: String(fail), color: "#ff7875" },
      { key: "urgent", label: "即将到期", value: String(urgent), color: "#ffd666" },
    ];
  }, [reports]);

  const routineStats: StatCard[] = useMemo(() => {
    const list = routines ?? [];
    const all = list.length;
    const today = list.filter((t) => t.period === "daily").length;
    const dueSoon = list.filter(
      (t) => t.dueLevel === "very-soon" || t.dueLevel === "soon",
    ).length;
    const overdue = list.filter((t) => t.dueLevel === "overdue").length;
    return [
      { key: "all", label: "任务总数", value: String(all), color: "#fff" },
      { key: "today", label: "今日", value: String(today), color: "#ffd666" },
      { key: "due-soon", label: "即将到期", value: String(dueSoon), color: "#ffd666" },
      { key: "overdue", label: "已逾期", value: String(overdue), color: "#ff7875" },
    ];
  }, [routines]);

  const handleStatClick = (key: string) => {
    if (mode === "third-party") {
      const k = key as ThirdPartyStat;
      setTpStat((prev) => (prev === k && k !== "all" ? "all" : k));
    } else {
      const k = key as RoutineStat;
      setRtStat((prev) => (prev === k && k !== "all" ? "all" : k));
    }
  };

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", paddingBottom: 80 }}>
      <div
        style={{
          background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
          padding: "0 14px 18px",
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
            zIndex: 0,
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
            zIndex: 0,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
            zIndex: 5,
            position: "relative",
          }}
        >
          <div style={{ width: 32 }} />
          <span
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            核验
          </span>
          <button
            style={{
              width: 32,
              height: 32,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 8,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <SlidersHorizontal size={18} color="rgba(255,255,255,0.85)" />
          </button>
        </div>

        <div style={{ marginTop: 14, zIndex: 5, position: "relative" }}>
          <ModeSwitcher mode={mode} onModeChange={setMode} />
        </div>

        {mode === "third-party" ? (
          <StatsRow stats={thirdPartyStats} activeKey={tpStat} onClick={handleStatClick} />
        ) : (
          <StatsRow stats={routineStats} activeKey={rtStat} onClick={handleStatClick} />
        )}
      </div>

      {mode === "third-party" ? (
        <ThirdPartyList
          reports={reports}
          typeFilter={tpType}
          onTypeFilterChange={setTpType}
          statFilter={tpStat}
          onStatFilterChange={setTpStat}
          period={tpPeriod}
          onPeriodChange={setTpPeriod}
        />
      ) : (
        <RoutineList
          tasks={routines}
          periodFilter={rtPeriod}
          onPeriodFilterChange={setRtPeriod}
          statFilter={rtStat}
          onStatFilterChange={setRtStat}
        />
      )}

      <TabBar />
    </div>
  );
}
