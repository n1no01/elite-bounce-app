import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '../lib/db'

async function handleLogin(formData: FormData) {
  'use server'
  const identifier = (formData.get('identifier') as string)?.trim()
  const passwordInput = (formData.get('password') as string)?.trim()

  if (!identifier) return

  // 1. Provjera da li je unesena admin lozinka (u polje za identifikaciju ili lozinku)
  if (identifier === process.env.ADMIN_PASSWORD || passwordInput === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    redirect('/admin')
  }

  // 2. Provjera prijave za sportistu (email + password iz baze)
  let result;
  if (passwordInput) {
    // Ako je unesena i šifra, provjeri kombinaciju email/username i password
    result = await query<{ id: string }>(
      'SELECT id FROM athletes WHERE (email = $1 OR full_name ILIKE $1) AND password = $2', 
      [identifier.toLowerCase(), passwordInput]
    )
  } else {
    // Ako je unesen samo email/identifier (fallback ako sportista nema šifru u bazi)
    result = await query<{ id: string }>(
      'SELECT id FROM athletes WHERE email = $1 OR full_name ILIKE $1', 
      [identifier.toLowerCase()]
    )
  }
  
  if (result.rows.length > 0) {
    const athleteId = result.rows[0].id
    
    // Postavi i kolačić za sportistu da ostane prijavljen (opcionalno ali korisno za portal)
    const cookieStore = await cookies()
    cookieStore.set('athlete_session', athleteId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    redirect(`/portal/${athleteId}`)
  } else {
    redirect('/login?error=true')
  }
}

interface PageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams
  const hasError = params.error === 'true'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex flex-col justify-between selection:bg-[#d4af37] selection:text-black">
      {/* GORNJA NAVIGACIJA */}
      <header className="w-full border-b border-[#1f1f1f] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center group py-2">
            <Image 
              src="/logo.png" 
              alt="Elite Bounce Logo" 
              width={400} 
              height={150} 
              priority 
              className="h-16 w-auto object-contain"
            />
          </Link>
          <Link 
            href="/" 
            className="text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-[#d4af37] transition-colors"
          >
            &larr; Nazad na početnu
          </Link>
        </div>
      </header>

      {/* GLAVNI SADRŽAJ - LOGIN FORMA */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#121212] border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8">
            <span className="text-[#d4af37] font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-[#d4af37]/10 px-3 py-1 rounded border border-[#d4af37]/20 inline-block mb-3">
              ELITE BOUNCE
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              DOBRODOŠLI
            </h1>
        
          </div>

          {hasError && (
            <div className="mb-6 bg-red-950/40 border border-red-900/50 p-3 rounded-lg text-red-400 text-xs font-mono text-center">
              Pogrešni pristupni podaci. Provjeri email i šifru.
            </div>
          )}

          <form action={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                Email
              </label>
              <input 
                type="text" 
                name="identifier"
                required
                placeholder="npr. sportista@domain.com"
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                Lozinka
              </label>
              <input 
                type="password" 
                name="password"
                placeholder="Unesi svoju šifru..."
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#d4af37] text-black font-display text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg hover:bg-yellow-600 transition-all shadow-lg shadow-[#d4af37]/10 mt-2 cursor-pointer"
            >
              Prijavi se
            </button>
          </form>
          {/* Dodaj ovo ispod zatvaranja </form> na login stranici */}
          <div className="mt-6 text-center text-xs text-gray-500 font-mono">
            Nemate nalog?{' '}
            <Link href="/register" className="text-[#d4af37] hover:underline">
            Registrujte se ovdje
            </Link>
          </div>
          
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1f1f] py-6 text-center text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} Elite Bounce. Sva prava zadržana.</p>
      </footer>
    </div>
  )
}