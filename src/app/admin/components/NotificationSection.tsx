interface Athlete {
  id: string
  full_name: string
  sport: string | null
}

interface Notification {
  id: string
  athlete_id: string | null
  title: string
  message: string
}

interface NotificationSectionProps {
  athletes: Athlete[]
  notifications: Notification[]
  sendNotification: (formData: FormData) => Promise<void>
  deleteNotification: (formData: FormData) => Promise<void>
}

export function NotificationSection({ athletes, notifications, sendNotification, deleteNotification }: NotificationSectionProps) {
  return (
    <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl space-y-6">
      <div className="border-b border-[#1f1f1f] pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold uppercase text-white mt-1">Pošalji obavijest</h2>
        </div>
      </div>

      <form action={sendNotification} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Kome šalješ?</label>
            <select name="recipientType" defaultValue="all" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
              <option value="all">Svi sportisti</option>
              <option value="single">Pojedinačni sportista</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Izaberi sportistu (Samo za pojedinačno)</label>
            <select name="athleteId" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
              <option value="">-- Izaberi sportistu --</option>
              {athletes.map(a => (
                <option key={a.id} value={a.id}>{a.full_name} ({a.sport || 'Opći'})</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Naslov obavještenja</label>
          <input type="text" name="title" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="npr. Promjena termina treninga" />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Tekst obavještenja / poruke</label>
          <textarea name="message" rows={3} required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="Unesite poruku za sportistu..." />
        </div>

        <button type="submit" className="bg-[#d4af37] text-black font-display font-bold uppercase tracking-wider px-8 py-3 rounded hover:bg-yellow-600 transition-all text-xs cursor-pointer">
          Pošalji Obavještenje
        </button>
      </form>

      <div className="pt-4 border-t border-[#1f1f1f] space-y-3">
        <span className="text-xs font-mono text-gray-400 uppercase">Poslana obavještenja ({notifications.length})</span>
        {notifications.length === 0 ? (
          <p className="text-xs text-gray-500 italic">Nema poslanih obavještenja.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {notifications.map(n => {
              const targetAthlete = athletes.find(a => a.id === n.athlete_id)
              return (
                <div key={n.id} className="bg-[#0a0a0a] p-3 rounded border border-[#1f1f1f] flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{n.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-950/30 border border-yellow-900/40 text-[#d4af37]">
                        {n.athlete_id ? `Za: ${targetAthlete?.full_name || 'Nepoznato'}` : 'Za: Svi sportisti 🌍'}
                      </span>
                    </div>
                    <p className="text-gray-400 mt-1">{n.message}</p>
                  </div>
                  <form action={deleteNotification}>
                    <input type="hidden" name="notificationId" value={n.id} />
                    <button type="submit" className="text-red-400 hover:text-red-300 font-mono border border-red-900/40 px-2 py-1 rounded bg-red-950/20 cursor-pointer text-[10px]">
                      Obriši
                    </button>
                  </form>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}