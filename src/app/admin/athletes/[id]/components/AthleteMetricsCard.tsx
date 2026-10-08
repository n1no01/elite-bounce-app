interface AthleteMetricsCardProps {
  athlete: {
    id: string
    notes: string | null
    height: number | null
    weight: number | null
    squat_1rm: number | null
    clean_1rm: number | null
  }
  updateAthleteNotes: (formData: FormData) => void
  updateAthleteMetrics: (formData: FormData) => void
}

export default function AthleteMetricsCard({ 
  athlete, 
  updateAthleteNotes, 
  updateAthleteMetrics 
}: AthleteMetricsCardProps) {
  const weightVal = athlete.weight ? Number(athlete.weight) : 0
  const squatRatio = weightVal > 0 && athlete.squat_1rm ? (Number(athlete.squat_1rm) / weightVal).toFixed(2) : null
  const cleanRatio = weightVal > 0 && athlete.clean_1rm ? (Number(athlete.clean_1rm) / weightVal).toFixed(2) : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Forma za uređivanje Bilješki */}
      <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg space-y-3">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">Bilješke i napomene</span>
        <form action={updateAthleteNotes} className="space-y-3">
          <input type="hidden" name="athleteId" value={athlete.id} />
          <textarea 
            name="notes" 
            defaultValue={athlete.notes || ''} 
            rows={3}
            placeholder="Unesi bilješke o sportisti..."
            className="w-full bg-[#121212] border border-[#1f1f1f] rounded p-2 text-xs text-white font-mono"
          />
          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-3 py-1.5 rounded bg-gray-800 border border-gray-700 text-gray-200 font-bold text-[11px] uppercase font-mono hover:bg-gray-700 cursor-pointer"
            >
              Sačuvaj bilješke
            </button>
          </div>
        </form>
      </div>

      {/* Forma za Antropometriju i 1RM (sa procentima mase) */}
      <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg space-y-3">
        <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider block font-bold">Antropometrija i 1RM (Snaga)</span>
        <form action={updateAthleteMetrics} className="space-y-3">
          <input type="hidden" name="athleteId" value={athlete.id} />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Visina (cm)</label>
              <input 
                type="number" 
                step="0.5"
                name="height" 
                defaultValue={athlete.height ?? ''} 
                placeholder="npr. 182"
                className="w-full bg-[#121212] border border-[#1f1f1f] rounded p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Masa (kg)</label>
              <input 
                type="number" 
                step="0.5"
                name="weight" 
                defaultValue={athlete.weight ?? ''} 
                placeholder="npr. 78.5"
                className="w-full bg-[#121212] border border-[#1f1f1f] rounded p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Back Squat (kg)</label>
                {squatRatio && <span className="text-[10px] font-mono text-[#d4af37] font-bold">{squatRatio}x</span>}
              </div>
              <input 
                type="number" 
                step="0.5"
                name="squat_1rm" 
                defaultValue={athlete.squat_1rm ?? ''} 
                placeholder="npr. 140"
                className="w-full bg-[#121212] border border-[#1f1f1f] rounded p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Power Clean (kg)</label>
                {cleanRatio && <span className="text-[10px] font-mono text-[#d4af37] font-bold">{cleanRatio}x</span>}
              </div>
              <input 
                type="number" 
                step="0.5"
                name="clean_1rm" 
                defaultValue={athlete.clean_1rm ?? ''} 
                placeholder="npr. 100"
                className="w-full bg-[#121212] border border-[#1f1f1f] rounded p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-3 py-1.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] font-bold text-[11px] uppercase font-mono hover:bg-[#d4af37]/30 cursor-pointer"
            >
              Sačuvaj metrike
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}