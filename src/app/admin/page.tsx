import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '../lib/db'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { DeleteAthleteButton } from './DeleteAthleteButton'

interface Athlete {
  id: string
  full_name: string
  email: string | null
  password: string | null
  gender: string
  sport: string | null
  age: number
  notes: string | null
  is_paid: boolean
  subscription_start_date: string | null
}

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

interface Notification {
  id: string
  athlete_id: string | null // NULL znači da je poruka poslata svima
  title: string
  message: string
  created_at: string
}

// ==========================================
// SERVER AKCIJE
// ==========================================

async function addAthlete(formData: FormData) {
  'use server'
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string || null
  const password = formData.get('password') as string || null
  const gender = formData.get('gender') as string
  const sport = formData.get('sport') as string || null
  const age = Number(formData.get('age'))
  const notes = formData.get('notes') as string || null
  const isPaid = formData.get('isPaid') === 'on'

  if (!fullName || !gender || !age) return

  await query(
    'INSERT INTO athletes (full_name, email, password, gender, sport, age, notes, is_paid, subscription_start_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())',
    [fullName, email, password, gender, sport, age, notes, isPaid]
  )
  revalidatePath('/admin')
}

async function updateAthlete(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string || null
  const password = formData.get('password') as string || null
  const gender = formData.get('gender') as string
  const sport = formData.get('sport') as string || null
  const age = Number(formData.get('age'))
  const notes = formData.get('notes') as string || null
  const isPaid = formData.get('isPaid') === 'on'

  if (!id || !fullName || !gender || !age) return

  await query(
    'UPDATE athletes SET full_name = $1, email = $2, password = $3, gender = $4, sport = $5, age = $6, notes = $7, is_paid = $8 WHERE id = $9',
    [fullName, email, password, gender, sport, age, notes, isPaid, id]
  )
  revalidatePath('/admin')
}

async function togglePayment(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const currentStatus = formData.get('currentStatus') === 'true'
  
  const newStatus = !currentStatus
  if (newStatus) {
    await query('UPDATE athletes SET is_paid = $1, subscription_start_date = NOW() WHERE id = $2', [newStatus, id])
  } else {
    await query('UPDATE athletes SET is_paid = $1 WHERE id = $2', [newStatus, id])
  }
  
  revalidatePath('/admin')
}

async function deleteAthlete(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  if (!id) return

  await query('DELETE FROM athletes WHERE id = $1', [id])
  revalidatePath('/admin')
}

async function assignWorkout(formData: FormData) {
  'use server'
  const athleteId = formData.get('athleteId') as string
  const weekLabel = formData.get('weekLabel') as string 
  const dayLabel = formData.get('dayLabel') as string 
  const coachNotes = formData.get('coachNotes') as string
  const exercisesText = formData.get('exercisesText') as string

  if (!athleteId || !weekLabel || !dayLabel) return

  const exercisesArray: WorkoutExercise[] = exercisesText.split('\n').map(line => {
    const parts = line.split('|')
    return {
      name: parts[0]?.trim() || '',
      desc: parts[1]?.trim() || '',
      reps: parts[2]?.trim() || ''
    }
  })

  await query(
    'INSERT INTO workouts (athlete_id, week_label, phase_title, coach_notes, exercises) VALUES ($1, $2, $3, $4, $5)',
    [athleteId, weekLabel, dayLabel, coachNotes, JSON.stringify(exercisesArray)]
  )

  revalidatePath('/admin')
}

async function deleteWorkout(formData: FormData) {
  'use server'
  const workoutId = formData.get('workoutId') as string
  if (!workoutId) return

  await query('DELETE FROM workouts WHERE id = $1', [workoutId])
  revalidatePath('/admin')
}

async function addJumpTest(formData: FormData) {
  'use server'
  const athleteId = formData.get('athleteId') as string
  const testType = formData.get('testType') as string
  const value = formData.get('value') ? Number(formData.get('value')) : null
  const testDate = formData.get('testDate') as string

  if (!athleteId || !testType || value === null || isNaN(value)) return

  const createdAtValue = testDate ? `${testDate} 12:00:00` : 'NOW()'

  if (testDate) {
    await query(
      'INSERT INTO jump_tests (athlete_id, test_type, value, created_at) VALUES ($1, $2, $3, $4)',
      [athleteId, testType, value, createdAtValue]
    )
  } else {
    await query(
      'INSERT INTO jump_tests (athlete_id, test_type, value, created_at) VALUES ($1, $2, $3, NOW())',
      [athleteId, testType, value]
    )
  }

  revalidatePath('/admin')
}

// NOVA SERVER AKCIJA ZA OBAVJEŠTENJA
async function sendNotification(formData: FormData) {
  'use server'
  const recipientType = formData.get('recipientType') as string // 'all' ili 'single'
  const athleteId = formData.get('athleteId') as string
  const title = formData.get('title') as string
  const message = formData.get('message') as string

  if (!title || !message) return

  const targetAthleteId = recipientType === 'single' && athleteId ? athleteId : null

  await query(
    'INSERT INTO notifications (athlete_id, title, message) VALUES ($1, $2, $3)',
    [targetAthleteId, title, message]
  )

  revalidatePath('/admin')
}

async function deleteNotification(formData: FormData) {
  'use server'
  const notificationId = formData.get('notificationId') as string
  if (!notificationId) return

  await query('DELETE FROM notifications WHERE id = $1', [notificationId])
  revalidatePath('/admin')
}

// ==========================================
// GLAVNA ADMIN STRANICA
// ==========================================

export default async function AdminPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin_auth')

  if (!authCookie || authCookie.value !== 'true') {
    redirect('/admin/login')
  }

  const athletesResult = await query<Athlete>('SELECT * FROM athletes ORDER BY created_at DESC')
  const athletes = athletesResult.rows

  const workoutsResult = await query<Workout>('SELECT * FROM workouts ORDER BY created_at DESC')
  const workouts = workoutsResult.rows

  // Dohvaćanje obavještenja iz baze (pretpostavka da postoji tablica notifications)
  let notifications: Notification[] = []
  try {
    const notifResult = await query<Notification>('SELECT * FROM notifications ORDER BY created_at DESC')
    notifications = notifResult.rows
  } catch (e) {
    // Ukoliko tablica još ne postoji u bazi, sprječava pad stranice
    notifications = []
  }

  const todayDateString = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="border-b border-[#1f1f1f] pb-6 flex items-center justify-between">
          <div>
            <span className="text-[#d4af37] font-mono text-xs font-bold uppercase tracking-widest">ADMIN DASHBOARD</span>
            <h1 className="font-display text-3xl font-black uppercase text-white mt-1">Elite Bounce</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/leaderboard" 
              target="_blank" 
              className="border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors"
            >
              Elite Bounce Tabela ↗
            </Link>

            <form action={async () => {
              'use server'
              const cs = await cookies()
              cs.delete('admin_auth')
              redirect('/admin/login')
            }}>
              <button type="submit" className="border border-[#1f1f1f] bg-[#121212] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors cursor-pointer">
                Odjava
              </button>
            </form>
          </div>
        </header>

        {/* SEKCIJA 1: DODAVANJE I LISTA SPORTISTA */}
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
                  <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Godine</label>
                  <input type="number" name="age" required min="10" max="60" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="npr. 21" />
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

          {/* Lista sportista sa linkom na pojedinačnu stranicu */}
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
                              <label className="text-[10px] font-mono text-gray-500 uppercase">Godine</label>
                              <input type="number" name="age" defaultValue={athlete.age} required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-2 text-white" />
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

                        <div className="mt-4 pt-3 border-t border-[#1f1f1f] space-y-2">
                          <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider">Dodijeljeni treninzi ({athleteWorkouts.length}):</span>
                          {athleteWorkouts.length === 0 ? (
                            <p className="text-[11px] text-gray-500 italic">Nema dodijeljenih treninga.</p>
                          ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {athleteWorkouts.map(w => (
                                <div key={w.id} className="bg-[#121212] p-2 rounded border border-[#1f1f1f] flex items-center justify-between">
                                  <div>
                                    <span className="text-white font-bold text-xs">{w.week_label} - {w.phase_title}</span>
                                    {w.coach_notes && <p className="text-[10px] text-gray-400 line-clamp-1">{w.coach_notes}</p>}
                                  </div>
                                  <form action={deleteWorkout}>
                                    <input type="hidden" name="workoutId" value={w.id} />
                                    <button type="submit" className="text-red-400 hover:text-red-300 text-[10px] font-mono border border-red-900/40 px-2 py-1 rounded bg-red-950/20 cursor-pointer">
                                      Ukloni
                                    </button>
                                  </form>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </details>
                    </div>
                  )
                })}
                {athletes.length === 0 && <p className="text-gray-500 text-sm">Nema unesenih sportista.</p>}
              </div>
            </div>
          </div>

        </div>

       

        {/* SEKCIJA 3: UNOS POJEDINAČNOG TESTA SKOKA */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl space-y-6">
          <div className="border-b border-[#1f1f1f] pb-4">
            <h2 className="font-display text-xl font-bold uppercase text-white mt-1">Dodaj Test Skoka</h2>
          </div>

          <form action={addJumpTest} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Sportista</label>
              <select name="athleteId" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
                <option value="">-- Izaberi sportistu --</option>
                {athletes.map(a => (
                  <option key={a.id} value={a.id}>{a.full_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Tip Testa</label>
              <select name="testType" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
                <option value="CMJ">CMJ (Countermovement Jump)</option>
                <option value="CMJ-AS">CMJ-AS (with Arm Swing)</option>
                <option value="SJ">SJ (Squat Jump)</option>
                <option value="BJ">BJ (Broad Jump)</option>
                <option value="AJ">AJ (Approach Jump)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Vrijednost (cm)</label>
              <input type="number" step="0.1" name="value" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="npr. 45.5" />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Datum Testiranja</label>
              <input type="date" name="testDate" defaultValue={todayDateString} required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" />
            </div>

            <div>
              <button type="submit" className="w-full bg-[#d4af37] text-black font-display font-bold uppercase tracking-wider py-3.5 rounded hover:bg-yellow-600 transition-all text-xs cursor-pointer">
                Sačuvaj Test
              </button>
            </div>
          </form>
        </div>

      
        {/* SEKCIJA 4: KREIRANJE TRENINGA */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl">
          <h2 className="font-display text-xl font-bold uppercase mb-6 text-white">Dodijeli Trening</h2>
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
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Komentar / Napomena Trenera</label>
              <textarea name="coachNotes" rows={3} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="Upute za izvođenje, zagrijavanje..." />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">
                Vježbe (Format: Naziv | Opis | Serije - svaka u novi red)
              </label>
              <textarea name="exercisesText" rows={4} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none font-mono text-xs" placeholder="A-Skips | Mehanika sprinta | 3 x 20m&#10;Depth Jumps | Minimalan kontakt | 4 x 4" />
            </div>

            <button type="submit" className="bg-[#d4af37] text-black tne-black font-display font-bold uppercase tracking-wider px-8 py-3 rounded hover:bg-yellow-600 transition-all text-xs cursor-pointer">
              Objavi Trening za Izabranu Sedmicu
            </button>
          </form>
        </div>
           {/* SEKCIJA 2: SLANJE OBAVJEŠTENJA (NOVO) */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl space-y-6">
          <div className="border-b border-[#1f1f1f] pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold uppercase text-white mt-1">Pošalji obavijest</h2>
            </div>
          </div>

          <form action={sendNotification} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Kome šalješ?</label>
                <select name="recipientType" defaultValue="all" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
                  <option value="all">Svi sportisti</option>
                  <option value="single">Pojedinačni sportista</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Izaberi sportistu (Samo za pojedinačno)</label>
                <select name="athleteId" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
                  <option value="">-- Izaberi sportistu --</option>
                  {athletes.map(a => (
                    <option key={a.id} value={a.id}>{a.full_name} ({a.sport || 'Opći'})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Naslov obavještenja</label>
              <input type="text" name="title" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="npr. Promjena termina treninga" />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Tekst obavještenja / poruke</label>
              <textarea name="message" rows={3} required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="Unesite poruku za sportistu..." />
            </div>

            <button type="submit" className="bg-[#d4af37] text-black font-display font-bold uppercase tracking-wider px-8 py-3 rounded hover:bg-yellow-600 transition-all text-xs cursor-pointer">
              Pošalji Obavještenje
            </button>
          </form>

          {/* Pregled poslanih obavještenja */}
          <div className="pt-4 border-t border-[#1f1f1f] space-y-3">
            <span className="text-xs font-mono text-gray-400 uppercase">Poslana obavještenja ({notifications.length})</span>
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-500 italic">Nema poslanih obavještenja.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.map(n => {
                  const targetAthlete = athletes.find(a => a.id === n.athlete_id)
                  return (
                    <div key={n.id} className="bg-[#0a0a0a] p-3 rounded border border-[#1f1f1f] flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{n.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-950/30 border border-yellow-900/40 text-[#d4af37]">
                            {n.athlete_id ? `Za: ${targetAthlete?.full_name || 'Nepoznato'}` : 'Za: Svi sportisti 🌍'}
                          </span>
                        </div>
                        <p className="text-gray-400 mt-1">{n.message}</p>
                      </div>
                      <form action={deleteNotification}>
                        <input type="hidden" name="notificationId" value={n.id} />
                        <button type="submit" className="text-red-400 hover:text-red-300 font-mono border border-red-900/40 px-2 py-1 rounded bg-red-950/20 cursor-pointer text-[10px]">
                          Obriši
                        </button>
                      </form>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  )
}