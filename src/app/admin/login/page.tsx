import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function handleLogin(formData: FormData) {
  'use server'
  const password = formData.get('password') as string

  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 dana
      path: '/',
    })
    redirect('/admin')
  }
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex items-center justify-center p-4 font-sans">
      <div className="bg-[#121212] border border-[#1f1f1f] p-8 rounded-xl max-w-md w-full">
        <span className="text-[#d4af37] font-mono text-xs font-bold uppercase tracking-widest block mb-2">RESTRICTED AREA</span>
        <h1 className="font-display text-2xl font-black uppercase text-white mb-6">Admin Prijava</h1>
        
        <form action={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Lozinka</label>
            <input 
              type="password" 
              name="password" 
              required
              className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded p-3 text-sm text-white focus:border-[#d4af37] outline-none"
              placeholder="Unesi admin šifru..."
            />
          </div>
          <button type="submit" className="w-full bg-[#d4af37] text-black font-display font-bold uppercase tracking-wider py-3 rounded hover:bg-yellow-600 transition-all text-xs cursor-pointer">
            Prijavi se
          </button>
        </form>
      </div>
    </div>
  )
}