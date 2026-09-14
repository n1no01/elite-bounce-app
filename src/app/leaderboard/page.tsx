import { query } from '../lib/db' // Prilagodi putanju do db fajla ako je drugačija
import Link from 'next/link'

interface LeaderboardEntry {
  test_type: string
  full_name: string
  sport: string | null
  max_value: number
  created_at: string
}

export default async function LeaderboardPage() {
  // SQL upit koji uzima maksimalnu vrijednost Approach Jump-a za svakog sportistu
  const result = await query<LeaderboardEntry>(`
    SELECT DISTINCT ON (t.athlete_id)
      t.test_type,
      a.full_name,
      a.sport,
      t.value AS max_value,
      t.created_at
    FROM jump_tests t
    JOIN athletes a ON t.athlete_id = a.id
    WHERE t.test_type = 'AJ'
    ORDER BY t.athlete_id, t.value DESC
  `)

  const records = result.rows

  // Sortiramo sportiste od najvećeg prema najmanjem rezultatu
  records.sort((a, b) => b.max_value - a.max_value)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] p-6 sm:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-[#1f1f1f] pb-6 flex items-center justify-between">
          <div>
            <span className="text-[#d4af37] font-mono text-xs font-bold uppercase tracking-widest">ELITE BOUNCE LEADERBOARD</span>
            <h1 className="font-display text-3xl font-black uppercase text-white mt-1">Vertikalni Skokovi</h1>
          </div>
          <Link 
            href="/skokovi" 
            className="border border-[#1f1f1f] bg-[#121212] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors"
          >
            ← Nazad
          </Link>
        </header>

        {/* Tabela */}
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#1f1f1f] flex items-center justify-between">
            <h2 className="font-display text-xl font-bold uppercase text-[#d4af37]">Najbolji vertikalni skokovi</h2>
            <span className="text-xs font-mono text-gray-500 uppercase">{records.length} takmičara</span>
          </div>

          {records.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nema evidentiranih rezultata za Approach Jump.
            </div>
          ) : (
            <div className="divide-y divide-[#1f1f1f]">
              {records.map((entry, index) => {
                const isFirst = index === 0
                const isSecond = index === 1
                const isThird = index === 2

                const rankStyle = isFirst 
                  ? 'border-[#d4af37]/60 bg-[#d4af37]/10 text-[#d4af37]' 
                  : isSecond 
                  ? 'border-gray-400/40 bg-gray-400/10 text-gray-300' 
                  : isThird 
                  ? 'border-amber-700/40 bg-amber-950/25 text-amber-600' 
                  : 'border-[#1f1f1f] bg-[#0a0a0a] text-gray-500'

                return (
                  <div 
                    key={entry.full_name} 
                    className={`flex items-center justify-between p-4 sm:px-6 transition-colors ${isFirst ? 'bg-[#d4af37]/[0.03]' : 'hover:bg-[#151515]'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border ${rankStyle}`}>
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-display font-bold text-white text-base">
                          {entry.full_name}
                        </div>
                        <div className="text-xs font-mono text-gray-400">
                          {entry.sport || 'Opći'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-black text-xl text-white">
                        {entry.max_value} <span className="text-xs font-mono text-[#d4af37]">cm</span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}