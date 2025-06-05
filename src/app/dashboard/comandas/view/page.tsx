// app/dashboard/comandas/view/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

type Rol = {
  idRol: number;
  nombreRol: string;
};

type Usuario = {
  idUsuario: number;
  nombre: string;
  roles: Rol[];
};

type Comanda = {
  codigoComanda: string;
  usuario: Usuario;
  numMesa: number;
  fechaPedido: string;
  horaPedido: string;
  estado: string;
  comprobantes: any[];
};

export default function ComandaViewPage() {
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [selectedCodigo, setSelectedCodigo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComandas() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('http://localhost:8080/api/comandas');
        if (!res.ok) {
          throw new Error(`Error al obtener comandas: ${res.status} ${res.statusText}`);
        }
        const data: Comanda[] = await res.json();
        setComandas(data);
      } catch (err: any) {
        setError(err.message || 'Error desconocido al obtener comandas.');
      } finally {
        setLoading(false);
      }
    }
    fetchComandas();
  }, []);

  const handleRowClick = (codigoComanda: string) => {
    setSelectedCodigo(codigoComanda);
  };

  const verComprobantes = () => {
    if (!selectedCodigo) {
      alert('Por favor, selecciona una comanda primero.');
      return;
    }
    const comandaSeleccionada = comandas.find(c => c.codigoComanda === selectedCodigo);
    if (comandaSeleccionada) {
      alert(
        `Comprobantes para ${selectedCodigo}: \n` +
          (comandaSeleccionada.comprobantes.length > 0
            ? JSON.stringify(comandaSeleccionada.comprobantes, null, 2)
            : 'No hay comprobantes.')
      );
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mostrar Comandas</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading && <p>Cargando comandas...</p>}
        {error && <p className="text-red-600 mb-4">Error: {error}</p>}
        {!loading && !error && (
          <>
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Código</th>
                  <th className="border border-gray-300 px-4 py-2">Usuario</th>
                  <th className="border border-gray-300 px-4 py-2">Mesa</th>
                  <th className="border border-gray-300 px-4 py-2">Fecha Pedido</th>
                  <th className="border border-gray-300 px-4 py-2">Hora Pedido</th>
                  <th className="border border-gray-300 px-4 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {comandas.map(comanda => {
                  const isSelected = selectedCodigo === comanda.codigoComanda;
                  return (
                    <tr
                      key={comanda.codigoComanda}
                      className={`cursor-pointer ${
                        isSelected ? 'bg-blue-200' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleRowClick(comanda.codigoComanda)}
                    >
                      <td className="border border-gray-300 px-4 py-2">{comanda.codigoComanda}</td>
                      <td className="border border-gray-300 px-4 py-2">{comanda.usuario.nombre}</td>
                      <td className="border border-gray-300 px-4 py-2">{comanda.numMesa}</td>
                      <td className="border border-gray-300 px-4 py-2">{comanda.fechaPedido}</td>
                      <td className="border border-gray-300 px-4 py-2">{comanda.horaPedido}</td>
                      <td className="border border-gray-300 px-4 py-2">{comanda.estado}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
              onClick={verComprobantes}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ver Comprobantes
            </button>
          </>
        )}
      </div>
    </div>
  );
}
