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
          "bg-white rounded-[2.5rem] rounded-tr-[0.75rem] rounded-bl-[0.75rem] p-8 md:p-10 shadow-2xl shadow-primary/10 animate-fade w-[95%] max-w-lg max-h-[85vh] overflow-y-auto border border-border",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
