"use client";

import { Badge } from "@/components/ui/badge";
import BuscadorProducto from '@/src/components/venta/BuscadorProducto';
import ProductoCard from '@/src/components/venta/ProductoCard';
import ResumenVenta, { ItemCarrito } from '@/src/components/venta/ResumenVenta';
import { useState, useEffect } from 'react';
import { ProductoCliente } from '@/src/lib/types/producto';
import BuscadorCliente from "@/src/components/venta/BuscadorCliente";
import { Cliente } from "@/src/lib/types/cliente";
import { useRouter } from 'next/navigation';
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VentaPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<ProductoCliente[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  // ✅✅✅ NUEVO: Cargar carrito y cliente al montar la página ✅✅✅
  useEffect(() => {
    console.log('🔄 Cargando datos guardados...');
    
    let clienteCargado: Cliente | null = null;
    
    // 1. Cargar cliente PRIMERO (guardarlo en variable local)
    const clienteGuardado = localStorage.getItem('clienteSeleccionado');
    if (clienteGuardado) {
      try {
        clienteCargado = JSON.parse(clienteGuardado);
        setClienteSeleccionado(clienteCargado);
        console.log('📋 Cliente restaurado:', clienteCargado.nomcli);
      } catch (error) {
        console.error('❌ Error al cargar cliente:', error);
      }
    }

    // 2. Cargar carrito de localStorage
    const carritoGuardado = localStorage.getItem('carritoVenta');
    if (carritoGuardado) {
      try {
        const items = JSON.parse(carritoGuardado);
        setCarrito(items);
        console.log('🛒 Carrito restaurado:', items.length, 'items');
      } catch (error) {
        console.error('❌ Error al cargar carrito:', error);
      }
    }

    // 3. Búsqueda automática (desde módulo productos)
    // ✅ PASAR clienteCargado como parámetro
    const codigoBuscar = localStorage.getItem('codigoBuscar');
    if (codigoBuscar) {
      console.log('🔍 Búsqueda automática del código:', codigoBuscar);
      if (clienteCargado) {
        console.log('📋 Aplicando descuentos de cliente:', clienteCargado.nomcli);
      }
      // ✅✅✅ PASAR EL CLIENTE CARGADO ✅✅✅
      handleBuscar(codigoBuscar, clienteCargado);
      localStorage.removeItem('codigoBuscar');
    }
  }, []); // ← Se ejecuta solo al montar

  // ✅✅✅ NUEVO: Guardar carrito cuando cambie ✅✅✅
  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem('carritoVenta', JSON.stringify(carrito));
      console.log('💾 Carrito guardado:', carrito.length, 'items');
    } else {
      localStorage.removeItem('carritoVenta');
      console.log('🗑️ Carrito vacío, localStorage limpiado');
    }
  }, [carrito]);

  // ✅✅✅ NUEVO: Guardar cliente cuando cambie ✅✅✅
  useEffect(() => {
    if (clienteSeleccionado) {
      localStorage.setItem('clienteSeleccionado', JSON.stringify(clienteSeleccionado));
      console.log('💾 Cliente guardado:', clienteSeleccionado.nomcli);
    } else {
      localStorage.removeItem('clienteSeleccionado');
      console.log('🗑️ Cliente deseleccionado, localStorage limpiado');
    }
  }, [clienteSeleccionado]);

  const handleClienteSeleccionado = (cliente: Cliente | null) => {
    setClienteSeleccionado(cliente);
    
    if (cliente) {
      console.log('📝 Cliente seleccionado:');
      console.log('   - Código:', cliente.codcli);
      console.log('   - Plan:', cliente.plnnum);
      console.log('   - Nombre:', cliente.nomcli);
    }
  };

  // ✅✅✅ MODIFICADO: Aceptar cliente como parámetro opcional ✅✅✅
  const handleBuscar = async (termino: string, clienteParam?: Cliente | null) => {
    setTerminoBusqueda(termino);
    
    if (!termino.trim()) {
      setProductos([]);
      return;
    }

    setLoading(true);

    // ✅ Usar clienteParam si se pasó, sino usar el estado
    const clienteParaBuscar = clienteParam !== undefined ? clienteParam : clienteSeleccionado;

    let url = `/api/productos/buscar?q=${encodeURIComponent(termino)}`;

    // ✅ Usar clienteParaBuscar en lugar de clienteSeleccionado
    if (clienteParaBuscar) {
      url += `&plnnum=${encodeURIComponent(clienteParaBuscar.plnnum)}`;
      url += `&codcli=${encodeURIComponent(clienteParaBuscar.codcli)}`;
      console.log('📋 Buscando con descuento de cliente:', clienteParaBuscar.nomcli);
    } else {
      console.log('🔍 Buscando sin cliente (sin descuentos)');
    }

    try {
      console.log('🔍 Buscando:', termino);
      console.log('🔗 URL:', url);
      
      const res = await fetch(url);
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

  const handleAgregarAlCarrito = (producto: ProductoCliente, tipoVenta: 'entero' | 'fraccion') => {
    const precioFinal = tipoVenta === 'entero'
      ? producto.PVP_F
      : producto.PVP_F_U;
      
    const stock = tipoVenta === 'entero'
      ? producto.stockAlm
      : producto.stockAlm_m;

    const itemExistente = carrito.find(
      item => item.codigo === producto.codigo && item.tipoVenta === tipoVenta
    );

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + 1;

      if (nuevaCantidad > stock) {
        alert(`⚠️ Stock insuficiente. Solo hay ${stock} ${tipoVenta === 'entero' ? 'cajas' : 'unidades'} disponibles.`);
        return;
      }

      setCarrito(carrito.map(item =>
        item.codigo === producto.codigo && item.tipoVenta === tipoVenta
          ? {
              ...item,
              cantidad: item.cantidad + 1,
              subtotal: (item.cantidad + 1) * item.precio
            }
          : item
      ));
      
      console.log(`➕ Incrementada cantidad de ${producto.descripcion} (${tipoVenta})`);
    } else {
      if (stock < 1) {
        alert(`⚠️ Producto sin stock ${tipoVenta === 'entero' ? 'entero' : 'fraccionado'}.`);
        return;
      }

      const etiquetaTipo = tipoVenta === 'fraccion' ? ' (Fraccion)' : ' (Entero)';
      
      const nuevoItem: ItemCarrito = {
        codigo: producto.codigo,
        descripcion: `${producto.descripcion} - ${etiquetaTipo}`,
        precio: precioFinal,
        cantidad: 1,
        subtotal: precioFinal,
        receta: producto.receta,
        tipoVenta: tipoVenta
      };
      
      setCarrito([...carrito, nuevoItem]);
      
      console.log(`✅ Agregado ${producto.descripcion} (${tipoVenta})`);
      console.log(`   Precio: S/ ${precioFinal.toFixed(2)}`);
      console.log(`   Stock disponible: ${stock} ${tipoVenta === 'entero' ? 'cajas' : 'unidades'}`);
      if (producto.dtopro > 0) {
        console.log(`   Descuento: ${producto.dtopro}%`);
      }
    }
  };

  const handleEliminarDelCarrito = (codigo: string) => {
    setCarrito(carrito.filter(item => item.codigo !== codigo));
    console.log(`🗑️ Eliminado producto del carrito`);
  };

  const handleCambiarCantidad = (codigo: string, nuevaCantidad: number, tipoVenta?: 'entero' | 'fraccion') => {
    if (nuevaCantidad < 1) return;
    
    const itemCarrito = carrito.find(item => item.codigo === codigo && item.tipoVenta === tipoVenta);
    if (!itemCarrito) return;
    
    const producto = productos.find(p => p.codigo === codigo);
    
    if (producto) {
      const stock = itemCarrito.tipoVenta === 'entero'
        ? producto.stockAlm
        : producto.stockAlm_m;
      
      if (nuevaCantidad > stock) {
        alert(`⚠️ Stock insuficiente. Solo hay ${stock} ${itemCarrito.tipoVenta === 'entero' ? 'cajas' : 'unidades'} disponibles.`);
        return;
      }
    }

    setCarrito(carrito.map(item =>
      item.codigo === codigo && item.tipoVenta === itemCarrito.tipoVenta
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

  const handleRegistrarCliente = () => {
    router.push('/clientes');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Búsqueda y Venta de Productos
        </h1>
        <p className="text-gray-600">
          Busca productos por nombre completo o DNI y agrégalos al carrito
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                CLIENTE
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegistrarCliente}
                className="flex items-center gap-2"
              >
                <UserPlus size={16} />
                Registrar Cliente
              </Button>
            </div>
            <BuscadorCliente
              onClienteSeleccionado={handleClienteSeleccionado}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BÚSQUEDA DE PRODUCTO
            </label>
            <BuscadorProducto
              onBuscar={handleBuscar}
            />
          </div>

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