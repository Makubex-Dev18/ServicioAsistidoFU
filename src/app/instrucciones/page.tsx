"use client";
import React from "react";
import Router from "next/router";
import { Search, TriangleAlert, Speech, Printer, BadgeCheck,MessageCircleQuestionMark } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Instructions = () => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative">

                {/* BOTON CERRAR */}
                <Button onClick={() => Router.back()} className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg">
                    Cerrar
                </Button>

                {/* AQUI PEGAS TU COMPONENTE DE INSTRUCCIONES */}
                <div className="p-6">

                    {/* puedes importar tu InstructionsPage */}
                    {/* <InstructionsPage /> */}

                    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display">
                        {/* HEADER */}
                        <header className="w-full border-b border-primary/10 bg-white dark:bg-background-dark/50 sticky top-0 z-50">
                            <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">

                                    </div>

                                    <div>
                                        <h2 className="text-[#004687] dark:text-slate-100 text-lg font-extrabold leading-none tracking-tight">
                                            FARMACIA UNIVERSAL
                                        </h2>
                                        <p className="text-brand-red text-xs font-bold tracking-widest uppercase mt-1">
                                            Asistente de Ventas
                                        </p>
                                    </div>
                                </div>

                                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-sm">
                                    <span className="material-symbols-outlined text-lg">Cerrar</span>
                                </button>
                            </div>
                        </header>

                        {/* MAIN */}
                        <main className="max-w-5xl mx-auto px-6 py-12">
                            <div className="text-center mb-16">
                                <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-extrabold tracking-tight mb-4">
                                    Instrucciones de Uso
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                                    Guía rápida para brindar una atención excepcional y eficiente a
                                    nuestros clientes.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {[
                                    {
                                        id: "01",
                                        icon: <Search size={92} color="#236cbeff" />,
                                        title: "Busca",
                                        text: "Localiza productos rápidamente utilizando el buscador inteligente por nombre.",
                                        color: "brand-orange",
                                    },
                                    {
                                        id: "02",
                                        icon: <TriangleAlert size={92} color="#e66e2d" />,
                                        title: "Verifica Alertas",
                                        text: "Presta atención a los indicadores del sistema. Te notificará sobre requisitos de receta médica obligatoria.",
                                        color: "brand-orange",
                                    },
                                    {
                                        id: "03",
                                        icon: <Speech size={92} color="#236cbeff" />,
                                        title: "Recomienda",
                                        text: "Si un producto no está disponible, realiza la recomendación de marcas similares con el mismo principio activo.",
                                        color: "brand-orange",
                                    },
                                    {
                                        id: "04",
                                        icon: <Printer size={92} color="#236cbeff" />,
                                        title: "Imprime",
                                        text: "Finaliza el proceso enviando el ticket de preventa a la impresora.",
                                        color: "brand-orange",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.id}
                                        className="group relative bg-white dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/40 transition-all hover:shadow-xl"
                                    >
                                        <div className="absolute top-6 right-8 text-primary/10 dark:text-slate-700 text-7xl font-black select-none -z-0">
                                            {item.id}
                                        </div>

                                        <div className="relative z-10">
                                            <div
                                                className={`size-14 ${item.color === "brand-orange"
                                                    ? "bg-brand-orange/10 text-brand-orange"
                                                    : "bg-primary/10 text-primary"
                                                    } rounded-xl flex items-center justify-center mb-6`}
                                            >
                                                <span className="material-symbols-outlined text-3xl">
                                                    {item.icon}
                                                </span>
                                            </div>

                                            <h3 className="text-primary dark:text-slate-100 text-xl font-bold mb-3">
                                                {item.title}
                                            </h3>

                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col items-center gap-6 pt-8 border-t border-slate-200 dark:border-slate-700">

                                <Button variant={'default'} className="bg-blue-500 mx-auto block w-64 h-14 rounded-lg">
                                    Entendido, Continuar
                                </Button>

                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base"><MessageCircleQuestionMark size={25} color="#0a2985" strokeWidth={1.75} /></span>
                                    ¿Necesitas ayuda adicional? Contacta a tu supervisor de planta.
                                </p>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Instructions;

