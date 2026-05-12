import { useState } from 'react';
import { User, Bell, Shield, Palette, Save } from 'lucide-react';

export default function Settings() {
  const [tab, setTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Administra tu cuenta y preferencias</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <div className="bg-white rounded-xl border border-gray-200 p-2">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <t.icon className="w-5 h-5" />{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {tab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Perfil</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-white">JD</span>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cambiar foto</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label><input type="text" defaultValue="Juan Doe" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Correo</label><input type="email" defaultValue="juan@admanager.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Empresa</label><input type="text" defaultValue="AdManager Pro" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label><input type="tel" defaultValue="+51 987 654 321" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
              </div>
              <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"><Save className="w-4 h-4" />Guardar cambios</button>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
              {[
                { label: 'Notificaciones por email', desc: 'Recibe actualizaciones por correo' },
                { label: 'Alertas de presupuesto', desc: 'Notifica cuando el presupuesto esté bajo' },
                { label: 'Reportes semanales', desc: 'Resumen semanal de rendimiento' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div><p className="font-medium text-gray-900">{item.label}</p><p className="text-sm text-gray-500">{item.desc}</p></div>
                  <label className="relative cursor-pointer">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Seguridad</h2>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña actual</label><input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nueva contraseña</label><input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label><input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
              </div>
              <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"><Shield className="w-4 h-4" />Actualizar contraseña</button>
            </div>
          )}

          {tab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Apariencia</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tema</label>
                <div className="flex gap-4">
                  {['Claro', 'Oscuro', 'Sistema'].map((theme) => (
                    <label key={theme} className="cursor-pointer">
                      <input type="radio" name="theme" value={theme} className="sr-only peer" defaultChecked={theme === 'Claro'} />
                      <div className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 peer-checked:border-indigo-500 peer-checked:text-indigo-600 peer-checked:bg-indigo-50">{theme}</div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Color de acento</label>
                <div className="flex gap-3">
                  {['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'].map((color) => (
                    <label key={color} className="cursor-pointer">
                      <input type="radio" name="accent" value={color} className="sr-only peer" />
                      <div className="w-10 h-10 rounded-full border-2 border-transparent peer-checked:border-gray-900" style={{ backgroundColor: color }} />
                    </label>
                  ))}
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"><Save className="w-4 h-4" />Guardar preferencias</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
