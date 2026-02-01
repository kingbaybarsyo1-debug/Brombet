
import React, { useState } from 'react';
import { Invoice } from '../types';
import { Icons } from '../constants';

interface InvoicesProps {
  invoices: Invoice[];
  settings: any;
}

const Invoices: React.FC<InvoicesProps> = ({ invoices, settings }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);
  const isAr = settings.language === 'ar';

  const handlePrint = () => {
    if (!selectedInvoice) return;
    window.print();
  };

  const getMethodBadge = (method: string) => {
    switch(method) {
      case 'cash': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight">كاش</span>;
      case 'card': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight">شبكة</span>;
      case 'mixed': return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight">مختلط</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{isAr ? 'سجل المبيعات' : 'Sales Registry'}</h2>
          <p className="text-slate-400 font-bold mt-1">{isAr ? 'تتبع وإدارة جميع الفواتير الصادرة.' : 'Manage all issued invoices.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 no-print">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                   <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                         <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">المعرف</th>
                         <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">الوقت</th>
                         <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">الدفع</th>
                         <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">الإجمالي</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {invoices.map(inv => (
                        <tr 
                          key={inv.id} 
                          onClick={() => setSelectedInvoice(inv)}
                          className={`cursor-pointer transition-all hover:bg-blue-50/30 ${selectedInvoice?.id === inv.id ? 'bg-blue-50/50' : 'bg-transparent'}`}
                        >
                           <td className="px-6 py-4 font-black text-[#3498db] text-sm">#{inv.id.slice(-6)}</td>
                           <td className="px-6 py-4">
                              <p className="text-xs font-bold text-slate-600">{new Date(inv.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</p>
                              <p className="text-[10px] text-slate-400">{new Date(inv.date).toLocaleTimeString(isAr ? 'ar-SA' : 'en-US')}</p>
                           </td>
                           <td className="px-6 py-4">{getMethodBadge(inv.paymentMethod)}</td>
                           <td className="px-6 py-4">
                              <span className="font-black text-slate-900">{inv.total.toFixed(2)}</span>
                              <span className="text-[10px] text-slate-400 mr-1">{settings.currency}</span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        <div className="lg:col-span-5">
           {selectedInvoice ? (
             <div className="sticky top-28 flex flex-col items-center">
                {/* معاينة الواجهة - تختفي عند الطباعة */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100 w-full no-print">
                    <div className="w-full flex justify-between items-center mb-8">
                       <h3 className="font-black text-xl text-slate-800">تفاصيل الفاتورة</h3>
                       <button 
                         onClick={handlePrint}
                         className="bg-[#3498db] text-white p-3 rounded-2xl hover:bg-[#2980b9] shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 text-sm font-bold"
                       >
                         <Icons.Print /> طباعة / PDF
                       </button>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl w-full border border-slate-100">
                        <div className="text-center mb-6">
                            <p className="font-black text-lg">{settings.storeName}</p>
                            <p className="text-[10px] text-slate-400">{selectedInvoice.id}</p>
                        </div>
                        <div className="space-y-2 mb-6">
                            {selectedInvoice.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs font-bold">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>{item.total.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-dashed border-slate-300 pt-4 flex justify-between font-black text-blue-600">
                            <span>الإجمالي</span>
                            <span>{selectedInvoice.total.toFixed(2)} {settings.currency}</span>
                        </div>
                    </div>
                </div>

                {/* منطقة الطباعة الفعلية - تظهر فقط عند window.print() */}
                <div className="print-area hidden invisible print:visible print:block bg-white p-6 w-[80mm] mx-auto" style={{ direction: isAr ? 'rtl' : 'ltr', fontFamily: 'Tajawal, sans-serif' }}>
                    <div className="text-center border-b pb-4 mb-4">
                        <h2 className="text-xl font-black">{settings.storeName}</h2>
                        <p className="text-[10px] font-bold">{isAr ? 'فاتورة مبيعات ضريبية' : 'Tax Invoice'}</p>
                        <p className="text-[9px] text-slate-500">{new Date(selectedInvoice.date).toLocaleString(isAr ? 'ar-SA' : 'en-US')}</p>
                    </div>
                    
                    <div className="text-[10px] space-y-1 mb-4">
                        <div className="flex justify-between font-bold"><span>رقم الفاتورة:</span><span>{selectedInvoice.id}</span></div>
                        <div className="flex justify-between font-bold"><span>الرقم الضريبي:</span><span>{settings.taxNumber}</span></div>
                    </div>

                    <table className="w-full text-[10px] mb-4 border-t border-b border-black">
                        <thead>
                            <tr className="font-black">
                                <th align="right" className="py-1">الصنف</th>
                                <th align="center" className="py-1">الكمية</th>
                                <th align="left" className="py-1">السعر</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedInvoice.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-slate-100">
                                    <td className="py-1">{item.name}</td>
                                    <td align="center" className="py-1">{item.quantity}</td>
                                    <td align="left" className="py-1">{item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-[11px] font-black space-y-1">
                        <div className="flex justify-between"><span>المجموع:</span><span>{selectedInvoice.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>الضريبة:</span><span>{selectedInvoice.tax.toFixed(2)}</span></div>
                        <div className="flex justify-between text-lg border-t pt-1"><span>الإجمالي:</span><span>{selectedInvoice.total.toFixed(2)} {settings.currency}</span></div>
                    </div>

                    <div className="text-center mt-6 pt-4 border-t border-dashed">
                        <p className="text-[10px] font-black">{settings.footerMessage}</p>
                    </div>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-200 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-100 p-20 no-print">
                <Icons.Invoices />
                <p className="mt-4 font-bold">{isAr ? 'يرجى اختيار فاتورة للمعاينة' : 'Select an invoice'}</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
