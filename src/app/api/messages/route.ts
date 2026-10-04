import { NextResponse } from 'next/server'
import { query } from '../../lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const athleteId = searchParams.get('athleteId')

  if (!athleteId) {
    return NextResponse.json({ error: 'athleteId je obavezan' }, { status: 400 })
  }

  try {
    const res = await query(
      `SELECT id, athlete_id, sender, content, is_read, created_at 
       FROM messages 
       WHERE athlete_id = $1::uuid 
       ORDER BY created_at ASC`,
      [athleteId]
    )

    return NextResponse.json({ messages: res.rows })
  } catch (error) {
    console.error('Greška pri dohvaćanju poruka:', error)
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { athleteId, sender, content } = body

    if (!athleteId || !sender || !content) {
      return NextResponse.json({ error: 'Nedostaju obavezna polja' }, { status: 400 })
    }

    const res = await query(
      `INSERT INTO messages (athlete_id, sender, content)
       VALUES ($1::uuid, $2, $3)
       RETURNING id, athlete_id, sender, content, is_read, created_at`,
      [athleteId, sender, content]
    )

    return NextResponse.json({ message: res.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Greška pri čuvanju poruke:', error)
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 })
  }
}