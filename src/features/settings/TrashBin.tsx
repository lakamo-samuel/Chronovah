import { useState, useEffect, useCallback } from 'react';
import { Trash2, RotateCcw, Loader } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import trashApiCall from '../../services/trash.service';
import type { TrashItem } from '../../services/trash.service';
import ConfirmationModal from '../../components/ConfirmationModal';

type DataType = 'notes' | 'journal' | 'people' | 'places';

interface TrashTabItem extends TrashItem {
  type: DataType;
}

export default function TrashBin() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<DataType>('notes');
  const [trashItems, setTrashItems] = useState<TrashTabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [confirmRestore, setConfirmRestore] = useState<TrashTabItem | null>(null);

  const loadTrash = useCallback(async () => {
    setLoading(true);
    try {
      let items: TrashItem[] = [];

      switch (activeTab) {
        case 'notes':
          items = await trashApiCall.getTrashNotes();
          break;
        case 'journal':
          items = await trashApiCall.getTrashJournal();
          break;
        case 'people':
          items = await trashApiCall.getTrashPeople();
          break;
        case 'places':
          items = await trashApiCall.getTrashPlaces();
          break;
      }

      setTrashItems(items.map(item => ({ ...item, type: activeTab })));
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadTrash();
  }, [loadTrash]);

  const handleRestore = async () => {
    if (!confirmRestore) return;

    setRestoring(confirmRestore.id);
    try {
      let response;
      const { id, type } = confirmRestore;

      switch (type) {
        case 'notes':
          response = await trashApiCall.restoreNote(id);
          break;
        case 'journal':
          response = await trashApiCall.restoreJournal(id);
          break;
        case 'people':
          response = await trashApiCall.restorePerson(id);
          break;
        case 'places':
          response = await trashApiCall.restorePlace(id);
          break;
      }

      if (response.success) {
        success(`${type === 'notes' ? 'Note' : type === 'journal' ? 'Journal entry' : type === 'people' ? 'Person' : 'Place'} restored successfully`);
        loadTrash();
      } else {
        error(response.error || 'Failed to restore');
      }
    } catch {
      error('Failed to restore item');
    } finally {
      setRestoring(null);
      setConfirmRestore(null);
    }
  };

  const getItemTitle = (item: TrashTabItem): string => {
    switch (item.type) {
      case 'notes':
        return item.title || 'Untitled Note';
      case 'journal':
        return item.note?.substring(0, 50) + '...' || 'Untitled Entry';
      case 'people':
        return item.name || 'Unknown Person';
      case 'places':
        return item.name || 'Unknown Place';
    }
  };

  const getDeletedDate = (deletedAt: string): string => {
    const date = new Date(deletedAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTabLabel = (type: DataType): string => {
    const labels = {
      notes: 'Notes',
      journal: 'Journal',
      people: 'People',
      places: 'Places',
    };
    const count = trashItems.filter(item => item.type === type).length;
    return `${labels[type]} ${count > 0 ? `(${count})` : ''}`;
  };

  const tabs: DataType[] = ['notes', 'journal', 'people', 'places'];

  return (
    <div className="bg-default mb-4 rounded-2xl p-4 sm:p-5 lg:p-6 shadow space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
          Trash Bin
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          Items in trash can be restored. Items are permanently deleted after 30 days.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 border-b border-default overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-primary-600 border-b-2 border-primary'
                : 'text-muted hover:text-primary'
            }`}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-2 sm:space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin text-muted" size={24} />
          </div>
        ) : trashItems.length === 0 ? (
          <div className="text-center py-8">
            <Trash2 size={32} className="mx-auto text-muted mb-2" />
            <p className="text-sm text-muted">No deleted items</p>
          </div>
        ) : (
          trashItems.map(item => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-card rounded-lg border border-default"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-primary truncate text-sm sm:text-base">
                  {getItemTitle(item)}
                </h3>
                <p className="text-xs text-muted mt-1">
                  Deleted: {getDeletedDate(item.deletedAt)}
                </p>
              </div>

              <button
                onClick={() => setConfirmRestore(item)}
                disabled={restoring === item.id}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium"
              >
                {restoring === item.id ? (
                  <Loader size={14} className="animate-spin" />
                ) : (
                  <RotateCcw size={14} />
                )}
                Restore
              </button>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmRestore !== null}
        title="Restore Item"
        message={`Restore "${getItemTitle(confirmRestore || {} as TrashTabItem)}"? It will be returned to your ${activeTab}.`}
        confirmText="Restore"
        cancelText="Cancel"
        isDangerous={false}
        onConfirm={handleRestore}
        onCancel={() => setConfirmRestore(null)}
        isLoading={restoring !== null}
      />
    </div>
  );
}
