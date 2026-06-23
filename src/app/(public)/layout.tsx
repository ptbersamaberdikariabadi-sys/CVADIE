import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { CartProvider } from "@/context/CartContext";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </CartProvider>
  );
}
