'use client'

import { useState } from 'react'

interface Exercise {
  name: string
  desc: string
  reps: string
}

interface Workout {
  id: string
  week_label: string
  phase_title: string // npr. "Ponedjeljak - Donji Dio Snaga"
  coach_notes: string | null
  exercises: Exercise[] | string
  created_at: string
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
  
  // Sortiramo treninge da najstariji (prvo napravljeni) bude uvijek prvi u nizu
  const sortedWorkouts = [...currentWeekWorkouts].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  // Držimo indekse ili selektovani trening za aktivni dan (koristimo sortirani niz)
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    sortedWorkouts.length > 0 ? sortedWorkouts[0].id : null
  )

  // Trening koji je trenutno izabran za prikaz
  const activeWorkout = sortedWorkouts.find(w => w.id === selectedWorkoutId) || sortedWorkouts[0]

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Izbor Sedmice (Top Bar) */}
      <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
        <div>
          <span className="text-[#d4af37] font-mono text-[10px] uppercase font-bold tracking-widest block">
            PROTOKOL TRENINGA
          </span>
          <h2 className="font-display text-xl font-bold uppercase text-white mt-0.5">
            {selectedWeek}
          </h2>
        </div>

        {/* Brzi izbor sedmica */}
        <div className="flex gap-1.5 overflow-x-auto">
          {weeks.map((week) => {
            const isSelected = selectedWeek === week
            return (
              <a
                key={week}
                href={`/portal/${athleteId}?sedmica=${week}`}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all border ${
                  isSelected 
                    ? 'bg-[#d4af37] text-black font-bold border-[#d4af37]' 
                    : 'bg-[#121212] text-gray-400 border-[#1f1f1f] hover:text-white'
                }`}
              >
                {week}
              </a>
            )
          })}
        </div>
      </div>

      {/* 2. Dnevna Traka (Kalendarski dani za izabranu sedmicu) */}
      {sortedWorkouts.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {sortedWorkouts.map((workout) => {
              const isSelected = (activeWorkout?.id === workout.id)

              return (
                <button
                  type="button"
                  key={workout.id}
                  onClick={() => setSelectedWorkoutId(workout.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-[#d4af37]/10 border-[#d4af37] text-white shadow-lg shadow-[#d4af37]/5'
                      : 'bg-[#121212] border-[#1f1f1f] text-gray-400 hover:border-[#d4af37]/40 hover:text-white'
                  }`}
                >
                  <span className="font-display text-xs font-bold uppercase line-clamp-1 text-white">
                    {workout.phase_title.split('-')[1] || workout.phase_title}
                  </span>

                  <div className="flex items-center justify-between pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                    <span className="text-[9px] font-mono text-[#d4af37]">Aktivno</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* 3. Prikaz vježbi za IZABRANI Dan */}
          {activeWorkout && (
            <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
                <div>
                  <span className="text-[#d4af37] font-mono text-[10px] font-bold uppercase tracking-widest bg-[#d4af37]/10 px-2.5 py-1 rounded border border-[#d4af37]/20">
                    {activeWorkout.week_label}
                  </span>
                  <h3 className="font-display text-2xl font-black uppercase text-white mt-2">
                    {activeWorkout.phase_title}
                  </h3>
                </div>
              </div>

              {/* Napomena trenera */}
              {activeWorkout.coach_notes && (
                <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-xl text-xs text-gray-300">
                  <span className="text-[#d4af37] font-mono uppercase font-bold block mb-1">
                    Napomena trenera:
                  </span>
                  {activeWorkout.coach_notes}
                </div>
              )}

              {/* Lista vježbi */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider">Propisane vježbe:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {(() => {
                    let exercises: Exercise[] = []
                    try {
                      exercises = typeof activeWorkout.exercises === 'string'
                        ? JSON.parse(activeWorkout.exercises)
                        : activeWorkout.exercises || []
                    } catch {
                      exercises = []
                    }

                    return exercises.map((ex, idx) => (
                      <div key={idx} className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#d4af37]/30 transition-colors">
                        <div className="space-y-1">
                          <div className="font-display font-bold text-sm text-white flex items-center gap-2">
                            <span className="text-[#d4af37] font-mono text-xs">{idx + 1}.</span> {ex.name}
                          </div>
                          {ex.desc && <p className="text-xs text-gray-400 font-light leading-relaxed">{ex.desc}</p>}
                        </div>
                        {ex.reps && (
                          <div className="self-start sm:self-center bg-[#121212] border border-[#1f1f1f] px-3 py-1.5 rounded-lg text-xs font-mono text-[#d4af37] font-bold whitespace-nowrap">
                            {ex.reps}
                          </div>
                        )}
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Prazan State */
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-12 text-center space-y-3">
          <div className="text-2xl">⚡</div>
          <h4 className="font-display text-lg font-bold text-white uppercase">Treninzi još nisu dodijeljeni</h4>
          <p className="text-gray-400 text-xs max-w-md mx-auto font-light">
            Za izabranu sedmicu trener još uvijek nije objavio raspored. Provjeri druge sedmice ili sačekaj da trener unese novi protokol.
          </p>
        </div>
      )}

    </div>
  )
}