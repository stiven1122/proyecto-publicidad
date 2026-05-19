import { useEffect, useState } from 'react';
import { ShoppingCart, Users, TrendingUp, DollarSign, Plus, ArrowRight, Send, ClipboardList, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PanelAPI, ProductosAPI, CotizacionesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  aprobada: 'bg-green-100 text-green-700',
  rechazada: 'bg-red-100 text-red-700',
};

const statusIcons = {
  pendiente: Clock,
  aprobada: CheckCircle2,
  rechazada: XCircle,
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cotizacionesCampana, setCotizacionesCampana] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ nombre: '', descripcion: '' });
  const { isAdmin, isCliente } = useAuth();
  const { success, error } = useNotification();

  useEffect(() => {
    async function load() {
      try {
        const requests = [PanelAPI.stats(), ProductosAPI.list()];
        if (isCliente) requests.push(CotizacionesAPI.listCampanas());
        const [s, p, campanasRes] = await Promise.all(requests);
        setStats(s.data || s);
        setProductos(p.data || p);
        if (isCliente) setCotizacionesCampana((campanasRes.data || campanasRes) || []);
      } catch (e) {
        console.error(e);
        error('Error al cargar los datos del panel');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isCliente]);

  const baseMetrics = [
    { label: 'Campañas Activas', value: stats?.campanas?.activas ?? 0, icon: ShoppingCart, bg: 'bg-blue-50' },
    { label: 'Total Productos', value: stats?.totales?.productos ?? 0, icon: TrendingUp, bg: 'bg-purple-50' },
    { label: 'Inversión Total', value: `$${(stats?.inversion ?? 0).toLocaleString()}`, icon: DollarSign, bg: 'bg-orange-50' },
  ];

  const adminMetrics = [
    { label: 'Campañas Activas', value: stats?.campanas?.activas ?? 0, icon: ShoppingCart, bg: 'bg-blue-50' },
    { label: 'Total Clientes', value: stats?.totales?.clientes ?? 0, icon: Users, bg: 'bg-green-50' },
    { label: 'Total Productos', value: stats?.totales?.productos ?? 0, icon: TrendingUp, bg: 'bg-purple-50' },
    { label: 'Inversión Total', value: `$${(stats?.inversion ?? 0).toLocaleString()}`, icon: DollarSign, bg: 'bg-orange-50' },
  ];

  const metrics = isCliente ? baseMetrics : adminMetrics;

  const onSubmitQuote = async (e) => {
    e.preventDefault();
    try {
      await CotizacionesAPI.createCampana(quoteForm);
      success('Cotización de campaña enviada exitosamente');
      setShowQuoteForm(false);
      setQuoteForm({ nombre: '', descripcion: '' });
      const res = await CotizacionesAPI.listCampanas();
      setCotizacionesCampana(res.data || res || []);
    } catch (err) {
      error(err.message || 'Error al enviar cotización');
    }
  };

  if (isCliente) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a AdManager Pro</h1>
          <p className="text-gray-500">Gestiona tus campañas publicitarias de forma profesional</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{m.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{m.value}</p>
                </div>
                <div className={`p-3 rounded-full ${m.bg}`}>
                  <m.icon className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/campaigns" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Mis Campañas</h3>
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-sm text-gray-500 mb-4">Crea y gestiona tus campañas publicitarias</p>
            <span className="flex items-center gap-1 text-sm text-indigo-600 font-medium">
              Ver campañas <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <button onClick={() => setShowQuoteForm(true)} className="text-left bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Cotizar Campaña</h3>
              <Send className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-sm text-gray-500 mb-4">Solicita una cotización para una nueva campaña</p>
            <span className="flex items-center gap-1 text-sm text-indigo-600 font-medium">
              Cotizar ahora <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          <Link to="/analytics" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Mis Métricas</h3>
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-sm text-gray-500 mb-4">Visualiza el rendimiento de tus campañas</p>
            <span className="flex items-center gap-1 text-sm text-indigo-600 font-medium">
              Ver métricas <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* Modal Cotizar Campaña */}
        <Modal open={showQuoteForm} onClose={() => setShowQuoteForm(false)} title="Cotizar Campaña" maxWidth="max-w-lg">
          <form onSubmit={onSubmitQuote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la campaña</label>
              <input required placeholder="Ej: Campaña de verano" value={quoteForm.nombre} onChange={e => setQuoteForm({...quoteForm, nombre: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea required rows={3} placeholder="Describe lo que necesitas..." value={quoteForm.descripcion} onChange={e => setQuoteForm({...quoteForm, descripcion: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm resize-none" />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">Enviar Cotización</button>
              <button type="button" onClick={() => setShowQuoteForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
            </div>
          </form>
        </Modal>

        {/* Estado de Cotizaciones de Campaña */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Mis Cotizaciones de Campaña</h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Descripción</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(cotizacionesCampana || []).map((c) => {
                  const StatusIcon = statusIcons[c.estado] || Clock;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{c.nombre}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">{c.descripcion || '-'}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{c.fechaSolicitud?.slice(0,10)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[c.estado] || 'bg-gray-100'}`}>
                          <StatusIcon className="w-3 h-3" />
                          {c.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(cotizacionesCampana || []).length === 0 && (
              <p className="text-gray-400 text-center py-8">No tienes cotizaciones de campaña</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Productos Disponibles</h2>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Cargando productos...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(productos || []).slice(0, 3).map((p) => (
                <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900">{p.nombre}</h3>
                  <p className="text-sm text-gray-500 mb-3">{p.descripcion}</p>
                  <span className="text-xl font-bold text-gray-900">${p.precio}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-500">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{m.label}</p>
                <p className="text-2xl font-bold text-gray-900">{m.value}</p>
              </div>
              <div className={`p-3 rounded-full ${m.bg}`}>
                <m.icon className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Catálogo de Productos</h2>
        <Link to="/campaigns" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <ShoppingCart className="w-4 h-4" />
          Ver Todas las Campañas
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(productos || []).map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{p.nombre}</h3>
                <p className="text-sm text-gray-500 mb-4">{p.descripcion}</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-gray-900">${p.precio}</span>
                  <span className="text-sm text-gray-500">{p.categoria}</span>
                </div>
                <Link to={`/products`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
                  <Plus className="w-4 h-4" />
                  Ver Producto
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
