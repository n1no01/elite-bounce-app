// ExerciseUploadForm.tsx
'use client'

import { addExercise } from '../admin/actions' // Tvoja server akcija

export function ExerciseUploadForm() {
  return (
    <form action={addExercise} className="space-y-4 bg-[#0a0a0a] p-4 rounded border border-[#1f1f1f]">
      <div>
        <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Naziv Vježbe</label>
        <input 
          type="text" 
          name="title" 
          required 
          className="w-full bg-[#121212] border border-[#1f1f1f] rounded p-2.5 text-sm text-white focus:border-[#d4af37] outline-none" 
          placeholder="npr. Depth Jump"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Opis (Opcionalno)</label>
        <textarea 
          name="description" 
          rows={2} 
          className="w-full bg-[#121212] border border-[#1f1f1f] rounded p-2.5 text-sm text-white focus:border-[#d4af37] outline-none" 
          placeholder="Upute za izvođenje..."
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">YouTube URL Videa</label>
        <input 
          type="url" 
          name="videoUrl" 
          required 
          className="w-full bg-[#121212] border border-[#1f1f1f] rounded p-2.5 text-sm text-white focus:border-[#d4af37] outline-none" 
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-[#d4af37] text-black font-bold uppercase tracking-wider py-2.5 rounded hover:bg-yellow-600 transition-colors text-xs cursor-pointer"
      >
        Sačuvaj Vježbu
      </button>
    </form>
  )
}