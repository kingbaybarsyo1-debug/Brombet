
import React from 'react';
import { AppSection, Invoice, Product } from '../types';
import { Icons } from '../constants';

interface DashboardProps {
  invoices: Invoice[];
  products: Product[];
  onNavigate: (section: AppSection) => void;
  language: string;
}

const Dashboard: React.FC<DashboardProps> = ({ invoices, products, onNavigate, language }) => {
  const isAr = language === 'ar';
  const today = new Date().toISOString().split('T')[0];
  const todayInvoices = invoices.filter(inv => inv.date.startsWith(today));
  const todaySales = todayInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const monthlySales = invoices.reduce((sum, inv) => sum + inv.total, 0); 
  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);

  const t = {
    todaySales: isAr ? 'قيمة مبيعات اليوم' : "Today's Sales",
    todayOrders: isAr ? 'عدد الفواتير اليوم' : "Today's Invoices",
    totalProducts: isAr ? 'إجمالي المنتجات' : 'Total Products',
    monthlySales: isAr ? 'المبيعات الشهرية' : 'Monthly Sales',
    lowStockWarning: isAr ? `انتباه: يوجد ${lowStockProducts.length} منتجات أوشكت على النفاد` : `Warning: ${lowStockProducts.length} items low in stock`,
    quickActions: isAr ? 'الإجراءات السريعة' : 'Quick Actions',
    pos: isAr ? 'نقطة البيع' : 'POS',
    invoices: isAr ? 'الفواتير' : 'Invoices',
    reports: isAr ? 'التقارير' : 'Reports',
    recentInvoices: isAr ? 'أحدث الفواتير' : 'Recent Invoices',
    noSales: isAr ? 'لا توجد عمليات مبيعات اليوم' : 'No sales today',
    currency: isAr ? 'ر.س' : 'SAR'
  };

  const StatCard = ({ title, value, iconType, color = "bg-[#3498db]" }: { title: string, value: string | number, iconType: 'bag' | 'eye' | 'box' | 'pulse', color?: string }) => {
    const icons = {
      bag: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
      eye: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
      box: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
      pulse: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    };

    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md group">
        <div className={`${color} text-white p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110`}>
          {icons[iconType]}
        </div>
        <div className={isAr ? "text-left" : "text-right"}>
          <p className="text-slate-400 text-sm font-bold mb-1 uppercase tracking-tight">{title}</p>
          <p className="text-3xl md:text-4xl font-black text-slate-800 tabular-nums">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t.todaySales} value={`${todaySales.toFixed(2)}`} iconType="bag" />
        <StatCard title={t.todayOrders} value={todayInvoices.length} iconType="eye" />
        <StatCard title={t.totalProducts} value={products.length} iconType="box" />
        <StatCard title={t.monthlySales} value={`${monthlySales.toFixed(2)}`} iconType="pulse" />
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-[#fffcf0] border border-[#ffecb3] p-5 rounded-2xl flex items-center justify-center gap-4 animate-bounce-subtle">
          <div className="bg-[#fbc02d] p-2 rounded-full text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-[#856404] font-extrabold text-lg">{t.lowStockWarning}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-[#3498db] rounded-full"></span>
            {t.quickActions}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <button onClick={() => onNavigate(AppSection.POS)} className="p-6 rounded-2xl bg-blue-50 text-[#3498db] font-bold hover:bg-blue-100 transition-all flex flex-col items-center gap-3">
              <span className="p-3 bg-white rounded-xl shadow-sm"><Icons.POS /></span>
              {t.pos}
            </button>
            <button onClick={() => onNavigate(AppSection.Invoices)} className="p-6 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-all flex flex-col items-center gap-3">
              <span className="p-3 bg-white rounded-xl shadow-sm"><Icons.Invoices /></span>
              {t.invoices}
            </button>
            <button onClick={() => onNavigate(AppSection.Reports)} className="p-6 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-all flex flex-col items-center gap-3">
              <span className="p-3 bg-white rounded-xl shadow-sm"><Icons.Reports /></span>
              {t.reports}
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <h3 className="text-xl font-black text-slate-800 mb-6">{t.recentInvoices}</h3>
           <div className="space-y-4">
              {invoices.slice(0, 3).map(inv => (
                <div key={inv.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-all">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">#{inv.id.slice(-6)}</p>
                    <p className="text-[10px] text-slate-400">{new Date(inv.date).toLocaleTimeString(isAr ? 'ar-SA' : 'en-US')}</p>
                  </div>
                  <div className={isAr ? "text-left" : "text-right"}>
                    <p className="font-black text-[#3498db]">{inv.total.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400">{t.currency}</p>
                  </div>
                </div>
              ))}
              {invoices.length === 0 && <p className="text-center text-slate-300 py-10 font-bold">{t.noSales}</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
