import  { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

/**
 * Render a toast notification for the given toast data, using type-specific icon and styling, supporting automatic dismissal when `toast.duration` is set and manual dismissal via the close button.
 *
 * @param toast - Toast data (`id`, `type`, `message`, optional `duration`) used to display content and determine styling.
 * @param onClose - Callback invoked with the toast `id` to dismiss the toast.
 * @returns A JSX element representing the rendered toast notification.
 */
function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (!toast.duration) return;

    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const colors = {
    success: {
      bg: 'bg-green-50 dark:bg-green-950/30',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: 'text-green-600 dark:text-green-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-600 dark:text-red-400',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
  };

  const color = colors[toast.type];

  const Icon = {
    success: Check,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  }[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, x: 100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -10, x: 100 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${color.bg} ${color.border} ${color.text}`}
    >
      <Icon size={20} className={color.icon} />
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

/**
 * Render a fixed stack of animated toast notifications at the bottom-right of the viewport.
 *
 * @param toasts - Active toast messages to render in the container
 * @param onClose - Callback invoked with a toast `id` to dismiss that toast
 * @returns A React element representing the positioned toast container with animated toasts
 */
export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

