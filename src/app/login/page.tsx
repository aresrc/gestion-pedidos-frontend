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

// Login real con API
const login = async (correo: string, contrasena: string) => {
  const response = await fetch('http://localhost:8080/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error en el login.');
  }

  const data = await response.json();
  // Guarda el token en cookie si lo usas
  document.cookie = `auth_token=${data.token}; path=/; max-age=3600`;
  return data;
};

// Registro real con API
const register = async (
  correo: string,
  contrasena: string,
  nombre: string,
  apellidoPat: string,
  apellidoMat: string,
  dni: string,
  id_rol: number
) => {
  const response = await fetch('http://localhost:8080/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      correo,
      contrasena,
      nombre,
      apellidoPat,
      apellidoMat,
      dni,
      id_rol,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error en el registro.');
  }

  return await response.json();
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
      await login(username, password);
      console.log(username, password);
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

const RegistrationPage = ({ setPage }: { setPage: React.Dispatch<React.SetStateAction<string>> }) => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apPat, setApPat] = useState('');
  const [apMat, setApMat] = useState('');
  const [dni, setDni] = useState('');
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!correo || !password || !nombre || !apPat || !apMat || !dni || selectedRole === null) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);

    try {
      const result = await register(correo, password, nombre, apPat, apMat, dni, selectedRole);
      setSuccess(result.message || '¡Usuario registrado con éxito!');
      // Limpiar campos
      setCorreo('');
      setPassword('');
      setNombre('');
      setApPat('');
      setApMat('');
      setDni('');
      setSelectedRole(null);
    } catch (err: any) {
      setError(err.message || 'Error durante el registro.');
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

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required className="input" />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="input" />
        <input type="text" placeholder="Apellido Paterno" value={apPat} onChange={(e) => setApPat(e.target.value)} required className="input" />
        <input type="text" placeholder="Apellido Materno" value={apMat} onChange={(e) => setApMat(e.target.value)} required className="input" />
        <input type="text" placeholder="DNI" value={dni} onChange={(e) => setDni(e.target.value)} required className="input" />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Selecciona un rol:</label>
          <div className="grid grid-cols-2 gap-4 pt-2">
            {availableRoles.map((role) => (
              <label key={role.id} className="flex items-center p-3 space-x-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer transition">
                <input
                  type="radio"
                  name="rol"
                  checked={selectedRole === role.id}
                  onChange={() => setSelectedRole(role.id)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span className="font-medium text-slate-800">{role.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none">
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p className="text-sm text-center text-slate-500">
        ¿Ya tienes una cuenta?{' '}
        <button onClick={() => setPage('login')} className="font-medium text-blue-600 hover:underline">
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
