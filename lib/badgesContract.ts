import { ethers } from "ethers";
import { getBadgeContractAddress } from "./contracts";

export const BADGE_CONTRACT_ABI = [
  "function claimFirstPostBadge() external returns (uint256)",
  "function hasFirstPostBadge(address account) external view returns (bool)",
  "event FirstPostBadgeClaimed(address indexed user, uint256 indexed tokenId)",
] as const;

export function getBadgeContract(
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider,
  signer: ethers.JsonRpcSigner | null,
  contractAddress: string
): ethers.Contract {
  return new ethers.Contract(
    contractAddress,
    BADGE_CONTRACT_ABI,
    signer || provider
  );
}

export async function getBadgeAddressForNetwork(
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider
): Promise<string> {
  const network = await provider.getNetwork();
  const address = getBadgeContractAddress(Number(network.chainId));

  if (!address) {
    throw new Error(
      `배지 컨트랙트가 배포되지 않았습니다. Chain ID: ${network.chainId}`
    );
  }

  return address;
}

export async function hasFirstPostBadge(
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider,
  walletAddress: string,
  contractAddress: string
): Promise<boolean> {
  try {
    const contract = getBadgeContract(provider, null, contractAddress);
    return await contract.hasFirstPostBadge(walletAddress);
  } catch (error) {
    console.error("배지 보유 여부 확인 실패:", error);
    return false;
  }
}

export async function claimFirstPostBadge(
  signer: ethers.JsonRpcSigner,
  contractAddress: string
): Promise<ethers.ContractTransactionResponse> {
  try {
    const provider = signer.provider as ethers.BrowserProvider;
    const contract = getBadgeContract(provider, signer, contractAddress);
    const tx = await contract.claimFirstPostBadge();
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

