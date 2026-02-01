
import React, { useEffect, useCallback, useRef } from 'react';
import { Invoice } from '../types';
import { Icons } from '../constants';
import { QRCodeSVG } from 'qrcode.react';

interface InvoicePrintProps {
  invoice: Invoice;
  settings: any;
  onBack: () => void;
}

const InvoicePrint: React.FC<InvoicePrintProps> = ({ invoice, settings, onBack }) => {
  const printTriggered = useRef(false);
  const isAr = settings.language === 'ar';

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  useEffect(() => {
    if (!printTriggered.current) {
      // انتظار بسيط لضمان تحميل الـ QR Code والخطوط قبل الطباعة
      const timer = setTimeout(() => {
        handlePrint();
        printTriggered.current = true;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [handlePrint]);

  const getPaymentLabel = () => {
    if (invoice.paymentMethod === 'cash') return isAr ? 'نقدي (كاش)' : 'Cash';
    if (invoice.paymentMethod === 'card') return isAr ? 'بطاقة صراف' : 'Card';
    return isAr ? 'دفع مختلط' : 'Mixed';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4 no-scrollbar">
      <div className="no-print mb-8 flex flex-col sm:flex-row gap-4 w-full max-w-[80mm] justify-center">
        <button onClick={onBack} className="flex-1 bg-white text-slate-600 px-6 py-4 rounded-2xl font-black border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
          {isAr ? 'العودة لنقطة البيع' : 'Back to POS'}
        </button>
        <button onClick={handlePrint} className="flex-1 bg-[#3498db] text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-[#2980b9] transition-all flex items-center justify-center gap-2">
          <Icons.Print /> {isAr ? 'طباعة يدوية' : 'Manual Print'}
        </button>
      </div>

      <div id="thermal-receipt" className={`bg-white p-6 shadow-2xl print-receipt w-full border border-slate-100 ${settings.printSize === 'A4' ? 'max-w-[210mm]' : 'max-w-[80mm]'}`} style={{ direction: isAr ? 'rtl' : 'ltr', fontFamily: 'Tajawal, sans-serif' }}>
        <div className="text-center mb-6">
          {settings.storeLogo && (
            <img src={settings.storeLogo} alt="Logo" className="h-16 w-auto mb-4 mx-auto object-contain" />
          )}
          <h1 className="text-xl font-black text-slate-900 m-0 uppercase tracking-tighter">{settings.storeName}</h1>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest border-b border-slate-100 pb-2">{isAr ? 'فاتورة ضريبية مبسطة' : 'Simplified Tax Invoice'}</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-[9px] font-bold text-slate-400">{isAr ? 'الرقم الضريبي' : 'VAT No'}: {settings.taxNumber}</p>
            <p className="text-[9px] font-bold text-slate-400">{isAr ? 'العنوان' : 'Address'}: {settings.address}</p>
          </div>
        </div>

        <div className="border-y border-dashed border-slate-300 py-3 mb-4 text-[10px] space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">{isAr ? 'رقم الفاتورة' : 'Invoice No'}:</span>
            <span className="font-bold text-slate-900">{invoice.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">{isAr ? 'التاريخ' : 'Date'}:</span>
            <span className="font-bold text-slate-900">{new Date(invoice.date).toLocaleString(isAr ? 'ar-SA' : 'en-US')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">{isAr ? 'طريقة الدفع' : 'Payment'}:</span>
            <span className="font-bold text-slate-900">{getPaymentLabel()}</span>
          </div>
        </div>

        <table className="w-full text-[10px] mb-6 border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900 text-slate-800">
              <th align={isAr ? 'right' : 'left'} className="pb-2 font-black">{isAr ? 'الصنف' : 'Item'}</th>
              <th align="center" className="pb-2 font-black">{isAr ? 'كمية' : 'Qty'}</th>
              <th align={isAr ? 'left' : 'right'} className="pb-2 font-black">{isAr ? 'إجمالي' : 'Total'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2 leading-tight font-medium">{item.name}</td>
                <td align="center" className="py-2 font-bold tabular-nums">{item.quantity}</td>
                <td align={isAr ? 'left' : 'right'} className="py-2 font-black tabular-nums">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t-2 border-slate-900 pt-4 space-y-1 text-[11px]">
          <div className="flex justify-between text-slate-600 font-bold">
            <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}:</span>
            <span className="tabular-nums">{invoice.subtotal.toFixed(2)} {settings.currency}</span>
          </div>
          {invoice.discount > 0 && (
             <div className="flex justify-between text-red-500 font-bold">
               <span>{isAr ? 'الخصم' : 'Discount'}:</span>
               <span className="tabular-nums">- {invoice.discount.toFixed(2)} {settings.currency}</span>
             </div>
          )}
          <div className="flex justify-between text-slate-600 font-bold">
            <span>{isAr ? 'ضريبة القيمة المضافة' : 'VAT'}:</span>
            <span className="tabular-nums">{invoice.tax.toFixed(2)} {settings.currency}</span>
          </div>
          <div className="flex justify-between items-end pt-3 border-t border-dashed border-slate-200 mt-2">
            <span className="font-black text-slate-900 text-lg">{isAr ? 'الإجمالي' : 'Grand Total'}:</span>
            <span className="text-2xl font-black text-[#3498db] tabular-nums">{invoice.total.toFixed(2)} {settings.currency}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <QRCodeSVG value={`ZATCA-${invoice.id}-${invoice.total}-${invoice.tax}`} size={100} level="M" />
          <div className="text-center mt-4">
             <p className="text-[10px] font-black text-slate-800 uppercase leading-relaxed">{settings.footerMessage}</p>
             <p className="text-[8px] font-bold text-slate-400 mt-2">{settings.returnPolicy}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
