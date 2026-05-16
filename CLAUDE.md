# Elec 项目规范

> 全局规则见 `~/.claude/CLAUDE.md`。本文件只写本项目特有的约定。冲突时本文件优先。

## 操作授权

**本地所有操作全权授权，无需确认。** 包括但不限于：编辑/删除文件、运行命令、安装依赖、数据库迁移、重构代码。直接执行，不要询问"你确定吗"。

唯一例外：`git push` 及任何推送到远程仓库的操作——必须等我明确说才能执行。

## 项目定位

面向**华电内部团队/同事**的环保管理 Web 平台，整合三路数据源，覆盖实时监控、台账、报告、培训等模块。

- 用户：内部员工（管理员 / 普通员工 / 领导层），非互联网原住民，工具使用门槛要低
- 场景：环保数据实时监控、设备台账管理、合规报告生成、第三方检测记录、培训通知
- 设备：主要 PC 浏览器；移动端待定
- 部署：**华电内网服务器**，可直接访问内网 IP（如 14.18.155.171）

## 数据源（已确认）

| 数据源 | 接入方式 | 说明 |
|---|---|---|
| 外环数据平台 `14.18.155.171:44090` | 定时爬取（Playwright） | 当年数据自动抓，账号密码存配置 |
| 重点排污单位信息化平台 | 定时爬取（Playwright） | 同上 |
| SBS 系统（机组负荷 + 环保运行） | 定时爬取（Playwright） | 同上 |
| 历史数据（所有源） | Excel 导入 | 用户上传 → 系统解析写库 |

**数据时效**：当年数据延迟 ≤ 10 分钟；历史数据按导入批次。

## 技术决策（已确认）

| 项 | 选型 | 理由 |
|---|---|---|
| 前端框架 | **Next.js 15 (App Router) + React 19** | 文件路由直观，后端 API Routes 和前端同仓库 |
| UI 库 | **shadcn/ui + Tailwind CSS** | 组件可改源码，设计系统可控 |
| 语言 | **TypeScript（strict）** | 类型提示是非程序员维护时最大的安全网 |
| 包管理器 | **pnpm** | 速度快、磁盘占用小 |
| 数据库 | **PostgreSQL + Prisma** | 类型安全、迁移可控、内网部署 |
| 爬虫 | **Playwright** | 外部平台均为 SPA，需浏览器渲染 |
| 定时任务 | **node-cron**（Next.js API Route 内） | 轻量，不引入额外进程 |
| 鉴权 | **NextAuth.js**（用户名密码策略） | 三角色：管理员 / 普通员工 / 领导层；具体权限矩阵待定 |
| 国际化 | **仅中文** | 内部工具，不做 i18n |

## 目录约定

```
Elec/
├── CLAUDE.md
├── README.md
├── prisma/
│   ├── schema.prisma      # 数据库模型定义
│   └── migrations/        # 自动生成，不要手改
├── app/                   # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/               # 后端 API Routes
│   │   ├── scraper/       # 爬虫触发 + 定时任务
│   │   ├── import/        # Excel 导入接口
│   │   └── auth/          # NextAuth 路由
│   └── <feature>/         # 按业务功能分目录
├── components/
│   ├── ui/                # shadcn 生成的基础组件，不要手改
│   └── <feature>/         # 业务组件
├── lib/
│   ├── db.ts              # Prisma client 单例
│   ├── scrapers/          # 各平台爬虫逻辑
│   └── <其他纯函数>/
├── public/
│   └── assets/
├── styles/
├── 项目要点/
│   └── prototype/         # 静态原型（参考用，不进生产构建）
└── docs/
```

**规则**：
- 一个文件超过 300 行先想能不能拆
- 新业务功能 → 同时在 `app/<feature>/` 和 `components/<feature>/` 下建目录，不要把组件全堆在 `components/` 根
- `lib/` 下只放无副作用的纯函数，有 React 依赖的工具放到 `components/<feature>/hooks/`
- **新建任何 `app/<feature>/page.tsx` 时，必须同步在 `app/page.tsx` 的 `ALL_MODULES` 或 `EXTRA_MODULES` 中注册对应模块（id、name、icon、color、href）。TabBar 入口不能替代工作台注册。**

## 命名规范

- 文件：组件 `PascalCase.tsx`，工具/路由 `kebab-case.ts`
- 变量/函数：`camelCase`
- 类型/接口：`PascalCase`，不加 `I` 前缀
- 常量：`SCREAMING_SNAKE_CASE`
- 中文文件名（如 `华电icon.png`）允许但仅限静态资源，代码里引用时用变量绑定

## 命令

```bash
pnpm dev          # 本地开发，默认 http://localhost:3000
pnpm build        # 生产构建
pnpm start        # 生产模式启动（先 build）
pnpm lint         # ESLint 检查
pnpm typecheck    # TypeScript 类型检查
```

**改完代码必跑**：`pnpm typecheck && pnpm lint`，通过再汇报完成。

## 部署

目标：**华电内网服务器**，Node.js 直跑 或 Docker 容器（待最终确认）。

```bash
# 内网服务器（暂定，确认后补全）
pnpm build && pnpm start
```

⚠️ 部署**不依赖** `git push`。Playwright 在服务器上需要单独安装浏览器依赖（`pnpm exec playwright install chromium`）。

## 设计原则（本项目强化版）

继承全局 CLAUDE.md 的「交互设计原则」，本项目额外要求：

- **首屏一眼懂用途**：内部用户没耐心看引导，进来就要知道这是什么、能做什么
- **少配置、多默认**：能用合理默认值就不要让用户填表单
- **错误信息说人话**：不要暴露技术细节（"500 Internal Server Error"），要说"刚才那步没保存成功，我已经记住你填的内容，点这里重试"
- **关键操作可撤销**：删除、提交类操作要有 Undo 或二次确认（按全局原则，只在"真实风险"时确认）

## Hero / 导航禁忌（铁律）

**二级页面（非首页）的 Hero / 顶部导航严禁出现「广州大学城华电新能源」或任何公司名/企业名**——无论是标题、副标题、面包屑还是状态条，统统不要。

- ✅ Hero 顶部导航只放：返回箭头（`<ChevronLeft size={24} />`）+ 页面标题（如「监测报表」「排放量统计」）+ 右侧菜单图标（可选）
- ❌ 不要写「广州大学城华电新能源…」之类作为标题、副标题、面包屑
- ❌ 不要保留原型 HTML 里 `.nav-company` 这类带公司名的副标题位
- 例外：**首页**的顶部居中可以显示公司名（参考 `app/page.tsx`，作为「当前登录企业」的身份提示）
- 例外：**企业档案页**（`/enterprise`）的内容卡片里展示公司名属于业务数据，不算违规

**Why**：内部员工每个页面都看到自己公司名是视觉噪音，浪费 Hero 宝贵的空间，二级页只关心「我现在在哪个功能」。这条说过非常多次了，不要再问、不要再加。

**How to apply**：新建/移植任何 `app/<feature>/page.tsx` 时，Hero 导航行只允许「返回 + 页面标题 + （可选）右侧菜单」三件，看见原型有公司名一律删。

## 原型移植规则（必读，不要再让我说第二遍）

**`项目要点/prototype/app/*.html` 只是参考稿，用来看交互逻辑和内容结构，不是用来抄样式的。** 那里的 HTML 包着 iPhone mockup 外壳（`.phone-frame` / `.phone-wrapper` / `.status-bar`），是为了让人在桌面看上去像手机预览。**Next.js 实际生产页面里这些容器全部不要。**

### 移植任何 `项目要点/prototype/app/*.html` 到 Next.js 之前

1. **必须先读至少一个现有 `app/<feature>/page.tsx`**（推荐 `app/emission/page.tsx`、`app/anomaly/page.tsx`、`app/gauge/page.tsx`），把它当作样式模板。
2. **必须对照本文件下方「UI 设计系统」章节**确认 Hero / 卡片 / 图标盒 / 色彩 token。
3. 只搬业务内容和交互逻辑，下列原型外壳一律删除：

| 必须丢弃 | 原因 |
|---|---|
| `.phone-frame` / `.phone-wrapper` / `.phone-label` | 桌面手机壳 mockup，生产页面不要 |
| `.status-bar` / `.status-time` / `.status-icons` / `.status-bat`（24% 电量、信号小图标等） | 那是假的状态栏，PC 浏览器不需要 |
| 内嵌 `<style>` 整段 CSS 直接复制粘贴 | 必须按本项目模式重写为 React 内联 style（参考现有 `app/*/page.tsx`） |
| 手写 `<svg viewBox=...>` | 一律换成 Lucide React 组件：`import { ChevronLeft, Menu } from "lucide-react"` |
| `onclick="history.back()"` | 改成 `useRouter().back()` |
| 顶部蓝色渐变 + 业务内容粘在一起的整块 | 拆成：Hero 区（蓝色渐变 + 点阵 + 光晕，参考 `emission/page.tsx` 的 `heroStyle`） + 业务内容区（白底卡片） |

### 移植完成后页面应该长这样

```tsx
"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft, Menu } from "lucide-react";
import TabBar from "@/components/layout/TabBar";

export default function FeaturePage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Hero：蓝色渐变 + 点阵 + 光晕 + 返回 + 标题 */}
      <div style={{ background: "linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)", position: "relative", overflow: "hidden" }}>
        {/* 点阵 */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)", backgroundSize: "22px 22px", opacity: 0.4, pointerEvents: "none" }} />
        {/* 光晕 */}
        <div style={{ position: "absolute", top: -80, left: -60, width: 280, height: 280, background: "radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* 导航 */}
        <div style={{ position: "relative", zIndex: 1, height: 44, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex" }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>页面标题</span>
        </div>
        {/* ... 其他 Hero 内 filter / badge */}
      </div>
      {/* 业务内容 */}
      <div style={{ padding: "14px 14px 80px" }}>
        ...
      </div>
      <TabBar />
    </div>
  );
}
```

### 自检清单（每次移植完成都过一遍）

- [ ] 页面外层是 `<div style={{ minHeight: "100vh", background: "#f5f7fa" }}>`，没有手机壳容器
- [ ] 没有任何 `.phone-frame` / `.status-bar` 类名残留
- [ ] 没有手写的 `<svg>`，全部用 Lucide React 组件
- [ ] **Hero / 顶部导航没有公司名/企业名**（见上方「Hero / 导航禁忌」铁律）
- [ ] Hero 用了渐变 + 点阵 + 光晕三件套，色值跟 `app/emission/page.tsx` 完全一致
- [ ] 在 `app/page.tsx` 的 `ALL_MODULES` / `EXTRA_MODULES` 注册了对应模块（如果是新功能）
- [ ] 跑了 `pnpm typecheck && pnpm lint` 并通过

## UI 设计系统

> **一句话定位**：科技蓝风格。工业数据平台的严肃感 + 现代 SaaS 的简洁感。
> 不要山水插画、毛笔字、国风装饰。所有「美化」手段只有：渐变、点阵纹理、光晕。

### 图标库：Lucide Icons

**全项目统一使用 [Lucide Icons](https://lucide.dev)**，不用其他图标库。

```html
<!-- 每个 HTML 页面 </body> 前必须引入 -->
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
```

使用方式：

```html
<!-- 用 <i data-lucide="图标名"> 占位，lucide.createIcons() 自动替换为 SVG -->
<i data-lucide="building-2"></i>
<i data-lucide="alert-triangle"></i>
```

**规则：**
- 所有图标用 `<i data-lucide="...">` 写法，不手写 `<svg>` 内联图标
- 动态渲染（JS innerHTML）里也用 `data-lucide`，渲染后调用 `lucide.createIcons()`
- 图标尺寸通过父容器 CSS 控制，不在 `<i>` 标签上写 `width`/`height`
- 图标颜色通过 `color` 或 `stroke` 控制（Lucide 默认 `stroke: currentColor`）
- 常用图标名速查：`home` `building-2` `activity` `alert-triangle` `siren` `zap` `wifi` `battery` `menu` `chevron-down` `chevron-up` `check` `plus` `settings-2` `layout-grid` `pie-chart` `bar-chart-3` `file-text` `gauge` `shield-check` `bookmark-check` `sliders-horizontal` `clipboard-check` `info` `phone` `map-pin`

### 色彩 Token

| 用途 | 值 |
|---|---|
| **品牌蓝（主色·图标/按钮）** | `#1677ff` |
| **品牌蓝（深·Section 竖条）** | `#0d52c4` |
| Hero 渐变起点 | `#0062d4` |
| Hero 渐变中段 | `#007AFF` |
| Hero 渐变终点 | `#2ca5ff` |
| 点阵纹理色 | `rgba(100,200,255,0.22)` |
| 光晕色 | `rgba(50,150,255,0.18)` |
| 页面背景 | `#f5f7fa` |
| 卡片背景 | `#ffffff` |
| 主文字 | `#1a1a1a` |
| 次文字 | `#6b7a8c` |
| 占位文字 | `#8090a8` |
| 分割线 | `#ebeef2` |
| 警告橙 | `#fa8c16` |
| 错误红 | `#f5222d` |

### Hero / 页头模式（每个页面顶部必用）

```
背景：linear-gradient(160deg, #0062d4 0%, #007AFF 55%, #2ca5ff 100%)
点阵纹理：radial-gradient(circle, rgba(100,200,255,0.22) 1px, transparent 1px)，background-size: 22px 22px，opacity: 0.4
光晕：radial-gradient(circle, rgba(50,150,255,0.18) 0%, transparent 70%)，top:-80px left:-60px（或 top:-60px right:-40px）
状态栏文字：rgba(255,255,255,0.8)
```

- 首页 Hero 高度较大，含平台标题 + 实时徽章 + 今日报警卡
- 内页 Hero 较矮，含返回键 + 页面标题 + 实体身份条（如企业名称）

### 图标容器（Icon Box）

所有功能入口、模块图标统一用「彩色圆角方块 + Lucide 图标」模式，**不要裸 SVG 直接放页面**。

```css
/* 标准尺寸（工作台、列表） */
.icon-box {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: #1677ff;   /* 品牌图标用纯色，不加渐变 */
  display: flex; align-items: center; justify-content: center;
}
.icon-box svg { width: 20px; height: 20px; color: #fff; }

/* 小尺寸（列表序号、紧凑场景） */
.icon-box-sm {
  width: 28px; height: 28px;
  border-radius: 8px;
  background: #1677ff;
}
```

**图标盒只用纯色，不用渐变。** 渐变只允许出现在 Hero 背景、Section 左竖条这类「结构性装饰」上。

**色调枚举**（工作台模块图标背景 / 图标色）：

| 语义 | class | 背景 | 图标色 |
|---|---|---|---|
| 主蓝（品牌/默认） | `c-blue` | `#e6f4ff` | `#1677ff` |
| 青色（实时/在线） | `c-cyan` | `#e0f7ff` | `#0091c7` |
| 橙色（预警） | `c-orange` | `#fff7e0` | `#d46b08` |
| 红色（超标/告警） | `c-red` | `#fff0f0` | `#cf1322` |
| 绿色（正常/统计） | `c-green` | `#f0fff4` | `#389e0d` |
| 紫色（管理/督办） | `c-purple` | `#f5f0ff` | `#531dab` |
| 青绿（报表/传输） | `c-teal` | `#e6fffb` | `#08979c` |
| 灰色（设置/次要） | `c-gray` | `#f5f5f5` | `#595959` |
| 品牌蓝（Hero/Badge） | — | `#1677ff`（纯色） | `#ffffff` |

### Section 标题模式

```css
.section-title {
  font-size: 13px; font-weight: 600; color: #1a1a1a;
  display: flex; align-items: center; gap: 7px;
}
.section-title::before {
  content: "";
  width: 3px; height: 14px;
  background: linear-gradient(180deg, #1677ff 0%, #0d52c4 100%);
  border-radius: 2px;
}
```

Section 标题右侧可选：「查看全部 ›」`color: #1677ff` / 展开收起 toggle。

### 卡片模式

```css
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(10,69,149,0.06);
}
```

- 列表项之间 `gap: 8px`，不用分割线隔开卡片
- 卡片内部行分割用 `border-bottom: 1px solid #f0f3f7`（极浅灰）
- 不用 `border: 1px solid` 给卡片加外框，阴影已足够

### 状态指示器

```css
/* 绿点（正常/在线） */  background: #52c41a;
/* 红点（告警） */       background: #f5222d;
/* 黄点（预警） */       background: #faad14;
/* 灰点（离线） */       background: #8090a8;
```

数值徽章：`background: #f0fff4; color: #389e0d`（0/正常）/ `background: #fff1f0; color: #f5222d`（有问题）。

### 禁止项

- ❌ 山水插画、SVG 风景图、国风笔刷装饰
- ❌ 毛笔字体（STXingkai、KaiTi 等书法字体）
- ❌ `.footnote` 脚注文字（「数据每10秒更新」之类提示不放页面底部）
- ❌ 手写 `<svg>` 内联图标——统一用 Lucide `<i data-lucide="...">`
- ❌ 图标盒加渐变——只用纯色
- ❌ 纯色平铺背景的 Hero 区（必须有渐变 + 点阵纹理）

## 业务知识（待补充）

[随着对业务理解加深，把华电特有的术语、流程、限制写到这里。例如：
- 业务术语表
- 合规约束（数据出境、敏感字段等）
- 内部系统集成点]
