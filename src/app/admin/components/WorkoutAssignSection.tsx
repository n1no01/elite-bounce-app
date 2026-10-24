'use client'

import { useState, useMemo } from 'react'

interface Athlete {
  id: string
  full_name: string
  sport: string | null
}

interface Group {
  id: string
  name: string
  athlete_ids: string[]
}

interface WorkoutAssignSectionProps {
  athletes: Athlete[]
  groups?: Group[]
  assignWorkout: (formData: FormData) => Promise<void>
}

const DAYS_OF_WEEK = [
  'Ponedjeljak',
  'Utorak',
  'Srijeda',
  'Četvrtak',
  'Petak',
  'Subota',
  'Nedjelja'
]

export function WorkoutAssignSection({ athletes, groups = [], assignWorkout }: WorkoutAssignSectionProps) {
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sportFilter, setSportFilter] = useState<string>('all')
  const [showAllAthletes, setShowAllAthletes] = useState(false)
  
  const [selectedDay, setSelectedDay] = useState('Ponedjeljak')
  const [focusArea, setFocusArea] = useState('')

  // Svi jedinstveni sportovi iz baze za filter dropdown
  const uniqueSports = useMemo(() => {
    const sports = athletes.map(a => a.sport).filter(Boolean) as string[]
    return Array.from(new Set(sports))
  }, [athletes])

  // Filtriranje sportista po Search upitu i Sport filteru
  const filteredAthletes = useMemo(() => {
    return athletes.filter(a => {
      const matchesSearch = a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (a.sport && a.sport.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesSport = sportFilter === 'all' || a.sport === sportFilter
      return matchesSearch && matchesSport
    })
  }, [athletes, searchQuery, sportFilter])

  // Selektuj / Odselektuj SVE trenutno prikazane sportiste
  const toggleSelectFiltered = () => {
    const filteredIds = filteredAthletes.map(a => a.id)
    const allFilteredSelected = filteredIds.every(id => selectedAthleteIds.includes(id))

    if (allFilteredSelected) {
      setSelectedAthleteIds(prev => prev.filter(id => !filteredIds.includes(id)))
    } else {
      setSelectedAthleteIds(prev => Array.from(new Set([...prev, ...filteredIds])))
    }
  }

  // Učitaj sve članove odabrane grupe
  const handleSelectGroup = (groupId: string) => {
    if (!groupId) return
    const group = groups.find(g => g.id === groupId)
    if (group && group.athlete_ids) {
      setSelectedAthleteIds(prev => Array.from(new Set([...prev, ...group.athlete_ids])))
    }
  }

  // Toggle pojedinačnog sportiste
  const toggleAthlete = (id: string) => {
    setSelectedAthleteIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Prikazujemo listu samo ako je upisana pretraga, izabran filter ili kliknuto "Prikaži sve"
  const isListVisible = searchQuery.trim().length > 0 || sportFilter !== 'all' || showAllAthletes

  return (
    <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-2xl space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f1f1f] pb-4">
        <div>
          <h2 className="font-display text-xl font-bold uppercase text-white mt-0.5">
            Dodijeli Trening
          </h2>
        </div>
        <span className="text-xs font-mono text-gray-400">
          Selektovano: <strong className="text-[#d4af37] font-bold text-sm">{selectedAthleteIds.length}</strong> od {athletes.length}
        </span>
      </div>

      <form action={assignWorkout} className="space-y-6">
        
        {/* 1. KORAK: SELEKCIJA SPORTISTA I GRUPA */}
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">
              1. Kome dodjeljuješ trening?
            </label>

            {/* Kontrole: Grupe Dropdown, Search, Sport Filter i Prikaži sve */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              
              {/* Brzo učitavanje grupe */}
              {groups.length > 0 && (
                <select
                  onChange={(e) => {
                    handleSelectGroup(e.target.value)
                    e.target.value = '' // Resetuj na placeholder
                  }}
                  defaultValue=""
                  className="bg-[#d4af37]/10 border border-[#d4af37]/40 rounded-lg px-3 py-1.5 text-xs text-[#d4af37] focus:border-[#d4af37] outline-none font-mono cursor-pointer"
                >
                  <option value="" disabled className="bg-[#0a0a0a] text-gray-400">⚡ Učitaj Grupu...</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id} className="bg-[#0a0a0a] text-white">
                      + {g.name} ({g.athlete_ids?.length || 0})
                    </option>
                  ))}
                </select>
              )}

              {/* Pretraživač */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pretraži sportistu..."
                className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#d4af37] outline-none font-sans w-full sm:w-44"
              />

              {/* Filter po Sportu */}
              {uniqueSports.length > 0 && (
                <select
                  value={sportFilter}
                  onChange={(e) => setSportFilter(e.target.value)}
                  className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#d4af37] outline-none font-sans"
                >
                  <option value="all">Svi sportovi</option>
                  {uniqueSports.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              )}

              {/* Dugme Prikaži sve */}
              <button
                type="button"
                onClick={() => setShowAllAthletes(!showAllAthletes)}
                className="text-xs font-mono text-gray-300 hover:text-white bg-[#0a0a0a] px-3 py-1.5 rounded-lg border border-[#1f1f1f] hover:border-[#d4af37]/40 transition-colors whitespace-nowrap cursor-pointer"
              >
                {showAllAthletes ? 'Sakrij listu ▴' : 'Prikaži sve ▾'}
              </button>
            </div>
          </div>

          {/* Bedževi izabranih sportista (Uvijek vidljivi čim je neko selektovan) */}
          {selectedAthleteIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl max-h-28 overflow-y-auto">
              <div className="w-full flex justify-between text-[10px] font-mono text-gray-500 mb-1">
                <span>IZABRANI SPORTISTI ({selectedAthleteIds.length}):</span>
                <button 
                  type="button" 
                  onClick={() => setSelectedAthleteIds([])}
                  className="text-red-400 hover:underline cursor-pointer"
                >
                  Ukloni sve
                </button>
              </div>
              {selectedAthleteIds.map(id => {
                const athlete = athletes.find(a => a.id === id)
                if (!athlete) return null
                return (
                  <span 
                    key={id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 text-white text-xs font-mono"
                  >
                    <span>{athlete.full_name}</span>
                    <button
                      type="button"
                      onClick={() => toggleAthlete(id)}
                      className="text-[#d4af37] hover:text-red-400 font-bold ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )
              })}
            </div>
          )}

          {/* Kartice se prikazuju SAMO kada tražiš, filtriraš ili klikneš "Prikaži sve" */}
          {isListVisible && (
            <div className="space-y-2 pt-1 animate-fadeIn">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleSelectFiltered}
                  className="text-[11px] font-mono text-[#d4af37] hover:underline cursor-pointer"
                >
                  {filteredAthletes.length > 0 && filteredAthletes.every(a => selectedAthleteIds.includes(a.id))
                    ? 'Poništi prikazane'
                    : 'Izaberi sve prikazane'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#1f1f1f]">
                {filteredAthletes.map(a => {
                  const isChecked = selectedAthleteIds.includes(a.id)
                  return (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() => toggleAthlete(a.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#d4af37]/10 border-[#d4af37] text-white'
                          : 'bg-[#0a0a0a] border-[#1f1f1f] text-gray-400 hover:border-[#d4af37]/40 hover:text-white'
                      }`}
                    >
                      <div className="truncate pr-1">
                        <div className="font-display text-xs font-bold truncate">{a.full_name}</div>
                        {a.sport && <div className="text-[9px] font-mono text-gray-500 uppercase">{a.sport}</div>}
                      </div>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                        isChecked ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'border-gray-600'
                      }`}>
                        {isChecked ? '✓' : ''}
                      </span>
                    </button>
                  )
                })}

                {filteredAthletes.length === 0 && (
                  <p className="text-xs text-gray-500 col-span-full py-3 text-center italic">
                    Nema sportista koji odgovaraju pretrazi.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Skriveni inputi za backend */}
          {selectedAthleteIds.map(id => (
            <input key={id} type="hidden" name="athleteIds" value={id} />
          ))}
        </div>

        {/* 2. KORAK: PERIODIZACIJA I DANI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-[#1f1f1f]">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">
                2. Sedmica Ciklusa
              </label>
              <select 
                name="weekLabel" 
                required 
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:border-[#d4af37] outline-none font-mono"
              >
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
              <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">
                Dan u sedmici
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {DAYS_OF_WEEK.map(day => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`py-2 text-[10px] font-mono uppercase rounded-lg border transition-all cursor-pointer ${
                      selectedDay === day
                        ? 'bg-[#d4af37] text-black font-bold border-[#d4af37]'
                        : 'bg-[#0a0a0a] text-gray-400 border-[#1f1f1f] hover:text-white'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">
                Fokus Treninga (Naziv Dana)
              </label>
              <input 
                type="text" 
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                placeholder="npr. Apsolutna Snaga & Pliometrija" 
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:border-[#d4af37] outline-none font-sans"
              />
              <input 
                type="hidden" 
                name="dayLabel" 
                value={`${selectedDay}${focusArea ? ` - ${focusArea}` : ''}`} 
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">
                Upute i bilješke trenera
              </label>
              <textarea 
                name="coachNotes" 
                rows={2} 
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3 text-xs text-white focus:border-[#d4af37] outline-none leading-relaxed" 
                placeholder="Fokus na brzinu odraza, odmor između serija 2-3 min..." 
              />
            </div>
          </div>
        </div>

        {/* 3. KORAK: UNOS VJEŽBI */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono text-gray-400 uppercase">
              3. Vježbe (Naziv | Opis/Napomena | Serije)
            </label>
            <span className="text-[10px] font-mono text-gray-500">Jedna vježba po redu</span>
          </div>
          <textarea 
            name="exercisesText" 
            rows={5} 
            required
            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4 text-xs text-white focus:border-[#d4af37] outline-none font-mono leading-relaxed" 
            placeholder={"Trap Bar Jump | Eksplozivan odraz iz kuka | 4 x 3 (60% 1RM)\nDepth Jump | Minimalan kontakt sa zemljom | 3 x 4\nPogo Jumps | Krutost skočnog zgloba | 3 x 15s"} 
          />
        </div>

        <button 
          type="submit" 
          disabled={selectedAthleteIds.length === 0}
          className="w-full sm:w-auto bg-[#d4af37] hover:bg-yellow-600 disabled:opacity-40 text-black font-display font-bold uppercase tracking-wider px-10 py-4 rounded-xl transition-all text-xs cursor-pointer shadow-lg shadow-[#d4af37]/10"
        >
          Objavi Trening Za {selectedAthleteIds.length} Sportista
        </button>
      </form>
    </div>
  )
}