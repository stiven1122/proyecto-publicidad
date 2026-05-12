import { useState } from 'react';
import { Plus, Search, ShoppingCart, Calendar, DollarSign, Eye, Edit2, Trash2 } from 'lucide-react';

const campaigns = [
  { id: 1, name: 'Campaña Verano 2026', client: 'Tienda ABC', status: 'Activa', product: 'Folletos', budget: 15000, spent: 8750, startDate: '2026-05-01' },
  { id: 2, name: 'Lanzamiento Tech', client: 'TechCorp', status: 'Activa', product: 'Calcomanías', budget: 12000, spent: 7200, startDate: '2026-04-15' },
  { id: 3, name: 'Liquidación', client: 'Fashion Store', status: 'Pausada', product: 'Pendones', budget: 8000, spent: 5600, startDate: '2026-03-20' },
  { id: 4, name: 'Festival Ofertas', client: 'SuperMart', status: 'Activa', product: 'Bingos', budget: 10000, spent: 4200, startDate: '2026-05-05' },
  { id: 5, name: 'San Valentín', client: 'FlowerShop', status: 'Finalizada', product: 'Folletos', budget: 5000, spent: 5000, startDate: '2026-02-01' },
];

const statusColors = {
  Activa: 'bg-green-100 text-green-700',
  Pausada: 'bg-yellow-100 text-yellow-700',
  Finalizada: 'bg-gray-100 text-gray-600',
};

export default function Campaigns() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const list = campaigns.filter((c) => {
    const m = c.name.toLowerCase().includes(search.toLowerCase()) || c.client.toLowerCase().includes(search.toLowerCase());
    const f = filter === 'all' || c.status === filter;
    return m && f;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campañas</h1>
          <p className="text-gray-500 mt-1">Gestiona tus campañas publicitarias</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          Nueva Campaña
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Buscar campañas..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <option value="all">Todos</option>
          <option value="Activa">Activa</option>
          <option value="Pausada">Pausada</option>
          <option value="Finalizada">Finalizada</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Campaña</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Cliente</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Presupuesto</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />{c.startDate}</p>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{c.client}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600"><DollarSign className="w-4 h-4" />${c.budget.toLocaleString()}</div>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(c.spent / c.budget) * 100}%` }} /></div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
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
