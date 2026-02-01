
import React, { useState, useEffect } from 'react';
import { AppSection, Product, Invoice, User } from './types';
import { Icons, INITIAL_PRODUCTS, INITIAL_USERS } from './constants';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Invoices from './components/Invoices';
import Products from './components/Products';
import Reports from './components/Reports';
import Users from './components/Users';
import Settings from './components/Settings';
import InvoicePrint from './components/InvoicePrint';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection | string>(AppSection.Dashboard);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('app_settings');
    return saved ? JSON.parse(saved) : {
      storeName: 'الأناقة الباهرة',
      storeLogo: null,
      taxNumber: '310029384800003',
      phone: '966500000000',
      currency: 'ر.س',
      address: 'المملكة العربية السعودية، الرياض، حي النرجس',
      printSize: '80mm',
      footerMessage: 'شكراً لزيارتكم .. نتمنى رؤيتكم قريباً',
      returnPolicy: 'البضاعة المباعة لا ترد ولا تستبدل بعد 3 أيام من تاريخ الشراء.',
      isDarkMode: false,
      language: 'ar',
      // خيارات الضريبة الجديدة
      taxEnabled: true,
      taxPercentage: 15,
      taxIncludedInPrice: false
    };
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : [];
  });
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
  }, [settings]);

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
    setProducts(prev => prev.map(p => {
      const item = invoice.items.find(i => i.productId === p.id);
      if (item) return { ...p, stock: p.stock - item.quantity };
      return p;
    }));
    setCurrentInvoiceId(invoice.id);
    setActiveSection('print-invoice');
  };

  const navItems = [
    { id: AppSection.Dashboard, label: settings.language === 'ar' ? 'الرئيسية' : 'Dashboard', icon: <Icons.Home /> },
    { id: AppSection.POS, label: settings.language === 'ar' ? 'نقطة البيع' : 'POS', icon: <Icons.POS /> },
    { id: AppSection.Invoices, label: settings.language === 'ar' ? 'الفواتير' : 'Invoices', icon: <Icons.Invoices /> },
    { id: AppSection.Products, label: settings.language === 'ar' ? 'المنتجات' : 'Products', icon: <Icons.Products /> },
    { id: AppSection.Reports, label: settings.language === 'ar' ? 'التقارير' : 'Reports', icon: <Icons.Reports /> },
    { id: AppSection.Users, label: settings.language === 'ar' ? 'المستخدمين' : 'Users', icon: <Icons.Users /> },
    { id: AppSection.Settings, label: settings.language === 'ar' ? 'الإعدادات' : 'Settings', icon: <Icons.Settings /> },
  ];

  if (activeSection === 'print-invoice' && currentInvoiceId) {
    const inv = invoices.find(i => i.id === currentInvoiceId);
    if (inv) {
      return <InvoicePrint invoice={inv} settings={settings} onBack={() => setActiveSection(AppSection.POS)} />;
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case AppSection.Dashboard: return <Dashboard invoices={invoices} products={products} onNavigate={(s) => setActiveSection(s)} language={settings.language} />;
      case AppSection.POS: return <POS products={products} onComplete={addInvoice} language={settings.language} currency={settings.currency} settings={settings} />;
      case AppSection.Invoices: return <Invoices invoices={invoices} settings={settings} />;
      case AppSection.Products: return <Products products={products} setProducts={setProducts} language={settings.language} />;
      case AppSection.Reports: return <Reports invoices={invoices} products={products} settings={settings} />;
      case AppSection.Users: return <Users users={users} setUsers={setUsers} language={settings.language} />;
      case AppSection.Settings: return <Settings settings={settings} setSettings={setSettings} />;
      default: return <Dashboard invoices={invoices} products={products} onNavigate={(s) => setActiveSection(s)} language={settings.language} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${settings.isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col no-print`}>
      <header className={`${settings.isDarkMode ? 'bg-slate-800 border-slate-700 shadow-xl shadow-black/20' : 'bg-white border-slate-100'} border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center pt-6 pb-2">
            {settings.storeLogo && (
              <img src={settings.storeLogo} alt="Logo" className="h-12 w-auto mb-2 object-contain" />
            )}
            <h1 className="text-[#3498db] text-3xl font-black tracking-tight">{settings.storeName}</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              {settings.language === 'ar' ? 'نظام إدارة المتاجر المتكامل' : 'Integrated Store Management System'}
            </p>
          </div>
          <nav className="flex items-center justify-center gap-1 md:gap-2 py-4 overflow-x-auto no-scrollbar">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap group ${
                  activeSection === item.id 
                    ? 'bg-[#3498db] text-white shadow-lg shadow-blue-500/20' 
                    : `${settings.isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-50'} hover:text-[#3498db]`
                }`}
              >
                <span className={`${activeSection === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#3498db]'}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-extrabold">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
      <footer className={`py-6 text-center ${settings.isDarkMode ? 'text-slate-600' : 'text-slate-400'} text-xs font-bold`}>
        &copy; {new Date().getFullYear()} {settings.storeName} - {settings.language === 'ar' ? 'كافة الحقوق محفوظة' : 'All Rights Reserved'}
      </footer>
    </div>
  );
};

export default App;
