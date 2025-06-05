"use client";

import React, { useState } from 'react';
import LayoutConSidebar from '@/app/components/LayoutConSidebar';

interface DetallePedidoItem {
  id: string; 
  descripcion: string;
  cantidad: number;
  precio: number;
}

export default function RegistrarComandaPage(){
    const [formData, setFormData] = useState({
    nombreCliente: '',
    numeroMesa: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const [detallesPedido, setDetallesPedido] = useState<DetallePedidoItem[]>([]);

  const [platilloActual, setPlatilloActual] = useState({
    descripcion: '',
    cantidad: 1,
    precio: 0,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handlePlatilloChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setPlatilloActual(prevPlatillo => ({
      ...prevPlatillo,
      [name]: (name === 'cantidad' || name === 'precio')
                ? (name === 'cantidad' ? parseInt(value) : parseFloat(value)) || 0
                : value,
    }));
  };

  const handleAddPlatillo = () => {
    if (!platilloActual.descripcion.trim()) {
      alert('La descripción del platillo no puede estar vacía.');
      return;
    }
    if (platilloActual.cantidad <= 0 || isNaN(platilloActual.cantidad)) {
      alert('La cantidad debe ser un número entero mayor a cero.');
      return;
    }
    if (platilloActual.precio < 0 || isNaN(platilloActual.precio)) {
      alert('El precio debe ser un número válido y no negativo.');
      return;
    }

    const nuevoItem: DetallePedidoItem = {
      id: Date.now().toString(),
      ...platilloActual
    };
    setDetallesPedido(prevDetalles => [...prevDetalles, nuevoItem]);
    setPlatilloActual({ descripcion: '', cantidad: 1, precio: 0 });
  };

  const handleRemovePlatillo = (idToRemove: string) => {
    setDetallesPedido(prevDetalles =>
      prevDetalles.filter(item => item.id !== idToRemove)
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (detallesPedido.length === 0) {
      alert('Por favor, añada al menos un platillo a la comanda.');
      return;
    }
    const comandaCompleta = {
      ...formData,
      detalles: detallesPedido,
    };
    console.log('Comanda Completa para enviar:', comandaCompleta);
    alert('Comanda procesada. Revisa la consola para ver los datos.');
    setFormData({
      nombreCliente: '',
      numeroMesa: '',
      fecha: new Date().toISOString().split('T')[0],
    });
    setDetallesPedido([]);
  };

  return (
    <LayoutConSidebar>
      <div className="container mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Registrar Nueva Comanda</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <fieldset className="border border-gray-200 p-4 rounded-md">
            <legend className="text-lg font-semibold text-gray-700 px-2">Datos Generales</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label htmlFor="nombreCliente" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  name="nombreCliente"
                  id="nombreCliente"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  value={formData.nombreCliente}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="numeroMesa" className="block text-sm font-medium text-gray-700 mb-1">Número de Mesa</label>
                <input
                  type="number"
                  name="numeroMesa"
                  id="numeroMesa"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  value={formData.numeroMesa}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  id="fecha"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </fieldset>

          {/*Sección Detalle de la Comanda*/}
          <fieldset className="border border-gray-200 p-4 rounded-md">
            <legend className="text-lg font-semibold text-gray-700 px-2">Detalle del Pedido</legend>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mt-2 mb-4">
              <div>
                <label htmlFor="descripcionPlatillo" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  id="descripcionPlatillo"
                  placeholder="Ej: Papa Rellena"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  value={platilloActual.descripcion}
                  onChange={handlePlatilloChange}
                />
              </div>
              <div>
                <label htmlFor="cantidadPlatillo" className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  id="cantidadPlatillo"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  value={platilloActual.cantidad === 0 ? '' : platilloActual.cantidad}
                  onChange={handlePlatilloChange}
                  min="1"
                />
              </div>
              <div>
                <label htmlFor="precioPlatillo" className="block text-sm font-medium text-gray-700 mb-1">Precio Unit.</label>
                <input
                  type="number"
                  name="precio"
                  id="precioPlatillo"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  value={platilloActual.precio === 0 ? '' : platilloActual.precio}
                  onChange={handlePlatilloChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                type="button"
                onClick={handleAddPlatillo}
                className="w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 md:mt-0 mt-4 transition duration-150 ease-in-out"
              >
                Añadir Platillo
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Platillos Agregados:</h3>
              {detallesPedido.length === 0 ? (
                <p className="text-gray-500 text-sm">Aún no se han agregado platillos.</p>
              ) : (
                <ul className="space-y-2">
                  {detallesPedido.map((item, index) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-md bg-blue-50 text-gray-800 shadow-sm"
                    >
                      <span className="text-sm sm:text-base font-medium">
                        {index + 1}. {item.descripcion} (x{item.cantidad}) - S/ {(item.precio * item.cantidad).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemovePlatillo(item.id)}
                        className="ml-4 p-1 rounded-full text-red-600 hover:bg-red-100 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                        title="Eliminar Platillo"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </fieldset>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Guardar Comanda
            </button>
          </div>
        </form>
      </div>
    </LayoutConSidebar>
  );
}