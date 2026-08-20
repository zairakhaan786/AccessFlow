"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  type?: "success" | "error";
}

let toastListeners: Array<(msg: ToastMessage) => void> = [];

export function showToast(message: string, type: "success" | "error" = "success") {
  const toast: ToastMessage = {
    id: `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    message,
    type,
  };
  toastListeners.forEach((listener) => listener(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<ToastMessage & { leaving?: boolean }>>([]);

  useEffect(() => {
    const handleAddToast = (newToast: ToastMessage) => {
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === newToast.id ? { ...t, leaving: true } : t))
        );
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, 200);
      }, 2800);
    };

    toastListeners.push(handleAddToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleAddToast);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container fixed bottom-6 right-6 z-[90] flex flex-col gap-2.5 items-end pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast pointer-events-auto flex items-center gap-2.5 text-white px-4 py-3 rounded-[var(--radius-control)] text-[13px] font-semibold shadow-lg max-w-[360px] ${
            toast.type === "error"
              ? "bg-[#991B1B] text-white"
              : "bg-[#065F46] text-white"
          } ${toast.leaving ? "animate-toastOut" : "animate-toastIn"}`}
        >
          <span className="toast-icon flex flex-shrink-0">
            {toast.type === "error" ? (
              <XCircle className="w-4 h-4 text-[#FCA5A5]" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#6EE7B7]" />
            )}
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
