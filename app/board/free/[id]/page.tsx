"use client"

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  Share2,
  Bookmark,
  Wallet,
  Copy,
  Check,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Demo post data
const demoPost = {
  id: 1,
  title: "Base 생태계 완전 정복 가이드",
  author: "base-master",
  authorAvatar: "B",
  date: "2025-01-20",
  readTime: "8분",
  content: `# Base 생태계 완전 정복 가이드

Base는 Coinbase가 개발한 Ethereum Layer 2 솔루션으로, 낮은 가스비와 빠른 트랜잭션 속도를 제공합니다. 이 가이드는 Base 생태계를 완전히 이해하고 활용하는 방법을 단계별로 안내합니다.

## 1. Base란 무엇인가?

Base는 Optimism의 OP Stack을 기반으로 구축된 Layer 2 네트워크입니다. 주요 특징은 다음과 같습니다:

- **낮은 가스비**: Ethereum 메인넷 대비 최대 10배 저렴한 거래 수수료
- **빠른 속도**: 평균 2초 이내의 블록 생성 시간
- **EVM 호환성**: 기존 Ethereum 도구와 완벽 호환
- **안전성**: Ethereum 메인넷의 보안을 상속

## 2. Base 시작하기

### 지갑 설정

Base 네트워크를 MetaMask에 추가하려면:

1. MetaMask 설정 열기
2. 네트워크 추가 클릭
3. 다음 정보 입력:
   - Network Name: Base
   - RPC URL: https://mainnet.base.org
   - Chain ID: 8453
   - Currency Symbol: ETH

### 테스트넷 사용하기

개발 및 테스트를 위해 Base Sepolia 테스트넷을 사용할 수 있습니다:

\`\`\`javascript
const baseSepolia = {
  chainId: '0x14a34',
  chainName: 'Base Sepolia',
  rpcUrls: ['https://sepolia.base.org'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  }
};
\`\`\`

## 3. 주요 DApp 탐색

Base 생태계에는 다양한 DeFi, NFT, 게임 프로토콜이 있습니다:

- **Uniswap**: 탈중앙화 거래소
- **Aave**: 대출 및 차입 프로토콜
- **Friend.tech**: 소셜 토큰 플랫폼
- **Base Name Service**: 도메인 서비스

## 4. 개발자 리소스

Base에서 개발을 시작하려면:

1. [Base 문서](https://docs.base.org) 확인
2. Hardhat 또는 Foundry 설정
3. Base 테스트넷에서 배포 테스트
4. 메인넷으로 마이그레이션

## 결론

Base는 Ethereum 생태계의 확장성을 크게 향상시키는 강력한 Layer 2 솔루션입니다. 낮은 비용과 빠른 속도로 Web3 애플리케이션을 구축하고 사용할 수 있는 최적의 환경을 제공합니다.

더 많은 정보는 [Base 공식 웹사이트](https://base.org)에서 확인하세요.`,
  tags: ["가이드", "튜토리얼", "Base", "Layer2"],
  likes: 156,
  dislikes: 3,
  comments: 42,
  views: 1234,
  contractAddress: "0x1234567890123456789012345678901234567890",
  isPopular: true,
};

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [likes, setLikes] = useState(demoPost.likes);
  const [dislikes, setDislikes] = useState(demoPost.dislikes);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleVote = (voteType: "up" | "down") => {
    if (userVote === voteType) {
      // 이미 같은 투표를 했으면 취소
      setUserVote(null);
      if (voteType === "up") setLikes(likes - 1);
      else setDislikes(dislikes - 1);
    } else {
      // 다른 투표를 했으면 변경
      if (userVote === "up") setLikes(likes - 1);
      if (userVote === "down") setDislikes(dislikes - 1);
      setUserVote(voteType);
      if (voteType === "up") setLikes(likes + 1);
      else setDislikes(dislikes + 1);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(demoPost.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/board/free" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-slate-300">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">자유게시판</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-xl ${bookmarked ? "text-yellow-400" : ""}`}
              onClick={() => setBookmarked(!bookmarked)}
            >
              <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Article Header - Medium Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="mb-6">
            {demoPost.isPopular && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-xs rounded-lg mb-4">
                <span className="mr-1">🔥</span> 인기 게시글
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 leading-tight">
              {demoPost.title}
            </h1>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
              <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-300">
                {demoPost.authorAvatar}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-200">@{demoPost.author}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {demoPost.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {demoPost.readTime} 읽기
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {demoPost.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-slate-700 text-slate-300 rounded-lg px-3 py-1">
                #{tag}
              </Badge>
            ))}
          </div>

          <Separator className="bg-slate-700 mb-8" />
        </motion.div>

        {/* Article Content - Medium Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="prose prose-invert prose-lg max-w-none mb-12"
        >
          <div className="text-slate-200 leading-relaxed space-y-6">
            {demoPost.content.split("\n\n").map((paragraph, idx) => {
              // Markdown 간단 파싱
              if (paragraph.startsWith("# ")) {
                return (
                  <h1 key={idx} className="text-3xl font-bold text-slate-100 mt-8 mb-4">
                    {paragraph.replace("# ", "")}
                  </h1>
                );
              }
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={idx} className="text-2xl font-bold text-slate-100 mt-6 mb-3">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-xl font-semibold text-slate-100 mt-4 mb-2">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").filter((line) => line.startsWith("- "));
                return (
                  <ul key={idx} className="list-disc list-inside space-y-2 ml-4">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-slate-300">
                        {item.replace("- ", "")}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.includes("```")) {
                const codeMatch = paragraph.match(/```(\w+)?\n([\s\S]*?)```/);
                if (codeMatch) {
                  return (
                    <pre key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700 overflow-x-auto">
                      <code className="text-sm text-slate-300 font-mono">{codeMatch[2]}</code>
                    </pre>
                  );
                }
              }
              return (
                <p key={idx} className="text-lg leading-relaxed text-slate-300">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </motion.div>

        {/* Donation Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">후원 계좌</p>
                    <p className="text-xs text-slate-400">Base 토큰으로 후원받을 수 있습니다</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-300">
                    {demoPost.contractAddress.slice(0, 6)}...{demoPost.contractAddress.slice(-4)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={copyAddress}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Engagement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-12"
        >
          <Separator className="bg-slate-700 mb-6" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Vote Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 rounded-xl ${
                    userVote === "up"
                      ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      : "hover:bg-slate-700"
                  }`}
                  onClick={() => handleVote("up")}
                >
                  <ThumbsUp className="h-5 w-5" />
                </Button>
                <span className="text-lg font-semibold text-slate-300 min-w-[3rem] text-center">
                  {likes - dislikes}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 rounded-xl ${
                    userVote === "down"
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "hover:bg-slate-700"
                  }`}
                  onClick={() => handleVote("down")}
                >
                  <ThumbsDown className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-6 text-slate-400">
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm">{demoPost.comments}개 댓글</span>
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <span className="text-sm">{demoPost.views.toLocaleString()}회 조회</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comments Section Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">댓글 {demoPost.comments}개</h3>
              <div className="text-center py-12 text-slate-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>댓글 기능은 곧 추가될 예정입니다.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

