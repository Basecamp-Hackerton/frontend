import { ethers } from "ethers";
import { getWalletAuthContractAddress } from "./contracts";

// WalletAuth 컨트랙트 ABI (컨트랙트의 함수 시그니처)
export const WALLET_AUTH_ABI = [
  "function registerSelf() external",
  "function isRegistered(address _walletAddress) external view returns (bool)",
  "function getUserInfo(address _walletAddress) external view returns (tuple(address walletAddress, uint256 registeredAt, bool isActive))",
  "function getRegisteredCount() external view returns (uint256)",
  "event UserRegistered(address indexed user, uint256 timestamp)",
  "event UserDeactivated(address indexed user, uint256 timestamp)",
  "event UserReactivated(address indexed user, uint256 timestamp)",
] as const;

export interface UserInfo {
  walletAddress: string;
  registeredAt: bigint;
  isActive: boolean;
}

/**
 * WalletAuth 컨트랙트 인스턴스 생성
 */
export function getWalletAuthContract(
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider,
  signer: ethers.JsonRpcSigner | null,
  contractAddress: string
): ethers.Contract {
  const contract = new ethers.Contract(
    contractAddress,
    WALLET_AUTH_ABI,
    signer || provider
  );
  return contract;
}

/**
 * 현재 네트워크의 컨트랙트 주소 가져오기
 */
export async function getContractAddress(
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider
): Promise<string> {
  const network = await provider.getNetwork();
  const address = getWalletAuthContractAddress(Number(network.chainId));
  
  if (!address) {
    throw new Error(
      `컨트랙트가 배포되지 않았습니다. Chain ID: ${network.chainId}`
    );
  }
  
  return address;
}

/**
 * 지갑이 컨트랙트에 등록되어 있는지 확인
 */
export async function checkRegistration(
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider,
  walletAddress: string,
  contractAddress: string
): Promise<boolean> {
  try {
    const contract = getWalletAuthContract(provider, null, contractAddress);
    const isRegistered = await contract.isRegistered(walletAddress);
    return isRegistered;
  } catch (error) {
    console.error("등록 확인 실패:", error);
    return false;
  }
}

/**
 * 사용자 정보 조회
 */
export async function getUserInfo(
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider,
  walletAddress: string,
  contractAddress: string
): Promise<UserInfo | null> {
  try {
    const contract = getWalletAuthContract(provider, null, contractAddress);
    const userInfo = await contract.getUserInfo(walletAddress);
    
    return {
      walletAddress: userInfo.walletAddress,
      registeredAt: userInfo.registeredAt,
      isActive: userInfo.isActive,
    };
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    return null;
  }
}

/**
 * 컨트랙트에 사용자 등록
 */
export async function registerUser(
  signer: ethers.JsonRpcSigner,
  contractAddress: string
): Promise<ethers.ContractTransactionResponse> {
  try {
    const provider = signer.provider as ethers.BrowserProvider;
    const contract = getWalletAuthContract(provider, signer, contractAddress);
    
    // registerSelf() 함수 호출
    const tx = await contract.registerSelf();
    return tx;
  } catch (error: any) {
    if (error.code === "ACTION_REJECTED") {
      throw new Error("트랜잭션이 거부되었습니다.");
    }
    if (error.reason) {
      throw new Error(error.reason);
    }
    throw error;
  }
}

/**
 * 등록된 사용자 수 조회
 */
export async function getRegisteredCount(
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider,
  contractAddress: string
): Promise<number> {
  try {
    const contract = getWalletAuthContract(provider, null, contractAddress);
    const count = await contract.getRegisteredCount();
    return Number(count);
  } catch (error) {
    console.error("등록된 사용자 수 조회 실패:", error);
    return 0;
  }
}

/**
 * 지갑이 컨트랙트에 등록되어 있는지 확인하고, 등록되지 않았다면 등록
 */
export async function checkContractRegistration(
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider,
  walletAddress: string
): Promise<void> {
  try {
    const contractAddress = await getContractAddress(provider);
    const isRegistered = await checkRegistration(provider, walletAddress, contractAddress);
    
    if (!isRegistered) {
      console.log("지갑이 등록되지 않았습니다. 등록을 진행합니다...");
      // 등록은 사용자가 직접 트랜잭션을 승인해야 하므로 여기서는 로그만 출력
      // 실제 등록은 사용자가 명시적으로 요청할 때 수행
    } else {
      console.log("지갑이 이미 등록되어 있습니다.");
    }
  } catch (error) {
    console.error("컨트랙트 등록 확인 실패:", error);
  }
}

