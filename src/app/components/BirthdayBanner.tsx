
"use client"

interface Athlete {
  birth_date: string | Date | null
  full_name: string
}

function getBirthdayParts(
  birthDate: string | Date | null
): { month: number; day: number } | null {
  if (!birthDate) return null

  if (typeof birthDate === "string") {
    // SQL DATE format: YYYY-MM-DD
    const match = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!match) return null

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])

    const check = new Date(year, month - 1, day)

    if (
      check.getFullYear() !== year ||
      check.getMonth() !== month - 1 ||
      check.getDate() !== day
    ) {
      return null
    }

    return { month, day }
  }

  if (Number.isNaN(birthDate.getTime())) return null

  return {
    month: birthDate.getMonth() + 1,
    day: birthDate.getDate(),
  }
}

export default function BirthdayBanner({
  athlete,
}: {
  athlete: Athlete
}) {
  // Koristimo kalendarski datum u vremenskoj zoni BiH.
  const birthday = getBirthdayParts(athlete?.birth_date)

  const todayParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Sarajevo",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date())

  const todayMonth = Number(
    todayParts.find((part) => part.type === "month")?.value
  )
  const todayDay = Number(
    todayParts.find((part) => part.type === "day")?.value
  )

  const isBirthday =
    birthday !== null &&
    birthday.month === todayMonth &&
    birthday.day === todayDay

  if (!isBirthday) return null

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[#d4af37] bg-gradient-to-r from-[#d4af37]/30 via-[#121212] to-[#121212] p-6 shadow-2xl shadow-[#d4af37]/20 space-y-3 sm:p-8">
      <div className="pointer-events-none absolute -right-10 -bottom-10 text-8xl opacity-10">
        🎂
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#d4af37] text-2xl font-bold text-black shadow-lg">
          🎉
        </div>

        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
            POSEBAN DAN
          </span>

          <h2 className="font-display text-xl font-black uppercase text-white sm:text-2xl">
            Sretan rođendan, {athlete.full_name}! 🎂
          </h2>
        </div>
      </div>

      <p className="relative max-w-2xl text-xs font-medium leading-relaxed text-gray-200 sm:text-sm">
        Cijeli Elite Bounce tim ti želi sretan rođendan!
        Nastavi gaziti, ruši svoje granice i dominiraj
        svakom sekundom treninga. Idemo jako!
      </p>
    </div>
  )
}
