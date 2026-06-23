"use client";

import { useState, useEffect } from 'react';
import { Upload, MessageCircle, FileText, Factory, AlertCircle, Phone, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function RFQPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    urgency: 'Normal',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Insert ke database Supabase
      const { data: rfqData, error } = await supabase.from('rfq_requests').insert([
        {
          contact_person: formData.name,
          company_name: formData.company,
          email: formData.email,
          phone: formData.phone,
          urgency: formData.urgency,
          message: formData.message || (cart.length > 0 ? "Pengajuan dari RFQ Cart" : ""),
          status: 'RFQ_RECEIVED'
        }
      ]).select('id').single();

      if (error || !rfqData) {
        console.error("Gagal mengirim RFQ ke database:", error);
        alert("Terjadi kesalahan saat menyimpan data RFQ.");
        setIsSubmitting(false);
        return;
      }

      // 2. Insert RFQ Items
      if (cart.length > 0) {
        const rfqItems = cart.map(item => ({
          rfq_id: rfqData.id,
          product_id: item.id,
          quantity: item.quantity,
          notes: ''
        }));

        const { error: itemsError } = await supabase.from('rfq_items').insert(rfqItems);
        if (itemsError) {
          console.error("Gagal menyimpan item RFQ:", itemsError);
          // Kita tetap lanjutkan ke WhatsApp walaupun gagal simpan item
        }
      }

      // 3. Build WhatsApp Message & Redirect
      const phoneNumber = "6282127772205"; // 0821-2777-2205
      
      let itemsText = "";
      if (cart.length > 0) {
        itemsText = "%0A%0A*Daftar Produk (Keranjang):*%0A";
        cart.forEach((item, index) => {
          itemsText += `${index + 1}. ${item.name} (PN: ${item.part_number}) - Qty: ${item.quantity}%0A`;
        });
      }

      const text = `Halo CV. ADIE, saya ingin meminta penawaran (RFQ):%0A%0A*Nama:* ${formData.name}%0A*Perusahaan:* ${formData.company}%0A*Email:* ${formData.email}%0A*No HP:* ${formData.phone}%0A*Tingkat Urgensi:* ${formData.urgency}${itemsText}%0A%0A*Catatan Tambahan:*%0A${formData.message || '-'}`;
      
      window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
      
      // Reset form & cart
      setFormData({
        name: '', company: '', email: '', phone: '', urgency: 'Normal', message: ''
      });
      clearCart();

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-brand-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">Request for Quotation (RFQ)</h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-200">
            Dapatkan penawaran harga terbaik dan pengecekan ketersediaan komponen langka Anda dalam waktu kurang dari 24 jam.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Cart Section */}
          {mounted && cart.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                  <ShoppingCart className="w-5 h-5 text-brand-primary" /> Daftar Keranjang B2B
                </h2>
                <span className="bg-brand-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                  {cart.length} Item
                </span>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-brand-primary/30 transition-colors">
                      <div className="w-16 h-16 bg-gray-50 flex items-center justify-center shrink-0 rounded p-1">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="object-contain w-full h-full mix-blend-multiply" />
                        ) : (
                          <Factory className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-sm text-gray-500 font-mono">PN: {item.part_number}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Link href="/products" className="text-brand-primary font-bold hover:underline text-sm">
                    + Tambah Produk Lain
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              
              {/* Left Info Panel */}
              <div className="bg-brand-primary text-white p-8 md:w-5/12 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-6">Informasi Pengadaan</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-brand-accent shrink-0 mt-1" />
                      <div>
                        <div className="font-bold">WhatsApp Fast Response</div>
                        <div className="text-sm text-gray-300">0821-2777-2205</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <FileText className="w-6 h-6 text-brand-accent shrink-0 mt-1" />
                      <div>
                        <div className="font-bold">Legalitas PKP</div>
                        <div className="text-sm text-gray-300">Faktur Pajak B2B selalu tersedia untuk perusahaan Anda.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Factory className="w-6 h-6 text-brand-accent shrink-0 mt-1" />
                      <div>
                        <div className="font-bold">Term of Payment</div>
                        <div className="text-sm text-gray-300">Skema pembayaran yang dapat didiskusikan demi menjaga cash flow pabrik.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 p-4 bg-white/10 rounded-lg text-sm border border-white/20">
                  <AlertCircle className="w-5 h-5 text-brand-accent mb-2" />
                  <strong>Penting:</strong> Data yang Anda isi akan tercatat aman di sistem kami (Mini ERP) untuk diproses, lalu Anda akan dihubungkan ke representatif WhatsApp untuk obrolan langsung.
                </div>
              </div>

              {/* Right Form Panel */}
              <div className="p-8 md:w-7/12">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap PIC</label>
                      <input 
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-brand-primary outline-none" 
                        placeholder="Bapak/Ibu" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Perusahaan / Pabrik</label>
                      <input 
                        required
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        type="text" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-brand-primary outline-none" 
                        placeholder="PT. Pabrik Anda" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Email Perusahaan</label>
                    <input 
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-brand-primary outline-none" 
                      placeholder="purchasing@perusahaan.com" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">No. WhatsApp</label>
                      <input 
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-brand-primary outline-none" 
                        placeholder="08xx-xxxx-xxxx" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Tingkat Urgensi</label>
                      <select 
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-brand-primary outline-none bg-white"
                      >
                        <option value="Normal">Normal (Stock Bulanan)</option>
                        <option value="Tinggi">Tinggi (Persiapan Maintenance)</option>
                        <option value="Mendesak">Mendesak (Mesin Breakdown / Downtime)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Rincian Tambahan {mounted && cart.length > 0 && <span className="text-gray-400 font-normal">(Opsional)</span>}
                    </label>
                    <textarea 
                      required={!mounted || cart.length === 0}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4} 
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-brand-primary outline-none" 
                      placeholder={mounted && cart.length > 0 ? "Tambahkan pesan atau instruksi khusus untuk produk di keranjang..." : "Contoh: Kami membutuhkan 5 unit Solenoid Valve Festo tipe X, mohon penawarannya..."} 
                    />
                  </div>
                  
                  {/* Visual Mock for Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-5 flex flex-col items-center justify-center text-gray-500 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-6 h-6 mb-2 text-brand-primary" />
                    <span className="text-sm font-medium text-center">Dokumen / foto dapat Anda lampirkan langsung di ruang obrolan WhatsApp nanti.</span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-md transition-colors flex justify-center items-center gap-2 text-lg shadow-md disabled:opacity-70"
                  >
                    <MessageCircle className="w-6 h-6" /> {isSubmitting ? 'MEMPROSES DATA...' : 'KIRIM RFQ VIA WHATSAPP'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
