import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-8 px-8 py-4 bg-black/20 backdrop-blur-lg rounded-full border border-white/10 w-full justify-between">
          <Link href="/" className="text-2xl font-bold text-green-400">
            r00t_R3b3lz
          </Link>
          <nav className="flex items-center space-x-8">
            <Link href="/members" className="text-base font-medium text-gray-300 hover:text-green-400 transition-colors">
              Members
            </Link>
            <Link href="/ctfs" className="text-base font-medium text-gray-300 hover:text-green-400 transition-colors">
              CTFs
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
