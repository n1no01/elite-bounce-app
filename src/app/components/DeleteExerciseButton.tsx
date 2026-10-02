'use client'

import { useTransition } from 'react'

interface DeleteExerciseButtonProps {
  exerciseId: string
  exerciseTitle: string
  deleteAction: (formData: FormData) => Promise<void>
}

export function DeleteExerciseButton({ exerciseId, exerciseTitle, deleteAction }: DeleteExerciseButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (confirm(`Da li ste sigurni da želite obrisati vježbu "${exerciseTitle}"?`)) {
      const formData = new FormData()
      formData.append('exerciseId', exerciseId)
      startTransition(async () => {
        await deleteAction(formData)
      })
    }
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        disabled={isPending}
        className="text-red-400 hover:text-red-300 font-mono text-xs border border-red-900/40 px-3 py-1.5 rounded bg-red-950/20 hover:bg-red-900/30 transition-colors cursor-pointer disabled:opacity-50"
      >
        {isPending ? 'Brisanje...' : 'Obriši video'}
      </button>
    </form>
  )
}