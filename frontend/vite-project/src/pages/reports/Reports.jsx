import { useState } from 'react';
import { Download, FileText, Calendar, Plus } from 'lucide-react';

const reports = [
  { id: 1, name: 'Reporte Mensual - Mayo 2026', type: 'Mensual', date: '2026-05-01', size: '2.4 MB' },
  { id: 2, name: 'Rendimiento por Campaña Q2', type: 'Campaña', date: '2026-04-28', size: '1.8 MB' },
  { id: 3, name: 'Análisis de Productos', type: 'Productos', date: '2026-04-25', size: '1.2 MB' },
  { id: 4, name: 'Estado de Cuentas', type: 'Financiero', date: '2026-04-20', size: '956 KB' },
  { id: 5, name: 'Resumen Ejecutivo Mayo', type: 'Ejecutivo', date: '2026-04-15', size: '3.1 MB' },
];

const colors = {
  Mensual: 'bg-blue-100 text-blue-700',
  Campaña: 'bg-purple-100 text-purple-700',
  Productos: 'bg-green-100 text-green-700',
  Financiero: 'bg-orange-100 text-orange-700',
  Ejecutivo: 'bg-indigo-100 text-indigo-700',
};

export default function Reports() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-500 mt-1">Genera y descarga reportes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          Generar Reporte
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <option value="all">Todos los tipos</option>
          <option value="Mensual">Mensual</option>
          <option value="Campaña">Campaña</option>
          <option value="Productos">Productos</option>
          <option value="Financiero">Financiero</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reporte</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg"><FileText className="w-5 h-5 text-gray-500" /></div>
                    <span className="text-sm font-medium text-gray-900">{r.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${colors[r.type]}`}>{r.type}</span></td>
                <td className="px-5 py-4"><div className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="w-4 h-4" />{r.date}</div></td>
                <td className="px-5 py-4 text-right">
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Descargar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
