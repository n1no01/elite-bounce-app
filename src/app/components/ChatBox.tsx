'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Message {
  id: string
  athlete_id: string
  sender: 'athlete' | 'trainer'
  content: string
  is_read: boolean
  created_at: string
}

interface ChatBoxProps {
  athleteId: string
  currentUserType: 'athlete' | 'trainer'
}

export default function ChatBox({ athleteId, currentUserType }: ChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Centralizirana funkcija za dohvaćanje poruka
  const fetchMessages = useCallback(async () => {
    if (!athleteId) return
    try {
      const res = await fetch(`/api/messages?athleteId=${athleteId}`, {
        cache: 'no-store',
      })
      if (res.ok) {
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json()
          setMessages(data.messages || data || [])
        }
      }
    } catch (err) {
      console.error('Greška pri dohvaćanju poruka:', err)
    }
  }, [athleteId])

  useEffect(() => {
    let isMounted = true

    const loadInitialMessages = async () => {
      if (isMounted) {
        await fetchMessages()
      }
    }

    loadInitialMessages()

    const interval = setInterval(() => {
      fetchMessages()
    }, 3000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [fetchMessages])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Sigurno slanje poruke bez pucanja na res.json()
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return

    setLoading(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId,
          sender: currentUserType,
          senderType: currentUserType,
          content: newMessage.trim(),
          text: newMessage.trim(),
        }),
      })

      if (res.ok) {
        setNewMessage('')
        await fetchMessages()
      } else {
        // Sigurno čitanje greške ako server vrati neprazan JSON
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errData = await res.json()
          console.error('Server odbio poruku:', errData)
        } else {
          const errText = await res.text()
          console.error('Server odbio poruku sa statusom:', res.status, errText)
        }
      }
    } catch (err) {
      console.error('Greška pri slanju poruke:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Pop-up prozor za Chat */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-[#121212] border border-[#2a2a2a] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Zaglavlje / Header */}
          <div className="bg-[#1a1a1a] p-3.5 border-b border-[#2a2a2a] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <div>
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  {currentUserType === 'trainer' ? 'Chat sa Sportistom' : 'Trener'}
                </h3>
                <p className="text-[10px] text-gray-400 font-mono">Uživo poruke</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors font-mono text-sm"
              title="Zatvori chat"
            >
              ✕
            </button>
          </div>

          {/* Lista poruka */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#0a0a0a]">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-xs text-gray-500 font-mono italic">
                Nema poruka. Pošaljite prvu poruku!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender === currentUserType
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs font-sans ${
                        isMe
                          ? 'bg-[#d4af37] text-black font-medium rounded-br-xs'
                          : 'bg-[#1f1f1f] text-gray-200 border border-[#2a2a2a] rounded-bl-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] font-mono text-gray-500 mt-1 px-1">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Unos nove poruke */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-[#121212] border-t border-[#2a2a2a] flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Napiši poruku..."
              className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim()}
              className="bg-[#d4af37] hover:bg-[#c29f30] text-black font-bold px-3 py-2 rounded-xl text-xs font-mono transition-colors disabled:opacity-50"
            >
              Šalji
            </button>
          </form>

        </div>
      )}

      {/* Floating Chat Ikonica - Samo kada je chat zatvoren */}
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