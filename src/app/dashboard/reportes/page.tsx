'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon, CheckCircledIcon, DownloadIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

const API_BASE_URL = 'http://localhost:8080';

interface ReporteVentaDTO {
  codigoComprobante: string;
  codigoComanda: string;
  totalVenta: number;
  idUsuario: number;
  tipoReporte: string;
  fechaInicio: string;
  fechaFin: string;
}

interface ResumenReporteDTO {
  totalVentas: number;
  platoMasVendido: string;
  platoMenosVendido: string;
  fechaInicio: string;
  fechaFin: string;
}

interface VentasPorCategoriaDTO {
  categoria: string;
  totalVendido: number;
  cantidadPlatillos: number;
}


export default function GenerarReportePage() {
  const [fechaInicio, setFechaInicio] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [fechaFin, setFechaFin] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tipoReporte, setTipoReporte] = useState<'resumen' | 'detallado' | 'por-categoria'>('resumen');
  
  const [resumenData, setResumenData] = useState<ResumenReporteDTO | null>(null);
  const [detalladoData, setDetalladoData] = useState<ReporteVentaDTO[] | null>(null);
  const [ventasPorCategoriaData, setVentasPorCategoriaData] = useState<VentasPorCategoriaDTO[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearReportData = () => {
    setResumenData(null);
    setDetalladoData(null);
    setVentasPorCategoriaData(null);
  };

  const handleGenerateReport = useCallback(async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    clearReportData();

    try {
      if (!fechaInicio || !fechaFin) {
        setError("Por favor, selecciona un rango de fechas válido.");
        setIsLoading(false); 
        return;
      }

      let response;
      switch (tipoReporte) {
        case 'resumen':
          response = await axios.get<ResumenReporteDTO>(`${API_BASE_URL}/reportes/resumen`, {
            params: { inicio: fechaInicio, fin: fechaFin },
          });
          setResumenData(response.data);
          break;
        case 'detallado':
          response = await axios.get<ReporteVentaDTO[]>(`${API_BASE_URL}/reportes/ventas`, {
            params: { inicio: fechaInicio, fin: fechaFin },
          });
          setDetalladoData(response.data);
          break;
        case 'por-categoria':
          // Lógica simulada de datos.
          setVentasPorCategoriaData([
            { categoria: 'Bebidas', totalVendido: 150.75, cantidadPlatillos: 30 },
            { categoria: 'Entradas', totalVendido: 210.50, cantidadPlatillos: 15 },
            { categoria: 'Platos Fuertes', totalVendido: 890.20, cantidadPlatillos: 45 },
            { categoria: 'Postres', totalVendido: 95.00, cantidadPlatillos: 10 },
          ]);
          break;
        default:
          setError("Tipo de reporte no válido.");
          break;
      }
      setSuccessMessage(`Reporte de ${tipoReporte} generado exitosamente.`);
    } catch (err: any) {
      console.error("Error al generar reporte:", err);
      setError(err.response?.data?.message || 'Error desconocido al generar el reporte. Asegúrate de que el backend esté corriendo y los datos sean válidos.');
    } finally {
      setIsLoading(false);
    }
  }, [fechaInicio, fechaFin, tipoReporte]);

  const handleExportPdf = () => {
    console.log('Se ha solicitado la exportación a PDF.');
    setSuccessMessage('Solicitud de exportación enviada.');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Generar Reporte de Ventas</h1>

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

      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle>Configuración del Reporte</CardTitle>
          <CardDescription>Selecciona el rango de fechas y el tipo de reporte a generar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Label>Tipo de Reporte</Label>
            <RadioGroup
              value={tipoReporte}
              onValueChange={(value: 'resumen' | 'detallado' | 'por-categoria') => setTipoReporte(value)}
              className="flex flex-wrap gap-4"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resumen" id="resumen" />
                <Label htmlFor="resumen">Reporte Resumen (Ventas Totales, Platillos más/menos vendidos)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detallado" id="detallado" />
                <Label htmlFor="detallado">Reporte Detallado de Ventas (Comprobantes/Comandas)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="por-categoria" id="por-categoria" />
                <Label htmlFor="por-categoria">Ventas por Categoría</Label> {}
              </div>
            </RadioGroup>
          </div>

          <Button onClick={handleGenerateReport} disabled={isLoading || !fechaInicio || !fechaFin} className="w-full">
            {isLoading ? 'Generando...' : 'Generar Reporte'}
          </Button>
        </CardContent>
      </Card>

      {/* Área de Visualización del Reporte */}
      {(resumenData || detalladoData || ventasPorCategoriaData) && (
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Resultados del Reporte</CardTitle>
            <CardDescription>Aquí se muestra el reporte generado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {resumenData && tipoReporte === 'resumen' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Resumen de Ventas</h3>
                <p><strong>Total de Ventas:</strong> S/. {resumenData.totalVentas ? resumenData.totalVentas.toFixed(2) : 'N/A'}</p>
                <p><strong>Plato Más Vendido:</strong> {resumenData.platoMasVendido || 'N/A'}</p>
                <p><strong>Plato Menos Vendido:</strong> {resumenData.platoMenosVendido || 'N/A'}</p>
                <p className="text-sm text-gray-500">Periodo: {resumenData.fechaInicio} al {resumenData.fechaFin}</p>
              </div>
            )}

            {detalladoData && tipoReporte === 'detallado' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Detalle de Ventas por Comprobante/Comanda</h3>
                {detalladoData.length > 0 ? (
                  <div className="overflow-x-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cód. Comprobante</TableHead>
                          <TableHead>Cód. Comanda</TableHead>
                          <TableHead>Total Venta</TableHead>
                          <TableHead>ID Usuario</TableHead>
                          <TableHead>Fecha Inicio Periodo</TableHead>
                          <TableHead>Fecha Fin Periodo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detalladoData.map((item, index) => (
                          <TableRow key={item.codigoComprobante || index}>
                            <TableCell>{item.codigoComprobante}</TableCell>
                            <TableCell>{item.codigoComanda}</TableCell>
                            <TableCell>S/. {item.totalVenta ? item.totalVenta.toFixed(2) : 'N/A'}</TableCell>
                            <TableCell>{item.idUsuario}</TableCell>
                            <TableCell>{item.fechaInicio}</TableCell>
                            <TableCell>{item.fechaFin}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No se encontraron ventas detalladas para el periodo seleccionado.</p>
                )}
              </div>
            )}

            {ventasPorCategoriaData && tipoReporte === 'por-categoria' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Ventas por Categoría de Producto (Ejemplo)</h3>
                {ventasPorCategoriaData.length > 0 ? (
                  <div className="overflow-x-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-right">Total Vendido</TableHead>
                          <TableHead className="text-right">Cant. Platillos Vendidos</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ventasPorCategoriaData.map((item, index) => (
                          <TableRow key={item.categoria || index}>
                            <TableCell>{item.categoria}</TableCell>
                            <TableCell className="text-right">S/. {item.totalVendido.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{item.cantidadPlatillos}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No hay datos de ventas por categoría para mostrar.</p>
                )}
              </div>
            )}

            {(resumenData || detalladoData || ventasPorCategoriaData) && (
              <div className="flex justify-end mt-6">
                <Button onClick={handleExportPdf} disabled={isLoading} className="flex items-center gap-2">
                  <DownloadIcon className="h-4 w-4" /> Exportar a PDF
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}