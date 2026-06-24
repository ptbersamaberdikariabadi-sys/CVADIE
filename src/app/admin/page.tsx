import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Users, FileText, PackageSearch, TrendingUp } from 'lucide-react';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch RFQs count
  const { count: totalRfqs } = await supabase
    .from('rfq_requests')
    .select('*', { count: 'exact', head: true });

  // Fetch Products count
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const metrics = [
    {
      title: "Total Prospek (RFQ)",
      value: totalRfqs || 0,
      icon: FileText,
      color: "bg-blue-500",
      trend: "+2 bulan ini"
    },
    {
      title: "RFQ Belum Ditanggapi",
      value: totalRfqs || 0, // Placeholder
      icon: Users,
      color: "bg-amber-500",
      trend: "Perlu tindakan"
    },
    {
      title: "Total Produk Aktif",
      value: totalProducts || 0,
      icon: PackageSearch,
      color: "bg-emerald-500",
      trend: "Katalog"
    },
    {
      title: "Estimasi Konversi",
      value: "15%",
      icon: TrendingUp,
      color: "bg-indigo-500",
      trend: "Rata-rata"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${metric.color} bg-opacity-10 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${metric.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{metric.title}</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-sm text-gray-500">{metric.trend}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-96 flex flex-col items-center justify-center text-gray-400">
          <TrendingUp className="w-12 h-12 mb-4 text-gray-300" />
          <p>Grafik Tren RFQ akan tampil di sini</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Aktivitas Terkini</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">RFQ Baru dari PT Testing</p>
                <p className="text-xs text-gray-500">2 jam yang lalu</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Katalog diperbarui</p>
                <p className="text-xs text-gray-500">Kemarin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
