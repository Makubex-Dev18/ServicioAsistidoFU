import React from "react";
import Image from "next/image";
import { HelpCircle, Clock,Bell } from 'lucide-react';
import Link from "next/link";

const Header = () => {


  return (

    <header className="bg-white shadow-sm border-b-2 border-blue-600">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y Título */}
          <Image
            src="/img/logo.png"
            alt="Logo Farmacia Universal"
            width={150}
            height={150}
            className="object-contain"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              SAFU
            </h1>
          </div>

          {/* Información de sesión/hora */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">
                {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <button className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
              <HelpCircle className="w-5 h-5" />
              <Link  href="/instrucciones" className="font-medium">Instrucciones</Link>
              
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
export default Header;

