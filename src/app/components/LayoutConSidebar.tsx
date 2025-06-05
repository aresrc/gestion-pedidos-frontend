import React from 'react';
import Link from 'next/link';

interface LayoutConSidebarProps {
  children: React.ReactNode;
}

export default function LayoutConSidebar({ children }: LayoutConSidebarProps) {
  return (
    <div className="flex h-screen bg-gray-100"> 
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <div className="text-2xl font-bold mb-8 text-center text-indigo-300">
          La Casita D. Picarón
        </div>
        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <Link href="/comandas/registrar" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200">
                Registrar Comanda
              </Link>
            </li>
            <li>
              <Link href="/comandas/consultar" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200">
                Consultar Comanda
              </Link>
            </li>
            <li>
              <Link href="/menu" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200">
                Gestión de Menú
              </Link>
            </li>
            <li>
              <Link href="/reportes" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200">
                Reportes
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-700 text-sm text-gray-400">
          <p className="text-center">© {new Date().getFullYear()} La Casita D. Picarón</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}