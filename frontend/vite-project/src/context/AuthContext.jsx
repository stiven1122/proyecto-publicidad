import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [miPerfil, setMiPerfil] = useState(null);

  const isAdmin = user?.rol === 'admin';
  const isCliente = user?.rol === 'usuario';

  // Cargar perfil de cliente cuando hay token
  useEffect(() => {
    if (token && isCliente) {
      fetch(`${API_URL}/api/clientes/miperfil`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.data) setMiPerfil(data.data);
        })
        .catch(console.error);
    }
  }, [token, isCliente]);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Credenciales incorrectas');
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.usuario));
    setToken(data.token);
    setUser(data.usuario);
    return data;
  };

  const register = async (nombre, email, password, rol = 'usuario') => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password, rol }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error al registrarse');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setMiPerfil(null);
    navigate('/', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, token, miPerfil, login, register, logout, isAuthenticated: !!token, isAdmin, isCliente }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { API_URL };
