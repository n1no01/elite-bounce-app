'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  athlete_id: string
  sender: string // 'athlete' | 'admin'
  content: string
  is_read: boolean
  created_at: string
}

interface Athlete {
  id: string
  full_name: string
}

interface AdminChatWidgetProps {
  athletes: Athlete[]
  messages: Message[]
  sendMessageAction: (formData: FormData) => Promise<void>
  markAsReadAction: (athleteId: string) => Promise<void>
}

export function AdminChatWidget({ 
  athletes, 
  messages, 
  sendMessageAction,
  markAsReadAction 
}: AdminChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Izračunaj nepročitane poruke od sportista
  const unreadMessages = messages.filter(m => m.sender === 'athlete' && !m.is_read)
  const totalUnreadCount = unreadMessages.length

  // Grupiši poruke po sportistima
  const athletesWithMessages = athletes.map(athlete => {
    const athleteMsgs = messages.filter(m => m.athlete_id === athlete.id)
    const lastMsg = athleteMsgs[0] // Pošto su sortirane DESC
    const unreadCount = athleteMsgs.filter(m => m.sender === 'athlete' && !m.is_read).length

    return {
      ...athlete,
      lastMessage: lastMsg,
      unreadCount,
      hasMessages: athleteMsgs.length > 0
    }
  }).filter(a => a.hasMessages) // Prikazujemo samo one sa kojima postoji historija

  // Selektovani sportista i njegove poruke (za otvoren chat window)
  const selectedAthlete = athletes.find(a => a.id === selectedAthleteId)
  const currentAthleteMessages = messages
    .filter(m => m.athlete_id === selectedAthleteId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  const handleSelectAthlete = async (athleteId: string) => {
    setSelectedAthleteId(athleteId)
    // Označi poruke tog sportiste kao pročitane
    await markAsReadAction(athleteId)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedAthleteId || isSubmitting) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('athleteId', selectedAthleteId)
    formData.append('message', replyText)

    await sendMessageAction(formData)
    setReplyText('')
    setIsSubmitting(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* GLAVNI PROZOR CHATBOX-A */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-[#121212] border border-[#1f1f1f] rounded-2xl shadow-2xl flex flex-col h-[500px] overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5">
          
          {/* HEADER */}
          <div className="bg-[#0a0a0a] p-4 border-b border-[#1f1f1f] flex items-center justify-between">
            {selectedAthleteId ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedAthleteId(null)}
                  className="text-gray-400 hover:text-white text-xs font-mono bg-[#121212] border border-[#1f1f1f] px-2 py-1 rounded transition-colors"
                >
                  ← Nazad
                </button>
                <span className="font-bold text-sm text-white truncate max-w-[180px]">
                  {selectedAthlete?.full_name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[#d4af37] font-mono text-xs font-bold uppercase">PORUKE</span>
                {totalUnreadCount > 0 && (
                  <span className="bg-[#d4af37] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {totalUnreadCount} nove
                  </span>
                )}
              </div>
            )}

            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-sm font-bold px-2"
            >
              ✕
            </button>
          </div>

          {/* Sadržaj: LISTA SPORTISTA ili DHIREKTAN CHAT */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0a0a]/50">
            {!selectedAthleteId ? (
              /* NIVO 1: LISTA SPORTISTA KOJI SU PISALI */
              athletesWithMessages.length === 0 ? (
                <p className="text-xs text-gray-500 italic text-center py-10">Nema aktivnih konverzacija.</p>
              ) : (
                athletesWithMessages.map(athlete => (
                  <div 
                    key={athlete.id}
                    onClick={() => handleSelectAthlete(athlete.id)}
                    className="bg-[#121212] border border-[#1f1f1f] hover:border-[#d4af37]/50 p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white truncate">{athlete.full_name}</span>
                        {athlete.lastMessage && (
                          <span className="text-[9px] font-mono text-gray-500">
                            {new Date(athlete.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 truncate">
                        {athlete.lastMessage?.sender === 'admin' ? 'Ti: ' : ''}{athlete.lastMessage?.content}
                      </p>
                    </div>

                    {athlete.unreadCount > 0 && (
                      <span className="bg-[#d4af37] text-black font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        {athlete.unreadCount}
                      </span>
                    )}
                  </div>
                ))
              )
            ) : (
              /* NIVO 2: DIRECT CHAT SA IZABRANIM SPORTISTOM */
              <div className="space-y-3">
                <div className="text-center">
                  <Link 
                    href={`/admin/athletes/${selectedAthleteId}`}
                    className="text-[10px] font-mono text-[#d4af37] hover:underline"
                  >
                    Otvori profil sportiste ↗
                  </Link>
                </div>

                {currentAthleteMessages.map(msg => {
                  const isTrainerMessage = msg.sender === 'trainer'
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${isTrainerMessage ? 'items-end' : 'items-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-xl text-xs ${
                          isTrainerMessage 
                            ? 'bg-[#d4af37] text-black rounded-br-none font-medium' 
                            : 'bg-[#121212] border border-[#1f1f1f] text-gray-200 rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[9px] font-mono text-gray-500 mt-1 px-1">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* FOOTER za slanje poruke (samo unutar otvorenog chata) */}
          {selectedAthleteId && (
            <form onSubmit={handleSend} className="p-3 bg-[#0a0a0a] border-t border-[#1f1f1f] flex gap-2">
              <input 
                type="text" 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Napiši poruku..." 
                className="flex-1 bg-[#121212] border border-[#1f1f1f] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !replyText.trim()}
                className="bg-[#d4af37] hover:bg-yellow-600 disabled:opacity-50 text-black font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Šalji
              </button>
            </form>
          )}

        </div>
      )}

      {/* DUGME ZA OTVARANJE / ZATVARANJE CHATBOXA */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-[#d4af37] hover:bg-[#c29f30] text-black rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Otvori chat"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
          </svg>
        </button>
      )}
    </div>
  )
}