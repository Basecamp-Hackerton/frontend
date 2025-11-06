"use client";

import Link from "next/link";
import { Bell, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import WalletConnect from "@/components/WalletConnect";
import { useWallet } from "@/contexts/WalletContext";

interface HeaderProps {
  showBackButton?: boolean;
  backHref?: string;
  rightContent?: React.ReactNode;
}

export default function Header({ showBackButton = false, backHref = "/", rightContent }: HeaderProps) {
  const { wallet, setWallet } = useWallet();

  const handleWalletConnect = (connectedWallet: any) => {
    setWallet(connectedWallet);
  };

  const handleWalletDisconnect = () => {
    setWallet(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Link href={backHref} className="text-slate-300 hover:text-slate-100 transition-colors">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          )}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white grid place-items-center text-sm font-bold">
              B
            </div>
            <div className="font-semibold tracking-tight text-slate-100">Base Camp</div>
          </Link>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 text-slate-400" />
            <Input
              placeholder="검색: 공지, 게시물, 사용자…"
              className="pl-9 w-72 border-slate-700 bg-slate-800/50 text-slate-100 placeholder:text-slate-500 rounded-xl"
            />
          </div>
          <Button variant="ghost" size="icon" aria-label="알림" className="hover:bg-slate-700 rounded-xl">
            <Bell className="h-5 w-5 text-slate-300" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="설정" className="hover:bg-slate-700 rounded-xl">
            <Settings className="h-5 w-5 text-slate-300" />
          </Button>
          {wallet?.isConnected ? (
            <>
              <Link href="/profile">
                <Button variant="outline" className="gap-2 border-slate-700 hover:bg-slate-700 rounded-xl">
                  <User className="h-4 w-4" /> 내 프로필
                </Button>
              </Link>
              <WalletConnect onDisconnect={handleWalletDisconnect} />
            </>
          ) : (
            <WalletConnect onConnect={handleWalletConnect} />
          )}
          {rightContent}
        </div>
      </div>
    </header>
  );
}

