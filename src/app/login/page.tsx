'use client';

import React, { useState } from 'react';
import { Lock, User, Users } from 'lucide-react';

// Roles disponibles con sus IDs correspondientes para el registro
const availableRoles = [
  { id: 1, name: 'Administrador' },
  { id: 2, name: 'Cocinero' },
  { id: 3, name: 'Mesero' },
  { id: 4, name: 'Cajero' },
];

// --- Simulación de API ---

// Simula una función de login.
const fakeLogin = async (username: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        console.log("Login exitoso. Redirigiendo al dashboard...");
        // En un caso real, aquí recibirías un token.
        document.cookie = "auth_token=fake-jwt-token; path=/; max-age=3600";
        resolve({ success: true });
      } else {
        reject({ message: 'Usuario o contraseña incorrectos.' });
      }
    }, 1000);
  });
};

interface RegisterResponse {
    success: boolean;
    message: string;
}

// Simula una llamada a la API de registro
const fakeRegister = async (nombre: string, contraseña: string, roles: number[]): Promise<RegisterResponse> => {
    console.log("Enviando datos de registro a la API:", { nombre, contraseña, roles });

    // En una aplicación real, usarías fetch así:
    
    const response = await fetch('http://localhost:8080/api/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, contraseña, roles }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ocurrió un error en el registro.');
    }

    return await response.json();
    
    
    // Simulación para el ejemplo
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!nombre || !contraseña || roles.length === 0) {
                 reject({ message: 'Nombre, contraseña y al menos un rol son requeridos.' });
            } else {
                 resolve({ success: true, message: '¡Usuario registrado con éxito!' });
            }
        }, 1500);
    });
};


// --- Componente de Login ---
const LoginPage = ({ setPage }: { setPage: React.Dispatch<React.SetStateAction<string>> }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await fakeLogin(username, password);
      // En una app real con un router, harías: navigate('/dashboard');
      // Por ahora, simulamos la redirección.
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err?.message || 'Ha ocurrido un error');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <div className="relative">
          <div className="absolute top-0 left-0 flex items-center h-full pl-3 pointer-events-none">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full py-3 pl-10 pr-4 text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Usuario (prueba: admin)"
            required
          />
        </div>

        <div className="relative">
          <div className="absolute top-0 left-0 flex items-center h-full pl-3 pointer-events-none">
            <Lock className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 pl-10 pr-4 text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Contraseña (prueba: password)"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : 'Iniciar Sesión'}
          </button>
        </div>
      </form>

      <p className="text-sm text-center text-slate-500">
        ¿No tienes una cuenta?{' '}
        <button onClick={() => setPage('register')} className="font-medium text-blue-600 hover:underline focus:outline-none">
          Regístrate
        </button>
      </p>
    </div>
  );
};

// --- Componente de Registro ---
const RegistrationPage = ({ setPage }: { setPage: React.Dispatch<React.SetStateAction<string>> }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedRoles.length === 0) {
      setError('Debes seleccionar al menos un rol.');
      return;
    }
    
    setLoading(true);

    try {
      const result= await fakeRegister(username, password, selectedRoles);
      setSuccess(result.message);
      // Limpiar formulario tras éxito
      setUsername('');
      setPassword('');
      setSelectedRoles([]);
    } catch (err: any) {
      setError(err?.message || 'Error durante el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800">Crear Cuenta</h1>
        <p className="mt-2 text-slate-500">Completa el formulario para registrarte</p>
      </div>

      {error && (
        <div className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-200 rounded-lg" role="alert">
          {error}
        </div>
      )}
       {success && (
        <div className="p-3 text-sm text-center text-green-800 bg-green-100 border border-green-200 rounded-lg" role="alert">
          {success}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
           <div className="absolute top-0 left-0 flex items-center h-full pl-3 pointer-events-none">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full py-3 pl-10 pr-4 text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre de usuario" required />
        </div>
        
        <div className="relative">
           <div className="absolute top-0 left-0 flex items-center h-full pl-3 pointer-events-none">
            <Lock className="w-5 h-5 text-slate-400" />
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full py-3 pl-10 pr-4 text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contraseña" required />
        </div>

        {/* Selector de Roles */}
        <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
                <Users className="w-5 h-5 mr-2 text-slate-500" />
                Selecciona los roles:
            </label>
            <div className="grid grid-cols-2 gap-4 pt-2">
                {availableRoles.map((role) => (
                    <label key={role.id} className="flex items-center p-3 space-x-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer transition">
                        <input
                            type="checkbox"
                            checked={selectedRoles.includes(role.id)}
                            onChange={() => handleRoleChange(role.id)}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="font-medium text-slate-800">{role.name}</span>
                    </label>
                ))}
            </div>
        </div>

        <div>
          <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed flex justify-center items-center">
             {loading ? (
              <>
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </>
            ) : 'Registrarse'}
          </button>
        </div>
      </form>
      
      <p className="text-sm text-center text-slate-500">
        ¿Ya tienes una cuenta?{' '}
        <button onClick={() => setPage('login')} className="font-medium text-blue-600 hover:underline focus:outline-none">
          Inicia Sesión
        </button>
      </p>
    </div>
  );
};


// --- Componente Principal ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' o 'register'

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4">
      {currentPage === 'login' ? (
        <LoginPage setPage={setCurrentPage} />
      ) : (
        <RegistrationPage setPage={setCurrentPage} />
      )}
    </div>
  );
}
