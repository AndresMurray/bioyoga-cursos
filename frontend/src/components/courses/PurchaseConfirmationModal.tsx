'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
  courseTitle: string;
}

export default function PurchaseConfirmationModal({
  isOpen,
  onClose,
  whatsappNumber,
  courseTitle,
}: PurchaseConfirmationModalProps) {
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent(
    `Hola! Acabo de realizar la compra del curso "${courseTitle}". Te envío el comprobante de pago.`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${whatsappMessage}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-8">
      <div className="flex flex-col items-center text-center">
        <div className="text-5xl mb-5">🛒</div>
        <h3 className="text-2xl font-bold text-primary mb-4">¡Último paso!</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed text-[15px]">
          Una vez que realices tu compra, enviá el comprobante de pago por WhatsApp 
          y en breve te concederemos acceso al curso.
        </p>
        <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
          <span className="font-semibold text-foreground">Recibirás una notificación por mail</span> cuando tu acceso esté habilitado.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg mb-4"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.897-5.335 11.9-11.894a11.83 11.83 0 00-3.429-8.414" />
          </svg>
          Enviar comprobante por WhatsApp
        </a>
        <p className="text-xs text-muted-foreground mb-4">
          ({whatsappNumber})
        </p>

        <Button
          variant="secondary"
          onClick={onClose}
          className="w-full"
        >
          Cerrar
        </Button>
      </div>
    </Modal>
  );
}
