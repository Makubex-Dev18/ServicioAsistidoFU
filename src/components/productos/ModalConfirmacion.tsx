'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X } from 'lucide-react';

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombreProducto: string;
  codigoProducto: string;
}

export default function ModalConfirmacion({
  isOpen,
  onClose,
  onConfirm,
  nombreProducto,
  codigoProducto
}: ModalConfirmacionProps) {
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="text-blue-600" size={24} />
            Agregar al buscador de ventas
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-base text-gray-700 mb-4">
            ¿Está seguro que desea agregar este producto a la busqueda de ventas?
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="font-semibold text-gray-900 mb-2">
              {nombreProducto}
            </p>
            <p className="text-sm text-gray-600">
              Código: <span className="font-mono font-semibold">{codigoProducto}</span>
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X size={16} />
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <ShoppingCart size={16} />
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}