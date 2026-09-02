import RackForm from '@/components/admin/warehouse/RackForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getRackById } from '@/app/actions/warehouseActions';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Rak - ADIE ERP',
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditRackPage({ params }: PageProps) {
  const { id } = await params;
  const rack = await getRackById(id);

  if (!rack) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/warehouse"
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Rak</h1>
          <p className="text-gray-500 mt-1">Ubah informasi detail tentang rak penyimpanan.</p>
        </div>
      </div>
      
      <RackForm initialData={rack} />
    </div>
  );
}
