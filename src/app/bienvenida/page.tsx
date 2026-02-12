//import RootLayout from "../layout";

"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router=useRouter();
  return (
   // {<RootLayout>}
      <div className="max-w-5xl mx-auto text-center py-12">
        {/* Logo Grande Central */}
        <div className="mb-12">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <span className="text-white text-5xl font-bold">FU</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Bienvenido
          </h2>
          <p className="text-2xl text-gray-600">
            Servicio Asistido de Farmacia Universal
          </p>
          {/*<p className="text-2xl text-gray-400">
            Herramienta de apoyo para el personal y publico en general.Agiliza la búsqueda,precio,stock y genera tickets de pago para tus clientes en tiempo real 
          </p>*/}

        </div>


 {/* Hero Final con Robot */}
<div className="mt-2 bg-white rounded-3xl shadow-2xl p-5">
  <div className="flex flex-col md:flex-row items-center justify-between gap-10">
    
    {/* Lado Izquierdo */}
    <div className="text-center md:text-left flex-1">
      <h3 className="text-4xl font-bold text-blue-700 mb-6">
        Estamos listos para ayudarte
      </h3>

      <p className="text-gray-600 text-lg mb-8">
        Nuestro asistente te ayudará a encontrar productos,
        verificar disponibilidad y generar tu ticket de forma rápida y segura.
      </p>

      <Button
        onClick={() => router.push("/venta")}
        className="bg-blue-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-blue-700 transition-all shadow-xl hover:scale-105"
      >
        INICIAR
      </Button>

      <p className="text-gray-500 mt-4">
        Presiona el botón para comenzar
      </p>
    </div>

    {/* Lado Derecho - Imagen Robot */}
    <div className="flex-1 flex justify-center">
      <img
        src="/img/BotAsistente.png"
        alt="Asistente Virtual Farmacia Universal"
        className="w-80 md:w-96 drop-shadow-2xl animate-fadeIn"
      />
    </div>
  </div>
</div>




        {/* Instrucciones */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12 mt-0.5 ">
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
      {/*
      <Button onClick={()=>router.push("/venta")} className="bg-blue-600 text-white px-15 py-10 rounded-2xl text-3xl font-bold hover:bg-blue-700 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105">
          INICIAR
        </Button>
        

        <p className="text-gray-500 mt-6 text-lg">
          Presiona el botón para comenzar
        </p>
        */}
      </div>
    //</RootLayout>

  );
}