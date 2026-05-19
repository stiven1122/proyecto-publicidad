import { useEffect, useState } from 'react';
import { Plus, Search, Calendar, Eye, Edit2, Trash2, Send, ClipboardList, CheckCircle2, XCircle, Clock, Package, DollarSign, TrendingDown } from 'lucide-react';
import { CampanasAPI, CotizacionesAPI, CampanaProductosAPI, ProductosAPI, ClientesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Modal, ConfirmModal } from '../../components/Modal';

const statusColors = {
  activa: 'bg-green-100 text-green-700',
  pausada: 'bg-yellow-100 text-yellow-700',
  finalizada: 'bg-gray-100 text-gray-600',
};

const quoteStatusColors = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  aprobada: 'bg-green-100 text-green-700',
  rechazada: 'bg-red-100 text-red-700',
};

const quoteStatusIcons = {
  pendiente: Clock,
  aprobada: CheckCircle2,
  rechazada: XCircle,
};

export default function Campaigns() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [campanas, setCampanas] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', objetivos: '', estado: 'activa', fechaInicio: '', fechaFin: '', clienteId: '', productoId: '', presupuesto: '' });
  const [quoteForm, setQuoteForm] = useState({ nombre: '', descripcion: '' });
  const [editingId, setEditingId] = useState(null);
  const [viewCampana, setViewCampana] = useState(null);
  const [deleteCampana, setDeleteCampana] = useState(null);

  // Presupuesto / Productos asignados
  const [campanaProductos, setCampanaProductos] = useState([]);
  const [presupuestoInfo, setPresupuestoInfo] = useState({ total: 0, gastado: 0, restante: 0 });
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [assignForm, setAssignForm] = useState({ productoId: '', cantidad: 1 });
  const [loadingDetail, setLoadingDetail] = useState(false);

  const { isAdmin, isCliente } = useAuth();
  const { success, error } = useNotification();

  async function load() {
    setLoading(true);
    try {
      const estado = filter !== 'all' ? filter : undefined;
      const requests = [CampanasAPI.list(estado)];
      if (isCliente) requests.push(CotizacionesAPI.listCampanas());
      const [campRes, cotRes] = await Promise.all(requests);
      setCampanas(campRes.data || campRes);
      if (isCliente) setCotizaciones((cotRes.data || cotRes) || []);
    } catch (e) {
      console.error(e);
      error('Error al cargar las campañas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filter, isCliente]);
  useEffect(() => {
    if (showForm || editingId) loadClientes();
  }, [showForm, editingId]);

  const list = (campanas || []).filter((c) =>
    c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.cliente?.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', objetivos: '', estado: 'activa', fechaInicio: '', fechaFin: '', clienteId: '', productoId: '', presupuesto: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const resetQuoteForm = () => {
    setQuoteForm({ nombre: '', descripcion: '' });
    setShowQuoteForm(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await CampanasAPI.update(editingId, form);
        success(`Campaña "${form.nombre}" actualizada exitosamente`);
      } else {
        await CampanasAPI.create({ ...form, plataformas: [] });
        success(`Campaña "${form.nombre}" creada exitosamente`);
      }
      resetForm();
      load();
    } catch (err) {
      error(err.message || `Error al ${editingId ? 'actualizar' : 'crear'} la campaña`);
    }
  };

  const onSubmitQuote = async (e) => {
    e.preventDefault();
    try {
      await CotizacionesAPI.createCampana(quoteForm);
      success('Cotización de campaña enviada exitosamente');
      resetQuoteForm();
      load();
    } catch (err) {
      error(err.message || 'Error al enviar la cotización');
    }
  };

  const onDelete = async () => {
    if (!deleteCampana) return;
    try {
      await CampanasAPI.remove(deleteCampana.id);
      success(`Campaña "${deleteCampana.nombre}" eliminada exitosamente`);
      setDeleteCampana(null);
      load();
    } catch (err) {
      error(err.message || 'Error al eliminar la campaña');
    }
  };

  const openEdit = (campana) => {
    setForm({
      nombre: campana.nombre || '',
      descripcion: campana.descripcion || '',
      objetivos: campana.objetivos || '',
      estado: campana.estado || 'activa',
      fechaInicio: campana.fechaInicio ? campana.fechaInicio.slice(0, 10) : '',
      fechaFin: campana.fechaFin ? campana.fechaFin.slice(0, 10) : '',
      clienteId: campana.clienteId || '',
      productoId: campana.productoId || '',
      presupuesto: campana.presupuesto || '',
    });
    setEditingId(campana.id);
    setShowForm(true);
  };

  const openView = async (campana) => {
    try {
      const response = await CampanasAPI.get(campana.id);
      setViewCampana(response.data || response);
      if (isAdmin) {
        loadCampanaProductos(campana.id);
      }
    } catch (err) {
      error('Error al cargar el detalle de la campaña');
    }
  };

  const loadClientes = async () => {
    if (!isAdmin) return;
    try {
      const res = await ClientesAPI.list();
      setClientes(res.data || res || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadCampanaProductos = async (campanaId) => {
    setLoadingDetail(true);
    try {
      const [prodRes, listRes] = await Promise.all([
        ProductosAPI.list(),
        CampanaProductosAPI.list(campanaId)
      ]);
      setProductosDisponibles(prodRes.data || prodRes || []);
      setCampanaProductos(listRes.data || listRes || []);
      setPresupuestoInfo(listRes.presupuesto || { total: 0, gastado: 0, restante: 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const onAssignProduct = async (e) => {
    e.preventDefault();
    if (!viewCampana) return;
    try {
      await CampanaProductosAPI.assign(viewCampana.id, assignForm);
      success('Producto asignado a la campaña exitosamente');
      setAssignForm({ productoId: '', cantidad: 1 });
      loadCampanaProductos(viewCampana.id);
      load();
    } catch (err) {
      error(err.message || 'Error al asignar producto');
    }
  };

  const onRemoveProduct = async (campanaProductoId) => {
    if (!viewCampana) return;
    try {
      await CampanaProductosAPI.remove(campanaProductoId);
      success('Producto eliminado de la campaña');
      loadCampanaProductos(viewCampana.id);
      load();
    } catch (err) {
      error(err.message || 'Error al eliminar producto');
    }
  };

  const adminFormContent = (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input required placeholder="Nombre de la campaña" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input required placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos</label>
          <input placeholder="Objetivos" value={form.objetivos} onChange={e => setForm({...form, objetivos: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto</label>
          <input type="number" min="0" step="0.01" placeholder="Presupuesto" value={form.presupuesto} onChange={e => setForm({...form, presupuesto: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm">
            <option value="activa">Activa</option>
            <option value="pausada">Pausada</option>
            <option value="finalizada">Finalizada</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
          <input type="date" value={form.fechaInicio} onChange={e => setForm({...form, fechaInicio: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
          <input type="date" value={form.fechaFin} onChange={e => setForm({...form, fechaFin: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
          <select required value={form.clienteId} onChange={e => setForm({...form, clienteId: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm bg-white">
            <option value="">Selecciona un cliente</option>
            {(clientes || []).map((c) => (
              <option key={c.id} value={c.id}>{c.nombre} ({c.email})</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
          {editingId ? 'Actualizar Campaña' : 'Crear Campaña'}
        </button>
        <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
      </div>
    </form>
  );

  const clientQuoteForm = (
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
        <button type="button" onClick={resetQuoteForm} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
      </div>
    </form>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isCliente ? 'Mis Campañas' : 'Campañas'}</h1>
          <p className="text-gray-500 mt-1">{isCliente ? 'Gestiona tus campañas publicitarias' : 'Gestiona todas las campañas del sistema'}</p>
        </div>
        {isAdmin && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
            <Plus className="w-4 h-4" />
            Nueva Campaña
          </button>
        )}
        {isCliente && (
          <button onClick={() => { resetQuoteForm(); setShowQuoteForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
            <Send className="w-4 h-4" />
            Cotizar Campaña
          </button>
        )}
      </div>

      {/* Modal Crear/Editar Admin */}
      <Modal open={showForm} onClose={resetForm} title={editingId ? 'Editar Campaña' : 'Nueva Campaña'} maxWidth="max-w-3xl">
        {adminFormContent}
      </Modal>

      {/* Modal Cotizar Cliente */}
      <Modal open={showQuoteForm} onClose={resetQuoteForm} title="Cotizar Campaña" maxWidth="max-w-lg">
        {clientQuoteForm}
      </Modal>

      {/* Modal Ver Detalle */}
      <Modal open={!!viewCampana} onClose={() => { setViewCampana(null); setCampanaProductos([]); }} title="Detalle de la Campaña" maxWidth="max-w-3xl">
        {viewCampana && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{viewCampana.nombre}</h2>
              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[viewCampana.estado] || 'bg-gray-100'}`}>{viewCampana.estado}</span>
            </div>
            <p className="text-gray-600">{viewCampana.descripcion}</p>
            {viewCampana.objetivos && <p className="text-sm text-gray-500"><strong>Objetivos:</strong> {viewCampana.objetivos}</p>}

            {/* Presupuesto */}
            {isAdmin && viewCampana.presupuesto && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-600 font-medium mb-1">Presupuesto Total</p>
                  <p className="text-2xl font-bold text-blue-700">${Number(viewCampana.presupuesto).toLocaleString()}</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-orange-600 font-medium mb-1">Gastado</p>
                  <p className="text-2xl font-bold text-orange-700">${presupuestoInfo.gastado.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-green-600 font-medium mb-1">Restante</p>
                  <p className="text-2xl font-bold text-green-700">${presupuestoInfo.restante.toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Fecha Inicio</p>
                <p className="font-medium">{viewCampana.fechaInicio?.slice(0,10) || 'No definida'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Fecha Fin</p>
                <p className="font-medium">{viewCampana.fechaFin?.slice(0,10) || 'No definida'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Cliente</p>
                <p className="font-medium">{viewCampana.cliente?.nombre || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Presupuesto</p>
                <p className="font-medium">${viewCampana.presupuesto ? Number(viewCampana.presupuesto).toLocaleString() : 'N/A'}</p>
              </div>
            </div>

            {/* Productos asignados - Admin */}
            {isAdmin && (
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Productos Asignados
                </h4>

                {/* Formulario asignar producto */}
                <form onSubmit={onAssignProduct} className="flex items-end gap-3 bg-gray-50 p-4 rounded-xl">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Producto</label>
                    <select required value={assignForm.productoId} onChange={e => setAssignForm({...assignForm, productoId: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                      <option value="">Selecciona un producto</option>
                      {(productosDisponibles || []).map(p => (
                        <option key={p.id} value={p.id}>{p.nombre} - ${p.precio}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
                    <input type="number" min="1" value={assignForm.cantidad} onChange={e => setAssignForm({...assignForm, cantidad: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">Asignar</button>
                </form>

                {/* Lista de productos asignados */}
                {loadingDetail ? (
                  <p className="text-gray-500 text-sm">Cargando productos...</p>
                ) : (
                  <div className="space-y-2">
                    {(campanaProductos || []).length === 0 && (
                      <p className="text-gray-400 text-sm">No hay productos asignados a esta campaña</p>
                    )}
                    {(campanaProductos || []).map((cp) => (
                      <div key={cp.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-lg">
                            <Package className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{cp.producto?.nombre}</p>
                            <p className="text-xs text-gray-500">${cp.precioUnitario} · Cantidad: {cp.cantidad}</p>
                          </div>
                        </div>
                        <button onClick={() => onRemoveProduct(cp.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar producto">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Métricas removidas - ahora en AnalyticsReports */}
          </div>
        )}
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <ConfirmModal
        open={!!deleteCampana}
        onClose={() => setDeleteCampana(null)}
        onConfirm={onDelete}
        title="¿Eliminar campaña?"
        message={`¿Estás seguro de que deseas eliminar la campaña "${deleteCampana?.nombre}"? Esta acción no se puede deshacer.`}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Buscar campañas..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <option value="all">Todos</option>
          <option value="activa">Activa</option>
          <option value="pausada">Pausada</option>
          <option value="finalizada">Finalizada</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Campaña</th>
                {isAdmin && <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Cliente</th>}
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Inicio</th>
                {isAdmin && <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Presupuesto</th>}
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">{c.nombre}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />{c.fechaInicio?.slice(0,10)}</p>
                  </td>
                  {isAdmin && <td className="px-5 py-4 text-sm text-gray-600">{c.cliente?.nombre || '-'}</td>}
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[c.estado] || 'bg-gray-100'}`}>{c.estado}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{c.fechaInicio?.slice(0,10)}</td>
                  {isAdmin && (
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {c.presupuesto ? `$${Number(c.presupuesto).toLocaleString()}` : 'N/A'}
                    </td>
                  )}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openView(c)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver detalle">
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button onClick={() => openEdit(c)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Editar">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteCampana(c)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="text-center text-gray-400 py-8">No hay campañas registradas</p>}
        </div>
      )}

      {/* Tabla de cotizaciones del cliente */}
      {isCliente && (
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
                {(cotizaciones || []).map((c) => {
                  const StatusIcon = quoteStatusIcons[c.estado] || Clock;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{c.nombre}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">{c.descripcion || '-'}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{c.fechaSolicitud?.slice(0,10)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${quoteStatusColors[c.estado] || 'bg-gray-100'}`}>
                          <StatusIcon className="w-3 h-3" />
                          {c.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(cotizaciones || []).length === 0 && (
              <p className="text-gray-400 text-center py-8">No tienes cotizaciones de campaña</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
