"use client"

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  Code,
  Send,
  X,
  Sparkles,
  Wallet,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: "free", label: "자유게시판" },
  { value: "finance-prediction", label: "금융 정보 > 예측" },
  { value: "finance-airdrop", label: "금융 정보 > 에어드랍" },
  { value: "finance-showoff", label: "금융 정보 > 자랑글" },
  { value: "game-guide", label: "게임 > 공략" },
  { value: "game-item", label: "게임 > 아이템" },
  { value: "game-free", label: "게임 > 자유" },
  { value: "build", label: "빌드" },
  { value: "security-vulnerability", label: "보안 > 취약점 제보" },
  { value: "security-news", label: "보안 > 보안 뉴스" },
];

export default function WritePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [contractAddress, setContractAddress] = useState("0x" + "0".repeat(40));
  const [copied, setCopied] = useState(false);

  // 게시글 작성 시 컨트랙트 주소 생성 (실제로는 스마트 컨트랙트 배포)
  React.useEffect(() => {
    // 데모용 랜덤 주소 생성
    const randomAddr = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setContractAddress(randomAddr);
  }, []);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    // 게시글 작성 로직
    console.log({ title, content, category, tags, contractAddress });
    // 실제로는 API 호출
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/board/free" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-slate-300">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">자유게시판</span>
          </Link>
          <Badge variant="secondary">베타</Badge>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title Card */}
          <Card className="mb-6 shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-slate-100">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                게시글 작성
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  카테고리 <span className="text-red-400">*</span>
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 border-slate-700 bg-slate-900/50 text-slate-100">
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-slate-100">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title Input */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  제목 <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="게시글 제목을 입력하세요..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg h-12 border-slate-700 bg-slate-900/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              {/* Tags & Contract Address (나란히 배치) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tags */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    태그
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 px-3 py-1 bg-slate-700 text-slate-200"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="태그 입력 후 Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        className="w-40 h-8 text-sm border-slate-700 bg-slate-900/50 text-slate-100"
                      />
                      <Button
                        onClick={addTag}
                        size="sm"
                        variant="outline"
                        className="h-8 border-slate-700"
                      >
                        추가
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Contract Address (후원 계좌) */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    후원 계좌 (컨트랙트 주소)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={contractAddress}
                      readOnly
                      className="font-mono text-sm border-slate-700 bg-slate-900/50 text-slate-300"
                    />
                    <Button
                      onClick={copyAddress}
                      variant="outline"
                      size="icon"
                      className="border-slate-700 hover:bg-slate-700"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    게시글 작성 시 자동으로 생성되는 고유 컨트랙트 주소입니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card className="mb-6 shadow-xl border border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader className="border-b border-slate-700 bg-slate-900/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-100">내용</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700">
                    <Code className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Textarea
                placeholder="게시글 내용을 작성하세요...&#10;&#10;마크다운 문법을 지원합니다."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] border-0 resize-none focus:ring-0 text-base leading-relaxed p-6 bg-slate-900/30 text-slate-100 placeholder:text-slate-500"
              />
            </CardContent>
          </Card>

          {/* Preview & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Sparkles className="h-4 w-4" />
              <span>첫 게시글 작성 시 NFT 배지를 획득할 수 있습니다!</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/board/free">
                <Button variant="outline" className="border-slate-700">취소</Button>
              </Link>
              <Button
                onClick={handleSubmit}
                disabled={!title.trim() || !content.trim() || !category}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 gap-2 px-6 rounded-xl"
              >
                <Send className="h-4 w-4" />
                게시하기
              </Button>
            </div>
          </div>

          {/* Tips */}
          <Card className="mt-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 text-slate-200">💡 작성 팁</h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• 명확하고 구체적인 제목을 사용하세요</li>
                <li>• 관련 태그를 추가하면 더 많은 사람들이 찾을 수 있습니다</li>
                <li>• 코드는 코드 블록을 사용하여 작성하세요</li>
                <li>• 좋은 게시글은 추천을 받아 XP를 획득할 수 있습니다</li>
                <li>• 후원 계좌로 Base 토큰을 받을 수 있습니다</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
