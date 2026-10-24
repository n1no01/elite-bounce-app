'use client'

import { useState } from 'react'

interface Athlete {
  id: string
  full_name: string
  sport: string | null
}

interface Group {
  id: string
  name: string
  description: string | null
  athlete_ids: string[]
}

interface GroupsManagerProps {
  athletes: Athlete[]
  groups: Group[]
  createGroupAction: (formData: FormData) => Promise<void>
  deleteGroupAction: (formData: FormData) => Promise<void>
}

export function GroupsManager({ athletes, groups, createGroupAction, deleteGroupAction }: GroupsManagerProps) {
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAthletes = athletes.filter(a => 
    a.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleAthlete = (id: string) => {
    setSelectedAthleteIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-2xl space-y-6">
      <div className="border-b border-[#1f1f1f] pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold uppercase text-white mt-0.5">
            Upravljanje Grupama ({groups.length})
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Forma za kreiranje grupe */}
        <form action={createGroupAction} className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Naziv Grupe *</label>
              <input 
                type="text" 
                name="groupName" 
                required 
                placeholder="npr. Elite Bounce - Ekipa A"
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:border-[#d4af37] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Opis / Sezona</label>
              <input 
                type="text" 
                name="description" 
                placeholder="npr. Seniori 2026/27"
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:border-[#d4af37] outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono text-gray-400 uppercase">
                Izaberi članove grupe ({selectedAthleteIds.length})
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pretraži..."
                className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-2.5 py-1 text-[11px] text-white focus:border-[#d4af37] outline-none w-36"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl">
              {filteredAthletes.map(a => {
                const isChecked = selectedAthleteIds.includes(a.id)
                return (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => toggleAthlete(a.id)}
                    className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isChecked 
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-white font-bold' 
                        : 'border-[#1f1f1f] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-1">{a.full_name}</span>
                    <span className="text-[10px]">{isChecked ? '✓' : ''}</span>
                  </button>
                )
              })}
            </div>

            {selectedAthleteIds.map(id => (
              <input key={id} type="hidden" name="athleteIds" value={id} />
            ))}
          </div>

          <button 
            type="submit"
            className="bg-[#d4af37] hover:bg-yellow-600 text-black font-display font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all text-xs cursor-pointer"
          >
            Sačuvaj Novu Grupu
          </button>
        </form>

        {/* Lista postojećih grupa */}
        <div className="lg:col-span-5 space-y-3 border-t lg:border-t-0 lg:border-l border-[#1f1f1f] pt-4 lg:pt-0 lg:pl-6">
          <span className="text-xs font-mono text-gray-400 uppercase block">Kreirane Grupe</span>
          
          {groups.length === 0 ? (
            <p className="text-xs text-gray-500 italic">Još nema kreiranih grupa.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {groups.map(g => (
                <div key={g.id} className="bg-[#0a0a0a] border border-[#1f1f1f] p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-sm text-white">{g.name}</div>
                    <div className="text-[10px] font-mono text-gray-400">
                      {g.athlete_ids.length} sportista {g.description ? `• ${g.description}` : ''}
                    </div>
                  </div>
                  <form action={deleteGroupAction}>
                    <input type="hidden" name="groupId" value={g.id} />
                    <button type="submit" className="text-red-400 hover:text-red-300 font-mono text-[10px] border border-red-900/40 px-2 py-1 rounded bg-red-950/20 cursor-pointer">
                      Obriši
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}