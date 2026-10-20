interface Athlete {
  id: string
  full_name: string
  sport: string | null
}

interface WorkoutAssignSectionProps {
  athletes: Athlete[]
  assignWorkout: (formData: FormData) => Promise<void>
}

export function WorkoutAssignSection({ athletes, assignWorkout }: WorkoutAssignSectionProps) {
  return (
    <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl">
      <h2 className="font-display text-xl font-bold uppercase mb-6 text-white">Dodijeli Trening</h2>
      <form action={assignWorkout} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="space-y-2">
            <label className="block text-xs font-mono text-gray-400 uppercase">Izaberi Sportiste (Drži Ctrl/Cmd za više)</label>
            <select 
              name="athleteIds" 
              multiple 
              required 
              className="w-full h-36 bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none font-mono"
            >
              <option value="all" className="font-bold text-[#d4af37] py-1">⚡ DODIJELI SVIMA (Cijela grupa)</option>
              {athletes.map(a => (
                <option key={a.id} value={a.id} className="py-1">
                  {a.full_name}
                </option>
              ))}
            </select>
            <p className="text-[10px] font-mono text-gray-500">Možeš selektovati više sportista odjednom.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Izaberi Sedmicu</label>
              <select name="weekLabel" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
                <option value="">-- Sedmica --</option>
                <option value="Sedmica 1">Sedmica 1</option>
                <option value="Sedmica 2">Sedmica 2</option>
                <option value="Sedmica 3">Sedmica 3</option>
                <option value="Sedmica 4">Sedmica 4</option>
                <option value="Sedmica 5">Sedmica 5</option>
                <option value="Sedmica 6">Sedmica 6</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Dan i Fokus Treninga</label>
              <input type="text" name="dayLabel" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="npr. Dan 1 - Apsolutna Snaga" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Komentar / Napomena Trenera</label>
            <textarea name="coachNotes" rows={5} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="Upute za izvođenje, zagrijavanje..." />
          </div>

        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">
            Vježbe (Format: Naziv | Opis | Serije - svaka u novi red)
          </label>
          <textarea name="exercisesText" rows={4} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none font-mono text-xs" placeholder="A-Skips | Mehanika sprinta | 3 x 20m&#10;Depth Jumps | Minimalan kontakt | 4 x 4" />
        </div>

        <button type="submit" className="bg-[#d4af37] text-black font-display font-bold uppercase tracking-wider px-8 py-3 rounded hover:bg-yellow-600 transition-all text-xs cursor-pointer">
          Dodijeli Trening
        </button>
      </form>
    </div>
  )
}