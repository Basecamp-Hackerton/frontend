import { ethers } from "ethers";
import { getWalletProvider } from "./wallets";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  walletName?: string;
}

/**
 * 특정 지갑으로 연결
 */
export async function connectWallet(walletId?: string): Promise<WalletState> {
  if (typeof window === "undefined") {
    throw new Error("브라우저 환경에서만 사용할 수 있습니다.");
  }

  // 지갑 Provider 가져오기
  let provider: any;
  
  if (walletId) {
    provider = getWalletProvider(walletId);
    if (!provider) {
      throw new Error("선택한 지갑이 설치되어 있지 않습니다.");
    }
  } else {
    // 기본적으로 window.ethereum 사용 (첫 번째 감지된 지갑)
    provider = window.ethereum;
    if (!provider) {
      throw new Error("지갑이 설치되어 있지 않습니다. 지갑을 설치해주세요.");
    }
  }

  try {
    // 지갑 연결 요청
    await provider.request({ method: "eth_requestAccounts" });

    // Provider 생성
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();

    // 지갑 이름 감지
    let walletName = "Unknown";
    if (provider.isMetaMask && !provider.isRabby && !provider.isOKExWallet) {
      walletName = "MetaMask";
    } else if (provider.isOKExWallet || window.okxwallet) {
      walletName = "OKX Wallet";
    } else if (provider.isRabby || window.rabby) {
      walletName = "Rabby";
    } else if (provider.isCoinbaseWallet || window.coinbaseWalletExtension) {
      walletName = "Coinbase Wallet";
    } else if (provider.isTrust || window.trustwallet) {
      walletName = "Trust Wallet";
    }

    return {
      address,
      isConnected: true,
      provider: ethersProvider,
      signer,
      walletName,
    };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("지갑 연결이 거부되었습니다.");
    }
    throw error;
  }
}

/**
 * 지갑 연결 해제
 * 지갑의 권한을 해제하고 앱 내에서의 연결 상태를 초기화합니다.
 * 
 * 참고: 일부 지갑은 완전한 연결 해제를 지원하지 않을 수 있습니다.
 * 이 경우 로컬 상태만 초기화되며, 사용자가 지갑에서 직접 연결을 해제해야 할 수 있습니다.
 */
export async function disconnectWallet(provider?: any): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    // provider가 제공되지 않으면 모든 가능한 provider에서 시도
    const providers = provider 
      ? [provider]
      : [
          window.ethereum,
          window.okxwallet,
          window.rabby,
          window.coinbaseWalletExtension,
          window.trustwallet,
        ].filter(Boolean);

    for (const prov of providers) {
      if (!prov || !prov.request) continue;

      try {
        // EIP-2255: 지갑 권한 관리
        // 현재 권한 확인
        let permissions: any[] = [];
        try {
          permissions = await prov.request({
            method: "wallet_getPermissions",
          });
        } catch (getPermError) {
          // wallet_getPermissions를 지원하지 않는 지갑
          console.log("권한 조회 불가 (지원하지 않는 지갑):", getPermError);
          continue;
        }

        // 권한이 있으면 해제 시도
        if (permissions && permissions.length > 0) {
          // eth_accounts 권한 찾기
          const ethAccountsPermission = permissions.find(
            (p: any) => p.parentCapability === "eth_accounts"
          );

          if (ethAccountsPermission) {
            try {
              // 권한 해제 (EIP-2255 표준)
              await prov.request({
                method: "wallet_revokePermissions",
                params: [
                  {
                    eth_accounts: ethAccountsPermission.caveats || {},
                  },
                ],
              });
              console.log("지갑 권한이 해제되었습니다.");
            } catch (revokeError: any) {
              // wallet_revokePermissions를 지원하지 않거나 실패한 경우
              console.log("권한 해제 실패 (일부 지갑은 지원하지 않음):", revokeError);
              
              // 대안: MetaMask의 경우 _metamask 객체를 통해 시도
              if (prov.isMetaMask && prov._metamask) {
                try {
                  await prov._metamask.request({
                    method: "wallet_revokePermissions",
                    params: [
                      {
                        eth_accounts: {},
                      },
                    ],
                  });
                } catch (metaMaskError) {
                  console.log("MetaMask 권한 해제 실패:", metaMaskError);
                }
              }
            }
          }
        }
      } catch (error) {
        // 개별 provider에서 오류가 발생해도 계속 진행
        console.log("지갑 연결 해제 중 오류 (무시됨):", error);
      }
    }
  } catch (error) {
    console.error("지갑 연결 해제 실패:", error);
    // 오류가 발생해도 계속 진행 (로컬 상태는 초기화)
  }
}

/**
 * 현재 연결된 지갑 주소 가져오기
 */
export async function getCurrentWallet(): Promise<WalletState> {
  if (typeof window === "undefined" || !window.ethereum) {
    return {
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
    };
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    
    if (accounts.length === 0) {
      return {
        address: null,
        isConnected: false,
        provider: null,
        signer: null,
      };
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // 지갑 이름 감지
    let walletName = "Unknown";
    if (window.ethereum.isMetaMask && !window.ethereum.isRabby && !window.ethereum.isOKExWallet) {
      walletName = "MetaMask";
    } else if (window.ethereum.isOKExWallet || window.okxwallet) {
      walletName = "OKX Wallet";
    } else if (window.ethereum.isRabby || window.rabby) {
      walletName = "Rabby";
    }

    return {
      address,
      isConnected: true,
      provider,
      signer,
      walletName,
    };
  } catch (error) {
    return {
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
    };
  }
}

/**
 * 지갑 주소를 짧게 표시 (0x1234...5678)
 */
export function formatAddress(address: string | null): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * 로컬 Hardhat 네트워크로 전환
 */
export async function switchToLocalNetwork(provider?: any): Promise<void> {
  const ethereum = provider || (typeof window !== "undefined" ? window.ethereum : null);
  
  if (!ethereum) {
    throw new Error("지갑이 설치되어 있지 않습니다.");
  }

  const localNetwork = {
    chainId: "0x7A69", // 31337 in hex (Hardhat 기본값)
    chainName: "Hardhat Local",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["http://127.0.0.1:8545"],
    blockExplorerUrls: [],
  };

  try {
    // 현재 체인 ID 확인
    const currentChainId = await ethereum.request({ method: "eth_chainId" });
    console.log("현재 체인 ID:", currentChainId);
    console.log("목표 체인 ID:", localNetwork.chainId);

    // 이미 올바른 네트워크에 있으면 전환하지 않음
    if (currentChainId === localNetwork.chainId) {
      console.log("이미 로컬 네트워크에 연결되어 있습니다.");
      return;
    }

    // 네트워크 전환 시도
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: localNetwork.chainId }],
    });
    console.log("로컬 네트워크로 전환 성공");
  } catch (switchError: any) {
    console.error("네트워크 전환 오류:", switchError);
    // 네트워크가 없으면 추가
    if (switchError.code === 4902) {
      console.log("로컬 네트워크가 없어서 추가합니다...");
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [localNetwork],
        });
        console.log("로컬 네트워크 추가 성공");
      } catch (addError: any) {
        console.error("로컬 네트워크 추가 실패:", addError);
        throw new Error(`로컬 네트워크 추가에 실패했습니다: ${addError.message}`);
      }
    } else if (switchError.code === 4001) {
      throw new Error("네트워크 전환이 거부되었습니다.");
    } else {
      throw new Error(`네트워크 전환 실패: ${switchError.message}`);
    }
  }
}

/**
 * Base 네트워크로 전환
 */
export async function switchToBaseNetwork(provider?: any): Promise<void> {
  const ethereum = provider || (typeof window !== "undefined" ? window.ethereum : null);
  
  if (!ethereum) {
    throw new Error("지갑이 설치되어 있지 않습니다.");
  }

  const baseSepolia = {
    chainId: "0x14a34", // 84532 in hex
    chainName: "Base Sepolia",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.base.org"],
    blockExplorerUrls: ["https://sepolia.basescan.org"],
  };

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: baseSepolia.chainId }],
    });
  } catch (switchError: any) {
    // 네트워크가 없으면 추가
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [baseSepolia],
        });
      } catch (addError) {
        throw new Error("Base 네트워크 추가에 실패했습니다.");
      }
    } else {
      throw switchError;
    }
  }
}
