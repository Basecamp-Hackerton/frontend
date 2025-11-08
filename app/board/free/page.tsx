"use client"

import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
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
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BoardPost {
  id: number;
  title: string;
  author: string;
  date: string;
  likes: number;
  dislikes: number;
  comments: number;
  views: number;
  category?: string;
  tags?: string[];
  contractAddress?: string;
  donationAddress?: string;
  userVote?: "up" | "down" | null;
  authorAddress?: string;
  content?: string;
  files?: Array<{
    id: string;
    name: string;
    type: string;
    data: string;
    size?: number;
  }>;
}

const demoPosts: BoardPost[] = [
  {
    id: 1,
    title: "Base 생태계 완전 정복 가이드",
    author: "base-master",
    date: "2025-01-20",
    likes: 156,
    dislikes: 3,
    comments: 42,
    views: 1234,
    category: "가이드",
    tags: ["가이드", "튜토리얼"],
    contractAddress: "0x1234567890123456789012345678901234567890",
    donationAddress: "0x1234567890123456789012345678901234567890",
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
    category: "게임",
    tags: ["게임", "Frame"],
    contractAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    donationAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
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
    category: "개발",
    tags: ["개발", "ERC-1155"],
    contractAddress: "0x9876543210987654321098765432109876543210",
    donationAddress: "0x9876543210987654321098765432109876543210",
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
    category: "기술",
    tags: ["최적화", "가스"],
    contractAddress: "0xfedcba0987654321fedcba0987654321fedcba09",
    donationAddress: "0xfedcba0987654321fedcba0987654321fedcba09",
    userVote: null,
  },
];

type SortOption = "latest" | "popular" | "views" | "comments";
type FilterOption = "all" | string;

export default function FreeBoardPage() {
  const { wallet, isConnected } = useWallet();
  const [searchQuery, setSearchQuery] = useState("");
  // 서버와 클라이언트에서 동일한 초기값 사용 (하이드레이션 오류 방지)
  const [allPosts, setAllPosts] = useState<BoardPost[]>(demoPosts);
  const [mounted, setMounted] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>("all");
  const [selectedTag, setSelectedTag] = useState<FilterOption>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null);
  const [donationAmount, setDonationAmount] = useState("0.01");
  const [isDonating, setIsDonating] = useState(false);
  const [donationFeedback, setDonationFeedback] = useState<{
    error?: string;
    message?: string;
    txHash?: string;
  }>({});

  const resetDonationState = () => {
    setDonationDialogOpen(false);
    setSelectedPost(null);
    setDonationAmount("0.01");
    setIsDonating(false);
    setDonationFeedback({});
  };

  const handleDonationDialogToggle = (open: boolean) => {
    if (!open) {
      resetDonationState();
    } else {
      setDonationDialogOpen(true);
    }
  };

  const handleOpenDonation = (
    event: React.MouseEvent,
    post: BoardPost
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const donationAddress = post.donationAddress || post.contractAddress;
    if (!donationAddress) {
      setDonationFeedback({
        error: "후원 주소가 제공되지 않은 게시글입니다.",
      });
      setSelectedPost(post);
      setDonationDialogOpen(true);
      return;
    }
    setSelectedPost(post);
    setDonationAmount("0.01");
    setDonationFeedback({});
    setDonationDialogOpen(true);
  };

  const handleDonate = async () => {
    if (!selectedPost) return;
    const donationAddress =
      selectedPost.donationAddress || selectedPost.contractAddress;

    if (!donationAddress) {
      setDonationFeedback({
        error: "후원 주소가 제공되지 않았습니다.",
      });
      return;
    }

    if (!wallet?.signer) {
      setDonationFeedback({
        error: "후원하려면 먼저 지갑을 연결해주세요.",
      });
      return;
    }

    let value: bigint;
    try {
      const parsedAmount = donationAmount.trim();
      if (!parsedAmount) {
        throw new Error("금액을 입력해주세요.");
      }
      value = ethers.parseEther(parsedAmount);
      if (value <= BigInt(0)) {
        throw new Error("0보다 큰 금액을 입력해주세요.");
      }
    } catch (error: any) {
      setDonationFeedback({
        error:
          error?.message ||
          "올바른 ETH 금액을 입력했는지 확인해주세요.",
      });
      return;
    }

    setIsDonating(true);
    setDonationFeedback({});

    try {
      const tx = await wallet.signer.sendTransaction({
        to: donationAddress,
        value,
      });

      setDonationFeedback({
        message: "후원이 전송되었습니다. 트랜잭션 완료를 기다려주세요.",
        txHash: tx.hash,
      });

      await tx.wait();

      setDonationFeedback({
        message: "후원이 성공적으로 완료되었습니다!",
        txHash: tx.hash,
      });
    } catch (error: any) {
      console.error("Donation failed:", error);
      setDonationFeedback({
        error:
          error?.reason ||
          error?.message ||
          "후원 트랜잭션이 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsDonating(false);
    }
  };

  // 모든 태그 추출 (필터링용)
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag: string) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [allPosts]);

  // 모든 카테고리 추출 (필터링용)
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    allPosts.forEach((post) => {
      if (post.category) {
        categories.add(post.category);
      }
    });
    return Array.from(categories).sort();
  }, [allPosts]);

  // 클라이언트에서만 실행 (하이드레이션 오류 방지)
  useEffect(() => {
    setMounted(true);
    
    const loadPosts = () => {
      const savedPosts = localStorage.getItem("board_posts");
      let loadedPosts: BoardPost[] = [...demoPosts];

      if (savedPosts) {
        const parsed: BoardPost[] = JSON.parse(savedPosts);
        loadedPosts = [...parsed, ...demoPosts];
      }

      // 각 게시물의 투표 상태 불러오기
      loadedPosts = loadedPosts.map((post) => {
        const voteKey = `post_${post.id}_vote`;
        const savedVote = localStorage.getItem(voteKey);
        return {
          ...post,
          userVote: (savedVote === "up" || savedVote === "down" ? savedVote : null) as "up" | "down" | null,
        };
      });

      setAllPosts(loadedPosts);
    };

    // 초기 로드 시에도 확인
    loadPosts();

    const handleFocus = () => {
      loadPosts();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // 필터링 및 정렬된 게시물
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...allPosts];

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const authorMatch = post.author.toLowerCase().includes(query);
        const tagMatch = post.tags?.some((tag: string) => tag.toLowerCase().includes(query));
        const contentMatch = (post as any).content?.toLowerCase().includes(query);
        return titleMatch || authorMatch || tagMatch || contentMatch;
      });
    }

    // 카테고리 필터
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // 태그 필터
    if (selectedTag !== "all") {
      filtered = filtered.filter((post) => post.tags?.includes(selectedTag));
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          const scoreA = a.likes - a.dislikes;
          const scoreB = b.likes - b.dislikes;
          return scoreB - scoreA;
        case "views":
          return b.views - a.views;
        case "comments":
          return b.comments - a.comments;
        case "latest":
        default:
          // 날짜 기준 정렬 (최신순)
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
      }
    });

    return filtered;
  }, [allPosts, searchQuery, selectedCategory, selectedTag, sortBy]);

  // 페이징
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(startIndex, endIndex);

  // 검색/필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedTag, sortBy]);

  const handleVote = (e: React.MouseEvent, postId: number, voteType: "up" | "down") => {
    e.preventDefault();
    e.stopPropagation();

    setAllPosts((prev) =>
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

          // localStorage에 투표 저장
          const voteKey = `post_${postId}_vote`;
          if (newVote) {
            localStorage.setItem(voteKey, newVote);
          } else {
            localStorage.removeItem(voteKey);
          }

          // localStorage에 저장된 게시물이면 업데이트
          const savedPosts = localStorage.getItem("board_posts");
          if (savedPosts) {
            const parsed = JSON.parse(savedPosts);
            const index = parsed.findIndex((p: any) => p.id === postId);
            if (index !== -1) {
              parsed[index].likes = newLikes;
              parsed[index].dislikes = newDislikes;
              localStorage.setItem("board_posts", JSON.stringify(parsed));
            }
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
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <Header
          showBackButton={true}
          backHref="/"
          rightContent={
            <Link href="/board/free/write">
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl">
                <Plus className="h-4 w-4" /> 게시글 작성
              </Button>
            </Link>
          }
        />

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
            className="mb-4 space-y-3"
          >
          {/* 검색 바 */}
          <Card className="border border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="p-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 text-slate-400" />
                  <Input
                    placeholder="제목, 내용, 작성자, 태그로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-slate-700 bg-slate-900/50 text-slate-100 placeholder:text-slate-500"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === "latest" ? "default" : "outline"}
                    className={`gap-2 border-slate-700 rounded-xl ${
                      sortBy === "latest"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "hover:bg-slate-700"
                    }`}
                    onClick={() => setSortBy("latest")}
                  >
                    <Clock className="h-4 w-4" /> 최신순
                  </Button>
                  <Button
                    variant={sortBy === "popular" ? "default" : "outline"}
                    className={`gap-2 border-slate-700 rounded-xl ${
                      sortBy === "popular"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "hover:bg-slate-700"
                    }`}
                    onClick={() => setSortBy("popular")}
                  >
                    <TrendingUp className="h-4 w-4" /> 인기순
                  </Button>
                  <Button
                    variant={sortBy === "views" ? "default" : "outline"}
                    className={`gap-2 border-slate-700 rounded-xl ${
                      sortBy === "views"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "hover:bg-slate-700"
                    }`}
                    onClick={() => setSortBy("views")}
                  >
                    <Eye className="h-4 w-4" /> 조회수
                  </Button>
                  <Button
                    variant={sortBy === "comments" ? "default" : "outline"}
                    className={`gap-2 border-slate-700 rounded-xl ${
                      sortBy === "comments"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "hover:bg-slate-700"
                    }`}
                    onClick={() => setSortBy("comments")}
                  >
                    <MessageSquare className="h-4 w-4" /> 댓글수
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 필터 바 */}
          <Card className="border border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="p-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">필터:</span>
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  {/* 카테고리 필터 */}
                  {allCategories.length > 0 && (
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px] h-9 border-slate-700 bg-slate-900/50 text-slate-100">
                        <SelectValue placeholder="카테고리" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all" className="text-slate-100">
                          전체 카테고리
                        </SelectItem>
                        {allCategories.map((category) => (
                          <SelectItem key={category} value={category} className="text-slate-100">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* 태그 필터 */}
                  {allTags.length > 0 && (
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="w-[180px] h-9 border-slate-700 bg-slate-900/50 text-slate-100">
                        <SelectValue placeholder="태그" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all" className="text-slate-100">
                          전체 태그
                        </SelectItem>
                        {allTags.map((tag) => (
                          <SelectItem key={tag} value={tag} className="text-slate-100">
                            #{tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* 필터 초기화 */}
                  {(selectedCategory !== "all" || selectedTag !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-slate-700 hover:bg-slate-700"
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedTag("all");
                      }}
                    >
                      <X className="h-3 w-3" /> 필터 초기화
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 검색 결과 정보 */}
          {(searchQuery || selectedCategory !== "all" || selectedTag !== "all") && (
            <div className="text-sm text-slate-400 px-1">
              검색 결과: <span className="text-slate-200 font-semibold">{filteredAndSortedPosts.length}</span>개의 게시물
            </div>
          )}
        </motion.div>

        {/* Posts List - 더 컴팩트하게 */}
        <div className="space-y-2">
          {currentPosts.length === 0 ? (
            <Card className="border border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-slate-500 opacity-50" />
                <p className="text-slate-400 text-lg">검색 결과가 없습니다.</p>
                <p className="text-slate-500 text-sm mt-2">
                  다른 검색어나 필터를 시도해보세요.
                </p>
              </CardContent>
            </Card>
          ) : (
            currentPosts.map((post, index) => (
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
                            onClick={(e) => handleVote(e, post.id, "up")}
                            suppressHydrationWarning
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-semibold text-slate-300 min-w-[2rem] text-center" suppressHydrationWarning>
                            {mounted ? post.likes - post.dislikes : 0}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-lg ${
                              post.userVote === "down"
                                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                : "hover:bg-slate-700"
                            }`}
                            onClick={(e) => handleVote(e, post.id, "down")}
                            suppressHydrationWarning
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
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1" suppressHydrationWarning>
                                <MessageSquare className="h-3 w-3" /> {post.comments}
                              </span>
                              <span className="flex items-center gap-1" suppressHydrationWarning>
                                <Eye className="h-3 w-3" /> {post.views}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {post.tags?.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs bg-slate-700 text-slate-300 rounded-lg">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-base font-semibold hover:text-blue-400 transition-colors text-slate-100">
                                  {post.title}
                                </h3>
                                {(post.likes - post.dislikes) > 50 && (
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
                                {(post.contractAddress || (post as any).donationAddress || "").slice(0, 6)}...{(post.contractAddress || (post as any).donationAddress || "").slice(-4)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 hover:bg-slate-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyAddress(post.contractAddress || (post as any).donationAddress || "", post.id);
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

                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs text-slate-500 font-mono truncate max-w-[60%]">
                              {(post.donationAddress || post.contractAddress)
                                ? `후원 계좌: ${(post.donationAddress || post.contractAddress)!.slice(0, 6)}...${(post.donationAddress || post.contractAddress)!.slice(-4)}`
                                : "후원 계좌가 등록되지 않았습니다."}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 border-emerald-400 text-emerald-300 hover:bg-emerald-500/20 rounded-xl"
                              onClick={(event) => handleOpenDonation(event, post)}
                              disabled={!post.donationAddress && !post.contractAddress}
                            >
                              <Heart className="h-3 w-3" />
                              후원하기
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))
          )}
        </div>

        {/* 페이징 */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <Button
              variant="outline"
              size="icon"
              className="border-slate-700 hover:bg-slate-700"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className={`min-w-[2.5rem] border-slate-700 ${
                      currentPage === pageNum
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "hover:bg-slate-700"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="border-slate-700 hover:bg-slate-700"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <span className="text-sm text-slate-400 ml-4">
              {startIndex + 1}-{Math.min(endIndex, filteredAndSortedPosts.length)} / {filteredAndSortedPosts.length}
            </span>
          </motion.div>
        )}
        </div>
      </div>

      <Dialog open={donationDialogOpen} onOpenChange={handleDonationDialogToggle}>
        <DialogContent className="bg-slate-900 border border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>후원하기</DialogTitle>
            <DialogDescription className="text-slate-400">
              선택한 게시글 작성자에게 ETH로 후원할 수 있어요. 트랜잭션 수수료가 발생할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          {selectedPost ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-slate-100">{selectedPost.title}</span> 작성자에게 후원합니다.
                </p>
                <p className="mt-2 text-xs font-mono text-slate-500 break-all">
                  {selectedPost.donationAddress || selectedPost.contractAddress}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-200">후원 금액 (ETH)</p>
                <Input
                  value={donationAmount}
                  onChange={(event) => setDonationAmount(event.target.value)}
                  placeholder="0.01"
                  className="bg-slate-950 border-slate-700 text-slate-100"
                  disabled={isDonating}
                />
                <div className="flex items-center gap-2">
                  {["0.01", "0.05", "0.1"].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-slate-700 hover:bg-slate-800"
                      onClick={() => setDonationAmount(amount)}
                      disabled={isDonating}
                    >
                      {amount} ETH
                    </Button>
                  ))}
                </div>
              </div>

              {!isConnected && (
                <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                  후원하려면 먼저 지갑을 연결해주세요.
                </div>
              )}

              {donationFeedback.error && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {donationFeedback.error}
                </div>
              )}

              {donationFeedback.message && (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 space-y-1">
                  <p>{donationFeedback.message}</p>
                  {donationFeedback.txHash && (
                    <p className="break-all font-mono text-xs text-emerald-300">
                      Tx Hash: {donationFeedback.txHash}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">게시글 정보를 불러오는 중입니다...</p>
          )}

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              className="border-slate-700 hover:bg-slate-800"
              onClick={resetDonationState}
              disabled={isDonating}
            >
              취소
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={handleDonate}
              disabled={isDonating || !selectedPost || !isConnected}
            >
              {isDonating ? "후원 전송 중..." : "후원 보내기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
