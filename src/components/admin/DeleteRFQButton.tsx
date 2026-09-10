"use client";

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteRFQ } from '@/app/actions/rfqActions';
import { useRouter } from 'next/navigation';

export default function DeleteRFQButton({
  rfqId,
  redirectOnDelete,
  isCompact = false,
}: {
  rfqId: string;
  redirectOnDelete?: string;
  isCompact?: boolean;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus RFQ ini secara permanen? Data yang dihapus tidak dapat dikembalikan.');
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteRFQ(rfqId);

    if (result.success) {
      if (redirectOnDelete) {
        router.push(redirectOnDelete);
      } else {
        router.refresh();
      }
    } else {
      alert(`Gagal menghapus RFQ: ${result.error}`);
      setIsDeleting(false);
    }
  };

  if (isCompact) {
    return (
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Hapus RFQ"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Hapus RFQ"
    >
      <Trash2 className="w-4 h-4" />
      {isDeleting ? 'Menghapus…' : 'Hapus RFQ'}
    </button>
  );
}
