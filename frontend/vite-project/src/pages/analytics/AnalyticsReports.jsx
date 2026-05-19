import { useEffect, useState } from 'react';
import { Download, FileText, Calendar, DollarSign, Flag, CheckCircle2, TrendingUp, BarChart3, Users, Package, Wallet, TrendingDown, PiggyBank } from 'lucide-react';
import { ReportesAPI, PanelAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsReports() {
  const [reportes, setReportes] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({ productos: [], clientes: [] });
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ campanaId: '', tipoReporte: 'campaña', urlArchivo: '' });
  const [activeTab, setActiveTab] = useState('ingresos');
  const { user, isAdmin } = useAuth();
  const { success, error } = useNotification();

  async function load() {
    setLoading(true);
    try {
      const [r, s] = await Promise.all([
        ReportesAPI.list(),
        PanelAPI.stats()
      ]);
      setReportes(r.data || r);
      setStats(s.data || s);
    } catch (e) {
      console.error(e);
      error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }

  async function loadCharts() {
    setChartLoading(true);
    try {
      const [prod, cli] = await Promise.all([
        PanelAPI.graficasProductos(),
        PanelAPI.graficasClientes()
      ]);
      setChartData({
        productos: prod.data || prod || [],
        clientes: cli.data || cli || []
      });
    } catch (e) {
      console.error(e);
      error('Error al cargar gráficas');
    } finally {
      setChartLoading(false);
    }
  }

  useEffect(() => { load(); loadCharts(); }, []);

  const totales = stats || {};
  const campanasStats = totales.campanas || {};
  const presupuesto = totales.presupuesto || { total: 0, gastado: 0, restante: 0 };

  const resumenCards = [
    {
      label: 'Campañas Totales',
      value: totales.totales?.campanas ?? 0,
      icon: Flag,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      label: 'Inversión Total',
      value: `$${(totales.inversion ?? 0).toLocaleString()}`,
      icon: DollarSign,
      bg: 'bg-green-50',
      text: 'text-green-600',
    },
    {
      label: 'Campañas Activas',
      value: campanasStats.activas ?? 0,
      icon: TrendingUp,
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
    },
    {
      label: 'Campañas Finalizadas',
      value: campanasStats.finalizadas ?? 0,
      icon: CheckCircle2,
      bg: 'bg-purple-50',
      text: 'text-purple-600',
    },
  ];

  const presupuestoCards = [
    {
      label: 'Presupuesto Total',
      value: `$${(presupuesto.total ?? 0).toLocaleString()}`,
      icon: Wallet,
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100',
    },
    {
      label: 'Gastado en Productos',
      value: `$${(presupuesto.gastado ?? 0).toLocaleString()}`,
      icon: TrendingDown,
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-100',
    },
    {
      label: 'Presupuesto Restante',
      value: `$${(presupuesto.restante ?? 0).toLocaleString()}`,
      icon: PiggyBank,
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-100',
    },
  ];

  const onGenerate = async (e) => {
    e.preventDefault();
    try {
      await ReportesAPI.generate({ ...form, generadoPor: user.id });
      success(`Reporte de tipo "${form.tipoReporte}" generado exitosamente`);
      setShowForm(false);
      setForm({ campanaId: '', tipoReporte: 'campaña', urlArchivo: '' });
      load();
    } catch (err) {
      error(err.message || 'Error al generar el reporte');
    }
  };

  const adminTabs = [
    { id: 'ingresos', label: 'Ingresos', icon: DollarSign },
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'clientes', label: 'Clientes', icon: Users },
  ];

  const clientTabs = [
    { id: 'ingresos', label: 'Ingresos', icon: DollarSign },
    { id: 'productos', label: 'Productos', icon: Package },
  ];

  const tabs = isAdmin ? adminTabs : clientTabs;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900 text-sm mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('$') || entry.dataKey === 'inversion'
                ? `$${Number(entry.value).toLocaleString()}`
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderIngresosTab = () => {
    const totalInversion = Number(totales.inversion || 0);
    const totalCampanas = totales.totales?.campanas || 0;
    const promedioInversion = totalCampanas > 0 ? totalInversion / totalCampanas : 0;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">Inversión Total</p>
            <p className="text-2xl font-bold text-gray-900">${totalInversion.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">Campañas Activas</p>
            <p className="text-2xl font-bold text-gray-900">{campanasStats.activas || 0}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">Inversión Promedio por Campaña</p>
            <p className="text-2xl font-bold text-gray-900">${Math.round(promedioInversion).toLocaleString()}</p>
          </div>
        </div>

        {/* Presupuesto cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presupuestoCards.map((card, i) => (
            <div key={i} className={`bg-white border ${card.border} rounded-xl p-5 text-center`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.text}`} />
                </div>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>

        {chartData.productos.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Distribución de Inversión por Producto</h3>
            <p className="text-sm text-gray-500 mb-6">Inversión total asignada a cada tipo de producto</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData.productos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="inversion" name="Inversión ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  const renderProductosTab = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Rendimiento por Producto</h3>
      <p className="text-sm text-gray-500 mb-6">Campañas e inversión generados por cada tipo de producto</p>
      {chartLoading ? (
        <p className="text-gray-500 text-center py-12">Cargando gráfica...</p>
      ) : chartData.productos.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No hay datos de productos con campañas</p>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chartData.productos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="campanas" name="Campañas" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="inversion" name="Inversión ($)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  const renderClientesTab = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Rendimiento por Cliente</h3>
      <p className="text-sm text-gray-500 mb-6">Campañas e inversión generados por cada cliente</p>
      {chartLoading ? (
        <p className="text-gray-500 text-center py-12">Cargando gráfica...</p>
      ) : chartData.clientes.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No hay datos de clientes con campañas</p>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chartData.clientes} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="campanas" name="Campañas" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="inversion" name="Inversión ($)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Analítica y Reportes</h1>
        <p className="text-gray-500">Resumen de campañas e inversión</p>
      </div>

      {/* KPIs - Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resumenCards.map((card, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-lg ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.text}`} />
              </div>
              <span className="text-sm text-gray-500">{card.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Gráficas con Tabs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">Gráficas de Rendimiento</h2>
        </div>

        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'ingresos' && renderIngresosTab()}
          {activeTab === 'productos' && renderProductosTab()}
          {activeTab === 'clientes' && renderClientesTab()}
        </div>
      </div>

      {/* Reportes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Reportes Generados</h2>
          </div>
          {isAdmin && (
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
              <TrendingUp className="w-4 h-4" />
              Generar Reporte
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={onGenerate} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 mb-4">
            <h3 className="text-lg font-bold">Nuevo Reporte</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input required type="number" placeholder="ID Campaña" value={form.campanaId} onChange={e => setForm({...form, campanaId: e.target.value})} className="px-4 py-2 border rounded-lg text-sm" />
              <select value={form.tipoReporte} onChange={e => setForm({...form, tipoReporte: e.target.value})} className="px-4 py-2 border rounded-lg text-sm">
                <option value="campaña">Campaña</option>
                <option value="financiero">Financiero</option>
                <option value="clientes">Clientes</option>
                <option value="productos">Productos</option>
              </select>
              <input placeholder="URL Archivo (opcional)" value={form.urlArchivo} onChange={e => setForm({...form, urlArchivo: e.target.value})} className="px-4 py-2 border rounded-lg text-sm" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Generar</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(reportes || []).map((r) => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">{r.tipoReporte}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900">Reporte Campaña #{r.campanaId}</h3>
              <p className="text-xs text-gray-500 mb-3 flex items-center gap-1"><Calendar className="w-3 h-3" />{r.fechaGeneracion?.slice(0,10)}</p>
              <div className="flex gap-2">
                {r.urlArchivo && <a href={r.urlArchivo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"><Download className="w-3 h-3" />Descargar</a>}
              </div>
            </div>
          ))}
          {(reportes || []).length === 0 && <p className="text-gray-400 text-center py-8 col-span-2">No hay reportes generados</p>}
        </div>
      </div>
    </div>
  );
}
