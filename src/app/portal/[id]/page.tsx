import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '../../lib/db'
import { revalidatePath } from 'next/cache'
import JumpProgressModal from '../../components/JumpProgressModal'
import ChatBox from '../../components/ChatBox'
import BirthdayBanner from '../../components/BirthdayBanner'
import bcrypt from 'bcryptjs'

// Uvezene nove komponente
import PortalHeader from './components/PortalHeader'
import NotificationsBanner from './components/NotificationsBanner'
import WorkoutSection from './components/WorkoutSection'
import CredentialsForm from './components/CredentialsForm'

interface Athlete {
  id: string
  full_name: string
  email: string | null
  password: string | null
  gender: string
  sport: string | null
  age: number
  birth_date: string | Date | null
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
  cookieStore.delete('athlete_session')
  cookieStore.set('athlete_session', '', {
    expires: new Date(0),
    path: '/',
  })
  redirect('/login')
}

async function updateCredentials(formData: FormData) {
  'use server'
  const athleteId = formData.get('athleteId') as string
  const email = (formData.get('email') as string) || null
  const newPassword = (formData.get('password') as string) || null

  if (!athleteId) return

  if (newPassword && newPassword.trim() !== '') {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await query('UPDATE athletes SET email = $1, password = $2 WHERE id = $3', [email, hashedPassword, athleteId])
  } else {
    await query('UPDATE athletes SET email = $1 WHERE id = $2', [email, athleteId])
  }

  revalidatePath(`/portal/${athleteId}`)
}

export default async function AthletePortalPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const resolvedSearchParams = await searchParams

  const cookieStore = await cookies()
  const athleteCookie = cookieStore.get('athlete_session')

  if (!athleteCookie || athleteCookie.value !== id) {
    redirect('/login')
  }

  query('DELETE FROM workouts WHERE athlete_id = $1 AND created_at < NOW() - INTERVAL \'30 days\'', [id]).catch(console.error)

  const [athleteRes, workoutsRes, testsRes, notifRes] = await Promise.all([
    query<Athlete>('SELECT * FROM athletes WHERE id = $1', [id]),
    query<Workout>('SELECT * FROM workouts WHERE athlete_id = $1 ORDER BY created_at DESC', [id]),
    query<JumpTestRecord>('SELECT * FROM jump_tests WHERE athlete_id = $1 ORDER BY created_at ASC', [id]).catch(() => ({ rows: [] })),
    query<Notification>('SELECT * FROM notifications WHERE athlete_id = $1 OR athlete_id IS NULL ORDER BY created_at DESC', [id]).catch(() => ({ rows: [] }))
  ])

  if (athleteRes.rows.length === 0) {
    redirect('/login')
  }

  const athlete = athleteRes.rows[0]
  const allWorkouts = workoutsRes.rows
  const jumpTests = testsRes.rows
  const notifications = notifRes.rows

  const extractedWeeks = Array.from(new Set(allWorkouts.map(w => w.week_label))).filter(Boolean)
  const defaultWeeks = ['Sedmica 1', 'Sedmica 2', 'Sedmica 3', 'Sedmica 4']
  const weeks = Array.from(new Set([...defaultWeeks, ...extractedWeeks]))

  const selectedWeek = resolvedSearchParams.sedmica || weeks[0] || 'Sedmica 1'
  const currentWeekWorkouts = allWorkouts.filter(w => w.week_label === selectedWeek)

  const supportedTestTypes = [
    { type: 'CMJ', name: 'Countermovement Jump' },
    { type: 'CMJ-AS', name: 'CMJ with Arm Swing' },
    { type: 'SJ', name: 'Squat Jump' },
    { type: 'BJ', name: 'Broad Jump' },
    { type: 'AJ', name: 'Approach Jump' }
  ]

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex flex-col justify-between selection:bg-[#d4af37] selection:text-black font-sans">
      
      {/* 1. Navigacija */}
      <PortalHeader handleLogout={handleLogout} />

      {/* GLAVNI SADRŽAJ */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Rođendanska čestitka */}
        <BirthdayBanner athlete={athlete} />

        {/* 2. Baner za obavještenja */}
        <NotificationsBanner notifications={notifications} />

        {/* Dobrodošlica */}
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
        </div>

        {/* Sekcija: Lični rekordi */}
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

        {/* 3. Sekcija za treninge i sedmice */}
        <WorkoutSection 
          athleteId={athlete.id}
          weeks={weeks}
          selectedWeek={selectedWeek}
          allWorkouts={allWorkouts}
          currentWeekWorkouts={currentWeekWorkouts}
        />

        {/* 4. Forma za promjenu pristupnih podataka */}
        <CredentialsForm 
          athleteId={athlete.id}
          currentEmail={athlete.email}
          updateCredentials={updateCredentials}
        />
      
        {/* Chat prozor */}
        <ChatBox athleteId={athlete.id} currentUserType="athlete" />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1f1f] py-6 text-center text-xs text-gray-600 mt-12">
        <p>&copy; {new Date().getFullYear()} Elite Bounce. Sva prava zadržana.</p>
      </footer>
    </div>
  )
}