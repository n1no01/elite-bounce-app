import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '../lib/db'
import Link from 'next/link'
import { ExerciseUploadForm } from './ExerciseUploadForm'
import { 
  logoutAdmin, 
  addAthlete, 
  updateAthlete, 
  togglePayment, 
  deleteAthlete, 
  assignWorkout, 
  addJumpTest, 
  sendNotification, 
  deleteNotification,
  markAthleteMessagesAsRead, 
  sendAdminMessage,
  createGroup,
  deleteGroup
} from './actions'

import { AdminChatWidget } from './components/AdminChatWidget'
import { AthletesSection } from './components/AthletesSection'
import { JumpTestSection } from './components/JumpTestSection'
import { WorkoutAssignSection } from './components/WorkoutAssignSection'
import { NotificationSection } from './components/NotificationSection'
import { GroupsManager } from './components/GroupsManager'

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

interface Notification {
  id: string
  athlete_id: string | null
  title: string
  message: string
}

interface Exercise {
  id: string
  title: string
}

interface Message {
  id: string
  athlete_id: string
  sender: string
  content: string
  is_read: boolean
  created_at: string
}

interface Group {
  id: string
  name: string
  description: string | null
  athlete_ids: string[]
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin_auth')

  if (!authCookie || authCookie.value !== 'true') {
    redirect('/admin/login')
  }

  const athletesResult = await query<Athlete>('SELECT * FROM athletes ORDER BY created_at DESC')
  const athletes: Athlete[] = athletesResult.rows

  const workoutsResult = await query<Workout>('SELECT * FROM workouts ORDER BY created_at DESC')
  const workouts: Workout[] = workoutsResult.rows

  let notifications: Notification[] = []
  try {
    const notifResult = await query<Notification>('SELECT * FROM notifications ORDER BY created_at DESC')
    notifications = notifResult.rows
  } catch (e) {
    notifications = []
  }

  let exercises: Exercise[] = []
  try {
    const exercisesResult = await query<Exercise>('SELECT * FROM exercises ORDER BY created_at DESC')
    exercises = exercisesResult.rows
  } catch (e) {
    exercises = []
  }

  let messages: Message[] = []
  try {
    const msgRes = await query<Message>("SELECT * FROM messages ORDER BY created_at DESC")
    messages = msgRes.rows
  } catch (e) {
    messages = []
  }

  // Dohvaćanje grupa i njihovih članova iz baze
  let groups: Group[] = []
  try {
    const groupsResult = await query<Group>(`
      SELECT g.id, g.name, g.description, 
             COALESCE(ARRAY_AGG(ga.athlete_id) FILTER (WHERE ga.athlete_id IS NOT NULL), '{}') as athlete_ids
      FROM groups g
      LEFT JOIN group_athletes ga ON g.id = ga.group_id
      GROUP BY g.id, g.name, g.description
      ORDER BY g.created_at DESC
    `)
    groups = groupsResult.rows
  } catch (e) {
    groups = []
  }

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
              href="/exercises" 
              className="border border-[#1f1f1f] bg-[#121212] text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors"
            >
              Biblioteka Vježbi ↗
            </Link>
            <Link 
              href="/leaderboard" 
              target="_blank" 
              className="border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors"
            >
              Elite Bounce Tabela ↗
            </Link>

            <form action={logoutAdmin}>
              <button type="submit" className="border border-[#1f1f1f] bg-[#121212] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors cursor-pointer">
                Odjava
              </button>
            </form>
          </div>
        </header>

        
        {/* SEKCIJA ZA SPORTISTE */}
        <AthletesSection 
          athletes={athletes} 
          workouts={workouts}
          addAthlete={addAthlete}
          updateAthlete={updateAthlete}
          togglePayment={togglePayment}
          deleteAthlete={deleteAthlete}
        />

        {/* SEKCIJA ZA TESTOVE SKOKA */}
        <JumpTestSection 
          athletes={athletes} 
          addJumpTest={addJumpTest} 
        />

        {/* SEKCIJA ZA KREIRANJE TRENINGA */}
        <WorkoutAssignSection 
          athletes={athletes} 
          groups={groups}
          assignWorkout={assignWorkout} 
        />

        {/* SEKCIJA ZA UPRAVLJANJE GRUPAMA */}
        <GroupsManager 
          athletes={athletes} 
          groups={groups} 
          createGroupAction={createGroup} 
          deleteGroupAction={deleteGroup} 
        />

          
        {/* SEKCIJA ZA OBAVJEŠTENJA */}
        <NotificationSection 
          athletes={athletes} 
          notifications={notifications} 
          sendNotification={sendNotification} 
          deleteNotification={deleteNotification} 
        />

        {/* SEKCIJA ZA BIBLIOTEKU VJEŽBI */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl space-y-6">
          <div className="border-b border-[#1f1f1f] pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold uppercase text-white mt-1">Dodaj Novu Vježbu</h2>
            </div>
            
            <Link 
              href="/exercises" 
              className="border border-[#1f1f1f] bg-[#0a0a0a] text-gray-300 hover:text-white text-xs font-mono px-3 py-1.5 rounded transition-colors"
            >
              Pregledaj sve ({exercises.length}) ↗
            </Link>
          </div>

          <div className="max-w-xl">
            <ExerciseUploadForm />
          </div>
        </div>

      </div>

      <AdminChatWidget 
        athletes={athletes} 
        messages={messages} 
        markAsReadAction={markAthleteMessagesAsRead}
        sendMessageAction={sendAdminMessage}
      />
    </div>
  )
}