import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Eye, MessageCircle } from 'lucide-react';

export default async function AdminRFQPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: rfqs } = await supabase
    .from('rfq_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Baru':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Baru</span>;
      case 'Negosiasi':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Negosiasi</span>;
      case 'Selesai':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Selesai</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status || 'Baru'}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">Daftar Prospek Masuk</h2>
        <div className="flex gap-2">
          {/* Filters can go here */}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="p-4">Tanggal</th>
              <th className="p-4">Klien</th>
              <th className="p-4">Kontak</th>
              <th className="p-4">Urgensi</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rfqs && rfqs.length > 0 ? (
              rfqs.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(rfq.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{rfq.company_name}</div>
                    <div className="text-sm text-gray-500">{rfq.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">{rfq.email}</div>
                    <div className="text-sm text-gray-500">{rfq.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${rfq.urgency === 'Mendesak' ? 'text-red-600' : 'text-gray-600'}`}>
                      {rfq.urgency || 'Normal'}
                    </span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(rfq.status)}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="p-2 text-gray-400 hover:text-brand-primary bg-gray-50 hover:bg-brand-primary/10 rounded-lg transition-colors inline-flex items-center" title="Detail RFQ">
                      <Eye className="w-4 h-4" />
                    </button>
                    <a 
                      href={`https://wa.me/${(rfq.phone || '').replace(/[^0-9]/g, '')}?text=Halo Bapak/Ibu ${rfq.name} dari ${rfq.company_name}, kami telah menerima permintaan penawaran (RFQ) Anda...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center" 
                      title="Balas via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Belum ada prospek yang masuk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
