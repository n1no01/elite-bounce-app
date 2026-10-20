import Link from 'next/link'
import { DeleteAthleteButton } from '../DeleteAthleteButton'
import { formatDateForInput } from '../../lib/utils'

interface Athlete {
  id: string
  full_name: string
  email: string | null
  gender: string
  sport: string | null
  birth_date: string | null
  notes: string | null
  is_paid: boolean
}

interface Workout {
  id: string
  athlete_id: string
}

interface AthletesSectionProps {
  athletes: Athlete[]
  workouts: Workout[]
  addAthlete: (formData: FormData) => Promise<void>
  updateAthlete: (formData: FormData) => Promise<void>
  togglePayment: (formData: FormData) => Promise<void>
  deleteAthlete: (formData: FormData) => Promise<void>
}

export function AthletesSection({ 
  athletes, 
  workouts, 
  addAthlete, 
  updateAthlete, 
  togglePayment, 
  deleteAthlete 
}: AthletesSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Forma za novog sportistu */}
      <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-xl">
        <h2 className="font-display text-xl font-bold uppercase mb-4 text-white">Dodaj Novog Sportistu</h2>
        <form action={addAthlete} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Ime i Prezime</label>
            <input type="text" name="fullName" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="npr. Anel Milak" />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Email za prijavu</label>
            <input type="email" name="email" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="sportista@domain.com" />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Lozinka za sportistu</label>
            <input type="text" name="password" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="npr. sifra123" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Spol</label>
              <select name="gender" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
                <option value="Muški">Muški</option>
                <option value="Ženski">Ženski</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Datum Rođenja</label>
              <input type="date" name="birthDate" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Sport (Opcionalno)</label>
            <input type="text" name="sport" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="npr. Košarka" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" name="isPaid" id="isPaidNew" className="w-4 h-4 accent-[#d4af37]" />
            <label htmlFor="isPaidNew" className="text-xs font-mono text-gray-300 uppercase cursor-pointer">Uplaćeno (Aktiviraj odmah)</label>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Bilješke (Opcionalno)</label>
            <textarea name="notes" rows={2} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="Povrede, ciljevi..." />
          </div>

          <button type="submit" className="w-full bg-[#d4af37] text-black font-display font-bold uppercase tracking-wider py-3 rounded hover:bg-yellow-600 transition-all text-xs cursor-pointer">
            Sačuvaj Sportistu
          </button>
        </form>
      </div>

      {/* Lista sportista */}
      <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-xl flex flex-col justify-between">
        <div>
          <h2 className="font-display text-xl font-bold uppercase mb-4 text-white">Lista Sportista ({athletes.length})</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {athletes.map(athlete => {
              const athleteWorkouts = workouts.filter(w => w.athlete_id === athlete.id)

              return (
                <div key={athlete.id} className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/admin/athletes/${athlete.id}`}
                          className="font-display font-bold text-white text-sm hover:text-[#d4af37] transition-colors underline decoration-[#d4af37]/40 underline-offset-4"
                        >
                          {athlete.full_name} ↗
                        </Link>
                        
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${athlete.is_paid ? 'bg-green-950/40 border-green-800 text-green-400' : 'bg-red-950/40 border-red-900 text-red-400'}`}>
                          {athlete.is_paid ? 'Uplaćeno 🟢' : 'Nije uplaćeno 🔴'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <form action={togglePayment}>
                        <input type="hidden" name="id" value={athlete.id} />
                        <input type="hidden" name="currentStatus" value={String(athlete.is_paid)} />
                        <button type="submit" className={`text-xs font-mono px-3 py-1.5 rounded transition-colors cursor-pointer border ${athlete.is_paid ? 'border-yellow-900/40 bg-yellow-950/20 text-yellow-400 hover:bg-yellow-900/30' : 'border-green-900/40 bg-green-950/20 text-green-400 hover:bg-green-900/30'}`}>
                          {athlete.is_paid ? 'Poništi uplatu' : 'Odobri uplatu'}
                        </button>
                      </form>

                      <DeleteAthleteButton 
                        athleteId={athlete.id} 
                        athleteName={athlete.full_name} 
                        deleteAction={deleteAthlete} 
                      />
                    </div>
                  </div>

                  <details className="text-xs text-gray-400 pt-2 border-t border-[#1f1f1f]">
                    <summary className="cursor-pointer hover:text-[#d4af37] font-mono uppercase text-[10px] flex items-center justify-between">
                      <span>Uredi podatke ⚙️</span>
                      <span className="text-gray-500">{athleteWorkouts.length} dodijeljenih treninga</span>
                    </summary>
                    
                    <form action={updateAthlete} className="mt-3 space-y-3 bg-[#121212] p-3 rounded border border-[#1f1f1f]">
                      <input type="hidden" name="id" value={athlete.id} />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase">Ime i prezime</label>
                          <input type="text" name="fullName" defaultValue={athlete.full_name} required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-2 text-white" />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase">Sport</label>
                          <input type="text" name="sport" defaultValue={athlete.sport || ''} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-2 text-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase">Spol</label>
                          <select name="gender" defaultValue={athlete.gender} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-2 text-white">
                            <option value="Muški">Muški</option>
                            <option value="Ženski">Ženski</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase">Datum Rođenja</label>
                          <input type="date" name="birthDate" defaultValue={formatDateForInput(athlete.birth_date)} required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-2 text-white" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase">Bilješke</label>
                        <textarea name="notes" defaultValue={athlete.notes || ''} rows={2} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-2 text-white" />
                      </div>
                    
                      <button type="submit" className="w-full bg-[#d4af37] text-black font-bold py-2 rounded hover:bg-yellow-600 transition-colors uppercase text-[10px] cursor-pointer">
                        Sačuvaj Izmjene Sportiste
                      </button>
                    </form>
                  </details>
                </div>
              )
            })}
            {athletes.length === 0 && <p className="text-gray-500 text-sm">Nema unesenih sportista.</p>}
          </div>
        </div>
      </div>

    </div>
  )
}