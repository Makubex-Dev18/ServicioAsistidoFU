import { NextResponse } from 'next/server';
import { executeSP } from '@/src/lib/db/connection';
import { ProductoLaboratorio } from '@/src/lib/types/productoLaboratorio';

// GET /api/principioActivoProductos?principio=PARACETAMOL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const principio = searchParams.get('principio') || '';

    console.log('🔍 Buscando productos con principio activo:', principio);

    if (!principio.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: 'Ingrese un principio activo para buscar'
      });
    }

    console.log('📋 Ejecutando SP con @busqueda:', principio.toUpperCase());

    // Ejecutar SP
    const productosRaw = await executeSP<any>(
      'dbo.SEL_CONSULTA_PRINCIPIOACTIVO_SAFU',
      {
        busqueda: principio.toUpperCase()
      }
    );

    console.log('📦 Resultados:', productosRaw.length);

    if (!productosRaw || productosRaw.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: `No se encontraron productos con principio activo ${principio}`
      });
    }

    // Mapear resultados
    const productos: ProductoLaboratorio[] = productosRaw.map((p: any) => ({
      codpro: String(p.codpro ?? ''),
      despro: String(p.despro ?? ''),
      codinf: String(p.codinf ?? ''),
      prisal: Number(p.prisal ?? 0),
      codlab: String(p.codlab ?? ''),
      nomlab: String(p.nomlab ?? ''),
      nomgen: String(p.nomgen ?? ''),  // ✅ Nombre del principio activo
      dtopro: Number(p.dtopro ?? 0),
      codalm: String(p.codalm ?? ''),
      stkalm: Number(p.stkalm ?? 0),
      stkalm_m: Number(p.stkalm_m ?? 0),
      ubipro: String(p.ubipro ?? '')
    }));

    console.log(`✅ ${productos.length} productos mapeados`);

    return NextResponse.json({
      success: true,
      data: productos,
      count: productos.length,
      principio: principio.toUpperCase()
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al buscar productos',
      message: error.message
    }, { status: 500 });
  }
}