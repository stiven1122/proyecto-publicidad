import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    // DEMO MODE: Simulación de login sin backend
    await new Promise((r) => setTimeout(r, 600));
    
    if (email === 'admin@empresa.com' && password === 'password') {
      const userData = { id: 1, name: 'Usuario Demo', email: 'admin@empresa.com', rol: 'admin' };
      const token = 'demo-token-123';
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { token, usuario: userData };
    }
    
    throw new Error('Credenciales incorrectas');
  };

  const register = async (name, email, company, password) => {
    // DEMO MODE: Simulación de registro sin backend
    await new Promise((r) => setTimeout(r, 600));
    
    const userData = { id: 2, name, email, company, rol: 'usuario' };
    const token = 'demo-token-456';
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return { token, usuario: userData };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
