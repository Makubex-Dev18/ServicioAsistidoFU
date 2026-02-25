'use client';

import { ProductoLaboratorio } from '@/src/lib/types/productoLaboratorio';

interface TablaResultadosProps {
  productos: ProductoLaboratorio[];
  productoSeleccionado: ProductoLaboratorio | null;
  onSeleccionar: (producto: ProductoLaboratorio) => void;
}

export default function TablaResultados({
  productos,
  productoSeleccionado,
  onSeleccionar
}: TablaResultadosProps) {
  
  // Calcular precio final con descuento
  const calcularPrecioFinal = (precio: number, descuento: number) => {
    if (descuento === 0) return precio;
    const descuentoMonto = precio * (descuento / 100);
    return precio - descuentoMonto;
  };

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-bold text-gray-800">
          Resultados ({productos.length} {productos.length === 1 ? 'producto' : 'productos'})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-teal-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Producto</th>
              <th className="px-3 py-2 text-left text-sm font-semibold">C Lab</th>
               <th className="px-3 py-2 text-left text-sm font-semibold">D Lab</th>
               <th className="px-3 py-2 text-left text-sm font-semibold">P. Activo</th>  
              <th className="px-3 py-2 text-right text-sm font-semibold">PV.P</th>
              <th className="px-3 py-2 text-right text-sm font-semibold">Dcto</th>
              <th className="px-3 py-2 text-right text-sm font-semibold">PVP+F</th>
              <th className="px-3 py-2 text-center text-sm font-semibold">CantE</th>
              <th className="px-3 py-2 text-center text-sm font-semibold">🔍</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              productos.map((producto) => {
                const precioFinal = calcularPrecioFinal(producto.prisal, producto.dtopro);
                const isSelected = productoSeleccionado?.codpro === producto.codpro;

                return (
                  <tr
                    key={producto.codpro}
                    onClick={() => onSeleccionar(producto)}
                    className={`
                      border-b cursor-pointer transition-colors
                      ${isSelected 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <td className="px-4 py-2 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{producto.despro}</p>
                        <p className="text-xs text-gray-500">Cód: {producto.codpro}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700">{producto.codlab}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{producto.nomlab}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 text-xs">  {producto.nomgen || '-'}</td>
                    <td className="px-3 py-2 text-sm text-right font-mono">{producto.prisal.toFixed(2)}</td>
                    <td className="px-3 py-2 text-sm text-right">
                      {producto.dtopro > 0 ? (
                        <span className="text-green-600 font-semibold">{producto.dtopro.toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400">0.00</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm text-right font-mono font-semibold">
                      {precioFinal.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-sm text-center">
                      <span className={`
                        inline-block px-2 py-1 rounded text-xs font-semibold
                        ${producto.stkalm > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        }
                      `}>
                        {producto.stkalm}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {producto.codinf && producto.codinf !== '00000' && (
                        <button className="text-blue-600 hover:text-blue-800">
                          📋
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}