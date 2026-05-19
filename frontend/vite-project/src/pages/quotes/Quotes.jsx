import { useEffect, useState } from 'react';
import { FileText, CheckCircle, XCircle, Megaphone, Package, Calendar, User, Loader2 } from 'lucide-react';
import { CotizacionesAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Modal, ConfirmModal } from '../../components/Modal';

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  aprobada: 'bg-green-100 text-green-700',
  rechazada: 'bg-red-100 text-red-700',
};

export default function Quotes() {
  const [activeTab, setActiveTab] = useState('campanas');
  const [cotizacionesCampana, setCotizacionesCampana] = useState([]);
  const [cotizacionesProducto, setCotizacionesProducto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionItem, setActionItem] = useState(null);
  const [actionType, setActionType] = useState(null); // 'aprobar' | 'rechazar'
  const { success, error } = useNotification();

  async function load() {
    setLoading(true);
    try {
      const [campanas, productos] = await Promise.all([
        CotizacionesAPI.listCampanas(),
        CotizacionesAPI.listProductos()
      ]);
      setCotizacionesCampana(campanas.data || campanas || []);
      setCotizacionesProducto(productos.data || productos || []);
    } catch (e) {
      console.error(e);
      error('Error al cargar cotizaciones');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const handleAction = async () => {
    if (!actionItem || !actionType) return;
    try {
      const estado = actionType === 'aprobar' ? 'aprobada' : 'rechazada';
      if (activeTab === 'campanas') {
        await CotizacionesAPI.updateCampanaStatus(actionItem.id, estado);
      } else {
        await CotizacionesAPI.updateProductoStatus(actionItem.id, estado);
      }
      success(`Cotización ${estado === 'aprobada' ? 'aprobada' : 'rechazada'} exitosamente`);
      setActionItem(null);
      setActionType(null);
      load();
    } catch (err) {
      error(err.message || 'Error al actualizar cotización');
    }
  };

  const tabs = [
    { id: 'campanas', label: 'Cotizaciones de Campaña', icon: Megaphone },
    { id: 'productos', label: 'Cotizaciones de Producto', icon: Package },
  ];

  const renderCampanas = () => (
    <div className="space-y-4">
      {(cotizacionesCampana || []).length === 0 && <p className="text-gray-400 text-center py-12">No hay cotizaciones de campaña</p>}
      {(cotizacionesCampana || []).map((c) => (
        <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{c.nombre}</h3>
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[c.estado] || 'bg-gray-100'}`}>{c.estado}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{c.descripcion || 'Sin descripción'}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{c.cliente?.nombre || 'N/A'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{c.fechaSolicitud?.slice(0,10)}</span>
              </div>
            </div>
            {c.estado === 'pendiente' && (
              <div className="flex gap-2 ml-4">
                <button onClick={() => { setActionItem(c); setActionType('aprobar'); }} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                  <CheckCircle className="w-4 h-4" />Aprobar
                </button>
                <button onClick={() => { setActionItem(c); setActionType('rechazar'); }} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                  <XCircle className="w-4 h-4" />Rechazar
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderProductos = () => (
    <div className="space-y-4">
      {(cotizacionesProducto || []).length === 0 && <p className="text-gray-400 text-center py-12">No hay cotizaciones de producto</p>}
      {(cotizacionesProducto || []).map((c) => (
        <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{c.producto?.nombre || 'Producto'}</h3>
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[c.estado] || 'bg-gray-100'}`}>{c.estado}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Precio: ${c.producto?.precio} · {c.producto?.categoria}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{c.cliente?.nombre || 'N/A'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{c.fechaSolicitud?.slice(0,10)}</span>
              </div>
            </div>
            {c.estado === 'pendiente' && (
              <div className="flex gap-2 ml-4">
                <button onClick={() => { setActionItem(c); setActionType('aprobar'); }} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                  <CheckCircle className="w-4 h-4" />Aprobar
                </button>
                <button onClick={() => { setActionItem(c); setActionType('rechazar'); }} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                  <XCircle className="w-4 h-4" />Rechazar
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Cotizaciones</h1>
        <p className="text-gray-500 mt-1">Gestiona las solicitudes de campañas y productos</p>
      </div>

      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        activeTab === 'campanas' ? renderCampanas() : renderProductos()
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!actionItem}
        onClose={() => { setActionItem(null); setActionType(null); }}
        onConfirm={handleAction}
        title={actionType === 'aprobar' ? '¿Aprobar cotización?' : '¿Rechazar cotización?'}
        message={`¿Estás seguro de que deseas ${actionType === 'aprobar' ? 'aprobar' : 'rechazar'} esta cotización? ${actionType === 'aprobar' && activeTab === 'campanas' ? 'Se creará automáticamente una campaña.' : ''}`}
      />
    </div>
  );
}
