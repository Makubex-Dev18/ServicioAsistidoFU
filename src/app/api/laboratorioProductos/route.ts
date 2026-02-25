import { NextResponse } from 'next/server';
import { executeSP } from '@/src/lib/db/connection';
import { ProductoLaboratorio } from '@/src/lib/types/productoLaboratorio';

// GET /api/laboratorios/productos?laboratorio=BIODERMA
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const laboratorio = searchParams.get('laboratorio') || '';

    console.log('🔍 Buscando productos del laboratorio:', laboratorio);

    // Validar que haya laboratorio
    if (!laboratorio.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: 'Ingrese un laboratorio para buscar'
      });
    }

    // Ejecutar SP
    const productosRaw = await executeSP<any>(
      'dbo.SEL_CONSULTA_LABORATORIO_SAFU',
      {
        busqueda: laboratorio.toUpperCase()
      }
    );

    // Mapear resultados
    const productos: ProductoLaboratorio[] = productosRaw.map((p: any) => ({
      codpro: p.codpro ?? '',
      despro: p.despro ?? '',
      codinf: p.codinf ?? '',
      prisal: Number(p.prisal ?? 0),
      codlab: p.codlab ?? '',
      nomlab: String(p.nomlab ?? ''),
      dtopro: Number(p.dtopro ?? 0),
      codalm: p.codalm ?? '',
      stkalm: Number(p.stkalm ?? 0),
      stkalm_m: Number(p.stkalm_m ?? 0),
      ubipro: p.ubipro ?? ''
    }));

    console.log(`✅ Encontrados ${productos.length} productos del laboratorio ${laboratorio}`);

    return NextResponse.json({
      success: true,
      data: productos,
      count: productos.length,
      laboratorio: laboratorio.toUpperCase()
    });

  } catch (error: any) {
    console.error('❌ Error al buscar productos por laboratorio:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al buscar productos',
      message: error.message
    }, { status: 500 });
  }
}