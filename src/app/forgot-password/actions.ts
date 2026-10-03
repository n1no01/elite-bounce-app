'use server'

import { query } from '../lib/db'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) return { error: 'Email je obavezan' }

  // 1. Provjeri da li korisnik postoji u bazi
  const userRes = await query('SELECT id, full_name FROM athletes WHERE email = $1', [email])
  if (userRes.rows.length === 0) {
    // Iz sigurnosnih razloga vrati istu poruku da se ne otkriva ko ima nalog
    return { success: 'Ako email postoji u sistemu, poslan je link za resetovanje.' }
  }

  const user = userRes.rows[0]

  // 2. Generiši nasumični sigurni token i postavi rok važenja (15 minuta)
  const resetToken = crypto.randomBytes(32).toString('hex')
  const tokenExpires = new Date(Date.now() + 15 * 60 * 1000) // +15 min

  // 3. Sačuvaj token u bazu
  await query(
    'UPDATE athletes SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
    [resetToken, tokenExpires, user.id]
  )

  // 4. Pošalji mail sa linkom za reset
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

  await resend.emails.send({
    from: 'Elite Bounce <info@elitebounce.fit>', // Kasnije možeš verifikovati i svoju domenu
    to: email,
    subject: 'Resetovanje lozinke - Elite Bounce',
    html: `
      <div style="font-family: sans-serif; padding: 20px; background: #0a0a0a; color: #fff;">
        <h2>Pozdrav ${user.full_name},</h2>
        <p>Zatraženo je resetovanje lozinke za tvoj nalog.</p>
        <p>Klikni na dugme ispod kako bi postavio/la novu lozinku (link važi 15 minuta):</p>
        <a href="${resetLink}" style="display: inline-block; background: #d4af37; color: #000; padding: 12px 20px; font-weight: bold; text-decoration: none; border-radius: 5px;">Resetuj Lozinku</a>
        <p style="margin-top: 20px; font-size: 12px; color: #888;">Ako nisi ti zatražio/la ovo, zanemari ovaj mail.</p>
      </div>
    `
  })

  return { success: 'Ako email postoji u sistemu, poslan je link za resetovanje.' }
}
