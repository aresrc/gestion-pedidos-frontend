'use client';

import { useState } from 'react';
import { Lock, User } from 'lucide-react';

// Simula una función de login. En una aplicación real, esto haría una llamada a tu API.
const fakeLogin = async (username: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        // En un caso real, aquí recibirías un token y lo guardarías
        // Por ejemplo, en una cookie para que el middleware lo lea.
        document.cookie = "auth_token=fake-jwt-token; path=/; max-age=3600"; // Expira en 1 hora
        resolve({ success: true });
      } else {
        reject({ success: false, message: 'Usuario o contraseña incorrectos.' });
      }
    }, 1000);
  });
};


export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

interface LoginError {
    success: boolean;
    message: string;
}

interface LoginResponse {
    success: boolean;
}

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await fakeLogin(username, password);
            // Si el login es exitoso, el middleware se encargará de redirigir
            // o puedes forzar una recarga para que el middleware actúe.
            window.location.href = '/dashboard';
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 
                            (err as LoginError)?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800">Bienvenido</h1>
          <p className="mt-2 text-slate-500">Inicia sesión para acceder a tu panel</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-200 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Campo de Usuario */}
          <div className="relative">
            <div className="absolute top-0 left-0 flex items-center h-full pl-3 pointer-events-none">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-3 pl-10 pr-4 text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Usuario (prueba: admin)"
              required
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="relative">
             <div className="absolute top-0 left-0 flex items-center h-full pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pl-10 pr-4 text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Contraseña (prueba: password)"
              required
            />
          </div>

          {/* Botón de Login */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-slate-500">
          ¿No tienes una cuenta? <a href="#" className="font-medium text-blue-600 hover:underline">Regístrate</a>
        </p>

      </div>
    </div>
  );
}
