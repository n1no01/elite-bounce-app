import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '../lib/db' // Prilagodi import baze
import { deleteExercise } from '../admin/actions' // Prilagodi import akcije
import { ExercisesClient } from '../components/ExercisesClient' // Import nove klijentske komponente

interface Exercise {
  id: string
  title: string
  description: string | null
  video_url: string
  created_at: string
}

export default async function ExercisesPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin_auth')
  const isAdmin = authCookie?.value === 'true'
  const isAthlete = cookieStore.has('athlete_session')

  if (!isAdmin && !isAthlete) {
    redirect('/login')
  }

  let exercises: Exercise[] = []
  try {
    const exercisesResult = await query<Exercise>('SELECT * FROM exercises ORDER BY created_at DESC')
    exercises = exercisesResult.rows
  } catch (e) {
    exercises = []
  }

  return (
    <ExercisesClient
      initialExercises={exercises}
      isAdmin={isAdmin}
      deleteExercise={deleteExercise}
    />
  )
}