import Link from 'next/link'
import Image from 'next/image'

interface PortalHeaderProps {
  handleLogout: () => Promise<void>
}

export default function PortalHeader({ handleLogout }: PortalHeaderProps) {
  return (
    <header className="w-full border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center group py-2">
            <Image 
              src="/logo.png" 
              alt="Elite Bounce Logo" 
              width={300} 
              height={100} 
              priority 
              className="h-12 w-auto object-contain"
            />
          </Link>
          <span className="hidden lg:inline-block text-[#d4af37] font-mono text-[10px] font-bold tracking-widest bg-[#d4af37]/10 px-2.5 py-1 rounded border border-[#d4af37]/20">
            ATHLETE PORTAL
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/leaderboard" 
            target="_blank" 
            className="border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 text-xs font-bold uppercase tracking-wider px-3 sm:px-4 py-2 rounded transition-colors"
          >
            Tabela ↗
          </Link>

          <Link 
            href="/exercises" 
            className="border border-[#1f1f1f] bg-[#121212] text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider px-3 sm:px-4 py-2 rounded transition-colors"
          >
            Vježbe ↗
          </Link>

          <form action={handleLogout}>
            <button 
              type="submit"
              className="border border-[#1f1f1f] bg-[#121212] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider px-3 sm:px-4 py-2 rounded transition-colors cursor-pointer"
            >
              Odjava
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}