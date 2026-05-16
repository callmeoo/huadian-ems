# 华电环保管理平台 · Elec

面向华电内部团队的环保管理 Web 平台，整合外环数据平台、重点排污单位信息化平台、SBS 系统三路数据源，覆盖实时监控、台账、报告、培训等模块。

> 本项目协作规范见 [CLAUDE.md](./CLAUDE.md)。

## 技术栈

| 层 | 选型 |
|---|---|
| 前端 | Next.js 15（App Router） + React 19 + TypeScript（strict） |
| UI | shadcn/ui + Tailwind CSS + Lucide Icons |
| 后端 | Next.js API Routes |
| 数据库 | PostgreSQL + Prisma |
| 爬虫 | Playwright |
| 定时任务 | node-cron（API Route 内） |
| 鉴权 | NextAuth.js |
| 包管理 | pnpm |

## 本地运行

### 前置要求

- Node.js **≥ 18.18**（推荐 20.x，Next 15 不支持 Node 16）
- pnpm 10+
- PostgreSQL（如不需要数据库相关功能，可跳过 Prisma 初始化）

### 启动

```bash
pnpm install
pnpm dev          # 默认 http://localhost:3000
```

### 其他命令

```bash
pnpm build        # 生产构建
pnpm start        # 生产模式启动（先 build）
pnpm lint         # ESLint
pnpm typecheck    # TypeScript 类型检查
```

改完代码必跑：`pnpm typecheck && pnpm lint`。

## 目录概览

```
Elec/
├── CLAUDE.md            # 项目协作规范（含 UI 设计系统）
├── app/                 # Next.js App Router
│   ├── page.tsx         # 工作台首页（含 ALL_MODULES / EXTRA_MODULES 模块注册）
│   ├── api/             # 后端 API Routes
│   └── <feature>/       # 各业务功能页（enterprise/monitor/report/...）
├── components/
│   ├── ui/              # shadcn 生成的基础组件
│   └── layout/          # 通用布局（TabBar 等）
├── lib/                 # 纯函数工具、Prisma client
├── prisma/              # 数据库 schema + migrations
├── public/              # 静态资源
└── 项目要点/
    └── prototype/       # 静态原型（参考用，不进生产构建）
```

**新增 `app/<feature>/page.tsx`** 时必须同步在 `app/page.tsx` 的 `ALL_MODULES` 或 `EXTRA_MODULES` 中注册模块（id、name、icon、color、href）。

## 设计系统

科技蓝风格 · 工业数据平台严肃感 + 现代 SaaS 简洁感。所有「美化」手段只有：渐变、点阵纹理、光晕。

- 图标统一用 [Lucide Icons](https://lucide.dev)（React 组件 `lucide-react`）
- 二级页 Hero 顶部导航只允许：返回 + 页面标题 +（可选）右侧菜单。**严禁出现公司名/企业名**
- 完整色彩 token、卡片样式、Hero 模式见 [CLAUDE.md 的 UI 设计系统章节](./CLAUDE.md#ui-设计系统)

## 部署

目标：华电内网服务器（暂定 Node.js 直跑或 Docker，最终方案待确认）。

```bash
pnpm build && pnpm start
pnpm exec playwright install chromium   # 爬虫所需浏览器
```

部署**不依赖** `git push`，走项目自己的构建命令。
