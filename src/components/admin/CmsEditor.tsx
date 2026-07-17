/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { Save, Loader2, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { updateCMSSection } from '@/app/actions/cmsActions';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

export default function CmsEditor({ initialContent }: { initialContent: any }) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('hero_section');
  const [content, setContent] = useState<any>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Handle simple text changes
  const handleChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle complex nested changes
  const updateSectionData = (section: string, updater: (draft: any) => void) => {
    setContent((prev: any) => {
      const newSectionData = JSON.parse(JSON.stringify(prev[section] || {}));
      updater(newSectionData);
      return {
        ...prev,
        [section]: newSectionData
      };
    });
  };

  // Handle array changes
  const handleArrayChange = (section: string, field: string, index: number, subField: string | null, value: string) => {
    setContent((prev: any) => {
      const newArray = [...((prev[section][field] as any[]) || [])];
      if (subField) {
        newArray[index] = { ...newArray[index], [subField]: value };
      } else {
        newArray[index] = value;
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      };
    });
  };

  // Add item to array
  const handleArrayAdd = (section: string, field: string, emptyItem: unknown) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...((prev[section][field] as any[]) || []), emptyItem]
      }
    }));
  };

  // Remove item from array
  const handleArrayRemove = (section: string, field: string, index: number) => {
    setContent((prev: any) => {
      const newArray = [...((prev[section][field] as any[]) || [])];
      newArray.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      };
    });
  };

  const deleteFileByUrl = async (url: string, bucket: string) => {
    if (!url || typeof url !== 'string' || !url.includes('supabase.co')) return;
    try {
      const parts = url.split('/');
      const fileName = parts.pop();
      if (fileName) {
        await supabase.storage.from(bucket).remove([fileName]);
      }
    } catch (error) {
      console.error("Gagal menghapus file lama:", error);
    }
  };

  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      
      // Hapus file lama jika ada
      const oldUrl = content[section]?.[field];
      if (oldUrl) {
        await deleteFileByUrl(oldUrl, 'public-assets');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${section}_${field}_${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('public-assets')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from('public-assets')
        .getPublicUrl(fileName);
        
      handleChange(section, field, publicUrlData.publicUrl);
    } catch (err) {
      console.error("Upload error", err);
      alert("Gagal mengunggah gambar.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Image Upload for array items (e.g. services[idx].image_url)
  const handleArrayImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    section: string,
    field: string,
    index: number,
    subField: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);

      // Hapus file lama jika ada
      const oldUrl = content[section]?.[field]?.[index]?.[subField];
      if (oldUrl) {
        await deleteFileByUrl(oldUrl, 'public-assets');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${section}_${field}_${index}_${subField}_${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('public-assets')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('public-assets')
        .getPublicUrl(fileName);

      handleArrayChange(section, field, index, subField, publicUrlData.publicUrl);
    } catch (err) {
      console.error("Upload error", err);
      alert("Gagal mengunggah gambar.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (section: string) => {
    setIsSaving(true);
    setMessage('');
    try {
      await updateCMSSection(section, content[section]);
      setMessage('Perubahan berhasil disimpan! Halaman publik telah diperbarui.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || 'Gagal menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'hero_section', label: 'Seksi Hero' },
    { id: 'why_choose_us', label: 'Seksi Alasan' },
    { id: 'trust_grid', label: 'Pilar Kepercayaan' },
    { id: 'services', label: 'Kategori Layanan' },
    { id: 'workflow', label: 'Seksi Alur Kerja' },
    { id: 'cta_banner', label: 'Banner CTA Bawah' },
    { id: 'about_page', label: 'Halaman Tentang Kami' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4 shrink-0">
        <h3 className="font-bold text-gray-900 mb-4 px-2">Bagian Halaman</h3>
        <ul className="space-y-1">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-brand-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex-1 overflow-y-auto bg-white">
          
          {/* Notification */}
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-200">
              {message}
            </div>
          )}

          {/* === HERO SECTION === */}
          {activeTab === 'hero_section' && content['hero_section'] && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Hero Banner</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Utama (Headline)</label>
                  <textarea 
                    rows={2}
                    value={content['hero_section'].headline}
                    onChange={(e) => handleChange('hero_section', 'headline', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Pendek</label>
                  <textarea 
                    rows={3}
                    value={content['hero_section'].description}
                    onChange={(e) => handleChange('hero_section', 'description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tombol Utama</label>
                    <input 
                      type="text"
                      value={content['hero_section'].button_primary}
                      onChange={(e) => handleChange('hero_section', 'button_primary', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tombol Sekunder</label>
                    <input 
                      type="text"
                      value={content['hero_section'].button_secondary}
                      onChange={(e) => handleChange('hero_section', 'button_secondary', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Latar Belakang (Background)</label>
                  {content['hero_section'].bg_image_url && (
                    <div className="mb-3 relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={content['hero_section'].bg_image_url as string} alt="Hero BG" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 border border-gray-300 transition-colors">
                      <ImageIcon className="w-4 h-4" />
                      {content['hero_section'].bg_image_url ? 'Ganti Gambar' : 'Unggah Gambar Latar'}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'hero_section', 'bg_image_url')}
                      />
                    </label>
                    {content['hero_section'].bg_image_url && (
                      <button 
                        type="button"
                        onClick={() => handleChange('hero_section', 'bg_image_url', '')}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Hapus Gambar
                      </button>
                    )}
                  </div>
                </div>
                <hr className="my-6 border-gray-200" />
                
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Daftar Slideshow</h4>
                  <div className="space-y-4">
                    {(content['hero_section'].slides as any[])?.map((slide: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-gray-700">Slide #{idx + 1}</span>
                          <button
                            onClick={() => handleArrayRemove('hero_section', 'slides', idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Alt Text</label>
                            <input
                              type="text"
                              value={slide.alt || ''}
                              onChange={(e) => handleArrayChange('hero_section', 'slides', idx, 'alt', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={slide.is_logo || false}
                              onChange={(e) => {
                                setContent((prev: any) => {
                                  const newSlides = [...(prev.hero_section.slides || [])];
                                  newSlides[idx] = { ...newSlides[idx], is_logo: e.target.checked };
                                  return { ...prev, hero_section: { ...prev.hero_section, slides: newSlides } };
                                });
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-brand-primary"
                              id={`slide_logo_${idx}`}
                            />
                            <label htmlFor={`slide_logo_${idx}`} className="text-sm text-gray-700">Tampilkan sebagai Logo Tengah (bukan background penuh)</label>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">Gambar Slide</label>
                            {slide.image_url && (
                              <div className="mb-2 relative w-full h-24 bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                                <Image src={slide.image_url} alt="Slide" fill className="object-contain" />
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <label className="cursor-pointer bg-white hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md font-medium text-xs flex items-center gap-1.5 border border-gray-300 transition-colors">
                                <ImageIcon className="w-3.5 h-3.5" />
                                {slide.image_url ? 'Ganti Gambar' : 'Unggah Gambar Slide'}
                                <input
                                  type="file" accept="image/*" className="hidden"
                                  onChange={(e) => handleArrayImageUpload(e, 'hero_section', 'slides', idx, 'image_url')}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => handleArrayAdd('hero_section', 'slides', { image_url: '', alt: 'Slide Baru', is_logo: false })}
                      className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Tambah Slide Baru
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* === WHY CHOOSE US === */}
          {activeTab === 'why_choose_us' && content['why_choose_us'] && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Alasan Memilih Kami</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Seksi</label>
                <input 
                  type="text"
                  value={content['why_choose_us'].title}
                  onChange={(e) => handleChange('why_choose_us', 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Samping (Opsional)</label>
                {content['why_choose_us'].image_url && (
                  <div className="mb-3 relative w-48 h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <Image src={content['why_choose_us'].image_url as string} alt="Why Us" fill className="object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 border border-gray-300 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    {content['why_choose_us'].image_url ? 'Ganti Gambar' : 'Unggah Gambar Samping'}
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'why_choose_us', 'image_url')}
                    />
                  </label>
                  {content['why_choose_us'].image_url && (
                    <button 
                      type="button"
                      onClick={() => handleChange('why_choose_us', 'image_url', '')}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Hapus Gambar
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Daftar Keunggulan (Poin-poin)</label>
                <div className="space-y-3">
                  {(content['why_choose_us'].points as string[])?.map((point: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <textarea 
                        rows={2}
                        value={point}
                        onChange={(e) => handleArrayChange('why_choose_us', 'points', idx, null, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-primary text-sm outline-none"
                      />
                      <button 
                        onClick={() => handleArrayRemove('why_choose_us', 'points', idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => handleArrayAdd('why_choose_us', 'points', "Poin keunggulan baru...")}
                    className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Tambah Poin Baru
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* === SERVICES / KATEGORI LAYANAN === */}
          {activeTab === 'services' && content['services'] && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Kartu Kategori Layanan</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Seksi</label>
                <input
                  type="text"
                  value={content['services'].title || ''}
                  onChange={(e) => handleChange('services', 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Kartu Layanan</label>
                <div className="space-y-4">
                  {(content['services'].items as any[])?.map((item: any, idx: number) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">Kartu #{idx + 1}</span>
                        <button
                          onClick={() => handleArrayRemove('services', 'items', idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                          title="Hapus kartu ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Judul Kartu</label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => handleArrayChange('services', 'items', idx, 'title', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Icon (nama Lucide)</label>
                          <input
                            type="text"
                            value={item.icon || ''}
                            onChange={(e) => handleArrayChange('services', 'items', idx, 'icon', e.target.value)}
                            placeholder="Wind, Cpu, Zap, Wrench..."
                            className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi Singkat</label>
                        <input
                          type="text"
                          value={item.desc || ''}
                          onChange={(e) => handleArrayChange('services', 'items', idx, 'desc', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none"
                        />
                      </div>

                      {/* Per-card image upload */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                          Gambar Latar Kartu{' '}
                          <span className="text-gray-400 font-normal">(opsional — jika diisi, menggantikan latar putih)</span>
                        </label>
                        {item.image_url && (
                          <div className="mb-2 relative w-full h-24 bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={item.image_url as string}
                              alt={item.title || `Kartu ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-white hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md font-medium text-xs flex items-center gap-1.5 border border-gray-300 transition-colors">
                            <ImageIcon className="w-3.5 h-3.5" />
                            {item.image_url ? 'Ganti Gambar' : 'Unggah Gambar Latar'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleArrayImageUpload(e, 'services', 'items', idx, 'image_url')}
                            />
                          </label>
                          {item.image_url && (
                            <button
                              type="button"
                              onClick={() => handleArrayChange('services', 'items', idx, 'image_url', '')}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Hapus Gambar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() =>
                      handleArrayAdd('services', 'items', {
                        title: 'Layanan Baru',
                        desc: 'Deskripsi layanan.',
                        icon: 'Package',
                        image_url: ''
                      })
                    }
                    className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Tambah Kartu Baru
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* === TRUST GRID === */}
          {activeTab === 'trust_grid' && content['trust_grid'] && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Pilar Kepercayaan</h3>
              <div className="space-y-4">
                {(content['trust_grid'].items as any[])?.map((item: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4 items-start">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Judul Poin</label>
                        <input
                          type="text" value={item.title || ''}
                          onChange={(e) => handleArrayChange('trust_grid', 'items', idx, 'title', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Ikon (Lucide)</label>
                        <input
                          type="text" value={item.icon || ''}
                          onChange={(e) => handleArrayChange('trust_grid', 'items', idx, 'icon', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none font-mono"
                        />
                      </div>
                    </div>
                    <button onClick={() => handleArrayRemove('trust_grid', 'items', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleArrayAdd('trust_grid', 'items', { title: 'Poin Baru', icon: 'Check' })}
                  className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Tambah Poin Baru
                </button>
              </div>
            </div>
          )}

          {/* === CTA BANNER === */}
          {activeTab === 'cta_banner' && content['cta_banner'] && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Banner CTA Bawah</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Utama</label>
                  <input type="text" value={content['cta_banner'].title || ''} onChange={(e) => handleChange('cta_banner', 'title', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea rows={3} value={content['cta_banner'].description || ''} onChange={(e) => handleChange('cta_banner', 'description', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teks Tombol</label>
                  <input type="text" value={content['cta_banner'].button_text || ''} onChange={(e) => handleChange('cta_banner', 'button_text', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-primary outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* === WORKFLOW === */}
          {activeTab === 'workflow' && content['workflow'] && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Alur Kerja</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Seksi</label>
                <input type="text" value={content['workflow'].title || ''} onChange={(e) => handleChange('workflow', 'title', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md outline-none" />
              </div>
              <div className="space-y-4">
                {(content['workflow'].steps as any[])?.map((step: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4 items-start">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Langkah #{idx+1} - Judul</label>
                        <input type="text" value={step.title || ''} onChange={(e) => handleArrayChange('workflow', 'steps', idx, 'title', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi</label>
                        <input type="text" value={step.desc || ''} onChange={(e) => handleArrayChange('workflow', 'steps', idx, 'desc', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none" />
                      </div>
                    </div>
                    <button onClick={() => handleArrayRemove('workflow', 'steps', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => handleArrayAdd('workflow', 'steps', { title: 'Baru', desc: 'Deskripsi langkah' })} className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4" /> Tambah Langkah</button>
              </div>
            </div>
          )}

          {/* === ABOUT PAGE === */}
          {activeTab === 'about_page' && content['about_page'] && (
            <div className="space-y-8 pb-10">
              <h3 className="text-xl font-bold text-gray-900">Edit Halaman Tentang Kami</h3>
              
              {/* Hero */}
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-4">
                <h4 className="font-semibold text-gray-800">1. Hero Section</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                  <input type="text" value={content['about_page'].hero?.headline || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.hero = draft.hero || {}; draft.hero.headline = e.target.value; })} className="w-full p-2 border border-gray-300 rounded-md outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea rows={3} value={content['about_page'].hero?.description || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.hero = draft.hero || {}; draft.hero.description = e.target.value; })} className="w-full p-2 border border-gray-300 rounded-md outline-none" />
                </div>
              </div>

              {/* History */}
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-4">
                <h4 className="font-semibold text-gray-800">2. Sejarah Perusahaan</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Sejarah</label>
                  <input type="text" value={content['about_page'].history?.title || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.history = draft.history || {}; draft.history.title = e.target.value; })} className="w-full p-2 border border-gray-300 rounded-md outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paragraf Sejarah</label>
                  {(content['about_page'].history?.paragraphs || []).map((p: string, idx: number) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <textarea rows={3} value={p} onChange={(e) => updateSectionData('about_page', draft => { draft.history.paragraphs[idx] = e.target.value; })} className="w-full p-2 border border-gray-300 rounded-md outline-none" />
                      <button onClick={() => updateSectionData('about_page', draft => { draft.history.paragraphs.splice(idx, 1); })} className="p-2 text-red-500 hover:bg-red-50 h-10 rounded-md"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => updateSectionData('about_page', draft => { draft.history.paragraphs = draft.history.paragraphs || []; draft.history.paragraphs.push('Paragraf baru...'); })} className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4" /> Tambah Paragraf</button>
                </div>

                <hr className="my-4 border-gray-200" />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Misi & Komitmen</label>
                  <input type="text" value={content['about_page'].history?.mission_title || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.history = draft.history || {}; draft.history.mission_title = e.target.value; })} className="w-full p-2 border border-gray-300 rounded-md outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daftar Misi</label>
                  {(content['about_page'].history?.missions || []).map((m: any, idx: number) => (
                    <div key={idx} className="flex gap-2 mb-2 p-2 border border-gray-200 rounded-md bg-white">
                      <div className="flex-1 space-y-2">
                        <input type="text" value={m.title || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.history.missions[idx].title = e.target.value; })} placeholder="Judul Misi" className="w-full p-2 border border-gray-300 rounded-md outline-none" />
                        <textarea rows={2} value={m.desc || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.history.missions[idx].desc = e.target.value; })} placeholder="Deskripsi Misi" className="w-full p-2 border border-gray-300 rounded-md outline-none" />
                      </div>
                      <button onClick={() => updateSectionData('about_page', draft => { draft.history.missions.splice(idx, 1); })} className="p-2 text-red-500 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => updateSectionData('about_page', draft => { draft.history.missions = draft.history.missions || []; draft.history.missions.push({ title: 'Baru', desc: '' }); })} className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4" /> Tambah Misi</button>
                </div>
              </div>

              {/* Targets */}
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-4">
                <h4 className="font-semibold text-gray-800">3. Target Industri</h4>
                <input type="text" value={content['about_page'].targets?.title || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.targets = draft.targets || {}; draft.targets.title = e.target.value; })} placeholder="Judul Target" className="w-full p-2 border border-gray-300 rounded-md outline-none mb-2 font-medium" />
                {(content['about_page'].targets?.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 p-3 rounded bg-white flex gap-3">
                    <div className="flex-1 space-y-2">
                      <input type="text" value={item.label || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.targets.items[idx].label = e.target.value; })} placeholder="Nama Target" className="w-full p-2 border rounded-md outline-none" />
                      <input type="text" value={item.desc || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.targets.items[idx].desc = e.target.value; })} placeholder="Deskripsi Target" className="w-full p-2 border rounded-md outline-none" />
                    </div>
                    <button onClick={() => updateSectionData('about_page', draft => { draft.targets.items.splice(idx, 1); })} className="text-red-500 p-2 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => updateSectionData('about_page', draft => { draft.targets.items = draft.targets.items || []; draft.targets.items.push({ icon:'Target', label:'Baru', desc:'' }); })} className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4" /> Tambah Target</button>
              </div>

              {/* Management */}
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-4">
                <h4 className="font-semibold text-gray-800">4. Manajemen Inti</h4>
                <input type="text" value={content['about_page'].management?.title || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.management = draft.management || {}; draft.management.title = e.target.value; })} placeholder="Judul Bagian Manajemen" className="w-full p-2 border border-gray-300 rounded-md outline-none mb-2 font-medium" />
                {(content['about_page'].management?.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 p-3 rounded bg-white flex gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={item.name || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.management.items[idx].name = e.target.value; })} placeholder="Nama" className="w-full p-2 border rounded-md outline-none" />
                        <input type="text" value={item.role || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.management.items[idx].role = e.target.value; })} placeholder="Jabatan" className="w-full p-2 border rounded-md outline-none" />
                      </div>
                      <input type="text" value={item.description || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.management.items[idx].description = e.target.value; })} placeholder="Deskripsi Singkat" className="w-full p-2 border rounded-md outline-none" />
                    </div>
                    <button onClick={() => updateSectionData('about_page', draft => { draft.management.items.splice(idx, 1); })} className="text-red-500 p-2 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => updateSectionData('about_page', draft => { draft.management.items = draft.management.items || []; draft.management.items.push({ name:'Baru', role:'', description:'' }); })} className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4" /> Tambah Personil</button>
              </div>

              {/* Contacts / Legal */}
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-4">
                <h4 className="font-semibold text-gray-800">5. Kontak & Legalitas</h4>
                <input type="text" value={content['about_page'].legal_contact?.contact_title || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.legal_contact = draft.legal_contact || {}; draft.legal_contact.contact_title = e.target.value; })} placeholder="Judul Bagian Kontak" className="w-full p-2 border border-gray-300 rounded-md outline-none mb-2 font-medium" />
                {(content['about_page'].legal_contact?.contacts || []).map((item: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 p-3 rounded bg-white flex gap-3">
                    <div className="flex-1 space-y-2">
                      <input type="text" value={item.title || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.legal_contact.contacts[idx].title = e.target.value; })} placeholder="Jenis (Alamat / Telepon)" className="w-full p-2 border rounded-md outline-none" />
                      <textarea rows={2} value={item.desc || ''} onChange={(e) => updateSectionData('about_page', draft => { draft.legal_contact.contacts[idx].desc = e.target.value; })} placeholder="Detail Kontak" className="w-full p-2 border rounded-md outline-none" />
                    </div>
                    <button onClick={() => updateSectionData('about_page', draft => { draft.legal_contact.contacts.splice(idx, 1); })} className="text-red-500 p-2 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => updateSectionData('about_page', draft => { draft.legal_contact.contacts = draft.legal_contact.contacts || []; draft.legal_contact.contacts.push({ icon:'Phone', title:'', desc:'' }); })} className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4" /> Tambah Kontak</button>
              </div>

            </div>
          )}

        </div>
        
        {/* Save Bar */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button 
            onClick={() => handleSave(activeTab)}
            disabled={isSaving}
            className="bg-brand-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
          >
            {isSaving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
            ) : (
              <><Save className="w-4 h-4" /> Simpan Perubahan</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
