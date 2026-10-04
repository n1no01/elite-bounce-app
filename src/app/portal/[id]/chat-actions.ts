'use server'

import { query } from '../../lib/db'

export async function sendMessage(formData: FormData) {
  const athleteId = formData.get('athleteId') as string
  const sender = (formData.get('sender') as string) || 'athlete'
  const content = formData.get('content') as string

  if (!athleteId || !content || content.trim() === '') {
    return { error: 'Poruka ne može biti prazna.' }
  }

  try {
    await query(
      `INSERT INTO messages (athlete_id, sender, content) 
       VALUES ($1::uuid, $2, $3)`,
      [athleteId, sender, content.trim()]
    )

    return { success: true }
  } catch (error) {
    console.error('Greška pri slanju poruke:', error)
    return { error: 'Slanje poruke nije uspjelo.' }
  }
}