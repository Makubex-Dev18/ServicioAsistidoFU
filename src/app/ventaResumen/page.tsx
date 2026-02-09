'use client';


export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

interface ResumenVentaProps {
  items: ItemCarrito[];
  onEliminar: (id: number) => void;
  onLimpiar: () => void;
  onCambiarCantidad: (id: number, cantidad: number) => void;
}