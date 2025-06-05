// app/dashboard/layout.tsx
import React from 'react';
import Sidebar from '@/components/Sidebar'; // Use @/ for absolute path
import Navbar from '@/components/Navbar'; // Use @/ for absolute path

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        {' '}
        {/* ml-64 matches sidebar width */}
        <Navbar />
        <main className="flex-1 p-8 mt-16">
          {' '}
          {/* mt-16 to account for fixed navbar height */}
          {children}
        </main>
      </div>
    </div>
  );
}