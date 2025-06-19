'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';

const API_BASE_URL = 'http://localhost:8080/api';

interface ComandaItemDTO {
  idPlatillo: string;
  nombrePlatillo: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface ComandaDTO {
  id?: string;
  codigoComanda: string;
  numMesa: number;
  fechaPedido: string;
  horaPedido: string;
  estado: 'Pendiente' | 'En_preparacion' | 'Entregado' | 'Cancelada';
  total?: number; 
  items?: ComandaItemDTO[];
}

interface DatosCliente {
  dni: string;
  nombre: string;
  ruc: string;
  razonSocial: string;
  direccion: string;
}

export default function EmitirComprobantePage() {
  const [searchComandaCode, setSearchComandaCode] = useState('');
  const [comandaSeleccionada, setComandaSeleccionada] = useState<ComandaDTO | null>(null);
  const [tipoComprobante, setTipoComprobante] = useState<'boleta' | 'factura'>('boleta');
  const [datosCliente, setDatosCliente] = useState<DatosCliente>({
    dni: '',
    nombre: '',
    ruc: '',
    razonSocial: '',
    direccion: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [allComandas, setAllComandas] = useState<ComandaDTO[]>([]);
  const [filteredComandasDisplay, setFilteredComandasDisplay] = useState<ComandaDTO[]>([]);

  const fetchAllComandas = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.get<ComandaDTO[]>(`${API_BASE_URL}/comandas`);
      const fetchedComandas = response.data;
      setAllComandas(fetchedComandas);
      const canceladas = fetchedComandas.filter(c => c.estado === 'Cancelada');
      setFilteredComandasDisplay(canceladas);
    } catch (err) {
      console.error("Error al obtener todas las comandas:", err);
      setError("Error al cargar las comandas. Intente de nuevo.");
      setAllComandas([]);
      setFilteredComandasDisplay([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllComandas();
  }, [fetchAllComandas]);

  const handleFilterComandas = () => {
    setError(null);
    setSuccessMessage(null);

    const canceladas = allComandas.filter(c => c.estado === 'Cancelada');

    if (searchComandaCode.trim() === '') {
      setFilteredComandasDisplay(canceladas);
    } else {
      const found = canceladas.filter(
        (c) => c.codigoComanda.toLowerCase().includes(searchComandaCode.toLowerCase())
      );
      setFilteredComandasDisplay(found);
      if (found.length === 1) {
        handleSelectComanda(found[0]);
      } else if (found.length === 0 && searchComandaCode.trim() !== '') {
        setError('No se encontraron comandas canceladas con ese código.');
        setComandaSeleccionada(null);
      } else {
        setComandaSeleccionada(null);
      }
    }
  };

  const handleSelectComanda = async (comanda: ComandaDTO) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    setComandaSeleccionada(null);

    try {
      const detailedComanda = comanda.items && comanda.items.length > 0 ? comanda : (await axios.get<ComandaDTO>(`${API_BASE_URL}/comandas/${comanda.codigoComanda}`)).data;

      if (!detailedComanda.items) {
        detailedComanda.items = [];
      }

      setComandaSeleccionada(detailedComanda);
      setSearchComandaCode(detailedComanda.codigoComanda);
    } catch (err) {
      console.error(`Error al obtener detalles de la comanda ${comanda.codigoComanda}:`, err);
      setError(`Error al obtener detalles de la comanda ${comanda.codigoComanda}.`);
      setComandaSeleccionada(null);
    } finally {
      setIsLoading(false);
    }
  };


  const handleEmitirComprobante = () => {
    setError(null);
    setSuccessMessage(null);

    if (!comandaSeleccionada) {
      setError('Por favor, seleccione una comanda primero.');
      return;
    }

    const totalComanda = comandaSeleccionada.total ?? 0;

    if (tipoComprobante === 'boleta') {
      if (datosCliente.dni.length !== 8) {
        setError('Para Boleta, el DNI debe tener 8 dígitos.');
        return;
      }
      if (datosCliente.nombre.trim() === '') {
        setError('Para Boleta, el Nombre es obligatorio.');
        return;
      }
    } else { // Factura
      if (datosCliente.ruc.length !== 11) {
        setError('Para Factura, el RUC debe tener 11 dígitos.');
        return;
      }
      if (datosCliente.razonSocial.trim() === '') {
        setError('Para Factura, la Razón Social es obligatoria.');
        return;
      }
      if (datosCliente.direccion.trim() === '') {
        setError('Para Factura, la Dirección es obligatoria.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(async () => {
        const comprobantePayload = {
            codigoComanda: comandaSeleccionada.codigoComanda,
            tipo: tipoComprobante.toUpperCase(),
            fechaEmision: new Date().toISOString().split('T')[0],
            horaEmision: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
            total: totalComanda,
            datosCliente: tipoComprobante === 'boleta' ?
                          { dni: datosCliente.dni, nombre: datosCliente.nombre } :
                          { ruc: datosCliente.ruc, razonSocial: datosCliente.razonSocial, direccion: datosCliente.direccion },
        };
        console.log("Payload de Comprobante (simulado):", comprobantePayload);

      const nuevoComprobanteId = `COMP-${Math.floor(Math.random() * 10000)}`;
      setSuccessMessage(`Comprobante ${tipoComprobante.toUpperCase()} emitido con éxito. Código: ${nuevoComprobanteId}`);

      setComandaSeleccionada(null);
      setSearchComandaCode('');
      setDatosCliente({
        dni: '',
        nombre: '',
        ruc: '',
        razonSocial: '',
        direccion: '',
      });
      setTipoComprobante('boleta');
      
      fetchAllComandas();
      
      setIsLoading(false);
    }, 1000);
  };

  const isFormValid = useMemo(() => {
    if (!comandaSeleccionada) return false;

    if (tipoComprobante === 'boleta') {
      return (datosCliente.dni.length === 8 && datosCliente.nombre.trim() !== '');
    } else { // factura
      return (datosCliente.ruc.length === 11 && datosCliente.razonSocial.trim() !== '' && datosCliente.direccion.trim() !== '');
    }
  }, [comandaSeleccionada, tipoComprobante, datosCliente]);


  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Emitir Comprobante de Pago</h1>

      {successMessage && (
        <Alert className="mb-4 bg-green-100 border-green-500 text-green-700">
          <CheckCircledIcon className="h-4 w-4" />
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Sección 1: Búsqueda y Selección de Comanda */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>1. Seleccionar Comanda</CardTitle>
          <CardDescription>
            Busque una comanda por su código o seleccione una de la lista de comandas pagadas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Código de Comanda (Ej: COM001)"
              value={searchComandaCode}
              onChange={(e) => setSearchComandaCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFilterComandas();
                }
              }}
              disabled={isLoading}
            />
            <Button onClick={handleFilterComandas} disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Buscar/Filtrar'}
            </Button>
          </div>

          <Separator className="my-4" />

          <h3 className="font-semibold text-lg mb-2">Comandas Canceladas Disponibles:</h3>
          {isLoading && !comandaSeleccionada ? (
            <p className="text-center text-gray-500">Cargando comandas desde el backend...</p>
          ) : (
            <>
              {filteredComandasDisplay.length > 0 ? (
                <div className="overflow-x-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Mesa</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-center">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComandasDisplay.map((comanda) => (
                        <TableRow
                          key={comanda.codigoComanda}
                          className={comandaSeleccionada?.codigoComanda === comanda.codigoComanda ? 'bg-blue-50 dark:bg-blue-900' : ''}
                        >
                          <TableCell className="font-medium">{comanda.codigoComanda}</TableCell>
                          <TableCell>{comanda.numMesa}</TableCell>
                          <TableCell>{comanda.fechaPedido}</TableCell>
                          <TableCell>{comanda.horaPedido}</TableCell>
                          <TableCell className="text-right">S/. {(comanda.total ?? 0).toFixed(2)}</TableCell>
                          <TableCell className="text-center"><Badge variant="default">{comanda.estado}</Badge></TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectComanda(comanda)}
                              disabled={isLoading || comandaSeleccionada?.codigoComanda === comanda.codigoComanda}
                            >
                              {isLoading && comandaSeleccionada?.codigoComanda === comanda.codigoComanda ? 'Cargando...' :
                               comandaSeleccionada?.codigoComanda === comanda.codigoComanda ? 'Seleccionada' : 'Seleccionar'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-gray-500">No hay comandas canceladas disponibles.</p>
              )}
            </>
          )}

          {comandaSeleccionada && (
            <div className="mt-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold text-lg mb-2">Detalles de la Comanda Seleccionada: {comandaSeleccionada.codigoComanda}</h3>
              {isLoading && comandaSeleccionada.codigoComanda === searchComandaCode ? (
                  <p className="text-center text-gray-500">Cargando detalles de la comanda...</p>
              ) : (
                <>
                  <p>Mesa: {comandaSeleccionada.numMesa}</p>
                  <p>Fecha: {comandaSeleccionada.fechaPedido} - Hora: {comandaSeleccionada.horaPedido}</p>
                  <p className="flex items-center gap-2">Estado: <Badge>{comandaSeleccionada.estado}</Badge></p>

                  <Separator className="my-4" />

                  <h4 className="font-medium mb-2">Detalle de Ítems:</h4>
                  {comandaSeleccionada.items && comandaSeleccionada.items.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead className="text-right">Cantidad</TableHead>
                          <TableHead className="text-right">Precio Unitario</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {comandaSeleccionada.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.nombrePlatillo}</TableCell>
                            <TableCell className="text-right">{item.cantidad}</TableCell>
                            <TableCell className="text-right">S/. {item.precioUnitario.toFixed(2)}</TableCell>
                            <TableCell className="text-right">S/. {item.subtotal.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500">No hay detalles de ítems disponibles para esta comanda aún. (Se obtendrán del backend cuando el DTO esté completo)</p>
                  )}
                  <div className="text-right font-bold text-xl mt-4">
                    Total Comanda: S/. {(comandaSeleccionada.total ?? 0).toFixed(2)}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección 2: Tipo de Comprobante y Datos del Cliente */}
      {comandaSeleccionada && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Datos del Comprobante</CardTitle>
            <CardDescription>Seleccione el tipo de comprobante y complete los datos del cliente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              defaultValue="boleta"
              value={tipoComprobante}
              onValueChange={(value: 'boleta' | 'factura') => {
                setTipoComprobante(value);
                setDatosCliente({
                  dni: '',
                  nombre: '',
                  ruc: '',
                  razonSocial: '',
                  direccion: '',
                });
              }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boleta" id="boleta" />
                <Label htmlFor="boleta">Boleta</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="factura" id="factura" />
                <Label htmlFor="factura">Factura</Label>
              </div>
            </RadioGroup>

            <Separator />

            {tipoComprobante === 'boleta' ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
                    type="text"
                    placeholder="DNI del cliente (8 dígitos)"
                    maxLength={8}
                    value={datosCliente.dni}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) || value === '') {
                        setDatosCliente(prev => ({ ...prev, dni: value }));
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Nombre completo del cliente"
                    value={datosCliente.nombre}
                    onChange={(e) => setDatosCliente(prev => ({ ...prev, nombre: e.target.value }))}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ruc">RUC</Label>
                  <Input
                    id="ruc"
                    type="text"
                    placeholder="RUC de la empresa (11 dígitos)"
                    maxLength={11}
                    value={datosCliente.ruc}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) || value === '') {
                        setDatosCliente(prev => ({ ...prev, ruc: value }));
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">Razón Social</Label>
                  <Input
                    id="razonSocial"
                    type="text"
                    placeholder="Razón social de la empresa"
                    value={datosCliente.razonSocial}
                    onChange={(e) => setDatosCliente(prev => ({ ...prev, razonSocial: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    type="text"
                    placeholder="Dirección fiscal"
                    value={datosCliente.direccion}
                    onChange={(e) => setDatosCliente(prev => ({ ...prev, direccion: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleEmitirComprobante} disabled={isLoading || !isFormValid}>
              {isLoading ? 'Emitiendo...' : 'Emitir Comprobante'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}