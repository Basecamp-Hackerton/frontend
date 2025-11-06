"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { detectWallets, WalletInfo } from "@/lib/wallets";
import { ExternalLink, Download } from "lucide-react";

interface WalletSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectWallet: (walletId: string) => void;
}

export default function WalletSelectModal({
  open,
  onOpenChange,
  onSelectWallet,
}: WalletSelectModalProps) {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);

  useEffect(() => {
    if (open) {
      // 모달이 열릴 때마다 지갑 감지
      const detectedWallets = detectWallets();
      setWallets(detectedWallets);
    }
  }, [open]);

  const handleWalletClick = (wallet: WalletInfo) => {
    if (wallet.isInstalled) {
      onSelectWallet(wallet.id);
      onOpenChange(false);
    } else {
      // 설치되지 않은 지갑은 다운로드 페이지로 이동
      window.open(wallet.downloadUrl, "_blank");
    }
  };

  const installedWallets = wallets.filter((w) => w.isInstalled);
  const notInstalledWallets = wallets.filter((w) => !w.isInstalled);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">지갑 연결</DialogTitle>
          <DialogDescription className="text-slate-400">
            연결할 지갑을 선택하세요
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* 설치된 지갑 */}
          {installedWallets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">
                설치된 지갑
              </h3>
              <div className="grid gap-2">
                {installedWallets.map((wallet) => (
                  <Button
                    key={wallet.id}
                    variant="outline"
                    className="w-full justify-start h-auto py-4 px-4 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                    onClick={() => handleWalletClick(wallet)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-slate-100">
                          {wallet.name}
                        </div>
                      </div>
                      <span className="text-xs text-green-400">연결</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 설치되지 않은 지갑 */}
          {notInstalledWallets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">
                다른 지갑 설치하기
              </h3>
              <div className="grid gap-2">
                {notInstalledWallets.map((wallet) => (
                  <Button
                    key={wallet.id}
                    variant="outline"
                    className="w-full justify-start h-auto py-4 px-4 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                    onClick={() => handleWalletClick(wallet)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-slate-100">
                          {wallet.name}
                        </div>
                      </div>
                      <Download className="h-4 w-4 text-slate-400" />
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {wallets.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <p>설치된 지갑이 없습니다.</p>
              <p className="text-sm mt-2">
                위의 지갑 중 하나를 설치해주세요.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

