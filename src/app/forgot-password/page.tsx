import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex flex-col justify-between selection:bg-[#d4af37] selection:text-black">
      <header className="w-full border-b border-[#1f1f1f] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center group py-2">
            <Image src="/logo.png" alt="Elite Bounce Logo" width={400} height={150} priority className="h-16 w-auto object-contain" />
          </Link>
          <Link href="/login" className="text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-[#d4af37] transition-colors">
            &larr; Nazad na prijavu
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#121212] border border-[#1f1f1f] rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <span className="text-[#d4af37] font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-[#d4af37]/10 px-3 py-1 rounded border border-[#d4af37]/20 inline-block mb-4">
            PODRŠKA
          </span>
          <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white mb-4">
            Zaboravljena lozinka?
          </h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Nema problema! Pošto je sistem prilagođen treninzima, javite se treneru direktno (putem Vibera, WhatsApp-a ili društvenih mreža) kako bi vam lozinka bila odmah resetovana.
          </p>

          <Link 
            href="/login"
            className="inline-block w-full bg-[#d4af37] text-black font-display text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg hover:bg-yellow-600 transition-all shadow-lg shadow-[#d4af37]/10"
          >
            Povratak na prijavu
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#1f1f1f] py-6 text-center text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} Elite Bounce. Sva prava zadržana.</p>
      </footer>
    </div>
  )
}