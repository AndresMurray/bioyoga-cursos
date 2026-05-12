'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: NotificationType;
  onClose: () => void;
}

export default function NotificationModal({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
}: NotificationModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <div className="text-4xl mb-4">✅</div>;
      case 'error':
        return <div className="text-4xl mb-4">⚠️</div>;
      default:
        return <div className="text-4xl mb-4">ℹ️</div>;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] p-8 text-center">
      <div className="flex flex-col items-center">
        {getIcon()}
        <h3 className={`text-2xl font-bold mb-3 ${getTitleColor()}`}>{title}</h3>
        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{message}</p>
        <Button
          variant="secondary"
          onClick={onClose}
          className="w-full sm:w-auto px-8"
        >
          Aceptar
        </Button>
      </div>
    </Modal>
  );
}
