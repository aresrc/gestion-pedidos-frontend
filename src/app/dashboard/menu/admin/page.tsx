'use client';

import React, { useState, useEffect } from 'react';

// Tipo para un Platillo (viene de /api/platillos)
type Platillo = {
  codigoPlatillo: string;
  nombre: string;
  detalle: string;
  precio: number;
};

// Tipo para un Menu (lo que vamos a administrar, viene de /api/menus)
type MenuType = {
  codigoMenu: string;
  idUsuario: number;
  categoria: string;
  platillos: string[];
};

export default function AdminMenuPage() {
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [platillosDisponibles, setPlatillosDisponibles] = useState<Platillo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingMenu, setEditingMenu] = useState<MenuType | null>(null);

  // Estado del formulario para crear/editar un MENÚ
  const [formData, setFormData] = useState<MenuType>({
    codigoMenu: '',
    idUsuario: 1,
    categoria: '',
    platillos: [],
  });

  // Efecto para cargar MENÚS y PLATILLOS DISPONIBLES al inicio
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Obtener Platillos disponibles
        const platillosRes = await fetch('http://localhost:8080/api/platillos');
        if (!platillosRes.ok) {
          throw new Error(`Error al obtener platillos: ${platillosRes.status} ${platillosRes.statusText}`);
        }
        const platillosData: Platillo[] = await platillosRes.json();
        setPlatillosDisponibles(platillosData);

        // 2. Obtener Menús existentes
        const menusRes = await fetch('http://localhost:8080/api/menus');
        if (!menusRes.ok) {
          throw new Error(`Error al obtener menús: ${menusRes.status} ${menusRes.statusText}`);
        }
        const menusData: MenuType[] = await menusRes.json();
        setMenus(menusData);

      } catch (err: any) {
        setError(err.message || 'Error desconocido al cargar datos.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Manejador de cambios en el formulario para los campos del MENÚ
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'idUsuario' ? parseInt(value) || 0 : value,
    }));
  };

  // Manejador para la selección de platillos
  const handlePlatilloSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.options);
    const selectedPlatillos = options
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData((prev) => ({
      ...prev,
      platillos: selectedPlatillos,
    }));
  };


  // Manejador para abrir el formulario y precargarlo si se edita
  const handleOpenForm = (menuToEdit: MenuType | null = null) => {
    setIsFormOpen(true);
    if (menuToEdit) {
      setEditingMenu(menuToEdit);
      setFormData({
        codigoMenu: menuToEdit.codigoMenu,
        idUsuario: menuToEdit.idUsuario,
        categoria: menuToEdit.categoria,
        platillos: menuToEdit.platillos,
      });
    } else {
      setEditingMenu(null);
      setFormData({ 
        codigoMenu: '',
        idUsuario: 1,
        categoria: '',
        platillos: [],
      });
    }
  };

  // Manejador para cerrar el formulario
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMenu(null);
    setFormData({ 
      codigoMenu: '',
      idUsuario: 1,
      categoria: '',
      platillos: [],
    });
  };

  // Manejador para enviar el formulario (Crear o Actualizar MENÚ)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // El payload ya es directamente formData porque coincide con MenuDTO
    const payload = formData;

    try {
      const url = editingMenu
        ? `http://localhost:8080/api/menus/${editingMenu.codigoMenu}`
        : 'http://localhost:8080/api/menus';
      const method = editingMenu ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = `Error al ${editingMenu ? 'actualizar' : 'crear'} el menú.`;
        if (response.status === 400 && errorData) {
            errorMessage += '\nErrores de validación:';
            // Manejar errores de validación si el backend los devuelve en un formato específico
            for (const key in errorData) {
                if (Object.prototype.hasOwnProperty.call(errorData, key)) {
                    errorMessage += `\n- ${key}: ${errorData[key]}`;
                }
            }
        } else {
            errorMessage += `\nEstado: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Recargar la lista de menús y platillos después de una operación exitosa
      // (ya que las relaciones pueden haber cambiado o un nuevo menú se añadió)
      alert(`Menú ${editingMenu ? 'actualizado' : 'añadido'} exitosamente!`);
      handleCloseForm();
      // Refetch all data to ensure consistency
      setLoading(true); // Mostrar carga mientras se actualiza
      const menusRes = await fetch('http://localhost:8080/api/menus');
      const menusData: MenuType[] = await menusRes.json();
      setMenus(menusData);

      const platillosRes = await fetch('http://localhost:8080/api/platillos');
      const platillosData: Platillo[] = await platillosRes.json();
      setPlatillosDisponibles(platillosData);
      setLoading(false);

    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // Manejador para eliminar un MENÚ
  const handleDelete = async (codigoMenu: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el menú con código ${codigoMenu}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/menus/${codigoMenu}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el menú: ${response.status} ${response.statusText}`);
      }

      setMenus((prev) => prev.filter((menu) => menu.codigoMenu !== codigoMenu));
      alert('Menú eliminado exitosamente!');
    } catch (err: any) {
      console.error(err);
      alert(`Ocurrió un error al eliminar el menú: ${err.message}`);
    }
  };

  // Función auxiliar para mostrar los nombres de los platillos en la lista
  const getPlatilloNombres = (platilloCodes: string[]) => {
    return platilloCodes.map(code => {
      const platillo = platillosDisponibles.find(p => p.codigoPlatillo === code);
      return platillo ? platillo.nombre : `[${code} no encontrado]`;
    }).join(', ');
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Administrar Menús</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <button
          onClick={() => handleOpenForm()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Añadir Nuevo Menú
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              {editingMenu ? 'Editar Menú' : 'Añadir Nuevo Menú'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Código del Menú</label>
                <input
                  type="text"
                  name="codigoMenu"
                  value={formData.codigoMenu}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                  disabled={!!editingMenu}
                />
                {editingMenu && <p className="text-sm text-gray-500 mt-1">El código del menú no se puede cambiar al editar.</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">ID de Usuario</label>
                <input
                  type="number"
                  name="idUsuario"
                  value={formData.idUsuario}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Categoría</label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Platillos del Menú</label>
                <select
                  name="platillos"
                  multiple
                  value={formData.platillos}
                  onChange={handlePlatilloSelectionChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-40"
                  required
                >
                  {platillosDisponibles.length > 0 ? (
                    platillosDisponibles.map((platillo) => (
                      <option key={platillo.codigoPlatillo} value={platillo.codigoPlatillo}>
                        {platillo.nombre} (S/. {platillo.precio.toFixed(2)}) - {platillo.detalle}
                      </option>
                    ))
                  ) : (
                    <option disabled>No hay platillos disponibles. Asegúrate de que existan en el backend.</option>
                  )}
                </select>
                <p className="text-sm text-gray-500 mt-1">Mantén "Ctrl" para seleccionar múltiples platillos.</p>
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
                  {editingMenu ? 'Guardar Cambios' : 'Añadir Menú'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <p>Cargando datos...</p>}
      {error && <p className="text-red-600 mb-4">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {menus.length > 0 ? (
            menus.map((menu) => (
              <div key={menu.codigoMenu} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">Menú: {menu.codigoMenu}</h2>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Categoría:</span> {menu.categoria}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-medium">ID Usuario:</span> {menu.idUsuario}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-medium">Platillos:</span>{' '}
                    {menu.platillos && menu.platillos.length > 0
                      ? getPlatilloNombres(menu.platillos)
                      : 'Ninguno'}
                  </p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleOpenForm(menu)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(menu.codigoMenu)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">No hay menús. ¡Añade uno!</p>
          )}
        </div>
      )}
    </div>
  );
}