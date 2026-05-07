'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="max-w-[420px] p-6">
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Eliminando...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
}
