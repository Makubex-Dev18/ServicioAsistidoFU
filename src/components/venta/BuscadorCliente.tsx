'use client';

import { useState } from 'react';
import { Search, User, X, CreditCard } from 'lucide-react';
import { Cliente } from '@/src/lib/types/cliente';

interface BuscadorClienteProps {
  onClienteSeleccionado: (cliente: Cliente | null) => void;
}

export default function BuscadorCliente({ onClienteSeleccionado }: BuscadorClienteProps) {
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async (termino: string) => {
    setBusqueda(termino);

    if (!termino.trim() || termino.length < 2) {
      setClientes([]);
      setMostrarResultados(false);
      return;
    }

    setLoading(true);
    setMostrarResultados(true);

    try {
      const res = await fetch(`/api/clientes/buscar?q=${encodeURIComponent(termino)}`);
      const data = await res.json();

      if (data.success) {
        setClientes(data.data);
      } else {
        setClientes([]);
      }
    } catch (error) {
      console.error('Error buscando cliente:', error);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setBusqueda(cliente.nomcli);
    setMostrarResultados(false);
    onClienteSeleccionado(cliente);
  };

  const limpiarCliente = () => {
    setClienteSeleccionado(null);
    setBusqueda('');
    setClientes([]);
    onClienteSeleccionado(null);
  };

  // Determinar si la búsqueda es por DNI o nombre
  const esNumerico = /^\d+$/.test(busqueda);

  return (
    <div className="relative">
      {/* Input de búsqueda */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {esNumerico ? <CreditCard size={20} /> : <User size={20} />}
        </div>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => handleBuscar(e.target.value)}
          placeholder={esNumerico ? "Buscando por DNI..." : "Buscar por nombre o DNI..."}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {clienteSeleccionado && (
          <button
            onClick={limpiarCliente}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Info del cliente seleccionado */}
      {clienteSeleccionado && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Cliente:</span>
              <p className="font-medium text-gray-800">{clienteSeleccionado.nomcli}</p>
            </div>
            <div>
              <span className="text-gray-600">DNI:</span>
              <p className="font-medium text-gray-800">{clienteSeleccionado.doccli}</p>
            </div>
            {clienteSeleccionado.plndes && (
              <div className="col-span-2">
                <span className="text-gray-600">Plan:</span>
                <p className="font-medium text-green-600">{clienteSeleccionado.plndes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resultados de búsqueda */}
      {mostrarResultados && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Buscando clientes...
            </div>
          ) : clientes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="mb-1">No se encontraron clientes</p>
              <p className="text-xs">
                {esNumerico 
                  ? 'Intenta con otro DNI' 
                  : 'Intenta con otro nombre'}
              </p>
            </div>
          ) : (
            <ul>
              {clientes.map((cliente) => (
                <li
                  key={cliente.codcli}
                  onClick={() => seleccionarCliente(cliente)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                >
                  <div className="font-medium text-gray-800">{cliente.nomcli}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>DNI: {cliente.doccli}</span>
                    {cliente.plndes && (
                      <span className="ml-3 text-green-600">
                        • {cliente.plndes}
                      </span>
                    )}
                  </div>
                  {cliente.dircli && (
                    <div className="text-xs text-gray-400 mt-1">
                      📍 {cliente.dircli}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}