"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Menu, Wrench } from "lucide-react";
import TabBar from "@/components/layout/TabBar";

export default function ComingSoonPage({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div style={{
      minHeight: "100vh", background: "#f5f7fa",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif",
    }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.4,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -80, left: -60,
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          position: "relative", zIndex: 1,
          height: 44, display: "flex", alignItems: "center",
          padding: "0 14px", gap: 8,
        }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}
          >
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", flex: 1 }}>{title}</span>
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
            <Menu size={20} />
          </button>
        </div>
        <div style={{ height: 14 }} />
      </div>

      {/* Coming soon */}
      <div style={{ padding: "56px 24px 80px", textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18, background: "#e6f4ff",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px",
        }}>
          <Wrench size={32} color="#1677ff" />
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>
          「{title}」开发中
        </h2>
        <p style={{ fontSize: 12, color: "#8090a8", lineHeight: 1.7, marginTop: 10 }}>
          该模块正在排期开发，敬请期待。<br />
          如有紧急需求，请联系系统管理员。
        </p>
      </div>

      <TabBar />
    </div>
  );
}
