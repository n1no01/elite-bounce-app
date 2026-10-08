interface Notification {
  id: string
  title: string
  message: string
  created_at: string
}

interface NotificationsBannerProps {
  notifications: Notification[]
}

export default function NotificationsBanner({ notifications }: NotificationsBannerProps) {
  if (notifications.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-[#d4af37]/20 via-[#121212] to-[#121212] border-2 border-[#d4af37] rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl shadow-[#d4af37]/10">
      <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37] text-black flex items-center justify-center text-xl font-bold shadow-lg">
            🔔
          </div>
          <div>
            <span className="text-[#d4af37] font-mono text-[10px] font-bold uppercase tracking-widest">
              VAŽNA PORUKA OD TRENERA
            </span>
            <h2 className="font-display text-lg sm:text-xl font-black uppercase text-white">
              Obavijest
            </h2>
          </div>
        </div>
        <span className="text-xs font-mono bg-[#d4af37] text-black px-3 py-1 rounded-full font-bold">
          {notifications.length} {notifications.length === 1 ? 'obavještenje' : 'obavještenja'}
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="bg-[#0a0a0a]/90 border border-[#d4af37]/40 p-4 sm:p-5 rounded-xl space-y-2 shadow-inner"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="font-display font-bold text-base sm:text-lg text-[#d4af37] flex items-center gap-2">
                {notif.title}
              </h3>
              <span className="text-[10px] font-mono text-gray-400">
                {new Date(notif.created_at).toLocaleDateString('bs-BA', {
                  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">
              {notif.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}