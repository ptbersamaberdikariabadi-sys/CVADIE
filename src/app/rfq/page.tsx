"use client";

import { useState } from 'react';
import { Upload, MessageCircle, FileText, Factory, AlertCircle, Phone } from 'lucide-react';

export default function RFQPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    urgency: 'Normal',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build WhatsApp Message
    const phoneNumber = "6282127772205"; // 0821-2777-2205 formatted for wa.me
    const text = `Halo CV. ADIE, saya ingin meminta penawaran (RFQ):%0A%0A*Nama:* ${formData.name}%0A*Perusahaan:* ${formData.company}%0A*No HP:* ${formData.phone}%0A*Tingkat Urgensi:* ${formData.urgency}%0A%0A*Kebutuhan:*%0A${formData.message}%0A%0A(Saya akan mengirimkan dokumen/foto pendukung setelah pesan ini jika ada).`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
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

      {/* Form Content */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
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
                  <strong>Penting:</strong> Form ini akan langsung menghubungkan Anda ke layanan WhatsApp representatif kami agar komunikasi berjalan lebih cepat (Fast Response).
                </div>
              </div>

              {/* Right Form Panel */}
              <div className="p-8 md:w-7/12">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">Rincian Kebutuhan (Part Number / Deskripsi)</label>
                    <textarea 
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4} 
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-brand-primary outline-none" 
                      placeholder="Contoh: Kami membutuhkan 5 unit Solenoid Valve Festo tipe X, mohon penawarannya..." 
                    />
                  </div>
                  
                  {/* Visual Mock for Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-5 flex flex-col items-center justify-center text-gray-500 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-6 h-6 mb-2 text-brand-primary" />
                    <span className="text-sm font-medium text-center">Dokumen / foto dapat Anda lampirkan langsung di ruang obrolan WhatsApp nanti.</span>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-md transition-colors flex justify-center items-center gap-2 text-lg shadow-md"
                  >
                    <MessageCircle className="w-6 h-6" /> KIRIM RFQ VIA WHATSAPP
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
