'use client'

import { useState } from 'react'
import { assignWorkout } from '../admin/actions'

interface Exercise {
  id: string
  title: string
  category: string | null
  description: string | null
  video_url: string
}

interface Athlete {
  id: string
  full_name: string
}

interface SelectedExercise {
  title: string
  desc: string
  reps: string
  video_url: string
}

export function AssignWorkoutForm({ 
  athletes, 
  exerciseLibrary 
}: { 
  athletes: Athlete[]
  exerciseLibrary: Exercise[] 
}) {
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([])
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>('')
  const [setsRepsInput, setSetsRepsInput] = useState<string>('')

  // Dodavanje izabrane vježbe iz baze u trenutni trening
  const handleAddExercise = () => {
    const ex = exerciseLibrary.find(e => e.id === selectedLibraryId)
    if (!ex) return

    setSelectedExercises(prev => [
      ...prev,
      {
        title: ex.title,
        desc: ex.description || '',
        reps: setsRepsInput || '3 x 10',
        video_url: ex.video_url
      }
    ])

    setSelectedLibraryId('')
    setSetsRepsInput('')
  }

  // Uklanjanje vježbe sa liste treninga
  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index))
  }

  // Formatiranje u tekstualni format kakav server prihvata (Naziv | Opis | Serije | VideoURL)
  const exercisesTextFormatted = selectedExercises
    .map(e => `${e.title} | ${e.desc} | ${e.reps} | ${e.video_url}`)
    .join('\n')

  return (
    <form action={assignWorkout} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Izaberi Sportistu</label>
          <select name="athleteId" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
            <option value="">-- Izaberi --</option>
            {athletes.map(a => (
              <option key={a.id} value={a.id}>{a.full_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Izaberi Sedmicu</label>
          <select name="weekLabel" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
            <option value="">-- Sedmica --</option>
            <option value="Sedmica 1">Sedmica 1</option>
            <option value="Sedmica 2">Sedmica 2</option>
            <option value="Sedmica 3">Sedmica 3</option>
            <option value="Sedmica 4">Sedmica 4</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Dan i Fokus Treninga</label>
          <input type="text" name="dayLabel" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="npr. Dan 1 - Apsolutna Snaga" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Video Treninga / Objašnjenje (Opcionalno)</label>
        <input type="url" name="videoUrl" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="https://www.youtube.com/watch?v=..." />
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Komentar / Napomena Trenera</label>
        <textarea name="coachNotes" rows={2} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="Upute za izvođenje, zagrijavanje..." />
      </div>

      {/* Birač vježbi iz Baze */}
      <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg space-y-4">
        <span className="text-xs font-mono text-[#d4af37] uppercase font-bold">Dodaj vježbu iz Baze Vježbi:</span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select 
            value={selectedLibraryId} 
            onChange={(e) => setSelectedLibraryId(e.target.value)}
            className="bg-[#121212] border border-[#1f1f1f] rounded p-2.5 text-xs text-white focus:border-[#d4af37] outline-none"
          >
            <option value="">-- Izaberi vježbu --</option>
            {exerciseLibrary.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.title} {ex.category ? `(${ex.category})` : ''}
              </option>
            ))}
          </select>

          <input 
            type="text" 
            value={setsRepsInput} 
            onChange={(e) => setSetsRepsInput(e.target.value)}
            placeholder="Serije x Ponavljanja (npr. 4x5 ili 3x20m)" 
            className="bg-[#121212] border border-[#1f1f1f] rounded p-2.5 text-xs text-white focus:border-[#d4af37] outline-none"
          />

          <button 
            type="button" 
            onClick={handleAddExercise} 
            className="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[#d4af37] border border-[#d4af37]/30 font-bold text-xs uppercase rounded py-2.5 transition-colors"
          >
            + Ubaci u trening
          </button>
        </div>

        {/* Lista izabranih vježbi za ovaj trening */}
        {selectedExercises.length > 0 && (
          <div className="mt-4 space-y-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Dodane vježbe u ovom treningu:</span>
            {selectedExercises.map((ex, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#121212] p-2.5 rounded border border-[#1f1f1f] text-xs">
                <div>
                  <span className="font-bold text-white">{ex.title}</span>
                  <span className="text-gray-400 ml-2">({ex.reps})</span>
                  {ex.video_url && <span className="text-[#d4af37] ml-2 text-[10px]">🎬 Video povezan</span>}
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveExercise(idx)}
                  className="text-red-400 hover:text-red-300 text-[10px] uppercase font-mono"
                >
                  Ukloni
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skriveno polje u koje stavljamo izgenerisani format vježbi */}
      <input type="hidden" name="exercisesText" value={exercisesTextFormatted} />

      <button type="submit" className="bg-[#d4af37] text-black font-display font-bold uppercase tracking-wider px-8 py-3 rounded hover:bg-yellow-600 transition-all text-xs cursor-pointer">
        Objavi Trening za Izabranu Sedmicu
      </button>
    </form>
  )
}