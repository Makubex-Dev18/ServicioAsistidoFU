'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductoLaboratorio } from '@/src/lib/types/productoLaboratorio';
import TablaResultados from '@/src/components/productos/TablaResultados';
import PanelInfoFarmacologica from '@/src/components/productos/PanelInfoFarmacologica';
import ModalConfirmacion from '@/src/components/productos/ModalConfirmacion';

type TipoBusqueda = 'laboratorio' | 'principio-activo';

export default function ProductosPage() {
  const router = useRouter();
  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>('laboratorio');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [productos, setProductos] = useState<ProductoLaboratorio[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoLaboratorio | null>(null);
  const [loading, setLoading] = useState(false);
  const [mostrarInfo, setMostrarInfo] = useState(false);

  // Estado para modal de confirmación
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoParaAgregar, setProductoParaAgregar] = useState<ProductoLaboratorio | null>(null);


  const handleBuscar = async () => {
    if (!terminoBusqueda.trim()) {
      alert('Por favor ingrese un término de búsqueda');
      return;
    }

    setLoading(true);
    setProductoSeleccionado(null);
    setMostrarInfo(false);

    try {
      let url = '';

      if (tipoBusqueda === 'laboratorio') {
        url = `/api/laboratorioProductos?laboratorio=${encodeURIComponent(terminoBusqueda)}`;
      } else {
        // TODO: Implementar búsqueda por principio activo
        url = `/api/principioActivoProductos?principio=${encodeURIComponent(terminoBusqueda)}`;
      }

      console.log('🔍 Buscando:', tipoBusqueda, terminoBusqueda);

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setProductos(data.data);
        console.log(`✅ ${data.count} productos encontrados`);
      } else {
        setProductos([]);
        console.error('❌ Error:', data.error);
      }
    } catch (error) {
      console.error('❌ Error en búsqueda:', error);
      setProductos([]);
      alert('Error al buscar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarProducto = (producto: ProductoLaboratorio) => {
    setProductoSeleccionado(producto);
    
    // Mostrar info solo si tiene código de información
    if (producto.codinf && producto.codinf !== '00000') {
      setMostrarInfo(true);
    } else {
      setMostrarInfo(false);
    }
  };

  // Handler para abrir modal de confirmación
  const handleAgregarCarrito = (producto: ProductoLaboratorio) => {
    setProductoParaAgregar(producto);
    setModalAbierto(true);
  };

  // Handler para confirmar y navegar a venta
  const handleConfirmarAgregar = () => {
    if (!productoParaAgregar) return;

    // Guardar código en localStorage
    localStorage.setItem('codigoBuscar', productoParaAgregar.codpro);
    
    console.log('✅ Código guardado:', productoParaAgregar.codpro);
    
    // Cerrar modal
    setModalAbierto(false);
    
    // Navegar a venta
    router.push('/venta');
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📦 Consulta de Productos
        </h1>
        <p className="text-gray-600">
          Búsqueda informativa por laboratorio o principio activo
        </p>
      </div>

      {/* Panel de búsqueda */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {/* Selector de tipo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de búsqueda:
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setTipoBusqueda('laboratorio')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
                ${tipoBusqueda === 'laboratorio'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }
              `}
            >
              <span className="text-xl">🏭</span>
              Laboratorio
            </button>
            <button
              onClick={() => setTipoBusqueda('principio-activo')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
                ${tipoBusqueda === 'principio-activo'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }
              `}
             // disabled title="Próximamente"
            >
              <span className="text-xl">🧪</span>
              Principio Activo
              
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="flex gap-2">
          <input
            type="text"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              tipoBusqueda === 'laboratorio'
                ? 'Ingrese nombre del laboratorio'
                : 'Ingrese principio activo'
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleBuscar}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search size={20} />
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de resultados */}
        <div className={mostrarInfo ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <TablaResultados
            productos={productos}
            productoSeleccionado={productoSeleccionado}
            onSeleccionar={handleSeleccionarProducto}
            onAgregarCarrito={handleAgregarCarrito}
          />
        </div>

        {/* Panel de información */}
        {mostrarInfo && productoSeleccionado && (
          <div className="lg:col-span-1">
            <PanelInfoFarmacologica
              codinf={productoSeleccionado.codinf}
              nombreProducto={productoSeleccionado.despro}
              onCerrar={() => setMostrarInfo(false)}
            />
          </div>
        )}
      </div>

      
      {/* Modal de confirmación */}
      <ModalConfirmacion
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onConfirm={handleConfirmarAgregar}
        nombreProducto={productoParaAgregar?.despro || ''}
        codigoProducto={productoParaAgregar?.codpro || ''}
      />
    </div>
  );
}