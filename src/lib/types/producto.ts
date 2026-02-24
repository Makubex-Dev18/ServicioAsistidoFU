// Producto que devuelve tu SP
export interface ProductoCliente {
  codigo: string;           // código del producto
  descripcion: string;      // nombre/descripción
  precio: number;          // precio base de venta
  stockAlm: number;        // stock disponible
  receta: string;         // ¿necesita receta? (puede ser 'S'/'N' o true/false)
  imagen_url?: string; 
  dtopro: number;  //descuento
  productoLab: string;  //producto laboratorio
  productoEstado: string; // estado del producto 
  productoStkfra: number; //producto stock fracionado
  PVP_F: number;  //producto precio entero 
  stockAlm_m: number; //stock fracionado disponible
  PVP_F_U: number; //producto precio fraccionado
}

// Para el carrito (frontend)
export interface ItemCarrito {
  codigo: string;          // código del producto
  descripcion: string;     // nombre
  precio: number;          // precio unitario
  //precioFinal: number;  // ✅ NUEVO: Precio con descuento aplicado
  cantidad: number;        // cantidad seleccionada
  subtotal: number;        // precio * cantidad
  receta?: string; // por si necesitas validar después
  tipoVenta: 'entero' | 'fraccion';  //tipo de venta
}



