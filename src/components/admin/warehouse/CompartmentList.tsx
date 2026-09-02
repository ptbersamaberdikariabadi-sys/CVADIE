"use client";

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Loader2, ChevronDown, ChevronRight, Package } from 'lucide-react';
import { Compartment, createCompartment, updateCompartment, deleteCompartment } from '@/app/actions/warehouseActions';
import StockPlacementsList from './StockPlacementsList';

export default function CompartmentList({ rackId, initialCompartments }: { rackId: string, initialCompartments: Compartment[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

  const resetForm = () => {
    setName('');
    setMaxCapacity('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (comp: Compartment) => {
    setName(comp.name);
    setMaxCapacity(comp.max_capacity?.toString() || '');
    setEditingId(comp.id);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("Nama kompartemen harus diisi");
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', name);
    if (maxCapacity) formData.append('max_capacity', maxCapacity);

    let res;
    if (editingId) {
      res = await updateCompartment(editingId, rackId, formData);
    } else {
      res = await createCompartment(rackId, formData);
    }

    if (res.success) {
      resetForm();
    } else {
      alert(res.error || "Gagal menyimpan kompartemen");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus kompartemen ini?")) {
      const res = await deleteCompartment(id, rackId);
      if (!res.success) {
        alert(res.error || "Gagal menghapus kompartemen");
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Daftar Kompartemen</h3>
          <p className="text-sm text-gray-500 mt-1">Kelola bagian-bagian dalam rak ini.</p>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-brand-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Kompartemen
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium">Nama Kompartemen</th>
              <th className="px-6 py-4 font-medium">Kapasitas Maksimal</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {initialCompartments.length === 0 && !isAdding && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Belum ada kompartemen di rak ini.
                </td>
              </tr>
            )}

            {/* Add / Edit Form Row */}
            {(isAdding || editingId) && (
              <tr className="bg-blue-50/50">
                <td className="px-6 py-4">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama (misal: Level 1)"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-brand-primary"
                    autoFocus
                  />
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="number" 
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    placeholder="Opsional"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={resetForm}
                      disabled={isSubmitting}
                      className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors"
                      title="Batal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="p-1.5 text-white bg-brand-primary hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                      title="Simpan"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* List Rows */}
            {initialCompartments.map((comp) => (
              <React.Fragment key={comp.id}>
                <tr className={`hover:bg-gray-50 transition-colors ${editingId === comp.id ? 'hidden' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
                        className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        {expandedId === comp.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      <span className="font-medium text-gray-900">{comp.name}</span>
                    </div>
                  </td>
                <td className="px-6 py-4 text-gray-600">
                  {comp.max_capacity ? `${comp.max_capacity} Unit` : 'Tak Terbatas'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
                      className="p-2 text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium mr-2"
                    >
                      <Package className="w-4 h-4" />
                      Isi
                    </button>
                    <button 
                      onClick={() => startEdit(comp)}
                      className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                      title="Edit Kompartemen"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(comp.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Kompartemen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedId === comp.id && (
                <tr className="bg-gray-50/50">
                  <td colSpan={3} className="px-6 py-4">
                    <StockPlacementsList compartmentId={comp.id} rackId={rackId} />
                  </td>
                </tr>
              )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
