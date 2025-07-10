// app/dashboard/comandas/create/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Definimos tipos para los datos
type Usuario = {
  idUsuario: number;
  nombre: string;
  roles: string[];
};

type Mesa = {
  idMesa: number;
  numero: number;
  estado: string;
  capacidad: number;
};

type Platillo = {
  idPlatillo: number;
  codigoPlatillo: string;
  nombre: string;
  detalle: string;
  precio: number;
  imagenUrl?: string; // Campo opcional para imágenes
};

export default function ComandaCreatePage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [meseros, setMeseros] = useState<Usuario[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    clienteId: '',
    meseroId: '',
    mesaId: '',
    estado: 'Pendiente'
  });

  // Estado para los platillos seleccionados: idPlatillo y cantidad
  const [platillosSeleccionados, setPlatillosSeleccionados] = useState<{id: number, cantidad: number}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener clientes
        const clientesRes = await fetch('http://localhost:8080/api/usuarios/clientes');
        if (!clientesRes.ok) throw new Error('Error al obtener clientes');
        const clientesData: Usuario[] = await clientesRes.json();
        setClientes(clientesData);

        // Obtener meseros
        const meserosRes = await fetch('http://localhost:8080/api/usuarios/meseros');
        if (!meserosRes.ok) throw new Error('Error al obtener meseros');
        const meserosData: Usuario[] = await meserosRes.json();
        setMeseros(meserosData);

        // Obtener mesas
        const mesasRes = await fetch('http://localhost:8080/api/mesas');
        if (!mesasRes.ok) throw new Error('Error al obtener mesas');
        const mesasData: Mesa[] = await mesasRes.json();
        setMesas(mesasData);

        // Obtener platillos
        const platillosRes = await fetch('http://localhost:8080/api/platillos');
        if (!platillosRes.ok) throw new Error('Error al obtener platillos');
        const platillosData: Platillo[] = await platillosRes.json();
        setPlatillos(platillosData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAgregarPlatillo = (platilloId: number) => {
    // Si el platillo ya está seleccionado, incrementar cantidad
    const existente = platillosSeleccionados.find(p => p.id === platilloId);
    
    if (existente) {
      setPlatillosSeleccionados(
        platillosSeleccionados.map(p => 
          p.id === platilloId ? {...p, cantidad: p.cantidad + 1} : p
        )
      );
    } else {
      // Agregar nuevo platillo con cantidad 1
      setPlatillosSeleccionados([...platillosSeleccionados, {id: platilloId, cantidad: 1}]);
    }
  };

  const handleCambiarCantidad = (platilloId: number, cantidad: number) => {
    if (cantidad < 1) {
      // Eliminar platillo si cantidad es 0
      setPlatillosSeleccionados(
        platillosSeleccionados.filter(p => p.id !== platilloId)
      );
    } else {
      // Actualizar cantidad
      setPlatillosSeleccionados(
        platillosSeleccionados.map(p => 
          p.id === platilloId ? {...p, cantidad} : p
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (platillosSeleccionados.length === 0) {
      alert('Selecciona al menos un platillo');
      return;
    }

    const ids = platillosSeleccionados.map(p => p.id).join(',');
    const cantidades = platillosSeleccionados.map(p => p.cantidad).join(',');

    const payload = {
      cliente_id: parseInt(form.clienteId),
      mesero_id: parseInt(form.meseroId),
      mesa_id: parseInt(form.mesaId),
      estado: form.estado,
      ids_platillo: ids,
      cantidades: cantidades
    };

    try {
      const response = await fetch('http://localhost:8080/api/comandas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error al registrar comanda');

      alert('Comanda registrada exitosamente');
      setForm({
        clienteId: '',
        meseroId: '',
        mesaId: '',
        estado: 'Pendiente'
      });
      setPlatillosSeleccionados([]);
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al registrar la comanda');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><p>Cargando...</p></div>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  // Filtrar mesas disponibles
  const mesasDisponibles = mesas.filter(m => m.estado === 'Disponible');

  // Obtener detalles de platillos seleccionados
  const platillosConDetalles = platillosSeleccionados.map(ps => {
    const platillo = platillos.find(p => p.idPlatillo === ps.id);
    return {
      ...ps,
      nombre: platillo?.nombre || '',
      precio: platillo?.precio || 0,
      imagenUrl: platillo?.imagenUrl
    };
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Registrar Comanda</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Selección de Cliente */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Cliente</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {clientes.map(cliente => (
                <div 
                  key={cliente.idUsuario}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    form.clienteId === cliente.idUsuario.toString() 
                      ? 'bg-blue-100 border border-blue-300' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setForm({...form, clienteId: cliente.idUsuario.toString()})}
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12 mr-3" />
                  <div>
                    <p className="font-medium">{cliente.nombre}</p>
                    <p className="text-sm text-gray-600">{cliente.roles.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selección de Mesero */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Mesero</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {meseros.map(mesero => (
                <div 
                  key={mesero.idUsuario}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    form.meseroId === mesero.idUsuario.toString() 
                      ? 'bg-blue-100 border border-blue-300' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setForm({...form, meseroId: mesero.idUsuario.toString()})}
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12 mr-3" />
                  <div>
                    <p className="font-medium">{mesero.nombre}</p>
                    <p className="text-sm text-gray-600">{mesero.roles.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selección de Mesa */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Mesa</h2>
            <div className="grid grid-cols-2 gap-3">
              {mesasDisponibles.map(mesa => (
                <div 
                  key={mesa.idMesa}
                  className={`border rounded-lg p-3 text-center cursor-pointer ${
                    form.mesaId === mesa.idMesa.toString() 
                      ? 'bg-green-100 border-green-500' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setForm({...form, mesaId: mesa.idMesa.toString()})}
                >
                  <div className="text-2xl font-bold">Mesa {mesa.numero}</div>
                  <div className="text-sm text-gray-600">Capacidad: {mesa.capacidad}</div>
                  <div className="text-xs mt-1 px-2 py-1 bg-green-200 text-green-800 rounded-full inline-block">
                    Disponible
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Estado de la comanda */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Estado de la Comanda</h2>
          <div className="flex flex-wrap gap-2">
            {['Pendiente', 'Preparando', 'Listo', 'Servido', 'Cancelada'].map(estado => (
              <button
                key={estado}
                type="button"
                className={`px-4 py-2 rounded-full ${
                  form.estado === estado
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => setForm({...form, estado})}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>

        {/* Platillos seleccionados */}
        {platillosConDetalles.length > 0 && (
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Platillos Seleccionados</h2>
            <div className="space-y-3">
              {platillosConDetalles.map((platillo, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mr-4" />
                    <div>
                      <p className="font-medium">{platillo.nombre}</p>
                      <p className="text-sm text-gray-600">S/. {platillo.precio.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      onClick={() => handleCambiarCantidad(platillo.id, platillo.cantidad - 1)}
                    >
                      -
                    </button>
                    <span className="mx-3 w-8 text-center">{platillo.cantidad}</span>
                    <button
                      type="button"
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      onClick={() => handleCambiarCantidad(platillo.id, platillo.cantidad + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catálogo de platillos */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Seleccionar Platillos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platillos.map(platillo => (
              <div 
                key={platillo.idPlatillo}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleAgregarPlatillo(platillo.idPlatillo)}
              >
                <div className="bg-gray-200 border-2 border-dashed w-full h-40" />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{platillo.nombre}</h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      S/. {platillo.precio.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">{platillo.detalle}</p>
                  <div className="mt-3 flex justify-end">
                    <button 
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAgregarPlatillo(platillo.idPlatillo);
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg"
          >
            Registrar Comanda
          </button>
        </div>
      </form>
    </div>
  );
}