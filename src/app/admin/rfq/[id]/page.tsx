import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Building2, Phone, Mail, Clock, Package,
  MessageCircle, Calendar, FileText
} from 'lucide-react';
import DeleteRFQButton from '@/components/admin/DeleteRFQButton';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  RFQ_RECEIVED: { label: 'Baru Diterima', color: 'bg-blue-100 text-blue-700' },
  QUOTATION_SENT: { label: 'Penawaran Dikirim', color: 'bg-amber-100 text-amber-700' },
  PO_RECEIVED: { label: 'PO Diterima', color: 'bg-purple-100 text-purple-700' },
  DELIVERY_ORDER: { label: 'Delivery Order', color: 'bg-indigo-100 text-indigo-700' },
  INVOICED: { label: 'Selesai (Invoiced)', color: 'bg-emerald-100 text-emerald-700' },
};

export default async function RFQDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch RFQ with items and linked products
  const { data: rfq, error } = await supabase
    .from('rfq_requests')
    .select(`
      *,
      rfq_items(
        id, quantity, notes,
        product:products(id, name, part_number, brand, category, image_url)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !rfq) {
    notFound();
  }

  const statusConfig = STATUS_CONFIG[rfq.status] || { label: rfq.status, color: 'bg-gray-100 text-gray-700' };
  const waNumber = (rfq.phone || '').replace(/[^0-9]/g, '');
  const waMessage = encodeURIComponent(
    `Halo Bapak/Ibu ${rfq.contact_person} dari ${rfq.company_name}, kami telah menerima permintaan penawaran (RFQ) Anda dan sedang memproses quotation. Mohon tunggu konfirmasi dari tim kami. Terima kasih.`
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/rfq" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Detail RFQ</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Diterima: {new Date(rfq.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-primary" />
              Informasi Klien
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Perusahaan</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{rfq.company_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Contact Person</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{rfq.contact_person}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </p>
                <a href={`mailto:${rfq.email}`} className="text-sm text-brand-primary hover:underline mt-0.5 block">
                  {rfq.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Telepon
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{rfq.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Urgensi
                </p>
                <p className={`text-sm font-semibold mt-0.5 ${rfq.urgency === 'Mendesak' ? 'text-red-600' : 'text-gray-900'}`}>
                  {rfq.urgency || 'Normal'}
                </p>
              </div>
              {rfq.updated_at && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Terakhir Diupdate
                  </p>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {new Date(rfq.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>

            {rfq.message && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1 mb-2">
                  <FileText className="w-3 h-3" /> Pesan / Catatan
                </p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                  {rfq.message}
                </p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-primary" />
              <h2 className="text-base font-semibold text-gray-900">
                Item yang Diminta
                {rfq.rfq_items?.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {rfq.rfq_items.length} item
                  </span>
                )}
              </h2>
            </div>

            {rfq.rfq_items && rfq.rfq_items.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {rfq.rfq_items.map((item: {
                  id: string;
                  quantity: number;
                  notes?: string | null;
                  product?: { id: string; name: string; part_number: string; brand: string; category: string; image_url?: string | null } | null;
                }) => (
                  <div key={item.id} className="px-6 py-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {item.product?.image_url ? (
                          <Image src={item.product.image_url} alt={item.product.name} width={40} height={40} className="w-10 h-10 object-cover rounded-lg" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.product?.name || '—'}</p>
                        <p className="text-xs text-gray-500">{item.product?.part_number} · {item.product?.brand}</p>
                        {item.notes && <p className="text-xs text-gray-400 mt-1 italic">{item.notes}</p>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900">{item.quantity} pcs</p>
                      <p className="text-xs text-gray-400">Qty</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-sm text-gray-400">
                Tidak ada item yang tercantum dalam RFQ ini.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — Actions */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Tindakan Cepat</h2>

            <a
              href={`https://wa.me/${waNumber}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 w-full px-4 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Balas via WhatsApp
            </a>

            <a
              href={`mailto:${rfq.email}?subject=Quotation%20untuk%20RFQ%20Anda%20—%20CV.%20ADIE&body=Yth.%20${rfq.contact_person}%2C%0A%0ABerikut%20kami%20sampaikan%20penawaran%20harga%20untuk%20kebutuhan%20Anda%3A`}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Kirim Email
            </a>

            <div className="pt-2 border-t border-gray-100">
              <DeleteRFQButton rfqId={rfq.id} redirectOnDelete="/admin/rfq" />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-xs text-gray-500 space-y-1.5">
            <p className="font-medium text-gray-600">Info Teknis</p>
            <p>ID: <span className="font-mono text-gray-700">{rfq.id.slice(0, 8)}…</span></p>
            <p>Masuk: {new Date(rfq.created_at).toLocaleString('id-ID')}</p>
            <p>Status DB: <span className="font-mono">{rfq.status}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
