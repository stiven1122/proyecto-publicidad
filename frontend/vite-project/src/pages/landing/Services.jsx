import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone, Globe, Smartphone, Palette, TrendingUp, Video,
  CheckCircle, ArrowRight, Mail, MapPin, Phone, Package, Loader2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const servicios = [
  {
    icon: Megaphone,
    titulo: 'Campañas Publicitarias',
    descripcion: 'Diseño, planificación y ejecución de campañas publicitarias multicanal enfocadas en resultados medibles.',
    caracteristicas: ['Estrategia de medios', 'Segmentación avanzada', 'Optimización continua', 'Reportes detallados'],
    color: 'bg-blue-50 text-blue-600',
    precio: 'Desde $1.200.000/mes',
  },
  {
    icon: Globe,
    titulo: 'Google Ads',
    descripcion: 'Gestión profesional de campañas en Google Search, Display y YouTube para captar clientes con intención de compra.',
    caracteristicas: ['Búsqueda & Display', 'Remarketing', 'Shopping Ads', 'YouTube Ads'],
    color: 'bg-orange-50 text-orange-600',
    precio: 'Desde $900.000/mes',
  },
  {
    icon: Smartphone,
    titulo: 'Redes Sociales',
    descripcion: 'Administración integral de perfiles en Facebook, Instagram, LinkedIn y TikTok con contenido de valor.',
    caracteristicas: ['Community Management', 'Creación de contenido', 'Paid Social', 'Influencer Marketing'],
    color: 'bg-pink-50 text-pink-600',
    precio: 'Desde $800.000/mes',
  },
  {
    icon: Palette,
    titulo: 'Diseño Gráfico',
    descripcion: 'Creación de identidad visual, piezas publicitarias y material de marca profesional y memorable.',
    caracteristicas: ['Branding & Logo', 'Banners & Flyers', 'Packaging', 'Manual de marca'],
    color: 'bg-purple-50 text-purple-600',
    precio: 'Desde $600.000/proyecto',
  },
  {
    icon: Video,
    titulo: 'Producción Audiovisual',
    descripcion: 'Spots publicitarios, reels, videos corporativos y motion graphics que cuentan tu historia.',
    caracteristicas: ['Guión & Storyboard', 'Filmación 4K', 'Edición & Post', 'Motion Graphics'],
    color: 'bg-red-50 text-red-600',
    precio: 'Desde $2.500.000/proyecto',
  },
  {
    icon: TrendingUp,
    titulo: 'Consultoría Digital',
    descripcion: 'Asesoría estratégica para transformar digitalmente tu negocio y maximizar tu retorno de inversión.',
    caracteristicas: ['Análisis de competencia', 'KPIs & Métricas', 'Funnel de ventas', 'Automatización'],
    color: 'bg-green-50 text-green-600',
    precio: 'Desde $1.500.000/mes',
  },
];

export default function Services() {
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState('');

  useEffect(() => {
    async function loadProductos() {
      try {
        const res = await fetch(`${API_URL}/api/public/productos`);
        const data = await res.json();
        setProductos(data.data || data || []);
      } catch (e) {
        console.error(e);
        setErrorProductos('No se pudieron cargar los productos.');
      } finally {
        setLoadingProductos(false);
      }
    }
    loadProductos();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AdManager Pro</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Inicio
            </Link>
            <Link to="/servicios" className="px-4 py-2 text-sm font-medium text-indigo-600">
              Servicios
            </Link>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Inicio de Sesión
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50/50 to-white pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            Soluciones Publicitarias Integrales
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Impulsa tu marca con <span className="text-indigo-600">servicios profesionales</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Ofrecemos un portafolio completo de servicios publicitarios diseñados para hacer crecer tu negocio, aumentar tu visibilidad y convertir audiencias en clientes.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/register" className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800">
              Comenzar Ahora
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#servicios" className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50">
              Ver Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Servicios Grid */}
      <section id="servicios" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nuestros Servicios</h2>
            <p className="text-gray-500">Todo lo que necesitas para posicionar tu marca en el mercado</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((s, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.titulo}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{s.descripcion}</p>

                <ul className="space-y-2 mb-5">
                  {s.caracteristicas.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{s.precio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos desde la base de datos */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium mb-4">
              <Package className="w-3.5 h-3.5" />
              Catálogo Actualizado
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nuestros Productos</h2>
            <p className="text-gray-500">Explora los productos publicitarios disponibles en nuestra plataforma</p>
          </div>

          {loadingProductos ? (
            <div className="flex items-center justify-center gap-2 text-gray-500 py-12">
              <Loader2 className="w-5 h-5 animate-spin" />
              Cargando productos...
            </div>
          ) : errorProductos ? (
            <p className="text-red-500 text-center py-12">{errorProductos}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(productos || []).map((p) => (
                <Link
                  key={p.id}
                  to="/register"
                  className="block bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                    <Package className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{p.nombre}</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{p.descripcion || 'Sin descripción'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xl font-bold text-gray-900">${p.precio?.toLocaleString?.() || p.precio}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{p.categoria || 'General'}</span>
                  </div>
                </Link>
              ))}
              {(productos || []).length === 0 && (
                <p className="text-gray-400 text-center py-12 col-span-full">No hay productos disponibles en este momento</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir <span className="text-indigo-600">AdManager Pro</span>?
              </h2>
              <p className="text-gray-500 mb-8">
                Somos un equipo de expertos en marketing digital comprometidos con los resultados de nuestros clientes. Combinamos creatividad, tecnología y estrategia para potenciar tu marca.
              </p>
              <div className="space-y-4">
                {[
                  'Más de 5 años de experiencia en el mercado',
                  'Equipo certificado en Google Ads y Meta Blueprint',
                  'Reportes transparentes y en tiempo real',
                  'Atención personalizada y soporte continuo',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Solicita una cotización</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Servicio de interés</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option>Selecciona un servicio...</option>
                    {servicios.map((s, i) => (
                      <option key={i}>{s.titulo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea
                    rows={3}
                    placeholder="Cuéntanos sobre tu proyecto..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <Link
                  to="/register"
                  className="block w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 text-center transition-colors"
                >
                  Enviar Solicitud
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Listo para hacer crecer tu negocio?</h2>
          <p className="text-gray-500 mb-8">
            Regístrate gratis y empieza a gestionar tu publicidad de forma profesional con nuestra plataforma.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800"
          >
            Crear Cuenta Ahora
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">AdManager Pro</span>
              </div>
              <p className="text-sm text-gray-500">
                Plataforma integral para la gestión de campañas publicitarias y servicios de marketing digital.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Enlaces</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-500 hover:text-gray-900">Inicio</Link></li>
                <li><Link to="/servicios" className="text-sm text-gray-500 hover:text-gray-900">Servicios</Link></li>
                <li><Link to="/login" className="text-sm text-gray-500 hover:text-gray-900">Inicio de Sesión</Link></li>
                <li><Link to="/register" className="text-sm text-gray-500 hover:text-gray-900">Registrarse</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Servicios</h4>
              <ul className="space-y-2">
                {servicios.slice(0, 4).map((s, i) => (
                  <li key={i}><span className="text-sm text-gray-500">{s.titulo}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4" /> contacto@admanager.pro
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4" /> +57 300 123 4567
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" /> Popayán, Colombia
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex items-center justify-between">
            <p className="text-xs text-gray-400">2026 - Universidad Autónoma del Cauca</p>
            <p className="text-xs text-gray-400">Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
