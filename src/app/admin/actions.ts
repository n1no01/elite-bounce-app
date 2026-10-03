'use server'

import { query } from '../lib/db'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

interface WorkoutExercise {
  name: string
  desc: string
  reps: string
}

// 1. POPRAVLJENA ODJAVA ADMINA (Garantovano briše cookie)
export async function logoutAdmin() {
  const cs = await cookies()
  
  // Eksplicitno obriši i postavi istekao rok sa putanjom '/'
  cs.delete('admin_auth')
  cs.set('admin_auth', '', {
    expires: new Date(0),
    path: '/',
  })

  redirect('/admin/login')
}

export async function addAthlete(formData: FormData) {
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string || null
  const password = formData.get('password') as string || null
  const gender = formData.get('gender') as string
  const sport = formData.get('sport') as string || null
  const age = Number(formData.get('age'))
  const notes = formData.get('notes') as string || null
  const isPaid = formData.get('isPaid') === 'on'

  if (!fullName || !gender || !age) return

  // Heširanje lozinke prije spašavanja u bazu
  let hashedPassword = null
  if (password && password.trim() !== '') {
    hashedPassword = await bcrypt.hash(password, 10)
  }

  await query(
    'INSERT INTO athletes (full_name, email, password, gender, sport, age, notes, is_paid, subscription_start_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())',
    [fullName, email, hashedPassword, gender, sport, age, notes, isPaid]
  )
  revalidatePath('/admin')
}

export async function updateAthlete(formData: FormData) {
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

  // Ako je donesena nova lozinka, heširaj je i ažuriraj
  if (password && password.trim() !== '') {
    const hashedPassword = await bcrypt.hash(password, 10)
    await query(
      'UPDATE athletes SET full_name = $1, email = $2, password = $3, gender = $4, sport = $5, age = $6, notes = $7, is_paid = $8 WHERE id = $9',
      [fullName, email, hashedPassword, gender, sport, age, notes, isPaid, id]
    )
  } else {
    // Ako polje za lozinku nije popunjeno, zadrži postojeću lozinku u bazi
    await query(
      'UPDATE athletes SET full_name = $1, email = $2, gender = $3, sport = $4, age = $5, notes = $6, is_paid = $7 WHERE id = $8',
      [fullName, email, gender, sport, age, notes, isPaid, id]
    )
  }

  revalidatePath('/admin')
}

export async function togglePayment(formData: FormData) {
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

export async function deleteAthlete(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  await query('DELETE FROM athletes WHERE id = $1', [id])
  revalidatePath('/admin')
}

export async function assignWorkout(formData: FormData) {
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

export async function updateWorkout(formData: FormData) {
  const workoutId = formData.get('workoutId') as string
  const weekLabel = formData.get('weekLabel') as string
  const dayLabel = formData.get('dayLabel') as string
  const coachNotes = formData.get('coachNotes') as string
  const exercisesText = formData.get('exercisesText') as string

  if (!workoutId || !weekLabel || !dayLabel) return

  const exercisesArray: WorkoutExercise[] = exercisesText.split('\n').map(line => {
    const parts = line.split('|')
    return {
      name: parts[0]?.trim() || '',
      desc: parts[1]?.trim() || '',
      reps: parts[2]?.trim() || ''
    }
  })

  await query(
    'UPDATE workouts SET week_label = $1, phase_title = $2, coach_notes = $3, exercises = $4 WHERE id = $5',
    [weekLabel, dayLabel, coachNotes, JSON.stringify(exercisesArray), workoutId]
  )

  revalidatePath('/admin')
}

export async function deleteWorkout(formData: FormData) {
  const workoutId = formData.get('workoutId') as string
  if (!workoutId) return

  await query('DELETE FROM workouts WHERE id = $1', [workoutId])
  revalidatePath('/admin')
}

export async function addJumpTest(formData: FormData) {
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

export async function sendNotification(formData: FormData) {
  const recipientType = formData.get('recipientType') as string
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

export async function deleteNotification(formData: FormData) {
  const notificationId = formData.get('notificationId') as string
  if (!notificationId) return

  await query('DELETE FROM notifications WHERE id = $1', [notificationId])
  revalidatePath('/admin')
}

export async function addExercise(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const videoUrl = formData.get('videoUrl') as string

  if (!title || !videoUrl) return

  try {
    await query(
      'INSERT INTO exercises (title, description, video_url) VALUES ($1, $2, $3)',
      [title, description, videoUrl]
    )
    
    revalidatePath('/admin')
    revalidatePath('/exercises')
  } catch (error) {
    console.error('Greška pri spašavanju vježbe:', error)
  }
}

export async function deleteExercise(formData: FormData) {
  const exerciseId = formData.get('exerciseId') as string
  
  if (!exerciseId) return

  try {
    await query('DELETE FROM exercises WHERE id = $1', [exerciseId])
    revalidatePath('/exercises')
    revalidatePath('/admin')
  } catch (error) {
    console.error('Greška pri brisanju vježbe:', error)
  }
}