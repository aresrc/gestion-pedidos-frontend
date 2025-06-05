// components/Sidebar.tsx
'use client'; // This component uses Next.js Link and client-side interaction

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook to get current path
import React, {useState} from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'; // Iconos de flecha

const Sidebar = () => {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const navItems = [
    { name: 'Dashboard Overview', href: '/dashboard' },
    { name: 'Comandas',
      subItems: [
        { name: 'Registrar Comanda', href: '/dashboard/comandas/create' },
        { name: 'Mostrar Comandas', href: '/dashboard/comandas/view' },
      ]
    },
    { name: 'Perfil', href: '/dashboard/profile' },
    { name: 'Configuración', href: '/dashboard/settings' },
    { name: 'Reportes', href: '/dashboard/reports' },
  ];

  const toggleSubmenu = () => setOpenSubmenu(!openSubmenu);

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4 fixed top-0 left-0 flex flex-col z-20">
      <div className="text-2xl font-bold mb-6 text-center">My Dashboard</div>
      <nav>
        <ul>
        {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              {item.subItems ? (
                <>
                  <button
                    onClick={toggleSubmenu}
                    className={`w-full flex justify-between items-center py-2 px-4 rounded hover:bg-gray-700 ${
                      pathname.startsWith('/dashboard/comandas') ? 'bg-gray-700 font-semibold' : ''
                    }`}
                  >
                    <span>{item.name}</span>
                    {openSubmenu ? (
                      <FaChevronDown className="ml-2 text-sm" />
                    ) : (
                      <FaChevronRight className="ml-2 text-sm" />
                    )}
                  </button>
                  {openSubmenu && (
                    <ul className="ml-4 mt-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={`block py-1 px-4 rounded hover:bg-gray-700 text-sm ${
                              pathname === subItem.href ? 'bg-gray-700 font-semibold' : ''
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`block py-2 px-4 rounded hover:bg-gray-700 ${
                    pathname === item.href ? 'bg-gray-700 font-semibold' : ''
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-center text-sm text-gray-400">
        &copy; 2025 My Dashboard
      </div>
    </div>
  );
};

export default Sidebar;