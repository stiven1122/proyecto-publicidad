import { useState } from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const revenue = [
  { month: 'Ene', value: 28000 },
  { month: 'Feb', value: 35000 },
  { month: 'Mar', value: 32000 },
  { month: 'Abr', value: 41000 },
  { month: 'May', value: 45890 },
];

const products = [
  { name: 'Folletos', value: 35, color: '#6366f1' },
  { name: 'Calcomanías', value: 25, color: '#8b5cf6' },
  { name: 'Bingos', value: 20, color: '#ec4899' },
  { name: 'Pendones', value: 20, color: '#f59e0b' },
];

export default function Analytics() {
  const [range, setRange] = useState('6m');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analítica</h1>
          <p className="text-gray-500 mt-1">Análisis detallado del rendimiento</p>
        </div>
        <div className="flex gap-3">
          <select value={range} onChange={(e) => setRange(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option value="7d">7 días</option>
            <option value="30d">30 días</option>
            <option value="6m">6 meses</option>
            <option value="1y">1 año</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Ingresos</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Ventas por Producto</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={products} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {products.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {products.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} /><span className="text-sm text-gray-600">{p.name}</span></div>
                <span className="text-sm font-semibold text-gray-900">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
