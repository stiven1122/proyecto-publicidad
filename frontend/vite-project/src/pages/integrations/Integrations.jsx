import { useEffect, useState } from 'react';
import { Plus, Plug, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { IntegracionesAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function Integrations() {
  const [integraciones, setIntegraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombrePlataforma: '', apiKey: '', estado: 'activa' });
  const { success, error } = useNotification();

  async function load() {
    setLoading(true);
    try {
      const data = await IntegracionesAPI.list();
      setIntegraciones(data.data || data);
    } catch (e) {
      console.error(e);
      error('Error al cargar las integraciones');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await IntegracionesAPI.create(form);
      success(`Integración con "${form.nombrePlataforma}" creada exitosamente`);
      setShowForm(false);
      setForm({ nombrePlataforma: '', apiKey: '', estado: 'activa' });
      load();
    } catch (err) {
      error(err.message || 'Error al crear la integración');
    }
  };

  const toggleEstado = async (id, estado) => {
    try {
      await IntegracionesAPI.update(id, { estado: estado === 'activa' ? 'inactiva' : 'activa' });
      success(`Estado de la integración actualizado`);
      load();
    } catch (err) {
      error(err.message || 'Error al actualizar la integración');
    }
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar integración?')) return;
    try {
      await IntegracionesAPI.remove(id);
      success('Integración eliminada exitosamente');
      load();
    } catch (err) {
      error(err.message || 'Error al eliminar la integración');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integraciones</h1>
          <p className="text-gray-500 mt-1">Conecta con plataformas externas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          Nueva Integración
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold">Nueva Integración</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required placeholder="Plataforma (ej: Facebook Ads)" value={form.nombrePlataforma} onChange={e => setForm({...form, nombrePlataforma: e.target.value})} className="px-4 py-2 border rounded-lg text-sm" />
            <input required placeholder="API Key" value={form.apiKey} onChange={e => setForm({...form, apiKey: e.target.value})} className="px-4 py-2 border rounded-lg text-sm" />
            <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} className="px-4 py-2 border rounded-lg text-sm">
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(integraciones || []).map((i) => (
            <div key={i.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg"><Plug className="w-5 h-5 text-indigo-600" /></div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{i.nombrePlataforma}</h3>
                    <p className="text-xs text-gray-500">Conectada el {i.fechaConexion?.slice(0,10)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleEstado(i.id, i.estado)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    {i.estado === 'activa' ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                  </button>
                  <button onClick={() => remove(i.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${i.estado === 'activa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{i.estado}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
