import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Megaphone, Package, Calendar, User, Loader2, DollarSign, Send, Clock } from 'lucide-react';
import { CotizacionesAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Modal, ConfirmModal } from '../../components/Modal';

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  cotizada: 'bg-blue-100 text-blue-700',
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
  const [cotizarItem, setCotizarItem] = useState(null);
  const [cotizarForm, setCotizarForm] = useState({
    presupuesto: '',
    fechaInicio: '',
    fechaFin: '',
    respuesta: '',
    objetivos: ''
  });
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

  const handleCotizar = async (e) => {
    e.preventDefault();
    if (!cotizarItem) return;
    try {
      await CotizacionesAPI.cotizarCampana(cotizarItem.id, {
        presupuesto: Number(cotizarForm.presupuesto),
        fechaInicio: cotizarForm.fechaInicio,
        fechaFin: cotizarForm.fechaFin,
        respuesta: cotizarForm.respuesta,
        objetivos: cotizarForm.objetivos,
      });
      success('Cotización enviada al cliente exitosamente');
      setCotizarItem(null);
      setCotizarForm({ presupuesto: '', fechaInicio: '', fechaFin: '', respuesta: '', objetivos: '' });
      load();
    } catch (err) {
      error(err.message || 'Error al enviar la cotización');
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
              {c.estado === 'cotizada' && (
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />Presupuesto: ${Number(c.presupuesto).toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{c.fechaInicio?.slice(0,10)} - {c.fechaFin?.slice(0,10)}</span>
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{c.cliente?.nombre || 'N/A'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{c.fechaSolicitud?.slice(0,10)}</span>
              </div>
            </div>
            {c.estado === 'pendiente' && (
              <div className="flex gap-2 ml-4">
                <button onClick={() => { setCotizarItem(c); }} className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                  <Send className="w-4 h-4" />Cotizar
                </button>
              </div>
            )}
            {c.estado === 'cotizada' && (
              <div className="ml-4">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                  <Clock className="w-3.5 h-3.5" />Esperando respuesta del cliente
                </span>
              </div>
            )}
            {(c.estado === 'aprobada' || c.estado === 'rechazada') && (
              <div className="ml-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg ${c.estado === 'aprobada' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {c.estado === 'aprobada' ? 'Aprobada por el cliente — Campaña creada' : 'Rechazada por el cliente'}
                </span>
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

      {/* Cotizar Modal */}
      <Modal open={!!cotizarItem} onClose={() => { setCotizarItem(null); setCotizarForm({ presupuesto: '', fechaInicio: '', fechaFin: '', respuesta: '', objetivos: '' }); }} title="Enviar Cotización al Cliente" maxWidth="max-w-lg">
        <form onSubmit={handleCotizar} className="space-y-4">
          <p className="text-sm text-gray-600">Completa los detalles de la cotización para <strong>{cotizarItem?.nombre}</strong>.</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto ($) <span className="text-red-500">*</span></label>
            <input type="number" required min="1" placeholder="Ej: 1.500.000" value={cotizarForm.presupuesto} onChange={(e) => setCotizarForm({...cotizarForm, presupuesto: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio <span className="text-red-500">*</span></label>
              <input type="date" required value={cotizarForm.fechaInicio} onChange={(e) => setCotizarForm({...cotizarForm, fechaInicio: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin <span className="text-red-500">*</span></label>
              <input type="date" required value={cotizarForm.fechaFin} onChange={(e) => setCotizarForm({...cotizarForm, fechaFin: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la cotización <span className="text-red-500">*</span></label>
            <textarea rows={3} required placeholder="Explica al cliente los detalles de la propuesta, alcance, entregables, etc." value={cotizarForm.respuesta} onChange={(e) => setCotizarForm({...cotizarForm, respuesta: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos de la campaña</label>
            <textarea rows={2} placeholder="Ej: Aumentar reconocimiento de marca, generar leads, impulsar ventas..." value={cotizarForm.objetivos} onChange={(e) => setCotizarForm({...cotizarForm, objetivos: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm resize-none" />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Enviar Cotización</button>
            <button type="button" onClick={() => { setCotizarItem(null); setCotizarForm({ presupuesto: '', fechaInicio: '', fechaFin: '', respuesta: '', objetivos: '' }); }} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
          </div>
        </form>
      </Modal>

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
