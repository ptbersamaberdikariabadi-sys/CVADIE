"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Inbox, 
  Package, 
  Settings, 
  LogOut,
  Building2,
  Menu,
  Warehouse
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Gudang': pathname.startsWith('/admin/warehouse'),
    'Profil CMS': pathname.startsWith('/admin/cms')
  });

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const navItems = [
    { name: "Ikhtisar", href: "/admin", icon: LayoutDashboard },
    { name: "Prospek RFQ", href: "/admin/rfq", icon: Inbox },
    { name: "Katalog Produk", href: "/admin/products", icon: Package },
    { 
      name: "Gudang", 
      icon: Warehouse,
      subItems: [
        { name: "Pindahkan Lokasi", href: "/admin/warehouse" },
        { name: "Cari Barang", href: "/admin/warehouse/search" }
      ]
    },
    { 
      name: "Profil CMS", 
      icon: Building2,
      subItems: [
        { name: "Seksi Hero", href: "/admin/cms/hero_section" },
        { name: "Seksi Alasan", href: "/admin/cms/why_choose_us" },
        { name: "Pilar Kepercayaan", href: "/admin/cms/trust_grid" },
        { name: "Kategori Layanan", href: "/admin/cms/services" },
        { name: "Seksi Alur Kerja", href: "/admin/cms/workflow" },
        { name: "Banner CTA Bawah", href: "/admin/cms/cta_banner" },
        { name: "Halaman Tentang Kami", href: "/admin/cms/about_page" }
      ]
    },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  const getPageTitle = () => {
    for (const item of navItems) {
      if (item.href === pathname) return item.name;
      if (item.subItems) {
        const sub = item.subItems.find(s => s.href === pathname);
        if (sub) return sub.name;
      }
    }
    return "Dasbor";
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-200">
            <Building2 className="w-6 h-6 text-brand-primary" />
            <span className="font-bold text-lg text-gray-900 tracking-tight">ADIE ERP</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              if (item.subItems) {
                const isExpanded = expandedMenus[item.name];
                const hasActiveSubItem = item.subItems.some(sub => pathname === sub.href);
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                        ${hasActiveSubItem && !isExpanded
                          ? "bg-brand-primary/5 text-brand-primary" 
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${hasActiveSubItem ? "text-brand-primary" : "text-gray-400"}`} />
                        {item.name}
                      </div>
                      <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="pl-11 pr-3 space-y-1">
                        {item.subItems.map(sub => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`
                                block px-3 py-2 rounded-md text-sm transition-colors
                                ${isSubActive
                                  ? "bg-brand-primary/10 text-brand-primary font-medium"
                                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}
                              `}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? "bg-brand-primary/10 text-brand-primary" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-brand-primary" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-brand-primary">AD</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
