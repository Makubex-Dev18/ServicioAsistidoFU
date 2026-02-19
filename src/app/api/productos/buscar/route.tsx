import { NextResponse } from 'next/server';
import { executeSP, query } from '@/src/lib/db/connection';
import { ProductoCliente } from '@/src/lib/types/producto';

//GET /api/productos/buscar?q=PANADOL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const busqueda = searchParams.get('q') || '';

    console.log('🔍 Buscando productos:', busqueda);

    // Si no hay búsqueda, devolver array vacío
    if (!busqueda.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0
      });
    }

    // Ejecutar el SP con los parámetros
    /*
    const productos = await executeSP<ProductoCliente>(
      'dbo.SEL_CONSULTA_PRODUCTOS_CLIENTE_SAFU',
      {
        despro: `${busqueda}%`,  // Término de búsqueda
        codalm: '01',            // Fijo por ahora
        siscod: 1,               // Fijo por ahora
        plnnum: '000000',        // Fijo por ahora
        cuscod: '0000000',       // Fijo por ahora
        oriprg: 'VENTAS'         // Fijo por ahora
      }
    );
    */
// 1️⃣ Ejecutar SP (crudo)
const productosRaw = await executeSP<any>(
  'dbo.SEL_CONSULTA_PRODUCTOS_CLIENTE_SAFU',
  {
    despro: `${busqueda}%`,
    codalm: '01',
    siscod: 1,
    plnnum: '000000',
    cuscod: '0000000',
    oriprg: 'VENTAS'
  }
);


// 👇 DEBUG opcional
console.log('RAW SQL:', productosRaw[0]);

console.log('COLUMNAS REALES:', Object.keys(productosRaw[0]));
console.log('DATA REAL:', productosRaw[0]);

const meta = await query<{ def: string }>(
  `SELECT OBJECT_DEFINITION(OBJECT_ID('dbo.SEL_CONSULTA_PRODUCTOS_CLIENTE_SAFU')) as def`
);
console.log('DEF SAFU (inicio):', meta?.[0]?.def?.slice(0, 300));


// 2️⃣ MAPEO (AQUÍ ESTÁ LA MAGIA ✨)
const productos: ProductoCliente[] = productosRaw.map((p: any) => ({
  codigo: p.codigo ?? p.codpro ?? '',
  descripcion: p.descripcion ?? p.despro ?? '',
  precio: Number(p.precio ?? p.preven ?? p.prepro ?? 0),
  stockAlm: Number(p.stockAlm ?? p.stock ?? 0),
  receta: p.receta ?? undefined,
  imagen_url: p.imagen_url ?? undefined,
}));





console.log('🔥 API EJECUTADA:', new Date().toISOString());

    console.log(`✅ Encontrados ${productos.length} productos`);
    console.log(productos[0]);

    return NextResponse.json({
      success: true,
      data: productos,
      count: productos.length
      
    });

  } catch (error: unknown) {
    console.error('❌ Error al buscar productos:', error);
    const info = getErrorInfo(error);

    return NextResponse.json({
      success: false,
      error: 'Error al buscar productos',
      message: info.message
    }, { status: 500 });
  }
}





function getErrorInfo(err: unknown) {
  if (err instanceof Error) {
    return {
      message: err.message,
      // "code" no existe en Error por defecto, por eso lo sacamos con guard extra:
      code: (err as { code?: string }).code,
    };
  }

  // Si lanzaron un string u otra cosa
  return {
    message: String(err),
    code: undefined,
  };
}
