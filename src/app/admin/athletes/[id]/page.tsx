import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '@/app/lib/db'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

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
  created_at: string
}

interface JumpTest {
  id: string
  test_type: string
  value: number
  created_at: string
}

interface WorkoutExercise {
  name: string
  desc: string
  reps: string
}

interface Workout {
  id: string
  week_label: string
  phase_title: string
  coach_notes: string | null
  exercises: WorkoutExercise[]
  created_at: string
}

async function deleteJumpTest(formData: FormData) {
  'use server'
  const testId = formData.get('testId') as string
  const athleteId = formData.get('athleteId') as string
  if (!testId) return

  await query('DELETE FROM jump_tests WHERE id = $1', [testId])
  revalidatePath(`/admin/athletes/${athleteId}`)
}

async function deleteWorkout(formData: FormData) {
  'use server'
  const workoutId = formData.get('workoutId') as string
  const athleteId = formData.get('athleteId') as string
  if (!workoutId) return

  await query('DELETE FROM workouts WHERE id = $1', [workoutId])
  revalidatePath(`/admin/athletes/${athleteId}`)
}

export default async function AthleteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin_auth')

  if (!authCookie || authCookie.value !== 'true') {
    redirect('/admin/login')
  }

  const athleteResult = await query<Athlete>('SELECT * FROM athletes WHERE id = $1', [id])
  const athlete = athleteResult.rows[0]

  if (!athlete) {
    redirect('/admin')
  }

  const testsResult = await query<JumpTest>(
    'SELECT * FROM jump_tests WHERE athlete_id = $1 ORDER BY created_at DESC',
    [id]
  )
  const tests = testsResult.rows

  const workoutsResult = await query<Workout>(
    'SELECT * FROM workouts WHERE athlete_id = $1 ORDER BY created_at DESC',
    [id]
  )
  const workouts = workoutsResult.rows

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] p-6 sm:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigacija nazad */}
        <div>
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] hover:underline uppercase tracking-wider"
          >
            ← Nazad na Admin Dashboard
          </Link>
        </div>

        {/* Profil Sportiste - Info */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-6">
            <div>
              <span className="text-[#d4af37] font-mono text-xs font-bold uppercase tracking-widest">PROFIL SPORTISTE</span>
              <h1 className="font-display text-3xl font-black uppercase text-white mt-1">{athlete.full_name}</h1>
              <div className="text-xs text-gray-400 font-mono mt-1 flex flex-wrap gap-3">
                <span>{athlete.sport || 'Opći sport'}</span>
                <span>•</span>
                <span>{athlete.gender}</span>
                <span>•</span>
                <span>{athlete.age} godina</span>
                {athlete.email && (
                  <>
                    <span>•</span>
                    <span>{athlete.email}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono px-3 py-1.5 rounded border uppercase ${athlete.is_paid ? 'bg-green-950/40 border-green-800 text-green-400' : 'bg-red-950/40 border-red-900 text-red-400'}`}>
                {athlete.is_paid ? 'Uplaćeno 🟢' : 'Nije uplaćeno 🔴'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg space-y-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Pristupni podaci</span>
              <div className="text-xs space-y-1 font-mono">
                <div><span className="text-gray-400">Email:</span> <span className="text-white">{athlete.email || 'Nije unesen'}</span></div>
                <div><span className="text-gray-400">Lozinka:</span> <span className="text-[#d4af37]">{athlete.password || 'Nije postavljena'}</span></div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg space-y-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Bilješke i napomene</span>
              <p className="text-xs text-gray-300">{athlete.notes || 'Nema unesenih bilješki za ovog sportistu.'}</p>
            </div>
          </div>
        </div>

        {/* Sekcija: Svi Skokovi Testiranja */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
            <h2 className="font-display text-xl font-bold uppercase text-white">Istorija Testova Skoka ({tests.length})</h2>
          </div>

          {tests.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-2">Nema evidentiranih testova skoka za ovog sportistu.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1f1f1f] text-gray-400 uppercase text-[10px]">
                    <th className="py-3 px-4">Tip Testa</th>
                    <th className="py-3 px-4">Rezultat</th>
                    <th className="py-3 px-4">Datum Mjerenja</th>
                    <th className="py-3 px-4 text-right">Akcija</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {tests.map(test => (
                    <tr key={test.id} className="hover:bg-[#0a0a0a]/50">
                      <td className="py-3 px-4 font-bold text-[#d4af37]">{test.test_type}</td>
                      <td className="py-3 px-4 text-white font-bold">{test.value} cm</td>
                      <td className="py-3 px-4 text-gray-400">{new Date(test.created_at).toLocaleDateString('bs-BA')}</td>
                      <td className="py-3 px-4 text-right">
                        <form action={deleteJumpTest} className="inline">
                          <input type="hidden" name="testId" value={test.id} />
                          <input type="hidden" name="athleteId" value={athlete.id} />
                          <button type="submit" className="text-red-400 hover:text-red-300 border border-red-900/40 bg-red-950/20 px-2.5 py-1 rounded cursor-pointer text-[10px]">
                            Obriši
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sekcija: Dodijeljeni Treninzi */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
            <h2 className="font-display text-xl font-bold uppercase text-white">Dodijeljeni Treninzi ({workouts.length})</h2>
          </div>

          {workouts.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-2">Nema dodijeljenih treninga za ovog sportistu.</p>
          ) : (
            <div className="space-y-4">
              {workouts.map(w => (
                <div key={w.id} className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#d4af37] font-mono text-[10px] uppercase font-bold tracking-wider">{w.week_label}</span>
                      <h3 className="text-white font-display font-bold text-base">{w.phase_title}</h3>
                    </div>
                    <form action={deleteWorkout}>
                      <input type="hidden" name="workoutId" value={w.id} />
                      <input type="hidden" name="athleteId" value={athlete.id} />
                      <button type="submit" className="text-red-400 hover:text-red-300 border border-red-900/40 bg-red-950/20 px-3 py-1 rounded cursor-pointer text-xs font-mono">
                        Ukloni trening
                      </button>
                    </form>
                  </div>

                  {w.coach_notes && (
                    <div className="text-xs text-gray-400 bg-[#121212] p-3 rounded border border-[#1f1f1f]">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Napomena trenera:</span>
                      {w.coach_notes}
                    </div>
                  )}

                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Vježbe:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Array.isArray(w.exercises) && w.exercises.map((ex, idx) => (
                        <div key={idx} className="bg-[#121212] p-2.5 rounded border border-[#1f1f1f] text-xs font-mono flex justify-between items-center">
                          <div>
                            <div className="font-bold text-white">{ex.name}</div>
                            {ex.desc && <div className="text-[10px] text-gray-400">{ex.desc}</div>}
                          </div>
                          {ex.reps && <div className="text-[#d4af37] font-bold text-[11px]">{ex.reps}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}