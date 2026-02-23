import React from "react";
import Image from "next/image";
import { HelpCircle, Clock,Bell } from 'lucide-react';
import Link from "next/link";

const Header = () => {


  return (

    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b-2 border-blue-600">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo y Título */}
          
          <div className="flex-shrink-0">
          <Image
            src="/img/logo.png"
            alt="Logo Farmacia Universal"
            width={160}
            height={50}
            className="object-contain h-10 w-auto sm:h-12"
          />
          </div>
          
          {/* Información de sesión/hora */}
          <div className="flex items-center gap-3 sm:gap-6">
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

