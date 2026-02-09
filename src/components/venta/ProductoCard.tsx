'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    imagen_url?: string;
}

interface ProductoCardProps {
    producto: Producto;
    onAgregar: (producto: Producto) => void;
    mostrarInfo?: boolean;
}

export default function ProductoCard({
    producto,
    onAgregar,
    mostrarInfo = false
}: ProductoCardProps) {
    const disponibilidad = producto.stock > 10
        ? { label: 'DISPONIBLE', variant: 'default' as const }
        : producto.stock > 0
            ? { label: 'STOCK BAJO', variant: 'secondary' as const }
            : { label: 'SIN STOCK', variant: 'destructive' as const };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            {/* Imagen */}
            <div className="relative w-full h-32 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                {producto.imagen_url ? (
                    <Image
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        fill
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
                <h3 className="font-semibold text-gray-800 line-clamp-2">
                    {producto.nombre}
                </h3>

                {producto.descripcion && (
                    <p className="text-xs text-gray-500 line-clamp-1">
                        {producto.descripcion}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <Badge variant={disponibilidad.variant} className="text-xs px-2 py-0.5">
                        {disponibilidad.label}
                    </Badge>
                </div>

                <div className="pt-2 border-t">
                    <p className="text-2xl font-bold text-blue-600">
                        S/ {producto.precio.toFixed(2)}
                    </p>
                </div>

                <Button
                    onClick={() => onAgregar(producto)}
                    variant="default"
                    className="w-full"
                    disabled={producto.stock === 0}
                >
                    AGREGAR
                </Button>

                {mostrarInfo && (
                    <button className="w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1">
                        <span>ℹ️</span> Más información
                    </button>
                )}
            </div>
        </div>
    );
}