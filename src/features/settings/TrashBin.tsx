import { useState, useEffect, useCallback } from 'react';
import { Trash2, RotateCcw, Loader } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import trashApiCall from '../../services/trash.service';
import type { TrashItem } from '../../services/trash.service';
import ConfirmationModal from '../../components/ConfirmationModal';
import { db } from '../../database/db';

type DataType = 'notes' | 'journal' | 'people' | 'places';

interface TrashTabItem extends TrashItem {
  type: DataType;
}

const TAB_LABELS: Record<DataType, string> = {
  notes: 'Notes',
  journal: 'Journal',
  people: 'People',
  places: 'Places',
};

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
        case 'notes':   items = await trashApiCall.getTrashNotes();   break;
        case 'journal': items = await trashApiCall.getTrashJournal(); break;
        case 'people':  items = await trashApiCall.getTrashPeople();  break;
        case 'places':  items = await trashApiCall.getTrashPlaces();  break;
      }
      setTrashItems(items.map(item => ({ ...item, type: activeTab })));
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { loadTrash(); }, [loadTrash]);

  const handleRestore = async () => {
    if (!confirmRestore) return;
    const { id, type } = confirmRestore;
    setRestoring(id);

    try {
      let response;
      switch (type) {
        case 'notes':   response = await trashApiCall.restoreNote(id);    break;
        case 'journal': response = await trashApiCall.restoreJournal(id); break;
        case 'people':  response = await trashApiCall.restorePerson(id);  break;
        case 'places':  response = await trashApiCall.restorePlace(id);   break;
      }

      if (response.success) {
        // Write the restored item back into Dexie so all useLiveQuery hooks
        // update immediately — no page refresh needed.
        const restoredItem = response.data as any;
        if (restoredItem) {
          switch (type) {
            case 'notes':   await db.notes.put(restoredItem);   break;
            case 'journal': await db.journal.put(restoredItem); break;
            case 'people':  await db.people.put(restoredItem);  break;
            case 'places':  await db.places.put(restoredItem);  break;
          }
        }

        const label = TAB_LABELS[type].slice(0, -1); // "Note", "Journal", etc.
        success(`${label} restored successfully`);
        // Refresh the trash list
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
      case 'notes':   return (item as any).title || 'Untitled Note';
      case 'journal': return (item as any).note?.substring(0, 50) + '…' || 'Untitled Entry';
      case 'people':  return (item as any).name || 'Unknown Person';
      case 'places':  return (item as any).name || 'Unknown Place';
    }
  };

  const getDeletedDate = (deletedAt: string): string =>
    new Date(deletedAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const tabs: DataType[] = ['notes', 'journal', 'people', 'places'];

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-5 lg:p-6 border border-default space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-primary mb-1">Trash Bin</h2>
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
            className={`whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-muted hover:text-primary'
            }`}
          >
            {TAB_LABELS[tab]}
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
            <Trash2 size={32} className="mx-auto text-muted mb-2 opacity-40" />
            <p className="text-sm text-muted">No deleted items</p>
          </div>
        ) : (
          trashItems.map(item => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-default rounded-xl border border-default"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-primary truncate text-sm sm:text-base">
                  {getItemTitle(item)}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Deleted: {getDeletedDate(item.deletedAt)}
                </p>
              </div>

              <button
                onClick={() => setConfirmRestore(item)}
                disabled={restoring === item.id}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium"
              >
                {restoring === item.id
                  ? <Loader size={14} className="animate-spin" />
                  : <RotateCcw size={14} />}
                Restore
              </button>
            </div>
          ))
        )}
      </div>

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
