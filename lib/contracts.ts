/**
 * 컨트랙트 주소 설정
 * 배포 스크립트가 자동으로 업데이트합니다.
 * 수동으로 변경할 필요가 없습니다.
 */

// Base Sepolia 테스트넷
export const WALLET_AUTH_CONTRACT_ADDRESS_SEPOLIA = "0xBeeDC2AdC631596659a8610abc444686F2ffB670";

// Base 메인넷
export const WALLET_AUTH_CONTRACT_ADDRESS_MAINNET = "";

// 로컬 개발 환경
export const WALLET_AUTH_CONTRACT_ADDRESS_LOCAL = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Base Sepolia 테스트넷 (NFT 배지)
export const BADGE_CONTRACT_ADDRESS_SEPOLIA = "0xB2567E700886851e0062008DbDA58229952c3087";

// Base 메인넷 (NFT 배지)
export const BADGE_CONTRACT_ADDRESS_MAINNET = "";

// 로컬 개발 환경 (NFT 배지)
export const BADGE_CONTRACT_ADDRESS_LOCAL = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

/**
 * 현재 네트워크에 맞는 컨트랙트 주소 반환
 */
export function getWalletAuthContractAddress(chainId: number): string {
  switch (chainId) {
    case 84532: // Base Sepolia
      return WALLET_AUTH_CONTRACT_ADDRESS_SEPOLIA;
    case 8453: // Base Mainnet
      return WALLET_AUTH_CONTRACT_ADDRESS_MAINNET;
    default:
      throw new Error(
        `지원하지 않는 네트워크입니다. Base Sepolia(84532)로 전환해주세요. 현재 Chain ID: ${chainId}`
      );
  }
}

/**
 * 현재 네트워크에 맞는 NFT 배지 컨트랙트 주소 반환
 */
export function getBadgeContractAddress(chainId: number): string {
  switch (chainId) {
    case 84532: // Base Sepolia
      return BADGE_CONTRACT_ADDRESS_SEPOLIA;
    case 8453: // Base Mainnet
      return BADGE_CONTRACT_ADDRESS_MAINNET;
    default:
      throw new Error(
        `지원하지 않는 네트워크입니다. Base Sepolia(84532)로 전환해주세요. 현재 Chain ID: ${chainId}`
      );
  }
}
