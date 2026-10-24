'use client'

import { useState } from 'react'
import Link from 'next/link'

interface WorkoutExercise {
  name: string
  desc: string
  reps: string
}

interface Workout {
  id: string
  week_label: string
  phase_title: string
  coach_notes: string | null
  exercises: WorkoutExercise[]
  created_at: string
}

interface WorkoutsSectionProps {
  workouts: Workout[]
  athleteId: string
  deleteWorkout: (formData: FormData) => void
  assignWorkout: (formData: FormData) => void // Server akcija za dodjelu
}

const DAYS_OF_WEEK = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']

export default function WorkoutsSection({ workouts, athleteId, deleteWorkout, assignWorkout }: WorkoutsSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [selectedDay, setSelectedDay] = useState('Ponedjeljak')
  const [focusArea, setFocusArea] = useState('')

  return (
    <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-2xl space-y-6 font-sans">
      
      {/* Header i Dugme za otvaranje forme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
        <div>
          <h2 className="font-display text-xl font-bold uppercase text-white mt-0.5">
            Dodijeljeni Treninzi ({workouts.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#d4af37]/10 hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#d4af37] font-mono text-xs uppercase px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2"
        >
          {isAdding ? '✕ Zatvori Formu' : 'Dodaj Trening'}
        </button>
      </div>

      {/* SKLOPIVA FORMA ZA DODAVANJE TRENINGA */}
      {isAdding && (
        <form action={assignWorkout} className="bg-[#0a0a0a] border border-[#d4af37]/30 p-6 rounded-2xl space-y-4 animate-fadeIn">
          {/* Skriveni input da proslijedimo tačan ID ovog sportiste */}
          <input type="hidden" name="athleteIds" value={athleteId} />

          <div className="font-display font-bold text-sm text-[#d4af37] uppercase">
            Novi Trening
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Sedmica Ciklusa</label>
              <select name="weekLabel" required className="w-full bg-[#121212] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:border-[#d4af37] outline-none font-mono">
                <option value="">-- Izaberi Sedmicu --</option>
                <option value="Sedmica 1">Sedmica 1</option>
                <option value="Sedmica 2">Sedmica 2</option>
                <option value="Sedmica 3">Sedmica 3</option>
                <option value="Sedmica 4">Sedmica 4</option>
                <option value="Sedmica 5">Sedmica 5</option>
                <option value="Sedmica 6">Sedmica 6</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Dan u sedmici</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                {DAYS_OF_WEEK.slice(0, 7).map(day => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`py-2 text-[9px] font-mono uppercase rounded-lg border transition-all cursor-pointer ${
                      selectedDay === day ? 'bg-[#d4af37] text-black font-bold border-[#d4af37]' : 'bg-[#121212] text-gray-400 border-[#1f1f1f]'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Fokus Treninga (Naziv Dana)</label>
            <input 
              type="text" 
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="npr. Donji Dio & Pliometrija" 
              className="w-full bg-[#121212] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:border-[#d4af37] outline-none"
            />
            <input type="hidden" name="dayLabel" value={`${selectedDay}${focusArea ? ` - ${focusArea}` : ''}`} />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Upute / Napomena Trenera</label>
            <textarea name="coachNotes" rows={2} placeholder="Fokus na kontakt sa podlogom..." className="w-full bg-[#121212] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:border-[#d4af37] outline-none" />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">
              Vježbe (Naziv | Opis | Serije - svaka u novi red)
            </label>
            <textarea 
              name="exercisesText" 
              rows={4} 
              required
              placeholder={"Trap Bar Jump | Eksplozivan izbačaj | 4 x 3\nDepth Jump | Minimalan kontakt | 3 x 4"} 
              className="w-full bg-[#121212] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:border-[#d4af37] outline-none font-mono" 
            />
          </div>

          <div className="flex justify-start gap-2 pt-2">
             <button 
              type="submit"
              className="bg-[#d4af37] hover:bg-yellow-600 text-black font-display font-bold uppercase tracking-wider px-6 py-2 rounded-xl transition-all text-xs cursor-pointer"
            >
              Dodijeli trening
            </button>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white border border-[#1f1f1f]"
            >
              Otkaži
            </button>
          </div>
        </form>
      )}

      {/* Lista postojećih treninga */}
      {workouts.length === 0 ? (
        <p className="text-xs text-gray-500 italic py-2">Nema dodijeljenih treninga za ovog sportistu.</p>
      ) : (
        <div className="space-y-4">
          {workouts.map(w => (
            <div key={w.id} className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 sm:p-6 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#d4af37] font-mono text-[10px] uppercase font-bold tracking-wider">{w.week_label}</span>
                  <h3 className="text-white font-display font-bold text-base mt-0.5">{w.phase_title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/athletes/${athleteId}?editWorkoutId=${w.id}`}
                    className="text-blue-400 hover:text-blue-300 border border-blue-900/40 bg-blue-950/20 px-3 py-1 rounded cursor-pointer text-xs font-mono"
                  >
                    Uredi
                  </Link>
                  <form action={deleteWorkout}>
                    <input type="hidden" name="workoutId" value={w.id} />
                    <input type="hidden" name="athleteId" value={athleteId} />
                    <button type="submit" className="text-red-400 hover:text-red-300 border border-red-900/40 bg-red-950/20 px-3 py-1 rounded cursor-pointer text-xs font-mono">
                      Ukloni trening
                    </button>
                  </form>
                </div>
              </div>

              {w.coach_notes && (
                <div className="text-xs text-gray-400 bg-[#121212] p-3 rounded-xl border border-[#1f1f1f]">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Napomena trenera:</span>
                  {w.coach_notes}
                </div>
              )}

              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Vježbe:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Array.isArray(w.exercises) && w.exercises.map((ex, idx) => (
                    <div key={idx} className="bg-[#121212] p-3 rounded-xl border border-[#1f1f1f] text-xs font-mono flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{ex.name}</div>
                        {ex.desc && <div className="text-[10px] text-gray-400">{ex.desc}</div>}
                      </div>
                      {ex.reps && <div className="text-[#d4af37] font-bold text-[11px] whitespace-nowrap pl-2">{ex.reps}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}