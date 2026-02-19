'use client';

import { useState } from 'react';
import { Database, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ConnectionInfo = {
  version?: string;
  server?: string;
  port?: number;
  user?: string;
  database?: string;
};

export type DatabaseInfo = {
  ServerName?: string;
  DatabaseName?: string;
};

export type ErrorDetails = {
  server?: string;
  database?: string;
  user?: string;
  error?: string;
  code?: string;
};

interface TestResult {
  success: boolean;
  message?: string;
  connection?: ConnectionInfo;
  database?: DatabaseInfo;
  tables?: string[];
  tableCount?: number;
  error?: string;
  details?: ErrorDetails;
}

export default function TestDBPage() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/prueba');

      // Si el endpoint devuelve error HTTP, igual capturamos mensaje
      const data = (await res.json()) as TestResult;

      if (!res.ok) {
        setResult({
          success: false,
          error: data?.error ?? data?.message ?? `HTTP ${res.status}`,
          details: data?.details,
        });
        return;
      }

      setResult(data);
    } catch (error: unknown) {
      const info = getErrorInfo(error);
      setResult({
        success: false,
        error: info.message,
        details: { code: info.code },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Database size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Prueba de Conexión a SQL Server
          </h1>
        </div>
        <p className="text-gray-600">
          Verifica que la conexión a tu base de datos esté configurada correctamente
        </p>
      </div>

      {/* Botón de prueba */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <Button onClick={handleTest} variant="default" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" size={20} />
              Probando conexión...
            </>
          ) : (
            <>
              <Database className="mr-2" size={20} />
              Probar Conexión
            </>
          )}
        </Button>
      </div>

      {/* Resultado */}
      {result && (
        <div
          className={`rounded-lg shadow-lg p-6 ${
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {/* Header del resultado */}
          <div className="flex items-center gap-3 mb-4">
            {result.success ? (
              <CheckCircle size={32} className="text-green-600" />
            ) : (
              <XCircle size={32} className="text-red-600" />
            )}
            <h2
              className={`text-2xl font-bold ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {result.success ? '✅ Conexión Exitosa' : '❌ Error de Conexión'}
            </h2>
          </div>

          {/* Detalles de conexión exitosa */}
          {result.success && (
            <div className="space-y-4">
              {/* Info del servidor */}
              {result.database && (result.database.ServerName || result.database.DatabaseName) && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Información del Servidor:
                  </h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-gray-600">Servidor:</dt>
                    <dd className="font-mono text-gray-800">
                      {result.database.ServerName ?? '-'}
                    </dd>

                    <dt className="text-gray-600">Base de Datos:</dt>
                    <dd className="font-mono text-gray-800">
                      {result.database.DatabaseName ?? '-'}
                    </dd>
                  </dl>
                </div>
              )}

              {/* Tablas */}
              {result.tables && result.tables.length > 0 && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Tablas Encontradas ({result.tableCount ?? result.tables.length}):
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {result.tables.map((table) => (
                      <div
                        key={table}
                        className="bg-gray-50 px-3 py-2 rounded text-sm font-mono text-gray-700"
                      >
                        📋 {table}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Versión de SQL Server */}
              {result.connection?.version && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Versión SQL Server:</h3>
                  <p className="text-xs font-mono text-gray-600 break-all">
                    {result.connection.version}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error details */}
          {!result.success && (
            <div className="bg-white rounded-lg p-4 space-y-3">
              {result.error && (
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Error:</h3>
                  <p className="text-sm text-red-700">{result.error}</p>
                </div>
              )}

              {result.details && (
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">
                    Detalles de configuración:
                  </h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-gray-600">Servidor:</dt>
                    <dd className="font-mono text-gray-800">{result.details.server ?? '-'}</dd>

                    <dt className="text-gray-600">Base de datos:</dt>
                    <dd className="font-mono text-gray-800">{result.details.database ?? '-'}</dd>

                    <dt className="text-gray-600">Usuario:</dt>
                    <dd className="font-mono text-gray-800">{result.details.user ?? '-'}</dd>

                    {result.details.code && (
                      <>
                        <dt className="text-gray-600">Código:</dt>
                        <dd className="font-mono text-gray-800">{result.details.code}</dd>
                      </>
                    )}
                  </dl>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>Verifica:</strong>
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc space-y-1">
                      <li>SQL Server está corriendo</li>
                      <li>Las credenciales son correctas</li>
                      <li>El puerto 1433 está abierto</li>
                      <li>SQL Server acepta conexiones TCP/IP</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getErrorInfo(err: unknown): { message: string; code?: string } {
  if (err instanceof Error) {
    return {
      message: err.message,
      code: (err as { code?: string }).code,
    };
  }

  return {
    message: String(err),
    code: undefined,
  };
}
