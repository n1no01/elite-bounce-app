'use server'

import { query } from './db' // Prilagodi putanju do db fajla ako je drugačija
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitInquiryAction(formData: FormData) {
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const program = formData.get('program') as string
  const message = formData.get('message') as string

  if (!fullName || !email || !message) {
    return { success: false, message: 'Molimo popuni sva obavezna polja.' }
  }

  try {
    // 1. Upis upita u bazu (Neon PostgreSQL)
    await query(
      `INSERT INTO inquiries (full_name, email, program, message, created_at) VALUES ($1, $2, $3, $4, NOW())`,
      [fullName, email, program, message]
    )

    // 2. Slanje notifikacije na tvoj mail preko Resend-a
    await resend.emails.send({
      from: 'Elite Bounce <info@elitebounce.fit>', // Ili tvoj verifikovani domen ako ga imaš (npr. info@elitebounce.fit)
      to: 'ninogor@gmail.com', // Tvoj e-mail na koji primaš obavještenja
      replyTo: email, // Omogućava da klikom na "Reply" direktno odgovaraš klijentu
      subject: `Elite Bounce upit: ${fullName} (${program})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #0a0a0a; color: #f5f5f5; border-radius: 12px; max-width: 600px; border: 1px solid #1f1f1f;">
          <h2 style="color: #d4af37; text-transform: uppercase; margin-top: 0; font-size: 20px;">Novi Upit za Elite Bounce</h2>
          
          <div style="margin-bottom: 12px;">
            <strong style="color: #a0a0a0; font-size: 12px; text-transform: uppercase;">Ime i Prezime:</strong>
            <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: bold; color: #ffffff;">${fullName}</p>
          </div>

          <div style="margin-bottom: 12px;">
            <strong style="color: #a0a0a0; font-size: 12px; text-transform: uppercase;">Email adresa:</strong>
            <p style="margin: 4px 0 0 0; font-size: 15px;"><a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a></p>
          </div>

          <div style="margin-bottom: 16px;">
            <strong style="color: #a0a0a0; font-size: 12px; text-transform: uppercase;">Izabrani program:</strong>
            <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: bold; color: #ffffff;">${program}</p>
          </div>

          <hr style="border: 0; border-top: 1px solid #1f1f1f; margin: 20px 0;" />

          <div>
            <strong style="color: #a0a0a0; font-size: 12px; text-transform: uppercase;">Poruka i ciljevi klijenta:</strong>
            <div style="background-color: #121212; padding: 16px; border-radius: 8px; border: 1px solid #1f1f1f; margin-top: 8px; font-size: 14px; line-height: 1.5; color: #e0e0e0; white-space: pre-wrap;">${message}</div>
          </div>
        </div>
      `,
    })

    return { 
      success: true, 
      message: 'Uspješno si poslao upit! Javiću ti se u roku od 24 sata.' 
    }
  } catch (error) {
    console.error('Greška pri obradi upita:', error)
    return { 
      success: false, 
      message: 'Došlo je do greške prilikom slanja. Pokušaj ponovo.' 
    }
  }
}