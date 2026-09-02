import RackForm from '@/components/admin/warehouse/RackForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Tambah Rak - ADIE ERP',
};

export default function NewRackPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Tambah Rak Baru</h1>
          <p className="text-gray-500 mt-1">Tambahkan rak penyimpanan baru ke dalam sistem.</p>
        </div>
      </div>
      
      <RackForm />
    </div>
  );
}
