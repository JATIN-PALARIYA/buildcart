import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "md" | "lg";
}

export function Modal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  maxWidth = "md",
}: ModalProps) {
  if (!isOpen) return null;

  const maxWClass = maxWidth === "lg" ? "max-w-lg" : "max-w-md";

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className={`bg-card border border-border rounded-xl ${maxWClass} w-full p-5 shadow-md relative overflow-hidden`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>

        {children}
      </div>
    </div>
  );
}

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action is permanent and cannot be undone.",
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-card border border-border rounded-xl max-w-sm w-full p-6 shadow-md">
        <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">{description}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg text-xs border border-border hover:bg-secondary/80 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 bg-destructive text-destructive-foreground font-semibold rounded-lg text-xs hover:opacity-90 transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
