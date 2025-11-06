"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  File,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";

// Demo posts (게시판과 동일)
const demoPosts = [
  {
    id: 1,
    title: "Base 생태계 완전 정복 가이드",
    author: "base-master",
    date: "2025-01-20",
    likes: 156,
    dislikes: 3,
    comments: 42,
    views: 1234,
    tags: ["가이드", "튜토리얼"],
    contractAddress: "0x1234567890123456789012345678901234567890",
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
  },
  {
    id: 2,
    title: "Frame 기반 미니게임 런칭기",
    author: "degen-builder",
    date: "2025-01-19",
    likes: 42,
    dislikes: 1,
    comments: 12,
    views: 234,
    tags: ["게임", "Frame"],
    contractAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    content: `# Frame 기반 미니게임 런칭기

Frame을 활용한 미니게임을 개발하고 런칭한 경험을 공유합니다.`,
  },
  {
    id: 3,
    title: "ERC-1155 인벤토리 설계 팁",
    author: "solidity-cat",
    date: "2025-01-18",
    likes: 31,
    dislikes: 0,
    comments: 8,
    views: 189,
    tags: ["개발", "ERC-1155"],
    contractAddress: "0x9876543210987654321098765432109876543210",
    content: `# ERC-1155 인벤토리 설계 팁

ERC-1155를 활용한 게임 인벤토리 시스템 설계 방법을 소개합니다.`,
  },
  {
    id: 4,
    title: "Base 가스 최적화 실험 결과 공유",
    author: "rollup-nerd",
    date: "2025-01-17",
    likes: 27,
    dislikes: 2,
    comments: 15,
    views: 312,
    tags: ["최적화", "가스"],
    contractAddress: "0xfedcba0987654321fedcba0987654321fedcba09",
    content: `# Base 가스 최적화 실험 결과 공유

Base 네트워크에서 가스비를 최적화한 실험 결과를 공유합니다.`,
  },
];

interface Post {
  id: number;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  author: string;
  authorAddress?: string;
  donationAddress?: string;
  date: string;
  likes: number;
  dislikes: number;
  comments: number;
  views: number;
  contractAddress: string;
  files?: Array<{
    id: string;
    name: string;
    type: string;
    data: string;
    size?: number;
  }>;
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // 게시물 데이터 로드
  useEffect(() => {
    const loadPost = () => {
      const postId = parseInt(params.id);
      if (isNaN(postId)) {
        router.push("/board/free");
        return;
      }

      // localStorage에서 게시물 찾기
      const savedPosts = localStorage.getItem("board_posts");
      let foundPost: Post | null = null;

      if (savedPosts) {
        const parsed = JSON.parse(savedPosts);
        foundPost = parsed.find((p: Post) => p.id === postId);
      }

      // localStorage에서 못 찾으면 demoPosts에서 찾기
      if (!foundPost) {
        foundPost = demoPosts.find((p) => p.id === postId) as Post | null;
      }

      if (!foundPost) {
        router.push("/board/free");
        return;
      }

      // 조회수 증가
      const viewKey = `post_${postId}_viewed`;
      const hasViewed = sessionStorage.getItem(viewKey);
      if (!hasViewed) {
        foundPost.views += 1;
        sessionStorage.setItem(viewKey, "true");
        
        // localStorage에 저장된 게시물이면 조회수 업데이트
        if (savedPosts) {
          const parsed = JSON.parse(savedPosts);
          const index = parsed.findIndex((p: Post) => p.id === postId);
          if (index !== -1) {
            parsed[index].views = foundPost.views;
            localStorage.setItem("board_posts", JSON.stringify(parsed));
          }
        }
      }

      setPost(foundPost);
      setLikes(foundPost.likes);
      setDislikes(foundPost.dislikes);
      setViews(foundPost.views);
      setComments(foundPost.comments);

      // 사용자 투표 상태 불러오기
      const voteKey = `post_${postId}_vote`;
      const savedVote = localStorage.getItem(voteKey);
      if (savedVote === "up" || savedVote === "down") {
        setUserVote(savedVote);
      }

      setLoading(false);
    };

    loadPost();
  }, [params.id, router]);

  const handleVote = (voteType: "up" | "down") => {
    if (!post) return;

    const postId = post.id;
    let newLikes = likes;
    let newDislikes = dislikes;
    let newVote: "up" | "down" | null = voteType;

    if (userVote === voteType) {
      // 이미 같은 투표를 했으면 취소
      newVote = null;
      if (voteType === "up") newLikes--;
      else newDislikes--;
    } else {
      // 다른 투표를 했으면 변경
      if (userVote === "up") newLikes--;
      if (userVote === "down") newDislikes--;
      if (voteType === "up") newLikes++;
      else newDislikes++;
    }

    setUserVote(newVote);
    setLikes(newLikes);
    setDislikes(newDislikes);

    // localStorage에 투표 저장
    const voteKey = `post_${postId}_vote`;
    if (newVote) {
      localStorage.setItem(voteKey, newVote);
    } else {
      localStorage.removeItem(voteKey);
    }

    // 게시물 데이터 업데이트
    const savedPosts = localStorage.getItem("board_posts");
    if (savedPosts) {
      const parsed = JSON.parse(savedPosts);
      const index = parsed.findIndex((p: Post) => p.id === postId);
      if (index !== -1) {
        parsed[index].likes = newLikes;
        parsed[index].dislikes = newDislikes;
        localStorage.setItem("board_posts", JSON.stringify(parsed));
      }
    }

    // post 상태도 업데이트
    setPost({ ...post, likes: newLikes, dislikes: newDislikes });
  };

  const copyAddress = () => {
    if (!post) return;
    navigator.clipboard.writeText(post.contractAddress || post.donationAddress || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 마크다운 렌더링
  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLang = "";

    lines.forEach((line, idx) => {
      // 코드 블록 처리
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // 코드 블록 종료
          elements.push(
            <pre key={`code-${idx}`} className="bg-slate-800 p-4 rounded-lg border border-slate-700 overflow-x-auto my-4">
              <code className="text-sm text-slate-300 font-mono whitespace-pre">
                {codeBlockContent.join("\n")}
              </code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          // 코드 블록 시작
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`p-${idx}`} className="text-lg leading-relaxed text-slate-300 mb-4">
                {currentParagraph.join(" ")}
              </p>
            );
            currentParagraph = [];
          }
          codeBlockLang = line.replace("```", "").trim();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // 헤더 처리
      if (line.startsWith("# ")) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${idx}`} className="text-lg leading-relaxed text-slate-300 mb-4">
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h1 key={`h1-${idx}`} className="text-3xl font-bold text-slate-100 mt-8 mb-4">
            {line.replace("# ", "")}
          </h1>
        );
        return;
      }

      if (line.startsWith("## ")) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${idx}`} className="text-lg leading-relaxed text-slate-300 mb-4">
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h2 key={`h2-${idx}`} className="text-2xl font-bold text-slate-100 mt-6 mb-3">
            {line.replace("## ", "")}
          </h2>
        );
        return;
      }

      if (line.startsWith("### ")) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${idx}`} className="text-lg leading-relaxed text-slate-300 mb-4">
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h3 key={`h3-${idx}`} className="text-xl font-semibold text-slate-100 mt-4 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
        return;
      }

      // 리스트 처리
      if (line.startsWith("- ") || line.startsWith("* ")) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${idx}`} className="text-lg leading-relaxed text-slate-300 mb-4">
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        const listItems: string[] = [];
        let listIdx = idx;
        while (listIdx < lines.length && (lines[listIdx].startsWith("- ") || lines[listIdx].startsWith("* "))) {
          listItems.push(lines[listIdx].replace(/^[-*] /, ""));
          listIdx++;
        }
        elements.push(
          <ul key={`ul-${idx}`} className="list-disc list-inside space-y-2 ml-4 mb-4">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx} className="text-slate-300">
                {item}
              </li>
            ))}
          </ul>
        );
        return;
      }

      // 이미지 처리
      if (line.match(/!\[.*?\]\((.*?)\)/)) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${idx}`} className="text-lg leading-relaxed text-slate-300 mb-4">
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        const match = line.match(/!\[.*?\]\((.*?)\)/);
        if (match) {
          elements.push(
            <img
              key={`img-${idx}`}
              src={match[1]}
              alt=""
              className="max-w-full h-auto rounded-lg my-4"
            />
          );
        }
        return;
      }

      // 빈 줄 처리
      if (line.trim() === "") {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${idx}`} className="text-lg leading-relaxed text-slate-300 mb-4">
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        return;
      }

      currentParagraph.push(line);
    });

    // 남은 문단 처리
    if (currentParagraph.length > 0) {
      elements.push(
        <p key="p-final" className="text-lg leading-relaxed text-slate-300 mb-4">
          {currentParagraph.join(" ")}
        </p>
      );
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-400">로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const authorAvatar = post.author.charAt(0).toUpperCase();
  const readTime = Math.ceil(post.content.split(" ").length / 200); // 대략적인 읽기 시간 계산
  const donationAddress = post.donationAddress || post.contractAddress;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <Header
        showBackButton={true}
        backHref="/board/free"
        rightContent={
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
        }
      />

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Article Header - Medium Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="mb-6">
            {likes > 50 && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-xs rounded-lg mb-4">
                <span className="mr-1">🔥</span> 인기 게시글
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 leading-tight">
              {post.title}
            </h1>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
              <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-300">
                {authorAvatar}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-200">@{post.author}</span>
                {post.authorAddress && (
                  <span className="text-xs text-slate-500 font-mono">
                    ({post.authorAddress.slice(0, 6)}...{post.authorAddress.slice(-4)})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  약 {readTime}분 읽기
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-8 flex-wrap">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-slate-700 text-slate-300 rounded-lg px-3 py-1">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

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
            {renderMarkdown(post.content)}
          </div>

          {/* 첨부 파일 표시 */}
          {post.files && post.files.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-700">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">첨부 파일</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.files.map((file) => (
                  <div
                    key={file.id}
                    className="border border-slate-700 rounded-lg p-4 bg-slate-800/50"
                  >
                    {file.type === "image" ? (
                      <div className="space-y-2">
                        <img
                          src={file.data}
                          alt={file.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <p className="text-sm text-slate-300 truncate">{file.name}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <File className="h-8 w-8 text-slate-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-200 truncate">{file.name}</p>
                          {file.size && (
                            <p className="text-xs text-slate-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = file.data;
                            link.download = file.name;
                            link.click();
                          }}
                        >
                          다운로드
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
                    {donationAddress.slice(0, 6)}...{donationAddress.slice(-4)}
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
                  <span className="text-sm">{comments}개 댓글</span>
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <span className="text-sm">{views.toLocaleString()}회 조회</span>
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
              <h3 className="text-xl font-semibold text-slate-100 mb-4">댓글 {comments}개</h3>
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

