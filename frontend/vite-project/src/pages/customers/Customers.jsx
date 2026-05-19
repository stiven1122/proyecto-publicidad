import { useEffect, useState } from 'react';
import { Search, Phone, MapPin, Mail, Calendar, Edit2 } from 'lucide-react';
import { ClientesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function Customers() {
  const [search, setSearch] = useState('');
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' });
  const { isAdmin, isCliente } = useAuth();
  const { success, error } = useNotification();

  async function load() {
    setLoading(true);
    try {
      const response = await ClientesAPI.list();
      setClientes(response.data || response);
    } catch (e) {
      console.error(e);
      error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const list = (clientes || []).filter((c) =>
    c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await ClientesAPI.create(form);
      success(`Cliente "${form.nombre}" registrado exitosamente`);
      setShowForm(false);
      setForm({ nombre: '', email: '', telefono: '', direccion: '' });
      load();
    } catch (err) {
      error(err.message || 'Error al registrar el cliente');
    }
  };

  if (isCliente && list.length === 1) {
    const c = list[0];
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-500 mt-1">Tu información de contacto en el sistema</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">{c.nombre?.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{c.nombre}</h2>
              <p className="text-sm text-gray-500">{c.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Correo electrónico</p>
                <p className="text-sm font-medium text-gray-900">{c.email}</p>
              </div>
            </div>
            {c.telefono && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Teléfono</p>
                  <p className="text-sm font-medium text-gray-900">{c.telefono}</p>
                </div>
              </div>
            )}
            {c.direccion && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Dirección</p>
                  <p className="text-sm font-medium text-gray-900">{c.direccion}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Registrado desde</p>
                <p className="text-sm font-medium text-gray-900">{c.fechaRegistro?.slice(0,10)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">Gestión de clientes y contactos</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
            <Edit2 className="w-4 h-4" />
            Nuevo Cliente
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold">Registrar Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Nombre / Empresa" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="px-4 py-2 border rounded-lg text-sm" />
            <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="px-4 py-2 border rounded-lg text-sm" />
            <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} className="px-4 py-2 border rounded-lg text-sm" />
            <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} className="px-4 py-2 border rounded-lg text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Registrar</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Buscar clientes..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">{c.nombre}</h3>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{c.fechaRegistro?.slice(0,10)}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{c.email}</div>
                {c.telefono && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{c.telefono}</div>}
                {c.direccion && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" />{c.direccion}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
