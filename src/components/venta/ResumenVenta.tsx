'use client';

import { useRouter } from 'next/navigation';

import { ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ItemResumen from '@/src/components/venta/ItemResumen';

export interface ItemCarrito {
  codigo: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  receta?: string;
  tipoVenta: 'entero' | 'fraccion';  // ✅ NUEVO
}

interface ResumenVentaProps {
  items: ItemCarrito[];
  onEliminar: (codigo: string) => void;
  onLimpiar: () => void;
  onCambiarCantidad: (codigo: string, cantidad: number, tipoVenta?: 'entero' | 'fraccion') => void;  // ✅ Actualizado
}

export default function ResumenVenta({ 
  items, 
  onEliminar, 
  onLimpiar,
  onCambiarCantidad 
}: ResumenVentaProps) {
  const router = useRouter();

  // Cálculos
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  //const igv = subtotal * 0.18;
  //const total = subtotal + igv;
 const total = items.reduce((sum, item) => sum + item.subtotal, 0);
 const igv = total * (18 / 118);  // Extraer IGV del total
 const base = total - igv;         // Base imponible (sin IGV)

  const handleGenerarTicket = () => {
    const confirmacion = window.confirm("¿Esta seguro de guardar el carrito?");
    if(!confirmacion) return 

    if (items.length === 0) return;
    
    // Guardar en localStorage o state global
    localStorage.setItem('ventaActual', JSON.stringify({
      items,
      subtotal,
      igv,
      total,
      fecha: new Date().toISOString()
    }));
    
    // Navegar a resumen
    router.push('/ventaResumen');
  };

  console.log('items del carrito:', items) // para ver la estructura real

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 sticky top-6  max-w-xl mx-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center gap-2">
        <ShoppingBag size={24} />
        <h2 className="text-xl font-bold">Resumen de Selección</h2>
      </div>

      {/* Items */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ShoppingBag size={48} className="mx-auto mb-2 opacity-30" />
            <p>No hay productos seleccionados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <ItemResumen
                key={`${item.codigo}-${item.tipoVenta}`}
                codigo={item.codigo}
                descripcion={item.descripcion}
                precio={item.precio}
                cantidad={item.cantidad}
                subtotal={item.subtotal}
                tipoVenta={item.tipoVenta}  // ✅ Pasar tipoVenta
                onEliminar={onEliminar}
                onCambiarCantidad={onCambiarCantidad}
                mostrarControles={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Totales */}
      {items.length > 0 && (
        <div className="border-t p-4 space-y-2 bg-gray-50">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">T-parcial:</span>
            <span className="font-medium">S/ {base.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">IGV (18%):</span>
            <span className="font-medium">S/ {igv.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between font-bold border-t pt-2 text-2xl">
            <span>Total a Pagar:</span>
            <span className="text-blue-600">S/ {total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="p-4 space-y-2 border-t">
        <Button
          onClick={handleGenerarTicket}
          variant="default"
          className='w-full'
          disabled={items.length === 0}
        >
          GENERAR TICKET DE PAGO →
        </Button>
        {items.length > 0 && (
          <Button variant={'destructive'}
            onClick={onLimpiar}
            className="w-full text-sm text-white-200 hover:text-red-200 py-2 transition-colors"
          >
            LIMPIAR SELECCIÓN
          </Button>
        )}
      </div>

      {/* Nota */}
      {/*}
      {items.length > 0 && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 flex items-start gap-2">
            <span>ℹ️</span>
            <span>
              Si solicitas un producto con receta médica, deberá validar
              el documento físico o digital en el siguiente paso.
            </span>
          </p>
        </div>
      )}
        */}

    </div>
  );
}