"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteRack } from "@/app/actions/warehouseActions";

export default function DeleteRackButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus rak ini? Semua kompartemen di dalamnya juga akan terhapus.")) {
      setIsDeleting(true);
      const res = await deleteRack(id);
      if (!res.success) {
        alert(res.error || "Gagal menghapus rak.");
        setIsDeleting(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus Rak"
    >
      {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
}
