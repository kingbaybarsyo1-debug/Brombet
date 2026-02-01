
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface UsersProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const Users: React.FC<UsersProps> = ({ users, setUsers }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({ name: '', role: 'cashier' });

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name || 'مستخدم جديد',
      role: formData.role as 'admin' | 'cashier'
    };
    setUsers([...users, newUser]);
    setShowAdd(false);
    setFormData({ name: '', role: 'cashier' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">إدارة المستخدمين</h2>
          <p className="text-slate-500">تحديد صلاحيات الموظفين والوصول للنظام.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="px-6 py-2.5 bg-blue-700 text-white rounded-xl font-bold text-sm"
        >
          إضافة مستخدم
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-2xl border-2 border-blue-100">
          <form onSubmit={addUser} className="flex flex-col md:flex-row gap-4">
            <input 
              required
              placeholder="اسم المستخدم"
              className="flex-1 px-4 py-2 bg-slate-50 rounded-lg"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <select 
              className="px-4 py-2 bg-slate-50 rounded-lg"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value as 'admin' | 'cashier' })}
            >
              <option value="admin">مدير نظام</option>
              <option value="cashier">كاشير</option>
            </select>
            <button type="submit" className="bg-blue-700 text-white px-8 py-2 rounded-lg font-bold">إضافة</button>
            <button type="button" onClick={() => setShowAdd(false)} className="text-slate-400">إلغاء</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {u.name[0]}
            </div>
            <div>
              <p className="font-bold">{u.name}</p>
              <p className="text-xs text-slate-400">{u.role === 'admin' ? 'مدير نظام' : 'كاشير مبيعات'}</p>
            </div>
            <button 
              onClick={() => setUsers(prev => prev.filter(x => x.id !== u.id))}
              className="mr-auto text-slate-300 hover:text-red-500"
            >
              <Icons.Trash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
