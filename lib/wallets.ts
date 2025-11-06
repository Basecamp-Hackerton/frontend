/**
 * 여러 지갑 감지 및 연결 유틸리티
 */

export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  downloadUrl: string;
  isInstalled: boolean;
  provider?: any;
}

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: any;
    rabby?: any;
    coinbaseWalletExtension?: any;
    trustwallet?: any;
  }
}

/**
 * 사용 가능한 지갑 목록
 */
export const WALLETS: WalletInfo[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    downloadUrl: "https://metamask.io/download/",
    isInstalled: false,
  },
  {
    id: "okx",
    name: "OKX Wallet",
    icon: "🔷",
    downloadUrl: "https://www.okx.com/web3",
    isInstalled: false,
  },
  {
    id: "rabby",
    name: "Rabby",
    icon: "🐰",
    downloadUrl: "https://rabby.io/",
    isInstalled: false,
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    downloadUrl: "https://www.coinbase.com/wallet",
    isInstalled: false,
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "🛡️",
    downloadUrl: "https://trustwallet.com/",
    isInstalled: false,
  },
];

/**
 * 설치된 지갑 감지
 */
export function detectWallets(): WalletInfo[] {
  if (typeof window === "undefined") {
    return [];
  }

  const detectedWallets: WalletInfo[] = [];

  // MetaMask 감지
  if (window.ethereum?.isMetaMask && !window.ethereum?.isRabby && !window.ethereum?.isOKExWallet) {
    detectedWallets.push({
      ...WALLETS[0],
      isInstalled: true,
      provider: window.ethereum,
    });
  }

  // OKX Wallet 감지
  if (window.okxwallet || window.ethereum?.isOKExWallet) {
    detectedWallets.push({
      ...WALLETS[1],
      isInstalled: true,
      provider: window.okxwallet || window.ethereum,
    });
  }

  // Rabby 감지
  if (window.rabby || window.ethereum?.isRabby) {
    detectedWallets.push({
      ...WALLETS[2],
      isInstalled: true,
      provider: window.rabby || window.ethereum,
    });
  }

  // Coinbase Wallet 감지
  if (window.coinbaseWalletExtension || window.ethereum?.isCoinbaseWallet) {
    detectedWallets.push({
      ...WALLETS[3],
      isInstalled: true,
      provider: window.coinbaseWalletExtension || window.ethereum,
    });
  }

  // Trust Wallet 감지
  if (window.trustwallet || window.ethereum?.isTrust) {
    detectedWallets.push({
      ...WALLETS[4],
      isInstalled: true,
      provider: window.trustwallet || window.ethereum,
    });
  }

  // 설치되지 않은 지갑도 추가 (다운로드 링크 제공)
  WALLETS.forEach((wallet) => {
    if (!detectedWallets.find((w) => w.id === wallet.id)) {
      detectedWallets.push(wallet);
    }
  });

  return detectedWallets;
}

/**
 * 특정 지갑의 Provider 가져오기
 */
export function getWalletProvider(walletId: string): any {
  if (typeof window === "undefined") {
    return null;
  }

  switch (walletId) {
    case "metamask":
      return window.ethereum?.isMetaMask && !window.ethereum?.isRabby && !window.ethereum?.isOKExWallet
        ? window.ethereum
        : null;
    case "okx":
      return window.okxwallet || (window.ethereum?.isOKExWallet ? window.ethereum : null);
    case "rabby":
      return window.rabby || (window.ethereum?.isRabby ? window.ethereum : null);
    case "coinbase":
      return window.coinbaseWalletExtension || (window.ethereum?.isCoinbaseWallet ? window.ethereum : null);
    case "trust":
      return window.trustwallet || (window.ethereum?.isTrust ? window.ethereum : null);
    default:
      return window.ethereum;
  }
}

/**
 * 지갑 이름으로 Provider 가져오기
 */
export function getProviderByWalletName(walletName: string): any {
  const wallet = WALLETS.find((w) => w.name.toLowerCase() === walletName.toLowerCase());
  if (!wallet) return null;
  return getWalletProvider(wallet.id);
}

