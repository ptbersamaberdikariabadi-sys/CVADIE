"use client";

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteShipment } from '@/app/actions/shipmentActions';
import { useRouter } from 'next/navigation';

export default function DeleteShipmentButton({ shipmentId }: { shipmentId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Hapus dokumen ini? Semua perubahan stok yang terkait akan DIBALIK secara otomatis. Tindakan ini tidak dapat dibatalkan.'
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteShipment(shipmentId);

    if (result.success) {
      router.refresh();
    } else {
      alert(`Gagal menghapus: ${result.error}`);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Hapus dokumen & batalkan stok"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
