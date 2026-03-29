import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../database/db";

import type { Person } from "../type/PeopleType";
import type { Place } from "../type/PlaceType";
import type { Note } from "../type/NoteType";
import type { JournalEntry } from "../type/JournalType";
import { JournalCard } from "./JournalCard";
import { NotesCard } from "./NoteCard";
import { PlacesCard } from "./PlaceCard";
import { PeopleCard } from "./PeopleCard";
import GoBackLink from "./GoBackLink";



// DB_MAP maps type to the appropriate DB collection
const DB_MAP = {
  people: db.people,
  places: db.places,
  notes: db.notes,
  journals: db.journal,
};

/**
 * Render a details view that loads and displays a single record determined by the current route.
 *
 * Reads `type` and `id` from the URL, fetches the matching record from the mapped database collection,
 * and renders a type-specific details card. Handles loading, error, and "not found" states and provides
 * navigation back controls.
 *
 * @returns The component's JSX element showing either a loading indicator, an error message, an item-not-found message, or the record details card.
 */
function ItemDetails() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<Person | Note | JournalEntry | Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadItem() {
      setLoading(true);
      setError(null);
      try {
        const table = DB_MAP[type as keyof typeof DB_MAP];
        if (!table) {
          throw new Error(`Invalid type: ${type}`);
        }
    const needsNumberId =
      type === "people" ||
      type === "places" ||
      type === "notes" ||
      type === "journals";

    const parsedId = needsNumberId ? Number(id) : id;

    // Get data from the table
    const tableData = DB_MAP[type as keyof typeof DB_MAP];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await (tableData as any).get(parsedId);

        if (isMounted) {
          setItem(data ?? null);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || "Unknown error");
          setItem(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadItem();

    return () => {
      isMounted = false;
    };
  }, [type, id]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400 dark:text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button className="mt-3 btn btn-sm" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
    } 
    console.log("working...");
console.log(item);
  // Fallback if item not found
  if (!item) {
    return (
      <div className="p-6 mt-20 text-center">
        <p className="text-gray-400 dark:text-gray-500">Item not found.</p>
        <button className="mt-3 btn btn-sm" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 mt-15">
     <GoBackLink/>

          <div className=" rounded-lg p-6 bg-white dark:bg-gray-900 shadow">
             <h1 className="text-2xl font-semibold text-gray-900 dark:text-white capitalize">
          {type} Details
             </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Created: {new Date(item.createdAt).toLocaleString()}
        </p>

        {/* Render by Type */}
        <>
        
        {type === "people" && (
          <PeopleCard item={item as Person} />
        )}

        {type === "places" && (
          <PlacesCard item={item as Place} />
        )}

        {type === "notes" && (
          <NotesCard item={item as Note} />
        )}

        {type === "journals" && (
          <JournalCard item={item as JournalEntry} />
          )}
          </>
      </div>
      </div>
 
  );
}

export default ItemDetails;
