import React from "react";
import type { ToastMessage, ToastType } from "../components/Toast";

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, message: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (message: string, duration?: number) =>
    addToast("success", message, duration);
  const error = (message: string, duration?: number) =>
    addToast("error", message, duration);
  const info = (message: string, duration?: number) =>
    addToast("info", message, duration);
  const warning = (message: string, duration?: number) =>
    addToast("warning", message, duration);

  return {
    toasts,
    removeToast,
    success,
    error,
    info,
    warning,
  };
}
