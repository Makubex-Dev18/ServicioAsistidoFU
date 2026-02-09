"use client";

import { Badge } from "@/components/ui/badge";
import BuscadorProducto from "@/src/components/venta/BuscadorProducto";
import ProductoCard from '@/src/components/venta/ProductoCard';
import ResumenVenta, { ItemCarrito } from '@/src/components/venta/ResumenVenta';
import { useState, useEffect } from 'react';

export default function VentaPage() {

    interface Producto {
        id: number;
        codigo?: string;
        nombre: string;
        descripcion?: string;
        precio: number;
        stock: number;
        imagen_url?: string;
        categoria_id?: number;
    }



    const [productos, setProductos] = useState<Producto[]>([]);
    const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [productoSinStock, setProductoSinStock] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Cargar productos (luego será de la API)
    useEffect(() => {
        // cargarProductos();
    }, []);

    const cargarProductos = async () => {
        setLoading(true);

        // TODO: Reemplazar con llamada a API
        // const res = await fetch('/api/productos');
        // const data = await res.json();
        // setProductos(data);

        // Datos de ejemplo temporal
        const productosEjemplo: Producto[] = [
            { id: 1, nombre: 'Paracetamol Genérico 500mg', precio: 2.50, stock: 25, descripcion: 'Tabletas x 10 unidades' },
            { id: 2, nombre: 'Analgesia 600mg (Tabletas)', precio: 4.20, stock: 15, descripcion: 'Principio Mejoramol' },
            { id: 3, nombre: 'Dolocodralán Forte', precio: 8.50, stock: 0, descripcion: 'Paracetamol + Cafeína' },
            { id: 4, nombre: 'Ibuprofeno 400mg', precio: 3.50, stock: 30 },
            { id: 5, nombre: 'Amoxicilina 500mg', precio: 12.00, stock: 8 },
        ];

        setProductos(productosEjemplo);
        setProductosFiltrados(productosEjemplo);
        setLoading(false);
    };



    const handleBuscar = (termino: string) => {
        setTerminoBusqueda(termino);
        setProductoSinStock(null);

        if (!termino.trim()) {
            setProductosFiltrados(productos);
            return;
        }
    }


    const handleAgregarAlCarrito = (producto: Producto) => {
        const itemExistente = carrito.find(item => item.id === producto.id);

        if (itemExistente) {
            // Incrementar cantidad
            setCarrito(carrito.map(item =>
                item.id === producto.id
                    ? {
                        ...item,
                        cantidad: item.cantidad + 1,
                        subtotal: (item.cantidad + 1) * item.precio
                    }
                    : item
            ));
        } else {
            // Agregar nuevo
            setCarrito([...carrito, {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1,
                subtotal: producto.precio
            }]);
        }
    };

    const handleEliminarDelCarrito = (id: number) => {
        setCarrito(carrito.filter(item => item.id !== id));
    };

    const handleCambiarCantidad = (id: number, nuevaCantidad: number) => {
        if (nuevaCantidad < 1) return;

        setCarrito(carrito.map(item =>
            item.id === id
                ? {
                    ...item,
                    cantidad: nuevaCantidad,
                    subtotal: nuevaCantidad * item.precio
                }
                : item
        ));
    };

    const handleLimpiarCarrito = () => {
        if (confirm('¿Estás seguro de limpiar toda la selección?')) {
            setCarrito([]);
        }
    };


    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Búsqueda y Asesoría de Productos
                </h1>
                <p className="text-gray-600">
                    Busca productos y agrégalos a tu carrito de compra
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Izquierda: Búsqueda y Productos */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Buscador */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            BÚSQUEDA DE PRODUCTO
                        </label>
                        <BuscadorProducto
                            onBuscar={handleBuscar}

                        />
                    </div>

                    {/* Sección de productos */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-blue-600 font-bold text-lg">●</span>
                                <h2 className="font-bold text-gray-800">
                                    {terminoBusqueda ? 'Resultados de búsqueda' : 'Productos disponibles'}
                                </h2>
                            </div>
                            {productosFiltrados.length > 0 && (
                                <Badge variant="default">
                                    {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
                                </Badge>
                            )}
                        </div>

                        {/* Grid de productos */}
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">
                                Cargando productos...
                            </div>
                        ) : productosFiltrados.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No se encontraron productos
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {productosFiltrados.map(producto => (
                                    <ProductoCard
                                        key={producto.id}
                                        producto={producto}
                                        onAgregar={handleAgregarAlCarrito}
                                        mostrarInfo={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>


                {/* Columna Derecha: Resumen */}
                <div className="lg:col-span-1">
                    <ResumenVenta
                        items={carrito}
                        onEliminar={handleEliminarDelCarrito}
                        onLimpiar={handleLimpiarCarrito}
                        onCambiarCantidad={handleCambiarCantidad}
                    />
                </div>
            </div>
        </div>
    );
}


