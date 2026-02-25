import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db/connection';
import { InformacionFarmacologica } from '@/src/lib/types/productoLaboratorio';

// GET /api/productos/info-farmacologica?codinf=00987
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const codinf = searchParams.get('codinf') || '';

    console.log('📋 Buscando información farmacológica:', codinf);

    // Validar que haya código
    if (!codinf.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Código de información requerido'
      }, { status: 400 });
    }

    // Ejecutar query
    const resultado = await query<InformacionFarmacologica>(
      `SELECT txtinf, desinf, picinf 
       FROM fa_informacion 
       WHERE codinf = @codinf`,
      {
        codinf: codinf
      }
    );

    // Si no hay resultados
    if (resultado.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Sin información farmacológica disponible'
      });
    }

    console.log('✅ Información encontrada para código:', codinf);

    return NextResponse.json({
      success: true,
      data: resultado[0]
    });

  } catch (error: any) {
    console.error('❌ Error al obtener información farmacológica:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener información',
      message: error.message
    }, { status: 500 });
  }
}