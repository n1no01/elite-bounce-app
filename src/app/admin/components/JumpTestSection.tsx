import { formatDateForInput } from '../../lib/utils'

interface Athlete {
  id: string
  full_name: string
}

interface JumpTestSectionProps {
  athletes: Athlete[]
  addJumpTest: (formData: FormData) => Promise<void>
}

export function JumpTestSection({ athletes, addJumpTest }: JumpTestSectionProps) {
  return (
    <div className="bg-[#121212] border border-[#1f1f1f] p-6 sm:p-8 rounded-xl space-y-6">
      <div className="border-b border-[#1f1f1f] pb-4">
        <h2 className="font-display text-xl font-bold uppercase text-white mt-1">Dodaj Test Skoka</h2>
      </div>

      <form action={addJumpTest} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Sportista</label>
          <select name="athleteId" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
            <option value="">-- Izaberi sportistu --</option>
            {athletes.map(a => (
              <option key={a.id} value={a.id}>{a.full_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Tip Testa</label>
          <select name="testType" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none">
            <option value="CMJ">CMJ (Countermovement Jump)</option>
            <option value="CMJ-AS">CMJ-AS (with Arm Swing)</option>
            <option value="SJ">SJ (Squat Jump)</option>
            <option value="BJ">BJ (Broad Jump)</option>
            <option value="AJ">AJ (Approach Jump)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Vrijednost (cm)</label>
          <input type="number" step="0.1" name="value" required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" placeholder="npr. 45.5" />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Datum Testiranja</label>
          <input type="date" name="testDate" defaultValue={formatDateForInput(new Date())} required className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none" />
        </div>

        <div>
          <button type="submit" className="w-full bg-[#d4af37] text-black font-display font-bold uppercase tracking-wider py-3.5 rounded hover:bg-yellow-600 transition-all text-xs cursor-pointer">
            Sačuvaj Test
          </button>
        </div>
      </form>
    </div>
  )
}