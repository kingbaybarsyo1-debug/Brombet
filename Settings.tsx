
import React, { useState, useRef } from 'react';
import { Icons } from '../constants';

type SettingsTab = 'store' | 'invoice' | 'appearance';

interface SettingsProps {
  settings: any;
  setSettings: (s: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('store');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAr = settings.language === 'ar';

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSetting('storeLogo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'store', label: isAr ? 'إعدادات المتجر' : 'Store Settings', icon: <Icons.Home /> },
    { id: 'invoice', label: isAr ? 'إعدادات الفاتورة' : 'Invoice Settings', icon: <Icons.Invoices /> },
    { id: 'appearance', label: isAr ? 'اللغة والمظهر' : 'Language & Appearance', icon: <Icons.Settings /> },
  ];

  const renderStoreSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
      {/* قسم الشعار */}
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
        <div className="relative group">
          <div className="w-32 h-32 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
            {settings.storeLogo ? (
              <img src={settings.storeLogo} alt="Store Logo" className="w-full h-full object-contain p-2" />
            ) : (
              <div className="text-slate-300"><Icons.Plus /></div>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-[#3498db] text-white p-3 rounded-2xl shadow-lg hover:bg-[#2980b9] transition-all"
          >
            <Icons.Plus />
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleLogoUpload} 
          accept="image/*" 
          className="hidden" 
        />
        <div className="text-center mt-4">
          <h4 className="font-black text-slate-800">{isAr ? 'شعار المتجر' : 'Store Logo'}</h4>
          <p className="text-xs font-bold text-slate-400 mt-1">{isAr ? 'يفضل استخدام صورة بخلفية شفافة PNG' : 'Prefer transparent PNG'}</p>
        </div>
        {settings.storeLogo && (
          <button 
            onClick={() => updateSetting('storeLogo', null)}
            className="text-red-400 text-xs font-black mt-4 hover:text-red-600"
          >
            {isAr ? 'حذف الشعار' : 'Remove Logo'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider">{isAr ? 'اسم المتجر' : 'Store Name'}</label>
          <input 
            type="text" 
            value={settings.storeName} 
            onChange={(e) => updateSetting('storeName', e.target.value)}
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-[#3498db] outline-none font-bold" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider">{isAr ? 'الرقم الضريبي' : 'Tax Number'}</label>
          <input 
            type="text" 
            value={settings.taxNumber} 
            onChange={(e) => updateSetting('taxNumber', e.target.value)}
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-[#3498db] outline-none font-bold" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider">{isAr ? 'رقم الجوال' : 'Phone Number'}</label>
          <input 
            type="text" 
            value={settings.phone} 
            onChange={(e) => updateSetting('phone', e.target.value)}
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-[#3498db] outline-none font-bold" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider">{isAr ? 'العملة' : 'Currency'}</label>
          <select 
            value={settings.currency} 
            onChange={(e) => updateSetting('currency', e.target.value)}
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-[#3498db] outline-none font-bold appearance-none"
          >
            <option value="ر.س">{isAr ? 'ريال سعودي (ر.س)' : 'Saudi Riyal (SAR)'}</option>
            <option value="$">{isAr ? 'دولار أمريكي ($)' : 'US Dollar ($)'}</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-black text-slate-400 uppercase tracking-wider">{isAr ? 'عنوان المتجر' : 'Address'}</label>
        <textarea 
          value={settings.address} 
          onChange={(e) => updateSetting('address', e.target.value)}
          className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold h-24" 
        />
      </div>
    </div>
  );

  const renderInvoiceSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
      {/* قسم ضريبة القيمة المضافة */}
      <section className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
        <h4 className="font-black text-slate-800 flex items-center gap-2 mb-6">
          <span className="p-1.5 bg-[#3498db] rounded-lg text-white"><Icons.POS /></span>
          {isAr ? 'إعدادات ضريبة القيمة المضافة (VAT)' : 'Tax Settings (VAT)'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <p className="font-black text-slate-800 text-sm">{isAr ? 'تفعيل الضريبة' : 'Enable Tax'}</p>
              <p className="text-[10px] text-slate-400 font-bold">{isAr ? 'إظهار الضريبة في الفاتورة' : 'Show tax in receipt'}</p>
            </div>
            <button 
              onClick={() => updateSetting('taxEnabled', !settings.taxEnabled)}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.taxEnabled ? 'bg-[#3498db]' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.taxEnabled ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'left-7' : 'right-7')}`}></div>
            </button>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
             <div className="flex-1">
                <p className="font-black text-slate-800 text-sm">{isAr ? 'نسبة الضريبة (%)' : 'Tax Rate (%)'}</p>
                <p className="text-[10px] text-slate-400 font-bold">{isAr ? 'النسبة المئوية للضريبة' : 'Tax percentage'}</p>
             </div>
             <input 
               type="number" 
               value={settings.taxPercentage} 
               disabled={!settings.taxEnabled}
               onChange={(e) => updateSetting('taxPercentage', Number(e.target.value))}
               className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black text-center disabled:opacity-50"
             />
          </div>

          <div className="md:col-span-2 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <p className="font-black text-slate-800 text-sm">{isAr ? 'الأسعار تشمل الضريبة' : 'Prices Include Tax'}</p>
              <p className="text-[10px] text-slate-400 font-bold">{isAr ? 'هل الأسعار المدخلة في المنتجات تشمل الضريبة مسبقاً؟' : 'Are product prices tax-inclusive?'}</p>
            </div>
            <button 
              disabled={!settings.taxEnabled}
              onClick={() => updateSetting('taxIncludedInPrice', !settings.taxIncludedInPrice)}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.taxIncludedInPrice ? 'bg-emerald-500' : 'bg-slate-300'} disabled:opacity-50`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.taxIncludedInPrice ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'left-7' : 'right-7')}`}></div>
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="font-black text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#3498db] rounded-full"></span>
          {isAr ? 'حجم ورق الطباعة' : 'Paper Size'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['80mm', '58mm', 'A4'].map((size) => (
            <label key={size} className={`relative flex items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${settings.printSize === size ? 'border-[#3498db] bg-blue-50' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
              <input type="radio" checked={settings.printSize === size} onChange={() => updateSetting('printSize', size)} className="sr-only" />
              <span className={`font-black ${settings.printSize === size ? 'text-[#3498db]' : 'text-slate-700'}`}>{size}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-400 uppercase">{isAr ? 'رسالة الشكر' : 'Footer Message'}</label>
          <input 
            type="text" 
            value={settings.footerMessage} 
            onChange={(e) => updateSetting('footerMessage', e.target.value)}
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-400 uppercase">{isAr ? 'سياسة الاسترجاع' : 'Return Policy'}</label>
          <textarea 
            value={settings.returnPolicy} 
            onChange={(e) => updateSetting('returnPolicy', e.target.value)}
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold h-24" 
          />
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
        <div>
          <h4 className="font-black text-slate-800 text-lg">{isAr ? 'الوضع الليلي' : 'Dark Mode'}</h4>
          <p className="text-slate-400 text-sm font-bold">{isAr ? 'تغيير ألوان النظام لتكون مريحة للعين.' : 'Change system colors.'}</p>
        </div>
        <button 
          onClick={() => updateSetting('isDarkMode', !settings.isDarkMode)}
          className={`w-14 h-8 rounded-full transition-all relative ${settings.isDarkMode ? 'bg-[#3498db]' : 'bg-slate-200'}`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${settings.isDarkMode ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'left-7' : 'right-7')}`}></div>
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100">
        <h4 className="font-black text-slate-800 text-lg mb-4">{isAr ? 'لغة النظام' : 'System Language'}</h4>
        <div className="flex gap-4">
          <button onClick={() => updateSetting('language', 'ar')} className={`flex-1 p-4 rounded-2xl border-2 font-black ${settings.language === 'ar' ? 'border-[#3498db] bg-blue-50 text-[#3498db]' : 'border-slate-100 text-slate-400'}`}>العربية</button>
          <button onClick={() => updateSetting('language', 'en')} className={`flex-1 p-4 rounded-2xl border-2 font-black ${settings.language === 'en' ? 'border-[#3498db] bg-blue-50 text-[#3498db]' : 'border-slate-100 text-slate-400'}`}>English</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">{isAr ? 'إعدادات النظام' : 'Settings'}</h2>
        <div className="flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-2xl font-black text-xs">
          {isAr ? 'يتم الحفظ تلقائياً' : 'Auto Saved'}
        </div>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar gap-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all whitespace-nowrap font-black text-sm ${activeTab === tab.id ? 'bg-[#3498db] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 p-8 md:p-12">
        {activeTab === 'store' && renderStoreSettings()}
        {activeTab === 'invoice' && renderInvoiceSettings()}
        {activeTab === 'appearance' && renderAppearanceSettings()}
      </div>
    </div>
  );
};

export default Settings;
