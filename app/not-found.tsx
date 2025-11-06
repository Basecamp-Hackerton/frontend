import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
      <p className="text-slate-600 mb-4">요청하신 페이지가 존재하지 않습니다.</p>
      <Link href="/">
        <Button>홈으로 돌아가기</Button>
      </Link>
    </div>
  )
}

