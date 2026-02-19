import { NextResponse } from 'next/server';
import { testConnection,query } from '@/src/lib/db/connection';

export async function GET() {
  try {
    console.log('🔍 Iniciando prueba de conexión...');
    
    // 1. Probar conexión
    const connectionTest = await testConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'No se pudo conectar a la base de datos',
        details: connectionTest.details
      }, { status: 500 });
    }

    // 2. Listar tablas
    const tables = await query(`
      
 SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME

    `);

    // 3. Obtener info de la base de datos
    const dbInfo = await query(`
      SELECT 
        DB_NAME() as DatabaseName,
        @@SERVERNAME as ServerName,
        @@VERSION as Version
    `);

    return NextResponse.json({
      success: true,
      message: '✅ Conexión exitosa a SQL Server',
      connection: connectionTest.details,
      database: dbInfo[0],
      //tables: tables.map((t: unknown) => t.TABLE_NAME),
      tables: (tables as { TABLE_NAME: string }[]).map(t => t.TABLE_NAME),
      tableCount: tables.length
    });

  } catch (error: unknown) {
    console.error('❌ Error en prueba:', error);
    const info = getErrorInfo(error);
    return NextResponse.json({
      success: false,
      error: 'Error al probar la conexión',
      message: info.message,
      code: info.code,
      details: {
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER
      }
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
