'use server'

import { query } from '../lib/db'
import bcrypt from 'bcryptjs'

export async function resetPassword(formData: FormData) {
  const token = formData.get('token') as string
  const newPassword = formData.get('password') as string

  if (!token || !newPassword) return { error: 'Nevažeći podaci' }

  // 1. Provjeri da li postoji korisnik s tim tokenom i da li je token još važeći
  const userRes = await query(
    'SELECT id FROM athletes WHERE reset_token = $1 AND reset_token_expires > NOW()',
    [token]
  )

  if (userRes.rows.length === 0) {
    return { error: 'Link za resetovanje je nevažeći ili je istekao.' }
  }

  const userId = userRes.rows[0].id

  // 2. Heširaj novu lozinku
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // 3. Ažuriraj lozinku i poništi (obriši) iskorišteni token
  await query(
    'UPDATE athletes SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
    [hashedPassword, userId]
  )

  return { success: 'Lozinka je uspješno promijenjena! Sada se možeš prijaviti.' }
}