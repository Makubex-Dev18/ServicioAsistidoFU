
"use client"
import { CopyCheck, CircleCheck, House } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DespedidaPage() {

  const router = useRouter();
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">

      {/* MAIN */}
      <main className="flex flex-1 items-center justify-center p-2">
        <div className="flex flex-col max-w-[800px] w-full  bg-white dark:bg-navy-dark/50 rounded-xl shadow-2xl overflow-hidden">

          {/* ICONO SUPERIOR */}
          <div className="relative w-full h-64 bg-primary-navy/[0.03] dark:bg-primary-navy/20 flex items-center justify-center p-8">

            <div className="relative flex flex-col items-center">

              <div className="size-32 rounded-full bg-primary-navy flex items-center justify-center text-white shadow-xl mb-4 border-8 border-white dark:border-navy-dark">
                <span className="material-symbols-outlined !text-[80px]">
                  <CircleCheck size={80} color="#0a2985" strokeWidth={1.75} />
                </span>
              </div>

            </div>
          </div>

          {/* CONTENIDO */}
          <div className="px-12 py-10 text-center">

            <h1 className="text-primary-navy dark:text-white text-[36px] font-extrabold pb-4">
              ¡Gracias por elegir Farmacia Universal!
            </h1>

            <p className="text-navy-dark/70 dark:text-white/70 text-lg font-medium pb-8">
              Tu ticket ha sido generado correctamente. Por favor,
              <span className="text-primary-navy dark:text-primary-red font-bold">
                {" "}retíralo de la ranura{" "}
              </span>
              y dirígete a la caja para completar tu pago.
            </p>

            {/* BOTON */}
            <Button onClick={() => router.push("/bienvenida")} className="bg-blue-500  px-15 py-10 rounded-2xl">
              <span className="material-symbols-outlined"><House size={28} color="#e4e4e4ff" strokeWidth={1.75} /></span>
              Finalizar y Volver al Inicio
            </Button>

          </div>

          {/* FOOTER CARD */}
          <div className="bg-primary-navy/[0.02] dark:bg-white/5 py-4 px-12 flex justify-between items-center border-t border-primary-navy/10">
            <div className="flex items-center gap-2 text-navy-dark/40 dark:text-white/40 text-sm">

              <span>Transacción Segura</span>
            </div>


          </div>

        </div>
      </main>


    </div>
  );
}
