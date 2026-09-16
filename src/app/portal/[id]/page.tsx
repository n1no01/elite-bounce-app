import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '../../lib/db'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import Image from 'next/image'
import JumpProgressModal from '../../components/JumpProgressModal' // Pretpostavka da izdvojiš modal ili ga držiš unutar fajla

interface Athlete {
  id: string
  full_name: string
  email: string | null
  password: string | null
  gender: string
  sport: string | null
  age: number
  notes: string | null
}

interface Exercise {
  name: string
  desc: string
  reps: string
}

interface Workout {
  id: string
  week_label: string
  phase_title: string
  coach_notes: string | null
  exercises: Exercise[] | string
  created_at: string
}

interface JumpTestRecord {
  id: string
  test_type: string
  value: number
  created_at: string
}

interface Notification {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ sedmica?: string }>
}

async function handleLogout() {
  'use server'
  const cookieStore = await cookies()
  
  // Brišemo kolačić tako što mu stavimo da odmah istekne (maxAge: 0)
  cookieStore.set('athlete_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  })

  redirect('/login')
}

// Server akcija za ažuriranje pristupnih podataka (email i lozinka)
async function updateCredentials(formData: FormData) {
  'use server'
  const athleteId = formData.get('athleteId') as string
  const email = formData.get('email') as string || null
  const password = formData.get('password') as string || null

  if (!athleteId) return

  await query(
    'UPDATE athletes SET email = $1, password = $2 WHERE id = $3',
    [email, password, athleteId]
  )
  revalidatePath(`/portal/${athleteId}`)
}

export default async function AthletePortalPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const selectedWeek = resolvedSearchParams.sedmica || 'Sedmica 1'

  // --- SIGURNOSNA PROVJERA (SAMO VLASNIK NALOGA) ---
  const cookieStore = await cookies()
  const athleteCookie = cookieStore.get('athlete_session')

  // Ako korisnik nije ulogovan, ili ID u kolačiću ne odgovara ID-ju u URL-u -> pravac login!
  if (!athleteCookie || athleteCookie.value !== id) {
    redirect('/login')
  }

  // 1. Dohvati podatke o sportisti
  const athleteResult = await query<Athlete>('SELECT * FROM athletes WHERE id = $1', [id])
  if (athleteResult.rows.length === 0) {
    redirect('/login')
  }
  const athlete = athleteResult.rows[0]

  // 2. Automatsko brisanje treninga starijih od 30 dana
  await query('DELETE FROM workouts WHERE athlete_id = $1 AND created_at < NOW() - INTERVAL \'30 days\'', [id])

  // 3. Dohvati preostale treninge za ovog sportistu
  const workoutsResult = await query<Workout>('SELECT * FROM workouts WHERE athlete_id = $1 ORDER BY created_at DESC', [id])
  const allWorkouts = workoutsResult.rows

  // Filtriraj treninge za izabranu sedmicu
  const currentWeekWorkouts = allWorkouts.filter(w => w.week_label === selectedWeek)

  // 4. Dohvati pojedinačne testove skokova iz tabele jump_tests
  let jumpTests: JumpTestRecord[] = []
  try {
    const testsResult = await query<JumpTestRecord>(
      'SELECT * FROM jump_tests WHERE athlete_id = $1 ORDER BY created_at ASC',
      [id]
    )
    jumpTests = testsResult.rows
  } catch (e) {
    console.error("GREŠKA PRI DOHVATANJU TESTOVA SKOKOVA:", e)
    jumpTests = []
  }

  // 5. Dohvati obavještenja za sportistu (Lična + Globalna gdje je athlete_id IS NULL)
  let notifications: Notification[] = []
  try {
    const notifResult = await query<Notification>(
      'SELECT * FROM notifications WHERE athlete_id = $1 OR athlete_id IS NULL ORDER BY created_at DESC',
      [id]
    )
    notifications = notifResult.rows
  } catch (e) {
    notifications = []
  }

  // Definicija tipova skokova koji se prate
  const supportedTestTypes = [
    { type: 'CMJ', name: 'Countermovement Jump' },
    { type: 'CMJ-AS', name: 'CMJ with Arm Swing' },
    { type: 'SJ', name: 'Squat Jump' },
    { type: 'BJ', name: 'Broad Jump' },
    { type: 'AJ', name: 'Approach Jump' }
  ]

  // Izračunavanje ličnog rekorda i pakovanje historije za grafikone
  const bestMetrics = supportedTestTypes.map(st => {
    const matchingTests = jumpTests.filter(t => t.test_type.trim().toUpperCase() === st.type)
    if (matchingTests.length === 0) {
      return { label: st.type, name: st.name, val: null, date: null, history: [] }
    }

    let best = matchingTests[0]
    for (const t of matchingTests) {
      if (Number(t.value) > Number(best.value)) {
        best = t
      }
    }

    // Priprema historije za Recharts (datum + vrijednost)
    const history = matchingTests.map(t => ({
      date: new Date(t.created_at).toLocaleDateString('bs-BA', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      value: Number(t.value)
    }))

    return {
      label: st.type,
      name: st.name,
      val: best.value,
      date: new Date(best.created_at).toLocaleDateString('bs-BA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      history
    }
  })

  const hasAnyBest = bestMetrics.some(m => m.val !== null)

  // Lista svih dostupnih sedmica
  const weeks = [
    'Sedmica 1', 'Sedmica 2', 'Sedmica 3', 'Sedmica 4'
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex flex-col justify-between selection:bg-[#d4af37] selection:text-black font-sans">
      
      {/* NAVIGACIJA PORTALA */}
      <header className="w-full border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center group py-2">
              <Image 
                src="/logo.png" 
                alt="Elite Bounce Logo" 
                width={300} 
                height={100} 
                priority 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <span className="hidden sm:inline-block text-[#d4af37] font-mono text-[10px] font-bold tracking-widest bg-[#d4af37]/10 px-2.5 py-1 rounded border border-[#d4af37]/20">
              ATHLETE PORTAL
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-sm font-bold text-white">{athlete.full_name}</div>
              <div className="text-[11px] text-gray-400 font-mono">{athlete.sport || ''}</div>
            </div>
           <form action={handleLogout}>
              <button 
                type="submit"
                className="border border-[#1f1f1f] bg-[#121212] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors cursor-pointer"
              >
                Odjava
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* GLAVNI SADRŽAJ */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* BANER ZA OBAVJEŠTENJA */}
        {notifications.length > 0 && (
          <div className="bg-gradient-to-r from-[#d4af37]/20 via-[#121212] to-[#121212] border-2 border-[#d4af37] rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl shadow-[#d4af37]/10">
            <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37] text-black flex items-center justify-center text-xl font-bold shadow-lg">
                  🔔
                </div>
                <div>
                  <span className="text-[#d4af37] font-mono text-[10px] font-bold uppercase tracking-widest">
                    VAŽNA PORUKA OD TRENERA
                  </span>
                  <h2 className="font-display text-lg sm:text-xl font-black uppercase text-white">
                    Obavijest
                  </h2>
                </div>
              </div>
              <span className="text-xs font-mono bg-[#d4af37] text-black px-3 py-1 rounded-full font-bold">
                {notifications.length} {notifications.length === 1 ? 'obavještenje' : 'obavještenja'}
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className="bg-[#0a0a0a]/90 border border-[#d4af37]/40 p-4 sm:p-5 rounded-xl space-y-2 shadow-inner"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-display font-bold text-base sm:text-lg text-[#d4af37] flex items-center gap-2">
                    {notif.title}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400">
                      {new Date(notif.created_at).toLocaleDateString('bs-BA', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOBRODOŠLICA */}
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <h1 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
                Dobrodošao/la, {athlete.full_name}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-2 font-light max-w-xl">
                Ovo je tvoj centralni hub za praćenje treninga, skokova i napretka. Prati propisane protokole i dominiraj na terenu.
              </p>
            </div>
          </div>
          {athlete.notes && (
            <div className="mt-6 pt-4 border-t border-[#1f1f1f] text-xs text-gray-300">
              <strong className="text-[#d4af37] uppercase font-mono">Napomena trenera:</strong> {athlete.notes}
            </div>
          )}
        </div>

        {/* SEKCIJA 1: LIČNI REKORDI SA INTERAKTIVNIM MODALOM ZA GRAFIKON */}
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#1f1f1f] pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold uppercase text-white mt-1">Najbolji Rezultati Skokova</h2>
            </div>
          </div>

          {hasAnyBest ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {bestMetrics.map((m, idx) => (
                <JumpProgressModal key={idx} metric={m} />
              ))}
            </div>
          ) : (
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-6 text-center text-gray-500 text-xs font-mono">
              Trener još uvijek nije unio rezultate testiranja skokova za vaš profil.
            </div>
          )}
        </div>

        {/* SEKCIJA 2: ODABIR SEDMICE (TABS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold uppercase text-white tracking-wider">Izaberi Sedmicu Treninga</h2>
            <span className="text-xs font-mono text-[#d4af37]">{selectedWeek}</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#1f1f1f]">
            {weeks.map((week) => {
              const isSelected = selectedWeek === week
              const hasWorkouts = allWorkouts.some(w => w.week_label === week)

              return (
                <Link
                  key={week}
                  href={`/portal/${id}?sedmica=${week}`}
                  scroll={false}
                  className={`px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected 
                      ? 'bg-[#d4af37] text-black font-bold border-[#d4af37] shadow-lg shadow-[#d4af37]/10' 
                      : hasWorkouts
                        ? 'bg-[#121212] text-white border-[#d4af37]/40 hover:border-[#d4af37]'
                        : 'bg-[#121212] text-gray-500 border-[#1f1f1f] hover:text-gray-300'
                  }`}
                >
                  {week}
                </Link>
              )
            })}
          </div>
        </div>

        {/* SEKCIJA 3: PRIKAZ TRENINGA */}
        <div className="space-y-6">
          <div className="border-b border-[#1f1f1f] pb-3 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold uppercase text-white">
              Plan treninga za <span className="text-[#d4af37]">{selectedWeek}</span>
            </h3>
            <span className="text-xs font-mono text-gray-400">{currentWeekWorkouts.length} treninga objavljeno</span>
          </div>

          {currentWeekWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {currentWeekWorkouts.map((workout) => {
                let exercises: Exercise[] = []
                try {
                  exercises = typeof workout.exercises === 'string' 
                    ? JSON.parse(workout.exercises) 
                    : workout.exercises || []
                } catch (e) {
                  exercises = []
                }

                return (
                  <div key={workout.id} className="bg-[#121212] border border-[#1f1f1f] rounded-xl p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f1f1f] pb-4">
                      <div>
                        <span className="text-[#d4af37] font-mono text-[10px] font-bold uppercase tracking-widest bg-[#d4af37]/10 px-2.5 py-1 rounded border border-[#d4af37]/20">
                          {workout.week_label}
                        </span>
                        <h4 className="font-display text-xl font-bold uppercase text-white mt-2">
                          {workout.phase_title}
                        </h4>
                      </div>
                    </div>

                    {workout.coach_notes && (
                      <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg text-xs text-gray-300">
                        <span className="text-[#d4af37] font-mono uppercase font-bold block mb-1">Upute i fokus trenera:</span>
                        {workout.coach_notes}
                      </div>
                    )}

                    <div className="space-y-3">
                      <h5 className="text-xs font-mono uppercase text-gray-400 tracking-wider">Propisane vježbe:</h5>
                      <div className="grid grid-cols-1 gap-3">
                        {exercises.map((ex, idx) => (
                          <div key={idx} className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="font-display font-bold text-sm text-white flex items-center gap-2">
                                <span className="text-[#d4af37] font-mono text-xs">{idx + 1}.</span> {ex.name}
                              </div>
                              {ex.desc && <p className="text-xs text-gray-400 font-light">{ex.desc}</p>}
                            </div>
                            {ex.reps && (
                              <div className="self-start sm:self-center bg-[#121212] border border-[#1f1f1f] px-3 py-1.5 rounded text-xs font-mono text-[#d4af37] font-bold whitespace-nowrap">
                                {ex.reps}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-[#121212] border border-[#1f1f1f] rounded-xl p-12 text-center space-y-3">
              <div className="text-2xl">⚡</div>
              <h4 className="font-display text-lg font-bold text-white uppercase">Treninzi još nisu dodijeljeni</h4>
              <p className="text-gray-400 text-xs max-w-md mx-auto font-light">
                Za izabranu sedmicu trener još uvijek nije objavio raspored. Provjeri druge sedmice ili sačekaj da trener unese novi protokol.
              </p>
            </div>
          )}
        </div>

        {/* SEKCIJA 4: PROMJENA PRISTUPNIH PODATAKA */}
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#1f1f1f] pb-4">
            <h2 className="font-display text-xl font-bold uppercase text-white mt-1">Izmjena Pristupnih Podataka</h2>
          </div>

          <form action={updateCredentials} className="space-y-4 max-w-lg">
            <input type="hidden" name="athleteId" value={athlete.id} />
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Email adresa</label>
              <input 
                type="email" 
                name="email" 
                defaultValue={athlete.email || ''} 
                required 
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-3 text-sm text-white focus:border-[#d4af37] outline-none" 
                placeholder="tvoj.email@domain.com"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Nova lozinka</label>
              <input 
                type="text" 
                name="password" 
                defaultValue={athlete.password || ''} 
                required 
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-3 text-sm text-white focus:border-[#d4af37] outline-none" 
                placeholder="Unesi novu lozinku"
              />
            </div>
            <button 
              type="submit" 
              className="bg-[#d4af37] text-black font-display font-bold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all text-xs cursor-pointer"
            >
              Sačuvaj Nove Podatke
            </button>
          </form>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1f1f] py-6 text-center text-xs text-gray-600 mt-12">
        <p>&copy; {new Date().getFullYear()} Elite Bounce. Sva prava zadržana.</p>
      </footer>
    </div>
  )
}