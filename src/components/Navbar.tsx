// components/Navbar.tsx
'use client'; // This component might have client-side interactions (e.g., logout button)

import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center fixed top-0 left-64 right-0 z-10">
      <div className="text-xl font-semibold">Welcome to your Dashboard!</div>
      <div className="flex items-center">
        <span className="mr-4">John Doe</span>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;