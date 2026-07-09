import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Footer() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  const { data } = await supabase
    .from('cms_content')
    .select('content_data')
    .eq('section_key', 'about_page')
    .single();

  const legalContact = data?.content_data?.legal_contact || null;
  const contacts = legalContact?.contacts || [];
  
  const adminAddress = contacts.find((c: { title: string }) => c.title.includes('Administrasi'))?.desc || "Tanjungsari RT/RW 002/006, Kec. Sukasari\nKab. Sumedang, Jawa Barat.";
  const workshopAddress = contacts.find((c: { title: string }) => c.title.includes('Workshop'))?.desc || "Dusun Cinulukadu, RT/RW 03/08\nRancaekek, Kab. Bandung, Jawa Barat.";
  const phoneInfo = contacts.find((c: { title: string }) => c.title.includes('Telepon'))?.desc || "0821-2777-2205";
  const emailInfo = contacts.find((c: { title: string }) => c.title.includes('Email'))?.desc || "abadidewana.ie@gmail.com";

  return (
    <footer className="bg-brand-primary text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Area 1: Contact */}
        <div>
          <h3 className="font-serif font-bold text-xl mb-4 text-brand-accent">Kantor & Workshop</h3>
          <address className="not-italic text-gray-300 space-y-4 text-sm">
            <div>
              <p className="font-bold text-white mb-1">Kantor Administrasi:</p>
              {adminAddress.split('\n').map((line: string, i: number) => (
                <p key={`admin-${i}`}>{line}</p>
              ))}
            </div>
            <div>
              <p className="font-bold text-white mb-1">Workshop & Gudang:</p>
              {workshopAddress.split('\n').map((line: string, i: number) => (
                <p key={`workshop-${i}`}>{line}</p>
              ))}
            </div>
          </address>
        </div>

        {/* Area 2: Quick Links */}
        <div>
          <h3 className="font-serif font-bold text-xl mb-4 text-brand-accent">Kontak & Dukungan</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex flex-col">
              <span className="font-bold text-white">Email:</span>
              <a href={`mailto:${emailInfo}`} className="hover:text-brand-accent transition-colors">{emailInfo}</a>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-white">Telepon / WhatsApp:</span>
              {phoneInfo.split(' / ').map((p: string, i: number) => (
                <span key={`phone-${i}`}>{p}</span>
              ))}
            </li>
          </ul>
        </div>

        {/* Area 3: Copyright & Legal */}
        <div>
          <h3 className="font-serif font-bold text-xl mb-4 text-brand-accent">Legalitas Perusahaan</h3>
          <div className="text-sm text-gray-300 space-y-4">
            <p><strong>CV. ABADI DEWANA INDUSTRIAL EQUIPMENT</strong> terdaftar secara sah secara hukum dan memiliki status <strong>PKP Aktif</strong> yang berhak menerbitkan Faktur Pajak resmi untuk transaksi pengadaan B2B pabrik Anda.</p>
            <p className="pt-4 border-t border-gray-700">
              &copy; {new Date().getFullYear()} CV. ABADI DEWANA. Hak Cipta Dilindungi Undang-Undang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
