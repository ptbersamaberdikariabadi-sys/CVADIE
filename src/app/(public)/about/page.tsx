import { CheckCircle, History, Building2, User, FileSignature, MapPin, Phone, Mail, Hammer, ShieldCheck, Factory, Droplet, Wrench } from 'lucide-react'
import * as Icons from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Profil CV. Abadi Dewana Industrial Equipment, visi misi, legalitas, dan komitmen kami sebagai pemasok komponen industri terpercaya di Indonesia.",
};

export const revalidate = 3600

const getDynamicIcon = (iconName: string | undefined, FallbackIcon: any) => {
  if (iconName && (Icons as any)[iconName]) {
    return (Icons as any)[iconName];
  }
  return FallbackIcon;
};

export default async function About() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: cmsData } = await supabase.from('cms_content').select('*').eq('section_key', 'about_page').single()
  
  const fallbackContent = {
    hero: {
      headline: "Tentang Kami",
      description: "Menjadi mitra bisnis terpercaya yang menawarkan harga terbaik, bertanggung jawab, serta mampu menyelesaikan masalah internal maupun kebutuhan mitra bisnis."
    },
    history: {
      title: "Sejarah Perusahaan",
      paragraphs: [
        "CV. Abadi Dewana Industrial Equipment (CV. ADIE) didirikan oleh Adie Woo pada tahun 2024. Berbekal pengalaman lebih dari 15 tahun di bidang technical services dan pemasaran suku cadang industri (sparepart marketing), beliau mendirikan perusahaan ini dengan jaringan sumber daya dan pengetahuan industri yang luas.",
        "Kami didukung oleh tenaga profesional berpengalaman yang siap memberikan jaminan atas solusi teknis, pengadaan, dan proyek yang kami kerjakan. Kami sangat bangga dengan konsistensi, komunikasi yang transparan, dan layanan purna jual (after-sales) yang unggul.",
        "Kami menyadari bahwa downtime mesin sangat merugikan bagi lini produksi. Oleh karena itu, kami hadir dengan jaringan global sourcing untuk mengatasi kelangkaan komponen, serta menentang keras monopoli harga yang tidak rasional."
      ],
      mission_title: "Misi & Komitmen",
      missions: [
        { title: "Harga Kompetitif", desc: "Memberikan penawaran harga terbaik yang kompetitif dan tetap membuka ruang untuk negosiasi." },
        { title: "Jaminan Garansi Riil", desc: "Memberikan jaminan garansi riil yang didasari tanggung jawab penuh, bukan sekadar formalitas di atas kertas. Penggantian 100% identik dan pendampingan ekstra." },
        { title: "Kualitas Layanan", desc: "Berkomitmen menjaga kualitas layanan demi memelihara kepercayaan jangka panjang dengan mitra." }
      ]
    },
    targets: {
      title: "Target Industri & Spesialisasi",
      items: [
        { icon: "Factory", label: "Textile Factory", desc: "Spinning & Dyeing" },
        { icon: "Wrench", label: "Autopart Factory", desc: "Assembly Lines" },
        { icon: "Building2", "label": "Food Factory", "desc": "F&B Production" },
        { icon: "FileSignature", label: "Pulp & Paper", desc: "Paper Processing" },
        { icon: "Droplet", label: "Water Treatment", desc: "WWTP / WTP" }
      ]
    },
    management: {
      title: "Manajemen Inti",
      items: [
        { name: "Adie Woo", role: "Founder & Marketing Director", description: "Memiliki pengalaman lebih dari 15 tahun di industri technical services dan pemasaran suku cadang (sparepart marketing)." }
      ]
    },
    legal_contact: {
      legal_title: "Legalitas Perusahaan",
      legals: [
        { icon: "Building2", title: "Perusahaan PKP", desc: "Status perpajakan resmi, siap menerbitkan Faktur Pajak" },
        { icon: "FileSignature", title: "Izin Usaha Lengkap", desc: "Akta Pendirian, SK Kemenkumham, NIB, NPWP Valid" },
        { icon: "ShieldCheck", title: "Anti-Monopoli & Global Sourcing", desc: "Melacak part langka/diskontinu dengan harga rasional" }
      ],
      contact_title: "Informasi Kontak & Lokasi",
      contacts: [
        { icon: "MapPin", title: "Kantor Administrasi", desc: "Tanjungsari RT/RW 002/006\nKec. Sukasari, Kab. Sumedang\nJawa Barat" },
        { icon: "Hammer", title: "Workshop & Gudang", desc: "Dusun Cinulukadu, RT/RW 03/08\nKec. Rancaekek, Kab. Bandung\nJawa Barat" },
        { icon: "Phone", title: "Telepon & Mobile", desc: "(0261) 2142579 / 0821-2777-2205" },
        { icon: "Mail", title: "Email Resmi", desc: "abadidewana.ie@gmail.com" }
      ]
    }
  };

  const content = (cmsData?.content_data as unknown as typeof fallbackContent) || fallbackContent;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-brand-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">{content.hero.headline}</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200 leading-relaxed">
            {content.hero.description}
          </p>
        </div>
      </section>

      {/* Sejarah & Pendirian */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold text-brand-primary mb-6">{content.history.title}</h2>
            {(content.history?.paragraphs || []).map((p: string, idx: number) => (
              <p key={idx} className="text-gray-600 mb-4 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          <div className="bg-gray-50 p-8 rounded-xl border">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-800">
              <History className="w-5 h-5 text-brand-accent" /> {content.history.mission_title}
            </h3>
            <div className="space-y-6">
              {(content.history?.missions || []).map((t: Record<string, string>, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Target Industri (Partner Target) */}
      <section className="py-20 bg-brand-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-12">{content.targets.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {(content.targets?.items || []).map((Target: Record<string, string>, idx: number) => {
              const IconComp = getDynamicIcon(Target.icon, Factory) as React.ElementType;
              return (
                <div key={idx} className="flex flex-col items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <IconComp className="w-12 h-12 text-brand-accent mb-4" />
                  <h3 className="font-bold text-lg mb-1">{Target.label}</h3>
                  <p className="text-xs text-gray-300">{Target.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Manajemen */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-brand-primary mb-12">{content.management.title}</h2>
          <div className="flex justify-center flex-wrap gap-8">
            {(content.management?.items || []).map((mgr: Record<string, string>, idx: number) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center max-w-sm w-full">
                <div className="w-24 h-24 bg-brand-primary/10 rounded-full mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-brand-primary" />
                </div>
                <h3 className="font-bold text-xl text-gray-900">{mgr.name}</h3>
                <p className="text-brand-accent text-sm font-bold mb-4 uppercase tracking-wider">{mgr.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {mgr.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legalitas & Kontak */}
      <section className="py-20 bg-white border-t">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Legalitas */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-brand-primary mb-8">{content.legal_contact.legal_title}</h2>
            <div className="flex flex-col gap-4">
              {(content.legal_contact?.legals || []).map((leg: Record<string, string>, idx: number) => {
                const IconComp = getDynamicIcon(leg.icon, Building2) as React.ElementType;
                return (
                  <div key={idx} className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-lg border">
                    <IconComp className="w-8 h-8 text-brand-accent" />
                    <div>
                      <div className="font-bold text-gray-900">{leg.title}</div>
                      <div className="text-sm text-gray-500">{leg.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Kontak & Lokasi */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-brand-primary mb-8">{content.legal_contact.contact_title}</h2>
            <div className="space-y-6 bg-gray-50 p-8 rounded-xl border">
              {(content.legal_contact?.contacts || []).map((cnt: Record<string, string>, idx: number) => {
                const IconComp = getDynamicIcon(cnt.icon, MapPin) as React.ElementType;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <IconComp className="w-6 h-6 text-brand-accent shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-gray-900">{cnt.title}</div>
                      <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {cnt.desc}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
