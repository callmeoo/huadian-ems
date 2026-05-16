"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Bell, ChevronLeft, Search, Calendar, X } from "lucide-react";
import TabBar from "@/components/layout/TabBar";
import DateRangePicker from "@/components/ui/DateRangePicker";

type Notification = {
  id: number;
  urgent: boolean;
  title: string;
  body: string;
  time: string;
  category: string;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 1, urgent: true, category: "超标预警",
    title: "【紧急】NOx超标预警 — 4号排放口",
    body: "今日10:15至11:40，4号排放口NOx小时均值连续3次超过许可浓度限值（限值：100 mg/m³，实测：117 mg/m³）。请运行部门立即排查燃烧调整，并在系统内标记工况说明。",
    time: "2026-05-16 11:45",
  },
  {
    id: 2, urgent: true, category: "系统维护",
    title: "【重要】脱硫系统月度检修安排",
    body: "1号机组脱硫系统将于本月20日08:00—16:00进行例行检修，届时相关监控数据可能出现中断，请各岗位知悉并做好手工记录备档。",
    time: "2026-05-16 09:30",
  },
  {
    id: 3, urgent: false, category: "合规提醒",
    title: "排污许可证年度执行报告提交提醒",
    body: "2025年度排污许可证执行报告提交截止日期为2026年3月31日，请环保管理员及时核实各项数据并完成网上提交，避免逾期处罚。",
    time: "2026-05-15 14:00",
  },
  {
    id: 4, urgent: false, category: "培训通知",
    title: "环保培训通知 — 新版《排污单位自行监测技术指南》解读",
    body: "环保部将于本周五（5月17日）15:00—17:00在行政楼三楼会议室开展新版技术指南培训，请相关岗位人员准时参加，培训后需在线完成知识测验。",
    time: "2026-05-14 16:20",
  },
  {
    id: 5, urgent: false, category: "系统通知",
    title: "外环数据平台账号密码更新通知",
    body: "外环数据平台账号密码将于2026年5月20日统一更换，届时请管理员在系统设置中更新对应凭据，以保证自动爬取任务正常运行。",
    time: "2026-05-13 10:00",
  },
  {
    id: 6, urgent: true, category: "超标预警",
    title: "【紧急】SO₂日均值超标 — 2号烟囱",
    body: "2026年5月12日，2号烟囱SO₂日均浓度达到198 mg/m³，超过许可日均限值（200 mg/m³）的93%。请生产部门说明工况原因，并于24小时内提交整改措施。",
    time: "2026-05-12 17:30",
  },
  {
    id: 7, urgent: false, category: "合规提醒",
    title: "季度自行监测数据质量核查",
    body: "第一季度自行监测数据核查工作已启动，请各监测点位负责人于2026年5月31日前完成数据复核并签字确认，逾期将影响年度报告评级。",
    time: "2026-05-10 09:15",
  },
  {
    id: 8, urgent: false, category: "培训通知",
    title: "安全生产与环保联合培训 — 报名通知",
    body: "公司定于2026年5月25日组织安全生产与环保联合培训，培训内容包括危废处置规范、突发环境事件应急预案演练，请各部门负责人安排相关人员参加。",
    time: "2026-05-09 14:45",
  },
];

const STORAGE_KEY = "elec_read_notifs";

function getReadIds(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

const CATEGORY_COLOR: Record<string, { bg: string; text: string }> = {
  "超标预警": { bg: "#fff1f0", text: "#cf1322" },
  "系统维护": { bg: "#fff7e0", text: "#d46b08" },
  "合规提醒": { bg: "#f5f0ff", text: "#531dab" },
  "培训通知": { bg: "#e6f4ff", text: "#1677ff" },
  "系统通知": { bg: "#f5f7fa", text: "#595959" },
};

export default function NotificationsPage() {
  const [tab, setTab] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd,   setDateEnd]   = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  function markRead(id: number) {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }

  function markAllRead() {
    const all = new Set(NOTIFICATIONS.map((n) => n.id));
    setReadIds(all);
    saveReadIds(all);
  }

  function handleItemClick(id: number) {
    markRead(id);
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const unreadCount = useMemo(
    () => NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length,
    [readIds]
  );

  const readCount = useMemo(
    () => NOTIFICATIONS.filter((n) => readIds.has(n.id)).length,
    [readIds]
  );

  const filtered = useMemo(() => {
    let list = [...NOTIFICATIONS];

    if (tab === "unread") list = list.filter((n) => !readIds.has(n.id));
    if (tab === "read")   list = list.filter((n) =>  readIds.has(n.id));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
      );
    }

    if (dateStart) {
      const end = dateEnd || dateStart;
      list = list.filter((n) => {
        const d = n.time.slice(0, 10);
        return d >= dateStart && d <= end;
      });
    }

    list.sort((a, b) => b.time.localeCompare(a.time));
    return list;
  }, [tab, search, dateStart, dateEnd, readIds]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* ── 页头（单行紧凑） ── */}
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
            position: "relative",
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            gap: 12,
            minHeight: 54,
          }}
        >
          <Link
            href="/"
            style={{
              width: 32,
              height: 32,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={18} color="#fff" />
          </Link>
          <span
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: 0.5,
            }}
          >
            工作通知
          </span>
          {unreadCount > 0 && (
            <div
              style={{
                minWidth: 22,
                height: 22,
                padding: "0 7px",
                borderRadius: 11,
                background: "#f5222d",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {unreadCount}
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky tab + action bar ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#fff",
          borderBottom: "1px solid #ebeef2",
          boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
            height: 46,
          }}
        >
          {/* tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {(["all", "unread", "read"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 16,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  background: tab === t ? "#1677ff" : "transparent",
                  color: tab === t ? "#fff" : "#6b7a8c",
                  transition: "all 0.15s",
                  outline: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {t === "all"    ? `全部(${NOTIFICATIONS.length})`
               : t === "unread" ? `待读(${unreadCount})`
               :                  `已读(${readCount})`}
              </button>
            ))}
          </div>

          {/* mark all read */}
          <button
            onClick={markAllRead}
            style={{
              fontSize: 12,
              color: unreadCount > 0 ? "#1677ff" : "#8090a8",
              padding: "5px 10px",
              borderRadius: 14,
              background: unreadCount > 0 ? "rgba(22,119,255,0.08)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${unreadCount > 0 ? "rgba(22,119,255,0.2)" : "#ebeef2"}`,
              cursor: unreadCount > 0 ? "pointer" : "default",
              outline: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            全部已读
          </button>
        </div>
      </div>

      {/* ── Search + date filter ── */}
      <div style={{ padding: "10px 14px 4px", display: "flex", gap: 8 }}>
        {/* search */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            borderRadius: 10,
            padding: "0 12px",
            border: `1px solid ${search ? "#1677ff" : "#ebeef2"}`,
            height: 38,
          }}
        >
          <Search size={14} color={search ? "#1677ff" : "#8090a8"} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索通知内容..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "#1a1a1a",
              background: "transparent",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
              }}
            >
              <X size={14} color="#8090a8" />
            </button>
          )}
        </div>

        {/* date picker trigger */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "#fff",
            borderRadius: 10,
            padding: "0 10px",
            border: `1px solid ${dateStart ? "#1677ff" : "#ebeef2"}`,
            height: 38,
            cursor: "pointer",
            flexShrink: 0,
          }}
          onClick={() => setPickerOpen(true)}
        >
          <Calendar size={14} color={dateStart ? "#1677ff" : "#8090a8"} />
          <span style={{ fontSize: 12, color: dateStart ? "#1677ff" : "#8090a8", whiteSpace: "nowrap" }}>
            {dateStart
              ? dateEnd && dateEnd !== dateStart
                ? `${dateStart} 至 ${dateEnd}`
                : dateStart
              : "筛选日期"}
          </span>
          {dateStart && (
            <button
              onClick={(e) => { e.stopPropagation(); setDateStart(""); setDateEnd(""); }}
              style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex" }}
            >
              <X size={12} color="#1677ff" />
            </button>
          )}
        </div>
      </div>

      {/* ── Notification list ── */}
      <div style={{ padding: "4px 14px 80px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#8090a8" }}>
            <Bell
              size={36}
              color="#d0dae8"
              style={{ margin: "0 auto 12px", display: "block" }}
            />
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
              {tab === "unread" ? "全部已读" : tab === "read" ? "暂无已读通知" : "暂无通知"}
            </div>
            {tab === "unread" && (
              <div style={{ fontSize: 12, color: "#b0bbc8" }}>没有未读消息</div>
            )}
            {tab === "read" && (
              <div style={{ fontSize: 12, color: "#b0bbc8" }}>还没有读过的通知</div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((n, index) => {
              const isRead = readIds.has(n.id);
              const isExpanded = expandedId === n.id;
              const catStyle = CATEGORY_COLOR[n.category] ?? {
                bg: "#f5f7fa",
                text: "#595959",
              };

              return (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n.id)}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
                    padding: "13px 14px",
                    cursor: "pointer",
                    borderLeft: isRead
                      ? "4px solid #ebeef2"
                      : n.urgent
                      ? "4px solid #f5222d"
                      : "4px solid #1677ff",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    {/* 序号 */}
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        flexShrink: 0,
                        background: isRead
                          ? "#f0f3f7"
                          : n.urgent
                          ? "#fff0f0"
                          : "#e6f4ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 600,
                        color: isRead ? "#8090a8" : n.urgent ? "#cf1322" : "#1677ff",
                        marginTop: 1,
                      }}
                    >
                      {index + 1}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* title */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 5,
                          flexWrap: "wrap",
                        }}
                      >
                        {n.urgent && (
                          <span
                            style={{
                              fontSize: 10,
                              background: "#f5222d",
                              color: "#fff",
                              borderRadius: 4,
                              padding: "1px 5px",
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            紧急
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: isRead ? 400 : 600,
                            color: n.urgent ? "#cf1322" : "#1a1a1a",
                            lineHeight: 1.4,
                          }}
                        >
                          {n.title}
                        </span>
                      </div>

                      {/* body */}
                      <p
                        style={{
                          fontSize: 12,
                          color: "#6b7a8c",
                          lineHeight: 1.65,
                          margin: "0 0 8px",
                          ...(isExpanded
                            ? {}
                            : ({
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              } as React.CSSProperties)),
                        }}
                      >
                        {n.body}
                      </p>

                      {/* footer */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 7 }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              background: catStyle.bg,
                              color: catStyle.text,
                              borderRadius: 4,
                              padding: "2px 6px",
                              fontWeight: 500,
                            }}
                          >
                            {n.category}
                          </span>
                          <span style={{ fontSize: 11, color: "#8090a8" }}>
                            {n.time}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            color: "#1677ff",
                            flexShrink: 0,
                          }}
                        >
                          {isExpanded ? "收起 ↑" : "展开 ↓"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <DateRangePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={(s, e) => { setDateStart(s); setDateEnd(e); setPickerOpen(false); }}
        defaultStart={dateStart}
        defaultEnd={dateEnd}
      />

      <TabBar />
    </div>
  );
}
