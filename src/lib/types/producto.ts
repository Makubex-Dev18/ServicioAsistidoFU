// Producto que devuelve tu SP
export interface ProductoCliente {
  codigo: string;           // código del producto
  descripcion: string;      // nombre/descripción
  precio: number;          // precio de venta
  stockAlm: number;        // stock disponible
  receta: string;
  imagen_url?: string; // ¿necesita receta? (puede ser 'S'/'N' o true/false)
}

// Para el carrito (frontend)
export interface ItemCarrito {
  codigo: string;          // código del producto
  descripcion: string;     // nombre
  precio: number;          // precio unitario
  cantidad: number;        // cantidad seleccionada
  subtotal: number;        // precio * cantidad
  receta?: string; // por si necesitas validar después
}



