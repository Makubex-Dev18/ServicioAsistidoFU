import sql from 'mssql';

// Configuración de conexión
const config: sql.config = {
  server: process.env.DB_SERVER || '192.168.90.46',
  port: parseInt(process.env.DB_PORT || '1433'),
  user: process.env.DB_USER || 'fu_consultas',
  password: process.env.DB_PASSWORD || 'fusac2021',
  database: process.env.DB_DATABASE || 'LOLFAR_PRUEBAS',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // true para Azure, false para local
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true', // true para local
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 30000, // 15 segundos
  requestTimeout: 60000, // 15 segundos
};

// Pool de conexiones (singleton)
let pool: sql.ConnectionPool | null = null;

// Función para obtener el pool
export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('✅ Conexión a SQL Server establecida');
      console.log('📊 Base de datos:', config.database);
      console.log('🖥️  Servidor:', config.server);
    } catch (error) {
      console.error('❌ Error al conectar a SQL Server:', error);
      throw error;
    }
  }
  return pool;
}



// Función helper para ejecutar queries
export async function query<T = unknown>(
  queryString: string,
  params?: { [key: string]: unknown }
): Promise<T[]> {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Agregar parámetros si existen
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }

    const result = await request.query(queryString);
    return result.recordset as T[];
  } catch (error) {
    console.error('❌ Error en query:', error);
    throw error;
  }
}




// Función para queries que devuelven un solo resultado (INSERT, UPDATE, DELETE)
export async function execute(
  queryString: string,
  params?: { [key: string]: unknown }
): Promise<unknown> {
  try {
    const pool = await getPool();
    const request = pool.request();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }

    const result = await request.query(queryString);
    return result;
  } catch (error) {
    console.error('❌ Error en execute:', error);
    throw error;
  }
}



// Función para ejecutar Stored Procedures
export async function executeSP<T = unknown>(
  spName: string,
  params?: { [key: string]: unknown }
): Promise<T[]> {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Agregar parámetros si existen
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }

    const result = await request.execute(spName);
    return result.recordset as T[];
  } catch (error) {
    console.error('❌ Error ejecutando SP:', spName, error);
    throw error;
  }
}


// Verificar conexión
export async function testConnection(): Promise<{
  success: boolean;
  message: string;
  details?: unknown;
}> {
  try {
    const pool = await getPool();
    
    // Hacer una query simple de prueba
    const result = await pool.request().query('SELECT @@VERSION as version');
    
    return {
      success: true,
      message: 'Conexión exitosa a SQL Server',
      details: {
        version: result.recordset[0]?.version,
        database: process.env.DB_DATABASE,
        server: process.env.DB_SERVER
      }
    };
  } catch (error: unknown) {
    const info = getErrorInfo(error);
    return {
      success: false,
      message: 'Error al conectar a SQL Server',
      details: {
        error: info.message,
        code: info.code
      }
    };
  }
}

// Cerrar conexión (útil para cleanup)
export async function closePool(): Promise<void> {
  if (pool) {
    try {
      await pool.close();
      pool = null;
      console.log('🔌 Conexión a SQL Server cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar conexión:', error);
    }
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



