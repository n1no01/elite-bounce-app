'use server'

import { Resend } from 'resend'
import { Pool } from '@neondatabase/serverless'

const resend = new Resend(process.env.RESEND_API_KEY)
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function downloadEbookAction(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  if (!email || !name) {
    return { success: false, error: 'Molimo unesite ime i validnu email adresu.' }
  }

  try {
    // 1. Upis u Neon bazu
    try {
      await pool.query(
        `INSERT INTO ebook_leads (name, email) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`,
        [name, email]
      )
    } catch (dbError) {
      console.error('Greška pri upisu u Neon bazu:', dbError)
      // Nećemo prekidati proces ako je samo baza pukla, ali možemo zabilježiti
    }

    // 2. Slanje emaila sa Resend-om
    await resend.emails.send({
      from: 'Nino Herenda <info@elitebounce.fit>',
      to: [email],
      subject: 'Tvoj besplatni vodič: Elite Bounce Metodologija',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #f5f5f5; padding: 40px; border-radius: 8px;">
          <h2 style="color: #d4af37; text-transform: uppercase;">Pozdrav ${name},</h2>
          <p>Hvala ti što si preuzeo <strong>Elite Bounce Metodologiju</strong> — opći vodič za razumijevanje i razvoj vertikalnog skoka.</p>
          <p>Svoj besplatni PDF vodič možeš preuzeti direktno putem linka ispod:</p>
          <p style="margin: 30px 0;">
            <a href="https://elitebounce.fit/Elite_Bounce_Metodologija.pdf" style="background-color: #d4af37; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
              Preuzmi PDF Knjigu
            </a>
          </p>
          <p>Primijeni ove principe u svom treningu i javi utiske!</p>
          <p style="margin-top: 40px; font-size: 12px; color: #888;">Nino Herenda | Elite Bounce<br>elitebounce.fit</p>
        </div>
      `,
    })

    return { success: true, message: 'Vodič je uspješno poslan na tvoj email!' }
  } catch (error) {
    console.error('Greška pri slanju e-booka:', error)
    return { success: false, error: 'Došlo je do greške. Pokušajte ponovo kasnije.' }
  }
}