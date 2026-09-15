'use client'

import React, { useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface JumpMetric {
  label: string
  name: string
  val: number | null
  date: string | null
  history: { date: string; value: number }[]
}

export default function JumpProgressModal({ metric }: { metric: JumpMetric }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Kartica skoka koja reaguje na klik */}
      <div 
        onClick={() => metric.val !== null && setIsOpen(true)}
        className={`bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-xl flex flex-col justify-between space-y-3 transition-all ${
          metric.val !== null ? 'cursor-pointer hover:border-[#d4af37]/60 hover:bg-[#151515]' : 'opacity-60'
        }`}
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#d4af37] font-bold">{metric.label}</span>
          </div>
          <span className="text-[11px] text-gray-400 font-light block mt-0.5">{metric.name}</span>
        </div>

        <div>
          <span className="font-display text-2xl font-black text-white">
            {metric.val !== null && metric.val !== undefined ? `${metric.val} cm` : '—'}
          </span>
          {metric.date && (
            <span className="block text-[10px] font-mono text-gray-500 mt-1">
              Najbolje: {metric.date}
            </span>
          )}
        </div>
      </div>

      {/* MODAL I ZATAMNJENA POZADINA */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121212] border border-[#d4af37]/40 w-full max-w-2xl rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            {/* Header modala */}
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
              <div>
                <h3 className="font-display text-xl font-bold uppercase text-white mt-1">
                  {metric.name} ({metric.label})
                </h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-[#0a0a0a] border border-[#1f1f1f] text-gray-400 hover:text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Grafikon */}
            <div className="h-64 w-full pt-4">
              {metric.history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metric.history} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                    <XAxis dataKey="date" stroke="#71717a" textAnchor="end" fontSize={11} />
                    <YAxis stroke="#71717a" domain={['auto', 'auto']} fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#d4af37', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#d4af37', fontWeight: 'bold' }}
                      formatter={(value: unknown) => [`${value}cm`, 'Rezultat']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={3} dot={{ fill: '#d4af37', r: 4 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-xs font-mono">
                  Nema dovoljno podataka za prikaz grafikona.
                </div>
              )}
            </div>

            {/* Footer modala */}
            <div className="flex justify-end pt-2 border-t border-[#1f1f1f]">
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-[#d4af37] text-black font-display font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg hover:bg-yellow-600 transition-all text-xs cursor-pointer"
              >
                Zatvori
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}