"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

// Hapus "Adie Woo" — hanya tampilkan tim yang relevan
const contacts = [
  { name: 'Fuja', phone: '6283847582958', displayPhone: '+62 838-4758-2958', role: 'Admin / Support' },
  { name: 'Ihsan', phone: '6282116381296', displayPhone: '+62 821-1638-1296', role: 'Teknisi / Support' },
  { name: 'Nurul', phone: '6281214614097', displayPhone: '+62 812-1461-4097', role: 'Admin / Keuangan' },
  { name: 'Zeinan', phone: '6285700363571', displayPhone: '+62 857-0036-3571', role: 'IT / Support' },
];

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={menuRef}>
      {/* Menu Popup */}
      <div 
        className={`absolute bottom-16 right-0 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right w-72 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#25D366] text-white p-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-lg">Hubungi Kami</h3>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-white/90">Tim kami siap membantu Anda dengan penawaran dan kebutuhan sparepart.</p>
        </div>
        <div className="p-2 max-h-80 overflow-y-auto">
          <div className="space-y-1">
            {contacts.map((contact, index) => (
              <a 
                key={index}
                href={`https://wa.me/${contact.phone}?text=Halo%20${contact.name},%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0 group-hover:bg-[#25D366] transition-colors">
                  <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{contact.name}</div>
                  <div className="text-xs text-gray-500 font-medium">{contact.role}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 z-50 relative"
        aria-label="Chat via WhatsApp"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageCircle className="w-8 h-8" />
        )}
      </button>
    </div>
  );
}
