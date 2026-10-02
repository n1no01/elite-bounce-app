'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DeleteExerciseButton } from '../components/DeleteExerciseButton' // Prilagodi putanju po potrebi

interface Exercise {
  id: string
  title: string
  description: string | null
  video_url: string
  created_at: string
}

interface ExercisesClientProps {
  initialExercises: Exercise[]
  isAdmin: boolean
  deleteExercise: (formData: FormData) => Promise<void>
}

// Pomoćna funkcija za pretvaranje bilo kojeg YouTube linka u ispravan /embed/ format
function getYouTubeEmbedUrl(url: string) {
  if (!url) return null

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?modestbranding=1&rel=0`
  }

  return url
}

export function ExercisesClient({ initialExercises, isAdmin, deleteExercise }: ExercisesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filtriranje vježbi na osnovu unesenog naziva ili opisa
  const filteredExercises = initialExercises.filter((ex) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true
    return (
      ex.title.toLowerCase().includes(query) ||
      (ex.description && ex.description.toLowerCase().includes(query))
    )
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="border-b border-[#1f1f1f] pb-6 flex items-center justify-between gap-4">
          <div>
            <span className="text-[#d4af37] font-mono text-xs font-bold uppercase tracking-widest">
              VIDEO BIBLIOTEKA
            </span>
            <h1 className="font-display text-3xl font-black uppercase text-white mt-1 flex items-center gap-2">
              Sve Vježbe <span className="text-[#d4af37] font-mono text-xl font-normal">({initialExercises.length})</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors whitespace-nowrap"
              >
                ← Nazad na Admin
              </Link>
            )}
          </div>
        </header>

        {/* Search Input */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pretraži vježbe po nazivu..."
            className="w-full bg-[#121212] border border-[#1f1f1f] rounded-xl px-4 py-3 pl-10 text-sm text-white focus:border-[#d4af37] outline-none transition-colors font-mono"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          )}
        </div>

        {/* Grid sa vježbama */}
        {initialExercises.length === 0 ? (
          <div className="bg-[#121212] border border-[#1f1f1f] p-8 rounded-xl text-center">
            <p className="text-gray-500 text-sm italic">Trenutno nema unesenih vježbi u biblioteci.</p>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="bg-[#121212] border border-[#1f1f1f] p-8 rounded-xl text-center">
            <p className="text-gray-500 text-sm italic">
              Nijedna vježba ne odgovara pretrazi &quot;{searchQuery}&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((ex) => {
              const isYouTube = ex.video_url.includes('youtube.com') || ex.video_url.includes('youtu.be')
              const embedUrl = getYouTubeEmbedUrl(ex.video_url)

              return (
                <div key={ex.id} className="bg-[#121212] border border-[#1f1f1f] rounded-xl overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="aspect-video bg-black w-full border-b border-[#1f1f1f]">
                      {isYouTube ? (
                        <iframe
                          src={embedUrl || ''}
                          title={ex.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={ex.video_url}
                          controls
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-display font-bold text-white text-lg">{ex.title}</h3>
                      {ex.description && (
                        <p className="text-gray-400 text-xs leading-relaxed">{ex.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Dugme za brisanje - vidljivo samo adminu */}
                  {isAdmin && (
                    <div className="p-4 border-t border-[#1f1f1f] bg-[#0a0a0a] flex justify-end">
                      <DeleteExerciseButton
                        exerciseId={ex.id}
                        exerciseTitle={ex.title}
                        deleteAction={deleteExercise}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}