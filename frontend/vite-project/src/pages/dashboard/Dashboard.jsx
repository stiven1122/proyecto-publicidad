import { useEffect, useState } from 'react';
import {
  ShoppingCart, Users, TrendingUp, DollarSign, Plus, ArrowRight, Send, ClipboardList,
  CheckCircle2, XCircle, Clock, Loader2, DollarSign as DollarIcon,
  Flag, CheckCircle, BarChart3, Package, Wallet, TrendingDown, PiggyBank
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PanelAPI, ProductosAPI, CotizacionesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Modal, ConfirmModal } from '../../components/Modal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  cotizada: 'bg-blue-100 text-blue-700',
  aprobada: 'bg-green-100 text-green-700',
  rechazada: 'bg-red-100 text-red-700',
};

const statusIcons = {
  pendiente: Clock,
  cotizada: DollarIcon,
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
  const [actionItem, setActionItem] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [chartData, setChartData] = useState({ productos: [], clientes: [] });
  const [chartLoading, setChartLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingresos');
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
    load();
    if (isAdmin) loadCharts();
  }, [isCliente, isAdmin]);

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

  const handleAction = async () => {
    if (!actionItem || !actionType) return;
    try {
      const estado = actionType === 'aprobar' ? 'aprobada' : 'rechazada';
      await CotizacionesAPI.updateCampanaStatus(actionItem.id, estado);
      success(`Cotización ${estado === 'aprobada' ? 'aceptada' : 'rechazada'} exitosamente`);
      setActionItem(null);
      setActionType(null);
      const res = await CotizacionesAPI.listCampanas();
      setCotizacionesCampana(res.data || res || []);
    } catch (err) {
      error(err.message || 'Error al actualizar cotización');
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-4">
            {(cotizacionesCampana || []).length === 0 && (
              <p className="text-gray-400 text-center py-8 bg-white border border-gray-200 rounded-xl">No tienes cotizaciones de campaña</p>
            )}

            {(cotizacionesCampana || []).map((c) => {
              const StatusIcon = statusIcons[c.estado] || Clock;
              return (
                <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{c.nombre}</h3>
                      <p className="text-sm text-gray-500 mt-1">Solicitada el {c.fechaSolicitud?.slice(0,10)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${statusColors[c.estado] || 'bg-gray-100'}`}>
                      <StatusIcon className="w-4 h-4" />
                      {c.estado === 'pendiente' ? 'Pendiente' : c.estado === 'cotizada' ? 'Cotización recibida' : c.estado === 'aprobada' ? 'Aceptada' : 'Rechazada'}
                    </span>
                  </div>

                  {/* Solicitud original */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Tu solicitud</p>
                    <p className="text-sm text-gray-700">{c.descripcion || 'Sin descripción'}</p>
                  </div>

                  {/* Cotización del admin */}
                  {c.estado === 'cotizada' && (
                    <div className="border border-indigo-100 bg-indigo-50/40 rounded-xl p-5 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                          <DollarIcon className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900">Cotización recibida</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3 border border-indigo-100">
                          <p className="text-xs text-gray-500 mb-1">Presupuesto</p>
                          <p className="text-lg font-bold text-gray-900">${c.presupuesto ? Number(c.presupuesto).toLocaleString() : 'No definido'}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-indigo-100">
                          <p className="text-xs text-gray-500 mb-1">Fecha inicio</p>
                          <p className="text-base font-semibold text-gray-900">{c.fechaInicio ? c.fechaInicio.slice(0,10) : '-'}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-indigo-100">
                          <p className="text-xs text-gray-500 mb-1">Fecha fin</p>
                          <p className="text-base font-semibold text-gray-900">{c.fechaFin ? c.fechaFin.slice(0,10) : '-'}</p>
                        </div>
                      </div>

                      {c.respuesta && (
                        <div className="bg-white rounded-lg p-4 border border-indigo-100 mb-3">
                          <p className="text-xs font-semibold text-indigo-700 uppercase mb-2">Respuesta del administrador</p>
                          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">{c.respuesta}</p>
                        </div>
                      )}

                      {c.objetivos && (
                        <div className="bg-white rounded-lg p-4 border border-indigo-100">
                          <p className="text-xs font-semibold text-indigo-700 uppercase mb-2">Objetivos propuestos</p>
                          <p className="text-sm text-gray-700">{c.objetivos}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex items-center justify-between pt-2">
                    {c.estado === 'cotizada' && (
                      <div className="flex gap-3">
                        <button onClick={() => { setActionItem(c); setActionType('aprobar'); }} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                          <CheckCircle2 className="w-4 h-4" />Aceptar cotización
                        </button>
                        <button onClick={() => { setActionItem(c); setActionType('rechazar'); }} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                          <XCircle className="w-4 h-4" />Rechazar
                        </button>
                      </div>
                    )}
                    {c.estado === 'pendiente' && (
                      <span className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-lg">
                        <Clock className="w-4 h-4" /> Esperando respuesta del administrador...
                      </span>
                    )}
                    {(c.estado === 'aprobada' || c.estado === 'rechazada') && (
                      <span className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg ${c.estado === 'aprobada' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {c.estado === 'aprobada' ? <><CheckCircle2 className="w-4 h-4" /> Campaña creada exitosamente</> : <><XCircle className="w-4 h-4" /> Cotización rechazada</>}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
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

        {/* Confirm Modal para aceptar/rechazar cotización */}
        <ConfirmModal
          open={!!actionItem}
          onClose={() => { setActionItem(null); setActionType(null); }}
          onConfirm={handleAction}
          title={actionType === 'aprobar' ? '¿Aceptar cotización?' : '¿Rechazar cotización?'}
          message={actionType === 'aprobar' ? 'Al aceptar esta cotización, se creará automáticamente una campaña en el sistema.' : '¿Estás seguro de que deseas rechazar esta cotización?'}
          confirmText={actionType === 'aprobar' ? 'Aceptar' : 'Rechazar'}
          confirmColor={actionType === 'aprobar' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
        />
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
