import { Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, activeTab }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E8ECFE] px-4 py-8">
      {/* Logo */}
      <div className="w-14 h-14 bg-[#4F46E5] rounded-full flex items-center justify-center mb-5">
        <Megaphone className="w-7 h-7 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-1">AdManager Pro</h1>
      <p className="text-base text-gray-500 text-center mb-10">
        Plataforma de Gesti&oacute;n de Campa&ntilde;as Publicitarias
      </p>

      {/* Tabs */}
      <div className="w-full max-w-sm mb-4">
        <div className="bg-gray-200/60 rounded-full p-1 flex">
          <Link
            to="/login"
            className={`flex-1 py-2.5 text-sm font-medium text-center rounded-full transition-all ${
              activeTab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Iniciar Sesi&oacute;n
          </Link>
          <Link
            to="/register"
            className={`flex-1 py-2.5 text-sm font-medium text-center rounded-full transition-all ${
              activeTab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Registrarse
          </Link>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-6">
        {children}
      </div>
    </div>
  );
}
