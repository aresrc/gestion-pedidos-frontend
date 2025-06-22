'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  // Llama al hook en el nivel superior del componente
  const router = useRouter(); 

  const handleLogout = () => {
    // Ahora puedes usar el objeto 'router' que ya obtuviste
    
    // 1. Elimina la cookie de autenticación.
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // 2. Redirige al usuario a la página de login.
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center fixed top-0 left-64 right-0 z-10">
      <div className="text-xl font-semibold text-gray-900">¡Bienvenido al Gestor de Pedidos!</div>
      <div className="flex items-center">
        <span className="mr-4 text-gray-900">Administrador</span>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;