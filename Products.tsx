
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Icons } from '../constants';

interface ProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  language: string;
}

const Products: React.FC<ProductsProps> = ({ products, setProducts, language }) => {
  const isAr = language === 'ar';
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', price: 0, costPrice: 0, stock: 0, category: isAr ? 'عام' : 'General', minStockAlert: 5
  });

  // استخراج الفئات الفريدة ديناميكياً
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    // Fix: Explicitly cast category to string to allow calling .trim()
    return cats.filter(c => c && (c as string).trim() !== '');
  }, [products]);

  // تصفية المنتجات بناءً على الفئة المختارة
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const t = {
    title: isAr ? 'إدارة المخزون والمنتجات' : 'Inventory & Products',
    desc: isAr ? 'تحكم في قائمة منتجات المتجر وتتبع الكميات المتوفرة.' : 'Control store products and track stock levels.',
    addNew: isAr ? 'إضافة منتج جديد' : 'Add New Product',
    editProduct: isAr ? 'تعديل المنتج' : 'Edit Product',
    filterAll: isAr ? 'كل الفئات' : 'All Categories',
    name: isAr ? 'اسم المنتج' : 'Product Name',
    category: isAr ? 'الفئة / القسم' : 'Category',
    costPrice: isAr ? 'سعر التكلفة' : 'Cost Price',
    salePrice: isAr ? 'سعر البيع' : 'Sale Price',
    stock: isAr ? 'المخزون' : 'Stock',
    minAlert: isAr ? 'تنبيه عند وصول الكمية لـ' : 'Alert at Quantity',
    save: isAr ? 'حفظ البيانات' : 'Save Changes',
    cancel: isAr ? 'إلغاء' : 'Cancel',
    actions: isAr ? 'إجراءات' : 'Actions',
    lowStock: isAr ? 'منخفض' : 'Low',
    confirmDelete: isAr ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?',
    currency: isAr ? 'ر.س' : 'SAR'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } as Product : p));
      setEditingId(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name || (isAr ? 'بدون اسم' : 'Unnamed'),
        price: Number(formData.price) || 0,
        costPrice: Number(formData.costPrice) || 0,
        stock: Number(formData.stock) || 0,
        category: formData.category || (isAr ? 'عام' : 'General'),
        minStockAlert: Number(formData.minStockAlert) || 5
      };
      setProducts(prev => [...prev, newProduct]);
      setIsAdding(false);
    }
    setFormData({ name: '', price: 0, costPrice: 0, stock: 0, category: isAr ? 'عام' : 'General', minStockAlert: 5 });
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(t.confirmDelete)) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t.title}</h2>
          <p className="text-slate-400 font-bold mt-1">{t.desc}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-[#3498db] text-white rounded-2xl shadow-xl shadow-blue-500/10 hover:bg-[#2980b9] transition-all font-black text-sm flex items-center gap-2"
        >
          <Icons.Plus /> {t.addNew}
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-blue-50 animate-in slide-in-from-top-6">
          <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center gap-3">
             <span className="w-2 h-6 bg-[#3498db] rounded-full"></span>
             {editingId ? t.editProduct : t.addNew}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.name}</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-[#3498db] outline-none font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.category}</label>
              <input 
                type="text" 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-[#3498db] outline-none font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-emerald-500 uppercase tracking-widest">{t.costPrice}</label>
              <input 
                required
                type="number" 
                value={formData.costPrice}
                onChange={e => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                className="w-full px-5 py-4 bg-emerald-50/30 rounded-2xl border border-emerald-100 focus:border-emerald-500 outline-none font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-blue-500 uppercase tracking-widest">{t.salePrice}</label>
              <input 
                required
                type="number" 
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-5 py-4 bg-blue-50/30 rounded-2xl border border-blue-100 focus:border-blue-500 outline-none font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.stock}</label>
              <input 
                required
                type="number" 
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-[#3498db] outline-none font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.minAlert}</label>
              <input 
                required
                type="number" 
                value={formData.minStockAlert}
                onChange={e => setFormData({ ...formData, minStockAlert: Number(e.target.value) })}
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-[#3498db] outline-none font-bold"
              />
            </div>
            <div className="lg:col-span-3 flex items-center gap-4 mt-4">
              <button type="submit" className="flex-1 py-4 bg-[#3498db] text-white rounded-2xl font-black shadow-lg hover:bg-[#2980b9] transition-all">{t.save}</button>
              <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all">{t.cancel}</button>
            </div>
          </form>
        </div>
      )}

      {/* نظام التصفية (Filters) */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-[22px] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-3 rounded-xl font-black text-xs transition-all whitespace-nowrap ${selectedCategory === 'all' ? 'bg-[#3498db] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          {t.filterAll}
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-3 rounded-xl font-black text-xs transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-[#3498db] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full ${isAr ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.name}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.category}</th>
                <th className="px-8 py-6 text-[10px] font-black text-emerald-500 uppercase tracking-widest">{t.costPrice}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-900 uppercase tracking-widest">{t.salePrice}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.stock}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-800 text-sm group-hover:text-[#3498db] transition-colors">{p.name}</p>
                    <p className="text-[10px] font-bold text-slate-300">ID: {p.id.slice(-6)}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tight">{p.category}</span>
                  </td>
                  <td className="px-8 py-5 font-black text-emerald-600 text-sm">{(p.costPrice || 0).toFixed(2)} {t.currency}</td>
                  <td className="px-8 py-5 font-black text-slate-900 text-sm">{p.price.toFixed(2)} {t.currency}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className={`font-black text-sm ${p.stock <= p.minStockAlert ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>{p.stock}</span>
                        {p.stock <= p.minStockAlert && <span className="text-[8px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter mt-1">{t.lowStock}</span>}
                      </div>
                      <div className="flex-1 h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.stock <= p.minStockAlert ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Icons.Trash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <div className="inline-flex p-6 bg-slate-50 rounded-full text-slate-200 mb-4"><Icons.Products /></div>
              <p className="font-black text-slate-300 uppercase tracking-widest">{isAr ? 'لا توجد منتجات في هذه الفئة' : 'No products in this category'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
