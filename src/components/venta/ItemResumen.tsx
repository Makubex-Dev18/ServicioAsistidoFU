'use client';

import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';

interface ItemResumenProps {
  codigo: string;  // ← era 'id: number'
  descripcion: string;  // ← era 'nombre'
  precio: number;
  cantidad: number;
  subtotal: number;
  onEliminar: (codigo: string) => void;  // ← era 'id: number'
  onCambiarCantidad: (codigo: string, cantidad: number) => void;
  mostrarControles?: boolean;
}

export default function ItemResumen({
  codigo,
  descripcion,
  precio,
  cantidad,
  subtotal,
  onEliminar,
  onCambiarCantidad,
  mostrarControles = true
}: ItemResumenProps) {
  return (
    <div className="border-b border-gray-200 pb-3 last:border-b-0">
      {/* Header con nombre y botón eliminar */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <p className="font-medium text-sm text-gray-800 line-clamp-2">
            {descripcion}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            S/ {precio.toFixed(2)} c/u
          </p>
        </div>
        
        {mostrarControles && (
          <button
            onClick={() => onEliminar(codigo)}
            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
            title="Eliminar producto"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Controles de cantidad y subtotal */}
      <div className="flex items-center justify-between">
        {/* Cantidad */}
        {mostrarControles ? (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onCambiarCantidad(codigo, cantidad - 1)}
              disabled={cantidad <= 1}
              className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Disminuir cantidad"
            >
              <Minus size={14} />
            </Button>
            
            <span className="w-10 text-center font-semibold text-gray-800">
              {cantidad}x
            </span>
            
            <Button
              onClick={() => onCambiarCantidad(codigo, cantidad + 1)}
              className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Aumentar cantidad"
            >
              <Plus size={14} />
            </Button>
          </div>
        ) : (
          <span className="text-sm font-medium text-gray-600">
            Cantidad: {cantidad}
          </span>
        )}

        {/* Subtotal */}
        <p className="font-bold text-blue-600 text-xl">
          S/ {subtotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
}