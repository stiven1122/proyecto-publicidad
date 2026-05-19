import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Megaphone, Users, BarChart3, FileText, Plug, UserCircle, LogOut, Menu, Package, Bell, ClipboardList
} from 'lucide-react';

const menuAdmin = [
  { icon: LayoutDashboard, label: 'Panel Principal', path: '/dashboard' },
  { icon: Megaphone, label: 'Campañas', path: '/campaigns' },
  { icon: Users, label: 'Clientes', path: '/customers' },
  { icon: Package, label: 'Productos', path: '/products' },
  { icon: BarChart3, label: 'Analítica y Reportes', path: '/analytics' },
  { icon: ClipboardList, label: 'Cotizaciones', path: '/quotes' },
  { icon: Plug, label: 'Integraciones', path: '/integrations' },
  { icon: UserCircle, label: 'Usuarios', path: '/users' },
  { icon: Bell, label: 'Notificaciones', path: '/notifications' },
];

const menuCliente = [
  { icon: LayoutDashboard, label: 'Mi Panel', path: '/dashboard' },
  { icon: Megaphone, label: 'Mis Campañas', path: '/campaigns' },
  { icon: Users, label: 'Mi Perfil', path: '/customers' },
  { icon: Package, label: 'Cotizar Producto', path: '/products' },
  { icon: BarChart3, label: 'Mis Métricas', path: '/analytics' },
  { icon: Bell, label: 'Notificaciones', path: '/notifications' },
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isCliente } = useAuth();

  const menu = isAdmin ? menuAdmin : menuCliente;

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 h-20 px-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AdManager Pro</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menu.map((item) => {
              const active = pathname === item.path || (item.path === '/dashboard' && pathname === '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl text-base font-medium transition-colors ${
                    active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.nombre || 'Usuario'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${isAdmin ? 'bg-indigo-100 text-indigo-700' : isCliente ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {isAdmin ? 'Administrador' : isCliente ? 'Cliente' : 'Usuario'}
              </span>
              <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
