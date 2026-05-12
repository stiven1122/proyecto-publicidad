import { useState } from 'react';
import { Plus, Search, Shield, UserCheck, UserX, Edit2, Trash2 } from 'lucide-react';

const users = [
  { id: 1, name: 'Juan Doe', email: 'juan@admanager.com', role: 'Administrador', status: 'active', avatar: 'JD' },
  { id: 2, name: 'María García', email: 'maria@admanager.com', role: 'Gerente', status: 'active', avatar: 'MG' },
  { id: 3, name: 'Carlos López', email: 'carlos@admanager.com', role: 'Diseñador', status: 'active', avatar: 'CL' },
  { id: 4, name: 'Ana Martínez', email: 'ana@admanager.com', role: 'Analista', status: 'inactive', avatar: 'AM' },
  { id: 5, name: 'Roberto Sánchez', email: 'roberto@admanager.com', role: 'Gerente', status: 'active', avatar: 'RS' },
  { id: 6, name: 'Laura Torres', email: 'laura@admanager.com', role: 'Editor', status: 'active', avatar: 'LT' },
];

const roleColors = {
  Administrador: 'bg-purple-100 text-purple-700',
  Gerente: 'bg-blue-100 text-blue-700',
  Diseñador: 'bg-pink-100 text-pink-700',
  Analista: 'bg-green-100 text-green-700',
  Editor: 'bg-orange-100 text-orange-700',
};

export default function Users() {
  const [search, setSearch] = useState('');
  const list = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const active = users.filter((u) => u.status === 'active').length;
  const inactive = users.filter((u) => u.status === 'inactive').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 mt-1">Gestiona los usuarios del sistema</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          Agregar Usuario
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl"><Shield className="w-6 h-6 text-indigo-600" /></div>
          <div><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold text-gray-900">{users.length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl"><UserCheck className="w-6 h-6 text-green-600" /></div>
          <div><p className="text-sm text-gray-500">Activos</p><p className="text-2xl font-bold text-gray-900">{active}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-xl"><UserX className="w-6 h-6 text-gray-500" /></div>
          <div><p className="text-sm text-gray-500">Inactivos</p><p className="text-2xl font-bold text-gray-900">{inactive}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Buscar usuarios..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Usuario</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rol</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">{u.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${roleColors[u.role]}`}>{u.role}</span></td>
                <td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}><span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />{u.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
