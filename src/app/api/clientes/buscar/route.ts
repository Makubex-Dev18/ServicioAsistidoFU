import { NextResponse } from 'next/server';
import { executeSP } from '@/src/lib/db/connection';
import { Cliente } from '@/src/lib/types/cliente';

// GET /api/clientes/buscar?q=RIVAS
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const busqueda = searchParams.get('q') || '';

    console.log('🔍 Buscando cliente:', busqueda);

    if (!busqueda.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0
      });
    }

    // Ejecutar SP de búsqueda de clientes
    // TODO: Reemplaza con el nombre real de tu SP
    const clientes = await executeSP<Cliente>(
      'dbo.SEL_BUSCAR_CLIENTES_SAFU',  // ← Nombre de tu SP
      {
        busqueda: busqueda.toUpperCase(),  // Convertir a mayúsculas
        tipoBusqueda: 'A'  // Auto-detectar (A = ambos)
        // busqueda: `${busqueda}%`,
        // Otros parámetros que necesite tu SP
      }
    );

    console.log(`✅ Encontrados ${clientes.length} clientes`);

    return NextResponse.json({
      success: true,
      data: clientes,
      count: clientes.length
    });

  } catch (error: any) {
    console.error('❌ Error al buscar clientes:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al buscar clientes',
      message: error.message
    }, { status: 500 });
  }
}