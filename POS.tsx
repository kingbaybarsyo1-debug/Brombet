
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Invoice, InvoiceItem } from '../types';
import { Icons } from '../constants';

interface POSProps {
  products: Product[];
  onComplete: (invoice: Invoice) => void;
  language: string;
  currency: string;
  settings: any;
}

const POS: React.FC<POSProps> = ({ products, onComplete, language, currency, settings }) => {
  const isAr = language === 'ar';
  const [basket, setBasket] = useState<InvoiceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mixed'>('cash');
  const [showingCostId, setShowingCostId] = useState<string | null>(null);
  const [paidCash, setPaidCash] = useState<number>(0);
  const [paidCard, setPaidCard] = useState<number>(0);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount');

  const t = {
    searchPlaceholder: isAr ? 'ابحث عن المنتجات...' : 'Search products...',
    stock: isAr ? 'المخزون' : 'Stock',
    cost: isAr ? 'سعر التكلفة' : 'Cost Price',
    newInvoice: isAr ? 'فاتورة جديدة' : 'New Invoice',
    emptyBasket: isAr ? 'السلة فارغة' : 'Basket is empty',
    discount: isAr ? 'إضافة خصم' : 'Add Discount',
    amount: isAr ? 'مبلغ' : 'Amount',
    percent: isAr ? 'نسبة %' : 'Percent %',
    subtotal: isAr ? 'المجموع الفرعي' : 'Subtotal',
    tax: isAr ? `الضريبة (${settings.taxPercentage}%)` : `Tax (${settings.taxPercentage}%)`,
    total: isAr ? 'الإجمالي النهائي' : 'Grand Total',
    cash: isAr ? 'نقدي (كاش)' : 'Cash',
    card: isAr ? 'بطاقة (شبكة)' : 'Card',
    mixed: isAr ? 'نقدي + شبكة' : 'Mixed',
    checkout: isAr ? 'إتمام الدفع' : 'Checkout',
    delete: isAr ? 'حذف' : 'Delete'
  };

  const filteredProducts = useMemo(() => 
    products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())),
  [products, searchTerm]);

  const addToBasket = (product: Product) => {
    if (product.stock <= 0) return;
    setBasket(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price } 
            : item
        );
      }
      return [...prev, { 
        productId: product.id, name: product.name, price: product.price, quantity: 1, total: product.price 
      }];
    });
  };

  const removeFromBasket = (productId: string) => {
    setBasket(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setBasket(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        const prod = products.find(p => p.id === productId);
        if (prod && newQty > prod.stock) return item;
        return { ...item, quantity: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };

  const subtotal = basket.reduce((sum, item) => sum + item.total, 0);
  const calculatedDiscount = discountType === 'percent' ? (subtotal * discountValue) / 100 : Math.min(discountValue, subtotal);
  const taxableAmount = subtotal - calculatedDiscount;
  
  let tax = 0;
  let total = taxableAmount;

  if (settings.taxEnabled) {
    if (settings.taxIncludedInPrice) {
      tax = taxableAmount - (taxableAmount / (1 + (settings.taxPercentage / 100)));
      total = taxableAmount;
    } else {
      tax = taxableAmount * (settings.taxPercentage / 100);
      total = taxableAmount + tax;
    }
  }

  useEffect(() => {
    if (paymentMethod === 'mixed') { setPaidCash(0); setPaidCard(total); }
  }, [paymentMethod, total]);

  const handleCheckout = () => {
    if (basket.length === 0) return;
    onComplete({
      id: `INV-${Date.now()}`, date: new Date().toISOString(), items: [...basket],
      subtotal, tax, discount: calculatedDiscount, total, paymentMethod,
      paidCash: paymentMethod === 'mixed' ? paidCash : (paymentMethod === 'cash' ? total : 0),
      paidCard: paymentMethod === 'mixed' ? paidCard : (paymentMethod === 'card' ? total : 0),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-6">
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center">
          <div className="flex-1 relative">
            <span className={`absolute inset-y-0 ${isAr ? 'right-4' : 'left-4'} flex items-center text-slate-300`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
              type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-transparent border-none focus:ring-0 text-lg font-bold placeholder:text-slate-300 outline-none`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-250px)] pb-10 no-scrollbar">
          {filteredProducts.map(product => (
            <div key={product.id} className={`relative bg-white p-5 rounded-3xl border transition-all group flex flex-col justify-between h-56 ${product.stock <= 0 ? 'opacity-40 grayscale' : 'border-slate-100 hover:border-[#3498db] hover:shadow-xl'}`}>
              <button onClick={() => addToBasket(product)} className="absolute inset-0 z-0 rounded-3xl" disabled={product.stock <= 0} />
              <div className="relative z-10 pointer-events-none">
                <span className="text-[10px] px-2.5 py-1 bg-blue-50 text-[#3498db] rounded-lg font-black mb-3 inline-block uppercase">{product.category}</span>
                <h4 className="font-extrabold text-slate-800 text-base leading-tight group-hover:text-[#3498db] line-clamp-2">{product.name}</h4>
              </div>
              <div className="flex items-end justify-between mt-4 relative z-10">
                <div className="pointer-events-none flex-1">
                  {showingCostId === product.id ? (
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 animate-pulse">
                      <p className="text-[9px] font-black text-emerald-500 uppercase">{t.cost}</p>
                      <p className="text-xl font-black text-emerald-700">{(product.costPrice || 0).toFixed(2)} <span className="text-[10px]">{currency}</span></p>
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-black text-slate-900">{product.price.toFixed(0)} <span className="text-[10px] font-bold text-slate-400">{currency}</span></p>
                      <p className={`text-[10px] mt-1 font-bold ${product.stock <= product.minStockAlert ? 'text-red-500' : 'text-slate-400'}`}>{t.stock}: {product.stock}</p>
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-center pointer-events-auto">
                  <button onClick={() => addToBasket(product)} className="bg-[#3498db] text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"><Icons.Plus /></button>
                  <button 
                    onMouseDown={() => setShowingCostId(product.id)} 
                    onMouseUp={() => setShowingCostId(null)} 
                    onMouseLeave={() => setShowingCostId(null)}
                    onTouchStart={() => setShowingCostId(product.id)}
                    onTouchEnd={() => setShowingCostId(null)}
                    className="p-2 bg-slate-100 text-slate-400 hover:text-[#3498db] hover:bg-blue-50 rounded-xl transition-colors cursor-help"
                    title={t.cost}
                  >
                    <Icons.Eye />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col h-fit sticky top-28 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-blue-50 p-2 rounded-xl text-[#3498db]"><Icons.POS /></div>
             <h3 className="font-black text-xl text-slate-800">{t.newInvoice}</h3>
          </div>
          <span className="bg-[#3498db] text-white px-3 py-1 rounded-full text-xs font-black">{basket.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 max-h-[300px]">
          {basket.map(item => (
            <div key={item.productId} className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-extrabold text-sm text-slate-800 leading-tight">{item.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-[#3498db]">{item.price} {currency}</span>
                  <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="text-slate-400 hover:text-slate-600">-</button>
                    <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="text-slate-400 hover:text-slate-600">+</button>
                  </div>
                </div>
              </div>
              <div className={isAr ? "text-left" : "text-right"}>
                 <p className="font-black text-sm text-slate-900">{item.total.toFixed(2)}</p>
                 <button onClick={() => removeFromBasket(item.productId)} className="text-red-300 hover:text-red-500 text-[10px] font-bold">{t.delete}</button>
              </div>
            </div>
          ))}
          {basket.length === 0 && <div className="py-20 flex flex-col items-center justify-center text-slate-200"><Icons.POS /><p className="font-bold">{t.emptyBasket}</p></div>}
        </div>

        <div className="px-8 py-4 bg-blue-50/50 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500">{t.discount}</span>
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-100">
              <button onClick={() => setDiscountType('amount')} className={`px-2 py-1 text-[10px] font-bold rounded ${discountType === 'amount' ? 'bg-[#3498db] text-white' : 'text-slate-400'}`}>{t.amount}</button>
              <button onClick={() => setDiscountType('percent')} className={`px-2 py-1 text-[10px] font-bold rounded ${discountType === 'percent' ? 'bg-[#3498db] text-white' : 'text-slate-400'}`}>{t.percent}</button>
            </div>
          </div>
          <input type="number" value={discountValue || ''} onChange={(e) => setDiscountValue(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold outline-none" placeholder={isAr ? "قيمة الخصم" : "Discount Value"} />
        </div>

        <div className="p-8 bg-slate-50 space-y-4">
          <div className="space-y-2 text-sm font-bold">
            <div className="flex justify-between text-slate-400"><span>{t.subtotal}</span><span>{subtotal.toFixed(2)}</span></div>
            {calculatedDiscount > 0 && <div className="flex justify-between text-red-400"><span>{isAr ? "الخصم" : "Discount"}</span><span>- {calculatedDiscount.toFixed(2)}</span></div>}
            {settings.taxEnabled && (
              <div className="flex justify-between text-slate-400">
                <span>{t.tax} {settings.taxIncludedInPrice && (isAr ? "(مشمول)" : "(Incl.)")}</span>
                <span>{tax.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
            <span className="font-black text-slate-800">{t.total}</span>
            <div className={isAr ? "text-left" : "text-right"}>
               <span className="text-4xl font-black text-[#3498db]">{total.toFixed(2)}</span>
               <p className="text-[10px] font-bold text-slate-400">{isAr ? "ريال سعودي" : currency}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['cash', 'card', 'mixed'].map(m => (
              <button key={m} onClick={() => setPaymentMethod(m as any)} className={`flex-1 py-3 rounded-2xl font-black text-[10px] border-2 transition-all ${paymentMethod === m ? 'bg-blue-100 border-[#3498db] text-[#3498db]' : 'bg-white border-slate-200 text-slate-400'}`}>
                {t[m as keyof typeof t]}
              </button>
            ))}
          </div>
          <button onClick={handleCheckout} disabled={basket.length === 0} className={`w-full py-5 rounded-[20px] text-white font-black text-xl shadow-xl transition-all ${basket.length === 0 ? 'bg-slate-300' : 'bg-[#3498db] hover:bg-[#2980b9]'}`}>{t.checkout}</button>
        </div>
      </div>
    </div>
  );
};

export default POS;
