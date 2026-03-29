import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import Button from '../../ui/Button';
import type { ReactNode } from 'react';

interface DangerZoneProps {
  onClick: () => Promise<void> | void;
  children: ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
}

/**
 * Render a danger zone panel with a trigger button and a confirmation modal for destructive actions.
 *
 * When the confirmation is accepted, the provided `onClick` handler is invoked; a loading state is shown while it runs and the modal closes after completion.
 *
 * @param onClick - Handler to invoke after the user confirms the action
 * @param children - Content shown inside the trigger button (label or elements)
 * @param title - Modal title shown when confirming (defaults to `'Are you absolutely sure?'`)
 * @param description - Modal message describing the action (defaults to `'This action cannot be undone. Please proceed with caution.'`)
 * @param confirmText - Text for the modal confirm button (defaults to `'Delete'`)
 * @returns A React element that renders the danger panel, trigger button, and confirmation modal
 */
function DangerZone({
  onClick,
  children,
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. Please proceed with caution.',
  confirmText = 'Delete',
}: DangerZoneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-6 border border-red-200 dark:border-red-800/50 space-y-4">
        <div>
          <h2 className="text-lg font-ui-lg-bold text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            This action is irreversible. Please proceed with caution.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <Trash2 size={16} />
            {children}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isOpen}
        title={title}
        message={description}
        confirmText={confirmText}
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
        isLoading={isLoading}
      />
    </>
  );
}

export default DangerZone;