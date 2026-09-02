"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';
import { createRack, updateRack, Rack } from '@/app/actions/warehouseActions';

type RackFormProps = {
  initialData?: Rack;
};

export default function RackForm({ initialData }: RackFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    let res;
    if (initialData?.id) {
      res = await updateRack(initialData.id, formData);
    } else {
      res = await createRack(formData);
    }

    if (res.success) {
      router.push('/admin/warehouse');
    } else {
      setError(res.error || 'Terjadi kesalahan saat menyimpan data.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">{initialData ? 'Edit Rak' : 'Tambah Rak Baru'}</h2>
        <p className="text-sm text-gray-500 mt-1">Masukkan informasi detail tentang rak penyimpanan.</p>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nama Rak *</label>
          <input 
            type="text" 
            name="name" 
            required
            defaultValue={initialData?.name || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
            placeholder="Contoh: Rak A1, Rak B2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
          <textarea 
            name="description" 
            rows={3}
            defaultValue={initialData?.description || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none resize-none"
            placeholder="Catatan tambahan mengenai rak ini..."
          />
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-brand-primary hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
          ) : (
            <><Save className="w-4 h-4" /> Simpan Rak</>
          )}
        </button>
      </div>
    </form>
  );
}
