import { useEffect, useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { NotificacionesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function Notifications() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { success, error } = useNotification();

  async function load() {
    setLoading(true);
    try {
      const response = await NotificacionesAPI.list(user.id);
      setNotificaciones(response.data || response);
    } catch (e) {
      console.error(e);
      error('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [user.id]);

  const marcarLeida = async (id) => {
    try {
      await NotificacionesAPI.markRead(id);
      success('Notificación marcada como leída');
      load();
    } catch (err) {
      error('Error al marcar la notificación');
    }
  };

  const noLeidas = (notificaciones || []).filter(n => !n.leida).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-500 mt-1">{noLeidas} sin leer</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="space-y-3">
          {(notificaciones || []).map((n) => (
            <div key={n.id} className={`bg-white border rounded-xl p-5 flex items-start gap-4 ${n.leida ? 'border-gray-200 opacity-60' : 'border-indigo-200'}`}>
              <div className={`p-2 rounded-lg ${n.leida ? 'bg-gray-100' : 'bg-indigo-50'}`}>
                <Bell className={`w-5 h-5 ${n.leida ? 'text-gray-400' : 'text-indigo-600'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{n.mensaje}</p>
                <p className="text-xs text-gray-400 mt-1">{n.fecha?.slice(0,16).replace('T',' ')}</p>
              </div>
              {!n.leida && (
                <button onClick={() => marcarLeida(n.id)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {(notificaciones || []).length === 0 && <p className="text-gray-400 text-center py-8">No hay notificaciones</p>}
        </div>
      )}
    </div>
  );
}
