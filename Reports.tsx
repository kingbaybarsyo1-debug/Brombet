
import React, { useState, useMemo } from 'react';
import { Invoice, Product } from '../types';
import { Icons } from '../constants';

// تعريف مكتبة XLSX بشكل آمن
declare var XLSX: any;

interface ReportsProps {
  invoices: Invoice[];
  products: Product[];
  settings: any;
}

const Reports: React.FC<ReportsProps> = ({ invoices, products, settings }) => {
  const isAr = settings.language === 'ar';

  const stats = useMemo(() => {
    const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalCost = invoices.reduce((sum, inv) => {
      return sum + inv.items.reduce((iSum, item) => {
        const prod = products.find(p => p.id === item.productId);
        return iSum + ((prod?.costPrice || 0) * item.quantity);
      }, 0);
    }, 0);

    return {
      totalSales,
      totalOrders: invoices.length,
      totalProfits: totalSales - totalCost,
      inventoryValue: products.reduce((sum, p) => sum + (p.stock * (p.costPrice || 0)), 0),
    };
  }, [invoices, products]);

  const handleSavePDF = () => {
    // استدعاء أمر الطباعة الذي سيتيح خيار "Save as PDF"
    window.print();
  };

  const exportToExcel = () => {
    if (typeof XLSX === 'undefined') {
      alert(isAr ? 'مكتبة التصدير لم تكتمل بعد' : 'Export library not ready');
      return;
    }
    const data = invoices.map(inv => ({
      'رقم الفاتورة': inv.id,
      'التاريخ': new Date(inv.date).toLocaleString(isAr ? 'ar-SA' : 'en-US'),
      'الإجمالي': inv.total,
      'الضريبة': inv.tax,
      'الخصم': inv.discount,
      'طريقة الدفع': inv.paymentMethod
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
    XLSX.writeFile(workbook, `Report_${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-8">
      {/* الواجهة الرئيسية للتطبيق (تختفي عند الطباعة) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{isAr ? 'التقارير والتحليلات' : 'Reports & Analytics'}</h2>
          <p className="text-slate-400 font-bold mt-1">{isAr ? 'تقارير ذكية لنمو تجارتك.' : 'Smart reports for growth.'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button onClick={exportToExcel} className="px-5 py-3 bg-emerald-500 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2 text-sm">
             <Icons.Plus /> {isAr ? 'تصدير Excel' : 'Export Excel'}
           </button>
           <button onClick={handleSavePDF} className="px-5 py-3 bg-[#3498db] text-white rounded-2xl font-black shadow-lg hover:bg-[#2980b9] transition-all flex items-center gap-2 text-sm">
             <Icons.Print /> {isAr ? 'حفظ PDF' : 'Save PDF'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-black mb-2 uppercase tracking-widest">{isAr ? 'إجمالي المبيعات' : 'Total Sales'}</p>
          <p className="text-4xl font-black text-blue-600 tabular-nums">{stats.totalSales.toFixed(2)} <span className="text-sm font-bold">{settings.currency}</span></p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm border-b-emerald-500 border-b-4">
          <p className="text-emerald-500 text-xs font-black mb-2 uppercase tracking-widest">{isAr ? 'صافي الربح التقديري' : 'Net Profit'}</p>
          <p className="text-4xl font-black text-emerald-600 tabular-nums">{stats.totalProfits.toFixed(2)} <span className="text-sm font-bold">{settings.currency}</span></p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm border-b-orange-500 border-b-4">
          <p className="text-orange-500 text-xs font-black mb-2 uppercase tracking-widest">{isAr ? 'قيمة المخزون' : 'Stock Value'}</p>
          <p className="text-4xl font-black text-orange-600 tabular-nums">{stats.inventoryValue.toFixed(2)} <span className="text-sm font-bold">{settings.currency}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden no-print">
        <div className="p-6 border-b border-slate-50">
           <h3 className="font-black text-slate-800">{isAr ? 'سجل العمليات الأخير' : 'Recent Activity'}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
             <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                <tr>
                   <th className="px-6 py-4">{isAr ? 'المعرف' : 'ID'}</th>
                   <th className="px-6 py-4">{isAr ? 'التاريخ' : 'Date'}</th>
                   <th className="px-6 py-4">{isAr ? 'المبلغ' : 'Amount'}</th>
                   <th className="px-6 py-4">{isAr ? 'الضريبة' : 'Tax'}</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {invoices.map(inv => (
                  <tr key={inv.id} className="text-sm font-bold text-slate-700">
                     <td className="px-6 py-4">#{inv.id.slice(-6)}</td>
                     <td className="px-6 py-4 text-xs">{new Date(inv.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</td>
                     <td className="px-6 py-4 tabular-nums">{inv.total.toFixed(2)}</td>
                     <td className="px-6 py-4 text-slate-400 tabular-nums">{inv.tax.toFixed(2)}</td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>

      {/* منطقة الطباعة المخصصة (تظهر فقط عند الضغط على زر PDF/Print) */}
      <div className="print-area hidden invisible print:visible print:block bg-white p-10" style={{ direction: isAr ? 'rtl' : 'ltr', fontFamily: 'Tajawal, sans-serif' }}>
        <div className="text-center mb-10 border-b-2 border-slate-900 pb-8">
           <h1 className="text-3xl font-black">{settings.storeName}</h1>
           <p className="text-lg font-bold">{isAr ? 'تقرير مبيعات تفصيلي' : 'Detailed Sales Report'}</p>
           <p className="text-slate-500 mt-2">{new Date().toLocaleString(isAr ? 'ar-SA' : 'en-US')}</p>
           <p className="text-[10px] text-slate-400 mt-1">{isAr ? 'الرقم الضريبي' : 'VAT'}: {settings.taxNumber}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10 text-center">
           <div className="border-2 border-slate-100 p-6 rounded-3xl">
              <p className="text-xs font-black text-slate-400 uppercase">{isAr ? 'إجمالي المبيعات' : 'Sales'}</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{stats.totalSales.toFixed(2)} {settings.currency}</p>
           </div>
           <div className="border-2 border-slate-100 p-6 rounded-3xl">
              <p className="text-xs font-black text-slate-400 uppercase">{isAr ? 'صافي الأرباح' : 'Profit'}</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{stats.totalProfits.toFixed(2)} {settings.currency}</p>
           </div>
           <div className="border-2 border-slate-100 p-6 rounded-3xl">
              <p className="text-xs font-black text-slate-400 uppercase">{isAr ? 'عدد العمليات' : 'Orders'}</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{stats.totalOrders}</p>
           </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900 text-slate-800 text-xs font-black">
              <th className="py-4 text-right">{isAr ? 'المعرف' : 'ID'}</th>
              <th className="py-4 text-right">{isAr ? 'التاريخ' : 'Date'}</th>
              <th className="py-4 text-center">{isAr ? 'طريقة الدفع' : 'Payment'}</th>
              <th className="py-4 text-left">{isAr ? 'المبلغ الإجمالي' : 'Total'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map(inv => (
              <tr key={inv.id} className="text-[11px] font-bold">
                <td className="py-3">#{inv.id}</td>
                <td className="py-3">{new Date(inv.date).toLocaleString(isAr ? 'ar-SA' : 'en-US')}</td>
                <td className="py-3 text-center">{inv.paymentMethod}</td>
                <td className="py-3 text-left">{inv.total.toFixed(2)} {settings.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-20 pt-10 border-t border-slate-100 text-center text-slate-400 text-[10px] font-bold italic">
          {isAr ? 'تم استخراج هذا التقرير آلياً من نظام الأناقة الباهرة' : 'Generated automatically by Elegance System'}
        </div>
      </div>
    </div>
  );
};

export default Reports;
