import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { User, Lock, Mail, ShieldCheck, Building2, Phone } from 'lucide-react';

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Pengaturan</h2>
        <p className="text-sm text-gray-500 mt-1">Kelola informasi profil, keamanan, dan preferensi akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom Kiri: Menu Tab / Info Ringkas */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-brand-primary" />
            </div>
            <h3 className="font-bold text-gray-900">Administrator</h3>
            <p className="text-sm text-gray-500 mt-1 break-all">{user?.email || 'admin@cv-adie.com'}</p>
            <div className="mt-4 flex items-center justify-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 py-1.5 px-3 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              Akses Penuh
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Pengaturan */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Keamanan & Akun */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-gray-900">Keamanan Akun</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Login</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    disabled 
                    value={user?.email || ''} 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500">Email digunakan untuk login. Hubungi superadmin untuk mengubahnya.</p>
              </div>

              <hr className="border-gray-100 my-4" />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Ubah Kata Sandi</h4>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Kata Sandi Baru</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Konfirmasi Kata Sandi Baru</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Perbarui Kata Sandi
                </button>
              </div>
            </div>
          </div>

          {/* Profil Perusahaan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden opacity-75">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <h3 className="font-bold text-gray-900">Profil Perusahaan</h3>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">Segera Hadir</span>
            </div>
            <div className="p-6 space-y-4 pointer-events-none">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nomor WhatsApp Resmi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value="+6282127772205"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">Pengaturan informasi perusahaan secara dinamis akan tersedia di pembaruan sistem berikutnya.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
