'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Home,
  ShoppingCart, 
  Package, 
  Warehouse,
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { name: 'Inicio', href: '/', icon: <Home size={24} /> },
  { name: 'Venta', href: '/venta', icon: <ShoppingCart size={24} /> },
  { name: 'Productos', href: '/productos', icon: <Package size={24} /> },
  //{ name: 'Inventario', href: '/inventario', icon: <Warehouse size={24} /> },
  //{ name: 'Reportes', href: '/reportes', icon: <BarChart3 size={24} /> },
  { name: 'Configuración', href: '/configuracion', icon: <Settings size={24} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-expandir cuando hover
  const shouldExpand = isExpanded || isHovered;

  return (
    <>
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed left-0 top-0 h-screen bg-white shadow-lg
          transition-all duration-300 ease-in-out z-50
          ${shouldExpand ? 'w-64' : 'w-20'}
        `}
      >
        {/* Header con Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500">
          <div className={`
            transition-all duration-300 overflow-hidden
            ${shouldExpand ? 'w-48' : 'w-12'}
          `}>
            {shouldExpand ? (
              <div className="px-4">
                <h1 className="text-white font-bold text-xl">Farmacia</h1>
                <p className="text-blue-100 text-sm">Universal</p>
              </div>
            ) : (
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">FU</span>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-xl 
                  transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {/* Icon */}
                <span className={`
                  flex-shrink-0 transition-transform duration-200
                  ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                `}>
                  {item.icon}
                </span>

                {/* Text */}
                <span className={`
                  font-medium whitespace-nowrap transition-all duration-300
                  ${shouldExpand 
                    ? 'opacity-100 w-auto' 
                    : 'opacity-0 w-0 overflow-hidden'
                  }
                `}>
                  {item.name}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button (opcional) */}
        <div className="absolute bottom-6 left-0 right-0 px-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              w-full flex items-center justify-center gap-3 px-4 py-3
              bg-gray-100 hover:bg-gray-200 rounded-xl transition-all
              ${shouldExpand ? '' : 'px-0'}
            `}
          >
            {shouldExpand ? <X size={20} /> : <Menu size={20} />}
            <span className={`
              font-medium text-sm transition-all duration-300
              ${shouldExpand ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
            `}>
              {isExpanded ? 'Cerrar' : 'Abrir'} menú
            </span>
          </button>
        </div>

        {/* Hover Indicator */}
       {/*  {isHovered && !isExpanded && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2">
            <div className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
              Pasa el mouse para expandir
            </div>
          </div>
        )}
       */}
      </aside>

      {/* Spacer - Ajusta el contenido principal */}
      <div className={`
        transition-all duration-300
        ${shouldExpand ? 'w-64' : 'w-20'}
      `} />
    </>
  );
}