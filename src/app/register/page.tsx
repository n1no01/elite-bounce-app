import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '../lib/db'
import dns from 'dns/promises'

// Funkcija koja provjerava da li email domena stvarno postoji i prima mailove
async function isValidEmailDomain(email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1]
    if (!domain) return false

    // Provjeri MX (Mail Exchange) zapise za domenu
    const mxRecords = await dns.resolveMx(domain)
    return Array.isArray(mxRecords) && mxRecords.length > 0
  } catch {
    // Ako DNS upit pukne (domena ne postoji), vrati false
    return false
  }
}

async function handleRegister(formData: FormData) {
  'use server'
  const fullName = (formData.get('full_name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const passwordInput = (formData.get('password') as string)?.trim()
  const gender = (formData.get('gender') as string)?.trim() || 'm'
  const birthDateStr = (formData.get('birth_date') as string)?.trim()

  if (!fullName || !email || !passwordInput || !birthDateStr) {
    redirect('/register?error=missing')
  }

  // 1. Validacija: Provjeri da li mail ima stvarnu domenu koja prima poštu
  const isDomainValid = await isValidEmailDomain(email)
  if (!isDomainValid) {
    redirect('/register?error=invalid_domain')
  }

  // Izračunaj godine
  const birthDate = new Date(birthDateStr)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  let athleteId: string

  try {
    // 2. Provjeri da li sportista već postoji sa tim emailom
    const existing = await query<{ id: string }>(
      'SELECT id FROM athletes WHERE email = $1',
      [email]
    )

    if (existing.rows.length > 0) {
      redirect('/register?error=exists')
    }

    // 3. Ubaci novog korisnika u bazu sa čistom lozinkom (bez hesiranja)
    const result = await query<{ id: string }>(
      'INSERT INTO athletes (full_name, email, password, gender, age) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [fullName, email, passwordInput, gender, age]
    )

    athleteId = result.rows[0].id

    // 4. Postavi kolačić
    const cookieStore = await cookies()
    cookieStore.set('athlete_session', athleteId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
  } catch (err: unknown) {
    if (
      typeof err === 'object' && 
      err !== null && 
      'digest' in err && 
      typeof (err as { digest: unknown }).digest === 'string' && 
      (err as { digest: string }).digest.includes('NEXT_REDIRECT')
    ) {
      throw err
    }
    
    console.error("Greška pri registraciji u bazi:", err)
    redirect('/register?error=server')
  }

  redirect(`/portal/${athleteId}`)
}

interface PageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const params = await searchParams
  const errorType = params.error

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex flex-col justify-between selection:bg-[#d4af37] selection:text-black">
      {/* GORNJA NAVIGACIJA */}
      <header className="w-full border-b border-[#1f1f1f] bg-[#0a0a0a]/85 backdrop-blur-md">
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
            href="/login" 
            className="text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-[#d4af37] transition-colors"
          >
            &larr; Već imaš nalog? Prijavi se
          </Link>
        </div>
      </header>

      {/* GLAVNI SADRŽAJ - REGISTRACIJSKA FORMA */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#121212] border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8">
            <span className="text-[#d4af37] font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-[#d4af37]/10 px-3 py-1 rounded border border-[#d4af37]/20 inline-block mb-3">
              ELITE BOUNCE
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              REGISTRACIJA
            </h1>
          </div>

          {errorType && (
            <div className="mb-6 bg-red-950/40 border border-red-900/50 p-3 rounded-lg text-red-400 text-xs font-mono text-center">
              {errorType === 'exists' && 'Korisnik s ovim emailom već postoji.'}
              {errorType === 'missing' && 'Molimo popunite sva obavezna polja.'}
              {errorType === 'invalid_domain' && 'Uneseni email koristi nevažeću ili nepostojeću domenu.'}
              {errorType === 'server' && 'Došlo je do greške. Pokušajte ponovo.'}
            </div>
          )}

          <form action={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                Ime i prezime
              </label>
              <input 
                type="text" 
                name="full_name"
                required
                placeholder="npr. John Doe"
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                Email
              </label>
              <input 
                type="email" 
                name="email"
                required
                placeholder="npr. imeprezime@gmail.com"
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
                required
                placeholder="Kreiraj svoju lozinku..."
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                  Spol
                </label>
                <select
                  name="gender"
                  required
                  className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                >
                  <option value="m">Muški</option>
                  <option value="f">Ženski</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                  Datum rođenja
                </label>
                <input 
                  type="date" 
                  name="birth_date"
                  required
                  className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#d4af37] text-black font-display text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg hover:bg-yellow-600 transition-all shadow-lg shadow-[#d4af37]/10 mt-2 cursor-pointer"
            >
              Napravi nalog
            </button>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1f1f] py-6 text-center text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} Elite Bounce. Sva prava zadržana.</p>
      </footer>
    </div>
  )
}