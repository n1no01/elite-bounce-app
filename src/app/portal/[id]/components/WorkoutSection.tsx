import Link from 'next/link'

interface Exercise {
  name: string
  desc: string
  reps: string
}

interface Workout {
  id: string
  week_label: string
  phase_title: string
  coach_notes: string | null
  exercises: Exercise[] | string
}

interface WorkoutSectionProps {
  athleteId: string
  weeks: string[]
  selectedWeek: string
  allWorkouts: Workout[]
  currentWeekWorkouts: Workout[]
}

export default function WorkoutSection({
  athleteId,
  weeks,
  selectedWeek,
  allWorkouts,
  currentWeekWorkouts
}: WorkoutSectionProps) {
  return (
    <div className="space-y-8">
      {/* Odabir sedmice (Tabs) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold uppercase text-white tracking-wider">Izaberi Sedmicu Treninga</h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#1f1f1f]">
          {weeks.map((week) => {
            const isSelected = selectedWeek === week
            const hasWorkouts = allWorkouts.some(w => w.week_label === week)

            return (
              <Link
                key={week}
                href={`/portal/${athleteId}?sedmica=${week}`}
                scroll={false}
                className={`px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected 
                    ? 'bg-[#d4af37] text-black font-bold border-[#d4af37] shadow-lg shadow-[#d4af37]/10' 
                    : hasWorkouts
                      ? 'bg-[#121212] text-white border-[#d4af37]/40 hover:border-[#d4af37]'
                      : 'bg-[#121212] text-gray-500 border-[#1f1f1f] hover:text-gray-300'
                }`}
              >
                {week}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Prikaz treninga */}
      <div className="space-y-6">
        <div className="border-b border-[#1f1f1f] pb-3 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold uppercase text-white">
            Plan treninga za <span className="text-[#d4af37]">{selectedWeek}</span>
          </h3>
          <span className="text-xs font-mono text-gray-400">{currentWeekWorkouts.length} treninga objavljeno</span>
        </div>

        {currentWeekWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {currentWeekWorkouts.map((workout) => {
              let exercises: Exercise[] = []
              try {
                exercises = typeof workout.exercises === 'string' 
                  ? JSON.parse(workout.exercises) 
                  : workout.exercises || []
              } catch {
                exercises = []
              }

              return (
                <div key={workout.id} className="bg-[#121212] border border-[#1f1f1f] rounded-xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f1f1f] pb-4">
                    <div>
                      <span className="text-[#d4af37] font-mono text-[10px] font-bold uppercase tracking-widest bg-[#d4af37]/10 px-2.5 py-1 rounded border border-[#d4af37]/20">
                        {workout.week_label}
                      </span>
                      <h4 className="font-display text-xl font-bold uppercase text-white mt-2">
                        {workout.phase_title}
                      </h4>
                    </div>
                  </div>

                  {workout.coach_notes && (
                    <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg text-xs text-gray-300">
                      <span className="text-[#d4af37] font-mono uppercase font-bold block mb-1">Upute i fokus trenera:</span>
                      {workout.coach_notes}
                    </div>
                  )}

                  <div className="space-y-3">
                    <h5 className="text-xs font-mono uppercase text-gray-400 tracking-wider">Propisane vježbe:</h5>
                    <div className="grid grid-cols-1 gap-3">
                      {exercises.map((ex, idx) => (
                        <div key={idx} className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="font-display font-bold text-sm text-white flex items-center gap-2">
                              <span className="text-[#d4af37] font-mono text-xs">{idx + 1}.</span> {ex.name}
                            </div>
                            {ex.desc && <p className="text-xs text-gray-400 font-light">{ex.desc}</p>}
                          </div>
                          {ex.reps && (
                            <div className="self-start sm:self-center bg-[#121212] border border-[#1f1f1f] px-3 py-1.5 rounded text-xs font-mono text-[#d4af37] font-bold whitespace-nowrap">
                              {ex.reps}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-[#121212] border border-[#1f1f1f] rounded-xl p-12 text-center space-y-3">
            <div className="text-2xl">⚡</div>
            <h4 className="font-display text-lg font-bold text-white uppercase">Treninzi još nisu dodijeljeni</h4>
            <p className="text-gray-400 text-xs max-w-md mx-auto font-light">
              Za izabranu sedmicu trener još uvijek nije objavio raspored. Provjeri druge sedmice ili sačekaj da trener unese novi protokol.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}