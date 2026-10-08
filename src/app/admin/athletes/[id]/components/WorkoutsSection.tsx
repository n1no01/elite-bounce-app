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
}

export default function WorkoutsSection({ workouts, athleteId, deleteWorkout }: WorkoutsSectionProps) {
  return (
    <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
        <h2 className="font-display text-xl font-bold uppercase text-white">Dodijeljeni Treninzi ({workouts.length})</h2>
      </div>

      {workouts.length === 0 ? (
        <p className="text-xs text-gray-500 italic py-2">Nema dodijeljenih treninga za ovog sportistu.</p>
      ) : (
        <div className="space-y-4">
          {workouts.map(w => (
            <div key={w.id} className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#d4af37] font-mono text-[10px] uppercase font-bold tracking-wider">{w.week_label}</span>
                  <h3 className="text-white font-display font-bold text-base">{w.phase_title}</h3>
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
                <div className="text-xs text-gray-400 bg-[#121212] p-3 rounded border border-[#1f1f1f]">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Napomena trenera:</span>
                  {w.coach_notes}
                </div>
              )}

              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Vježbe:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Array.isArray(w.exercises) && w.exercises.map((ex, idx) => (
                    <div key={idx} className="bg-[#121212] p-2.5 rounded border border-[#1f1f1f] text-xs font-mono flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{ex.name}</div>
                        {ex.desc && <div className="text-[10px] text-gray-400">{ex.desc}</div>}
                      </div>
                      {ex.reps && <div className="text-[#d4af37] font-bold text-[11px]">{ex.reps}</div>}
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