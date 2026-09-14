'use client'

export function DeleteAthleteButton({ athleteId, athleteName, deleteAction }: { athleteId: string; athleteName: string; deleteAction: (formData: FormData) => void }) {
  return (
    <form 
      action={deleteAction} 
      onSubmit={(e) => {
        if (!confirm(`Da li ste sigurni da želite obrisati sportistu ${athleteName}? Ova akcija je nepovratna!`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={athleteId} />
      <button type="submit" className="text-red-400 hover:text-red-300 text-xs font-mono border border-red-900/40 bg-red-950/20 px-2.5 py-1.5 rounded transition-colors cursor-pointer">
        Obriši
      </button>
    </form>
  )
}