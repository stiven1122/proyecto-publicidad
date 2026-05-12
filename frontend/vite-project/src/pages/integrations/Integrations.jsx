import { useState } from 'react';
import { Plug, CheckCircle, XCircle, RefreshCw, Settings, Link2 } from 'lucide-react';

const integrations = [
  { id: 1, name: 'Facebook Ads', desc: 'Campañas de Facebook', status: 'connected', icon: '📘', lastSync: '2026-05-09 14:30' },
  { id: 2, name: 'Google Ads', desc: 'Integración Google Ads', status: 'connected', icon: '🔍', lastSync: '2026-05-09 14:25' },
  { id: 3, name: 'Instagram', desc: 'Contenido de Instagram', status: 'connected', icon: '📷', lastSync: '2026-05-09 14:20' },
  { id: 4, name: 'TikTok Ads', desc: 'Campañas en TikTok', status: 'disconnected', icon: '🎵' },
  { id: 5, name: 'Twitter/X', desc: 'Promociona en Twitter/X', status: 'disconnected', icon: '🐦' },
  { id: 6, name: 'LinkedIn', desc: 'Campañas profesionales', status: 'disconnected', icon: '💼' },
];

export default function Integrations() {
  const [loading, setLoading] = useState(null);

  const connect = async (id) => {
    setLoading(id);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(null);
  };

  const connected = integrations.filter((i) => i.status === 'connected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integraciones</h1>
          <p className="text-gray-500 mt-1">Conecta con plataformas externas</p>
        </div>
        <span className="text-sm text-gray-500">{connected} de {integrations.length} conectadas</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((i) => (
          <div key={i.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{i.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{i.name}</h3>
                  <p className="text-sm text-gray-500">{i.desc}</p>
                </div>
              </div>
              {i.status === 'connected' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-gray-400" />}
            </div>

            {i.status === 'connected' ? (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-3">Última sinc: {i.lastSync}</p>
                <div className="flex gap-2">
                  <button onClick={() => connect(i.id)} disabled={loading === i.id} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 ${loading === i.id ? 'animate-spin' : ''}`} />
                    Sincronizar
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Settings className="w-4 h-4" /></button>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100">
                <button onClick={() => connect(i.id)} disabled={loading === i.id} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50">
                  {loading === i.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                  {loading === i.id ? 'Conectando...' : 'Conectar'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
