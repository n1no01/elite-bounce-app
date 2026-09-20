'use client'

import { useState } from 'react'
import { updateWorkout, deleteWorkout } from './actions'

interface WorkoutExercise {
  name: string
  desc: string
  reps: string
}

interface Workout {
  id: string
  athlete_id: string
  week_label: string
  phase_title: string
  coach_notes: string | null
  exercises: WorkoutExercise[]
  created_at: string
}

export function WorkoutsManager({ workouts }: { workouts: Workout[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  if (workouts.length === 0) {
    return <p className="text-[11px] text-gray-500 italic">Nema dodijeljenih treninga.</p>
  }

  return (
    <div className="space-y-3 max-h-60 overflow-y-auto">
      {workouts.map(w => {
        const isEditing = editingId === w.id
        const exercisesFormatted = Array.isArray(w.exercises) 
          ? w.exercises.map(ex => `${ex.name} | ${ex.desc} | ${ex.reps}`).join('\n')
          : ''

        return (
          <div key={w.id} className="bg-[#121212] p-3 rounded border border-[#1f1f1f] text-xs space-y-2">
            {!isEditing ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold">{w.week_label} - {w.phase_title}</span>
                  {w.coach_notes && <p className="text-[10px] text-gray-400 line-clamp-1">{w.coach_notes}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setEditingId(w.id)}
                    className="text-yellow-400 hover:text-yellow-300 font-mono border border-yellow-900/40 px-2 py-1 rounded bg-yellow-950/20 cursor-pointer text-[10px]"
                  >
                    Izmijeni
                  </button>
                  <form action={deleteWorkout}>
                    <input type="hidden" name="workoutId" value={w.id} />
                    <button type="submit" className="text-red-400 hover:text-red-300 font-mono border border-red-900/40 px-2 py-1 rounded bg-red-950/20 cursor-pointer text-[10px]">
                      Ukloni
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <form action={async (formData) => {
                await updateWorkout(formData)
                setEditingId(null)
              }} className="space-y-2">
                <input type="hidden" name="workoutId" value={w.id} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" name="weekLabel" defaultValue={w.week_label} required className="bg-[#0a0a0a] border border-[#1f1f1f] rounded p-1 text-white text-[11px]" />
                  <input type="text" name="dayLabel" defaultValue={w.phase_title} required className="bg-[#0a0a0a] border border-[#1f1f1f] rounded p-1 text-white text-[11px]" />
                </div>
                <textarea name="coachNotes" defaultValue={w.coach_notes || ''} rows={2} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-1 text-white text-[11px]" placeholder="Napomena..." />
                <textarea name="exercisesText" defaultValue={exercisesFormatted} rows={3} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-1 text-white font-mono text-[10px]" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingId(null)} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-[10px]">Otkaži</button>
                  <button type="submit" className="px-2 py-1 bg-[#d4af37] text-black font-bold rounded text-[10px]">Sačuvaj</button>
                </div>
              </form>
            )}
          </div>
        )
      })}
    </div>
  )
}