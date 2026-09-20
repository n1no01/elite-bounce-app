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

async function updateWorkout(formData: FormData) {
  'use server'
  const workoutId = formData.get('workoutId') as string
  const athleteId = formData.get('athleteId') as string
  const weekLabel = formData.get('weekLabel') as string
  const phaseTitle = formData.get('phaseTitle') as string
  const coachNotes = formData.get('coachNotes') as string
  const exercisesText = formData.get('exercisesText') as string

  if (!workoutId) return

  // Automatsko parsiranje tekstualnih linija u strukturu vježbi
  const exercises = exercisesText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(' ')
      // Ako zadnji dio liči na ponavljanja (npr. sadrži cifru ili 'x'), odvoj ga kao reps
      if (parts.length > 1) {
        const last = parts[parts.length - 1]
        if (/\d/.test(last)) {
          return {
            name: parts.slice(0, -1).join(' '),
            desc: '',
            reps: last
          }
        }
      }
      return {
        name: line,
        desc: '',
        reps: ''
      }
    })

  await query(
    `UPDATE workouts 
     SET week_label = $1, phase_title = $2, coach_notes = $3, exercises = $4 
     WHERE id = $5`,
    [weekLabel, phaseTitle, coachNotes, JSON.stringify(exercises), workoutId]
  )

  revalidatePath(`/admin/athletes/${athleteId}`)
  redirect(`/admin/athletes/${athleteId}`)
}

export default async function AthleteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ editWorkoutId?: string }>
}) {
  const { id } = await params
  const { editWorkoutId } = await searchParams

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
  const editingWorkout = workouts.find(w => w.id === editWorkoutId)

  // Priprema tekstualnog prikaza vježbi za textarea (naziv + reps u istom redu)
  const initialExercisesText = editingWorkout && Array.isArray(editingWorkout.exercises)
    ? editingWorkout.exercises.map(ex => ex.reps ? `${ex.name} ${ex.reps}` : ex.name).join('\n')
    : ''

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
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono px-3 py-1.5 rounded border uppercase ${athlete.is_paid ? 'bg-green-950/40 border-green-800 text-green-400' : 'bg-red-950/40 border-red-900 text-red-400'}`}>
                {athlete.is_paid ? 'Uplaćeno 🟢' : 'Nije uplaćeno 🔴'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/athletes/${athlete.id}?editWorkoutId=${w.id}`}
                        className="text-blue-400 hover:text-blue-300 border border-blue-900/40 bg-blue-950/20 px-3 py-1 rounded cursor-pointer text-xs font-mono"
                      >
                        Uredi
                      </Link>
                      <form action={deleteWorkout}>
                        <input type="hidden" name="workoutId" value={w.id} />
                        <input type="hidden" name="athleteId" value={athlete.id} />
                        <button type="submit" className="text-red-400 hover:text-red-300 border border-red-900/40 bg-red-950/20 px-3 py-1 rounded cursor-pointer text-xs font-mono">
                          Ukloni trening
                        </button>
                      </form>
                    </div>
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

        {/* Modal za Uređivanje Treninga */}
        {editingWorkout && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-xl max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-[#1f1f1f] pb-4">
                <h3 className="font-display text-lg font-bold uppercase text-white">Uredi Trening</h3>
                <Link 
                  href={`/admin/athletes/${athlete.id}`}
                  className="text-gray-400 hover:text-white font-mono text-xs"
                >
                  ✕ Zatvori
                </Link>
              </div>

              <form action={updateWorkout} className="space-y-4">
                <input type="hidden" name="workoutId" value={editingWorkout.id} />
                <input type="hidden" name="athleteId" value={athlete.id} />

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Oznaka Sedmice (npr. Sedmica 1)</label>
                  <input 
                    type="text" 
                    name="weekLabel" 
                    defaultValue={editingWorkout.week_label} 
                    required
                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Naziv Faze / Treninga</label>
                  <input 
                    type="text" 
                    name="phaseTitle" 
                    defaultValue={editingWorkout.phase_title} 
                    required
                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Napomena Trenera</label>
                  <textarea 
                    name="coachNotes" 
                    defaultValue={editingWorkout.coach_notes || ''} 
                    rows={2}
                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                    Vježbe (Svaka u novi red, npr. Power Clean 4x3)
                  </label>
                  <textarea 
                    name="exercisesText" 
                    defaultValue={initialExercisesText} 
                    rows={6}
                    required
                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-2 text-xs text-white font-mono whitespace-pre"
                    placeholder="Power Clean 4x3&#10;Back Squat 4x4"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#1f1f1f]">
                  <Link 
                    href={`/admin/athletes/${athlete.id}`}
                    className="px-4 py-2 rounded border border-[#1f1f1f] text-xs font-mono text-gray-400 hover:text-white"
                  >
                    Otkaži
                  </Link>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded bg-[#d4af37] text-black font-bold text-xs uppercase font-mono hover:bg-[#c29f30] cursor-pointer"
                  >
                    Sačuvaj izmjene
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}