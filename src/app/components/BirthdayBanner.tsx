'tsx'
interface Athlete {
  birth_date: string | Date | null
  full_name: string
}

export default function BirthdayBanner({ athlete }: { athlete: Athlete }) {
  if (!athlete.birth_date) return null

  // Parsiramo datum rođenja bez pomicanja vremenske zone (uzimamo lokalni mjesec i dan)
  const bDate = typeof athlete.birth_date === 'string' 
    ? new Date(athlete.birth_date.split('T')[0] + 'T00:00:00') 
    : new Date(athlete.birth_date)

  const today = new Date()

  // Provjeravamo da li se poklapaju dan i mjesec
  const isBirthday = 
    bDate.getDate() === today.getDate() && 
    bDate.getMonth() === today.getMonth()

  if (!isBirthday) return null

  return (
    <div className="bg-gradient-to-r from-[#d4af37]/30 via-[#121212] to-[#121212] border-2 border-[#d4af37] rounded-2xl p-6 sm:p-8 space-y-3 shadow-2xl shadow-[#d4af37]/20 relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 text-8xl opacity-10 pointer-events-none">
        🎂
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#d4af37] text-black flex items-center justify-center text-2xl font-bold shadow-lg">
          🎉
        </div>
        <div>
          <span className="text-[#d4af37] font-mono text-[10px] font-bold uppercase tracking-widest">
            POSEBAN DAN
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-white">
            Sretan rođendan, {athlete.full_name}! 🎂
          </h2>
        </div>
      </div>
      <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed max-w-2xl">
        Cijeli Elite Bounce tim ti želi sretan rođendan! Nastavi gaziti, ruši svoje granice i dominiraj svake sekunde treninga. Idemo jako!
      </p>
    </div>
  )
}