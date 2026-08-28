'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Panel Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 m-6">
      <div className="text-center max-w-md">
        <div className="bg-red-50 text-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan Server</h2>
        <p className="text-sm text-gray-600 mb-6">
          Tidak dapat memuat data untuk halaman ini. Ini mungkin disebabkan oleh masalah koneksi atau error di database.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-left mb-6 overflow-auto">
          <p className="text-xs font-mono text-red-500 break-words">{error.message || "Unknown Error"}</p>
        </div>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Muat Ulang Halaman
        </button>
      </div>
    </div>
  );
}
