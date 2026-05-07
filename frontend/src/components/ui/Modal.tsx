import * as React from "react"
import { cn } from "@/utils/cn"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#4a3f35]/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={cn(
          "bg-background rounded-xl p-8 shadow-2xl animate-fade w-[95%] max-w-lg max-h-[90vh] overflow-y-auto border border-border",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
