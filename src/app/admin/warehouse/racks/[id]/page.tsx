import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { getRackById, getCompartmentsByRackId } from '@/app/actions/warehouseActions';
import { notFound } from 'next/navigation';
import CompartmentList from '@/components/admin/warehouse/CompartmentList';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rack = await getRackById(id);
  return {
    title: rack ? `Detail Rak: ${rack.name} - ADIE ERP` : 'Rak Tidak Ditemukan',
  };
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RackDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch rack and its compartments
  const rack = await getRackById(id);
  
  if (!rack) {
    notFound();
  }

  const compartments = await getCompartmentsByRackId(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/warehouse"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{rack.name}</h1>
            <p className="text-gray-500 mt-1">{rack.description || 'Tidak ada deskripsi'}</p>
          </div>
        </div>
        <Link 
          href={`/admin/warehouse/racks/${rack.id}/edit`}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Profil Rak
        </Link>
      </div>
      
      {/* Compartments List Component */}
      <CompartmentList rackId={rack.id} initialCompartments={compartments} />
    </div>
  );
}
