// app/dashboard/settings/page.tsx
'use client';

import React, { useState } from 'react';

export default function ComandaCreatePage() {
  const [form, setForm] = useState({
    codigoComanda: '',
    numMesa: '',
    fechaPedido: '',
    horaPedido: '',
    estado: 'Pendiente',
    idUsuario: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      codigoComanda: form.codigoComanda,
      numMesa: parseInt(form.numMesa),
      fechaPedido: form.fechaPedido,
      horaPedido: form.horaPedido,
      estado: form.estado,
      usuario: {
        idUsuario: parseInt(form.idUsuario)
      }
    };

    try {
      const response = await fetch('http://localhost:8080/api/comandas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al registrar comanda');
      }

      alert('Comanda registrada exitosamente');
      setForm({
        codigoComanda: '',
        numMesa: '',
        fechaPedido: '',
        horaPedido: '',
        estado: 'Pendiente',
        idUsuario: ''
      });
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al registrar la comanda');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Registrar Comanda</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-xl">
        <div>
          <label className="block font-medium mb-1">Código de Comanda</label>
          <input
            type="text"
            name="codigoComanda"
            value={form.codigoComanda}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Número de Mesa</label>
          <input
            type="number"
            name="numMesa"
            value={form.numMesa}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Fecha del Pedido</label>
          <input
            type="date"
            name="fechaPedido"
            value={form.fechaPedido}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Hora del Pedido</label>
          <input
            type="time"
            name="horaPedido"
            value={form.horaPedido}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Estado</label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Finalizada">Finalizada</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">ID Usuario</label>
          <input
            type="number"
            name="idUsuario"
            value={form.idUsuario}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Registrar Comanda
        </button>
      </form>
    </div>
  );
}
