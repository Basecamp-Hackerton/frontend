"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Wallet, AlertCircle } from "lucide-react";
import { connectWallet, disconnectWallet, getCurrentWallet, formatAddress, switchToBaseNetwork, WalletState } from "@/lib/wallet";
import { getWalletProvider } from "@/lib/wallets";
import WalletSelectModal from "./WalletSelectModal";
import { useWallet } from "@/contexts/WalletContext";
import { checkContractRegistration } from "@/lib/contract";

interface WalletConnectProps {
  onConnect?: (wallet: WalletState) => void;
  onDisconnect?: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const { wallet, setWallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  // 지갑 변경 이벤트 리스너
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 모든 가능한 지갑 provider에 이벤트 리스너 추가
      const providers = [
        window.ethereum,
        window.okxwallet,
        window.rabby,
        window.coinbaseWalletExtension,
        window.trustwallet,
      ].filter(Boolean);

      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          handleDisconnect();
        } else {
          // 계정이 변경되면 다시 연결 확인
          try {
            const currentWallet = await getCurrentWallet();
            setWallet(currentWallet);
            if (currentWallet.isConnected && onConnect) {
              onConnect(currentWallet);
            }
          } catch (error) {
            console.error("지갑 연결 확인 실패:", error);
          }
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      providers.forEach((provider) => {
        if (provider) {
          provider.on?.("accountsChanged", handleAccountsChanged);
          provider.on?.("chainChanged", handleChainChanged);
        }
      });

      return () => {
        providers.forEach((provider) => {
          if (provider) {
            provider.removeListener?.("accountsChanged", handleAccountsChanged);
            provider.removeListener?.("chainChanged", handleChainChanged);
          }
        });
      };
    }
  }, [setWallet, onConnect]);

  const handleWalletSelect = async (walletId: string) => {
    setSelectedWalletId(walletId);
    setIsConnecting(true);
    setError(null);

    try {
      const provider = getWalletProvider(walletId);
      if (!provider) {
        throw new Error("선택한 지갑이 설치되어 있지 않습니다.");
      }

      // 네트워크 전환 (Base Sepolia 기본)
      try {
        console.log("Base Sepolia 네트워크로 전환 시도...");
        await switchToBaseNetwork(provider);
        console.log("Base Sepolia 네트워크로 전환 성공");
      } catch (networkError: any) {
        console.error("네트워크 전환 오류:", networkError);
        // 네트워크 전환 실패해도 계속 진행 (이미 올바른 네트워크일 수 있음)
        if (networkError.code !== 4902) {
          throw new Error(`네트워크 전환 실패: ${networkError.message}`);
        }
      }

      // 잠시 대기 (네트워크 전환 후 안정화)
      await new Promise(resolve => setTimeout(resolve, 500));

      // 지갑 연결
      const connectedWallet = await connectWallet(walletId);
      setWallet(connectedWallet);
      
      if (onConnect) {
        onConnect(connectedWallet);
      }
      if (connectedWallet.provider && connectedWallet.address) {
        await checkContractRegistration(connectedWallet.provider, connectedWallet.address);
      }
    } catch (err: any) {
      setError(err.message || "지갑 연결에 실패했습니다.");
      console.error("지갑 연결 실패:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // 실제 지갑 연결 해제 (권한 해제)
      if (wallet?.provider) {
        // provider에서 원본 provider 가져오기
        const originalProvider = (wallet.provider as any).provider;
        if (originalProvider) {
          await disconnectWallet(originalProvider);
        } else {
          // provider를 직접 사용할 수 없는 경우, 모든 provider에서 시도
          await disconnectWallet();
        }
      } else {
        // provider가 없는 경우에도 시도
        await disconnectWallet();
      }
    } catch (error) {
      console.error("지갑 연결 해제 중 오류:", error);
      // 오류가 발생해도 로컬 상태는 초기화
    }

    // 지갑 연결 해제 (로컬 상태 초기화)
    setWallet(null);
    setError(null);
    setSelectedWalletId(null);
    
    // 부모 컴포넌트에 연결 해제 알림
    if (onDisconnect) {
      onDisconnect();
    }
  };

  if (wallet?.isConnected && wallet?.address) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
            <Wallet className="h-4 w-4 text-green-400" />
            <span className="text-sm text-slate-300 font-mono">
              {formatAddress(wallet.address)}
            </span>
            {wallet.walletName && (
              <span className="text-xs text-slate-500">({wallet.walletName})</span>
            )}
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="gap-2 border-slate-700 hover:bg-slate-700 rounded-xl"
          >
            <LogOut className="h-4 w-4" /> 로그아웃
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowWalletModal(true)}
            disabled={isConnecting}
            className="gap-2 rounded-xl"
          >
            {isConnecting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                연결 중...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" /> 지갑 연결
              </>
            )}
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
      <WalletSelectModal
        open={showWalletModal}
        onOpenChange={setShowWalletModal}
        onSelectWallet={handleWalletSelect}
      />
    </>
  );
}
