// app/dashboard/settings/page.tsx
import React from 'react';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Configuracion</h1> {/* Added text-gray-900 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Añadir valores de configuracion</p>
        {/* Add settings forms, options, etc. */}
      </div>
    </div>
  );
}