'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface BuscadorProductoProps {
  onBuscar: (termino: string) => void;
}

export default function BuscadorProducto({ onBuscar }: BuscadorProductoProps) {
  const [termino, setTermino] = useState('');

  const handleBuscar = () => {
    onBuscar(termino);
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
        placeholder="Buscar producto por nombre o código..."
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleBuscar}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <Search size={20} />
      </button>
    </div>
  );
}