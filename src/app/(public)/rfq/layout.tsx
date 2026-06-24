import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request for Quotation (RFQ) | CV. ADIE',
  description: 'Ajukan permintaan penawaran harga (RFQ) untuk suku cadang dan peralatan industri B2B secara cepat dan mudah melalui CV. Abadi Dewana.',
};

export default function RFQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
