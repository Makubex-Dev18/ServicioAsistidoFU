'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, FileText } from 'lucide-react';

interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

interface VentaData {
  items: ItemCarrito[];
  total: number;
  fecha: string;
}

export default function VentaResumenPage() {
  const router = useRouter();

   // 🧪 DATOS DE PRUEBA TEMPORAL
  const datosEjemplo: VentaData = {
    items: [
      {
        id: 1,
        nombre: 'Paracetamol 500mg',
        precio: 6.00,
        cantidad: 2,
        subtotal: 12.00
      },
      {
        id: 2,
        nombre: 'Amoxicilina Suspensión',
        precio: 45.50,
        cantidad: 1,
        subtotal: 45.50
      }
    ],
    total: 57.50,
    fecha: new Date().toISOString()
  };

  //const [ventaData, setVentaData] = useState<VentaData | null>(null);
 const [ventaData, setVentaData] = useState<VentaData | null>(datosEjemplo);

  useEffect(() => {
    // Cargar datos del localStorage
    const data = localStorage.getItem('ventaActual');
    if (data) {
      //comentado momentaneo
      // setVentaData(JSON.parse(data));
      console.log('✅ Usando datos reales del carrito');
     // setVentaData(JSON.parse(data));
    } else {
      // Si no hay datos, regresar a venta
      // router.push('/venta');

       console.log('🧪 Usando datos de prueba temporal');
    }
  }, [router]);

  const handleGenerarTicket = async () => {
    if (!ventaData) return;

    // TODO: Guardar en base de datos
    /*
    try {
      const ventaInput = {
        items: ventaData.items.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.subtotal
        })),
        total: ventaData.total,
        metodo_pago: 'efectivo', // Agregar selector después
        fecha: ventaData.fecha
      };

      const res = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaInput)
      });

      const data = await res.json();
      
      if (!data.success) {
        alert('Error al guardar venta: ' + data.error);
        return;
      }
      
      console.log('Venta guardada con ID:', data.data.venta_id);
    } catch (error) {
      console.error('Error al guardar venta:', error);
      alert('Error al procesar la venta');
      return;
    }
    */

    // Imprimir ticket
    window.print();

    // Limpiar y volver
    localStorage.removeItem('ventaActual');
    alert('✅ Ticket generado exitosamente');
    router.push('/venta');
  };

  const handleRegresar = () => {
    router.push('/venta');
  };

  if (!ventaData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando resumen...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          FINALIZAR ATENCIÓN
        </h1>
        <p className="text-gray-600">
          Revise el resumen antes de generar el ticket de pago.
        </p>
      </div>

      {/* Grid 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Izquierda: RESUMEN DE PEDIDO */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-4">
              RESUMEN DE PEDIDO
            </h2>

            {/* Lista de productos */}
            <div className="space-y-4 mb-6">
              {ventaData.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.nombre}</p>
                    <p className="text-sm text-gray-500">
                      {item.cantidad} {item.cantidad === 1 ? 'Unidad' : 'Unidades'}
                    </p>
                  </div>
                  <p className="font-bold text-gray-800">
                    S/ {item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total a pagar</span>
                <span className="text-3xl font-bold text-gray-800">
                  S/ {ventaData.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Derecha: PREVIEW TICKET */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-full flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-20 h-24 bg-white rounded shadow-md mx-auto mb-3 flex items-center justify-center">
                <FileText size={40} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Vista previa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Principal */}
      <div className="mb-6 flex justify-end">
        <Button
          onClick={handleGenerarTicket}
          variant="default"
          size="lg"
          className='bg-blue-600 text-white px-8 py-6'
        >
          <Printer size={20} className="mr-2" />
          GENERAR E IMPRIMIR TICKET
        </Button>
      </div>

      {/* Instrucción */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <p className="font-semibold text-blue-900 text-sm mb-1">
              INSTRUCCIÓN PARA EL PERSONAL:
            </p>
            <p className="text-sm text-blue-800">
              Entregue el ticket impreso al cliente y diríjalo amablemente a la zona de cajas para procesar el pago.
            </p>
          </div>
        </div>
      </div>

      {/* Botón Regresar */}
      <div className="text-center">
        <Button variant={'default'}
          onClick={handleRegresar}
         
        >
          <ArrowLeft size={18} />
          REGRESAR AL PASO ANTERIOR
        </Button>
      </div>
    </div>
  );
}