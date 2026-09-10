"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { deletePartTransaction } from "@/app/actions/transactionActions";
import EditTransactionModal from "./EditTransactionModal";
import { useRouter } from "next/navigation";

interface Transaction {
  id: string;
  type: 'IN' | 'OUT';
  product_id: string;
  compartment_id: string | null;
  quantity: number;
  transaction_category: string;
  sender?: string | null;
  receiver?: string | null;
  price?: number | null;
  transaction_date?: string | null;
  reference_note?: string | null;
  product?: { id: string; name: string; part_number: string } | null;
  compartment?: { id: string; name: string; rack?: { name: string } } | null;
}

interface Props {
  transaction: Transaction;
}

export default function TransactionActions({ transaction }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleDelete = async () => {
    const txLabel = `${transaction.type} | ${transaction.product?.name || ''} | ${transaction.quantity} pcs`;
    const confirmed = window.confirm(
      `⚠️ Hapus transaksi ini?\n\n"${txLabel}"\n\nPerhatian: Stok akan otomatis dikembalikan ke kondisi sebelum transaksi ini dicatat. Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setIsOpen(false);

    const res = await deletePartTransaction(transaction.id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus transaksi");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Dropdown trigger */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(v => !v)}
          disabled={isDeleting}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          aria-label="Aksi transaksi"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MoreHorizontal className="w-4 h-4" />
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 z-30 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg py-1 text-sm">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowEditModal(true);
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5 text-gray-500" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditTransactionModal
          transaction={transaction}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
