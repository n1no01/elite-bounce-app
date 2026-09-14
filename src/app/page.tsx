'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqItems = [
    {
      q: "Koliko brzo mogu vidjeti prve rezultate u visini skoka?",
      a: "Brzina napretka najviše zavisi od toga u kakvoj si trenutno formi. Ako si početnik ili nikada nisi radio specifičan trening za skok, prve skokove i bolju eksplozivnost osjetit ćeš već nakon 3 do 4 sedmice — čim popravimo mehaniku i aktiviramo nervni sistem. Za ozbiljniji, trajni skok i jačanje tetiva potreban je kontinuitet kroz puni ciklus od 10 do 12 sedmica."
    },
    {
      q: "Da li je program namijenjen samo košarkašima?",
      a: "Primarno je građen s košarkom na umu, ali je jednako efikasan za odbojkaše, rukometaše i sve sportiste kojima trebaju viši skok i brži prvi korak. Principi razvoja eksplozivnosti, mehanike odraza i snage tetiva su univerzalni — ako tvoj sport zahtijeva da odvojiš noge od zemlje i dominiraš u skoku, Elite Bounce je za tebe."
    },
    {
      q: "Trebam li imati pristup teretani da bih trenirao s tobom?",
      a: "Osnovna oprema u teretani je poželjna ako želiš izvući maksimum iz programa. Skok se ne gradi samo skakanjem, nego i jačanjem mišića i tetiva pod opterećenjem. U slučaju da nemaš teretanu, možemo prilagoditi treninge tijelu i plijometriji, ali dugoročni napredak zahtijeva dodatne tegove."
    },
    {
      q: "Da li je program bezbjedan za koljena i zglobove?",
      a: "Apsolutno. Koljena najčešće stradaju od nasumičnih programa s interneta koji te pretreniraju beskonačnim skakanjem bez ikakvog reda. U Elite Bounce-u radimo potpuno suprotno: postupno jačamo tetive i učimo te pravilnom doskoku. Ovaj pristup ne samo da čuva zglobove, već i pomaže u rješavanju onog dosadnog \"skakačkog koljena\" i bolova koji te usporavaju."
    },
    {
      q: "Kako da kombinujem ovaj program sa klupskim treninzima i utakmicama?",
      a: "Program se u potpunosti prilagođava tvom klupskom rasporedu. Zavisno od toga da li si u jeku takmičarske sezone (In-season) ili na pauzi (Off-season), pametno doziramo volumen i intenzitet rada kako bi ostao maksimalno svjež i eksplozivan za utakmice, bez rizika od prevelikog umora."
    },
    {
      q: "Postoji li starosna granica za početak ovog protokola?",
      a: "Ne postoji. Trening se u potpunosti prilagođava tvojim godinama i trenutnom nivou forme. Ako si mlađi igrač, fokusiramo se na pravilnu mehaniku, stabilnost i građenje zdrave baze bez teških opterećenja. Za starije i iskusnije sportiste primjenjujemo naprednije metode za eksplozivnost i snagu. Bitno je samo da treniraš pametno i u skladu sa svojim tijelom."
    },
    {
      q: "Šta ako nakon par sedmica osjetim privremeni pad u visini skoka?",
      a: "To je potpuno normalan, naučno objašnjiv proces koji se zove akumulacija umora. Tokom najteže faze ciklusa, tvoj neuromuskularni sistem se adaptira na nove stimulanse. Pravi, eksplozivni skok i takozvani \"peak\" performansi nastupaju odmah nakon faze deloada (planskog rasterećenja)."
    }
  ]

  return (
    <div className="font-sans antialiased selection:bg-[#d4af37] selection:text-black bg-[#0a0a0a] text-[#f5f5f5]">
      
{/* NAVIGACIJA */}
<nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1f1f1f]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between">
    
    {/* 1. Lijeva kolona: Logo (Povećan) */}
    <div className="flex items-center flex-shrink-0">
      <Link href="/" className="flex items-center group py-2">
        <Image 
          src="/logo.png" 
          alt="Elite Bounce Logo" 
          width={500} 
          height={100} 
          priority 
          className="h-16 sm:h-20 w-auto object-contain"
        />
      </Link>
    </div>
    
    {/* 2. Srednja kolona: Meni (desktop) */}
    <div className="hidden lg:flex items-center justify-center space-x-8 text-sm font-semibold tracking-wide uppercase">
      <a href="#programi" className="hover:text-[#d4af37] transition-colors">Programi</a>
      <a href="#o-meni" className="hover:text-[#d4af37] transition-colors">O Meni</a>
      <a href="#faq" className="hover:text-[#d4af37] transition-colors">FAQ</a>
      <Link href="https://blog.elitebounce.fit" className="hover:text-[#d4af37] transition-colors">Blog</Link>
    </div>

    {/* 3. Desna kolona: Ikonice i dugmad */}
    <div className="flex items-center space-x-2 sm:space-x-4">
      {/* Instagram */}
      <a href="https://instagram.com/elite_bounce" target="_blank" rel="noopener noreferrer" className="hidden sm:block text-gray-400 hover:text-[#d4af37] transition-colors" aria-label="Instagram">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      </a>

      {/* LinkedIn */}
      <a href="https://www.linkedin.com/company/elite-bounce/" target="_blank" rel="noopener noreferrer" className="hidden sm:block text-gray-400 hover:text-[#d4af37] transition-colors" aria-label="LinkedIn">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
      </a>

      {/* Login */}
      <Link href="/login" className="border border-[#1f1f1f] bg-[#121212]/50 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
        Prijava
      </Link>

     
    </div>
  </div>
</nav>

      <main>
        {/* HERO SEKCIJA */}
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden px-4 sm:px-6">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="inline-block text-[#d4af37] font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-[#d4af37]/10 px-3 py-1 rounded border border-[#d4af37]/20 mb-6">
              JEDINI SPECIJALIZOVANI PROGRAM ZA VERTIKALNI SKOK U SARAJEVU
            </span>
            <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-black tracking-tight uppercase leading-none mb-6">
              NAUČNI PROTOKOL ZA <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-[#d4af37]">VERTIKALNI SKOK</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
              Razvij eksplozivnost i sirovu snagu kroz naučno utemeljene protokole biomehanike. Bez nagađanja. Samo mjerljivi rezultati na terenu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#programi" className="w-full sm:w-auto bg-[#d4af37] text-black font-display text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-4 rounded hover:bg-yellow-600 transition-all shadow-lg shadow-[#d4af37]/10">
                Izaberi Svoj Protokol
              </a>
              <a href="#o-meni" className="w-full sm:w-auto border border-[#1f1f1f] bg-[#121212]/50 text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-4 rounded hover:bg-[#1f1f1f] transition-all">
                Saznaj Više
              </a>
            </div>
          </div>
        </section>

        {/* STATS SEKCIJA */}
        <section className="border-y border-[#1f1f1f] bg-[#121212]/30 py-12 px-4 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">0%</div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-mono uppercase tracking-wider">Generičkih šablona</div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#d4af37] mb-1 whitespace-nowrap">+8 do 12cm</div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-mono uppercase tracking-wider whitespace-nowrap">Prosjek nakon 10 sedmica</div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">100%</div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-mono uppercase tracking-wider">Personalizovan pristup</div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">1 na 1</div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-mono uppercase tracking-wider">Direktno mentorstvo</div>
            </div>
          </div>
        </section>

        {/* PROGRAMI SEKCIJA */}
        <section id="programi" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">IZABERI PROGRAM</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">Personalizovani sistemi treninga prilagođeni tvom trenutnom nivou, ciljevima i pristupu opremi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Kartica 1 */}
            <div className="bg-[#121212] border border-[#1f1f1f] rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#d4af37]/40 transition-all duration-300">
              <div className="flex flex-col h-full">
                <div className="relative h-48 w-full overflow-hidden border-b border-[#1f1f1f] flex-shrink-0">
                  <Image 
                    src="/image1.jpeg" 
                    alt="The Vertical Protocol" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase mb-2">The Vertical Protocol</h3>
                    <p className="text-sm text-gray-400 mb-6">Personalizovani trening 1 na 1 fokusiran isključivo na tvoj vertikalni skok i tehniku.</p>
                    
                    <ul className="space-y-3 text-sm text-gray-200 border-t border-[#1f1f1f] pt-6">
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Biomehanička Analiza Pokreta</strong></li>
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Specifičan Trening Snage (3x)</strong></li>
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Elite Plyometrics Protokol</strong></li>
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Situacioni Court Day</strong></li>
                    </ul>
                  </div>
                  
                  <div className="pt-8">
                    <a href="mailto:info@elitebounce.fit?subject=Upit za program: The Vertical Protocol" className="block text-center w-full bg-[#1f1f1f] text-white text-xs font-bold uppercase tracking-widest py-3 rounded group-hover:bg-[#d4af37] group-hover:text-black transition-colors">
                      Izaberi Ovaj Plan
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Kartica 2 */}
            <div className="bg-[#121212] border border-[#1f1f1f] rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#d4af37]/40 transition-all duration-300">
              <div className="flex flex-col h-full">
                <div className="relative h-48 w-full overflow-hidden border-b border-[#1f1f1f] flex-shrink-0">
                  <Image 
                    src="/image2.jpg" 
                    alt="Bounce Code Virtual" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase mb-2">Bounce Code: Virtual</h3>
                    <p className="text-sm text-gray-400 mb-6">Treniraj po mom naučnom sistemu bez obzira gdje se nalaziš u svijetu.</p>
                    
                    <ul className="space-y-3 text-sm text-gray-200 border-t border-[#1f1f1f] pt-6">
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Video Analiza Pokreta</strong></li>
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Personalizovan Trening Protokol</strong></li>
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Direktno Mentorstvo I Analiza Forme</strong></li>
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Mjesečne Video Check-In Konsultacije</strong></li>
                    </ul>
                  </div>
                  
                  <div className="pt-8">
                    <a href="mailto:info@elitebounce.fit?subject=Upit za program: Bounce Code Virtual" className="block text-center w-full bg-[#1f1f1f] text-white text-xs font-bold uppercase tracking-widest py-3 rounded group-hover:bg-[#d4af37] group-hover:text-black transition-colors">
                      Izaberi Ovaj Plan
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Kartica 3 */}
            <div className="bg-[#121212] border border-[#1f1f1f] rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#d4af37]/40 transition-all duration-300">
              <div className="flex flex-col h-full">
                <div className="relative h-48 w-full overflow-hidden border-b border-[#1f1f1f] flex-shrink-0">
                  <Image 
                    src="/image3.jpg" 
                    alt="Elite Physique" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase mb-2">Elite Physique</h3>
                    <p className="text-sm text-gray-400 mb-6">Individualni rad fokusiran na opće atletske ciljeve: snagu, kompoziciju tijela ili kondiciju.</p>
                    
                    <ul className="space-y-3 text-sm text-gray-200 border-t border-[#1f1f1f] pt-6">
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Individualna Estetska Transformacija</strong></li>
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Fleksibilan Sistem Periodizacije</strong></li>
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Kontinuirana Stručna Kontrola Forme</strong></li>
                      <li className="flex items-center gap-3"><span className="text-[#d4af37]">✓</span> <strong>Protokol Za Ishranu I Oporavak</strong></li>
                    </ul>
                  </div>
                  
                  <div className="pt-8">
                    <a href="mailto:info@elitebounce.fit?subject=Upit za program: Elite Physique" className="block text-center w-full bg-[#1f1f1f] text-white text-xs font-bold uppercase tracking-widest py-3 rounded group-hover:bg-[#d4af37] group-hover:text-black transition-colors">
                      Izaberi Ovaj Plan
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ISKUSTVA / TESTIMONIALS */}
        <section id="iskustva" className="py-24 bg-[#121212]/30 border-t border-[#1f1f1f] px-4 sm:px-6 scroll-mt-20 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#d4af37] font-mono text-xs font-bold uppercase tracking-wider block mb-2">REZULTATI NA TERENU</span>
              <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight">ŠTA KAŽU KLIJENTI</h2>
              <p className="text-gray-400 text-sm mt-2">Rezultati na terenu mjereni kroz brojke i napredak u igri. Bez nagađanja.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-[#121212] border border-[#1f1f1f] p-8 rounded-xl relative flex flex-col justify-between">
                <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">
                  &ldquo;12 centimetara više za 10 sedmica. Elite Bounce mi je potpuno promijenio eksplozivnost. Nikad lakše nisam skakao niti se osjećao brže na terenu. Preporuka za svakog ko želi ozbiljan rezultat.&rdquo;
                </p>
                <div className="border-t border-[#1f1f1f] pt-4 flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-white uppercase text-sm">Anel Milak</div>
                    <div className="text-xs text-[#d4af37] font-mono">Košarkaš</div>
                  </div>
                  <span className="text-2xl font-mono text-gray-700">AM</span>
                </div>
              </div>

              <div className="bg-[#121212] border border-[#1f1f1f] p-8 rounded-xl relative flex flex-col justify-between">
                <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">
                  &ldquo;Program je prilagođen, temeljit i ne zahtijeva puno vremena. Trener pokazuje široko znanje tako što objašnjava svrhu svake vježbe i uvijek koriguje pogrešno izvođenje vježbi kako ne bi došlo do povrede. Prije dolaska često sam osjećao bol u leđima tokom treninga, što me ograničavalo i otežavalo napredak. Uz ozbiljan pristup, konstantan nadzor i fokus na pravilno izvođenje svake vježbe, bolovi su brzo nestali, a napredak u skoku primijetio sam već nakon dvije sedmice.&rdquo;
                </p>
                <div className="border-t border-[#1f1f1f] pt-4 flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-white uppercase text-sm">Salih Letić</div>
                    <div className="text-xs text-[#d4af37] font-mono">Košarkaš</div>
                  </div>
                  <span className="text-2xl font-mono text-gray-700">SL</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* O MENI + VIDEO */}
        <section id="o-meni" className="py-24 bg-[#0a0a0a] border-t border-[#1f1f1f] px-4 sm:px-6 scroll-mt-20 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-[#d4af37] font-mono text-xs font-bold uppercase tracking-wider block mb-2">GLAVNI TRENER</span>
                <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">Nino Herenda</h2>
                
                <div className="space-y-4 text-gray-400 text-sm md:text-base font-light leading-relaxed">
                  <p>
                    Prije nego što sam došao do vertikalnog skoka od 110 cm i postao certificirani kondicioni trener, proveo sam godine testirajući razne popularne programe s interneta. Rezultat? Frustracija i stagnacija.
                  </p>
                  <p>
                    Elite Bounce je nastao kao odgovor na sve te kopirane šablone. Umjesto generičkih vježbi, primjenjujem pristup koji tačno cilja tvoje slabe tačke. Identifikujemo gdje gubiš energiju pri odrazu, popravljamo mehaniku i treniramo tvoj nervni sistem da proizvede maksimalnu snagu. Bez gubljenja vremena, samo čist napredak.
                  </p>
                </div>
              </div>
              
              <div className="border border-[#1f1f1f] p-6 bg-[#121212] rounded-2xl">
                <h3 className="font-display font-bold text-white uppercase mb-4 text-sm tracking-wider">Licence i Certifikati</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-gray-300">
                  <div className="p-2.5 border border-[#1f1f1f] rounded bg-[#0a0a0a]">⚡ IUSCA Level 2 S&C Instructor</div>
                  <div className="p-2.5 border border-[#1f1f1f] rounded bg-[#0a0a0a]">⚡ CFT Level 1 Certified Trainer (PFHSC)</div>
                  <div className="p-2.5 border border-[#1f1f1f] rounded bg-[#0a0a0a]">⚡ Technology for Sports Performance (IUSCA)</div>
                  <div className="p-2.5 border border-[#1f1f1f] rounded bg-[#0a0a0a]">⚡ Health & Safety in Sports (IUSCA)</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full max-w-[280px] sm:max-w-xs rounded-2xl overflow-hidden border border-[#1f1f1f] bg-[#121212] shadow-2xl relative aspect-[9/16]">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/video1.mp4" type="video/mp4" />
                  Vaš pretraživač ne podržava video.
                </video>
              </div>
            </div>

          </div>
        </section>

        {/* FAQ SEKCIJA */}
        <section id="faq" className="py-24 bg-[#121212]/20 border-t border-[#1f1f1f] px-4 sm:px-6 scroll-mt-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#d4af37] font-mono text-xs font-bold uppercase tracking-wider block mb-2">ČESTA PITANJA</span>
              <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight">Savjeti i odgovori o treningu za vertikalni skok</h2>
              <p className="text-gray-400 text-sm mt-2">Sve što trebaš znati o treninzima eksplozivnosti prije nego što počnemo.</p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index
                return (
                  <div 
                    key={index} 
                    className="bg-[#121212] border border-[#1f1f1f] rounded-xl overflow-hidden transition-colors hover:border-[#d4af37]/30"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                    >
                      <span className="font-display font-bold text-sm sm:text-base uppercase text-white">
                        {item.q}
                      </span>
                      <span className={`text-[#d4af37] font-mono text-xl transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-6 pt-0 border-t border-[#1f1f1f]/50 mt-2">
                        <p className="text-gray-400 text-sm font-light leading-relaxed pt-4">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA CALL TO ACTION */}
        <section className="py-20 border-t border-[#1f1f1f] bg-[#121212]/30 px-4 sm:px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">SPREMAN ZA LET?</h2>
            <p className="text-gray-400 text-sm md:text-base mb-8">
              Klikom na dugme ispod pošalji mi direktan email sa svojim podacima i ciljevima, i javiću ti se u roku od 24 sata sa detaljima za početak saradnje.
            </p>
            <a 
              href="mailto:info@elitebounce.fit?subject=Prijava za Elite Bounce protokol" 
              className="inline-block bg-[#d4af37] text-black font-display text-xs sm:text-sm font-bold uppercase tracking-widest px-8 py-4 rounded hover:bg-yellow-600 transition-all shadow-lg shadow-[#d4af37]/10"
            >
              POŠALJI DIREKTAN UPIT NA EMAIL
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1f1f] py-12 text-center text-xs text-gray-500 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} ELITE BOUNCE. Sva prava zadržana.</p>
          <div className="flex gap-6 text-gray-400">
            <Link href="https://blog.elitebounce.fit" className="hover:text-[#d4af37] transition-colors">Blog</Link>
            <a href="https://instagram.com/elite_bounce" target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors">Instagram</a>
            <a href="https://www.linkedin.com/company/elite-bounce/" target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  )
}