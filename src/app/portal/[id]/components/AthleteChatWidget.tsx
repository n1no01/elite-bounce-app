'use client'

import React, { useState, useRef, useEffect, useTransition } from 'react'

interface Message {
  id: string
  athlete_id: string
  sender: string // 'athlete' | 'trainer'
  content: string
  is_read: boolean
  created_at: string
}

interface AthleteChatWidgetProps {
  athleteId: string
  initialMessages: Message[]
  sendMessageAction: (formData: FormData) => Promise<void>
  markAsReadAction: (athleteId: string) => Promise<void>
}

export function AthleteChatWidget({
  athleteId,
  initialMessages,
  sendMessageAction,
  markAsReadAction,
}: AthleteChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isPending, startTransition] = useTransition()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Automatsko skrolovanje i označavanje pročitanog SAMO KADA SE KLIJENT FIZIČKI OTVORI CHAT
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      
      // Provjeri da li ima nepročitanih poruka od trenera
      const hasUnreadTrainerMsgs = initialMessages.some(
        (m) => m.sender === 'trainer' && !m.is_read
      )

      if (hasUnreadTrainerMsgs) {
        markAsReadAction(athleteId)
      }
    }
  }, [isOpen, athleteId, initialMessages, markAsReadAction])

  // Provjera da li ima nepročitanih poruka od trenera (za notifikacijski bedž)
  const unreadCount = initialMessages.filter(
    (m) => m.sender === 'trainer' && !m.is_read
  ).length

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const content = inputMessage
    setInputMessage('')

    const formData = new FormData()
    formData.append('athleteId', athleteId)
    formData.append('message', content)

    startTransition(async () => {
      await sendMessageAction(formData)
    })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Dugme za otvaranje/zatvaranje chata */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-[#d4af37] text-black font-bold p-4 rounded-full shadow-2xl hover:bg-[#c29f30] transition-transform hover:scale-105 flex items-center justify-center cursor-pointer border border-[#f5f5f5]/20"
          aria-label="Otvori chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>

          {/* Notifikacijski bedž ukoliko ima nepročitanih poruka */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a] animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Glavni prozor chata */}
      {isOpen && (
        <div className="bg-[#121212] border border-[#1f1f1f] w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header chata */}
          <div className="bg-[#181818] px-4 py-3 border-b border-[#1f1f1f] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-display font-bold uppercase text-white text-sm tracking-wider">
                Direktni Chat sa Trenerom
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white font-mono text-xs cursor-pointer p-1"
            >
              ✕
            </button>
          </div>

          {/* Lista poruka */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0a0a0a]">
            {initialMessages.length === 0 ? (
              <div className="text-center text-gray-500 text-xs font-mono mt-20">
                Nema poruka. Pošalji poruku treneru i započni razgovor!
              </div>
            ) : (
              initialMessages.map((msg) => {
                const isMe = msg.sender === 'athlete'
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs font-sans ${
                        isMe
                          ? 'bg-[#d4af37] text-black rounded-br-none font-medium'
                          : 'bg-[#1a1a1a] text-gray-200 border border-[#2a2a2a] rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>

                    {/* Vrijeme i kvačice */}
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 font-mono">
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {/* Prikazujemo kvačice SAMO na porukama koje je poslao klijent (isMe) */}
                      {isMe && (
                        <span
                          className={msg.is_read ? 'text-[#d4af37] font-bold' : 'text-gray-500'}
                          title={msg.is_read ? 'Pročitao trener' : 'Poslano'}
                        >
                          {msg.is_read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Forma za slanje poruke */}
          <form onSubmit={handleSend} className="p-3 bg-[#121212] border-t border-[#1f1f1f] flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Napiši poruku treneru..."
              className="flex-1 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] font-sans"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={isPending || !inputMessage.trim()}
              className="bg-[#d4af37] text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#c29f30] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Pošalji
            </button>
          </form>
        </div>
      )}
    </div>
  )
}