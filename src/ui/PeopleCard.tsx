import type { Person } from "../type/PeopleType";

/**
 * Renders a styled card displaying a Person's name and any available description or relation.
 *
 * @param item - The `Person` to display in the card.
 * @returns A React element containing the person's name and, when present, their description and relation (shown as "Phone: {relation}").
 */
export function PeopleCard({ item }: { item: Person }) {
  return (
    <div className="space-y-3">
      <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
        {item.name}
      </p>

      {item.description && (
        <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
      )}

      {item.relation && (
        <p className="text-gray-500 dark:text-gray-400">Phone: {item.relation}</p>
      )}
    </div>
  );
}
