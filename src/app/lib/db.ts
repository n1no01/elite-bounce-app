import { Pool, QueryResult, QueryResultRow } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string, 
  params?: unknown[]
): Promise<QueryResult<T>> {
  const client = await pool.connect()
  try {
    const res = await client.query<T>(text, params)
    return res
  } finally {
    client.release()
  }
}