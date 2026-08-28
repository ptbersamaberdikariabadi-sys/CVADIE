/**
 * Shared WhatsApp contact list for FloatingWhatsApp and Footer.
 * Single source of truth — update here to change across the entire site.
 */
export interface WhatsAppContact {
  name: string;
  phone: string;
  displayPhone: string;
  role: string;
}

export const WHATSAPP_CONTACTS: WhatsAppContact[] = [
  { name: 'Fuja', phone: '6283847582958', displayPhone: '+62 838-4758-2958', role: 'Admin / Support' },
  { name: 'Ihsan', phone: '6282116381296', displayPhone: '+62 821-1638-1296', role: 'Teknisi / Support' },
  { name: 'Nurul', phone: '6281214614097', displayPhone: '+62 812-1461-4097', role: 'Admin / Keuangan' },
  { name: 'Zeinan', phone: '6285700363571', displayPhone: '+62 857-0036-3571', role: 'IT / Support' },
];

/**
 * Generate a WhatsApp deep link for a given contact.
 */
export const getWhatsAppUrl = (contact: WhatsAppContact): string =>
  `https://wa.me/${contact.phone}?text=Halo%20${contact.name},%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE`;
