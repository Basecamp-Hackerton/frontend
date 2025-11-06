"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { WalletState, getCurrentWallet } from "@/lib/wallet";

interface WalletContextType {
  wallet: WalletState | null;
  setWallet: (wallet: WalletState | null) => void;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState | null>(null);

  // 컴포넌트 마운트 시 지갑 상태 확인
  useEffect(() => {
    const checkWallet = async () => {
      try {
        const currentWallet = await getCurrentWallet();
        if (currentWallet.isConnected) {
          setWallet(currentWallet);
        }
      } catch (error) {
        console.error("지갑 상태 확인 실패:", error);
      }
    };

    checkWallet();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
        isConnected: wallet?.isConnected ?? false,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

