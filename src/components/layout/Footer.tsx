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
  
  // Alamat kantor baru — fallback jika CMS belum diupdate
  const officeAddress = contacts.find((c: { title: string }) => c.title.includes('Kantor'))?.desc
    || "Dusun Bengang RT.05/RW.07 Desa Buahdua, Kec. Buahdua,\nKab. Sumedang, Jawa Barat - 45392";

  const emailInfo = contacts.find((c: { title: string }) => c.title.includes('Email'))?.desc
    || "abadidewana.ie@gmail.com";

  // Nomor telepon kantor baru
  const phoneInfo = contacts.find((c: { title: string }) => c.title.includes('Telepon'))?.desc
    || "(0261) 2142579";

  const waContacts = [
    { name: 'Fuja', phone: '6283847582958', displayPhone: '+62 838-4758-2958', role: 'Admin / Support' },
    { name: 'Ihsan', phone: '6282116381296', displayPhone: '+62 821-1638-1296', role: 'Teknisi / Support' },
    { name: 'Nurul', phone: '6281214614097', displayPhone: '+62 812-1461-4097', role: 'Admin / Keuangan' },
    { name: 'Zeinan', phone: '6285700363571', displayPhone: '+62 857-0036-3571', role: 'IT / Support' },
  ];

  return (
    <footer className="bg-brand-primary text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Area 1: Alamat Kantor */}
        <div>
          <h3 className="font-serif font-bold text-xl mb-4 text-brand-accent">Kantor</h3>
          <address className="not-italic text-gray-300 space-y-2 text-sm">
            <p className="font-bold text-white mb-1">Kantor Administrasi:</p>
            {officeAddress.split('\n').map((line: string, i: number) => (
              <p key={`addr-${i}`}>{line}</p>
            ))}
          </address>
        </div>

        {/* Area 2: Kontak & Dukungan */}
        <div>
          <h3 className="font-serif font-bold text-xl mb-4 text-brand-accent">Kontak &amp; Dukungan</h3>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex flex-col">
              <span className="font-bold text-white">Email:</span>
              <a href={`mailto:${emailInfo}`} className="hover:text-brand-accent transition-colors">{emailInfo}</a>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-white">Telepon Kantor:</span>
              <span>{phoneInfo}</span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-white mb-2">WhatsApp:</span>
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-1">
                {waContacts.map((contact, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-[10px] text-gray-400 mb-0.5 leading-tight">{contact.name} ({contact.role.split('/')[0].trim()})</span>
                    <a
                      href={`https://wa.me/${contact.phone}?text=Halo%20${contact.name},%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-accent transition-colors text-xs font-medium"
                    >
                      {contact.displayPhone}
                    </a>
                  </div>
                ))}
              </div>
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
