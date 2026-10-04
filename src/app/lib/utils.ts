import { query } from './db'

export function formatDateForInput(dateString: string | Date | null): string {
  if (!dateString) return ''

  // Ako je string, uzmi samo prvih 10 znakova (YYYY-MM-DD) bez parsiranja kroz Date objekat
  if (typeof dateString === 'string') {
    return dateString.split('T')[0]
  }

  // Ako je Date objekat, izvuci lokalnu godinu, mjesec i dan da se izbjegne pomak zone
  const d = new Date(dateString)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}