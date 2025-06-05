// components/Sidebar.tsx
'use client'; // This component uses Next.js Link and client-side interaction

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook to get current path
import React from 'react';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard Overview', href: '/dashboard' },
    { name: 'Profile', href: '/dashboard/profile' },
    { name: 'Settings', href: '/dashboard/settings' },
    { name: 'Reports', href: '/dashboard/reports' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4 fixed top-0 left-0 flex flex-col z-20">
      <div className="text-2xl font-bold mb-6 text-center">My Dashboard</div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={`block py-2 px-4 rounded hover:bg-gray-700 ${
                  pathname === item.href ? 'bg-gray-700 font-semibold' : ''
                }`}
              >
                {item.name}
              </Link>
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