import React from "react";
import type { ToastMessage, ToastType } from "../components/Toast";

/**
 * Provides utilities for managing toast notifications and access to the current list of toasts.
 *
 * @returns An object containing:
 * - `toasts`: the current array of `ToastMessage` entries.
 * - `removeToast(id)`: removes the toast with the given `id`.
 * - `success(message, duration?)`: adds a success toast with `message`; `duration` defaults to 4000.
 * - `error(message, duration?)`: adds an error toast with `message`; `duration` defaults to 4000.
 * - `info(message, duration?)`: adds an info toast with `message`; `duration` defaults to 4000.
 * - `warning(message, duration?)`: adds a warning toast with `message`; `duration` defaults to 4000.
 */
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
