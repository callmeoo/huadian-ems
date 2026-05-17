"use client";

import {
  Radio,
  Users,
  User,
  Phone,
  Lock,
  Mail,
  ArrowUpCircle,
  FileText,
  Award,
  ChevronRight,
} from "lucide-react";
import TabBar from "@/components/layout/TabBar";

interface MenuItem {
  Icon: React.ComponentType<{ size: number; color?: string }>;
  iconBg: string;
  iconColor: string;
  label: string;
  value?: string;
  valueColor?: string;
  showChevron?: boolean;
}

function MenuGroup({ items }: { items: MenuItem[] }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 2px 8px rgba(10,69,149,0.06)",
        border: "1px solid #ebeef2",
        overflow: "hidden",
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 16px",
            gap: 12,
            borderBottom: i < items.length - 1 ? "1px solid #f0f3f7" : undefined,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: item.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <item.Icon size={18} color={item.iconColor} />
          </div>
          <span style={{ flex: 1, fontSize: 15, color: "#1a1a1a" }}>{item.label}</span>
          {item.value && (
            <span
              style={{
                fontSize: 14,
                color: item.valueColor ?? "#8090a8",
                fontWeight: item.valueColor ? 600 : 400,
              }}
            >
              {item.value}
            </span>
          )}
          {item.showChevron && <ChevronRight size={16} color="#bfcbd9" />}
        </div>
      ))}
    </div>
  );
}

const GROUP1: MenuItem[] = [
  {
    Icon: Radio,
    iconBg: "#e6f4ff",
    iconColor: "#0d52c4",
    label: "服务监控点",
    value: "2 个",
    valueColor: "#0d52c4",
    showChevron: true,
  },
  {
    Icon: Users,
    iconBg: "#e6fffb",
    iconColor: "#13c2c2",
    label: "子账户管理",
    value: "0 个",
    showChevron: true,
  },
];

const GROUP2: MenuItem[] = [
  {
    Icon: User,
    iconBg: "#e6f4ff",
    iconColor: "#0d52c4",
    label: "用户姓名",
    value: "何建奇",
  },
  {
    Icon: Phone,
    iconBg: "#f6ffed",
    iconColor: "#52c41a",
    label: "手机号码",
    value: "18925138011",
  },
  {
    Icon: Lock,
    iconBg: "#f5f0ff",
    iconColor: "#722ed1",
    label: "密码",
    showChevron: true,
  },
  {
    Icon: Mail,
    iconBg: "#fff7e6",
    iconColor: "#fa8c16",
    label: "邮箱",
    value: "未绑定",
    showChevron: true,
  },
];

const GROUP3: MenuItem[] = [
  {
    Icon: ArrowUpCircle,
    iconBg: "#f5f5f5",
    iconColor: "#8090a8",
    label: "检查版本",
    value: "v2.0.5",
    showChevron: true,
  },
  {
    Icon: FileText,
    iconBg: "#f5f5f5",
    iconColor: "#8090a8",
    label: "隐私协议",
    showChevron: true,
  },
  {
    Icon: Award,
    iconBg: "#f5f5f5",
    iconColor: "#8090a8",
    label: "企业认证资料",
    showChevron: true,
  },
];

export default function ProfilePage() {
  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)",
          paddingBottom: 28,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            opacity: 0.4,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -60,
            width: 280,
            height: 280,
            background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* User section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px 0 0",
            position: "relative",
            zIndex: 5,
          }}
        >
          {/* Safe area top spacer */}
          <div style={{ height: 20 }} />

          {/* Name */}
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            何建奇
          </div>

          {/* Phone */}
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: 1,
            }}
          >
            189****8011
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          paddingBottom: 80,
        }}
      >
        {/* Menu groups */}
        <div style={{ margin: "14px 14px 0" }}>
          <MenuGroup items={GROUP1} />
        </div>
        <div style={{ margin: "14px 14px 0" }}>
          <MenuGroup items={GROUP2} />
        </div>
        <div style={{ margin: "14px 14px 0" }}>
          <MenuGroup items={GROUP3} />
        </div>

        {/* Logout area */}
        <div
          style={{
            margin: "14px 14px 0",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <button
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 14,
              textAlign: "center",
              fontSize: 15,
              fontWeight: 500,
              color: "#0d52c4",
              border: "1px solid #ebeef2",
              cursor: "pointer",
              width: "100%",
            }}
          >
            退出登录
          </button>
          <button
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 14,
              textAlign: "center",
              fontSize: 15,
              fontWeight: 500,
              color: "#f5222d",
              border: "1px solid #ffccc7",
              cursor: "pointer",
              width: "100%",
            }}
          >
            注销账号
          </button>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
