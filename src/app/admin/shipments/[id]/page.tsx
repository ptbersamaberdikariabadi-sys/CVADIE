"use client";

import { useEffect, useState, use } from "react";
import { getShipmentById } from "@/app/actions/shipmentActions";
import { Loader2, ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ShipmentItem {
  id: string;
  quantity: number;
  packing_quantity: number;
  notes: string;
  product: {
    part_number: string;
    name: string;
  };
  compartment: {
    name: string;
    rack: {
      name: string;
    };
  };
}

interface Shipment {
  id: string;
  type: 'INBOUND' | 'OUTBOUND';
  partner_name: string;
  notes: string;
  date: string;
  created_at: string;
  reference_number: string;
  partner_address: string;
  attention_person: string;
  driver_name: string;
  vehicle_number: string;
  quotation_number: string;
  po_code: string;
  po_date: string;
  shipment_items: ShipmentItem[];
}

export default function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getShipmentById(id);
      if (data) {
        setShipment(data);
      } else {
        router.push('/admin/shipments');
      }
      setIsLoading(false);
    }
    load();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!shipment) return null;

  // Helper for date formatting
  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 print:p-0 print:m-0 print:w-full print:max-w-none">
      {/* Header Actions - Hides when printing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/shipments" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Preview Cetak Surat Jalan</h1>
          </div>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Printer className="w-5 h-5" />
          Cetak Dokumen
        </button>
      </div>

      {/* A4 Paper Container */}
      <div className="bg-white shadow-lg mx-auto print:shadow-none print:m-0 text-black p-10 font-sans" style={{ minHeight: '297mm', width: '210mm' }}>
        
        {/* Company Header */}
        <div className="flex items-center justify-between border-b-[3px] border-black pb-4 mb-4">
          <div className="flex items-center gap-6">
            {/* Logo placeholder - replace with actual image */}
            <div className="w-[200px]">
              <Image src="/logo.jpeg" alt="Logo" width={200} height={80} className="object-contain" priority />
            </div>
            
            {/* Divider */}
            <div className="h-16 w-1 bg-black"></div>
            
            {/* Address */}
            <div className="text-[13px] font-bold leading-tight">
              <p>Alamat :</p>
              <p>Dusun Bengang rt 05 rw 07</p>
              <p>Desa Buhadua, Kec. Buahdua, Kab.</p>
              <p>Sumedang, Jawa Barat 45392</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Divider */}
             <div className="h-16 w-1 bg-black"></div>
             
             {/* Title */}
             <h1 className="text-3xl font-extrabold tracking-wide">SURAT JALAN</h1>
          </div>
        </div>

        {/* Partner & Info Header */}
        <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
          {/* Left: Partner Info */}
          <div className="border border-gray-300">
            <div className="p-1 border-b border-gray-300">Kepada Yth :</div>
            <div className="p-1 font-bold">{shipment.partner_name || '-'}</div>
            <div className="p-1 min-h-[60px]">Alamat : {shipment.partner_address || '-'}</div>
            <div className="p-1 border-t border-gray-300 flex">
               <span className="w-16">Attn.</span> <span>: {shipment.attention_person || '-'}</span>
            </div>
          </div>

          {/* Right: Shipment Info */}
          <div className="border border-gray-300 self-end">
            <div className="flex border-b border-gray-300 p-1">
              <span className="w-40 font-bold">NOMOR SURAT JALAN</span> <span>: {shipment.reference_number || '-'}</span>
            </div>
            <div className="flex border-b border-gray-300 p-1">
              <span className="w-40 font-bold">TANGGAL</span> <span>: {formatDate(shipment.date)}</span>
            </div>
            <div className="flex border-b border-gray-300 p-1">
              <span className="w-40 font-bold">DIKIRIM OLEH</span> <span>: {shipment.driver_name || '-'}</span>
            </div>
            <div className="flex p-1">
              <span className="w-40 font-bold">NOMOR POLISI</span> <span>: {shipment.vehicle_number || '-'}</span>
            </div>
          </div>
        </div>

        {/* Quotation No */}
        <div className="mb-1 text-sm font-bold uppercase">
          PENAWARAN HARGA NOMOR : {shipment.quotation_number || '-'}
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-black text-sm mb-16 text-center">
          <thead>
            <tr className="font-bold">
              <th className="border border-black p-2 w-12">No</th>
              <th className="border border-black p-2">KODE PO</th>
              <th className="border border-black p-2">TANGGAL PO</th>
              <th className="border border-black p-2 w-[35%]">NAMA BARANG</th>
              <th className="border border-black p-2 w-24">JUMLAH<br/>PACKING</th>
              <th className="border border-black p-2 w-24">JUMLAH<br/>BARANG</th>
              <th className="border border-black p-2">KETERANGAN</th>
            </tr>
          </thead>
          <tbody>
            {shipment.shipment_items.map((item, idx) => (
              <tr key={item.id}>
                <td className="border border-black p-2">{idx + 1}</td>
                <td className="border border-black p-2">{shipment.po_code || '-'}</td>
                <td className="border border-black p-2">{formatDate(shipment.po_date)}</td>
                <td className="border border-black p-2">
                  <div className="font-medium uppercase">{item.product.name}</div>
                  {item.product.part_number && (
                    <div className="text-gray-600 text-xs">{item.product.part_number}</div>
                  )}
                </td>
                <td className="border border-black p-2">{item.packing_quantity || 1}</td>
                <td className="border border-black p-2">{item.quantity}</td>
                <td className="border border-black p-2">{item.notes || '-'}</td>
              </tr>
            ))}
            {/* Render empty rows to fill space if needed */}
            {shipment.shipment_items.length < 5 && Array.from({length: 5 - shipment.shipment_items.length}).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                <td className="border border-black p-2 text-transparent">-</td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Signatures */}
        <div className="flex justify-between px-16 text-sm font-bold mt-20">
          <div className="text-center">
            <p className="mb-24">DITERIMA OLEH</p>
            <p>( ........................................ )</p>
          </div>
          <div className="text-center">
            <p className="mb-24">DIKIRIM OLEH</p>
            <p>{shipment.driver_name || '( ........................................ )'}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
