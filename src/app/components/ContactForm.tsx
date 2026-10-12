'use client'

import { useState, useTransition } from 'react'

interface ContactFormProps {
  submitInquiryAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
}

export function ContactForm({ submitInquiryAction }: ContactFormProps) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        const result = await submitInquiryAction(formData)
        setStatus(result)
        if (result.success) {
          ;(e.target as HTMLFormElement).reset()
        }
      } catch {
        setStatus({ success: false, message: 'Došlo je do greške. Pokušaj ponovo.' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Ime i Prezime</label>
          <input 
            type="text" 
            name="fullName" 
            required 
            placeholder="npr. John Doe"
            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] font-sans"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Email Adresa</label>
          <input 
            type="email" 
            name="email" 
            required 
            placeholder="john@example.com"
            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] font-sans"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Izaberi Program</label>
        <select 
          name="program" 
          className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] font-sans"
        >
          <option value="The Vertical Protocol">The Vertical Protocol (1 na 1)</option>
          <option value="Bounce Code Virtual">Bounce Code: Virtual</option>
          <option value="Elite Physique">Elite Physique</option>
          <option value="Ostalo / Opći upit">Ostalo / Opći upit</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Poruka / Tvoji ciljevi (trenutni skok, sport)</label>
        <textarea 
          name="message" 
          rows={4}
          required
          placeholder="Npr. Imam 18 godina, igram košarku, trenutni odraz mi je oko 60cm, želim skočiti preko 70cm..."
          className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] font-sans"
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-[#d4af37] hover:bg-yellow-600 disabled:opacity-50 text-black font-display text-xs sm:text-sm font-bold uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-[#d4af37]/10 cursor-pointer"
      >
        {isPending ? 'Slanje u toku...' : 'Pošalji Upit'}
      </button>

      {status && (
        <div className={`p-4 rounded-xl text-xs font-mono text-center ${status.success ? 'bg-green-950/40 border border-green-800 text-green-400' : 'bg-red-950/40 border border-red-900 text-red-400'}`}>
          {status.message}
        </div>
      )}
    </form>
  )
}