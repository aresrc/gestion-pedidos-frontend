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

const ESTADOS_DISPONIBLES = ['Entregado', 'Cancelada'];

export default function ComandaViewPage() {
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [selectedCodigo, setSelectedCodigo] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<string>('Entregado');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingEstado, setUpdatingEstado] = useState<boolean>(false);

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

  const cambiarEstado = async () => {
    if (!selectedCodigo) {
      alert('Por favor, selecciona una comanda primero.');
      return;
    }

    try {
      setUpdatingEstado(true);
      const res = await fetch(`http://localhost:8080/api/comandas/${selectedCodigo}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: selectedEstado }),
      });

      if (!res.ok) {
        throw new Error(`Error al cambiar estado: ${res.status} ${res.statusText}`);
      }

      const comandaActualizada: Comanda = await res.json();
      
      // Actualizar la lista de comandas con el nuevo estado
      setComandas(prev => 
        prev.map(comanda => 
          comanda.codigoComanda === selectedCodigo 
            ? { ...comanda, estado: comandaActualizada.estado }
            : comanda
        )
      );

      alert(`Estado de la comanda ${selectedCodigo} cambiado a: ${selectedEstado}`);
    } catch (err: any) {
      alert(`Error al cambiar estado: ${err.message}`);
    } finally {
      setUpdatingEstado(false);
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
            <div className="mt-4 flex flex-wrap gap-4 items-center">
              <button
                onClick={verComprobantes}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Ver Comprobantes
              </button>

              <div className="flex items-center gap-2">
                <label htmlFor="estado-select" className="text-sm font-medium text-gray-700">
                  Cambiar estado a:
                </label>
                <select
                  id="estado-select"
                  value={selectedEstado}
                  onChange={(e) => setSelectedEstado(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ESTADOS_DISPONIBLES.map(estado => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
                <button
                  onClick={cambiarEstado}
                  disabled={updatingEstado}
                  className={`px-4 py-2 text-white rounded ${
                    updatingEstado
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {updatingEstado ? 'Cambiando...' : 'Cambiar Estado'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
