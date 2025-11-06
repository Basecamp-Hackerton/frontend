/**
 * 컨트랙트 주소 설정
 * 배포 스크립트가 자동으로 업데이트합니다.
 * 수동으로 변경할 필요가 없습니다.
 */

// Base Sepolia 테스트넷
export const WALLET_AUTH_CONTRACT_ADDRESS_SEPOLIA = "";

// Base 메인넷
export const WALLET_AUTH_CONTRACT_ADDRESS_MAINNET = "";

// 로컬 개발 환경
export const WALLET_AUTH_CONTRACT_ADDRESS_LOCAL = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

/**
 * 현재 네트워크에 맞는 컨트랙트 주소 반환
 */
export function getWalletAuthContractAddress(chainId: number): string {
  switch (chainId) {
    case 84532: // Base Sepolia
      return WALLET_AUTH_CONTRACT_ADDRESS_SEPOLIA;
    case 8453: // Base Mainnet
      return WALLET_AUTH_CONTRACT_ADDRESS_MAINNET;
    case 1337: // Local Hardhat (legacy)
    case 31337: // Local Hardhat (기본값)
      return WALLET_AUTH_CONTRACT_ADDRESS_LOCAL;
    default:
      return WALLET_AUTH_CONTRACT_ADDRESS_LOCAL;
  }
}
