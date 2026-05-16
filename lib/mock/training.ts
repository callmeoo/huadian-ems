// 培训模块演示用 Mock 数据
// 后续接真实 API 时，只替换这里的 export，调用方不动。

export type TrainingRole = "employee" | "leader" | "config";

export const ROLE_LABEL: Record<TrainingRole, string> = {
  employee: "普通员工",
  leader: "领导 / 管理员",
  config: "题库配置员",
};

export const ROLE_DESC: Record<TrainingRole, string> = {
  employee: "参加培训、做题、查看个人成绩",
  leader: "查看全员培训情况与成绩分布",
  config: "管理题库、设置考试规则",
};

// ─── 演示账号 ───────────────────────────────────────────────────────────────

export type DemoUser = {
  id: string;
  name: string;
  dept: string;
  role: TrainingRole;
};

export const DEMO_USERS: Record<TrainingRole, DemoUser> = {
  employee: { id: "u-1024", name: "张工", dept: "运行二班", role: "employee" },
  leader: { id: "u-2001", name: "王主任", dept: "安环部", role: "leader" },
  config: { id: "u-3001", name: "李工", dept: "信息中心", role: "config" },
};

// ─── 题库 ───────────────────────────────────────────────────────────────────

export type QuestionCategory = {
  id: string;
  name: string;
  count: number;
  updatedAt: string;
  difficulty: "易" | "中" | "难";
};

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  { id: "c-law", name: "环保法律法规", count: 86, updatedAt: "2026-04-12", difficulty: "中" },
  { id: "c-permit", name: "排污许可制度", count: 54, updatedAt: "2026-04-08", difficulty: "中" },
  { id: "c-air", name: "大气污染防治", count: 62, updatedAt: "2026-03-26", difficulty: "中" },
  { id: "c-water", name: "水污染防治", count: 38, updatedAt: "2026-03-15", difficulty: "易" },
  { id: "c-emergency", name: "环境应急处置", count: 26, updatedAt: "2026-04-20", difficulty: "难" },
  { id: "c-safety", name: "运行安全规程", count: 20, updatedAt: "2026-02-28", difficulty: "易" },
];

export const TOTAL_QUESTIONS = QUESTION_CATEGORIES.reduce((s, c) => s + c.count, 0);

// ─── 培训计划 ───────────────────────────────────────────────────────────────

export type TrainingPlan = {
  id: string;
  title: string;
  category: string;
  startAt: string;
  deadline: string;
  duration: string;            // 例 "40 分钟"
  questionCount: number;
  passScore: number;
  required: boolean;           // 必修
  status: "available" | "ongoing" | "completed" | "expired";
};

// 「当前可选 / 已参与」按 status 过滤
export const MY_TRAININGS: TrainingPlan[] = [
  {
    id: "t-2026q2",
    title: "2026 Q2 全员环保法规培训",
    category: "环保法律法规",
    startAt: "2026-05-10",
    deadline: "2026-05-25",
    duration: "45 分钟",
    questionCount: 30,
    passScore: 80,
    required: true,
    status: "available",
  },
  {
    id: "t-emerg-26",
    title: "环境应急演练知识点测验",
    category: "环境应急处置",
    startAt: "2026-05-12",
    deadline: "2026-05-22",
    duration: "30 分钟",
    questionCount: 20,
    passScore: 75,
    required: false,
    status: "available",
  },
  {
    id: "t-permit-26",
    title: "新版排污许可证执行规范解读",
    category: "排污许可制度",
    startAt: "2026-05-05",
    deadline: "2026-05-30",
    duration: "60 分钟",
    questionCount: 40,
    passScore: 80,
    required: true,
    status: "ongoing",
  },
  {
    id: "t-q1-26",
    title: "2026 Q1 全员环保培训",
    category: "环保法律法规",
    startAt: "2026-01-08",
    deadline: "2026-01-20",
    duration: "45 分钟",
    questionCount: 30,
    passScore: 80,
    required: true,
    status: "completed",
  },
  {
    id: "t-water-25",
    title: "水污染防治专项培训",
    category: "水污染防治",
    startAt: "2025-11-10",
    deadline: "2025-11-25",
    duration: "40 分钟",
    questionCount: 25,
    passScore: 75,
    required: true,
    status: "completed",
  },
  {
    id: "t-air-25",
    title: "大气污染物排放限值解读",
    category: "大气污染防治",
    startAt: "2025-09-01",
    deadline: "2025-09-15",
    duration: "50 分钟",
    questionCount: 30,
    passScore: 80,
    required: false,
    status: "completed",
  },
];

// ─── 个人成绩（员工） ────────────────────────────────────────────────────────

export type ScoreRecord = {
  trainingId: string;
  trainingTitle: string;
  score: number;
  rank: number;       // 同培训内排名
  total: number;      // 同培训总人数
  finishedAt: string;
  durationUsed: string;
};

export const MY_SCORES: ScoreRecord[] = [
  { trainingId: "t-q1-26", trainingTitle: "2026 Q1 全员环保培训", score: 92, rank: 3, total: 13, finishedAt: "2026-01-18 14:22", durationUsed: "38 分钟" },
  { trainingId: "t-water-25", trainingTitle: "水污染防治专项培训", score: 85, rank: 5, total: 12, finishedAt: "2025-11-22 10:08", durationUsed: "33 分钟" },
  { trainingId: "t-air-25", trainingTitle: "大气污染物排放限值解读", score: 78, rank: 8, total: 14, finishedAt: "2025-09-12 16:40", durationUsed: "45 分钟" },
];

export const MY_SCORE_SUMMARY = {
  avg: 85,
  best: 92,
  completed: MY_SCORES.length,
  passed: MY_SCORES.filter((s) => s.score >= 80).length,
};

// ─── 培训记录 / 全员视角（领导） ────────────────────────────────────────────

export type TrainingRecord = {
  id: string;
  title: string;
  date: string;
  participants: number;
  finished: number;
  avgScore: number;
  passRate: number;        // 0-100
  status: "ongoing" | "completed";
};

export const TRAINING_RECORDS: TrainingRecord[] = [
  { id: "t-permit-26", title: "新版排污许可证执行规范解读", date: "2026-05-05", participants: 18, finished: 11, avgScore: 82, passRate: 78, status: "ongoing" },
  { id: "t-2026q2", title: "2026 Q2 全员环保法规培训", date: "2026-05-10", participants: 22, finished: 6, avgScore: 0, passRate: 0, status: "ongoing" },
  { id: "t-q1-26", title: "2026 Q1 全员环保培训", date: "2026-01-08", participants: 13, finished: 13, avgScore: 86, passRate: 92, status: "completed" },
  { id: "t-q4-25", title: "2025 Q4 排污许可专项培训", date: "2025-10-15", participants: 8, finished: 8, avgScore: 79, passRate: 87, status: "completed" },
  { id: "t-water-25", title: "水污染防治专项培训", date: "2025-11-10", participants: 12, finished: 12, avgScore: 81, passRate: 83, status: "completed" },
];

// ─── 人员参与情况（领导） ───────────────────────────────────────────────────

export type StaffParticipation = {
  id: string;
  name: string;
  dept: string;
  required: number;       // 应参加培训数
  completed: number;      // 已完成数
  avgScore: number;       // 平均分
  lastFinishedAt: string; // 最近一次完成时间
  status: "good" | "warn" | "danger"; // good=正常 / warn=有1项未完成 / danger=2项及以上未完成
};

export const STAFF_PARTICIPATION: StaffParticipation[] = [
  { id: "u-1024", name: "张工",   dept: "运行二班", required: 3, completed: 3, avgScore: 85, lastFinishedAt: "2026-01-18", status: "good" },
  { id: "u-1025", name: "陈工",   dept: "运行二班", required: 3, completed: 3, avgScore: 91, lastFinishedAt: "2026-01-19", status: "good" },
  { id: "u-1026", name: "刘工",   dept: "运行一班", required: 3, completed: 2, avgScore: 78, lastFinishedAt: "2025-11-22", status: "warn" },
  { id: "u-1027", name: "黄工",   dept: "运行一班", required: 3, completed: 3, avgScore: 88, lastFinishedAt: "2026-01-17", status: "good" },
  { id: "u-1028", name: "周工",   dept: "维护班",   required: 3, completed: 1, avgScore: 72, lastFinishedAt: "2025-09-12", status: "danger" },
  { id: "u-1029", name: "吴工",   dept: "维护班",   required: 3, completed: 3, avgScore: 83, lastFinishedAt: "2026-01-18", status: "good" },
  { id: "u-1030", name: "钱工",   dept: "燃料班",   required: 3, completed: 2, avgScore: 76, lastFinishedAt: "2025-11-21", status: "warn" },
  { id: "u-1031", name: "孙工",   dept: "化学班",   required: 3, completed: 3, avgScore: 89, lastFinishedAt: "2026-01-19", status: "good" },
];

// ─── 考试不合格明细（领导） ─────────────────────────────────────────────────

export type FailedExamRecord = {
  id: string;
  staffId: string;
  staffName: string;
  dept: string;
  trainingId: string;
  trainingTitle: string;   // 考试 / 培训科目
  subject: string;         // 题库分类（细分科目）
  score: number;           // 实际分数
  passLine: number;        // 合格分数线
  examAt: string;          // 考试时间
};

// 合格分数线统一 60 分，<60 计入不合格
export const FAILED_EXAM_RECORDS: FailedExamRecord[] = [
  {
    id: "f-1", staffId: "u-1028", staffName: "周工", dept: "维护班",
    trainingId: "t-q1-26", trainingTitle: "2026 Q1 全员环保培训",
    subject: "环保法律法规", score: 56, passLine: 60, examAt: "2026-01-18 15:10",
  },
  {
    id: "f-2", staffId: "u-1030", staffName: "钱工", dept: "燃料班",
    trainingId: "t-permit-26", trainingTitle: "新版排污许可证执行规范解读",
    subject: "排污许可制度", score: 52, passLine: 60, examAt: "2026-05-08 10:32",
  },
  {
    id: "f-3", staffId: "u-1026", staffName: "刘工", dept: "运行一班",
    trainingId: "t-air-25", trainingTitle: "大气污染物排放限值解读",
    subject: "大气污染防治", score: 58, passLine: 60, examAt: "2025-09-12 16:40",
  },
];

// ─── 整体成绩分布（领导） ───────────────────────────────────────────────────

// 最近一次完整培训（2026 Q1）的分数分布
export const SCORE_DISTRIBUTION = [
  { range: "90+",   count: 6, color: "linear-gradient(90deg, #52c41a, #73d13d)" },
  { range: "80-89", count: 4, color: "linear-gradient(90deg, #1677ff, #40a9ff)" },
  { range: "70-79", count: 2, color: "linear-gradient(90deg, #fa8c16, #ffa940)" },
  { range: "60-69", count: 1, color: "#f5222d" },
  { range: "<60",   count: 0, color: "#cf1322" },
];

export const SCORE_DIST_META = {
  trainingTitle: "2026 Q1 全员环保培训",
  totalParticipants: 13,
  avgScore: 86,
  passRate: 92,
};

// ─── 配置员看板 ─────────────────────────────────────────────────────────────

export type ConfigStat = {
  label: string;
  value: string | number;
  hint: string;
};

export const CONFIG_OVERVIEW: ConfigStat[] = [
  { label: "题库总题数",   value: TOTAL_QUESTIONS, hint: "覆盖 6 个分类" },
  { label: "待审核新题",   value: 12,              hint: "AI 生成草稿" },
  { label: "进行中培训",   value: 2,               hint: "本月内截止" },
  { label: "本年发起培训", value: 5,               hint: "完成率 89%" },
];

export type ConfigTask = {
  id: string;
  title: string;
  type: "review" | "schedule" | "rule";
  count?: number;
  updatedAt: string;
};

export const CONFIG_TASKS: ConfigTask[] = [
  { id: "k-1", title: "AI 生成的应急处置新题待审核",   type: "review",   count: 12, updatedAt: "2026-05-15" },
  { id: "k-2", title: "「2026 Q2 全员环保法规培训」待发起", type: "schedule", updatedAt: "2026-05-14" },
  { id: "k-3", title: "考试规则更新：90 分以上算优秀",  type: "rule",     updatedAt: "2026-05-12" },
  { id: "k-4", title: "「水污染防治」分类已 60 天未更新", type: "review",   updatedAt: "2026-03-15" },
];
