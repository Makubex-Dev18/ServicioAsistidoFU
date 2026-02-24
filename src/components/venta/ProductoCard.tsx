'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductoCliente } from '@/src/lib/types/producto';

interface ProductoCardProps {
  producto: ProductoCliente;
  onAgregar: (producto: ProductoCliente, tipoVenta: 'entero' | 'fraccion') => void;
}

export default function ProductoCard({ producto, onAgregar }: ProductoCardProps) {
  // ✅ Estado para tipo de venta (entero o fracción)
  const [tipoVenta, setTipoVenta] = useState<'entero' | 'fraccion'>('entero');

  // ✅ Datos según tipo de venta
  const precioFinal = tipoVenta === 'entero' 
    ? producto.PVP_F        // Precio entero con descuento
    : producto.PVP_F_U;     // Precio fracción con descuento
    
  const stock = tipoVenta === 'entero'
    ? producto.stockAlm     // Stock entero
    : producto.stockAlm_m;  // Stock fraccionado

  const descuentoPorcentaje = producto.dtopro || 0;
  const tieneDescuento = descuentoPorcentaje > 0 && precioFinal < producto.precio;

  // Disponibilidad según stock del tipo seleccionado
  const disponibilidad = stock > 10
    ? { label: 'DISPONIBLE', variant: 'default' as const }
    : stock > 0
      ? { label: 'STOCK BAJO', variant: 'secondary' as const }
      : { label: 'SIN STOCK', variant: 'destructive' as const };

  const alertaReceta = producto.receta === 'S' 
    ? { label: '📋 Requiere RECETA MEDICA', variant: 'destructive' as const }
    : { label: '', variant: 'secondary' as const };

  // ✅ Verificar si tiene stock en fracción
  const tieneFraccion = producto.stockAlm_m > 0 || producto.PVP_F_U > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      {/* Imagen */}
      <div className="relative w-full h-32 mb-3 bg-gray-100 rounded-lg overflow-hidden">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.descripcion}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2">
        {/* Código con estado y stock fraccionado */}
        <p className="font-semibold text-gray-800 line-clamp-2 text-sm">
          COD: {producto.codigo}{' '}
          {producto.productoEstado && (
            <span className="text-gray-600">
              ({producto.productoEstado === 'S' ? 'A' : 'I'})
            </span>
          )}{' '}
          {producto.productoStkfra !== undefined && (
            <span className="text-gray-600">(B:{producto.productoStkfra})</span>
          )}
        </p>

        {/* Descripción */}
        <h3 className="text-xs text-gray-500 line-clamp-1 font-bold">
          {producto.descripcion}
        </h3>

        {/* Laboratorio */}
        {producto.productoLab && (
          <p className="text-xs text-gray-400 italic line-clamp-1">
            🏭 L: {producto.productoLab}
          </p>
        )}

        {/* Badge disponibilidad */}
        <div className="flex items-center justify-between">
          <Badge variant={disponibilidad.variant} className="text-xs px-2 py-0.5">
            {disponibilidad.label}
          </Badge>
        </div>

        {/* Badge receta */}
        {alertaReceta.label && (
          <div>
            <Badge variant={alertaReceta.variant} className="text-xs px-2 py-0.5">
              {alertaReceta.label}
            </Badge>
          </div>
        )}

        {/* ✅ SELECTOR DE TIPO (Solo si tiene fracción disponible) */}
        {tieneFraccion && (
          <div className="border rounded-lg p-2 bg-gray-50">
            <div className="flex gap-2">
              <button
                onClick={() => setTipoVenta('entero')}
                className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                  tipoVenta === 'entero'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                📦 ENTERO
              </button>
              <button
                onClick={() => setTipoVenta('fraccion')}
                className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                  tipoVenta === 'fraccion'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                💊 FRACCIÓN
              </button>
            </div>
          </div>
        )}

        {/* ✅ Stock con etiqueta según tipo */}
        <p className="text-sm text-gray-600">
          <span className="font-semibold">
            {tipoVenta === 'entero' ? 'Stock Entero:' : 'Stock Fracción:'}
          </span>{' '}
          <span className="font-semibold">{stock}</span>{' '}
          {tipoVenta === 'entero' ? 'cajas' : 'unidades'}
        </p>

        {/* ✅ Precio con descuento */}
        <div className="pt-2 border-t">
          {tieneDescuento ? (
            <div className="space-y-1">
              {/* Precio original tachado */}
              <p className="text-sm text-gray-400 line-through">
                S/ {Number(producto.precio).toFixed(2)}
              </p>
              {/* Precio final */}
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-green-600">
                  S/ {Number(precioFinal).toFixed(2)}
                </p>
                <span className="text-xs text-green-600">
                  Dcto. {descuentoPorcentaje.toFixed(0)}%
                </span>
              </div>
            </div>
          ) : (
            <p className="text-2xl font-bold text-blue-600">
              S/ {Number(precioFinal).toFixed(2)}
            </p>
          )}
          {/* Indicador de tipo */}
          <p className="text-xs text-gray-500 mt-1">
            {tipoVenta === 'entero' ? 'Precio por caja/blister' : 'Precio por unidad'}
          </p>
        </div>

        {/* ✅ Botón Agregar */}
        <Button
          onClick={() => onAgregar(producto, tipoVenta)}
          variant="default"
          className="w-full"
          disabled={stock === 0 || producto.receta === 'S'}
        >
          {stock > 0 ? (
            tipoVenta === 'entero' ? 'AGREGAR ENTERO' : 'AGREGAR FRACCIÓN'
          ) : (
            'SIN STOCK'
          )}
        </Button>
      </div>
    </div>
  );
}