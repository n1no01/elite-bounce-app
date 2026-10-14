'use client'

import { useState } from 'react'
import { downloadEbookAction } from '../lib/ebook'

export function EbookForm() {
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    // 1. Sačuvamo formu ovdje prije await-a
    const form = event.currentTarget

    setLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    const formData = new FormData(form)
    const result = await downloadEbookAction(formData)

    setLoading(false)

    if (result.success) {
      setSuccessMessage(result.message || null)
      // 2. Koristimo sačuvanu referencu umjesto event.currentTarget
      form.reset()
    } else {
      setErrorMessage(result.error || 'Došlo je do greške.')
    }
  }

  return (
    <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-6 rounded-xl">
      <h3 className="font-display font-bold text-white uppercase text-sm mb-3 tracking-wider text-center">
        Preuzmi E-Book Odmah
      </h3>

      {successMessage ? (
        <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] p-4 rounded text-xs text-center font-mono">
          {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            type="text" 
            name="name"
            placeholder="Tvoje ime" 
            required
            className="w-full bg-[#121212] border border-[#1f1f1f] rounded px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
          />
          <input 
            type="email" 
            name="email"
            placeholder="Tvoja email adresa" 
            required
            className="w-full bg-[#121212] border border-[#1f1f1f] rounded px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#d4af37] text-black font-display text-xs font-bold uppercase tracking-widest py-3 rounded hover:bg-yellow-600 transition-all cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? 'Slanje...' : 'Besplatno Preuzmi PDF'}
          </button>

          {errorMessage && (
            <p className="text-red-500 text-[11px] text-center font-mono mt-2">{errorMessage}</p>
          )}
        </form>
      )}

      <p className="text-[10px] text-gray-500 text-center mt-3">
        Knjiga stiže direktno na tvoj email u roku od par minuta.
      </p>
    </div>
  )
}