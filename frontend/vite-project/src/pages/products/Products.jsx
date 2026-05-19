import { useEffect, useState } from 'react';
import { Plus, Search, Package, Edit2, Trash2, Eye, Tag, Send, ClipboardList, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { ProductosAPI, CotizacionesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Modal, ConfirmModal } from '../../components/Modal';

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

export default function Products() {
  const [search, setSearch] = useState('');
  const [productos, setProductos] = useState([]);
  const [cotizacionesProducto, setCotizacionesProducto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', categoria: '' });
  const [editingId, setEditingId] = useState(null);
  const [viewProducto, setViewProducto] = useState(null);
  const [deleteProducto, setDeleteProducto] = useState(null);

  // Quote modal state
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [quoteForm, setQuoteForm] = useState({ descripcion: '', inversion: '' });

  const { isAdmin, isCliente } = useAuth();
  const { success, error } = useNotification();

  async function load() {
    setLoading(true);
    try {
      const requests = [ProductosAPI.list()];
      if (isCliente) requests.push(CotizacionesAPI.listProductos());
      const [prodRes, cotRes] = await Promise.all(requests);
      setProductos(prodRes.data || prodRes);
      if (isCliente) setCotizacionesProducto((cotRes.data || cotRes) || []);
    } catch (e) {
      console.error(e);
      error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const list = (productos || []).filter((p) =>
    p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', precio: '', categoria: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const resetQuoteForm = () => {
    setQuoteForm({ descripcion: '', inversion: '' });
    setShowQuoteModal(false);
    setSelectedProducto(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await ProductosAPI.update(editingId, { ...form, precio: parseFloat(form.precio) });
        success(`Producto "${form.nombre}" actualizado exitosamente`);
      } else {
        await ProductosAPI.create({ ...form, precio: parseFloat(form.precio) });
        success(`Producto "${form.nombre}" agregado exitosamente`);
      }
      resetForm();
      load();
    } catch (err) {
      error(err.message || `Error al ${editingId ? 'actualizar' : 'agregar'} el producto`);
    }
  };

  const onDelete = async () => {
    if (!deleteProducto) return;
    try {
      await ProductosAPI.remove(deleteProducto.id);
      success(`Producto "${deleteProducto.nombre}" eliminado exitosamente`);
      setDeleteProducto(null);
      load();
    } catch (err) {
      error(err.message || 'Error al eliminar el producto');
    }
  };

  const openEdit = (producto) => {
    setForm({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || '',
      categoria: producto.categoria || '',
    });
    setEditingId(producto.id);
    setShowForm(true);
  };

  const openQuoteModal = (producto) => {
    setSelectedProducto(producto);
    setQuoteForm({ descripcion: '', inversion: '' });
    setShowQuoteModal(true);
  };

  const onSubmitQuote = async (e) => {
    e.preventDefault();
    if (!selectedProducto) return;
    try {
      await CotizacionesAPI.createProducto({
        productoId: selectedProducto.id,
        descripcion: quoteForm.descripcion,
        inversion: quoteForm.inversion ? parseFloat(quoteForm.inversion) : null,
      });
      success(`Cotización de "${selectedProducto.nombre}" enviada exitosamente`);
      resetQuoteForm();
      const res = await CotizacionesAPI.listProductos();
      setCotizacionesProducto(res.data || res || []);
    } catch (err) {
      error(err.message || 'Error al enviar cotización');
    }
  };

  const formContent = (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input required placeholder="Nombre del producto" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
          <input required type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <input placeholder="Categoría" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea placeholder="Descripción del producto" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} rows={3} className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
          {editingId ? 'Actualizar Producto' : 'Guardar Producto'}
        </button>
        <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
      </div>
    </form>
  );

  const quoteFormContent = (
    <form onSubmit={onSubmitQuote} className="space-y-4">
      <div className="bg-indigo-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-gray-600">Producto:</p>
        <p className="text-lg font-bold text-gray-900">{selectedProducto?.nombre}</p>
        <p className="text-sm text-gray-500">${selectedProducto?.precio} · {selectedProducto?.categoria}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la cotización</label>
        <textarea required rows={3} placeholder="Describe tus necesidades para este producto..." value={quoteForm.descripcion} onChange={e => setQuoteForm({...quoteForm, descripcion: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Inversión esperada ($)</label>
        <input type="number" min="0" step="0.01" placeholder="Ej: 5000" value={quoteForm.inversion} onChange={e => setQuoteForm({...quoteForm, inversion: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
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
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 mt-1">Catálogo de productos publicitarios</p>
        </div>
        {isAdmin && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
            <Plus className="w-4 h-4" />
            Agregar Producto
          </button>
        )}
      </div>

      {/* Modal Crear/Editar */}
      <Modal open={showForm} onClose={resetForm} title={editingId ? 'Editar Producto' : 'Nuevo Producto'} maxWidth="max-w-2xl">
        {formContent}
      </Modal>

      {/* Modal Cotizar Producto */}
      <Modal open={showQuoteModal} onClose={resetQuoteForm} title="Cotizar Producto" maxWidth="max-w-lg">
        {quoteFormContent}
      </Modal>

      {/* Modal Ver Detalle */}
      <Modal open={!!viewProducto} onClose={() => setViewProducto(null)} title="Detalle del Producto">
        {viewProducto && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{viewProducto.nombre}</h2>
                <span className="inline-flex items-center gap-1 px-3 py-1 mt-2 bg-gray-100 rounded-full text-sm text-gray-600">
                  <Tag className="w-3 h-3" /> {viewProducto.categoria || 'Sin categoría'}
                </span>
              </div>
              <span className="text-3xl font-bold text-indigo-600">${viewProducto.precio}</span>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
              <p className="text-gray-600">{viewProducto.descripcion || 'Sin descripción'}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <ConfirmModal
        open={!!deleteProducto}
        onClose={() => setDeleteProducto(null)}
        onConfirm={onDelete}
        title="¿Eliminar producto?"
        message={`¿Estás seguro de que deseas eliminar el producto "${deleteProducto?.nombre}"? Esta acción no se puede deshacer.`}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Buscar productos..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Package className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setViewProducto(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver detalle">
                    <Eye className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <>
                      <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Editar">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteProducto(p)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{p.nombre}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.descripcion}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-gray-900">${p.precio}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{p.categoria}</span>
              </div>
              {isCliente && (
                <button onClick={() => openQuoteModal(p)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  <Send className="w-4 h-4" />
                  Cotizar Producto
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Estado de Cotizaciones de Producto - Solo Clientes */}
      {isCliente && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Mis Cotizaciones de Producto</h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Producto</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Descripción</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Inversión</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(cotizacionesProducto || []).map((c) => {
                  const StatusIcon = statusIcons[c.estado] || Clock;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{c.producto?.nombre || 'Producto'}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">{c.descripcion || '-'}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">${c.inversion ? Number(c.inversion).toLocaleString() : 'N/A'}</td>
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
            {(cotizacionesProducto || []).length === 0 && (
              <p className="text-gray-400 text-center py-8">No tienes cotizaciones de producto</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
