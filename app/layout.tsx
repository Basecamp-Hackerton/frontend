import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/contexts/WalletContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Base Camp - Base 생태계 커뮤니티 허브",
  description: "Base 생태계를 위한 온체인 커뮤니티 허브",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}


