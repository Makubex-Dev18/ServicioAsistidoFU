// Tipos para el módulo de consulta de productos

export interface ProductoLaboratorio {
  codpro: string;        // Código producto
  despro: string;        // Descripción
  codinf: string;        // Código información farmacológica
  prisal: number;        // Precio
  codlab: string;        // Código laboratorio
  nomlab?: string;       // nombre laboratorio
  nomgen?: string;  
  dtopro: number;        // Descuento (%)
  codalm: string;        // Código almacén
  stkalm: number;        // Stock entero
  stkalm_m: number;      // Stock fraccionado
  ubipro: string;        // Ubicación
}

// Resultado de fa_informacion
export interface InformacionFarmacologica {
  txtinf: string;        // Texto información
  desinf: string;        // Descripción información
  picinf: string | null; // Imagen (puede ser null si no tiene)
}

// Para el selector de tipo de búsqueda
export type TipoBusqueda = 'laboratorio' | 'principio-activo';