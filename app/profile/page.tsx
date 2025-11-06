"use client"

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Github,
  Twitter,
  Edit3,
  Trophy,
  Zap,
  Code,
  Shield,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  ExternalLink,
  ChevronRight,
  Star,
  Flame,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import ActivityCalendar from "@/components/profile/ActivityCalendar";
import Timeline from "@/components/profile/Timeline";
import NFTBadges from "@/components/profile/NFTBadges";
import { cn } from "@/lib/utils";

// --- Demo Data ---
const demoUser = {
  nickname: "hosung",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hosung",
  email: "hosung@basecamp.io",
  github: "hosung-dev",
  twitter: "@hosung_base",
  bio: "Base 생태계 빌더 | Solidity 개발자 | Web3 보안 연구자",
  wallet: "0x69c2...162C",
  totalXP: 4078,
  totalLevel: 12,
  developerLevel: 8,
  developerXP: 2800,
  transactions: 127,
  contracts: 15,
  ctfSolved: 23,
  tier: "Bronze",
  nextTierXP: 10000,
};

const demoActivities = [
  { date: "2025-01-15", count: 5, type: "post" as const },
  { date: "2025-01-16", count: 3, type: "comment" as const },
  { date: "2025-01-17", count: 8, type: "transaction" as const },
  { date: "2025-01-18", count: 2, type: "deploy" as const },
  { date: "2025-01-19", count: 6, type: "like" as const },
  { date: "2025-01-20", count: 4, type: "post" as const },
  { date: "2025-01-21", count: 7, type: "ctf" as const },
];

const demoTimeline = [
  {
    id: 1,
    timestamp: "2025-01-21 14:32",
    type: "ctf" as const,
    title: "Base Security CTF #23 해결",
    description: "Reentrancy 공격 방어 패턴 문제",
    xp: 150,
    icon: Shield,
  },
  {
    id: 2,
    timestamp: "2025-01-21 10:15",
    type: "deploy" as const,
    title: "ERC-1155 인벤토리 컨트랙트 배포",
    description: "0x1234...5678",
    xp: 200,
    icon: Code,
  },
  {
    id: 3,
    timestamp: "2025-01-20 18:45",
    type: "post" as const,
    title: "게시글 작성: Base 가스 최적화 팁",
    description: "좋아요 42개, 댓글 15개",
    xp: 50,
    icon: Edit3,
  },
  {
    id: 4,
    timestamp: "2025-01-20 16:20",
    type: "article" as const,
    title: "아티클 작성: Frame 기반 미니게임 개발기",
    description: "NFT 보상 획득",
    xp: 300,
    icon: Award,
  },
  {
    id: 5,
    timestamp: "2025-01-19 12:10",
    type: "transaction" as const,
    title: "Base 체인 트랜잭션 실행",
    description: "스마트 컨트랙트 상호작용",
    xp: 10,
    icon: Zap,
  },
];

const demoBadges = [
  {
    id: 1,
    name: "First Article",
    description: "첫 아티클 작성",
    image: "🏆",
    rarity: "common" as const,
    earned: true,
    date: "2025-01-15",
  },
  {
    id: 2,
    name: "CTF Master",
    description: "CTF 20문제 해결",
    image: "🛡️",
    rarity: "rare" as const,
    earned: true,
    date: "2025-01-18",
  },
  {
    id: 3,
    name: "Builder",
    description: "컨트랙트 10개 배포",
    image: "⚡",
    rarity: "epic" as const,
    earned: true,
    date: "2025-01-20",
  },
  {
    id: 4,
    name: "Top Contributor",
    description: "주간 활동량 1위",
    image: "👑",
    rarity: "legendary" as const,
    earned: false,
    claimable: true,
  },
  {
    id: 5,
    name: "Security Expert",
    description: "보안 취약점 5개 제보",
    image: "🔒",
    rarity: "rare" as const,
    earned: false,
  },
];

function TierBadge({ tier }: { tier: string }) {
  const tierColors: Record<string, string> = {
    Bronze: "bg-amber-100 text-amber-800 border-amber-300",
    Silver: "bg-gray-100 text-gray-800 border-gray-300",
    Gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Platinum: "bg-blue-100 text-blue-800 border-blue-300",
    Diamond: "bg-purple-100 text-purple-800 border-purple-300",
  };

  return (
    <Badge
      variant="outline"
      className={cn("text-sm font-semibold px-3 py-1", tierColors[tier] || tierColors.Bronze)}
    >
      {tier} Tier
    </Badge>
  );
}

export default function ProfilePage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const xpProgress = (demoUser.totalXP / demoUser.nextTierXP) * 100;
  const devXPProgress = (demoUser.developerXP / 5000) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <Header
        rightContent={
          <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-700 rounded-xl">
            <User className="h-4 w-4 mr-2" />
            프로필 편집
          </Button>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="mb-6 shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar & Basic Info */}
                <div className="flex flex-col items-center md:items-start">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                      <img
                        src={demoUser.avatar}
                        alt={demoUser.nickname}
                        className="h-full w-full rounded-full bg-slate-800 object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-slate-900 rounded-full h-8 w-8 flex items-center justify-center">
                      <Star className="h-4 w-4 text-white fill-white" />
                    </div>
                  </div>
                  <div className="mt-4 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-slate-100">{demoUser.nickname}</h1>
                    <p className="text-sm text-slate-400 mt-1 font-mono">{demoUser.wallet}</p>
                    <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
                      <TierBadge tier={demoUser.tier} />
                    </div>
                  </div>
                </div>

                {/* Stats & Social */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-2">소셜 링크</h3>
                    <div className="flex flex-col gap-2">
                      <a
                        href={`mailto:${demoUser.email}`}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {demoUser.email}
                      </a>
                      <a
                        href={`https://github.com/${demoUser.github}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        {demoUser.github}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <a
                        href={`https://twitter.com/${demoUser.twitter.replace("@", "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                        {demoUser.twitter}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-2">자기소개</h3>
                    <p className="text-sm text-slate-300">{demoUser.bio}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* XP & Level Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6"
        >
          {/* Total XP */}
          <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-slate-100">
                <Zap className="h-5 w-5 text-yellow-400" />
                Total XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-bold text-slate-100">{demoUser.totalXP.toLocaleString()}</span>
                    <span className="text-sm text-slate-400">Level {demoUser.totalLevel}</span>
                  </div>
                  <Progress value={xpProgress} className="h-2" />
                  <p className="text-xs text-slate-400 mt-1">
                    다음 레벨까지 {demoUser.nextTierXP - demoUser.totalXP} XP 필요
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs text-slate-400">
                    다음 XP 업데이트: <span className="font-mono">05d 08h 32m</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Developer Level */}
          <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-slate-100">
                <Code className="h-5 w-5 text-blue-400" />
                Developer Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-bold text-slate-100">{demoUser.developerLevel}</span>
                    <span className="text-sm text-slate-400">{demoUser.developerXP} XP</span>
                  </div>
                  <Progress value={devXPProgress} className="h-2" />
                  <p className="text-xs text-slate-400 mt-1">
                    다음 레벨까지 {5000 - demoUser.developerXP} XP 필요
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Base 생태계 개발 척도
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-slate-100">
                <TrendingUp className="h-5 w-5 text-green-400" />
                활동 통계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">트랜잭션</span>
                  <span className="text-lg font-semibold text-slate-100">{demoUser.transactions}</span>
                </div>
                <Separator className="bg-slate-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">컨트랙트 배포</span>
                  <span className="text-lg font-semibold text-slate-100">{demoUser.contracts}</span>
                </div>
                <Separator className="bg-slate-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">CTF 해결</span>
                  <span className="text-lg font-semibold text-slate-100">{demoUser.ctfSolved}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">활동 캘린더</TabsTrigger>
            <TabsTrigger value="timeline">타임라인</TabsTrigger>
            <TabsTrigger value="badges">NFT 배지</TabsTrigger>
            <TabsTrigger value="stats">상세 통계</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Calendar className="h-5 w-5" />
                  활동 캘린더
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityCalendar
                  activities={demoActivities}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Clock className="h-5 w-5" />
                  활동 타임라인
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline events={demoTimeline} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <NFTBadges badges={demoBadges} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-base text-slate-100">Base 체인 활동</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">총 트랜잭션 수</span>
                    <span className="text-lg font-semibold text-slate-100">{demoUser.transactions}</span>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">배포한 컨트랙트</span>
                    <span className="text-lg font-semibold text-slate-100">{demoUser.contracts}</span>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">총 가스 사용량</span>
                    <span className="text-lg font-semibold text-slate-100">0.42 ETH</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-base text-slate-100">보안 & 개발</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">CTF 문제 해결</span>
                    <span className="text-lg font-semibold text-slate-100">{demoUser.ctfSolved}</span>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">취약점 제보</span>
                    <span className="text-lg font-semibold text-slate-100">3</span>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">보안 뉴스 작성</span>
                    <span className="text-lg font-semibold text-slate-100">7</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

