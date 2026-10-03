'use client'

import { useState, useTransition, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { resetPassword } from './actions'

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default function ResetPasswordPage({ searchParams }: PageProps) {
  const resolvedSearchParams = use(searchParams)
  const token = resolvedSearchParams.token || ''

  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await resetPassword(formData)
      if (result.error) {
        setMessage({ text: result.error, type: 'error' })
      } else if (result.success) {
        setMessage({ text: result.success, type: 'success' })
      }
    })
  }

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
        <div className="w-full max-w-md bg-[#121212] border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-6">
            <span className="text-[#d4af37] font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-[#d4af37]/10 px-3 py-1 rounded border border-[#d4af37]/20 inline-block mb-3">
              NOVA LOZINKA
            </span>
            <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white mb-2">
              Postavi novu lozinku
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
              Unesite svoju novu lozinku u polje ispod.
            </p>
          </div>

          {!token ? (
            <div className="bg-rose-950/40 border border-rose-500/50 text-rose-300 p-4 rounded-lg text-xs text-center space-y-3">
              <p>Link za resetovanje lozinke je nevažeći ili nedostaje token.</p>
              <Link href="/forgot-password" className="inline-block text-[#d4af37] font-bold hover:underline">
                Zatraži novi link &rarr;
              </Link>
            </div>
          ) : (
            <>
              {message && (
                <div className={`p-4 rounded-lg text-xs mb-6 border font-medium ${
                  message.type === 'success' 
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                }`}>
                  {message.text}
                  {message.type === 'success' && (
                    <div className="mt-3">
                      <Link 
                        href="/login" 
                        className="inline-block bg-[#d4af37] text-black font-bold uppercase tracking-wider px-4 py-2 rounded text-[10px]"
                      >
                        Idi na Prijavu &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {message?.type !== 'success' && (
                <form action={handleSubmit} className="space-y-4">
                  <input type="hidden" name="token" value={token} />

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">
                      Nova Lozinka
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      placeholder="Minimalno 6 znakova"
                      className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-3 text-sm text-white focus:border-[#d4af37] outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#d4af37] text-black font-display text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg hover:bg-yellow-600 transition-all shadow-lg shadow-[#d4af37]/10 disabled:opacity-50 cursor-pointer"
                  >
                    {isPending ? 'Spremanje...' : 'Sačuvaj Novu Lozinku'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-[#1f1f1f] py-6 text-center text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} Elite Bounce. Sva prava zadržana.</p>
      </footer>
    </div>
  )
}