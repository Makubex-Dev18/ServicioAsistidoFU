'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


interface Producto {
  codigo: string;
  descripcion: string;

  // ⚠️ En la práctica, tu SP puede devolver precio como string o null.
  // Lo dejamos flexible para evitar crashes.
  precio?: number | string | null;

  stockAlm: number;
  receta?: string;
  imagen_url?: string | null;
  dtopro?: number;  // ✅ AGREGAR
}

interface ProductoCardProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}




function formatPrecio(value: Producto['precio']): string {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : '-';
}

export default function ProductoCard({ producto, onAgregar }: ProductoCardProps) {
  const disponibilidad =
    producto.stockAlm > 10
      ? { label: 'DISPONIBLE', variant: 'default' as const }
      : producto.stockAlm > 0
        ? { label: 'STOCK BAJO', variant: 'secondary' as const }
        : { label: 'SIN STOCK', variant: 'destructive' as const };


// CAMBIO 2: Calcular y mostrar descuento
const precioOriginal = formatPrecio(producto.precio);
const tieneDescuento = producto.dtopro && producto.dtopro > 0;
const precioFinal = tieneDescuento 
  ? Number(precioOriginal) - producto.dtopro 
  : Number(precioOriginal);


  const precioText = formatPrecio(producto.precio);

  const alertaReceta = producto.receta == 'S' ?{label: '📋 Requiere RECETA MEDICA', variant: 'destructive' as const }:
                                                {label: '', variant: 'secondary' as const}


  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      {/* Imagen */}
      <div className="relative w-full h-32 mb-3 bg-gray-100 rounded-lg overflow-hidden">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.descripcion || `Producto ${producto.codigo}`}
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
        <p className="font-semibold text-gray-800 line-clamp-2 text-sm">
          COD: {producto.codigo}
        </p>

        {producto.descripcion ? (
          <h3 className="text-xs text-gray-500 line-clamp-1 font-bold">
            {producto.descripcion}
          </h3>
        ) : null}

        <div className="flex items-center justify-between">
          <Badge variant={disponibilidad.variant} className="text-xs px-2 py-0.5">
            {disponibilidad.label}
          </Badge>
          
        </div>

        {/*Producto con/sin receta*/}
        <div>
        {/*     <p className="font-semibold text-gray-800 line-clamp-2">
          Receta Medica: {producto.receta}
        </p>
        */}
         <Badge variant={alertaReceta.variant} className="text-xs px-2 py-0.5">
            {alertaReceta.label}
          </Badge>

        </div>



        <p className="text-sm text-gray-600">
          Stock Entero: <span className="font-semibold">{producto.stockAlm}</span> unidades
        </p>

        {/* Precio (solo una vez) */}
        <div className="pt-2 border-t">
          <p className="text-2xl font-bold text-blue-600">
            S/ {precioText}
          </p>
        </div>


{tieneDescuento ? (
  <div className="space-y-1">
    <p className="text-sm text-gray-400 line-through">
      S/ {precioOriginal}
    </p>
    <div className="flex items-baseline gap-2">
      <p className="text-2xl font-bold text-green-600">
        S/ {precioFinal.toFixed(2)}
      </p>
      <span className="text-xs text-green-600">
        Dcto. S/ {producto.dtopro.toFixed(2)}
      </span>
    </div>
  </div>
) : (
  <p className="text-2xl font-bold text-blue-600">
   {/*  S/ {precioOriginal} */}
  </p> 
)}

        <Button
          onClick={() => onAgregar(producto)}
          variant="default"
          className="w-full"
          disabled={producto.stockAlm === 0 || producto.receta === 'S'}
        >
          AGREGAR
        </Button>
      </div>
    </div>
  );
}