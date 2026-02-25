'use client';

import { useEffect, useState } from 'react';
import { InformacionFarmacologica } from '@/src/lib/types/productoLaboratorio';
import { X } from 'lucide-react';

interface PanelInfoFarmacologicaProps {
  codinf: string;
  nombreProducto: string;
  onCerrar: () => void;
}

export default function PanelInfoFarmacologica({
  codinf,
  nombreProducto,
  onCerrar
}: PanelInfoFarmacologicaProps) {
  const [info, setInfo] = useState<InformacionFarmacologica | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarInfo = async () => {
      if (!codinf || codinf === '00000') {
        setInfo(null);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await fetch(`/api/productos/info-farmacologica?codinf=${codinf}`);
        const data = await res.json();

        if (data.success && data.data) {
          setInfo(data.data);
        } else {
          setInfo(null);
          setError('Sin información disponible');
        }
      } catch (err) {
        console.error('Error al cargar info:', err);
        setError('Error al cargar información');
        setInfo(null);
      } finally {
        setLoading(false);
      }
    };

    cargarInfo();
  }, [codinf]);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <h3 className="font-bold text-lg">Información Farmacológica</h3>
        </div>
        <button
          onClick={onCerrar}
          className="text-white hover:bg-white/20 p-1 rounded transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nombre del producto */}
      <div className="p-4 bg-blue-50 border-b">
        <p className="text-sm font-semibold text-gray-800">{nombreProducto}</p>
        <p className="text-xs text-gray-500">Código: {codinf}</p>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Cargando información...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : info ? (
          <div className="space-y-4">
            {/* Descripción */}
            {info.desinf && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  Descripción
                </h4>
                <p className="text-sm text-gray-600 pl-4">{info.desinf}</p>
              </div>
            )}

            {/* Información detallada */}
            {info.txtinf && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  Información Detallada
                </h4>
                <div className="text-sm text-gray-600 pl-4 whitespace-pre-wrap">
                  {info.txtinf}
                </div>
              </div>
            )}

            {/* Imagen (si existe) */}
            {info.picinf && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  Imagen
                </h4>
                <div className="pl-4">
                  <img
                    src={info.picinf}
                    alt="Información del producto"
                    className="max-w-full h-auto rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Sin información farmacológica disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}