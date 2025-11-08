"use client"

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Upload,
  File,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  claimFirstPostBadge,
  getBadgeAddressForNetwork,
  hasFirstPostBadge,
} from "@/lib/badgesContract";

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

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: "image" | "file";
}

export default function WritePostPage() {
  const router = useRouter();
  const { wallet } = useWallet();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [donationAddress, setDonationAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 지갑 주소를 후원 계좌로 자동 설정
  useEffect(() => {
    if (wallet?.address) {
      setDonationAddress(wallet.address);
    }
  }, [wallet]);

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
    navigator.clipboard.writeText(donationAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const id = Math.random().toString(36).substring(7);
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedFiles((prev) => [
            ...prev,
            {
              id,
              file,
              preview: reader.result as string,
              type: "image",
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const id = Math.random().toString(36).substring(7);
      setUploadedFiles((prev) => [
        ...prev,
        {
          id,
          file,
          type: "file",
        },
      ]);
    });
  };

  // 파일 삭제
  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // 이미지를 마크다운에 삽입
  const insertImageToContent = (imageUrl: string) => {
    const imageMarkdown = `\n![이미지](${imageUrl})\n`;
    setContent((prev) => prev + imageMarkdown);
  };

  // 게시글 저장
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !category) {
      return;
    }

    if (!wallet?.address) {
      alert("지갑을 연결해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      let claimedBadge = false;
      let badgeMintError: string | null = null;

      const provider = wallet?.provider;
      const signer = wallet?.signer;
      const walletAddress = wallet?.address;

      if (provider && signer && walletAddress) {
        try {
          const badgeAddress = await getBadgeAddressForNetwork(provider);
          const alreadyHasBadge = await hasFirstPostBadge(
            provider,
            walletAddress,
            badgeAddress
          );

          if (!alreadyHasBadge) {
            const tx = await claimFirstPostBadge(signer, badgeAddress);
            await tx.wait();
            claimedBadge = true;
          }
        } catch (badgeError: any) {
          console.error("첫 게시글 배지 발급 실패:", badgeError);
          badgeMintError =
            badgeError?.reason ||
            badgeError?.message ||
            "NFT 배지 발급에 실패했습니다.";
        }
      }

      // 업로드된 파일들을 Base64로 변환 (실제로는 IPFS나 스토리지 서비스에 업로드)
      const fileData = await Promise.all(
        uploadedFiles.map(async (uploadedFile) => {
          if (uploadedFile.type === "image" && uploadedFile.preview) {
            return {
              id: uploadedFile.id,
              name: uploadedFile.file.name,
              type: uploadedFile.type,
              data: uploadedFile.preview, // Base64 데이터
            };
          } else {
            const reader = new FileReader();
            return new Promise<any>((resolve) => {
              reader.onloadend = () => {
                resolve({
                  id: uploadedFile.id,
                  name: uploadedFile.file.name,
                  type: uploadedFile.type,
                  data: reader.result,
                  size: uploadedFile.file.size,
                });
              };
              reader.readAsDataURL(uploadedFile.file);
            });
          }
        })
      );

      // 게시글 데이터 생성
      const newPost = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        author: wallet.address.slice(0, 6) + "..." + wallet.address.slice(-4),
        authorAddress: wallet.address,
        donationAddress,
        date: new Date().toISOString().split("T")[0],
        likes: 0,
        dislikes: 0,
        comments: 0,
        views: 0,
        files: fileData,
        contractAddress: donationAddress, // 후원 계좌를 컨트랙트 주소로 사용
      };

      // 로컬 스토리지에 저장
      const existingPosts = JSON.parse(
        localStorage.getItem("board_posts") || "[]"
      );
      existingPosts.unshift(newPost);
      localStorage.setItem("board_posts", JSON.stringify(existingPosts));

      // 게시판 페이지로 이동
      router.push("/board/free");

      if (claimedBadge) {
        alert("축하합니다! 첫 게시글 NFT 배지를 획득했습니다.");
      } else if (badgeMintError) {
        alert(
          `첫 게시글 NFT 배지를 발급하지 못했습니다.\n사유: ${badgeMintError}\n\nBase Sepolia 네트워크에 연결되어 있고 충분한 ETH가 있는지 확인한 뒤 다시 시도해주세요.`
        );
      }
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert("게시글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <Header
        showBackButton={true}
        backHref="/board/free"
      />

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

                {/* Donation Address (후원 계좌) */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    후원 계좌 (지갑 주소)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={donationAddress}
                      onChange={(e) => setDonationAddress(e.target.value)}
                      placeholder={wallet?.address || "지갑을 연결해주세요"}
                      className="font-mono text-sm border-slate-700 bg-slate-900/50 text-slate-100"
                    />
                    <Button
                      onClick={copyAddress}
                      variant="outline"
                      size="icon"
                      className="border-slate-700 hover:bg-slate-700"
                      disabled={!donationAddress}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {wallet?.address
                      ? "연결된 지갑 주소가 자동으로 입력됩니다. 수정 가능합니다."
                      : "지갑을 연결하면 주소가 자동으로 입력됩니다."}
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
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-slate-700"
                    onClick={() => imageInputRef.current?.click()}
                    title="이미지 업로드"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-slate-700"
                    onClick={() => fileInputRef.current?.click()}
                    title="파일 첨부"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <div className="h-6 w-px bg-slate-700" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700" title="굵게">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700" title="기울임">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700" title="목록">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700" title="코드">
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <Textarea
                  placeholder="게시글 내용을 작성하세요...&#10;&#10;마크다운 문법을 지원합니다."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[400px] border-0 resize-none focus:ring-0 text-base leading-relaxed p-6 bg-slate-900/30 text-slate-100 placeholder:text-slate-500"
                />
                {/* 업로드된 파일 미리보기 */}
                {uploadedFiles.length > 0 && (
                  <div className="border-t border-slate-700 p-4 bg-slate-900/50">
                    <div className="flex flex-wrap gap-3">
                      {uploadedFiles.map((uploadedFile) => (
                        <div
                          key={uploadedFile.id}
                          className="relative group border border-slate-700 rounded-lg overflow-hidden bg-slate-800"
                        >
                          {uploadedFile.type === "image" && uploadedFile.preview ? (
                            <div className="relative">
                              <img
                                src={uploadedFile.preview}
                                alt={uploadedFile.file.name}
                                className="w-32 h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    insertImageToContent(uploadedFile.preview!)
                                  }
                                  className="h-8 text-xs"
                                >
                                  삽입
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeFile(uploadedFile.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 flex items-center gap-2 min-w-[200px]">
                              <File className="h-8 w-8 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-200 truncate">
                                  {uploadedFile.file.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {(uploadedFile.file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFile(uploadedFile.id)}
                                className="h-8 w-8 p-0 hover:bg-red-500/20"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                disabled={
                  !title.trim() ||
                  !content.trim() ||
                  !category ||
                  !wallet?.address ||
                  isSubmitting
                }
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 gap-2 px-6 rounded-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    작성 중...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    게시하기
                  </>
                )}
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
