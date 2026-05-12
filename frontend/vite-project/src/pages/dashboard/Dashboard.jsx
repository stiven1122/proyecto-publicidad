import { useState } from 'react';
import { ShoppingCart, Users, TrendingUp, DollarSign, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const metrics = [
  { label: 'Campañas Activas', value: '24', change: '+12% vs mes anterior', icon: ShoppingCart, bg: 'bg-blue-50' },
  { label: 'Total Clientes', value: '156', change: '+8% vs mes anterior', icon: Users, bg: 'bg-green-50' },
  { label: 'Productos Entregados', value: '1,248', change: '+23% vs mes anterior', icon: TrendingUp, bg: 'bg-purple-50' },
  { label: 'Ingresos Mes', value: '$45,890', change: '+15% vs mes anterior', icon: DollarSign, bg: 'bg-orange-50' },
];

const products = [
  {
    id: 1, name: 'Folletos', price: '$0.25', unit: 'por unidad',
    desc: 'Impresos promocionales ideales para campañas de marketing directo. Perfectos para eventos y puntos de venta.',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&h=400&fit=crop',
    tag: 'Popular', tagColor: 'bg-orange-500',
    features: ['Papel couché mate 150g', 'Tamaño A5', 'Full color', 'Entrega 5 días']
  },
  {
    id: 2, name: 'Calcomanías', price: '$0.35', unit: 'por unidad',
    desc: 'Stickers personalizados de alta calidad. Resistentes al agua y rayos UV para productos y envases.',
    image: 'https://images.unsplash.com/photo-1589445740253-f75c40f1a6db?w=600&h=400&fit=crop',
    tag: null,
    features: ['Vinilo adhesivo premium', 'Corte personalizado', 'Resistentes al agua', 'Empaque individual']
  },
  {
    id: 3, name: 'Bingos', price: '$2.50', unit: 'por unidad',
    desc: 'Bingos personalizados para eventos corporativos y actividades recreativas. Diseño adaptable.',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=400&fit=crop',
    tag: 'Nuevo', tagColor: 'bg-green-500',
    features: ['Cartón grueso 300g', 'Tamaño 8x8 pulgadas', 'Hasta 100 números', 'Numeración personalizada']
  },
  {
    id: 4, name: 'Pendones', price: '$15.00', unit: 'por unidad',
    desc: 'Banners publicitarios de gran formato para eventos y decoración de espacios comerciales.',
    image: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=600&h=400&fit=crop',
    tag: null,
    features: ['Lona vinílica 13oz', 'Medidas personalizadas', 'Ojillos metálicos', 'Incluye estacas']
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuestros Productos Publicitarios</h1>
        <p className="text-gray-500">Selecciona el producto ideal para tu campaña</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{m.label}</p>
                <p className="text-2xl font-bold text-gray-900">{m.value}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{m.change}</p>
              </div>
              <div className={`p-3 rounded-full ${m.bg}`}>
                <m.icon className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Catalog header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Catálogo de Productos</h2>
        <Link to="/campaigns" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <ShoppingCart className="w-4 h-4" />
          Ver Todas las Campañas
        </Link>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="relative h-48 bg-gray-50">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              {p.tag && (
                <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white rounded-full ${p.tagColor}`}>
                  {p.tag}
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{p.desc}</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-gray-900">{p.price}</span>
                <span className="text-sm text-gray-500">{p.unit}</span>
              </div>
              <div className="space-y-1.5 mb-5">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
                  <ShoppingCart className="w-4 h-4" />
                  Agregar al Carrito
                </button>
                <button className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
