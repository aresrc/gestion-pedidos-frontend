
'use client';

import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center fixed top-0 left-64 right-0 z-10">
      <div className="text-xl font-semibold text-gray-900">Bienvenido al Gestor de Pedidos!</div>
      <div className="flex items-center">
        <span className="mr-4 text-gray-900">UsuarioEjemplo</span>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;