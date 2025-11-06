"use client"

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  MessageSquare,
  Heart,
  Eye,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Wallet,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
    userVote: null as "up" | "down" | null,
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
    userVote: null,
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
    userVote: null,
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
    userVote: null,
  },
];

export default function FreeBoardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(demoPosts);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleVote = (postId: number, voteType: "up" | "down") => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const currentVote = post.userVote;
          let newLikes = post.likes;
          let newDislikes = post.dislikes;
          let newVote: "up" | "down" | null = voteType;

          // 이미 같은 투표를 했으면 취소
          if (currentVote === voteType) {
            newVote = null;
            if (voteType === "up") newLikes--;
            else newDislikes--;
          } else {
            // 다른 투표를 했으면 변경
            if (currentVote === "up") newLikes--;
            if (currentVote === "down") newDislikes--;
            if (voteType === "up") newLikes++;
            else newDislikes++;
          }

          return { ...post, likes: newLikes, dislikes: newDislikes, userVote: newVote };
        }
        return post;
      })
    );
  };

  const copyAddress = (address: string, postId: number) => {
    navigator.clipboard.writeText(address);
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-slate-300">
            <ArrowLeft className="h-5 w-5" />
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white grid place-items-center text-sm font-bold">B</div>
            <div className="font-semibold tracking-tight text-slate-100">Base Camp</div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/board/free/write">
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl">
                <Plus className="h-4 w-4" /> 게시글 작성
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card className="border border-slate-700 bg-slate-800/50 backdrop-blur shadow-xl">
            <CardContent className="p-4">
              <h1 className="text-2xl font-bold mb-1 text-slate-100">자유게시판</h1>
              <p className="text-slate-400 text-sm">Base 생태계에 대한 모든 것을 자유롭게 이야기해보세요</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Card className="border border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="p-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 text-slate-400" />
                  <Input
                    placeholder="게시글 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-slate-700 bg-slate-900/50 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2 border-slate-700 hover:bg-slate-700 rounded-xl">
                    <Filter className="h-4 w-4" /> 필터
                  </Button>
                  <Button variant="outline" className="gap-2 border-slate-700 hover:bg-slate-700 rounded-xl">
                    <TrendingUp className="h-4 w-4" /> 인기순
                  </Button>
                  <Button variant="outline" className="gap-2 border-slate-700 hover:bg-slate-700 rounded-xl">
                    <Clock className="h-4 w-4" /> 최신순
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Posts List - 더 컴팩트하게 */}
        <div className="space-y-2">
          {posts.map((post, index) => (
            <Link key={post.id} href={`/board/free/${post.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500 border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Vote Buttons */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-lg ${
                          post.userVote === "up"
                            ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            : "hover:bg-slate-700"
                        }`}
                        onClick={() => handleVote(post.id, "up")}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-semibold text-slate-300 min-w-[2rem] text-center">
                        {post.likes - post.dislikes}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-lg ${
                          post.userVote === "down"
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            : "hover:bg-slate-700"
                        }`}
                        onClick={() => handleVote(post.id, "down")}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Author Avatar */}
                    <div className="flex-shrink-0 pt-1">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                        <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                          {post.author.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base font-semibold hover:text-blue-400 transition-colors text-slate-100">
                              {post.title}
                            </h3>
                            {index === 0 && (
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-xs rounded-lg">
                                <TrendingUp className="h-3 w-3 mr-1" /> 인기
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                            <span>by @{post.author}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                          </div>
                        </div>

                        {/* Contract Address - 오른쪽에 작게 */}
                        <div className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 bg-slate-900/50 rounded-lg border border-slate-700">
                          <Wallet className="h-3 w-3 text-slate-500" />
                          <span className="text-xs font-mono text-slate-400 max-w-[120px] truncate">
                            {post.contractAddress.slice(0, 6)}...{post.contractAddress.slice(-4)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 hover:bg-slate-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyAddress(post.contractAddress, post.id);
                            }}
                          >
                            {copiedId === post.id ? (
                              <Check className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3 text-slate-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Stats & Tags */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> {post.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {post.views}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-slate-700 text-slate-300 rounded-lg">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-700 rounded-xl">이전</Button>
            <Button variant="default" size="sm" className="rounded-xl">1</Button>
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-700 rounded-xl">2</Button>
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-700 rounded-xl">3</Button>
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-700 rounded-xl">다음</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
