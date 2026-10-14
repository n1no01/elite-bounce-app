import Image from 'next/image'
import Link from 'next/link'
import { EbookForm } from '../components/EBookForm'

export const metadata = {
  title: 'Elite Bounce Metodologija | Besplatni Vodič za Vertikalni Skok',
  description: 'Preuzmi besplatni vodič od 38 stranica o mehanici eksplozivnog odraza, ciklusu rastezanja i skraćivanja mišića, periodizaciji i protokolu za tetive.',
}

export default function EbookPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans antialiased selection:bg-[#d4af37] selection:text-black flex flex-col justify-between">
      
      {/* MINIMALNI HEADER */}
      <header className="border-b border-[#1f1f1f] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Elite Bounce Logo" 
              width={200} 
              height={50} 
              priority 
              className="h-12 w-auto object-contain"
            />
          </Link>
          <Link 
            href="/" 
            className="text-xs font-mono text-gray-400 hover:text-[#d4af37] transition-colors uppercase tracking-wider"
          >
            ← Nazad na početnu
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT / LANDING HEROPAGE */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Pozadinski svjetlosni efekt */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Lijeva kolona: Informacije o e-booku */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block text-[#d4af37] font-mono text-xs font-bold uppercase tracking-widest bg-[#d4af37]/10 px-3.5 py-1.5 rounded border border-[#d4af37]/20">
              BESPLATNI VODIČ
            </span>

            <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              Elite Bounce <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-[#d4af37]">
                Metodologija
              </span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed">
              Preuzmi opći priručnik za razumijevanje i razvoj vertikalnog skoka. Saznaj sve o mehanici eksplozivnog odraza, pliometriji, periodizaciji treninga i naučnom upravljanju opterećenjem tetiva.
            </p>

            {/* Ključne stavke / Benefits */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-[#121212] border border-[#1f1f1f] p-3.5 rounded-lg">
                <span className="text-[#d4af37] font-bold text-lg">⚡</span>
                <div>
                  <h3 className="font-display text-sm font-bold uppercase text-white">Biomehanika Odraza</h3>
                  <p className="text-xs text-gray-400 font-light">Razumijevanje rada mišića i nervnog sistema pri jednonožnom i dvonožnom skoku.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#121212] border border-[#1f1f1f] p-3.5 rounded-lg">
                <span className="text-[#d4af37] font-bold text-lg">⚡</span>
                <div>
                  <h3 className="font-display text-sm font-bold uppercase text-white">Sistemi Periodizacije</h3>
                  <p className="text-xs text-gray-400 font-light">Kako pametno dozirati volumen i intenzitet treninga kroz takmičarsku sezonu i pauze.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#121212] border border-[#1f1f1f] p-3.5 rounded-lg">
                <span className="text-[#d4af37] font-bold text-lg">⚡</span>
                <div>
                  <h3 className="font-display text-sm font-bold uppercase text-white">Zdravlje Tetiva i Oporavak</h3>
                  <p className="text-xs text-gray-400 font-light">4-fazni protokol za jačanje patelarne tetive i rješavanje &quot;skakačkog koljena&quot;.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desna kolona: Forma za prikupljanje emaila */}
          <div className="lg:col-span-5">
            <div className="bg-[#121212] border border-[#d4af37]/30 p-2 sm:p-3 rounded-2xl shadow-2xl relative">
              <EbookForm />
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1f1f] py-6 text-center text-xs text-gray-500 bg-[#0a0a0a]">
        <p>&copy; {new Date().getFullYear()} ELITE BOUNCE. Sva prava zadržana.</p>
      </footer>

    </div>
  )
}