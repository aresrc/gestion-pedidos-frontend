'use client';

import React, { useState, useEffect } from 'react';

type MenuItem = {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string;
};

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Estado del formulario para crear/editar
  const [formData, setFormData] = useState<MenuItem>({
    nombre: '',
    precio: 0,
    descripcion: '',
    imagenUrl: '',
  });

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:8080/api/menus');
        if (!res.ok) {
          throw new Error(`Error al obtener el menú: ${res.status} ${res.statusText}`);
        }
        const data: MenuItem[] = await res.json();
        setMenuItems(data);
      } catch (err: any) {
        setError(err.message || 'Error desconocido al obtener el menú.');
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, []);

  // Manejador de cambios en el formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'precio' ? parseFloat(value) || 0 : value,
    }));
  };

  // Manejador para abrir el formulario y precargarlo si se edita
  const handleOpenForm = (itemToEdit: MenuItem | null = null) => {
    setIsFormOpen(true);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setFormData({
        id: itemToEdit.id,
        nombre: itemToEdit.nombre,
        precio: itemToEdit.precio,
        descripcion: itemToEdit.descripcion,
        imagenUrl: itemToEdit.imagenUrl || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '',
        precio: 0,
        descripcion: '',
        imagenUrl: '',
      });
    }
  };

  // Manejador para cerrar el formulario
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({
      nombre: '',
      precio: 0,
      descripcion: '',
      imagenUrl: '',
    });
  };

  // Manejador para enviar el formulario (Crear o Actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: formData.precio,
    };

    try {
      const url = editingItem
        ? `http://localhost:8080/api/menus/${editingItem.id}`
        : 'http://localhost:8080/api/menus';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = `Error al ${editingItem ? 'actualizar' : 'crear'} el platillo.`;
        if (response.status === 400 && errorData) {
            errorMessage += '\nErrores de validación:';
            for (const field in errorData) {
                errorMessage += `\n- ${field}: ${errorData[field]}`;
            }
        } else {
            errorMessage += `\nEstado: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const updatedItem: MenuItem = await response.json();

      const itemWithFrontendExtras: MenuItem = {
        ...updatedItem,
        imagenUrl: formData.imagenUrl,
      };

      if (editingItem) {
        setMenuItems((prev) =>
          prev.map((item) => (item.id === itemWithFrontendExtras.id ? itemWithFrontendExtras : item))
        );
        alert('Platillo actualizado exitosamente!');
      } else {
        setMenuItems((prev) => [...prev, itemWithFrontendExtras]);
        alert('Platillo añadido exitosamente!');
      }

      handleCloseForm();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // Manejador para eliminar un ítem del menú
  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (!confirm('¿Estás seguro de que deseas eliminar este platillo?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/menus/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el platillo: ${response.status} ${response.statusText}`);
      }

      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      alert('Platillo eliminado exitosamente!');
    } catch (err: any) {
      console.error(err);
      alert(`Ocurrió un error al eliminar el platillo: ${err.message}`);
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Administrar Menú</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <button
          onClick={() => handleOpenForm()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Añadir Nuevo Platillo
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              {editingItem ? 'Editar Platillo' : 'Añadir Nuevo Platillo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Nombre del Platillo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Detalle (Ingredientes)</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-y"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block font-medium mb-1">URL de Imagen (opcional)</label>
                <input
                  type="url"
                  name="imagenUrl"
                  value={formData.imagenUrl || ''}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  {editingItem ? 'Guardar Cambios' : 'Añadir Platillo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <p>Cargando menú...</p>}
      {error && <p className="text-red-600 mb-4">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <div key={item.id || item.nombre} className="bg-white rounded-lg shadow-md overflow-hidden">
              {item.imagenUrl && (
                <img
                  src={item.imagenUrl}
                  alt={item.nombre}
                  className="w-full h-48 object-cover"
                />
              )}
              {!item.imagenUrl && (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.nombre}</h2>
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Ingredientes:</span> {item.descripcion}
                </p>
                <p className="text-lg font-bold text-blue-600 mb-2">S/. {item.precio.toFixed(2)}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleOpenForm(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          {menuItems.length === 0 && !loading && (
            <p className="text-gray-600 col-span-full text-center">No hay platillos en el menú. ¡Añade uno!</p>
          )}
        </div>
      )}
    </div>
  );
}