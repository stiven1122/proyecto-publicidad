import { Link } from 'react-router-dom';
import { Megaphone, BarChart3, Users, Shield, ArrowRight, CheckCircle, Zap, Globe } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AdManager Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium mb-6">
          <Zap className="w-3.5 h-3.5" />
          Plataforma de Gestión Publicitaria
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Gestiona tus campañas publicitarias <br className="hidden md:block" />
          <span className="text-indigo-600">en un solo lugar</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Centraliza la administración de clientes, campañas, productos y métricas de rendimiento.
          Toma decisiones basadas en datos reales.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/register" className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800">
            Comenzar Gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50">
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Todo lo que necesitas</h2>
            <p className="text-gray-500">Herramientas diseñadas para agencias de publicidad</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Megaphone className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Campañas</h3>
              <p className="text-sm text-gray-500">Crea, edita y monitorea campañas publicitarias con seguimiento de estado y objetivos.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Analítica</h3>
              <p className="text-sm text-gray-500">Visualiza métricas de impresiones, clics y conversiones en tiempo real.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Clientes</h3>
              <p className="text-sm text-gray-500">Administra tu base de clientes y su historial de campañas.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Integraciones</h3>
              <p className="text-sm text-gray-500">Conecta con plataformas externas como Facebook Ads e Instagram Business.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Roles y Seguridad</h3>
              <p className="text-sm text-gray-500">Control de accesos por roles: admin y usuario con autenticación JWT.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reportes</h3>
              <p className="text-sm text-gray-500">Genera reportes automáticos y descárgalos en PDF o JSON.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Listo para optimizar tus campañas?</h2>
          <p className="text-gray-500 mb-8">Regístrate gratis y empieza a gestionar tu publicidad de forma profesional.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800">
            Crear Cuenta Ahora
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Megaphone className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">AdManager Pro</span>
          </div>
          <p className="text-xs text-gray-400">2026 - Universidad Autónoma del Cauca</p>
        </div>
      </footer>
    </div>
  );
}
