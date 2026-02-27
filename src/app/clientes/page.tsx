'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, CheckCircle } from 'lucide-react';

type TipoDocumento = 'DNI' | 'RUC';

interface FormData {
  tipoDocumento: TipoDocumento;
  nroDocumento: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  direccion: string;
  telefono: string;
  email: string;
}

export default function ClientesPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    tipoDocumento: 'DNI',
    nroDocumento: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    nombres: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);

  // ✅ Generar nombre completo para preview
  const nombreCompleto = `${formData.apellidoPaterno.trim()} ${formData.apellidoMaterno.trim()} ${formData.nombres.trim()}`.trim();

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validarFormulario = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Validar número de documento
    if (!formData.nroDocumento.trim()) {
      newErrors.nroDocumento = 'El número de documento es obligatorio';
    } else if (formData.tipoDocumento === 'DNI' && formData.nroDocumento.length !== 8) {
      newErrors.nroDocumento = 'El DNI debe tener 8 dígitos';
    } else if (formData.tipoDocumento === 'RUC' && formData.nroDocumento.length !== 11) {
      newErrors.nroDocumento = 'El RUC debe tener 11 dígitos';
    } else if (!/^\d+$/.test(formData.nroDocumento)) {
      newErrors.nroDocumento = 'Solo se permiten números';
    }

    // Validar apellido paterno
    if (!formData.apellidoPaterno.trim()) {
      newErrors.apellidoPaterno = 'El apellido paterno es obligatorio';
    }

    // Validar apellido materno
    if (!formData.apellidoMaterno.trim()) {
      newErrors.apellidoMaterno = 'El apellido materno es obligatorio';
    }

    // Validar nombres
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son obligatorios';
    }

    // Validar email (solo si se ingresó)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    // Validar teléfono (solo si se ingresó)
    if (formData.telefono.trim() && !/^\d{7,15}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener entre 7 y 15 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      // ✅ Preparar datos para enviar al API
      const dataParaAPI = {
        tipoDocumento: formData.tipoDocumento,
        nroDocumento: formData.nroDocumento,
        nombre: nombreCompleto,  // ← Nombre completo concatenado
        direccion: formData.direccion || null,
        telefono: formData.telefono || null,
        email: formData.email || null
      };

      console.log('📤 Enviando al API:', dataParaAPI);

      // ✅ Llamar al API
      const response = await fetch('/api/clientes/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataParaAPI)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al registrar cliente');
      }

      console.log('✅ Cliente registrado:', result);

      // ✅ Mostrar mensaje de éxito
      setMostrarExito(true);

      // ✅ Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setFormData({
          tipoDocumento: 'DNI',
          nroDocumento: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          nombres: '',
          direccion: '',
          telefono: '',
          email: ''
        });
        setMostrarExito(false);
      }, 2000);

    } catch (error: any) {
      console.error('❌ Error:', error);
      alert('Error al registrar cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    router.push('/venta');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleVolver}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver a Ventas
        </Button>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📝 Registrar Nuevo Cliente
        </h1>
        <p className="text-gray-600">
          Complete los datos del cliente para registrarlo en el sistema
        </p>
      </div>

      {/* Mensaje de éxito */}
      {mostrarExito && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="text-green-600" size={24} />
          <div>
            <p className="font-semibold text-green-900">¡Cliente registrado exitosamente!</p>
            <p className="text-sm text-green-700">Los datos han sido guardados correctamente</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Tipo de Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Documento <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tipoDocumento}
              onChange={(e) => handleChange('tipoDocumento', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
            </select>
          </div>

          {/* Número de Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Documento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nroDocumento}
              onChange={(e) => handleChange('nroDocumento', e.target.value)}
              placeholder={formData.tipoDocumento === 'DNI' ? '12345678 (8 dígitos)' : '12345678901 (11 dígitos)'}
              maxLength={formData.tipoDocumento === 'DNI' ? 8 : 11}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nroDocumento ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nroDocumento && (
              <p className="mt-1 text-sm text-red-600">{errors.nroDocumento}</p>
            )}
          </div>

          {/* Apellido Paterno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido Paterno <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.apellidoPaterno}
              onChange={(e) => handleChange('apellidoPaterno', e.target.value.toUpperCase())}
              placeholder="Digite el apellido paterno"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.apellidoPaterno ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.apellidoPaterno && (
              <p className="mt-1 text-sm text-red-600">{errors.apellidoPaterno}</p>
            )}
          </div>

          {/* Apellido Materno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido Materno <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.apellidoMaterno}
              onChange={(e) => handleChange('apellidoMaterno', e.target.value.toUpperCase())}
              placeholder="Digite el apellido materno"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.apellidoMaterno ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.apellidoMaterno && (
              <p className="mt-1 text-sm text-red-600">{errors.apellidoMaterno}</p>
            )}
          </div>

          {/* Nombres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombres <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombres}
              onChange={(e) => handleChange('nombres', e.target.value.toUpperCase())}
              placeholder="Digite nombre(s)"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombres ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nombres && (
              <p className="mt-1 text-sm text-red-600">{errors.nombres}</p>
            )}
          </div>

          {/* preview nombre completo */}
          {nombreCompleto && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium mb-1">
                Nombre completo:
              </p>
              <p className="text-lg font-bold text-blue-900">
                {nombreCompleto}
              </p>
            </div>
          )}

          {/* Dirección (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              placeholder="Digite direccion completa"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Teléfono (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder="Digite numero telefonico"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.telefono ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
            )}
          </div>

          {/* Email (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="digite correo electronico"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Nota de campos obligatorios */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <span className="text-red-500">*</span> Campos obligatorios
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleVolver}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <UserPlus size={20} className="mr-2" />
                  Guardar Cliente
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}