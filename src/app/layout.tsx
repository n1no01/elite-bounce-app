import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Elite Bounce | Specijalizovani program za vertikalni skok',
    template: '%s | Elite Bounce',
  },
  alternates: {
    canonical: 'https://elitebounce.fit',
  },
  description: 'Profesionalni sistem za praćenje skokova, testiranje sportista i analizu vertikalnog odraza.',
  keywords: [
    'Elite Bounce', 
    'vertikalni odraz', 
    'vertikalni skok', 
    'testiranje sportista', 
    'kondicijski trener', 
    'Approach Jump',
    'skok iz zaleta', 
    'Košarka',
    'Odbojka', 
    'skokovi u vis', 
    'Bosna i Hercegovina'
  ],
  authors: [{ name: 'Elite Bounce' }],
  creator: 'Elite Bounce',
  publisher: 'Elite Bounce',
  metadataBase: new URL('https://elitebounce.fit'),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    title: 'Elite Bounce | Specijalizovani program za vertikalni skok',
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

// 1. JSON-LD Šema za Biznis / Organizaciju (Lokalni SEO)
const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  name: 'Elite Bounce',
  url: 'https://elitebounce.fit',
  logo: 'https://elitebounce.fit/android-chrome-512x512.png',
  description: 'Specijalizovani sistem za testiranje sportista, praćenje i poboljšanje vertikalnog skoka u Sarajevu.',
  brand: {
    '@type': 'Brand',
    name: 'Elite Bounce',
    logo: 'https://elitebounce.fit/android-chrome-512x512.png',
  },
  founder: {
    '@type': 'Person',
    name: 'Nino Herenda',
    jobTitle: 'Strength & Conditioning Coach',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sarajevo',
    addressCountry: 'BA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '43.8563',
    longitude: '18.4131',
  },
  sameAs: [
    'https://www.instagram.com/elite_bounce',
    'https://www.linkedin.com/company/elite-bounce/'
  ],
}

// 2. JSON-LD Šema za FAQ (Preslikano 1:1 iz page.tsx za maksimalan Google CTR)
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Koliko brzo mogu vidjeti prve rezultate u visini skoka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brzina napretka najviše zavisi od toga u kakvoj si trenutno formi. Ako si početnik ili nikada nisi radio specifičan trening za skok, prve skokove i bolju eksplozivnost osjetit ćeš već nakon 3 do 4 sedmice. Za ozbiljniji, trajni skok i jačanje tetiva potreban je kontinuitet kroz puni ciklus od 10 do 12 sedmica.',
      },
    },
    {
      '@type': 'Question',
      name: 'Da li je program namijenjen samo košarkašima?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Primarno je građen s košarkom na umu, ali je jednako efikasan za odbojkaše, rukometaše i sve sportiste kojima trebaju viši skok i eksplozivnost. Principi razvoja eksplozivnosti, mehanike odraza i snage tetiva su univerzalni — ako tvoj sport zahtijeva da odvojiš noge od zemlje i dominiraš u skoku, Elite Bounce je za tebe.',
      },
    },
    {
      '@type': 'Question',
      name: 'Trebam li imati pristup teretani da bih trenirao s tobom?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Osnovna oprema u teretani je poželjna ako želiš izvući maksimum iz programa. Skok se ne gradi samo skakanjem, nego i jačanjem mišića i tetiva pod opterećenjem. U slučaju da nemaš teretanu, možemo prilagoditi treninge, ali dugoročni napredak zahtijeva dodatne tegove.',
      },
    },
    {
      '@type': 'Question',
      name: 'Da li je program bezbjedan za koljena i zglobove?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Apsolutno. Koljena najčešće stradaju od nasumičnih programa s interneta koji te pretreniraju beskonačnim skakanjem bez ikakvog reda. U Elite Bounce-u radimo potpuno suprotno: postupno jačamo tetive i učimo te pravilnom doskoku. Ovaj pristup ne samo da čuva zglobove, već i pomaže u rješavanju onog dosadnog "skakačkog koljena" i bolova koji te usporavaju.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kako da kombinujem ovaj program sa klupskim treninzima i utakmicama?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Program se u potpunosti prilagođava tvom klupskom rasporedu. Zavisno od toga da li si u jeku takmičarske sezone (In-season) ili na pauzi (Off-season), pametno doziramo volumen i intenzitet rada kako bi ostao maksimalno svjež i eksplozivan za utakmice, bez rizika od prevelikog umora.',
      },
    },
    {
      '@type': 'Question',
      name: 'Postoji li starosna granica za početak ovog protokola?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ne postoji. Trening se u potpunosti prilagođava tvojim godinama i trenutnom nivou forme. Ako si mlađi igrač, fokusiramo se na pravilnu mehaniku, stabilnost i građenje zdrave baze bez teških opterećenja. Za starije i iskusnije sportiste primjenjujemo naprednije metode za eksplozivnost i snagu. Bitno je samo da treniraš pametno i u skladu sa svojim tijelom.',
      },
    },
    {
      '@type': 'Question',
      name: 'Šta ako nakon par sedmica osjetim privremeni pad u visini skoka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To je potpuno normalan, naučno objašnjiv proces koji se zove akumulacija umora. Tokom najteže faze ciklusa, tvoj neuromuskularni sistem se adaptira na nove stimulanse. Pravi, eksplozivni skok i takozvani "peak" performansi nastupaju odmah nakon faze deloada (planskog rasterećenja).',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bs" className="dark">
      <head>
        {/* Biznis / Lokalni SEO Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        {/* FAQ Schema za Google pretragu */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen antialiased selection:bg-[#d4af37] selection:text-black">
        {children}
      </body>
    </html>
  )
}