import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'No se pudo registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout activeTab="register">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Crear Cuenta</h2>
      <p className="text-sm text-gray-500 mb-6">Reg&iacute;strate para comenzar</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">Nombre completo</label>
          <input type="text" name="name" value={form.name} onChange={onChange} placeholder="Juan P&eacute;rez" required
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">Correo electr&oacute;nico</label>
          <input type="email" name="email" value={form.email} onChange={onChange} placeholder="tu@email.com" required
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">Empresa</label>
          <input type="text" name="company" value={form.company} onChange={onChange} placeholder="Tu empresa" required
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">Contrase&ntilde;a</label>
          <div className="relative">
            <input type={show ? 'text' : 'password'} name="password" value={form.password} onChange={onChange} placeholder="••••••••" required
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors mt-2">
          {loading ? 'Creando...' : 'Registrarse'}
        </button>
      </form>
    </AuthLayout>
  );
}
