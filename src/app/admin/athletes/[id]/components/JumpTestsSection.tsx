import Link from 'next/link'

interface JumpTest {
  id: string
  test_type: string
  value: number
  created_at: string
}

interface JumpTestsSectionProps {
  tests: JumpTest[]
  athleteId: string
  deleteJumpTest: (formData: FormData) => void
}

export default function JumpTestsSection({ tests, athleteId, deleteJumpTest }: JumpTestsSectionProps) {
  return (
    <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
        <h2 className="font-display text-xl font-bold uppercase text-white">Istorija Testova Skoka ({tests.length})</h2>
      </div>

      {tests.length === 0 ? (
        <p className="text-xs text-gray-500 italic py-2">Nema evidentiranih testova skoka za ovog sportistu.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1f1f1f] text-gray-400 uppercase text-[10px]">
                <th className="py-3 px-4">Tip Testa</th>
                <th className="py-3 px-4">Rezultat</th>
                <th className="py-3 px-4">Datum Mjerenja</th>
                <th className="py-3 px-4 text-right">Akcija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {tests.map(test => (
                <tr key={test.id} className="hover:bg-[#0a0a0a]/50">
                  <td className="py-3 px-4 font-bold text-[#d4af37]">{test.test_type}</td>
                  <td className="py-3 px-4 text-white font-bold">{test.value} cm</td>
                  <td className="py-3 px-4 text-gray-400">{new Date(test.created_at).toLocaleDateString('bs-BA')}</td>
                  <td className="py-3 px-4 text-right">
                    <form action={deleteJumpTest} className="inline">
                      <input type="hidden" name="testId" value={test.id} />
                      <input type="hidden" name="athleteId" value={athleteId} />
                      <button type="submit" className="text-red-400 hover:text-red-300 border border-red-900/40 bg-red-950/20 px-2.5 py-1 rounded cursor-pointer text-[10px]">
                        Obriši
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}