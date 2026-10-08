interface CredentialsFormProps {
  athleteId: string
  currentEmail: string | null
  updateCredentials: (formData: FormData) => void
}

export default function CredentialsForm({ athleteId, currentEmail, updateCredentials }: CredentialsFormProps) {
  return (
    <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="border-b border-[#1f1f1f] pb-4">
        <h2 className="font-display text-xl font-bold uppercase text-white mt-1">Izmjena Pristupnih Podataka</h2>
      </div>

      <form action={updateCredentials} className="space-y-4 max-w-lg">
        <input type="hidden" name="athleteId" value={athleteId} />
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Email adresa</label>
          <input 
            type="email" 
            name="email" 
            defaultValue={currentEmail || ''} 
            required 
            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-3 text-sm text-white focus:border-[#d4af37] outline-none" 
            placeholder="tvoj.email@domain.com"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Nova lozinka (ostavi prazno ako ne mijenjaš)</label>
          <input 
            type="password" 
            name="password" 
            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-3 text-sm text-white focus:border-[#d4af37] outline-none" 
            placeholder="Unesi novu lozinku"
          />
        </div>
        <button 
          type="submit" 
          className="bg-[#d4af37] text-black font-display font-bold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all text-xs cursor-pointer"
        >
          Sačuvaj Nove Podatke
        </button>
      </form>
    </div>
  )
}