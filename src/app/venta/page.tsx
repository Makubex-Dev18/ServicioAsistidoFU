"use client";

import { Badge } from "@/components/ui/badge";
import BuscadorProducto from '@/src/components/venta/BuscadorProducto';
import ProductoCard from '@/src/components/venta/ProductoCard';
import ResumenVenta, { ItemCarrito } from '@/src/components/venta/ResumenVenta';
import { useState, useEffect } from 'react';
import { ProductoCliente } from '@/src/lib/types/producto';

export default function VentaPage() {
  const [productos, setProductos] = useState<ProductoCliente[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para buscar productos en la API
  const handleBuscar = async (termino: string) => {
    setTerminoBusqueda(termino);
    
    // Si está vacío, limpiar resultados
    if (!termino.trim()) {
      setProductos([]);
      return;
    }

    setLoading(true);

    try {
      console.log('🔍 Buscando:', termino);
      
      const res = await fetch(`/api/productos/buscar?q=${encodeURIComponent(termino)}`);
      const data = await res.json();
        console.log(data);
      if (data.success) {
        console.log(`✅ Encontrados ${data.count} productos`);
        setProductos(data.data);
      } else {
        console.error('❌ Error:', data.error);
        setProductos([]);
      }
    } catch (error) {
      console.error('❌ Error en búsqueda:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto al carrito - validacion stock
  const handleAgregarAlCarrito = (producto: ProductoCliente) => {
    const itemExistente = carrito.find(item => item.codigo === producto.codigo);

    if (itemExistente) {
        
        const nuevaCantidad = itemExistente.cantidad + 1;

        if(nuevaCantidad > producto.stockAlm){
            alert(`⚠️ Stock insuficiente. Solo hay ${producto.stockAlm} unidades disponibles.`);
            return;
        }


      // Incrementar cantidad
      setCarrito(carrito.map(item =>
        item.codigo === producto.codigo
          ? {
              ...item,
              cantidad: item.cantidad + 1,
              subtotal: (item.cantidad + 1) * item.precio
            }
          : item
      ));
      
      console.log(`➕ Incrementada cantidad de ${producto.descripcion}`);
    } else {

        if(producto.stockAlm < 1 ){
            alert('⚠️ Producto sin stock disponible.');
            return;
        }

      // Agregar nuevo item
      const nuevoItem: ItemCarrito = {
        codigo: producto.codigo,
        descripcion: producto.descripcion,
        precio: producto.precio,
        cantidad: 1,
        subtotal: producto.precio,
        receta: producto.receta
      };
      
      setCarrito([...carrito, nuevoItem]);
      console.log(`✅ Agregado ${producto.descripcion} al carrito`);
    }
  };

  const handleEliminarDelCarrito = (codigo: string) => {
    setCarrito(carrito.filter(item => item.codigo !== codigo));
    console.log(`🗑️ Eliminado producto del carrito`);
  };

  const handleCambiarCantidad = (codigo: string, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;
    
     // Buscar el producto en la lista para verificar stock
  const producto = productos.find(p => p.codigo === codigo);
  
  if (producto && nuevaCantidad > producto.stockAlm) {
    alert(`⚠️ Stock insuficiente. Solo hay ${producto.stockAlm} unidades disponibles.`);
    return;
  }

    setCarrito(carrito.map(item =>
      item.codigo === codigo
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
      console.log('🧹 Carrito limpiado');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Búsqueda y Venta de Productos
        </h1>
        <p className="text-gray-600">
          Busca productos por nombre y agrégalos al carrito
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
              //placeholder="Escribe el nombre del producto (ej: PANADOL)..."
            />
          </div>

          {/* Sección de productos */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold text-lg">●</span>
                <h2 className="font-bold text-gray-800">
                  {terminoBusqueda ? `Resultados para "${terminoBusqueda}"` : 'Realiza una búsqueda'}
                </h2>
              </div>
              {productos.length > 0 && (
                <Badge variant="default">
                  {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
                </Badge>
              )}
            </div>

            {/* Grid de productos */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Buscando productos...</p>
              </div>
            ) : productos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {terminoBusqueda ? (
                  <>
                    <p className="text-lg mb-2">No se encontraron productos</p>
                    <p className="text-sm">Intenta con otro término de búsqueda</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg mb-2">Empieza a buscar productos</p>
                    <p className="text-sm">Escribe el nombre del producto en el buscador</p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {productos.map(producto => (
                  <ProductoCard
                    key={`${producto.codigo}-${producto.descripcion}`}
                    producto={producto}
                    onAgregar={handleAgregarAlCarrito}
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