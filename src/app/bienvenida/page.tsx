//import RootLayout from "../layout";

export function WelcomePage() {
  return (
   // {<RootLayout>}
      <div className="max-w-5xl mx-auto text-center py-12">
        {/* Logo Grande Central */}
        <div className="mb-12">
          <div className="w-48 h-48 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <span className="text-white text-7xl font-bold">FU</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Bienvenido
          </h2>
          <p className="text-2xl text-gray-600">
            Servicio Asistido de Farmacia Universal
          </p>
          <p className="text-2xl text-gray-400">
            Herramienta de apoyo para el personal y publico en general.Agiliza la búsqueda,precio,stock y genera tickets de pago para tus clientes en tiempo real 
          </p>

        </div>

        {/* Instrucciones */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">¿Cómo funciona?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Busca tu producto</h4>
              <p className="text-gray-600">Ingresa el nombre del medicamento o producto que necesitas</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Verifica disponibilidad</h4>
              <p className="text-gray-600">Consulta precios, stock y descuentos disponibles</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Genera tu ticket</h4>
              <p className="text-gray-600">Obtén tu ticket de atención para ir a caja</p>
            </div>
          </div>
        </div>

        {/* Botón Principal */}
        <button className="bg-blue-600 text-white px-16 py-6 rounded-2xl text-3xl font-bold hover:bg-blue-700 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105">
          INICIAR
        </button>

        <p className="text-gray-500 mt-6 text-lg">
          Presiona el botón para comenzar
        </p>
      </div>
    //</RootLayout>
  );
}