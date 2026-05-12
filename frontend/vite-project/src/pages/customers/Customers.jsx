import { useState } from 'react';
import { Plus, Search, Mail, Phone, Building, MapPin, ShoppingCart, Edit2, Trash2 } from 'lucide-react';

const customers = [
  { id: 1, name: 'Juan Pérez', company: 'Tienda ABC', email: 'juan@tiendaabc.com', phone: '+51 987 654 321', address: 'Av. Lima 1234', campaigns: 5, spent: 45000, status: 'active' },
  { id: 2, name: 'María García', company: 'TechCorp', email: 'maria@techcorp.com', phone: '+51 912 345 678', address: 'Calle Arequipa 567', campaigns: 3, spent: 28000, status: 'active' },
  { id: 3, name: 'Carlos López', company: 'Fashion Store', email: 'carlos@fashion.com', phone: '+51 956 789 123', address: 'Av. Brasil 890', campaigns: 2, spent: 15000, status: 'active' },
  { id: 4, name: 'Ana Martínez', company: 'SuperMart', email: 'ana@supermart.com', phone: '+51 923 456 789', address: 'Calle Cusco 234', campaigns: 4, spent: 38000, status: 'inactive' },
  { id: 5, name: 'Roberto Sánchez', company: 'FlowerShop', email: 'roberto@flowershop.com', phone: '+51 978 123 456', address: 'Av. Europa 678', campaigns: 1, spent: 5000, status: 'active' },
  { id: 6, name: 'Laura Torres', company: 'ElectroPlus', email: 'laura@electroplus.com', phone: '+51 945 678 901', address: 'Jr. Ayacucho 456', campaigns: 2, spent: 18000, status: 'active' },
];

export default function Customers() {
  const [search, setSearch] = useState('');

  const list = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">Administra la información de tus clientes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Buscar clientes..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">{c.name.split(' ').map((n) => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><Building className="w-3 h-3" />{c.company}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-4 h-4 text-gray-400" />{c.email}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4 text-gray-400" />{c.phone}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4 text-gray-400" />{c.address}</div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1"><ShoppingCart className="w-4 h-4 text-gray-400" /><span className="text-gray-500">{c.campaigns}</span></div>
                <span className="text-gray-300">|</span>
                <span className="font-medium text-gray-900">${c.spent.toLocaleString()}</span>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {c.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"><Edit2 className="w-4 h-4" />Editar</button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" />Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
