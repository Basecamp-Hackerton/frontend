"use client"

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Megaphone,
  Newspaper,
  User,
  LogIn,
  LogOut,
  ExternalLink,
  TrendingUp,
  Link as LinkIcon,
  Bell,
  Search,
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  DollarSign,
  Gamepad2,
  Code,
  Shield,
  Trophy,
  BarChart3,
  Users,
  Zap,
  Flame,
  BookOpen,
  Building2,
  Coins,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// --- Demo Data ---
const demoAnnouncements = [
  { id: 1, title: "[공지] Base Camp 베타 오픈", date: "2025-01-20", type: "공지" },
  { id: 2, title: "[밋업] Base Builder Meetup 2025", date: "2025-01-18", type: "밋업" },
  { id: 3, title: "[포럼] Base 생태계 발전 방향 토론", date: "2025-01-15", type: "포럼" },
];

const demoLatestPosts = [
  { id: 101, user: "degen-builder", title: "Frame 기반 미니게임 런칭기", likes: 42, comments: 12, views: 234 },
  { id: 102, user: "solidity-cat", title: "ERC-1155 인벤토리 설계 팁", likes: 31, comments: 8, views: 189 },
  { id: 103, user: "rollup-nerd", title: "Base 가스 최적화 실험 결과 공유", likes: 27, comments: 15, views: 312 },
  { id: 104, user: "k-base", title: "한국 Base 유저 모임 공지", likes: 19, comments: 5, views: 156 },
];

const demoPopularPosts = [
  { id: 201, user: "base-master", title: "Base 생태계 완전 정복 가이드", likes: 156, comments: 42, views: 1234 },
  { id: 202, user: "defi-king", title: "Base에서 가장 수익률 높은 DeFi 전략", likes: 98, comments: 28, views: 892 },
  { id: 203, user: "nft-artist", title: "Base NFT 마켓플레이스 비교 분석", likes: 87, comments: 19, views: 756 },
];

const demoRankings = [
  { rank: 1, user: "base-master", level: 45, xp: 12500, change: 0 },
  { rank: 2, user: "defi-king", level: 42, xp: 11800, change: 1 },
  { rank: 3, user: "hosung", level: 12, xp: 4078, change: -1 },
  { rank: 4, user: "nft-artist", level: 38, xp: 10200, change: 0 },
  { rank: 5, user: "solidity-cat", level: 35, xp: 9800, change: 2 },
];

// price demo series
function useDemoPrice() {
  return useMemo(() => {
    const base = 1.2;
    const data = [] as { day: string; price: number }[];
    for (let i = 10; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const jitter = (Math.sin(i * 1.2) + Math.random() * 0.3) * 0.03;
      data.push({
        day: `${d.getMonth() + 1}/${d.getDate()}`,
        price: Number((base * (1 + jitter)).toFixed(3)),
      });
    }
    return data;
  }, []);
}

function useCoinbasePrice() {
  return useMemo(() => {
    const base = 42000;
    const data = [] as { day: string; price: number }[];
    for (let i = 10; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const jitter = (Math.sin(i * 0.8) + Math.random() * 0.5) * 0.02;
      data.push({
        day: `${d.getMonth() + 1}/${d.getDate()}`,
        price: Number((base * (1 + jitter)).toFixed(0)),
      });
    }
    return data;
  }, []);
}

// --- Layout Component ---
export default function BaseCampHome() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [username] = useState("hosung");
  const [expandedBoards, setExpandedBoards] = useState<Record<string, boolean>>({
    finance: false,
    game: false,
    security: false,
  });
  const priceData = useDemoPrice();
  const coinbaseData = useCoinbasePrice();

  const toggleBoard = (board: string) => {
    setExpandedBoards((prev) => ({ ...prev, [board]: !prev[board] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white grid place-items-center text-sm font-bold">B</div>
              <div className="font-semibold tracking-tight text-slate-100">Base Camp</div>
              <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-300">beta</Badge>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 text-slate-400" />
                <Input placeholder="검색: 공지, 게시물, 사용자…" className="pl-9 w-72 border-slate-700 bg-slate-800/50 text-slate-100 placeholder:text-slate-500 rounded-xl" />
              </div>
              <Button variant="ghost" size="icon" aria-label="알림" className="hover:bg-slate-700 rounded-xl">
                <Bell className="h-5 w-5 text-slate-300" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="설정" className="hover:bg-slate-700 rounded-xl">
                <Settings className="h-5 w-5 text-slate-300" />
              </Button>
              {loggedIn ? (
                <>
                  <Link href="/profile">
                    <Button variant="outline" className="gap-2 border-slate-700 hover:bg-slate-700 rounded-xl">
                      <User className="h-4 w-4" /> 내 프로필
                    </Button>
                  </Link>
                  <Button onClick={() => setLoggedIn(false)} variant="outline" className="gap-2 border-slate-700 hover:bg-slate-700 rounded-xl">
                    <LogOut className="h-4 w-4" /> 로그아웃
                  </Button>
                </>
              ) : (
                <Button onClick={() => setLoggedIn(true)} className="gap-2 rounded-xl">
                  <LogIn className="h-4 w-4" /> 로그인
                </Button>
              )}
            </div>
          </div>
      </header>

      {/* Main */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-6 py-6 md:grid-cols-12">
        {/* Sidebar */}
        <aside className="md:col-span-3 lg:col-span-2 space-y-4">
          {/* 게시판 종류 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">게시판</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <NavItem icon={<Megaphone className="h-4 w-4" />} label="공지사항" href="/board/announcements" />
              <NavItem icon={<Newspaper className="h-4 w-4" />} label="자유게시판" href="/board/free" />
              
              {/* 금융 정보 */}
              <div>
                <button
                  onClick={() => toggleBoard("finance")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-600" />
                    <span>금융 정보</span>
                  </div>
                  {expandedBoards.finance ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedBoards.finance && (
                  <div className="ml-6 mt-1 space-y-1">
                    <NavItem icon={<TrendingUp className="h-3 w-3" />} label="예측" href="/board/finance/prediction" />
                    <NavItem icon={<Coins className="h-3 w-3" />} label="에어드랍" href="/board/finance/airdrop" />
                    <NavItem icon={<Trophy className="h-3 w-3" />} label="자랑글" href="/board/finance/showoff" />
                  </div>
                )}
              </div>

              {/* 게임 */}
              <div>
                <button
                  onClick={() => toggleBoard("game")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-slate-600" />
                    <span>게임</span>
                  </div>
                  {expandedBoards.game ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedBoards.game && (
                  <div className="ml-6 mt-1 space-y-1">
                    <NavItem icon={<BookOpen className="h-3 w-3" />} label="공략" href="/board/game/guide" />
                    <NavItem icon={<Coins className="h-3 w-3" />} label="아이템" href="/board/game/item" />
                    <NavItem icon={<Newspaper className="h-3 w-3" />} label="자유" href="/board/game/free" />
                  </div>
                )}
              </div>

              <NavItem icon={<Code className="h-4 w-4" />} label="빌드" href="/board/build" />
              
              {/* 보안 */}
              <div>
                <button
                  onClick={() => toggleBoard("security")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-slate-600" />
                    <span>보안</span>
                  </div>
                  {expandedBoards.security ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedBoards.security && (
                  <div className="ml-6 mt-1 space-y-1">
                    <NavItem icon={<Shield className="h-3 w-3" />} label="취약점 제보" href="/board/security/vulnerability" />
                    <NavItem icon={<Newspaper className="h-3 w-3" />} label="보안 뉴스" href="/board/security/news" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 주요 서비스 외부 링크 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">주요 서비스</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <ServiceLink href="https://docs.base.org/" label="Docs 및 빌드" />
              <ServiceLink href="#" label="Play to Earn (Base)" />
              <ServiceLink href="#" label="거래소" />
              <ServiceLink href="https://docs.base.org/docs/tools/network-faucets" label="Base Testnet" />
              <Separator className="my-1 bg-slate-700" />
              <div className="text-xs font-semibold text-slate-400 mb-1">외부 서비스</div>
              <ServiceLink href="#" label="BaseName" />
              <ServiceLink href="#" label="Baseapp SNS" />
              <ServiceLink href="#" label="Baseapp 인스타" />
              <ServiceLink href="#" label="Baseapp 그록" />
              <ServiceLink href="#" label="Baseapp Perpdex" />
              <ServiceLink href="#" label="Baseapp 예측시장" />
            </CardContent>
          </Card>
        </aside>

        {/* Content */}
        <main className="md:col-span-9 lg:col-span-10 space-y-4">
          {/* Hero / Profile */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-100">
                    {loggedIn ? (
                      <>안녕하세요, <span className="text-blue-400">{username}</span> 님 👋</>
                    ) : (
                      <>Base Camp에 오신 것을 환영합니다</>
                    )}
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Base 커뮤니티의 모든 것을 한 화면에서 만나보세요
                  </p>
                </div>
                {loggedIn && (
                  <div className="flex items-center gap-2">
                    <Link href="/board/free/write">
                      <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl">
                        <FileText className="h-4 w-4" /> 게시글 작성
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* 공지사항 & 최신 게시물 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 공지사항 */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                    <Megaphone className="h-5 w-5 text-blue-400" /> Base 공식 공지
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {demoAnnouncements.map((a) => (
                      <li key={a.id} className="flex items-start justify-between group hover:bg-slate-700/30 p-2 rounded-lg -mx-2 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">{a.type}</Badge>
                            <span className="font-medium text-sm text-slate-200">{a.title}</span>
                          </div>
                          <span className="text-xs text-slate-500">{a.date}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 text-right">
                    <Link href="/board/announcements">
                      <Button variant="ghost" size="sm" className="gap-1 text-slate-400 hover:text-slate-200 rounded-xl">
                        더 보기 <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 최신 게시물 */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
              <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                    <Newspaper className="h-5 w-5 text-green-400" /> 최신 게시물
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {demoLatestPosts.map((p) => (
                      <li key={p.id} className="group hover:bg-slate-700/30 p-2 rounded-lg -mx-2 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1 text-slate-200">{p.title}</div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>by @{p.user}</span>
                              <span>❤ {p.likes}</span>
                              <span>💬 {p.comments}</span>
                              <span>👁 {p.views}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 text-right">
                    <Link href="/board/free">
                      <Button variant="ghost" size="sm" className="gap-1 text-slate-400 hover:text-slate-200 rounded-xl">
                        더 보기 <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* 인기 게시물 & 랭킹 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 인기 게시물 */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                    <Flame className="h-5 w-5 text-orange-400" /> 인기 게시물
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {demoPopularPosts.map((p, idx) => (
                      <li key={p.id} className="group hover:bg-slate-700/30 p-2 rounded-lg -mx-2 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1 text-slate-200">{p.title}</div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>by @{p.user}</span>
                              <span className="flex items-center gap-1 text-orange-400">
                                <Flame className="h-3 w-3" /> {p.likes}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Developer Level & Total Level Ranking */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
              <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                    <Trophy className="h-5 w-5 text-purple-400" /> 레벨 랭킹
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {demoRankings.map((r) => (
                      <div
                        key={r.rank}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          r.user === username ? "bg-purple-500/20 border border-purple-500/50" : "hover:bg-slate-700/30"
                        }`}
                      >
                        <div className="flex-shrink-0 w-8 text-center">
                          {r.rank <= 3 ? (
                            <span className="text-lg">{"🥇🥈🥉"[r.rank - 1]}</span>
                          ) : (
                            <span className="text-sm font-semibold text-slate-400">#{r.rank}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-slate-200">{r.user}</span>
                            {r.user === username && (
                              <Badge variant="secondary" className="text-xs bg-purple-500/30 text-purple-300">나</Badge>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">
                            Level {r.level} · {r.xp.toLocaleString()} XP
                          </div>
                        </div>
                        {r.change !== 0 && (
                          <div className={`text-xs ${r.change > 0 ? "text-green-400" : "text-red-400"}`}>
                            {r.change > 0 ? "↑" : "↓"} {Math.abs(r.change)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-right">
                    <Link href="/leaderboard">
                      <Button variant="ghost" size="sm" className="gap-1 text-slate-400 hover:text-slate-200 rounded-xl">
                        전체 랭킹 보기 <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* 시세 차트 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Base 시세 */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
              <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                    <TrendingUp className="h-5 w-5 text-blue-400" /> Base 시세
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis domain={["auto", "auto"]} stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "0.5rem" }} />
                        <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Coinbase 시세 */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
              <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                    <BarChart3 className="h-5 w-5 text-orange-400" /> Coinbase 시세
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={coinbaseData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis domain={["auto", "auto"]} stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "0.5rem" }} />
                        <Line type="monotone" dataKey="price" stroke="#f97316" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) {
  const content = (
    <div className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-700/50 transition-colors text-slate-300">
      <span className="text-slate-400">{icon}</span>
      <span>{label}</span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <button>{content}</button>;
}

function ServiceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-xl border border-slate-700 px-3 py-2 text-sm hover:bg-slate-700/50 transition-colors text-slate-300"
    >
      <span>{label}</span>
      <ExternalLink className="h-4 w-4 opacity-60" />
    </a>
  );
}
