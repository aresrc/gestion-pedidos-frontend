"use client";

import React, { useState, useEffect } from 'react';
import LayoutConSidebar from '@/app/components/LayoutConSidebar';

interface Comanda {
  codigoComanda: string;
  numMesa: number;
  fechaPedido: string; 
  horaPedido: string;
  estado: 'Pendiente' | 'En_preparación' | 'Entregado' | 'Cancelada';
}

export default function ConsultarComandaPage() {
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComandas = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/comandas');

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data: Comanda[] = await response.json();
        setComandas(data);
      } catch (err) {
        console.error("Error al obtener las comandas:", err);
        setError("No se pudieron cargar las comandas. Asegúrate de que el backend esté corriendo.");
      } finally {
        setLoading(false);
      }
    };

    fetchComandas();
  }, []);

  if (loading) {
    return (
      <LayoutConSidebar>
        <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Consultar Comandas</h1>
          <p className="text-gray-600">Cargando comandas...</p>
        </div>
      </LayoutConSidebar>
    );
  }

  if (error) {
    return (
      <LayoutConSidebar>
        <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Consultar Comandas</h1>
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </LayoutConSidebar>
    );
  }

  return (
    <LayoutConSidebar>
      <div className="container mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Consultar Comandas</h1>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
          {comandas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay comandas registradas aún.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Código
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Mesa
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Hora
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comandas.map((comanda) => (
                  <tr key={comanda.codigoComanda} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {comanda.codigoComanda}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {comanda.numMesa}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {comanda.fechaPedido}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {comanda.horaPedido}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          comanda.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          comanda.estado === 'En_preparación' ? 'bg-blue-100 text-blue-800' :
                          comanda.estado === 'Entregado' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                        {comanda.estado.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </LayoutConSidebar>
  );
}