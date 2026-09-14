import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Elite Bounce | Specijalizovani program za vertikalni skok u Sarajevu',
    template: '%s | Elite Bounce',
  },
  description: 'Profesionalni sistem za praćenje skokova, testiranje sportista i analizu vertikalnog odraza (CMJ, SJ, Approach Jump).',
  keywords: [
    'Elite Bounce', 
    'vertikalni odraz', 
    'vertikalni skok', 
    'testiranje sportista', 
    'kondicijski trener', 
    'testiranje sportista', 
    'Approach Jump', 
    'Košarka',
    'Odbojka', 
    'skokovi u vis', 
    'Bosna i Hercegovina'
  ],
  authors: [{ name: 'Elite Bounce' }],
  creator: 'Elite Bounce',
  publisher: 'Elite Bounce',
  // Ovdje će se automatski povući Vercel URL ili tvoja custom domena kad je postaviš
  metadataBase: new URL('https://elitebounce.fit'),
  openGraph: {
    title: 'Elite Bounce | Specijalizovani program za vertikalni skok u Sarajevu',
    description: 'Sistem za praćenje skokova i napretka sportista.',
    url: 'https://elitebounce.fit',
    siteName: 'Elite Bounce',
    locale: 'bs_BA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elite Bounce | Specijalizovani program za vertikalni skok u Sarajevu',
    description: 'Profesionalno testiranje i praćenje vertikalnog odraza.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bs" className="dark">
      <head>
        {/* Favicon ili dodatni meta tagovi po potrebi */}
      </head>
      <body className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen antialiased selection:bg-[#d4af37] selection:text-black">
        {children}
      </body>
    </html>
  )
}