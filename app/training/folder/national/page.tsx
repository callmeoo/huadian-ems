"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, FileText, Search } from "lucide-react";

const FILES = [
  { name: "中华人民共和国环境保护法（2014修订）", date: "2014-04", size: "1.2 MB" },
  { name: "固定污染源排污许可分类管理名录（2023）", date: "2023-06", size: "2.8 MB" },
  { name: "火电厂大气污染物排放标准 GB13271-2014", date: "2014-07", size: "980 KB" },
  { name: "中华人民共和国大气污染防治法（2018修订）", date: "2018-10", size: "1.5 MB" },
  { name: "中华人民共和国水污染防治法（2017修订）", date: "2017-06", size: "1.3 MB" },
  { name: "排污许可证申请与核发技术规范 总则", date: "2019-03", size: "3.1 MB" },
  { name: "地表水环境质量标准 GB3838-2002", date: "2002-06", size: "640 KB" },
  { name: "环境影响评价技术导则 大气环境（2018版）", date: "2018-12", size: "4.2 MB" },
  { name: "污染源自动监控管理办法", date: "2022-05", size: "760 KB" },
  { name: "企业事业单位突发环境事件应急预案备案管理办法", date: "2021-04", size: "890 KB" },
  { name: "中华人民共和国土壤污染防治法", date: "2019-01", size: "1.1 MB" },
  { name: "温室气体自愿减排交易管理办法（试行）", date: "2023-10", size: "1.6 MB" },
  { name: "碳排放权交易管理办法（试行）", date: "2021-02", size: "720 KB" },
  { name: "生态环境行政处罚办法", date: "2023-07", size: "1.4 MB" },
  { name: "建设项目环境影响评价分类管理名录（2021版）", date: "2021-01", size: "2.3 MB" },
  { name: "排污单位自行监测技术指南 火力发电及锅炉", date: "2017-06", size: "1.8 MB" },
  { name: "重点排污单位名录管理规定", date: "2022-06", size: "560 KB" },
  { name: "危险废物鉴别标准 通则 GB34330-2017", date: "2017-12", size: "870 KB" },
  { name: "中华人民共和国固体废物污染环境防治法（2020修订）", date: "2020-09", size: "1.9 MB" },
  { name: "噪声污染防治行动计划（2021-2025）", date: "2021-12", size: "1.1 MB" },
  { name: "生态环境监测规划纲要（2020-2035年）", date: "2020-06", size: "2.5 MB" },
  { name: "环境信息依法披露制度改革方案", date: "2021-05", size: "740 KB" },
  { name: "重点行业挥发性有机物综合治理方案", date: "2019-06", size: "1.3 MB" },
  { name: "关于加强企业污染物排放数据管理的通知", date: "2022-11", size: "480 KB" },
  { name: "工业污染源现场检查技术规范", date: "2020-03", size: "1.6 MB" },
  { name: "环境保护税法实施条例", date: "2018-01", size: "890 KB" },
  { name: "建设项目竣工环境保护验收暂行办法", date: "2017-11", size: "720 KB" },
  { name: "污染地块土壤环境管理办法（试行）", date: "2017-07", size: "960 KB" },
  { name: "生活垃圾填埋污染控制标准 GB16889-2008", date: "2008-07", size: "1.2 MB" },
  { name: "企业绿色发展报告编制指南（试行）", date: "2022-09", size: "1.5 MB" },
  { name: "环境应急管理办法", date: "2023-03", size: "840 KB" },
  { name: "清洁生产审核办法（2016修订）", date: "2016-07", size: "670 KB" },
];

export default function NationalFolderPage() {
  const router = useRouter();

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
          padding: "0 16px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -60,
            width: 200,
            height: 200,
            background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", height: 50, gap: 8 }}>
            <button
              onClick={() => router.back()}
              style={{ border: "none", background: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
            >
              <ChevronLeft size={20} color="rgba(255,255,255,0.9)" />
            </button>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>国家环保法律法规及规范</span>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: "12px 14px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 12px",
            boxShadow: "0 1px 4px rgba(10,69,149,0.06)",
          }}
        >
          <Search size={14} color="#8090a8" />
          <span style={{ fontSize: 13, color: "#8090a8" }}>搜索文件名…</span>
        </div>
      </div>

      {/* File list */}
      <div style={{ margin: "0 14px", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(10,69,149,0.06)", overflow: "hidden" }}>
        {FILES.map((f, i) => (
          <div
            key={f.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              borderBottom: i < FILES.length - 1 ? "1px solid #f0f3f7" : undefined,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "#f0fff4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={16} color="#389e0d" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "#1a1a1a", marginBottom: 2, lineHeight: 1.4 }}>{f.name}</div>
              <div style={{ fontSize: 11, color: "#8090a8" }}>{f.size} · {f.date}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}
