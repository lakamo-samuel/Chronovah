import type { Place } from "../type/PlaceType";

/**
 * Render a card displaying a Place's name and, when present, its location and country.
 *
 * @param item - The Place to display; `location` and `country` are rendered only if they are present.
 * @returns A JSX element representing the place card.
 */
export function PlacesCard({ item }: { item: Place }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {item.name}
      </h2>

      {item.location && (
        <p className="text-gray-600 dark:text-gray-400">{item.location}</p>
      )}

      {item.country && (
        <p className="text-gray-500 dark:text-gray-400">
          Country: {item.country}
        </p>
      )}
    </div>
  );
}
