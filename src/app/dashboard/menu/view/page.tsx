"use client"; 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';

interface PlatilloType {
  codigoPlatillo: string;
  nombre: string;
  detalle: string;
  precio: number;
}

interface MenuType {
  codigoMenu: string;
  idUsuario: number;
  categoria: string;
  platillos: string[];
}

const ConsultarMenuPage: React.FC = () => {
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [platillosDisponibles, setPlatillosDisponibles] = useState<PlatilloType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const getPlatilloNombres = (platilloCodes: string[]) => {
    return platilloCodes
      .map((code) => {
        const platillo = platillosDisponibles.find((p) => p.codigoPlatillo === code);
        return platillo ? platillo.nombre : `[${code} no encontrado]`;
      })
      .join(', ');
  };

  const fetchMenusAndPlatillos = async () => {
    try {
      const [menusRes, platillosRes] = await Promise.all([
        axios.get<MenuType[]>('http://localhost:8080/api/menus'),
        axios.get<PlatilloType[]>('http://localhost:8080/api/platillos'),
      ]);
      setMenus(menusRes.data);
      setPlatillosDisponibles(platillosRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los menús o platillos. Asegúrate de que el backend esté funcionando.');
    }
  };

  useEffect(() => {
    fetchMenusAndPlatillos();
  }, []);

  const filteredMenus = menus.filter((menu) =>
    menu.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.codigoMenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getPlatilloNombres(menu.platillos).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Consultar Menús</h1>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar menús por categoría, código o platillos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenus.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg">No hay menús disponibles o no se encontraron resultados.</p>
        ) : (
          filteredMenus.map((menu) => (
            <Card key={menu.codigoMenu} className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">{menu.categoria}</CardTitle>
                <p className="text-sm text-gray-500">Código: {menu.codigoMenu}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">ID Usuario Asociado:</span> {menu.idUsuario}
                </p>
                <p className="text-gray-700 font-medium mb-2">Platillos incluidos:</p>
                {menu.platillos && menu.platillos.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {menu.platillos.map((platilloCode) => {
                      const platillo = platillosDisponibles.find(p => p.codigoPlatillo === platilloCode);
                      return platillo ? (
                        <Badge key={platillo.codigoPlatillo} variant="secondary" className="bg-purple-100 text-purple-800 p-2">
                          {platillo.nombre} (S/.{platillo.precio.toFixed(2)})
                        </Badge>
                      ) : (
                        <Badge key={platilloCode} variant="destructive">
                          Platillo [{platilloCode}] no encontrado
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Este menú no tiene platillos asociados.</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsultarMenuPage;